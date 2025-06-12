# 🎤 مواصفات التفاعل الصوتي للمعلم الافتراضي
## تحويل التعلم إلى محادثة طبيعية

---

## 🎯 **الرؤية العامة**

### **الهدف:**
تمكين الطلاب من التفاعل مع المعلم الافتراضي بالصوت، مما يجعل التعلم أكثر طبيعية وإنسانية.

### **التجربة المستهدفة:**
```
الطالب: (يتحدث) "يا مرشد، لا أفهم الكسور"
المعلم: (يرد صوتياً) "أهلاً بك! الكسور موضوع مهم. 
         دعني أسألك، لو كان لديك بيتزا وأردت تقسيمها بينك وبين أخيك، 
         كيف ستقسمها؟"
الطالب: (يتحدث) "نصفين؟"
المعلم: (يرد صوتياً + يرسم على السبورة) "ممتاز! هذا بالضبط ما نسميه كسر النصف..."
```

---

## 🔧 **المكونات التقنية**

### **1. Speech-to-Text (تحويل الكلام إلى نص)**

#### **الخيارات المتاحة:**
```typescript
interface STTOptions {
  webSpeechAPI: {
    cost: 'مجاني',
    accuracy: 'جيد',
    languages: ['ar-SA', 'en-US'],
    limitations: 'يحتاج اتصال إنترنت، دقة متغيرة'
  },
  
  googleCloudSpeech: {
    cost: '$0.006 لكل 15 ثانية',
    accuracy: 'ممتاز',
    languages: ['ar-SA', 'ar-EG', 'ar-MA', 'en-US'],
    features: ['punctuation', 'speaker_diarization', 'word_timestamps']
  },
  
  azureSpeech: {
    cost: '$1 لكل ساعة',
    accuracy: 'ممتاز',
    languages: ['ar-SA', 'ar-EG', 'en-US'],
    features: ['real_time', 'custom_models', 'noise_reduction']
  }
}
```

#### **التطبيق المقترح:**
```typescript
// lib/speech-recognition.ts
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  
  constructor(
    private language: 'ar-SA' | 'en-US' = 'ar-SA',
    private continuous = true
  ) {
    this.initializeRecognition();
  }
  
  private initializeRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.lang = this.language;
      this.recognition.continuous = this.continuous;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }
  
  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }
      
      let finalTranscript = '';
      
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // إرسال النتائج المؤقتة للواجهة
        this.onInterimResult?.(interimTranscript);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        resolve(finalTranscript);
      };
      
      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };
      
      this.recognition.start();
      this.isListening = true;
    });
  }
  
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
  
  onInterimResult?: (transcript: string) => void;
}
```

### **2. Text-to-Speech (تحويل النص إلى كلام)**

#### **الخيارات المتاحة:**
```typescript
interface TTSOptions {
  webSpeechAPI: {
    cost: 'مجاني',
    quality: 'متوسط',
    voices: 'محدود للعربية',
    limitations: 'أصوات روبوتية'
  },
  
  googleCloudTTS: {
    cost: '$4 لكل مليون حرف',
    quality: 'ممتاز',
    voices: ['ar-XA-Wavenet-A', 'ar-XA-Wavenet-B', 'ar-XA-Wavenet-C'],
    features: ['SSML', 'custom_voice', 'emotion_control']
  },
  
  azureTTS: {
    cost: '$4 لكل مليون حرف',
    quality: 'ممتاز',
    voices: ['ar-SA-ZariyahNeural', 'ar-SA-HamedNeural'],
    features: ['neural_voices', 'emotion_styles', 'speaking_styles']
  }
}
```

#### **التطبيق المقترح:**
```typescript
// lib/text-to-speech.ts
export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  
  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }
  
  private loadVoices() {
    this.voices = this.synth.getVoices();
    
    // البحث عن صوت عربي مناسب
    this.selectedVoice = this.voices.find(voice => 
      voice.lang.startsWith('ar') && voice.name.includes('Female')
    ) || this.voices.find(voice => voice.lang.startsWith('ar')) || null;
    
    // إذا لم تكن الأصوات محملة بعد
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }
  
  async speak(text: string, options?: TTSOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }
      
      // تنظيف النص وتحسينه للنطق
      const cleanText = this.preprocessTextForSpeech(text);
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // إعداد الصوت
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      
      // إعداد الخصائص
      utterance.rate = options?.rate || 0.9; // سرعة أبطأ قليلاً للوضوح
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 1;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`));
      
      // إيقاف أي كلام سابق
      this.synth.cancel();
      
      // بدء النطق
      this.synth.speak(utterance);
    });
  }
  
  private preprocessTextForSpeech(text: string): string {
    return text
      // إضافة وقفات للفواصل والنقاط
      .replace(/[،,]/g, '، ')
      .replace(/[.]/g, '. ')
      .replace(/[؟?]/g, '؟ ')
      .replace(/[!]/g, '! ')
      // تحسين نطق الأرقام العربية
      .replace(/(\d+)/g, (match) => this.numberToArabicWords(parseInt(match)))
      // إزالة الرموز غير المرغوبة
      .replace(/[#*_`]/g, '')
      // تنظيف المسافات الزائدة
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  private numberToArabicWords(num: number): string {
    // تحويل الأرقام إلى كلمات عربية للنطق الأفضل
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    
    if (num < 10) return ones[num];
    if (num < 20) {
      const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
      return teens[num - 10];
    }
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one ? ' و' + ones[one] : '');
    }
    
    // للأرقام الأكبر، نعيد الرقم كما هو
    return num.toString();
  }
  
  stop() {
    this.synth.cancel();
  }
  
  pause() {
    this.synth.pause();
  }
  
  resume() {
    this.synth.resume();
  }
  
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang.startsWith('ar'));
  }
}

interface TTSOptions {
  rate?: number; // 0.1 - 10
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
}
```

---

## 🎨 **واجهة المستخدم للتفاعل الصوتي**

### **مكون التفاعل الصوتي:**
```typescript
// components/VoiceInteraction.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { SpeechRecognitionService } from '@/lib/speech-recognition';
import { TextToSpeechService } from '@/lib/text-to-speech';

interface VoiceInteractionProps {
  onUserSpeech: (text: string) => void;
  onTeacherResponse: (text: string) => Promise<void>;
  isProcessing: boolean;
}

export default function VoiceInteraction({
  onUserSpeech,
  onTeacherResponse,
  isProcessing
}: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  
  const speechRecognition = useRef<SpeechRecognitionService | null>(null);
  const textToSpeech = useRef<TextToSpeechService | null>(null);
  
  useEffect(() => {
    speechRecognition.current = new SpeechRecognitionService();
    textToSpeech.current = new TextToSpeechService();
    
    speechRecognition.current.onInterimResult = (text) => {
      setInterimText(text);
    };
    
    return () => {
      speechRecognition.current?.stopListening();
      textToSpeech.current?.stop();
    };
  }, []);
  
  const startListening = async () => {
    if (!speechRecognition.current || isListening) return;
    
    try {
      setIsListening(true);
      setInterimText('');
      
      const finalText = await speechRecognition.current.startListening();
      
      if (finalText.trim()) {
        onUserSpeech(finalText);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
    } finally {
      setIsListening(false);
      setInterimText('');
    }
  };
  
  const stopListening = () => {
    speechRecognition.current?.stopListening();
    setIsListening(false);
  };
  
  const speakResponse = async (text: string) => {
    if (!textToSpeech.current || !isVoiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      await textToSpeech.current.speak(text);
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };
  
  const toggleVoice = () => {
    if (isSpeaking) {
      textToSpeech.current?.stop();
      setIsSpeaking(false);
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };
  
  // استدعاء النطق عند وصول رد المعلم
  useEffect(() => {
    if (onTeacherResponse) {
      const originalFunction = onTeacherResponse;
      onTeacherResponse = async (text: string) => {
        await originalFunction(text);
        if (isVoiceEnabled) {
          await speakResponse(text);
        }
      };
    }
  }, [onTeacherResponse, isVoiceEnabled]);
  
  return (
    <div className="voice-interaction-container">
      {/* مؤشر الاستماع */}
      {isListening && (
        <div className="listening-indicator">
          <div className="pulse-animation"></div>
          <p className="text-sm text-gray-600">
            🎤 أستمع إليك...
            {interimText && (
              <span className="interim-text">{interimText}</span>
            )}
          </p>
        </div>
      )}
      
      {/* مؤشر النطق */}
      {isSpeaking && (
        <div className="speaking-indicator">
          <Volume2 className="w-5 h-5 animate-pulse" />
          <p className="text-sm text-gray-600">🗣️ المعلم يتحدث...</p>
        </div>
      )}
      
      {/* أزرار التحكم */}
      <div className="voice-controls">
        {/* زر الميكروفون */}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing || isSpeaking}
          className={`voice-button ${isListening ? 'listening' : ''}`}
          title={isListening ? 'إيقاف الاستماع' : 'بدء الاستماع'}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
        
        {/* زر تشغيل/إيقاف الصوت */}
        <button
          onClick={toggleVoice}
          className={`voice-button ${!isVoiceEnabled ? 'muted' : ''}`}
          title={isVoiceEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
        >
          {isVoiceEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </button>
        
        {/* مؤشر المعالجة */}
        {isProcessing && (
          <div className="processing-indicator">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">يفكر...</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 **تحسينات متقدمة**

### **1. التعرف على المشاعر من الصوت:**
```typescript
interface VoiceEmotionAnalysis {
  emotion: 'happy' | 'frustrated' | 'confused' | 'excited' | 'neutral';
  confidence: number;
  energy: 'low' | 'medium' | 'high';
}

function analyzeVoiceEmotion(audioData: ArrayBuffer): VoiceEmotionAnalysis {
  // تحليل نبرة الصوت لفهم حالة الطالب العاطفية
  // يمكن استخدام مكتبات مثل Web Audio API
}
```

### **2. التكيف مع سرعة الكلام:**
```typescript
interface SpeechPaceAnalysis {
  wordsPerMinute: number;
  pauseFrequency: number;
  clarity: number;
  suggestedTeacherPace: 'slow' | 'normal' | 'fast';
}
```

### **3. دعم اللهجات المحلية:**
```typescript
const dialectSupport = {
  'ar-SA': 'اللهجة السعودية',
  'ar-EG': 'اللهجة المصرية',
  'ar-MA': 'اللهجة المغربية',
  'ar-SY': 'اللهجة الشامية'
};
```

---

## 📊 **مؤشرات الأداء**

### **مؤشرات تقنية:**
- دقة التعرف على الكلام: > 90%
- زمن الاستجابة: < 2 ثانية
- جودة النطق: تقييم المستخدمين > 4/5

### **مؤشرات تعليمية:**
- زيادة مدة التفاعل مع المعلم
- تحسن في فهم المفاهيم
- زيادة رضا الطلاب عن التجربة

---

**🎯 الهدف: جعل التفاعل مع المعلم الافتراضي طبيعياً ومريحاً مثل الحديث مع معلم حقيقي**
