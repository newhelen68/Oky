# ⚡ GUÍA RÁPIDA - SOPORTE CSV

## 🎯 Resumen de Cambios

Se ha agregado soporte completo para archivos CSV a tu sistema RAG.

## ✅ Lo que se hizo:

### 1. Archivo `.env.example` creado
- Contiene todas las configuraciones necesarias
- Incluye nuevas variables para CSV
- **Ubicación**: `backend/.env.example`

### 2. Archivo `.env` actualizado
- Listo para usar (solo falta tu API Key de OpenAI)
- **Ubicación**: `backend/.env`
- **IMPORTANTE**: Reemplaza `OPENAI_API_KEY` con tu key real

### 3. Código actualizado
- `document.service.js` ahora procesa CSV, TXT, PDF y DOCX
- Conversión inteligente de CSV a texto descriptivo
- Soporte para encabezados y delimitadores personalizados

### 4. Documentación creada
- `SOPORTE_CSV.md`: Guía completa con ejemplos
- `ejemplo_empleados.csv`: Archivo de prueba
- README.md actualizado

## 🚀 Cómo Empezar

### Paso 1: Configurar tu API Key

Edita `backend/.env` y reemplaza:
```env
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Con tu API Key real de OpenAI (obtén una en https://platform.openai.com/api-keys)

### Paso 2: Instalar y ejecutar

```bash
# Si ya instalaste antes, no es necesario reinstalar
cd backend
npm install  # Solo si es primera vez

# Iniciar backend
npm start
```

```bash
# En otra terminal
cd frontend
npm install  # Solo si es primera vez

# Iniciar frontend
npm run dev
```

### Paso 3: Probar con CSV

1. Abre http://localhost:5173
2. Arrastra el archivo `ejemplo_empleados.csv` al área de carga
3. Haz preguntas como:
   - "¿Cuántos empleados hay?"
   - "¿Quién gana más de 50000?"
   - "Lista los ingenieros"
   - "¿Qué empleados viven en Madrid?"

## 📝 Configuración CSV (Opcional)

En `backend/.env` puedes ajustar:

```env
# Delimitador (coma, punto y coma, etc.)
CSV_DELIMITER=,

# Si tiene encabezados en primera fila
CSV_HAS_HEADERS=true

# Encoding del archivo
CSV_ENCODING=utf-8

# Filas por chunk (para archivos grandes)
CSV_ROWS_PER_CHUNK=50
```

## 🎨 Formatos Soportados Ahora

| Formato | Extensión | Estado |
|---------|-----------|--------|
| PDF | `.pdf` | ✅ Soportado |
| Word | `.docx` | ✅ Soportado |
| Texto | `.txt` | ✅ Soportado |
| CSV | `.csv` | ✅ **NUEVO** |

## 💡 Tips

### Para CSVs grandes (>1000 filas):
```env
CSV_ROWS_PER_CHUNK=100  # Aumentar
MAX_FILE_SIZE=20971520   # 20MB
```

### Para CSVs con punto y coma:
```env
CSV_DELIMITER=;
```

### Para CSVs sin encabezados:
```env
CSV_HAS_HEADERS=false
```

## 🐛 Solución Rápida de Problemas

### "Tipo de archivo no soportado"
✅ Verifica que la extensión sea `.csv`
✅ Revisa `ALLOWED_FILE_TYPES` en `.env`

### "Error al procesar CSV"
✅ Verifica que el delimitador sea correcto
✅ Asegúrate de que el archivo no esté vacío
✅ Comprueba el encoding (debe ser UTF-8)

### No encuentra información en el CSV
✅ Revisa `CSV_HAS_HEADERS` (debe coincidir con tu archivo)
✅ Aumenta `TOP_K_RESULTS` en `.env`

## 📚 Archivos Importantes

```
backend/
├── .env                    ← Configura tu API Key aquí
├── .env.example            ← Plantilla de configuración
└── services/
    └── document.service.js ← Procesamiento CSV agregado

SOPORTE_CSV.md              ← Documentación completa
ejemplo_empleados.csv       ← Archivo de prueba
```

## 🎉 ¡Todo Listo!

Tu sistema RAG ahora puede:
- 📄 Leer PDFs
- 📝 Leer Word (DOCX)
- 📃 Leer archivos de texto (TXT)
- 📊 **Leer y analizar CSVs** ← NUEVO

¡Empieza a cargar tus archivos CSV y hazles preguntas!

---

**¿Necesitas ayuda?** Revisa `SOPORTE_CSV.md` para ejemplos detallados y casos de uso.
