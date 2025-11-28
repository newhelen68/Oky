/**
 * Servicio de Chat
 * Gestiona las conversaciones y genera respuestas usando RAG
 */

const OpenAI = require('openai');
const logger = require('../utils/logger');
const { generateEmbedding } = require('./embedding.service');
const { getVectorStore } = require('../vectorstore/faiss.service');

// Inicializar cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Procesa una pregunta y genera una respuesta usando RAG
 */
async function processQuestion(question, conversationHistory = []) {
  try {
    logger.info(`Procesando pregunta: "${question}"`);

    // Obtener vector store
    const vectorStore = getVectorStore();
    await vectorStore.initialize();

    // Verificar si hay documentos
    if (vectorStore.documents.length === 0) {
      return {
        answer: 'No hay documentos cargados en el sistema. Por favor, sube algunos documentos primero para poder responder tus preguntas.',
        sources: [],
        noDocuments: true
      };
    }

    // Generar embedding de la pregunta
    logger.debug('Generando embedding de la pregunta');
    const questionEmbedding = await generateEmbedding(question);

    // Buscar chunks relevantes
    logger.debug('Buscando chunks relevantes');
    const relevantChunks = await vectorStore.search(questionEmbedding, 5);

    if (relevantChunks.length === 0) {
      return {
        answer: 'No encontré información relevante en los documentos cargados para responder tu pregunta.',
        sources: [],
        noRelevantInfo: true
      };
    }

    logger.info(`Encontrados ${relevantChunks.length} chunks relevantes`);

    // Construir contexto
    const context = relevantChunks
      .map((chunk, index) => `[Documento ${index + 1}: ${chunk.filename}]\n${chunk.text}`)
      .join('\n\n---\n\n');

    // Construir mensajes para el chat
    const messages = [
      {
        role: 'system',
        content: `Eres un asistente útil que responde preguntas basándose ÚNICAMENTE en los documentos proporcionados.

INSTRUCCIONES IMPORTANTES:
- Responde SOLO con información que esté en los documentos proporcionados
- Si la información no está en los documentos, di claramente que no tienes esa información
- Cita las fuentes usando el formato [Documento X]
- Sé preciso y conciso
- Si hay múltiples perspectivas en los documentos, menciónalas
- Nunca inventes información que no esté en el contexto

CONTEXTO DE LOS DOCUMENTOS:
${context}`
      }
    ];

    // Agregar historial de conversación (últimos 5 mensajes)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      messages.push(...recentHistory);
    }

    // Agregar pregunta actual
    messages.push({
      role: 'user',
      content: question
    });

    // Generar respuesta con OpenAI
    logger.debug('Generando respuesta con GPT');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Más económico y rápido
      messages: messages,
      temperature: 0.3, // Más determinista para respuestas basadas en hechos
      max_tokens: 1000
    });

    const answer = completion.choices[0].message.content;

    // Preparar información de las fuentes
    const sources = relevantChunks.map(chunk => ({
      filename: chunk.filename,
      text: chunk.text.substring(0, 200) + '...', // Previsualización
      similarity: chunk.similarity,
      chunkIndex: chunk.chunkIndex
    }));

    logger.info('Respuesta generada exitosamente');

    return {
      answer,
      sources,
      tokensUsed: completion.usage.total_tokens,
      model: completion.model
    };

  } catch (error) {
    logger.error(`Error al procesar pregunta: ${error.message}`);
    
    if (error.status === 401) {
      throw new Error('Error de autenticación con OpenAI. Verifica tu API key.');
    } else if (error.status === 429) {
      throw new Error('Límite de rate de OpenAI excedido. Intenta más tarde.');
    } else if (error.status === 500) {
      throw new Error('Error del servidor de OpenAI. Intenta más tarde.');
    } else {
      throw new Error(`Error al generar respuesta: ${error.message}`);
    }
  }
}

/**
 * Genera una respuesta en streaming (para implementación futura)
 */
async function processQuestionStream(question, conversationHistory = []) {
  // Implementación similar pero con streaming
  // Por ahora retornamos la función normal
  return processQuestion(question, conversationHistory);
}

module.exports = {
  processQuestion,
  processQuestionStream
};
