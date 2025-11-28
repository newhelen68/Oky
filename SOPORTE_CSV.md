# 📊 Soporte para Archivos CSV

## ✨ Nuevas Funcionalidades

Tu sistema RAG ahora soporta archivos CSV además de PDF, DOCX y TXT.

## 🔧 Configuración CSV

En tu archivo `.env` puedes configurar el comportamiento de los archivos CSV:

```env
# Delimitador usado en el CSV (por defecto es coma)
CSV_DELIMITER=,

# Encoding del archivo (utf-8, latin1, etc.)
CSV_ENCODING=utf-8

# Si la primera fila contiene encabezados
CSV_HAS_HEADERS=true

# Número de filas a incluir por chunk
CSV_ROWS_PER_CHUNK=50
```

## 📝 Tipos de Archivo Soportados

Ahora el sistema acepta:
- ✅ **PDF** (.pdf)
- ✅ **Word** (.docx)
- ✅ **Texto plano** (.txt)
- ✅ **CSV** (.csv) **¡NUEVO!**

## 🚀 Cómo Usar

### 1. Preparar tu archivo CSV

Asegúrate de que tu CSV esté bien formado:

```csv
nombre,edad,ciudad,profesión
Juan,30,Madrid,Ingeniero
María,25,Barcelona,Diseñadora
Pedro,35,Valencia,Profesor
```

### 2. Subir el archivo

Usa la interfaz web o la API para subir tu CSV:

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@datos.csv"
```

### 3. Consultar información

Una vez procesado, puedes hacer preguntas sobre los datos:

```
"¿Cuántas personas hay en el archivo?"
"¿Quién es ingeniero?"
"¿Qué profesiones aparecen en los datos?"
```

## 🎯 Cómo Funciona el Procesamiento CSV

### Sin Encabezados (`CSV_HAS_HEADERS=false`)

El sistema procesará cada fila como:
```
Registro 1: Juan, 30, Madrid, Ingeniero
Registro 2: María, 25, Barcelona, Diseñadora
```

### Con Encabezados (`CSV_HAS_HEADERS=true`)

El sistema procesará cada fila de forma más descriptiva:
```
Registro 1: nombre: Juan, edad: 30, ciudad: Madrid, profesión: Ingeniero
Registro 2: nombre: María, edad: 25, ciudad: Barcelona, profesión: Diseñadora
```

## 💡 Consejos para Mejores Resultados

### 1. Usa Encabezados Descriptivos

❌ Mal:
```csv
c1,c2,c3
val1,val2,val3
```

✅ Bien:
```csv
nombre,edad,departamento
Juan,30,Ventas
```

### 2. Mantén Datos Consistentes

Evita mezclar formatos en la misma columna:
```csv
fecha,monto
2024-01-15,100.50
15/01/2024,150.75  ❌ Formato inconsistente
```

### 3. Limita el Tamaño

Para archivos muy grandes (más de 10,000 filas):
- Considera dividir en múltiples archivos
- Ajusta `CSV_ROWS_PER_CHUNK` para optimizar el procesamiento
- Aumenta `MAX_FILE_SIZE` si es necesario

### 4. Delimitadores Especiales

Si tu CSV usa punto y coma o tabs:

```env
CSV_DELIMITER=;    # Para punto y coma
CSV_DELIMITER=\t   # Para tabs
```

## 🔍 Ejemplos de Uso

### Ejemplo 1: Lista de Productos

```csv
producto,precio,stock,categoría
Laptop,999.99,15,Electrónica
Mouse,19.99,150,Accesorios
Teclado,49.99,80,Accesorios
```

**Preguntas que puedes hacer:**
- "¿Cuántos productos hay en stock?"
- "¿Cuál es el precio del laptop?"
- "Lista todos los accesorios"
- "¿Qué productos cuestan menos de 50 dólares?"

### Ejemplo 2: Registro de Empleados

```csv
id,nombre,puesto,salario,fecha_ingreso
001,Ana López,Gerente,5000,2020-01-15
002,Carlos Ruiz,Desarrollador,3500,2021-03-20
003,María González,Diseñadora,3200,2021-06-10
```

**Preguntas que puedes hacer:**
- "¿Quién es el gerente?"
- "¿Cuánto gana Carlos Ruiz?"
- "¿Quién ingresó en 2021?"
- "Lista todos los desarrolladores"

### Ejemplo 3: Datos de Ventas

```csv
fecha,producto,cantidad,total,vendedor
2024-01-15,Laptop,2,1999.98,Juan
2024-01-15,Mouse,5,99.95,María
2024-01-16,Teclado,3,149.97,Juan
```

**Preguntas que puedes hacer:**
- "¿Cuántas ventas hizo Juan?"
- "¿Qué se vendió el 15 de enero?"
- "¿Cuál fue el total de ventas de laptops?"
- "¿Quién vendió más productos?"

## ⚠️ Limitaciones

1. **Tamaño máximo**: Por defecto 10MB (configurable con `MAX_FILE_SIZE`)
2. **Formato**: Solo CSV estándar (RFC 4180)
3. **Encoding**: UTF-8 por defecto (configurable)
4. **Celdas con comas**: Deben estar entre comillas
   ```csv
   nombre,descripción
   "Producto 1","Incluye tornillos, tuercas y arandelas"
   ```

## 🐛 Solución de Problemas

### Error: "El archivo CSV está vacío"
- Verifica que el archivo no esté corrupto
- Asegúrate de que tenga contenido

### Error: "Tipo de archivo no soportado"
- Verifica que la extensión sea `.csv`
- Asegúrate de que `ALLOWED_FILE_TYPES` incluya `.csv`

### Las respuestas no son precisas
- Verifica que `CSV_HAS_HEADERS` esté configurado correctamente
- Ajusta `CSV_DELIMITER` si tu archivo usa otro separador
- Reduce `CSV_ROWS_PER_CHUNK` para chunks más pequeños

### Problemas con caracteres especiales
- Verifica el encoding del archivo
- Cambia `CSV_ENCODING` a `latin1` o `iso-8859-1` si es necesario

## 📚 Recursos Adicionales

- [RFC 4180 - Especificación CSV](https://tools.ietf.org/html/rfc4180)
- [Documentación de OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Mejores prácticas para archivos CSV](https://www.data.gov/developers/blog/primer-machine-readable-data-formats)

## 🎉 ¡Disfruta usando CSV en tu RAG!

Ahora puedes cargar y consultar datos estructurados de forma natural. El sistema convertirá tus CSVs en texto comprensible y responderá preguntas sobre ellos.
