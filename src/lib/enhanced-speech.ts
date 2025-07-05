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
    if (typeof window === 'undefined') {
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    if (!this.recognition) {
      return;
    }

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

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
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

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private config: SpeechConfig;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechQueue: Array<{text: string, onStart?: () => void, onEnd?: () => void}> = [];
  private isProcessingQueue = false;

  // معالجات الأحداث
  public onStart?: () => void;
  public onEnd?: () => void;
  public onError?: (error: string) => void;
  public onPause?: () => void;
  public onResume?: () => void;
  public onWordBoundary?: (word: string, charIndex: number) => void;
  
  constructor(config: Partial<SpeechConfig> = {}) {
    this.config = {
      language: 'ar-SA',
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      ...config
    };
    
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      this.setupEventListeners();
    }
  }
  
  private loadVoices(): void {
    if (!this.synth) return;

    this.voices = this.synth.getVoices();

    console.log('🔊 تحميل الأصوات المتاحة:', this.voices.length);

    // طباعة الأصوات العربية المتاحة للتشخيص
    const arabicVoices = this.voices.filter(v => v.lang.startsWith('ar'));
    if (arabicVoices.length > 0) {
      console.log('🇸🇦 الأصوات العربية المتاحة:',
        arabicVoices.map(v => ({ name: v.name, lang: v.lang, local: v.localService }))
      );
    } else {
      console.warn('⚠️ لا توجد أصوات عربية متاحة');
    }

    if (this.voices.length === 0) {
      // الأصوات قد لا تكون محملة بعد
      console.log('⏳ انتظار تحميل الأصوات...');
      this.synth.onvoiceschanged = () => {
        if (this.synth) {
          this.voices = this.synth.getVoices();
          console.log('✅ تم تحميل الأصوات:', this.voices.length);

          // طباعة الأصوات العربية بعد التحميل
          const arabicVoices = this.voices.filter(v => v.lang.startsWith('ar'));
          if (arabicVoices.length > 0) {
            console.log('🇸🇦 الأصوات العربية بعد التحميل:',
              arabicVoices.map(v => ({ name: v.name, lang: v.lang, local: v.localService }))
            );
          }
        }
      };
    }
  }
  
  private setupEventListeners(): void {
    if (!this.synth) return;
    
    // إعادة تحميل الأصوات عند تغييرها
    this.synth.onvoiceschanged = () => {
      this.loadVoices();
    };
  }
  
  private getBestVoice(): SpeechSynthesisVoice | null {
    const language = this.config.language;

    // إعادة تحميل الأصوات إذا لم تكن محملة
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    // البحث عن أفضل صوت للغة العربية بترتيب الأولوية
    let voice: SpeechSynthesisVoice | null = null;

    // تحديد نوع الجهاز
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isDesktop = !isMobile;

    // 1. البحث عن أصوات عربية محددة بأسماء معروفة حسب نوع الجهاز
    const preferredArabicVoices = isMobile ? [
      'ar-sa-x-sfb-local', // Android Arabic
      'ar-SA', // iOS Arabic
      'Arabic (Saudi Arabia)', // Generic mobile
      'Samira', // Google Arabic
      'Fatima', // Google Arabic
    ] : [
      'Microsoft Hoda Desktop', // Windows Arabic voice
      'Microsoft Naayf Desktop', // Windows Arabic voice
      'Majed', // macOS Arabic voice
      'Maged', // macOS Arabic voice
      'Tarik', // macOS Arabic voice
      'Samira', // Google Arabic voice
      'Fatima', // Google Arabic voice
    ];

    for (const voiceName of preferredArabicVoices) {
      voice = this.voices.find(v =>
        v.name.includes(voiceName) && v.lang.startsWith('ar')
      ) || null;
      if (voice) break;
    }

    // 2. البحث عن أي صوت عربي أنثوي
    if (!voice) {
      voice = this.voices.find(v =>
        v.lang.startsWith('ar') &&
        (v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('woman') ||
         v.name.toLowerCase().includes('أنثى'))
      ) || null;
    }

    // 3. البحث عن أي صوت عربي
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith('ar')) || null;
    }

    // 4. البحث عن صوت بنفس اللغة المحددة
    if (!voice) {
      voice = this.voices.find(v => v.lang === language) || null;
    }

    // 5. البحث عن صوت بنفس رمز اللغة الأساسي
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith(language.split('-')[0])) || null;
    }

    // طباعة معلومات الصوت المختار للتشخيص
    if (voice) {
      console.log('🎤 تم اختيار الصوت:', {
        name: voice.name,
        lang: voice.lang,
        localService: voice.localService,
        default: voice.default
      });
    } else {
      console.warn('⚠️ لم يتم العثور على صوت مناسب للغة:', language);
      console.log('الأصوات المتاحة:', this.voices.map(v => ({ name: v.name, lang: v.lang })));
    }

    return voice;
  }
  
  async speak(text: string, options?: Partial<SpeechConfig>): Promise<void> {
    if (!text.trim()) {
      return Promise.resolve();
    }

    // تنظيف وتحسين النص
    const cleanText = this.preprocessText(text);

    // تقسيم النص إذا كان طويلاً جداً (أكثر من 200 حرف)
    if (cleanText.length > 200) {
      return this.speakLongText(cleanText, options);
    }

    return this.speakSingleUtterance(cleanText, options);
  }

  private async speakSingleUtterance(text: string, options?: Partial<SpeechConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      // إيقاف أي كلام سابق
      this.stop();

      // إنشاء utterance جديد
      this.currentUtterance = new SpeechSynthesisUtterance(text);

      // تطبيق الإعدادات مع فحص القيم
      const finalConfig = { ...this.config, ...options };
      
      // فحص وتصحيح قيم rate
      let rate = finalConfig.rate;
      if (typeof rate !== 'number' || isNaN(rate) || !isFinite(rate)) {
        console.warn('⚠️ قيمة rate غير صحيحة:', rate, 'سيتم استخدام القيمة الافتراضية 0.9');
        rate = 0.9;
      }
      // التأكد من أن rate ضمن النطاق المسموح (0.1 - 2.0)
      rate = Math.max(0.1, Math.min(2.0, rate));
      
      // فحص وتصحيح قيم pitch
      let pitch = finalConfig.pitch;
      if (typeof pitch !== 'number' || isNaN(pitch) || !isFinite(pitch)) {
        console.warn('⚠️ قيمة pitch غير صحيحة:', pitch, 'سيتم استخدام القيمة الافتراضية 1.0');
        pitch = 1.0;
      }
      pitch = Math.max(0.0, Math.min(2.0, pitch));
      
      // فحص وتصحيح قيم volume
      let volume = finalConfig.volume;
      if (typeof volume !== 'number' || isNaN(volume) || !isFinite(volume)) {
        console.warn('⚠️ قيمة volume غير صحيحة:', volume, 'سيتم استخدام القيمة الافتراضية 1.0');
        volume = 1.0;
      }
      volume = Math.max(0.0, Math.min(1.0, volume));

      this.currentUtterance.rate = rate;
      this.currentUtterance.pitch = pitch;
      this.currentUtterance.volume = volume;
      this.currentUtterance.lang = finalConfig.language;

      // اختيار أفضل صوت
      const voice = this.getBestVoice();
      if (voice) {
        this.currentUtterance.voice = voice;
        console.log('🎤 استخدام الصوت:', voice.name, 'للغة:', voice.lang);
      } else {
        console.warn('⚠️ لم يتم العثور على صوت مناسب، سيتم استخدام الصوت الافتراضي');
      }

      // ربط معالجات الأحداث
      this.currentUtterance.onstart = () => {
        console.log('🎤 بدء النطق:', text.substring(0, 50) + '...');
        this.onStart?.();
      };

      this.currentUtterance.onend = () => {
        console.log('🎤 انتهاء النطق');
        this.currentUtterance = null;
        this.onEnd?.();
        resolve();
      };

      this.currentUtterance.onerror = (event) => {
        console.error('❌ خطأ في النطق:', event.error);
        this.currentUtterance = null;
        const errorMessage = `خطأ في النطق: ${event.error}`;
        this.onError?.(errorMessage);
        reject(new Error(errorMessage));
      };

      this.currentUtterance.onpause = () => {
        console.log('⏸️ إيقاف مؤقت للنطق');
        this.onPause?.();
      };

      this.currentUtterance.onresume = () => {
        console.log('▶️ استئناف النطق');
        this.onResume?.();
      };

      // إضافة معالج boundary للكلمات (للتزامن مع السبورة)
      this.currentUtterance.onboundary = (event) => {
        if (event.name === 'word') {
          const word = text.substring(event.charIndex, event.charIndex + event.charLength);
          this.onWordBoundary?.(word, event.charIndex);
        }
      };

      // التأكد من أن النظام جاهز للنطق
      if (!this.synth) {
        reject(new Error('نظام النطق غير متاح'));
        return;
      }

      // بدء النطق مع معالجة الأخطاء
      try {
        // التأكد من إلغاء أي نطق سابق
        if (this.synth.speaking) {
          this.synth.cancel();
        }

        // انتظار قصير للتأكد من إلغاء النطق السابق
        setTimeout(() => {
          if (this.synth && this.currentUtterance) {
            this.synth.speak(this.currentUtterance);
          }
        }, 100);

      } catch (error) {
        console.error('❌ فشل في بدء النطق:', error);
        reject(new Error('فشل في بدء النطق'));
      }
    });
  }

  private async speakLongText(text: string, options?: Partial<SpeechConfig>): Promise<void> {
    console.log('📝 نطق نص طويل، سيتم تقسيمه إلى أجزاء');

    // تقسيم النص إلى جمل
    const sentences = this.splitTextIntoSentences(text);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence) {
        console.log(`🗣️ نطق الجملة ${i + 1}/${sentences.length}: ${sentence.substring(0, 30)}...`);
        await this.speakSingleUtterance(sentence, options);

        // وقفة قصيرة بين الجمل
        if (i < sentences.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
  }

  private splitTextIntoSentences(text: string): string[] {
    // تقسيم النص إلى جمل بناءً على علامات الترقيم العربية والإنجليزية
    return text
      .split(/[.!؟?؛;]/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => {
        // إضافة علامة ترقيم في النهاية إذا لم تكن موجودة
        if (!sentence.match(/[.!؟?؛;]$/)) {
          sentence += '.';
        }
        return sentence;
      });
  }

  /**
   * إضافة نص إلى طابور النطق
   */
  addToQueue(text: string, onStart?: () => void, onEnd?: () => void): void {
    this.speechQueue.push({ text, onStart, onEnd });
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  /**
   * معالجة طابور النطق
   */
  private async processQueue(): Promise<void> {
    if (this.speechQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const item = this.speechQueue.shift();

    if (item) {
      try {
        item.onStart?.();
        await this.speak(item.text);
        item.onEnd?.();
      } catch (error) {
        console.error('خطأ في نطق العنصر من الطابور:', error);
      }
    }

    // معالجة العنصر التالي
    setTimeout(() => this.processQueue(), 100);
  }

  /**
   * نطق متزامن مع إجراءات السبورة
   */
  async speakWithActions(
    segments: Array<{
      text: string;
      action?: () => Promise<void> | void;
      delay?: number;
    }>
  ): Promise<void> {
    for (const segment of segments) {
      // تنفيذ الإجراء أولاً (مثل الرسم)
      if (segment.action) {
        await segment.action();
      }

      // تأخير اختياري
      if (segment.delay) {
        await new Promise(resolve => setTimeout(resolve, segment.delay));
      }

      // ثم النطق
      await this.speak(segment.text);
    }
  }
  
  private preprocessText(text: string): string {
    return text
      // تحسين علامات الترقيم للنطق الأفضل مع وقفات أطول
      .replace(/[،,]/g, '، ')
      .replace(/[.]/g, '. ')
      .replace(/[؟?]/g, '؟ ')
      .replace(/[!]/g, '! ')
      .replace(/[:]/g, ': ')
      .replace(/[;]/g, '؛ ')

      // تحسين نطق الأرقام العربية والإنجليزية
      .replace(/(\d+)/g, (match) => this.numberToArabicWords(parseInt(match)))

      // تحسين نطق الرموز الرياضية
      .replace(/\+/g, ' زائد ')
      .replace(/-/g, ' ناقص ')
      .replace(/\*/g, ' ضرب ')
      .replace(/\//g, ' قسمة ')
      .replace(/=/g, ' يساوي ')
      .replace(/²/g, ' تربيع ')
      .replace(/³/g, ' تكعيب ')
      .replace(/√/g, ' جذر ')
      .replace(/π/g, ' باي ')
      .replace(/∞/g, ' ما لا نهاية ')

      // تحسين نطق الرموز الشائعة
      .replace(/%/g, ' بالمائة ')
      .replace(/&/g, ' و ')
      .replace(/@/g, ' في ')

      // تحسين نطق الأحرف الإنجليزية المفردة
      .replace(/\b([A-Z])\b/g, (match) => ` حرف ${match} `)

      // إزالة الرموز غير المرغوبة
      .replace(/[#*_`\[\]{}|\\]/g, '')

      // تحسين المسافات والتنظيف النهائي
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
    if (this.synth?.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }
  
  pause(): void {
    if (this.synth?.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }
  
  resume(): void {
    if (this.synth?.paused) {
      this.synth.resume();
    }
  }
  
  get isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }
  
  get isPaused(): boolean {
    return this.synth?.paused || false;
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

  /**
   * إعادة محاولة النطق مع إعدادات مختلفة في حالة الفشل
   */
  async speakWithRetry(text: string, options?: Partial<SpeechConfig>, maxRetries: number = 3): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 محاولة النطق ${attempt}/${maxRetries}`);

        // تجربة إعدادات مختلفة في كل محاولة
        const retryOptions = {
          ...options,
          rate: options?.rate || (0.7 + (attempt * 0.1)), // سرعة أبطأ في المحاولات التالية
          pitch: options?.pitch || (0.9 + (attempt * 0.05)), // نبرة مختلفة قليلاً
        };

        await this.speak(text, retryOptions);
        console.log(`✅ نجح النطق في المحاولة ${attempt}`);
        return; // نجح النطق، خروج من الدالة

      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ فشل النطق في المحاولة ${attempt}:`, error);

        if (attempt < maxRetries) {
          // انتظار قبل المحاولة التالية
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));

          // إعادة تحميل الأصوات قبل المحاولة التالية
          this.loadVoices();
        }
      }
    }

    // إذا فشلت جميع المحاولات
    console.error(`❌ فشل النطق نهائياً بعد ${maxRetries} محاولات`);
    throw lastError || new Error('فشل النطق بعد عدة محاولات');
  }

  /**
   * فحص حالة النظام الصوتي
   */
  checkSpeechSynthesisStatus(): { available: boolean; speaking: boolean; pending: boolean; paused: boolean; voices: number } {
    if (!this.synth) {
      return { available: false, speaking: false, pending: false, paused: false, voices: 0 };
    }

    return {
      available: true,
      speaking: this.synth.speaking,
      pending: this.synth.pending,
      paused: this.synth.paused,
      voices: this.voices.length
    };
  }

  /**
   * إعادة تهيئة النظام الصوتي
   */
  reinitialize(): void {
    console.log('🔄 إعادة تهيئة النظام الصوتي...');

    // إيقاف أي نطق حالي
    this.stop();

    // إعادة تحميل الأصوات
    this.loadVoices();

    // إعادة إعداد معالجات الأحداث
    this.setupEventListeners();

    console.log('✅ تم إعادة تهيئة النظام الصوتي');
  }
}
