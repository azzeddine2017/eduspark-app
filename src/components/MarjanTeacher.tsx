'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MarjanWhiteboard, { MarjanWhiteboardRef } from './MarjanWhiteboard';
import { synchronizedTeacher, TEACHING_SCRIPTS } from '@/lib/synchronized-teaching';
import { EnhancedTextToSpeech } from '@/lib/enhanced-speech';
import {
  Bot,
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
  EyeOff,
  Settings,
  Pause,
  Square
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
    teachingMethod?: string;
    methodReasoning?: string;
    nextSteps?: string[];
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
  const [preferredMethod, setPreferredMethod] = useState<string>('auto');
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [enhancedTTS, setEnhancedTTS] = useState<EnhancedTextToSpeech | null>(null);
  const [isTeachingWithVoice, setIsTeachingWithVoice] = useState(false);
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

  // إغلاق قائمة اختيار المنهجية عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMethodSelector) {
        const target = e.target as Element;
        if (!target.closest('.method-selector')) {
          setShowMethodSelector(false);
        }
      }
    };

    if (showMethodSelector) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMethodSelector]);

  // إعداد النظام الصوتي المحسن
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tts = new EnhancedTextToSpeech({
        language: 'ar-SA',
        rate: 0.85,
        pitch: 1.1,
        volume: 1.0
      });

      // ربط السبورة مع النظام المتزامن
      if (whiteboardRef.current) {
        synchronizedTeacher.setWhiteboard(whiteboardRef.current);
      }

      // معالجات الأحداث
      tts.onStart = () => {
        setIsTeachingWithVoice(true);
      };

      tts.onEnd = () => {
        setIsTeachingWithVoice(false);
      };

      tts.onError = (error) => {
        console.error('خطأ في النطق:', error);
        setIsTeachingWithVoice(false);
      };

      setEnhancedTTS(tts);
    }
  }, []);

  // وظائف التحكم في العروض التوضيحية
  const startSynchronizedDemo = async (scriptName: string) => {
    if (!whiteboardRef.current || !enhancedTTS) {
      console.error('السبورة أو النظام الصوتي غير جاهز');
      return;
    }

    const script = TEACHING_SCRIPTS[scriptName];
    if (!script) {
      console.error('السكريبت غير موجود:', scriptName);
      return;
    }

    try {
      setIsTeachingWithVoice(true);

      // ربط السبورة مع النظام المتزامن
      synchronizedTeacher.setWhiteboard(whiteboardRef.current);

      // معالجات الأحداث
      synchronizedTeacher.onSegmentStart = (segment, index) => {
        console.log(`🎬 بدء القطعة ${index + 1}: ${segment.text.substring(0, 30)}...`);
      };

      synchronizedTeacher.onTeachingComplete = () => {
        setIsTeachingWithVoice(false);
        console.log('🎉 انتهى العرض التوضيحي');
      };

      synchronizedTeacher.onTeachingError = (error) => {
        setIsTeachingWithVoice(false);
        console.error('❌ خطأ في العرض:', error);
      };

      // بدء العرض
      await synchronizedTeacher.startTeaching(script);

    } catch (error) {
      setIsTeachingWithVoice(false);
      console.error('خطأ في بدء العرض التوضيحي:', error);
    }
  };

  const stopSynchronizedDemo = () => {
    synchronizedTeacher.stopTeaching();
    setIsTeachingWithVoice(false);
  };

  const pauseSynchronizedDemo = () => {
    synchronizedTeacher.pauseTeaching();
  };

  const resumeSynchronizedDemo = () => {
    synchronizedTeacher.resumeTeaching();
  };

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
            whiteboardAvailable: showWhiteboard,
            preferredMethod: preferredMethod === 'auto' ? undefined : preferredMethod,
            previousAttempts: messages.filter(m => m.isUser).length
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
          metadata: {
            ...data.metadata,
            teachingMethod: data.teachingMethod,
            methodReasoning: data.methodReasoning
          }
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

        // تشغيل الصوت المحسن إذا كان مفعلاً
        if (voiceEnabled && data.response && enhancedTTS) {
          try {
            await enhancedTTS.speak(data.response);
          } catch (error) {
            console.error('خطأ في النطق المحسن:', error);
            // العودة للنطق العادي كبديل
            speakText(data.response);
          }
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // وظائف التفاعل الصوتي (مبسطة للنموذج الأولي)
  const startListening = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
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

          {/* زر إعدادات التدريس */}
          <div className="relative">
            <button
              onClick={() => setShowMethodSelector(!showMethodSelector)}
              className={`p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors ${
                showMethodSelector ? 'bg-white bg-opacity-20' : ''
              }`}
              title="اختيار طريقة التدريس"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showMethodSelector && (
              <div className="method-selector absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] z-50">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  طريقة التدريس المفضلة:
                </div>
                <select
                  value={preferredMethod}
                  onChange={(e) => setPreferredMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="auto">اختيار تلقائي ذكي</option>
                  <option value="socratic">الطريقة السقراطية</option>
                  <option value="direct_instruction">التعليم المباشر</option>
                  <option value="worked_example">المثال المحلول</option>
                  <option value="problem_based">التعلم بالمشكلات</option>
                  <option value="narrative">التعلم السردي</option>
                  <option value="scaffolding">السقالات التعليمية</option>
                  <option value="visual_demo">العرض البصري</option>
                  <option value="analogy_based">التعلم بالتشبيه</option>
                </select>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {preferredMethod === 'auto' ? 'مرجان سيختار أفضل طريقة حسب السؤال' :
                   preferredMethod === 'socratic' ? 'أسئلة توجيهية لتطوير التفكير' :
                   preferredMethod === 'direct_instruction' ? 'شرح مباشر وواضح' :
                   preferredMethod === 'worked_example' ? 'حل مثال خطوة بخطوة' :
                   preferredMethod === 'problem_based' ? 'تعلم من خلال مشاكل واقعية' :
                   preferredMethod === 'narrative' ? 'تعلم من خلال القصص' :
                   preferredMethod === 'scaffolding' ? 'دعم تدريجي متناقص' :
                   preferredMethod === 'visual_demo' ? 'توضيح بصري تفاعلي' :
                   'تعلم من خلال التشبيهات'}
                </div>
              </div>
            )}
          </div>

          {/* أزرار التحكم في العروض التوضيحية */}
          {showWhiteboard && (
            <div className="flex items-center space-x-1 space-x-reverse border-l border-white border-opacity-30 pl-2 ml-2">
              {!isTeachingWithVoice ? (
                <div className="flex items-center space-x-1 space-x-reverse">
                  <button
                    onClick={() => startSynchronizedDemo('pythagoras')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="عرض توضيحي: نظرية فيثاغورس"
                  >
                    <span className="text-xs">📐</span>
                  </button>
                  <button
                    onClick={() => startSynchronizedDemo('chemical_reaction')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="عرض توضيحي: التفاعلات الكيميائية"
                  >
                    <span className="text-xs">🧪</span>
                  </button>
                  <button
                    onClick={() => startSynchronizedDemo('photosynthesis')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="عرض توضيحي: البناء الضوئي"
                  >
                    <span className="text-xs">🌱</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={pauseSynchronizedDemo}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="إيقاف مؤقت"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                  <button
                    onClick={stopSynchronizedDemo}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="إيقاف العرض"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

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

      {/* مؤشر العرض التوضيحي */}
      {isTeachingWithVoice && (
        <div className="absolute top-16 left-4 z-10">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">🎤 مرجان يشرح...</span>
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-white rounded animate-pulse" style={{animationDelay: '0ms'}}></div>
              <div className="w-1 h-4 bg-white rounded animate-pulse" style={{animationDelay: '150ms'}}></div>
              <div className="w-1 h-4 bg-white rounded animate-pulse" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      )}

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
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {getMessageIcon(message.type)}
                    <span className="text-xs font-medium opacity-70">
                      {message.type === 'socratic' ? 'سؤال توجيهي' :
                       message.type === 'explanation' ? 'شرح' :
                       message.type === 'encouragement' ? 'تشجيع' : 'مرجان'}
                    </span>
                  </div>
                  {message.metadata?.teachingMethod && (
                    <div className="text-xs opacity-60 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {message.metadata.teachingMethod === 'socratic' ? '🤔 سقراطية' :
                       message.metadata.teachingMethod === 'direct_instruction' ? '📚 مباشر' :
                       message.metadata.teachingMethod === 'worked_example' ? '📝 مثال' :
                       message.metadata.teachingMethod === 'problem_based' ? '🎯 مشكلة' :
                       message.metadata.teachingMethod === 'narrative' ? '📖 قصة' :
                       message.metadata.teachingMethod === 'scaffolding' ? '🏗️ سقالات' :
                       message.metadata.teachingMethod === 'visual_demo' ? '🎨 بصري' :
                       message.metadata.teachingMethod === 'analogy_based' ? '🔗 تشبيه' : '🤖'}
                    </div>
                  )}
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
              onKeyDown={handleKeyDown}
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
