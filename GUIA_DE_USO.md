# 🎯 Guía de Uso - Sistema RAG

## 📋 Tabla de Contenidos
1. [Primeros Pasos](#primeros-pasos)
2. [Subir Documentos](#subir-documentos)
3. [Hacer Preguntas](#hacer-preguntas)
4. [Mejores Prácticas](#mejores-prácticas)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Primeros Pasos

### 1. Instalación

```bash
# Ejecutar instalador
install.bat

# Configurar API Key
# Editar backend\.env y agregar:
OPENAI_API_KEY=tu_api_key_aqui
```

### 2. Iniciar Sistema

```bash
# Ejecutar script de inicio
start.bat

# O manualmente:
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### 3. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

---

## 📤 Subir Documentos

### Métodos de Subida

**Método 1: Drag & Drop**
1. Arrastra un archivo PDF o DOCX
2. Suéltalo en la zona de carga
3. Espera a que se procese

**Método 2: Botón de Subida**
1. Haz clic en "Haz clic para subir"
2. Selecciona tu archivo
3. Haz clic en "Subir y Procesar"

### Requisitos de Archivos

- ✅ **Formatos aceptados:** PDF, DOCX
- ✅ **Tamaño máximo:** 10MB
- ✅ **Contenido:** Debe tener texto extraíble
- ❌ **No aceptado:** Imágenes escaneadas sin OCR

### Proceso de Carga

1. **Validación** (instantánea)
   - Verifica tipo y tamaño
   
2. **Extracción** (5-15 segundos)
   - Convierte PDF/DOCX a texto
   
3. **Chunking** (2-5 segundos)
   - Divide el texto en fragmentos
   
4. **Embeddings** (10-30 segundos)
   - Genera vectores con OpenAI
   
5. **Indexación** (1-2 segundos)
   - Guarda en base vectorial

**Tiempo total:** ~20-50 segundos por documento

---

## 💬 Hacer Preguntas

### Tipos de Preguntas

#### ✅ Preguntas Efectivas

**Preguntas específicas:**
```
❓ "¿Cuál es el presupuesto del proyecto para el Q2?"
❓ "¿Qué metodología se recomienda en el documento?"
❓ "¿Cuáles son los riesgos identificados?"
```

**Preguntas de comparación:**
```
❓ "¿Cuál es la diferencia entre el modelo A y B?"
❓ "Compara las propuestas de los capítulos 2 y 3"
```

**Preguntas de resumen:**
```
❓ "Resume los puntos principales del documento"
❓ "¿Cuáles son las conclusiones clave?"
```

#### ❌ Preguntas Inefectivas

```
❌ "Cuéntame todo" (muy amplio)
❌ "¿Qué dice el documento?" (muy genérico)
❌ "Dame información" (sin contexto)
```

### Entender las Respuestas

Cada respuesta incluye:

1. **Respuesta Principal**
   - Generada por GPT basándose en los documentos

2. **Fuentes**
   - Muestra los chunks relevantes
   - Porcentaje de similitud
   - Nombre del documento original

3. **Metadata**
   - Tokens usados
   - Modelo utilizado
   - Timestamp

---

## 🎯 Mejores Prácticas

### Para Mejores Resultados

#### 1. Preparación de Documentos

- ✅ Usa PDFs con texto seleccionable
- ✅ Asegúrate de que el texto esté bien formateado
- ✅ Evita documentos con solo imágenes
- ✅ Combina documentos relacionados en un solo PDF si es posible

#### 2. Formulación de Preguntas

**DO:**
- ✅ Sé específico en tus preguntas
- ✅ Usa términos que aparezcan en los documentos
- ✅ Haz preguntas de una sola cosa a la vez
- ✅ Proporciona contexto cuando sea necesario

**DON'T:**
- ❌ No hagas preguntas demasiado amplias
- ❌ No asumas que el sistema conoce info externa
- ❌ No hagas múltiples preguntas en un mensaje
- ❌ No uses jerga que no esté en los docs

#### 3. Gestión de Documentos

- 📊 Mantén documentos organizados por tema
- 🗑️ Elimina documentos obsoletos
- 📝 Usa nombres de archivo descriptivos
- 🔄 Re-sube si actualizas un documento

---

## 🛠️ Solución de Problemas

### Problema: "No hay documentos cargados"

**Solución:**
1. Sube al menos un documento
2. Espera a que termine el procesamiento
3. Verifica que aparezca en la lista

---

### Problema: "Error al procesar el documento"

**Causas posibles:**
- 📄 PDF corrupto o protegido
- 🔒 Documento con contraseña
- 🖼️ Solo contiene imágenes (sin OCR)
- 📏 Archivo demasiado grande

**Solución:**
1. Verifica que el PDF se pueda abrir
2. Intenta guardar una copia nueva
3. Convierte imágenes a texto primero
4. Comprime el archivo si es muy grande

---

### Problema: "No encontré información relevante"

**Causas posibles:**
- ❓ Pregunta no relacionada con los documentos
- 🔤 Términos diferentes a los del documento
- 📝 Documento no tiene esa información

**Solución:**
1. Reformula usando términos del documento
2. Haz la pregunta más específica
3. Verifica que subiste el documento correcto
4. Sube más documentos relacionados

---

### Problema: Respuesta lenta

**Causas posibles:**
- 🌐 Conexión lenta a OpenAI
- 📊 Muchos documentos indexados
- 💾 Límites de rate de la API

**Solución:**
1. Espera unos segundos más
2. Reduce el número de documentos
3. Verifica tu plan de OpenAI

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Análisis de Contratos

**Documentos:**
- contrato_servicio.pdf

**Preguntas:**
```
1. "¿Cuál es la duración del contrato?"
2. "¿Qué cláusulas de terminación existen?"
3. "¿Cuál es el monto total del servicio?"
```

---

### Ejemplo 2: Investigación Académica

**Documentos:**
- paper_ia_2024.pdf
- paper_ml_2024.pdf

**Preguntas:**
```
1. "¿Qué metodologías de IA se mencionan?"
2. "Compara los resultados de ambos papers"
3. "¿Cuáles son las limitaciones identificadas?"
```

---

### Ejemplo 3: Documentación Técnica

**Documentos:**
- manual_usuario.pdf
- guia_instalacion.pdf

**Preguntas:**
```
1. "¿Cómo instalo el software en Windows?"
2. "¿Qué puertos necesito abrir?"
3. "¿Cuáles son los requisitos del sistema?"
```

---

## 🎓 Consejos Avanzados

### 1. Optimizar Chunks

En `backend/.env`:
```env
CHUNK_SIZE=1000      # Fragmentos más pequeños = búsqueda más precisa
CHUNK_OVERLAP=200    # Mayor superposición = mejor contexto
```

### 2. Cambiar Modelo

En `backend/services/chat.service.js`:
```javascript
model: 'gpt-4'  // Más inteligente pero más caro
// o
model: 'gpt-4o-mini'  // Más rápido y económico
```

### 3. Ajustar Número de Resultados

En `backend/services/chat.service.js`:
```javascript
const relevantChunks = await vectorStore.search(questionEmbedding, 5)
// Cambia 5 por más o menos chunks
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs:
   - `backend/logs/error.log`
   - `backend/logs/combined.log`

2. Verifica la consola del navegador (F12)

3. Asegúrate de tener:
   - Node.js 18+
   - API Key válida de OpenAI
   - Conexión a internet

---

## 🎉 ¡Listo para Usar!

Ahora tienes todo lo necesario para aprovechar al máximo tu Sistema RAG.

**¡Feliz búsqueda! 🚀**
