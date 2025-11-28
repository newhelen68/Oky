import { useState, useRef, useEffect } from 'react'
import { FiSend, FiUser, FiCpu, FiAlertCircle, FiFileText } from 'react-icons/fi'
import axios from 'axios'

function Chat({ documentsCount }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  // Mensaje de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '¡Hola! 👋 Soy tu asistente RAG. Puedo responder preguntas basándome en los documentos que subas. Para comenzar, sube algunos documentos PDF o DOCX usando el panel lateral.',
          timestamp: new Date().toISOString()
        }
      ])
    }
  }, [])

  // Enviar mensaje
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Preparar historial para el backend (últimos 5 mensajes)
      const history = messages
        .slice(-5)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      const response = await axios.post('/api/chat', {
        question: userMessage.content,
        history: history
      })

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources,
        metadata: response.data.metadata,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      
      const errorMessage = {
        role: 'assistant',
        content: error.response?.data?.details || 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta nuevamente.',
        error: true,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Manejar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col card">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 animate-slide-up ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <FiCpu className="text-primary-600 dark:text-primary-400" size={18} />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : message.error
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {/* Contenido del mensaje */}
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>

              {/* Fuentes */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                    <FiFileText size={16} />
                    <span>Fuentes:</span>
                  </div>
                  <div className="space-y-2">
                    {message.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <div className="font-medium mb-1 flex items-center justify-between">
                          <span className="truncate">{source.filename}</span>
                          <span className="text-primary-600 dark:text-primary-400 ml-2">
                            {(source.similarity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {source.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {message.metadata && (
                <div className="mt-2 text-xs opacity-70">
                  <span>{new Date(message.metadata.timestamp).toLocaleTimeString('es-ES')}</span>
                  {message.metadata.tokensUsed && (
                    <span className="ml-2">• {message.metadata.tokensUsed} tokens</span>
                  )}
                </div>
              )}

              {/* Timestamp */}
              {!message.metadata && (
                <div className="mt-2 text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString('es-ES')}
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <FiUser className="text-white" size={18} />
              </div>
            )}
          </div>
        ))}

        {/* Indicador de carga */}
        {loading && (
          <div className="flex gap-3 animate-slide-up">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <FiCpu className="text-primary-600 dark:text-primary-400" size={18} />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Área de input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {documentsCount === 0 && (
          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              No hay documentos cargados. Sube algunos documentos para poder hacer preguntas sobre ellos.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta aquí... (Shift + Enter para nueva línea)"
            className="input flex-1 resize-none min-h-[44px] max-h-32"
            rows={1}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-4 flex-shrink-0"
          >
            <FiSend size={20} />
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Las respuestas se basan únicamente en los documentos cargados
        </p>
      </div>
    </div>
  )
}

export default Chat
