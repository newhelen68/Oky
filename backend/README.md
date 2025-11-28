# Backend - Sistema RAG

API REST para el procesamiento de documentos y chat inteligente.

## 🚀 Instalación Rápida

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env y agregar tu OPENAI_API_KEY

# Iniciar servidor en modo desarrollo
npm run dev
```

## 📡 Endpoints Disponibles

### Health Check
```
GET /api/health
```

### Upload de Documentos
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (PDF o DOCX)
```

### Listar Documentos
```
GET /api/upload/documents
```

### Eliminar Documento
```
DELETE /api/upload/documents/:id
```

### Eliminar Todos
```
DELETE /api/upload/all
```

### Chat
```
POST /api/chat
Content-Type: application/json
Body: {
  "question": "tu pregunta",
  "history": [] // opcional
}
```

## 🔧 Configuración

Variables de entorno en `.env`:

```env
PORT=5000
OPENAI_API_KEY=sk-...
NODE_ENV=development
MAX_FILE_SIZE=10485760
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

## 📁 Estructura

```
backend/
├── routes/          # Rutas de la API
├── services/        # Lógica de negocio
├── utils/           # Utilidades
├── vectorstore/     # Gestión de vectores
├── uploads/         # Archivos subidos
├── logs/           # Logs del sistema
└── server.js       # Punto de entrada
```

## 🧪 Pruebas

```bash
# Health check
curl http://localhost:5000/api/health

# Subir documento
curl -X POST http://localhost:5000/api/upload \
  -F "file=@documento.pdf"

# Hacer pregunta
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "¿De qué trata el documento?"}'
```

## 📊 Logs

Los logs se guardan en:
- `logs/error.log` - Solo errores
- `logs/combined.log` - Todos los logs

## 🐛 Troubleshooting

**Error: Cannot find module**
```bash
npm install
```

**Error: OPENAI_API_KEY not found**
- Verifica que `.env` existe y tiene la key

**Error: EACCES al crear directorio**
- Verifica permisos de la carpeta uploads/
