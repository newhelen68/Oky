import { useState, useEffect } from 'react'
import { FiFile, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import axios from 'axios'

function DocumentList({ refreshTrigger, onDocumentDeleted }) {
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
    } catch (error) {
      console.error('Error al cargar documentos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [refreshTrigger])

  // Eliminar documento
  const handleDelete = async (documentId, filename) => {
    if (!confirm(`¿Estás seguro de eliminar "${filename}"?`)) {
      return
    }

    try {
      setDeleting(documentId)
      await axios.delete(`/api/upload/documents/${documentId}`)
      
      // Actualizar lista
      setDocuments(documents.filter(doc => doc.id !== documentId))
      
      if (onDocumentDeleted) {
        onDocumentDeleted()
      }
    } catch (error) {
      console.error('Error al eliminar documento:', error)
      alert('Error al eliminar el documento')
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          📚 Documentos
        </h2>
        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Recargar"
        >
          <FiRefreshCw 
            size={18} 
            className={loading ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="card p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Documentos</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.totalDocuments}
            </p>
          </div>
          <div className="card p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Chunks</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.totalChunks}
            </p>
          </div>
        </div>
      )}

      {/* Lista de documentos */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Cargando...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <FiFile className="mx-auto text-gray-400 mb-2" size={40} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No hay documentos cargados
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Sube tu primer documento arriba
            </p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="card p-3 hover:shadow-md transition-shadow animate-slide-up"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <FiFile className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" size={18} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {doc.chunkCount} chunks
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(doc.addedAt)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(doc.id, doc.filename)}
                  disabled={deleting === doc.id}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors flex-shrink-0"
                  aria-label="Eliminar"
                >
                  {deleting === doc.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DocumentList
