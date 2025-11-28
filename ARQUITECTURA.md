# 🏗️ Arquitectura Técnica - Sistema RAG

## 📐 Visión General

Este documento describe la arquitectura técnica del sistema RAG (Retrieval Augmented Generation).

---

## 🎯 Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       │ 1. Sube documento
       │
┌──────▼──────────────────────────────────────────────┐
│                    Frontend                          │
│  ┌────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ FileUpload │  │   Chat   │  │ DocumentList  │  │
│  └────────────┘  └──────────┘  └───────────────┘  │
└──────┬───────────────────┬──────────────────────────┘
       │                   │
       │ 2. POST /upload   │ 4. POST /chat
       │                   │
┌──────▼───────────────────▼──────────────────────────┐
│                    Backend API                       │
│                                                      │
│  ┌─────────────┐         ┌──────────────┐          │
│  │   Upload    │         │     Chat     │          │
│  │   Routes    │         │    Routes    │          │
│  └──────┬──────┘         └──────┬───────┘          │
│         │                       │                   │
│         │ 3. Process           │ 5. Search         │
│         │                       │                   │
│  ┌──────▼──────┐         ┌──────▼───────┐          │
│  │  Document   │         │   Embedding  │          │
│  │   Service   │         │   Service    │          │
│  └──────┬──────┘         └──────┬───────┘          │
│         │                       │                   │
│         │ Chunks               │ Vectors           │
│         │                       │                   │
│  ┌──────▼───────────────────────▼───────┐          │
│  │         Vector Store (FAISS)         │          │
│  └──────────────────────────────────────┘          │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ 6. Generate
                   │
            ┌──────▼──────┐
            │   OpenAI    │
            │     API     │
            └─────────────┘
```

---

## 🔧 Componentes Principales

### 1. Frontend (React + Vite)

#### 1.1 Estructura
```
frontend/src/
├── components/
│   ├── Chat.jsx              # Interfaz de chat
│   ├── FileUpload.jsx        # Subida de archivos
│   └── DocumentList.jsx      # Lista de documentos
├── App.jsx                   # Componente raíz
└── main.jsx                  # Punto de entrada
```

#### 1.2 Tecnologías
- **React 18**: Framework UI
- **Vite**: Build tool (HMR, ES modules)
- **Tailwind CSS**: Utility-first CSS
- **Axios**: HTTP client
- **React Icons**: Iconografía

#### 1.3 Características
- SPA (Single Page Application)
- Estado local con React Hooks
- Responsive design (mobile-first)
- Dark mode con localStorage
- Animaciones CSS

---

### 2. Backend (Node.js + Express)

#### 2.1 Estructura
```
backend/
├── routes/
│   ├── upload.routes.js      # Endpoints de upload
│   └── chat.routes.js        # Endpoints de chat
├── services/
│   ├── document.service.js   # Procesamiento docs
│   ├── embedding.service.js  # Generación embeddings
│   └── chat.service.js       # Lógica RAG
├── utils/
│   ├── logger.js            # Sistema de logs
│   └── validator.js         # Validaciones
├── vectorstore/
│   └── faiss.service.js     # Gestión vectores
└── server.js                # Servidor Express
```

#### 2.2 Tecnologías
- **Express**: Framework web
- **Multer**: Upload de archivos
- **PDF-Parse**: Extracción de PDFs
- **Mammoth**: Extracción de DOCX
- **OpenAI SDK**: API client
- **FAISS-Node**: Vector store
- **Winston**: Logging

#### 2.3 Middlewares
```javascript
// Seguridad
- helmet (headers de seguridad)
- cors (cross-origin)
- rate-limit (límite de peticiones)

// Parseo
- express.json()
- express.urlencoded()

// Custom
- logger middleware
- error handler
```

---

## 📊 Procesamiento de Documentos

### Pipeline Completo

```
PDF/DOCX Input
      │
      ▼
┌─────────────────┐
│   Validación    │  ← validateFileType()
│                 │  ← validateFileSize()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Extracción    │  ← extractTextFromPDF()
│     de Texto    │  ← extractTextFromDOCX()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Limpieza     │  ← cleanText()
│                 │     - Espacios
│                 │     - Caracteres especiales
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Chunking     │  ← splitIntoChunks()
│                 │     - CHUNK_SIZE: 1000
│                 │     - OVERLAP: 200
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Embeddings    │  ← generateEmbeddings()
│   (OpenAI API)  │     - text-embedding-3-small
│                 │     - Batch processing
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Indexación    │  ← FAISSVectorStore.add()
│     (FAISS)     │     - L2 Distance
└─────────────────┘
```

### Algoritmo de Chunking

```javascript
function splitIntoChunks(text, size=1000, overlap=200) {
  chunks = []
  start = 0
  
  while (start < text.length) {
    end = start + size
    
    // Buscar final de oración
    if (end < text.length) {
      sentenceEnd = findSentenceEnd(text, end)
      if (sentenceEnd > start + size/2) {
        end = sentenceEnd
      }
    }
    
    chunks.push(text[start:end])
    start = end - overlap  // Superposición
  }
  
  return chunks
}
```

**Ventajas del overlap:**
- Evita perder contexto entre chunks
- Mejora la recuperación de información
- Reduce falsos negativos

---

## 🔍 Sistema RAG

### Flujo de Consulta

```
Pregunta del Usuario
      │
      ▼
┌──────────────────┐
│  Validación      │  ← validateQuestion()
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Embedding de    │  ← generateEmbedding()
│   la Pregunta    │     (OpenAI API)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Búsqueda en     │  ← vectorStore.search()
│   Vector Store   │     - K = 5 chunks
│     (FAISS)      │     - L2 Distance
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Recuperación    │  ← Top K chunks
│   de Chunks      │     + metadata
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Construcción    │  ← Contexto enriquecido
│   de Prompt      │     + historia
│                  │     + instrucciones
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Generación      │  ← openai.chat.create()
│    (GPT-4)       │     - model: gpt-4o-mini
│                  │     - temperature: 0.3
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Respuesta     │  ← + Fuentes
│      Final       │    + Metadata
└──────────────────┘
```

### Prompt Engineering

```javascript
const systemPrompt = `
Eres un asistente útil que responde ÚNICAMENTE 
basándose en los documentos proporcionados.

INSTRUCCIONES:
1. Responde solo con info de los documentos
2. Cita las fuentes [Documento X]
3. Si no sabes, di que no tienes esa info
4. Sé preciso y conciso

CONTEXTO:
${chunks_relevantes}
`
```

---

## 💾 Vector Store (FAISS)

### Características

**FAISS (Facebook AI Similarity Search)**
- Búsqueda de similitud eficiente
- Escalable a millones de vectores
- Múltiples tipos de índices
- In-memory o disk-based

### Índice Usado: IndexFlatL2

**Propiedades:**
- **Tipo:** Fuerza bruta
- **Métrica:** Distancia L2 (Euclidiana)
- **Precisión:** 100% (búsqueda exacta)
- **Velocidad:** O(n) - lineal
- **Memoria:** Almacena todos los vectores

**Fórmula L2:**
```
distance(a, b) = √(Σ(ai - bi)²)
```

**Conversión a similitud:**
```javascript
similarity = 1 / (1 + distance)
```

### Persistencia

```javascript
// Estructura de datos guardada
{
  documents: [
    {
      id: "uuid_chunk_index",
      documentId: "uuid",
      chunkIndex: 0,
      text: "contenido...",
      filename: "documento.pdf",
      addedAt: "2024-01-01T00:00:00Z"
    }
  ],
  dimension: 1536,
  savedAt: "2024-01-01T00:00:00Z"
}
```

---

## 🔐 Seguridad

### Medidas Implementadas

#### 1. Validación de Entrada
```javascript
// Tipo de archivo
allowedTypes = ['application/pdf', '.docx']

// Tamaño
maxSize = 10MB

// Contenido
sanitizeFilename()
validateQuestion()
```

#### 2. Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100                    // 100 requests
})
```

#### 3. Headers de Seguridad (Helmet)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

#### 4. CORS
```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

---

## 📈 Performance

### Optimizaciones

#### Backend
1. **Batch Processing de Embeddings**
   ```javascript
   batchSize = 20  // Procesar 20 chunks a la vez
   delay = 500ms   // Pausa entre lotes
   ```

2. **Caché de Resultados**
   - Vector store en memoria
   - Resultados recientes en RAM

3. **Streaming de Respuestas** (futuro)
   ```javascript
   stream: true  // Respuestas incrementales
   ```

#### Frontend
1. **Code Splitting**
   - Carga lazy de componentes
   - Chunks optimizados

2. **Memoization**
   ```javascript
   useMemo()  // Para cálculos costosos
   useCallback()  // Para callbacks
   ```

3. **Virtualización** (futuro)
   - Para listas largas de mensajes

---

## 🔄 Escalabilidad

### Limitaciones Actuales

| Recurso | Límite | Solución Futura |
|---------|--------|-----------------|
| Documentos | ~100 | Índice HNSW |
| Chunks | ~1000 | Índice IVF |
| Usuarios | 1 | Multi-tenancy |
| Storage | In-memory | PostgreSQL + pgvector |

### Plan de Escalamiento

#### Fase 1: Local (Actual)
- FAISS in-memory
- Single user
- Sin persistencia de vectores

#### Fase 2: Multi-user
- PostgreSQL para metadata
- Autenticación (JWT)
- Rate limiting por usuario

#### Fase 3: Cloud
- Vector DB (Pinecone/Weaviate)
- Caché distribuido (Redis)
- Load balancing

#### Fase 4: Enterprise
- Microservicios
- Kubernetes
- Observabilidad (Grafana/Prometheus)

---

## 🧪 Testing

### Estrategia (Recomendada)

#### Backend
```javascript
// Unit tests
- document.service.test.js
- embedding.service.test.js
- chat.service.test.js

// Integration tests
- upload.routes.test.js
- chat.routes.test.js

// E2E tests
- full-flow.test.js
```

#### Frontend
```javascript
// Component tests
- Chat.test.jsx
- FileUpload.test.jsx
- DocumentList.test.jsx

// Integration tests
- App.test.jsx
```

---

## 📊 Monitoreo

### Métricas Clave

#### Backend
```javascript
// Performance
- Tiempo de procesamiento por documento
- Tiempo de respuesta de queries
- Latencia de OpenAI API

// Recursos
- Uso de memoria (Vector Store)
- CPU usage
- Disk I/O

// Negocio
- Documentos procesados
- Queries realizadas
- Tokens consumidos (OpenAI)
```

#### Frontend
```javascript
// Performance
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

// UX
- Upload success rate
- Query success rate
- Error rate
```

---

## 🔮 Roadmap Técnico

### Corto Plazo (1-3 meses)
- [ ] Tests unitarios completos
- [ ] Caché de embeddings
- [ ] Compresión de PDFs grandes
- [ ] Streaming de respuestas

### Mediano Plazo (3-6 meses)
- [ ] Autenticación de usuarios
- [ ] Multi-tenancy
- [ ] PostgreSQL + pgvector
- [ ] API pública

### Largo Plazo (6-12 meses)
- [ ] Microservicios
- [ ] Vector DB cloud (Pinecone)
- [ ] ML para ranking de resultados
- [ ] Soporte para más formatos

---

## 📚 Referencias

### Tecnologías
- [OpenAI API](https://platform.openai.com/docs)
- [FAISS](https://github.com/facebookresearch/faiss)
- [React](https://react.dev)
- [Express](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

### Conceptos
- [RAG (Retrieval Augmented Generation)](https://arxiv.org/abs/2005.11401)
- [Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Vector Search](https://www.pinecone.io/learn/vector-search/)
- [Chunking Strategies](https://www.pinecone.io/learn/chunking-strategies/)

---

**Documento actualizado:** 2024
**Versión:** 1.0.0
