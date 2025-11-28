# 🚀 Sistema RAG (Retrieval Augmented Generation)

Sistema completo de chat inteligente con capacidad de procesamiento de documentos PDF, DOCX, TXT y CSV.

## 📋 Características

- ✅ Chat estilo ChatGPT
- ✅ Subida de documentos PDF, DOCX, TXT y CSV
- ✅ Drag & Drop
- ✅ Procesamiento y vectorización de documentos
- ✅ Búsqueda semántica
- ✅ Respuestas con referencias
- ✅ Modo oscuro/claro
- ✅ Responsive design
- ✅ Manejo de errores robusto

## 🛠️ Stack Tecnológico

### Frontend
- React 18 + Vite
- TailwindCSS
- Axios
- React Icons

### Backend
- Node.js + Express
- OpenAI API (embeddings y chat)
- FAISS (vector store)
- PDF-Parse
- Mammoth (DOCX)
- Soporte para CSV y TXT
- Multer (file upload)

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- API Key de OpenAI

### 1️⃣ Clonar/Descargar el proyecto

```bash
cd C:\ClaudeProjects\Oky
```

### 2️⃣ Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 3️⃣ Configurar variables de entorno

Crear archivo `.env` en la carpeta `backend`:

```env
PORT=5000
OPENAI_API_KEY=tu_api_key_aqui
NODE_ENV=development
MAX_FILE_SIZE=10485760
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

### 4️⃣ Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

## 🚀 Ejecución

### Iniciar Backend (Puerto 5000)

```bash
cd backend
npm run dev
```

### Iniciar Frontend (Puerto 5173)

```bash
cd frontend
npm run dev
```

Acceder a: http://localhost:5173

## 📁 Estructura del Proyecto

```
Oky/
├── backend/
│   ├── routes/
│   │   ├── upload.routes.js      # Rutas de subida de archivos
│   │   └── chat.routes.js        # Rutas del chat
│   ├── services/
│   │   ├── document.service.js   # Procesamiento de documentos
│   │   ├── embedding.service.js  # Generación de embeddings
│   │   └── chat.service.js       # Lógica del chat
│   ├── utils/
│   │   ├── logger.js             # Sistema de logs
│   │   └── validator.js          # Validaciones
│   ├── vectorstore/
│   │   └── faiss.service.js      # Gestión del vector store
│   ├── uploads/                  # Archivos subidos
│   ├── server.js                 # Servidor principal
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx          # Componente del chat
│   │   │   ├── FileUpload.jsx    # Componente de subida
│   │   │   └── DocumentList.jsx  # Lista de documentos
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎯 Uso del Sistema

1. **Subir Documentos**
   - Arrastra archivos PDF o DOCX
   - O usa el botón "Subir Documentos"
   - Espera a que se procesen

2. **Hacer Preguntas**
   - Escribe tu pregunta en el chat
   - El sistema buscará en los documentos
   - Recibirás una respuesta con referencias

3. **Ver Documentos**
   - Lista de documentos cargados
   - Estado de procesamiento
   - Opción para eliminar

## 🔧 Configuración Avanzada

### Ajustar Tamaño de Chunks

En `backend/.env`:
```env
CHUNK_SIZE=1000        # Tamaño del chunk en caracteres
CHUNK_OVERLAP=200      # Superposición entre chunks
```

### Cambiar Modelo de OpenAI

En `backend/services/chat.service.js`:
```javascript
model: 'gpt-4'  // o 'gpt-3.5-turbo'
```

### Cambiar Modelo de Embeddings

En `backend/services/embedding.service.js`:
```javascript
model: 'text-embedding-3-small'  // o 'text-embedding-ada-002'
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Error: "OpenAI API Key not found"
Verifica que `.env` tenga la API key correcta

### Puerto en uso
Cambia el puerto en `backend/.env`:
```env
PORT=3001
```

### Archivos no se suben
Verifica permisos en la carpeta `backend/uploads/`

## 📊 Ejemplo de Uso

1. Sube un PDF sobre "Inteligencia Artificial"
2. Pregunta: "¿Qué es el aprendizaje profundo?"
3. El sistema responderá basándose en el contenido del PDF
4. Incluirá referencias al documento original

## 🔒 Seguridad

- ✅ Validación de tipos de archivo
- ✅ Límite de tamaño de archivos
- ✅ Sanitización de nombres
- ✅ CORS configurado
- ✅ Rate limiting recomendado para producción

## 📝 Licencia

MIT License

## 👨‍💻 Soporte

Para problemas o preguntas, crea un issue en el repositorio.

---

**¡Sistema listo para usar! 🎉**
