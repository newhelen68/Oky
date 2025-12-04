import { useState, useEffect } from 'react'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import Chat from './components/Chat'
import FileUpload from './components/FileUpload'
import DocumentList from './components/DocumentList'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [documentsCount, setDocumentsCount] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Cargar preferencia de tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Alternar modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Callback cuando se sube un documento
  const handleDocumentUploaded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Callback cuando se elimina un documento
  const handleDocumentDeleted = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Callback cuando DocumentList actualiza la cuenta
  const handleDocumentsCountChange = (count) => {
    setDocumentsCount(count)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      {/* Header mejorado */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 lg:hidden transform hover:scale-110"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce-slow">🤖</div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Oky RAG
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tu asistente inteligente
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-600 dark:to-purple-600 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                aria-label="Alternar tema"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar mejorado */}
        <aside
          className={`
            fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] w-80
            bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl 
            border-r border-gray-200/50 dark:border-gray-700/50
            transition-transform duration-300 z-20 overflow-y-auto
            shadow-2xl
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6 space-y-6">
            {/* Header del sidebar */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                📚 Mis Documentos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sube y gestiona tus archivos
              </p>
            </div>
            
            <FileUpload onUploadSuccess={handleDocumentUploaded} />
            <DocumentList 
              refreshTrigger={refreshTrigger}
              onDocumentDeleted={handleDocumentDeleted}
              onDocumentsCountChange={handleDocumentsCountChange}
            />
          </div>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat principal con padding mejorado */}
        <main className="flex-1 p-4 lg:p-8">
          <Chat documentsCount={documentsCount} />
        </main>
      </div>

      {/* Footer decorativo */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          Hecho con <span className="text-red-500 animate-pulse">❤️</span> usando React + OpenAI
        </p>
      </div>
    </div>
  )
}

export default App
