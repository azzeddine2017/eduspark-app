'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  MessageCircle,
  X,
  Send,
  Loader2,
  Settings,
  Trash2,
  Sparkles,
  Brain,
  Lightbulb,
  BookOpen,
  Target,
  TrendingUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Star,
  Zap,
  Globe,
  User,
  Clock,
  BarChart3,
  Bookmark,
  Share2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis' | 'recommendation';
  metadata?: {
    confidence?: number;
    sources?: string[];
    relatedTopics?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  examples: string[];
}

interface AdvancedAIAssistantProps {
  lessonId?: string;
  courseId?: string;
  context?: string;
  nodeId?: string;
  culturalContext?: any;
  className?: string;
}

export default function AdvancedAIAssistant({
  lessonId,
  courseId,
  context,
  nodeId,
  culturalContext,
  className = ''
}: AdvancedAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'capabilities' | 'analytics'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `مرحباً! 👋 أنا مساعدك الذكي المتطور في منصة فتح.\n\n🧠 **قدراتي المتقدمة:**\n• تحليل المحتوى التعليمي\n• توصيات مخصصة ذكياً\n• دعم متعدد اللغات\n• تتبع التقدم والأداء\n• إجابات سياقية دقيقة\n\nكيف يمكنني مساعدتك اليوم؟`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiCapabilities: AICapability[] = [
    {
      id: 'content-analysis',
      name: 'تحليل المحتوى',
      description: 'تحليل عميق للمواد التعليمية وتقديم ملخصات ذكية',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      examples: ['حلل هذا الدرس', 'اشرح المفاهيم الصعبة', 'لخص النقاط الرئيسية']
    },
    {
      id: 'personalized-recommendations',
      name: 'التوصيات المخصصة',
      description: 'اقتراحات تعليمية مبنية على أسلوب تعلمك وتقدمك',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      examples: ['ما الدورة المناسبة لي؟', 'اقترح مسار تعليمي', 'كيف أحسن أدائي؟']
    },
    {
      id: 'progress-tracking',
      name: 'تتبع التقدم',
      description: 'مراقبة ذكية لتقدمك مع تحليلات مفصلة',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      examples: ['كيف أدائي؟', 'أين نقاط ضعفي؟', 'ما إنجازاتي؟']
    },
    {
      id: 'cultural-adaptation',
      name: 'التكيف الثقافي',
      description: 'محتوى مخصص حسب ثقافتك ومنطقتك',
      icon: Globe,
      color: 'from-orange-500 to-red-600',
      examples: ['أمثلة من بيئتي', 'تطبيقات محلية', 'سياق ثقافي']
    },
    {
      id: 'smart-tutoring',
      name: 'التدريس الذكي',
      description: 'شرح تفاعلي مع أمثلة وتمارين مخصصة',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
      examples: ['اشرح بطريقة بسيطة', 'أعطني مثال', 'كيف أطبق هذا؟']
    },
    {
      id: 'study-planning',
      name: 'تخطيط الدراسة',
      description: 'جداول دراسية ذكية مبنية على وقتك وأهدافك',
      icon: BookOpen,
      color: 'from-pink-500 to-purple-600',
      examples: ['خطط جدولي', 'متى أدرس؟', 'كم وقت أحتاج؟']
    }
  ];

  const quickActions = [
    { text: 'اشرح هذا الموضوع', icon: Brain },
    { text: 'أعطني ملخص سريع', icon: Zap },
    { text: 'ما التوصيات لي؟', icon: Target },
    { text: 'كيف أدائي؟', icon: BarChart3 },
    { text: 'أمثلة عملية', icon: Lightbulb },
    { text: 'خطة دراسية', icon: BookOpen }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          lessonId,
          courseId,
          context,
          nodeId,
          culturalContext,
          history: messages.slice(-5)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          type: data.type || 'text',
          metadata: data.metadata
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'حدث خطأ في الاتصال');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const rateMessage = (messageId: string, rating: 'up' | 'down') => {
    // تنفيذ تقييم الرسالة
    console.log(`Rated message ${messageId} as ${rating}`);
  };

  return (
    <>
      {/* زر المساعد الذكي العائم */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="المساعد الذكي المتطور"
      >
        <div className="relative">
          <Bot className="w-8 h-8 text-white group-hover:animate-pulse" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* نافذة المساعد الذكي */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 left-6 w-[480px] h-[600px] bg-background border border-border rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-lg"
          >
            {/* هيدر متقدم */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="relative">
                    <Bot className="w-8 h-8" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg arabic-text">المساعد الذكي المتطور</h3>
                    <p className="text-xs opacity-90">مدعوم بالذكاء الاصطناعي المتقدم</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`p-2 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
                    title="التحليلات"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('capabilities')}
                    className={`p-2 rounded-lg transition-colors ${activeTab === 'capabilities' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
                    title="القدرات"
                  >
                    <Brain className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    title="مسح المحادثة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    title="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* تبويبات */}
              <div className="flex mt-3 space-x-1 space-x-reverse">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white opacity-70 hover:opacity-100'
                  }`}
                >
                  💬 المحادثة
                </button>
                <button
                  onClick={() => setActiveTab('capabilities')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'capabilities'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white opacity-70 hover:opacity-100'
                  }`}
                >
                  🧠 القدرات
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white opacity-70 hover:opacity-100'
                  }`}
                >
                  📊 التحليلات
                </button>
              </div>
            </div>

            {/* المحتوى */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chat' && (
                <ChatTab
                  messages={messages}
                  isLoading={isLoading}
                  quickActions={quickActions}
                  onQuickAction={setInputMessage}
                  onCopyMessage={copyMessage}
                  onRateMessage={rateMessage}
                />
              )}

              {activeTab === 'capabilities' && (
                <CapabilitiesTab
                  capabilities={aiCapabilities}
                  onExampleClick={setInputMessage}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab
                  nodeId={nodeId}
                  culturalContext={culturalContext}
                />
              )}
            </div>

            {/* منطقة الإدخال */}
            {activeTab === 'chat' && (
              <div className="p-4 border-t border-border bg-surface">
                <div className="flex items-end space-x-2 space-x-reverse">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="اسأل المساعد الذكي أي شيء..."
                      className="w-full form-input resize-none min-h-[44px] max-h-32 text-sm rounded-xl"
                      rows={1}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex space-x-1 space-x-reverse">
                    <button
                      onClick={() => setIsListening(!isListening)}
                      className={`p-3 rounded-xl transition-colors ${
                        isListening
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title={isListening ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// مكون تبويب المحادثة
function ChatTab({
  messages,
  isLoading,
  quickActions,
  onQuickAction,
  onCopyMessage,
  onRateMessage
}: {
  messages: Message[];
  isLoading: boolean;
  quickActions: any[];
  onQuickAction: (text: string) => void;
  onCopyMessage: (content: string) => void;
  onRateMessage: (messageId: string, rating: 'up' | 'down') => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.isUser
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md'
                  : 'bg-surface text-text border border-border rounded-2xl rounded-bl-md'
              } p-4 shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm arabic-text leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* معلومات إضافية للرسائل الذكية */}
                  {message.metadata && (
                    <div className="mt-3 pt-3 border-t border-opacity-20 border-white">
                      {message.metadata.confidence && (
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <Star className="w-3 h-3" />
                          <span className="text-xs">دقة الإجابة: {Math.round(message.metadata.confidence * 100)}%</span>
                        </div>
                      )}
                      {message.metadata.relatedTopics && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.metadata.relatedTopics.map((topic, index) => (
                            <span key={index} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* أزرار التفاعل */}
                {!message.isUser && (
                  <div className="flex items-center space-x-1 space-x-reverse mr-2">
                    <button
                      onClick={() => onCopyMessage(message.content)}
                      className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                      title="نسخ"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRateMessage(message.id, 'up')}
                      className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                      title="مفيد"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRateMessage(message.id, 'down')}
                      className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                      title="غير مفيد"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <p className={`text-xs mt-2 flex items-center space-x-1 space-x-reverse ${
                message.isUser ? 'text-white opacity-70' : 'text-textSecondary'
              }`}>
                <Clock className="w-3 h-3" />
                <span>
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </p>
            </div>
          </motion.div>
        ))}

        {/* مؤشر الكتابة */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-surface text-text border border-border rounded-2xl rounded-bl-md p-4 shadow-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Bot className="w-4 h-4 animate-pulse text-purple-600" />
                <span className="text-sm arabic-text">يفكر ويحلل...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* الإجراءات السريعة */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-border bg-surface">
          <p className="text-xs text-textSecondary arabic-text mb-3 flex items-center">
            <Zap className="w-3 h-3 ml-1" />
            إجراءات سريعة:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onQuickAction(action.text)}
                className="flex items-center space-x-2 space-x-reverse p-3 bg-background hover:bg-border rounded-xl text-sm text-textSecondary hover:text-text transition-all group"
              >
                <action.icon className="w-4 h-4 group-hover:text-purple-600" />
                <span className="arabic-text">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// مكون تبويب القدرات
function CapabilitiesTab({
  capabilities,
  onExampleClick
}: {
  capabilities: AICapability[];
  onExampleClick: (text: string) => void;
}) {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text arabic-text mb-2">🧠 قدرات الذكاء الاصطناعي</h3>
        <p className="text-sm text-textSecondary arabic-text">اكتشف ما يمكنني فعله لمساعدتك في التعلم</p>
      </div>

      <div className="space-y-4">
        {capabilities.map((capability) => (
          <motion.div
            key={capability.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className={`w-12 h-12 bg-gradient-to-r ${capability.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <capability.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-text arabic-text mb-1">{capability.name}</h4>
                <p className="text-sm text-textSecondary arabic-text mb-3">{capability.description}</p>

                <div className="space-y-1">
                  <p className="text-xs text-textSecondary arabic-text mb-2">أمثلة:</p>
                  {capability.examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => onExampleClick(example)}
                      className="block w-full text-right p-2 bg-background hover:bg-border rounded-lg text-xs text-textSecondary hover:text-text transition-colors arabic-text"
                    >
                      ""{example}""
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center space-x-2 space-x-reverse mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-purple-800 dark:text-purple-200 arabic-text">ميزات متقدمة</h4>
        </div>
        <ul className="text-sm text-purple-700 dark:text-purple-300 arabic-text space-y-1">
          <li>• تعلم من تفاعلاتك وتحسن مع الوقت</li>
          <li>• دعم أكثر من 50 لغة ولهجة</li>
          <li>• تكامل مع جميع أدوات المنصة</li>
          <li>• حماية خصوصية متقدمة</li>
        </ul>
      </div>
    </div>
  );
}

// مكون تبويب التحليلات
function AnalyticsTab({
  nodeId,
  culturalContext
}: {
  nodeId?: string;
  culturalContext?: any;
}) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/ai/analytics?nodeId=${nodeId}`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [nodeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-textSecondary arabic-text">جاري تحليل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text arabic-text mb-2">📊 تحليلات الذكاء الاصطناعي</h3>
        <p className="text-sm text-textSecondary arabic-text">إحصائيات استخدامك للمساعد الذكي</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">إجمالي الأسئلة</p>
              <p className="text-2xl font-bold">{analytics?.totalQuestions || 0}</p>
            </div>
            <MessageCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">معدل الرضا</p>
              <p className="text-2xl font-bold">{analytics?.satisfactionRate || 0}%</p>
            </div>
            <Star className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">وقت الاستجابة</p>
              <p className="text-2xl font-bold">{analytics?.avgResponseTime || 0}ث</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">المواضيع المفضلة</p>
              <p className="text-2xl font-bold">{analytics?.topTopics?.length || 0}</p>
            </div>
            <Target className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-2xl p-4">
          <h4 className="font-semibold text-text arabic-text mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 ml-2" />
            المواضيع الأكثر استخداماً
          </h4>
          <div className="space-y-2">
            {(analytics?.topTopics || []).slice(0, 5).map((topic: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-text arabic-text">{topic.name}</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{ width: `${topic.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-textSecondary">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <h4 className="font-semibold text-text arabic-text mb-3 flex items-center">
            <Globe className="w-4 h-4 ml-2" />
            التخصيص الثقافي
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-textSecondary">المنطقة:</span>
              <span className="text-text arabic-text">{culturalContext?.region || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textSecondary">اللغة:</span>
              <span className="text-text arabic-text">{culturalContext?.language || 'العربية'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textSecondary">المستوى:</span>
              <span className="text-text arabic-text">{culturalContext?.level || 'متوسط'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}