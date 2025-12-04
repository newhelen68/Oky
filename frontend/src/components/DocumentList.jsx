import { useState, useEffect } from 'react'
import { FiFile, FiTrash2, FiRefreshCw, FiFileText } from 'react-icons/fi'
import axios from 'axios'

function DocumentList({ refreshTrigger, onDocumentDeleted, onDocumentsCountChange }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Cargar documentos
  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/upload/documents')
      setDocuments(response.data.documents)
      setStats(response.data.stats)
      
      // Notificar al componente padre del conteo
      if (onDocumentsCountChange) {
        onDocumentsCountChange(response.data.documents.length)
      }
    } catch (error) {
      console.error('Error al cargar documentos:', error)
      // Si hay error, también notificar con 0
      if (onDocumentsCountChange) {
        onDocumentsCountChange(0)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [refreshTrigger])

  // Eliminar documento
  const handleDelete = async (documentId, filename) => {
    if (!confirm(`¿Estás seguro de eliminar "${filename}"? 🗑️`)) {
      return
    }

    try {
      setDeleting(documentId)
      await axios.delete(`/api/upload/documents/${documentId}`)
      
      // Actualizar lista
      const newDocuments = documents.filter(doc => doc.id !== documentId)
      setDocuments(newDocuments)
      
      // Notificar al componente padre del nuevo conteo
      if (onDocumentsCountChange) {
        onDocumentsCountChange(newDocuments.length)
      }
      
      if (onDocumentDeleted) {
        onDocumentDeleted()
      }
    } catch (error) {
      console.error('Error al eliminar documento:', error)
      alert('😔 Error al eliminar el documento')
    } finally {
      setDeleting(null)
    }
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Obtener emoji según extensión
  const getFileEmoji = (filename) => {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))
    const emojiMap = {
      '.pdf': '📄',
      '.docx': '📝',
      '.txt': '📃',
      '.csv': '📊'
    }
    return emojiMap[ext] || '📁'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="p-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 rounded-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Recargar"
        >
          <FiRefreshCw 
            size={18} 
            className={`${loading ? 'animate-spin text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
          />
        </button>
      </div>

      {/* Estadísticas lindas */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📚</span>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Documentos</p>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalDocuments}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Chunks</p>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.totalChunks}
            </p>
          </div>
        </div>
      )}

      {/* Lista de documentos */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-semibold">
              Cargando documentos...
            </p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-6xl mb-4 animate-bounce-slow">📂</div>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No hay documentos aún
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¡Sube tu primer documento arriba! ⬆️
            </p>
          </div>
        ) : (
          documents.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-700 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:scale-102 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="text-3xl flex-shrink-0">
                    {getFileEmoji(doc.filename)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                      {doc.filename}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                        ✨ {doc.chunkCount} chunks
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                      🕐 {formatDate(doc.addedAt)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(doc.id, doc.filename)}
                  disabled={deleting === doc.id}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all duration-300 flex-shrink-0 transform hover:scale-110"
                  aria-label="Eliminar"
                >
                  {deleting === doc.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                  ) : (
                    <FiTrash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer motivacional */}
      {documents.length > 0 && (
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
            🎉 ¡{documents.length} documento{documents.length !== 1 ? 's' : ''} listo{documents.length !== 1 ? 's' : ''} para consultar!
          </p>
        </div>
      )}
    </div>
  )
}

export default DocumentList
