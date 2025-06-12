'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MarjanWhiteboard, { MarjanWhiteboardRef } from './MarjanWhiteboard';
import {
  Bot,
  MessageCircle,
  X,
  Send,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Lightbulb,
  BookOpen,
  Brain,
  Sparkles,
  PenTool,
  Eye,
  EyeOff
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'socratic' | 'explanation' | 'encouragement';
  metadata?: {
    subject?: string;
    concept?: string;
    difficulty?: number;
    requiresVisual?: boolean;
  };
}

interface MarjanTeacherProps {
  className?: string;
  initialTopic?: string;
  studentLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export default function MarjanTeacher({ 
  className = '',
  initialTopic,
  studentLevel = 'intermediate'
}: MarjanTeacherProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `مرحباً! 👋 أنا مرجان، معلمك الافتراضي في منصة فتح.\n\n🌟 **أسلوبي في التعليم:**\n• أطرح أسئلة توجيهية لأساعدك على الاكتشاف\n• أستخدم أمثلة من الحياة اليومية\n• أرسم وأوضح المفاهيم بصرياً\n• أتذكر تقدمك وأتكيف مع مستواك\n\n💡 **نصيحة:** لا تتردد في قول "لا أفهم" - هذا يساعدني على تبسيط الشرح أكثر!\n\nما الموضوع الذي تود أن نستكشفه معاً اليوم؟`,
      isUser: false,
      timestamp: new Date(),
      type: 'explanation'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const whiteboardRef = useRef<MarjanWhiteboardRef>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // إضافة رسالة ترحيب خاصة بالموضوع المحدد
  useEffect(() => {
    if (initialTopic && messages.length === 1) {
      const topicMessage: Message = {
        id: '2',
        content: `رائع! أرى أنك مهتم بموضوع "${initialTopic}". هذا موضوع شيق جداً!\n\nدعني أسألك أولاً: ما الذي تعرفه بالفعل عن ${initialTopic}؟ 🤔`,
        isUser: false,
        timestamp: new Date(),
        type: 'socratic',
        metadata: {
          subject: 'general',
          concept: initialTopic,
          difficulty: 3
        }
      };
      setMessages(prev => [...prev, topicMessage]);
    }
  }, [initialTopic, messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // استدعاء API مرجان المتخصص
      const response = await fetch('/api/marjan/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-5), // آخر 5 رسائل للسياق
          studentLevel,
          initialTopic,
          context: {
            sessionId: session?.user?.id || 'anonymous',
            timestamp: new Date().toISOString(),
            whiteboardAvailable: showWhiteboard
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const marjanMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          type: data.type || 'text',
          metadata: data.metadata
        };

        setMessages(prev => [...prev, marjanMessage]);

        // تنفيذ وظائف السبورة إذا كانت موجودة
        if (data.whiteboardFunctions && whiteboardRef.current && showWhiteboard) {
          for (const func of data.whiteboardFunctions) {
            try {
              await whiteboardRef.current.executeFunction(func.name, func.parameters);
            } catch (error) {
              console.error('خطأ في تنفيذ وظيفة السبورة:', error);
            }
          }
        }

        // تشغيل الصوت إذا كان مفعلاً
        if (voiceEnabled && data.response) {
          speakText(data.response);
        }
      } else {
        throw new Error(data.error || 'حدث خطأ في الاتصال');
      }
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
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

  // وظائف التفاعل الصوتي (مبسطة للنموذج الأولي)
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('المتصفح لا يدعم التعرف على الكلام');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'socratic':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'explanation':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'encouragement':
        return <Sparkles className="w-4 h-4 text-green-500" />;
      default:
        return <Brain className="w-4 h-4 text-purple-500" />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${className}`}
        title="تحدث مع مرجان المعلم"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 ${showWhiteboard ? 'w-[1200px] h-[700px]' : 'w-96 h-[600px]'} bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex ${showWhiteboard ? 'flex-row' : 'flex-col'} z-50 transition-all duration-300 ${className}`}>
      {/* رأس النافذة */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 text-white ${showWhiteboard ? 'rounded-tl-lg' : 'rounded-t-lg'}`}>
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="relative">
            <Bot className="w-8 h-8" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg">مرجان</h3>
            <p className="text-sm opacity-90">معلمك الافتراضي</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          {/* زر السبورة */}
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors ${
              showWhiteboard ? 'bg-white bg-opacity-20' : ''
            }`}
            title={showWhiteboard ? 'إخفاء السبورة' : 'إظهار السبورة'}
          >
            {showWhiteboard ? <EyeOff className="w-5 h-5" /> : <PenTool className="w-5 h-5" />}
          </button>

          {/* زر الصوت */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            title={voiceEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          {/* زر الإغلاق */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden">
        {/* منطقة المحادثة */}
        <div className={`${showWhiteboard ? 'w-1/2 border-l border-gray-200 dark:border-gray-700' : 'w-full'} flex flex-col`}>
          {/* منطقة الرسائل */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {!message.isUser && (
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  {getMessageIcon(message.type)}
                  <span className="text-xs font-medium opacity-70">
                    {message.type === 'socratic' ? 'سؤال توجيهي' : 
                     message.type === 'explanation' ? 'شرح' :
                     message.type === 'encouragement' ? 'تشجيع' : 'مرجان'}
                  </span>
                </div>
              )}
              
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              
              {message.metadata?.difficulty && (
                <div className="mt-2 text-xs opacity-60">
                  مستوى الصعوبة: {message.metadata.difficulty}/10
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">مرجان يفكر...</span>
              </div>
            </div>
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex justify-start">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span className="text-sm">مرجان يتحدث...</span>
                <button
                  onClick={stopSpeaking}
                  className="text-xs underline hover:no-underline"
                >
                  إيقاف
                </button>
              </div>
            </div>
          </div>
        )}
        
            <div ref={messagesEndRef} />
          </div>

          {/* منطقة الإدخال */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2 space-x-reverse">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اسأل مرجان أي شيء..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={2}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            {/* زر الميكروفون */}
            <button
              onClick={startListening}
              disabled={isLoading || isListening}
              className={`p-3 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="التحدث بالصوت"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            {/* زر الإرسال */}
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="إرسال الرسالة"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              اضغط Enter للإرسال • Shift+Enter لسطر جديد
            </div>
          </div>
        </div>

        {/* السبورة الافتراضية */}
        {showWhiteboard && (
          <div className="w-1/2 bg-gray-50 dark:bg-gray-900 rounded-tr-lg">
            <div className="h-full p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg h-full shadow-inner">
                <MarjanWhiteboard
                  ref={whiteboardRef}
                  className="h-full"
                  showControls={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
