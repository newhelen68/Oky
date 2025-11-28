/**
 * Rutas para el chat y consultas
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { validateQuestion } = require('../utils/validator');
const { processQuestion } = require('../services/chat.service');

/**
 * POST /api/chat
 * Procesa una pregunta y devuelve respuesta
 */
router.post('/', async (req, res) => {
  try {
    const { question, history } = req.body;

    // Validar pregunta
    const validation = validateQuestion(question);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    logger.info(`Nueva pregunta recibida: "${validation.question}"`);

    // Procesar pregunta
    const result = await processQuestion(validation.question, history || []);

    res.json({
      success: true,
      question: validation.question,
      answer: result.answer,
      sources: result.sources,
      metadata: {
        tokensUsed: result.tokensUsed,
        model: result.model,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error(`Error al procesar pregunta: ${error.message}`);
    
    res.status(500).json({
      error: 'Error al procesar la pregunta',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/test
 * Endpoint de prueba
 */
router.get('/test', (req, res) => {
  res.json({
    message: 'Chat endpoint funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
