/**
 * Servidor principal del sistema RAG
 * Maneja la configuración de Express, middlewares y rutas
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('./utils/logger');

const uploadRoutes = require('./routes/upload.routes');
const chatRoutes = require('./routes/chat.routes');
console.log('Tipo de uploadRoutes:', typeof uploadRoutes);
console.log('Tipo de chatRoutes:', typeof chatRoutes);
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
});

app.use('/api/', limiter);

// CORS - permitir peticiones desde el frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tu-dominio.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging de peticiones
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor RAG funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor RAG iniciado en puerto ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
  
  // Verificar configuración
  if (!process.env.OPENAI_API_KEY) {
    logger.warn('⚠️  ADVERTENCIA: OPENAI_API_KEY no configurada');
  }
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

module.exports = app;
