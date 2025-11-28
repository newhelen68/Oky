# ✅ CHECKLIST DE CONFIGURACIÓN

## 📋 Lista de Verificación

### 1. ⚙️ Configuración Inicial

- [ ] **Abrir archivo** `backend/.env`
- [ ] **Configurar API Key** de OpenAI
  - Reemplazar: `OPENAI_API_KEY=sk-proj-XXXXXXX...`
  - Con tu key real de: https://platform.openai.com/api-keys
- [ ] **Guardar el archivo** `.env`

### 2. 📦 Instalación de Dependencias

- [ ] **Backend**
  ```bash
  cd backend
  npm install
  ```

- [ ] **Frontend**
  ```bash
  cd frontend
  npm install
  ```

### 3. 🚀 Iniciar el Sistema

- [ ] **Terminal 1 - Iniciar Backend**
  ```bash
  cd backend
  npm start
  ```
  ✅ Debe mostrar: "🚀 Servidor RAG iniciado en puerto 5000"

- [ ] **Terminal 2 - Iniciar Frontend**
  ```bash
  cd frontend
  npm run dev
  ```
  ✅ Debe mostrar: "Local: http://localhost:5173/"

### 4. 🧪 Probar Funcionalidad CSV

- [ ] **Abrir navegador** en http://localhost:5173
- [ ] **Cargar archivo de prueba** `ejemplo_empleados.csv`
  - Arrastrarlo al área de carga
  - O hacer clic para seleccionar
- [ ] **Esperar procesamiento** (barra de progreso)
- [ ] **Ver confirmación** de carga exitosa

### 5. 💬 Hacer Preguntas de Prueba

Prueba estas preguntas sobre `ejemplo_empleados.csv`:

- [ ] "¿Cuántos empleados hay?"
  - ✅ Respuesta esperada: "10 empleados"

- [ ] "¿Quién gana más?"
  - ✅ Respuesta esperada: "Francisco Díaz (55000)"

- [ ] "Lista los ingenieros"
  - ✅ Debe mencionar a Juan Pérez

- [ ] "¿Qué empleados viven en Madrid?"
  - ✅ Debe mencionar a Juan Pérez

- [ ] "¿Cuál es el promedio de edad?"
  - ✅ Debe calcular aproximadamente 30 años

### 6. 📊 Probar Otros Tipos de Archivo

- [ ] **Probar con PDF**
  - Arrastra cualquier PDF
  - Haz preguntas sobre su contenido

- [ ] **Probar con DOCX**
  - Arrastra cualquier archivo Word
  - Haz preguntas sobre su contenido

- [ ] **Probar con TXT**
  - Arrastra cualquier archivo de texto
  - Haz preguntas sobre su contenido

### 7. 🎨 Explorar Funcionalidades

- [ ] **Probar modo oscuro/claro**
  - Botón en la esquina superior derecha

- [ ] **Ver lista de documentos**
  - Panel lateral con documentos cargados

- [ ] **Eliminar documentos**
  - Botón de eliminar en cada documento

- [ ] **Limpiar conversación**
  - Botón "Nueva conversación"

---

## 🎯 Configuraciones Opcionales

### Para CSVs con Punto y Coma

En `backend/.env`, cambia:
```env
CSV_DELIMITER=;
```

### Para CSVs sin Encabezados

En `backend/.env`, cambia:
```env
CSV_HAS_HEADERS=false
```

### Para Archivos más Grandes

En `backend/.env`, ajusta:
```env
MAX_FILE_SIZE=20971520  # 20MB
CSV_ROWS_PER_CHUNK=100
```

---

## 📊 Verificación de Estado

### ✅ Backend funcionando correctamente si ves:
```
🚀 Servidor RAG iniciado en puerto 5000
📝 Environment: development
🔗 Health check: http://localhost:5000/api/health
```

### ✅ Frontend funcionando correctamente si ves:
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### ✅ Sistema funcionando si:
- Puedes cargar archivos sin errores
- El chat responde a tus preguntas
- Las respuestas incluyen referencias al documento

---

## 🐛 Solución de Problemas

### ❌ "OPENAI_API_KEY no configurada"
```
🔧 Solución:
1. Abre backend/.env
2. Configura tu API Key
3. Reinicia el servidor backend
```

### ❌ "Error al procesar documento"
```
🔧 Solución:
1. Verifica que el archivo no esté corrupto
2. Asegúrate de que sea un formato soportado
3. Revisa los logs en backend/logs/
```

### ❌ "Cannot connect to server"
```
🔧 Solución:
1. Verifica que el backend esté corriendo
2. Comprueba que el puerto 5000 esté libre
3. Revisa el CORS en backend/server.js
```

### ❌ "Tipo de archivo no soportado"
```
🔧 Solución:
1. Verifica la extensión del archivo
2. Revisa ALLOWED_FILE_TYPES en .env
3. Asegúrate de incluir .csv en la lista
```

---

## 📚 Documentación Disponible

| Archivo | Propósito |
|---------|-----------|
| `CONFIGURAR_API_KEY.md` | Configuración de API Key |
| `INICIO_RAPIDO_CSV.md` | Inicio rápido |
| `SOPORTE_CSV.md` | Guía completa CSV |
| `RESUMEN_CAMBIOS.md` | Changelog |
| `README.md` | Documentación general |

---

## 🎉 ¡Sistema Listo!

Cuando completes todos los checkboxes, tu sistema estará:
- ✅ Totalmente configurado
- ✅ Probado y funcionando
- ✅ Listo para usar con CSV, PDF, DOCX y TXT

**¡Disfruta tu sistema RAG mejorado!** 🚀
