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
  Square,
  Maximize,
  Minimize,
  Monitor,
  Smartphone,
  Tablet
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
  const [viewMode, setViewMode] = useState<'compact' | 'large' | 'fullscreen'>('compact');
  const [whiteboardSize, setWhiteboardSize] = useState<'small' | 'medium' | 'large'>('medium');

  // حفظ واستعادة تفضيلات المستخدم
  useEffect(() => {
    // استعادة التفضيلات المحفوظة
    const savedViewMode = localStorage.getItem('marjan_view_mode') as 'compact' | 'large' | 'fullscreen';
    const savedWhiteboardSize = localStorage.getItem('marjan_whiteboard_size') as 'small' | 'medium' | 'large';
    const savedVoiceEnabled = localStorage.getItem('marjan_voice_enabled');
    const savedShowWhiteboard = localStorage.getItem('marjan_show_whiteboard');

    if (savedViewMode) setViewMode(savedViewMode);
    if (savedWhiteboardSize) setWhiteboardSize(savedWhiteboardSize);
    if (savedVoiceEnabled !== null) setVoiceEnabled(savedVoiceEnabled === 'true');
    if (savedShowWhiteboard !== null) setShowWhiteboard(savedShowWhiteboard === 'true');
  }, []);

  // حفظ التفضيلات عند التغيير
  useEffect(() => {
    localStorage.setItem('marjan_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('marjan_whiteboard_size', whiteboardSize);
  }, [whiteboardSize]);

  useEffect(() => {
    localStorage.setItem('marjan_voice_enabled', voiceEnabled.toString());
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem('marjan_show_whiteboard', showWhiteboard.toString());
  }, [showWhiteboard]);
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

  // تحديث حجم السبورة عند تغيير الإعدادات
  useEffect(() => {
    if (whiteboardRef.current && showWhiteboard) {
      const whiteboard = whiteboardRef.current.getWhiteboard();
      if (whiteboard) {
        // تأخير قصير للسماح للـ CSS بالتحديث
        setTimeout(() => {
          whiteboard.resize();
        }, 100);
      }
    }
  }, [viewMode, whiteboardSize, showWhiteboard]);

  // إعداد النظام الصوتي المحسن
  useEffect(() => {
    let tts: EnhancedTextToSpeech | null = null;

    const initTTS = () => {
      console.log('🎤 تهيئة النظام الصوتي المحسن...');

      tts = new EnhancedTextToSpeech({
        language: 'ar-SA',
        rate: 0.85, // سرعة مناسبة للفهم
        pitch: 1.1, // نبرة أعلى قليلاً للحيوية
        volume: 1.0 // أقصى مستوى صوت
      });

      // ربط السبورة مع النظام المتزامن
      if (whiteboardRef.current) {
        synchronizedTeacher.setWhiteboard(whiteboardRef.current);
      }

      // معالجات الأحداث المحسنة
      tts.onStart = () => {
        console.log('🎤 بدء النطق - تحديث حالة الواجهة');
        setIsTeachingWithVoice(true);
        setIsSpeaking(true);
      };

      tts.onEnd = () => {
        console.log('🎤 انتهاء النطق - تحديث حالة الواجهة');
        setIsTeachingWithVoice(false);
        setIsSpeaking(false);
      };

      tts.onError = (error) => {
        console.error('❌ خطأ في النطق:', error);
        setIsTeachingWithVoice(false);
        setIsSpeaking(false);

        // محاولة إعادة تهيئة النظام عند حدوث خطأ
        setTimeout(() => {
          console.log('🔄 إعادة تهيئة النظام بعد خطأ...');
          tts?.reinitialize();
        }, 1000);
      };

      tts.onPause = () => {
        console.log('⏸️ إيقاف مؤقت للنطق');
      };

      tts.onResume = () => {
        console.log('▶️ استئناف النطق');
      };

      // فحص حالة النظام بعد التهيئة
      setTimeout(() => {
        if (tts) {
          const status = tts.checkSpeechSynthesisStatus();
          console.log('📊 حالة النظام الصوتي بعد التهيئة:', status);

          if (status.voices === 0) {
            console.warn('⚠️ لم يتم تحميل أي أصوات، محاولة إعادة التحميل...');
            tts.reinitialize();
          }
        }
      }, 2000);

      setEnhancedTTS(tts);
      console.log('✅ تم تهيئة النظام الصوتي المحسن');
    };

    // تأخير التهيئة حتى يتم تحميل الصفحة بالكامل
    if (typeof window !== 'undefined') {
      // تأخير التهيئة قليلاً للتأكد من تحميل الصفحة
      setTimeout(initTTS, 100);
    }

    return () => {
      if (tts) {
        tts.stop();
      }
    };
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
            console.log('🎤 بدء نطق الرد:', data.response.substring(0, 50) + '...');

            // فحص حالة النظام الصوتي قبل البدء
            const status = enhancedTTS.checkSpeechSynthesisStatus();
            console.log('📊 حالة النظام الصوتي:', status);

            if (!status.available) {
              console.warn('⚠️ النظام الصوتي غير متاح، إعادة تهيئة...');
              enhancedTTS.reinitialize();
            }

            // استخدام النطق مع إعادة المحاولة
            await enhancedTTS.speakWithRetry(data.response, {
              rate: 0.85,
              pitch: 1.1,
              volume: 1.0
            });

            console.log('✅ تم إنهاء النطق بنجاح');

          } catch (error) {
            console.error('❌ خطأ في النطق المحسن:', error);

            // محاولة إعادة تهيئة النظام
            try {
              console.log('🔄 محاولة إعادة تهيئة النظام الصوتي...');
              enhancedTTS.reinitialize();

              // محاولة أخيرة بإعدادات أبسط
              await enhancedTTS.speak(data.response, {
                rate: 0.9,
                pitch: 1.0,
                volume: 1.0
              });

            } catch (retryError) {
              console.error('❌ فشل في إعادة المحاولة:', retryError);
              // العودة للنطق العادي كبديل أخير
              speakText(data.response);
            }
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

  // وظائف التفاعل الصوتي المحسنة
  const startListening = async () => {
    // تحديد نوع الجهاز
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    console.log('🎤 محاولة بدء التعرف على الكلام...', { isMobile });

    if (typeof window !== 'undefined') {
      // طلب إذن الميكروفون أولاً (مهم للهواتف)
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ تم الحصول على إذن الميكروفون');
      } catch (error) {
        console.error('❌ فشل في الحصول على إذن الميكروفون:', error);
        alert('يرجى السماح بالوصول للميكروفون لاستخدام هذه الميزة');
        return;
      }

      // التحقق من دعم التعرف على الكلام
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        // إعدادات محسنة حسب نوع الجهاز
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = isMobile; // تفعيل النتائج المؤقتة للهواتف
        recognition.maxAlternatives = 3;

        // إعدادات إضافية للهواتف
        if (isMobile) {
          recognition.serviceURI = 'wss://www.google.com/speech-api/v2/recognize';
        }

        recognition.onstart = () => {
          console.log('🎤 بدء التعرف على الكلام');
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          console.log('🎤 نتيجة التعرف:', event.results);
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          if (event.results[0].isFinal) {
            setIsListening(false);
          }
        };

        recognition.onerror = (event) => {
          console.error('❌ خطأ في التعرف على الكلام:', event.error);
          setIsListening(false);

          // رسائل خطأ مخصصة
          const errorMessages = {
            'network': 'مشكلة في الاتصال بالإنترنت',
            'not-allowed': 'لم يتم السماح بالوصول للميكروفون',
            'no-speech': 'لم يتم اكتشاف كلام',
            'audio-capture': 'مشكلة في الميكروفون',
            'service-not-allowed': 'خدمة التعرف على الكلام غير متاحة'
          };

          const message = errorMessages[event.error as keyof typeof errorMessages] || 'حدث خطأ في التعرف على الكلام';
          alert(message);
        };

        recognition.onend = () => {
          console.log('🎤 انتهاء التعرف على الكلام');
          setIsListening(false);
        };

        try {
          recognition.start();
        } catch (error) {
          console.error('❌ فشل في بدء التعرف:', error);
          setIsListening(false);
          alert('فشل في بدء التعرف على الكلام');
        }
      } else {
        console.warn('⚠️ التعرف على الكلام غير مدعوم');
        alert('المتصفح لا يدعم التعرف على الكلام');
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      console.log('🔊 استخدام النطق العادي كبديل احتياطي');

      // إيقاف أي نطق سابق
      speechSynthesis.cancel();

      setIsSpeaking(true);

      // تنظيف النص
      const cleanText = text
        .replace(/[#*_`\[\]{}|\\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // إعدادات محسنة للغة العربية مع فحص القيم
      utterance.lang = 'ar-SA';
      
      // فحص وتصحيح قيمة rate
      let rate = 0.8; // أبطأ للوضوح
      if (typeof rate !== 'number' || isNaN(rate) || !isFinite(rate)) {
        console.warn('⚠️ قيمة rate غير صحيحة:', rate, 'سيتم استخدام القيمة الافتراضية 0.8');
        rate = 0.8;
      }
      rate = Math.max(0.1, Math.min(2.0, rate));
      utterance.rate = rate;
      
      // فحص وتصحيح قيمة pitch
      let pitch = 1.0;
      if (typeof pitch !== 'number' || isNaN(pitch) || !isFinite(pitch)) {
        console.warn('⚠️ قيمة pitch غير صحيحة:', pitch, 'سيتم استخدام القيمة الافتراضية 1.0');
        pitch = 1.0;
      }
      pitch = Math.max(0.0, Math.min(2.0, pitch));
      utterance.pitch = pitch;
      
      // فحص وتصحيح قيمة volume
      let volume = 1.0;
      if (typeof volume !== 'number' || isNaN(volume) || !isFinite(volume)) {
        console.warn('⚠️ قيمة volume غير صحيحة:', volume, 'سيتم استخدام القيمة الافتراضية 1.0');
        volume = 1.0;
      }
      volume = Math.max(0.0, Math.min(1.0, volume));
      utterance.volume = volume;

      // البحث عن صوت عربي مناسب
      const voices = speechSynthesis.getVoices();
      const arabicVoice = voices.find(voice =>
        voice.lang.startsWith('ar') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('ar'));

      if (arabicVoice) {
        utterance.voice = arabicVoice;
        console.log('🎤 استخدام الصوت العربي:', arabicVoice.name);
      } else {
        console.warn('⚠️ لم يتم العثور على صوت عربي مناسب');
      }

      utterance.onstart = () => {
        console.log('🎤 بدء النطق العادي');
      };

      utterance.onend = () => {
        console.log('🎤 انتهاء النطق العادي');
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('❌ خطأ في النطق العادي:', event.error);
        setIsSpeaking(false);
      };

      // بدء النطق مع تأخير قصير
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 100);
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

  // حساب أبعاد النافذة بناءً على وضع العرض
  const getWindowDimensions = () => {
    if (viewMode === 'fullscreen') {
      return 'inset-4';
    } else if (viewMode === 'large') {
      return showWhiteboard ? 'w-[1600px] h-[900px]' : 'w-[500px] h-[700px]';
    } else {
      return showWhiteboard ? 'w-[1400px] h-[800px]' : 'w-96 h-[600px]';
    }
  };

  const getPosition = () => {
    if (viewMode === 'fullscreen') {
      return 'fixed';
    } else {
      return 'fixed bottom-6 right-6';
    }
  };

  return (
    <div className={`${getPosition()} ${getWindowDimensions()} bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex ${showWhiteboard ? 'flex-row' : 'flex-col'} z-50 transition-all duration-300 ${className} ${viewMode === 'fullscreen' ? 'bg-opacity-95 backdrop-blur-sm' : ''}`}>
      {/* رأس النافذة */}
      <div className={`flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 text-white ${showWhiteboard ? 'rounded-tl-lg' : 'rounded-t-lg'}`}>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="relative">
            <Bot className="w-7 h-7" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg">مرجان</h3>
            <p className="text-sm opacity-90">معلمك الافتراضي</p>
          </div>
        </div>
        <div className={`flex items-center ${showWhiteboard ? 'space-x-1' : 'space-x-2'} space-x-reverse`}>
          {/* أزرار التحكم في حجم النافذة */}
          <div className={`flex items-center ${showWhiteboard ? 'space-x-0.5' : 'space-x-1'} space-x-reverse border-l border-white border-opacity-30 pl-1 ml-1`}>
            <button
              onClick={() => setViewMode(viewMode === 'compact' ? 'large' : viewMode === 'large' ? 'fullscreen' : 'compact')}
              className={`transition-colors rounded-lg ${showWhiteboard ? 'p-1' : 'p-2'} hover:bg-white hover:bg-opacity-20`}
              title={viewMode === 'compact' ? 'تكبير النافذة' : viewMode === 'large' ? 'ملء الشاشة' : 'تصغير النافذة'}
            >
              {viewMode === 'compact' ? <Tablet className="w-4 h-4" /> :
               viewMode === 'large' ? <Monitor className="w-4 h-4" /> :
               <Smartphone className="w-4 h-4" />}
            </button>
            {/* زر تغيير حجم السبورة */}
            {showWhiteboard && (
              <button
                onClick={() => setWhiteboardSize(
                  whiteboardSize === 'small' ? 'medium' :
                  whiteboardSize === 'medium' ? 'large' : 'small'
                )}
                className="transition-colors rounded-lg p-1 hover:bg-white hover:bg-opacity-20"
                title={`حجم السبورة: ${whiteboardSize === 'small' ? 'صغير' : whiteboardSize === 'medium' ? 'متوسط' : 'كبير'}`}
              >
                <span className="text-xs font-bold">
                  {whiteboardSize === 'small' ? 'S' : whiteboardSize === 'medium' ? 'M' : 'L'}
                </span>
              </button>
            )}
          </div>
          {/* زر السبورة */}
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`transition-colors rounded-lg ${showWhiteboard ? 'p-1' : 'p-2'} hover:bg-white hover:bg-opacity-20 ${showWhiteboard ? 'bg-white bg-opacity-20' : ''}`}
            title={showWhiteboard ? 'إخفاء السبورة' : 'إظهار السبورة'}
          >
            {showWhiteboard ? <EyeOff className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
          </button>
          {/* زر إعدادات التدريس */}
          <div className="relative">
            <button
              onClick={() => setShowMethodSelector(!showMethodSelector)}
              className={`transition-colors rounded-lg ${showWhiteboard ? 'p-1' : 'p-2'} hover:bg-white hover:bg-opacity-20 ${showMethodSelector ? 'bg-white bg-opacity-20' : ''}`}
              title="اختيار طريقة التدريس"
            >
              <Settings className="w-4 h-4" />
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
            <div className="flex items-center space-x-0.5 space-x-reverse border-l border-white border-opacity-30 pl-1 ml-1">
              {!isTeachingWithVoice ? (
                <div className="flex items-center space-x-0.5 space-x-reverse">
                  <button
                    onClick={() => startSynchronizedDemo('pythagoras')}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="عرض توضيحي: نظرية فيثاغورس"
                  >
                    <span className="text-xs">📐</span>
                  </button>
                  <button
                    onClick={() => startSynchronizedDemo('chemical_reaction')}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="عرض توضيحي: التفاعلات الكيميائية"
                  >
                    <span className="text-xs">🧪</span>
                  </button>
                  <button
                    onClick={() => startSynchronizedDemo('photosynthesis')}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="عرض توضيحي: البناء الضوئي"
                  >
                    <span className="text-xs">🌱</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={pauseSynchronizedDemo}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="إيقاف مؤقت"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                  <button
                    onClick={stopSynchronizedDemo}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="إيقاف العرض"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
          {/* أزرار التحكم في الصوت */}
          <div className={`flex items-center ${showWhiteboard ? 'space-x-0.5' : 'space-x-1'} space-x-reverse`}>
            {/* زر اختبار الصوت */}
            <button
              onClick={async () => {
                if (enhancedTTS && voiceEnabled) {
                  try {
                    await enhancedTTS.speakWithRetry('مرحباً، أنا مرجان معلمك الافتراضي. النظام الصوتي يعمل بشكل صحيح.');
                  } catch (error) {
                    console.error('فشل اختبار الصوت:', error);
                    speakText('اختبار الصوت');
                  }
                }
              }}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="اختبار النظام الصوتي"
              disabled={!voiceEnabled || isSpeaking}
            >
              <span className="text-xs">🎵</span>
            </button>
            {/* زر تشغيل/إيقاف الصوت */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title={voiceEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          {/* زر الإغلاق */}
          <button
            onClick={() => setIsOpen(false)}
            className={`transition-colors rounded-lg ${showWhiteboard ? 'p-1' : 'p-2'} hover:bg-white hover:bg-opacity-20`}
          >
            <X className="w-4 h-4" />
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
        <div className={`${
          showWhiteboard ?
            (viewMode === 'fullscreen' ? 'w-2/5' :
             whiteboardSize === 'small' ? 'w-3/5' :
             whiteboardSize === 'medium' ? 'w-1/2' : 'w-2/5') + ' border-l border-gray-200 dark:border-gray-700'
            : 'w-full'
        } flex flex-col`}>
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
        
        {(isSpeaking || isTeachingWithVoice) && (
          <div className="flex justify-start">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Volume2 className="w-4 h-4 animate-pulse text-green-600" />
                <span className="text-sm font-medium">
                  {isTeachingWithVoice ? '🎤 مرجان يشرح بالصوت...' : '🗣️ مرجان يتحدث...'}
                </span>
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{animationDelay: '300ms'}}></div>
                </div>
                <button
                  onClick={() => {
                    stopSpeaking();
                    if (enhancedTTS) {
                      enhancedTTS.stop();
                    }
                  }}
                  className="text-xs underline hover:no-underline text-red-600 hover:text-red-800"
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
          <div className={`${
            viewMode === 'fullscreen' ? 'w-3/5' :
            whiteboardSize === 'small' ? 'w-2/5' :
            whiteboardSize === 'medium' ? 'w-1/2' : 'w-3/5'
          } bg-gray-50 dark:bg-gray-900 ${viewMode === 'fullscreen' ? '' : 'rounded-tr-lg'} flex flex-col`}>

            {/* رأس السبورة مع أدوات إضافية */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 border-b border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <PenTool className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    السبورة التفاعلية
                  </span>
                  <div className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    {whiteboardSize === 'small' ? 'صغير' : whiteboardSize === 'medium' ? 'متوسط' : 'كبير'}
                  </div>
                </div>

                <div className="flex items-center space-x-1 space-x-reverse">
                  {/* زر تجربة سريعة */}
                  <button
                    onClick={async () => {
                      if (whiteboardRef.current) {
                        try {
                          await whiteboardRef.current.executeFunction('clear_whiteboard', {});
                          await whiteboardRef.current.executeFunction('write_text', {
                            x: 100, y: 100,
                            text: 'مرحباً! هذه السبورة التفاعلية 🎨',
                            size: 18,
                            color: '#0066cc'
                          });
                        } catch (error) {
                          console.error('خطأ في التجربة السريعة:', error);
                        }
                      }
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs"
                    title="تجربة سريعة"
                  >
                    ✨
                  </button>

                  {/* زر مسح السبورة */}
                  <button
                    onClick={() => whiteboardRef.current?.clear()}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs"
                    title="مسح السبورة"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* منطقة السبورة */}
            <div className="flex-1 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg h-full shadow-inner border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                <MarjanWhiteboard
                  ref={whiteboardRef}
                  className="h-full w-full"
                  showControls={true}
                />
              </div>
            </div>

            {/* شريط معلومات السبورة */}
            <div className="bg-gray-100 dark:bg-gray-800 p-2 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span>💡 نصيحة: اطلب من مرجان أن يرسم أو يوضح المفاهيم على السبورة</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-xs">
                  <span className={`px-2 py-1 rounded ${
                    viewMode === 'compact' ? 'bg-blue-100 text-blue-700' :
                    viewMode === 'large' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {viewMode === 'compact' ? '📱 مضغوط' :
                     viewMode === 'large' ? '💻 كبير' : '🖥️ ملء الشاشة'}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                    📐 {whiteboardSize === 'small' ? 'صغير' : whiteboardSize === 'medium' ? 'متوسط' : 'كبير'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
