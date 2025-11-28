# Frontend - Sistema RAG

Interfaz web moderna para el sistema RAG con React y Tailwind CSS.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🎨 Características

- ✅ Chat interactivo estilo ChatGPT
- ✅ Drag & Drop para subir archivos
- ✅ Lista de documentos en tiempo real
- ✅ Modo oscuro/claro
- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Indicadores de progreso
- ✅ Referencias a fuentes
- ✅ Validación de archivos

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Axios** - HTTP client
- **React Icons** - Iconos

## 📱 Responsive

El diseño se adapta a:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Escritorio (> 1024px)

## 🎨 Temas

El sistema incluye:
- 🌞 Modo claro
- 🌙 Modo oscuro
- Auto-detección de preferencia del sistema

## 📝 Estructura de Componentes

```
src/
├── components/
│   ├── Chat.jsx          # Chat principal
│   ├── FileUpload.jsx    # Subida de archivos
│   └── DocumentList.jsx  # Lista de documentos
├── App.jsx               # Componente raíz
├── main.jsx             # Punto de entrada
└── index.css            # Estilos globales
```

## 🔌 API

El frontend se conecta al backend en `http://localhost:5000`

Proxy configurado en `vite.config.js`:
```javascript
proxy: {
  '/api': 'http://localhost:5000'
}
```

## 🎯 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build

## 🌐 Navegadores Soportados

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)
