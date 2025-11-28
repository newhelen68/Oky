import { useState, useRef } from 'react'
import { FiUpload, FiFile, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi'
import axios from 'axios'

function FileUpload({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const fileInputRef = useRef(null)

  // Tipos permitidos (MIME) + extensiones
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
  ]

  const allowedExtensions = ['.pdf', '.docx', '.txt', '.csv']

  const maxSize = 10 * 1024 * 1024 // 10MB

  // Validar archivo
  const validateFile = (file) => {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

    const mimeOk = allowedMimeTypes.includes(file.type)
    const extOk = allowedExtensions.includes(ext)

    if (!mimeOk && !extOk) {
      return 'Solo se permiten archivos PDF, DOCX, TXT y CSV'
    }
    if (file.size > maxSize) {
      return 'El archivo excede el tamaño máximo de 10MB'
    }
    return null
  }

  // Manejar selección de archivo
  const handleFileSelect = (file) => {
    const error = validateFile(file)
    if (error) {
      setMessage({ type: 'error', text: error })
      return
    }
    
    setSelectedFile(file)
    setMessage({ type: '', text: '' })
  }

  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragleave' || e.type === 'dragover') {
      setDragActive(e.type === 'dragenter' || e.type === 'dragover')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  // Subir archivo
  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)
    setMessage({ type: '', text: '' })

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(progress)
        },
      })

      setMessage({ 
        type: 'success', 
        text: `¡Documento "${selectedFile.name}" procesado exitosamente!` 
      })
      setSelectedFile(null)
      setUploadProgress(0)
      
      // Notificar al componente padre
      if (onUploadSuccess) {
        onUploadSuccess(response.data)
      }

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Error al subir archivo:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al subir el archivo. Intenta nuevamente.' 
      })
    } finally {
      setUploading(false)
    }
  }

  // Cancelar selección
  const handleCancel = () => {
    setSelectedFile(null)
    setMessage({ type: '', text: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        📄 Subir Documentos
      </h2>

      {/* Área de drag & drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.csv"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        <FiUpload className="mx-auto mb-4 text-gray-400" size={40} />
        
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            disabled={uploading}
          >
            Haz clic para subir
          </button>
          {' '}o arrastra archivos aquí
        </p>
        
        <p className="text-xs text-gray-500 dark:text-gray-500">
          PDF, DOCX, TXT o CSV (máx. 10MB)
        </p>
      </div>

      {/* Archivo seleccionado */}
      {selectedFile && (
        <div className="card p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FiFile className="text-primary-600 dark:text-primary-400" size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {!uploading && (
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FiX size={20} />
              </button>
            )}
          </div>

          {/* Barra de progreso */}
          {uploading && (
            <div className="mb-3">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {uploadProgress}% completado
              </p>
            </div>
          )}

          {/* Botón de subir */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary w-full"
          >
            {uploading ? 'Procesando...' : 'Subir y Procesar'}
          </button>
        </div>
      )}

      {/* Mensajes */}
      {message.text && (
        <div
          className={`
            p-4 rounded-lg flex items-start gap-3 animate-slide-up
            ${message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }
          `}
        >
          {message.type === 'success' ? (
            <FiCheck className="flex-shrink-0 mt-0.5" size={20} />
          ) : (
            <FiAlertCircle className="flex-shrink-0 mt-0.5" size={20} />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}
    </div>
  )
}

export default FileUpload
