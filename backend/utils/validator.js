/**
 * Utilidades de validación
 * Valida tipos de archivo, tamaños y formatos
 */

const logger = require('./logger');

/**
 * Valida que el archivo sea PDF, DOCX, TXT o CSV
 */
function validateFileType(file) {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',           // TXT
    'text/csv',             // CSV típico
    'application/vnd.ms-excel' // algunos CSV vienen con este mime
  ];
  
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.csv'];
  const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  
  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(fileExtension)) {
    logger.warn(`Tipo de archivo no permitido: ${file.mimetype} - ${file.originalname}`);
    return {
      valid: false,
      error: 'Solo se permiten archivos PDF, DOCX, TXT y CSV'
    };
  }
  
  return { valid: true };
}

/**
 * Valida el tamaño del archivo
 */
function validateFileSize(file) {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB por defecto
  
  if (file.size > maxSize) {
    logger.warn(`Archivo demasiado grande: ${file.size} bytes - ${file.originalname}`);
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo permitido (${maxSize / 1024 / 1024}MB)`
    };
  }
  
  return { valid: true };
}

/**
 * Sanitiza el nombre del archivo
 */
function sanitizeFilename(filename) {
  // Eliminar caracteres especiales y espacios
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Valida una pregunta del chat
 */
function validateQuestion(question) {
  if (!question || typeof question !== 'string') {
    return {
      valid: false,
      error: 'La pregunta debe ser un texto válido'
    };
  }
  
  const trimmedQuestion = question.trim();
  
  if (trimmedQuestion.length === 0) {
    return {
      valid: false,
      error: 'La pregunta no puede estar vacía'
    };
  }
  
  if (trimmedQuestion.length > 1000) {
    return {
      valid: false,
      error: 'La pregunta es demasiado larga (máximo 1000 caracteres)'
    };
  }
  
  return { valid: true, question: trimmedQuestion };
}

/**
 * Valida parámetros de configuración
 */
function validateConfig() {
  const errors = [];
  
  if (!process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY no está configurada');
  }
  
  if (!process.env.PORT) {
    logger.warn('PORT no configurado, usando 5000 por defecto');
  }
  
  const chunkSize = parseInt(process.env.CHUNK_SIZE);
  if (isNaN(chunkSize) || chunkSize < 100 || chunkSize > 5000) {
    logger.warn('CHUNK_SIZE inválido, usando 1000 por defecto');
  }
  
  const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP);
  if (isNaN(chunkOverlap) || chunkOverlap < 0 || chunkOverlap >= chunkSize) {
    logger.warn('CHUNK_OVERLAP inválido, usando 200 por defecto');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateFileType,
  validateFileSize,
  sanitizeFilename,
  validateQuestion,
  validateConfig
};
