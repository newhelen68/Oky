/**
 * Rutas para la subida y gestión de archivos
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const logger = require('../utils/logger');
const { validateFileType, validateFileSize, sanitizeFilename } = require('../utils/validator');
const { processDocument } = require('../services/document.service');
const { generateEmbeddings } = require('../services/embedding.service');
const { getVectorStore } = require('../vectorstore/faiss.service');

// Configurar Multer para subida de archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');

    // Crear directorio si no existe
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}_${sanitizeFilename(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const validation = validateFileType(file);

    if (!validation.valid) {
      cb(new Error(validation.error), false);
    } else {
      cb(null, true);
    }
  }
});

/**
 * POST /api/upload
 * Sube y procesa un documento
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    logger.info(`Archivo subido: ${req.file.originalname}`);

    // Validar tamaño adicional
    const sizeValidation = validateFileSize(req.file);
    if (!sizeValidation.valid) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: sizeValidation.error });
    }

    // Procesar documento
    logger.info('Iniciando procesamiento del documento...');
    const processed = await processDocument(req.file.path, req.file.originalname);

    // Generar embeddings
    logger.info('Generando embeddings...');
    const embeddings = await generateEmbeddings(processed.chunks);

    // Agregar al vector store
    logger.info('Agregando al vector store...');
    const vectorStore = getVectorStore();
    await vectorStore.initialize();

    const result = await vectorStore.addDocuments(
      processed.chunks,
      embeddings,
      {
        filename: req.file.originalname,
        uploadedAt: new Date().toISOString()
      }
    );

    logger.info(`Documento procesado exitosamente: ${req.file.originalname}`);

    res.json({
      success: true,
      message: 'Documento procesado exitosamente',
      document: {
        id: result.documentId,
        filename: req.file.originalname,
        chunks: result.chunksAdded,
        size: req.file.size,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error(`Error al procesar archivo: ${error.message}`);

    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error(`Error al eliminar archivo: ${unlinkError.message}`);
      }
    }

    res.status(500).json({
      error: 'Error al procesar el documento',
      details: error.message
    });
  }
});

/**
 * GET /api/upload/documents
 * Lista todos los documentos cargados
 */
router.get('/documents', async (req, res) => {
  try {
    const vectorStore = getVectorStore();
    await vectorStore.initialize();

    const documents = vectorStore.getDocumentsList();
    const stats = vectorStore.getStats();

    res.json({
      documents,
      stats
    });

  } catch (error) {
    logger.error(`Error al obtener documentos: ${error.message}`);
    res.status(500).json({
      error: 'Error al obtener la lista de documentos',
      details: error.message
    });
  }
});

/**
 * DELETE /api/upload/documents/:id
 * Elimina un documento
 */
router.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vectorStore = getVectorStore();
    await vectorStore.initialize();

    const result = await vectorStore.deleteDocument(id);

    logger.info(`Documento eliminado: ${id}`);

    res.json({
      success: true,
      message: 'Documento eliminado exitosamente',
      deletedChunks: result.deletedCount
    });

  } catch (error) {
    logger.error(`Error al eliminar documento: ${error.message}`);
    res.status(500).json({
      error: 'Error al eliminar el documento',
      details: error.message
    });
  }
});

/**
 * DELETE /api/upload/all
 * Elimina todos los documentos
 */
router.delete('/all', async (req, res) => {
  try {
    const vectorStore = getVectorStore();
    await vectorStore.initialize();

    await vectorStore.clear();

    // eliminar archivos físicos
    const uploadDir = path.join(__dirname, '../uploads');
    const files = await fs.readdir(uploadDir).catch(() => []);

    for (const file of files) {
      await fs.unlink(path.join(uploadDir, file));
    }

    logger.info('Todos los documentos eliminados');

    res.json({
      success: true,
      message: 'Todos los documentos eliminados exitosamente'
    });

  } catch (error) {
    logger.error(`Error al eliminar todos los documentos: ${error.message}`);
    res.status(500).json({
      error: 'Error al eliminar documentos',
      details: error.message
    });
  }
});

module.exports = router;
