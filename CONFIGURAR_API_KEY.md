# 🎯 ACCIÓN INMEDIATA REQUERIDA

## ⚠️ PASO CRÍTICO: Configurar tu API Key de OpenAI

### 📍 Ubicación del archivo
```
C:\ClaudeProjects\Oky\backend\.env
```

### 🔑 Qué hacer

1. **Abre el archivo** `backend/.env` con tu editor favorito (Notepad, VSCode, etc.)

2. **Busca esta línea**:
   ```env
   OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Reemplázala** con tu API Key real de OpenAI:
   ```env
   OPENAI_API_KEY=sk-proj-TU_API_KEY_REAL_AQUI
   ```

### 🌐 ¿Dónde obtener tu API Key?

1. Ve a: **https://platform.openai.com/api-keys**
2. Inicia sesión con tu cuenta de OpenAI
3. Haz clic en "Create new secret key"
4. Copia la key (empieza con `sk-proj-...`)
5. Pégala en el archivo `.env`

### ⚡ Sin esto, el sistema NO funcionará

El sistema necesita la API Key para:
- Generar embeddings de tus documentos
- Responder preguntas
- Realizar búsquedas semánticas

---

## ✅ Después de configurar tu API Key

### Iniciar el sistema

**Terminal 1 - Backend:**
```bash
cd C:\ClaudeProjects\Oky\backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd C:\ClaudeProjects\Oky\frontend
npm run dev
```

### Probar con el archivo CSV de ejemplo

1. Abre tu navegador en: **http://localhost:5173**
2. Arrastra el archivo `ejemplo_empleados.csv` al área de carga
3. Espera unos segundos mientras se procesa
4. Haz preguntas como:
   - "¿Cuántos empleados hay?"
   - "¿Quién es ingeniero?"
   - "Lista los empleados de Madrid"
   - "¿Quién gana más de 50000?"

---

## 📊 Resumen de Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `backend/.env.example` | Plantilla de configuración |
| `backend/.env` | ⚠️ **Configura tu API Key aquí** |
| `SOPORTE_CSV.md` | Documentación completa CSV |
| `INICIO_RAPIDO_CSV.md` | Guía rápida |
| `RESUMEN_CAMBIOS.md` | Changelog detallado |
| `ejemplo_empleados.csv` | Archivo de prueba |

---

## 🐛 Si algo no funciona

### Error: "OPENAI_API_KEY no configurada"
✅ Verifica que hayas guardado el archivo `.env` después de editarlo
✅ Asegúrate de que la key no tenga espacios al inicio o final
✅ Reinicia el servidor backend

### Error: "Unauthorized" o 401
✅ Tu API Key puede ser inválida
✅ Verifica en https://platform.openai.com/api-keys
✅ Genera una nueva key si es necesario

### Error: "Tipo de archivo no soportado"
✅ Verifica que el archivo sea `.csv`
✅ Revisa `ALLOWED_FILE_TYPES` en `.env`

---

## 🎉 ¡Eso es todo!

Una vez configurada tu API Key, todo funcionará perfectamente.

**Archivos que ahora puedes procesar:**
- 📄 PDF
- 📝 DOCX  
- 📃 TXT
- 📊 CSV ← **NUEVO**

¡Disfruta tu sistema RAG mejorado! 🚀
