/**
 * Servicio de generación de embeddings
 * Utiliza OpenAI para convertir texto en vectores
 */

const OpenAI = require('openai');
const logger = require('../utils/logger');

// Inicializar cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Genera embeddings para un texto usando OpenAI
 */
async function generateEmbedding(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('El texto no puede estar vacío');
    }
    
    // Limitar longitud del texto (OpenAI tiene límites)
    const maxLength = 8000;
    const truncatedText = text.slice(0, maxLength);
    
    logger.debug(`Generando embedding para texto de ${truncatedText.length} caracteres`);
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // Modelo más económico y rápido
      input: truncatedText,
      encoding_format: 'float'
    });
    
    const embedding = response.data[0].embedding;
    
    logger.debug(`Embedding generado: ${embedding.length} dimensiones`);
    
    return embedding;
  } catch (error) {
    logger.error(`Error al generar embedding: ${error.message}`);
    
    if (error.status === 401) {
      throw new Error('API Key de OpenAI inválida');
    } else if (error.status === 429) {
      throw new Error('Límite de rate de OpenAI excedido, intenta más tarde');
    } else {
      throw new Error(`Error al generar embedding: ${error.message}`);
    }
  }
}

/**
 * Genera embeddings para múltiples textos (chunks)
 */
async function generateEmbeddings(texts) {
  try {
    logger.info(`Generando embeddings para ${texts.length} textos`);
    
    const embeddings = [];
    
    // Procesar en lotes para evitar rate limits
    const batchSize = 20;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      logger.debug(`Procesando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
      
      const batchPromises = batch.map(text => generateEmbedding(text));
      const batchEmbeddings = await Promise.all(batchPromises);
      
      embeddings.push(...batchEmbeddings);
      
      // Pequeña pausa entre lotes para evitar rate limits
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    logger.info(`${embeddings.length} embeddings generados exitosamente`);
    
    return embeddings;
  } catch (error) {
    logger.error(`Error al generar embeddings múltiples: ${error.message}`);
    throw error;
  }
}

/**
 * Calcula la similitud coseno entre dos vectores
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Los vectores deben tener la misma dimensión');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (normA * normB);
}

module.exports = {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity
};
