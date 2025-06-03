"use client"

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface AIAssistantProps {
  lessonId?: string
  courseId?: string
  context?: string
  className?: string
}

export default function AIAssistant({ lessonId, courseId, context, className = "" }: AIAssistantProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'مرحباً! أنا مساعدك الذكي في منصة فتح. كيف يمكنني مساعدتك اليوم؟ 🤖',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          lessonId,
          courseId,
          context,
          history: messages.slice(-5) // آخر 5 رسائل للسياق
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(data.error || 'حدث خطأ في الاتصال')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'مرحباً! أنا مساعدك الذكي في منصة فتح. كيف يمكنني مساعدتك اليوم؟ 🤖',
        isUser: false,
        timestamp: new Date()
      }
    ])
  }

  const quickQuestions = [
    "اشرح لي هذا الموضوع بطريقة أبسط",
    "ما هي النقاط المهمة في هذا الدرس؟",
    "أعطني أمثلة عملية",
    "كيف يمكنني تطبيق هذا في الحياة العملية؟",
    "ما هي المصادر الإضافية للتعلم؟"
  ]

  if (!session) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-surface border border-border rounded-lg p-4 shadow-lg max-w-sm">
          <p className="text-textSecondary arabic-text text-sm">
            سجل دخولك للاستفادة من المساعد الذكي
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        title="المساعد الذكي"
      >
        <span className="text-white text-2xl">🤖</span>
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <span className="text-white text-xs">💬</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-96 bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl ml-2">🤖</span>
              <div>
                <h3 className="font-bold arabic-text">المساعد الذكي</h3>
                <p className="text-xs opacity-90">مدعوم بتقنية Gemini</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={clearChat}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                title="مسح المحادثة"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                title="إغلاق"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-primary text-white'
                      : 'bg-surface text-text border border-border'
                  }`}
                >
                  <p className="text-sm arabic-text leading-relaxed">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-white opacity-70' : 'text-textSecondary'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface text-text border border-border px-4 py-2 rounded-2xl">
                  <div className="flex items-center space-x-1">
                    <div className="animate-pulse">🤖</div>
                    <span className="text-sm arabic-text">يكتب...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-border">
              <p className="text-xs text-textSecondary arabic-text mb-2">أسئلة سريعة:</p>
              <div className="flex flex-wrap gap-1">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="text-xs bg-surface hover:bg-border px-2 py-1 rounded-full text-textSecondary hover:text-text transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2 space-x-reverse">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 form-input resize-none h-10 text-sm"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="btn btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="loading-spinner w-4 h-4"></div>
                ) : (
                  '📤'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
