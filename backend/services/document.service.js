/**
 * Servicio de procesamiento de documentos
 * Convierte PDF y DOCX a texto y divide en chunks
 */

const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const logger = require('../utils/logger');

/**
 * Extrae texto de un archivo PDF
 */
async function extractTextFromPDF(filePath) {
  try {
    logger.info(`Extrayendo texto de PDF: ${filePath}`);
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    logger.info(`PDF procesado: ${data.numpages} páginas, ${data.text.length} caracteres`);
    return data.text;
  } catch (error) {
    logger.error(`Error al extraer texto de PDF: ${error.message}`);
    throw new Error(`Error al procesar PDF: ${error.message}`);
  }
}

/**
 * Extrae texto de un archivo DOCX
 */
async function extractTextFromDOCX(filePath) {
  try {
    logger.info(`Extrayendo texto de DOCX: ${filePath}`);
    const dataBuffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    
    logger.info(`DOCX procesado: ${result.value.length} caracteres`);
    return result.value;
  } catch (error) {
    logger.error(`Error al extraer texto de DOCX: ${error.message}`);
    throw new Error(`Error al procesar DOCX: ${error.message}`);
  }
}

/**
 * Limpia el texto extraído
 */
function cleanText(text) {
  if (!text) return '';
  
  return text
    // Eliminar múltiples espacios en blanco
    .replace(/\s+/g, ' ')
    // Eliminar espacios al inicio y final de líneas
    .replace(/^\s+|\s+$/gm, '')
    // Eliminar múltiples saltos de línea
    .replace(/\n{3,}/g, '\n\n')
    // Eliminar caracteres de control
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Divide el texto en chunks con superposición
 */
function splitIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let startIndex = 0;
  
  // Si el texto es más corto que el chunk, retornar el texto completo
  if (text.length <= chunkSize) {
    return [text];
  }
  
  while (startIndex < text.length) {
    // Determinar el final del chunk
    let endIndex = startIndex + chunkSize;
    
    // Si no es el último chunk, buscar el final de una oración
    if (endIndex < text.length) {
      // Buscar el último punto, signo de interrogación o exclamación
      const lastPeriod = text.lastIndexOf('.', endIndex);
      const lastQuestion = text.lastIndexOf('?', endIndex);
      const lastExclamation = text.lastIndexOf('!', endIndex);
      
      const sentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
      
      // Si encontramos un final de oración razonable, usarlo
      if (sentenceEnd > startIndex + (chunkSize * 0.5)) {
        endIndex = sentenceEnd + 1;
      }
    } else {
      endIndex = text.length;
    }
    
    // Extraer el chunk
    const chunk = text.slice(startIndex, endIndex).trim();
    
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    
    // Mover el índice con superposición
    startIndex = endIndex - overlap;
    
    // Si estamos muy cerca del final, terminar
    if (startIndex + overlap >= text.length) {
      break;
    }
  }
  
  logger.info(`Texto dividido en ${chunks.length} chunks`);
  return chunks;
}

/**
 * Procesa un documento completo
 */
async function processDocument(filePath, filename) {
  try {
    logger.info(`Iniciando procesamiento de documento: ${filename}`);
    
    // Determinar tipo de archivo
    const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    let text = '';
    
    // Extraer texto según el tipo
    if (extension === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (extension === '.docx') {
      text = await extractTextFromDOCX(filePath);
    } else {
      throw new Error('Tipo de archivo no soportado');
    }
    
    // Limpiar texto
    const cleanedText = cleanText(text);
    
    if (!cleanedText || cleanedText.length < 10) {
      throw new Error('El documento no contiene texto suficiente');
    }
    
    // Dividir en chunks
    const chunkSize = parseInt(process.env.CHUNK_SIZE) || 1000;
    const overlap = parseInt(process.env.CHUNK_OVERLAP) || 200;
    const chunks = splitIntoChunks(cleanedText, chunkSize, overlap);
    
    logger.info(`Documento procesado exitosamente: ${chunks.length} chunks generados`);
    
    return {
      text: cleanedText,
      chunks,
      metadata: {
        filename,
        chunkCount: chunks.length,
        totalCharacters: cleanedText.length,
        chunkSize,
        overlap
      }
    };
  } catch (error) {
    logger.error(`Error al procesar documento ${filename}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  extractTextFromPDF,
  extractTextFromDOCX,
  cleanText,
  splitIntoChunks,
  processDocument
};
