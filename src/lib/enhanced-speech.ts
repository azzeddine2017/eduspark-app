// تحسينات التفاعل الصوتي لمرجان
// Enhanced Speech Interaction for Marjan

export interface SpeechConfig {
  language: 'ar-SA' | 'ar-EG' | 'ar-MA' | 'en-US';
  rate: number; // 0.1 - 2.0
  pitch: number; // 0.0 - 2.0
  volume: number; // 0.0 - 1.0
  voiceURI?: string;
}

export interface RecognitionConfig {
  language: 'ar-SA' | 'ar-EG' | 'ar-MA' | 'en-US';
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export class EnhancedSpeechRecognition {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private config: RecognitionConfig;
  
  // معالجات الأحداث
  public onResult?: (transcript: string, isFinal: boolean) => void;
  public onError?: (error: string) => void;
  public onStart?: () => void;
  public onEnd?: () => void;
  
  constructor(config: Partial<RecognitionConfig> = {}) {
    this.config = {
      language: 'ar-SA',
      continuous: false,
      interimResults: true,
      maxAlternatives: 3,
      ...config
    };
    
    this.initializeRecognition();
  }
  
  private initializeRecognition(): void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // إعداد التكوين
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    
    // ربط معالجات الأحداث
    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStart?.();
    };
    
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        this.onResult?.(finalTranscript, true);
      } else if (interimTranscript) {
        this.onResult?.(interimTranscript, false);
      }
    };
    
    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let errorMessage = 'خطأ في التعرف على الكلام';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'لم يتم اكتشاف كلام. حاول مرة أخرى.';
          break;
        case 'audio-capture':
          errorMessage = 'لا يمكن الوصول للميكروفون. تأكد من الأذونات.';
          break;
        case 'not-allowed':
          errorMessage = 'تم رفض الإذن للوصول للميكروفون.';
          break;
        case 'network':
          errorMessage = 'خطأ في الشبكة. تأكد من الاتصال بالإنترنت.';
          break;
        case 'language-not-supported':
          errorMessage = 'اللغة المحددة غير مدعومة.';
          break;
      }
      
      this.onError?.(errorMessage);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd?.();
    };
  }
  
  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }
    
    if (this.isListening) {
      return;
    }
    
    try {
      this.recognition.start();
    } catch (error) {
      throw new Error('Failed to start speech recognition');
    }
  }
  
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
  
  abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
  }
  
  get isActive(): boolean {
    return this.isListening;
  }
  
  updateConfig(newConfig: Partial<RecognitionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.recognition) {
      this.recognition.lang = this.config.language;
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.maxAlternatives = this.config.maxAlternatives;
    }
  }
}

export class EnhancedTextToSpeech {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private config: SpeechConfig;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
  // معالجات الأحداث
  public onStart?: () => void;
  public onEnd?: () => void;
  public onError?: (error: string) => void;
  public onPause?: () => void;
  public onResume?: () => void;
  
  constructor(config: Partial<SpeechConfig> = {}) {
    this.synth = window.speechSynthesis;
    this.config = {
      language: 'ar-SA',
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      ...config
    };
    
    this.loadVoices();
    this.setupEventListeners();
  }
  
  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    
    if (this.voices.length === 0) {
      // الأصوات قد لا تكون محملة بعد
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }
  
  private setupEventListeners(): void {
    // إعادة تحميل الأصوات عند تغييرها
    this.synth.onvoiceschanged = () => {
      this.loadVoices();
    };
  }
  
  private getBestVoice(): SpeechSynthesisVoice | null {
    const language = this.config.language;
    
    // البحث عن أفضل صوت للغة المحددة
    let voice = this.voices.find(v => 
      v.lang === language && v.name.toLowerCase().includes('female')
    );
    
    if (!voice) {
      voice = this.voices.find(v => v.lang === language);
    }
    
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith(language.split('-')[0]));
    }
    
    return voice || null;
  }
  
  async speak(text: string, options?: Partial<SpeechConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }
      
      // إيقاف أي كلام سابق
      this.stop();
      
      // تنظيف وتحسين النص
      const cleanText = this.preprocessText(text);
      
      // إنشاء utterance جديد
      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
      
      // تطبيق الإعدادات
      const finalConfig = { ...this.config, ...options };
      this.currentUtterance.rate = finalConfig.rate;
      this.currentUtterance.pitch = finalConfig.pitch;
      this.currentUtterance.volume = finalConfig.volume;
      this.currentUtterance.lang = finalConfig.language;
      
      // اختيار أفضل صوت
      const voice = this.getBestVoice();
      if (voice) {
        this.currentUtterance.voice = voice;
      }
      
      // ربط معالجات الأحداث
      this.currentUtterance.onstart = () => {
        this.onStart?.();
      };
      
      this.currentUtterance.onend = () => {
        this.currentUtterance = null;
        this.onEnd?.();
        resolve();
      };
      
      this.currentUtterance.onerror = (event) => {
        this.currentUtterance = null;
        const errorMessage = `خطأ في النطق: ${event.error}`;
        this.onError?.(errorMessage);
        reject(new Error(errorMessage));
      };
      
      this.currentUtterance.onpause = () => {
        this.onPause?.();
      };
      
      this.currentUtterance.onresume = () => {
        this.onResume?.();
      };
      
      // بدء النطق
      try {
        this.synth.speak(this.currentUtterance);
      } catch (error) {
        reject(new Error('فشل في بدء النطق'));
      }
    });
  }
  
  private preprocessText(text: string): string {
    return text
      // تحسين علامات الترقيم للنطق الأفضل
      .replace(/[،,]/g, '، ')
      .replace(/[.]/g, '. ')
      .replace(/[؟?]/g, '؟ ')
      .replace(/[!]/g, '! ')
      .replace(/[:]/g, ': ')
      .replace(/[;]/g, '؛ ')
      
      // تحسين نطق الأرقام العربية
      .replace(/(\d+)/g, (match) => this.numberToArabicWords(parseInt(match)))
      
      // تحسين نطق الرموز الرياضية
      .replace(/\+/g, ' زائد ')
      .replace(/-/g, ' ناقص ')
      .replace(/\*/g, ' ضرب ')
      .replace(/\//g, ' قسمة ')
      .replace(/=/g, ' يساوي ')
      .replace(/²/g, ' تربيع ')
      .replace(/³/g, ' تكعيب ')
      
      // إزالة الرموز غير المرغوبة
      .replace(/[#*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  private numberToArabicWords(num: number): string {
    if (num === 0) return 'صفر';
    
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one ? ' و' + ones[one] : '');
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      let result = ones[hundred] + ' مائة';
      if (remainder) {
        result += ' و' + this.numberToArabicWords(remainder);
      }
      return result;
    }
    
    // للأرقام الأكبر، نعيد الرقم كما هو
    return num.toString();
  }
  
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }
  
  pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }
  
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }
  
  get isSpeaking(): boolean {
    return this.synth.speaking;
  }
  
  get isPaused(): boolean {
    return this.synth.paused;
  }
  
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith('ar') || voice.lang.startsWith('en')
    );
  }
  
  updateConfig(newConfig: Partial<SpeechConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  setVoice(voiceURI: string): void {
    const voice = this.voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      this.config.voiceURI = voiceURI;
    }
  }
}
