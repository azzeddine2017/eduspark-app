// نظام التدريس المتزامن - الصوت مع السبورة
// Synchronized Teaching System - Voice with Whiteboard

import { EnhancedTextToSpeech } from './enhanced-speech';
import { MarjanWhiteboardRef } from '@/components/MarjanWhiteboard';

export interface TeachingSegment {
  id: string;
  text: string;
  whiteboardActions?: WhiteboardAction[];
  timing: 'before' | 'during' | 'after'; // متى تحدث أفعال السبورة
  delay?: number; // تأخير بالميلي ثانية
  emphasis?: boolean; // تأكيد في النطق
}

export interface WhiteboardAction {
  type: 'draw' | 'write' | 'highlight' | 'clear' | 'pause';
  function?: string;
  parameters?: any;
  delay?: number;
}

export interface TeachingScript {
  title: string;
  subject: string;
  segments: TeachingSegment[];
  totalDuration?: number;
}

export class SynchronizedTeacher {
  private tts: EnhancedTextToSpeech;
  private whiteboard: MarjanWhiteboardRef | null = null;
  private isTeaching = false;
  private currentScript: TeachingScript | null = null;
  private currentSegmentIndex = 0;
  
  // معالجات الأحداث
  public onSegmentStart?: (segment: TeachingSegment, index: number) => void;
  public onSegmentEnd?: (segment: TeachingSegment, index: number) => void;
  public onTeachingComplete?: () => void;
  public onTeachingError?: (error: string) => void;

  constructor() {
    this.tts = new EnhancedTextToSpeech({
      language: 'ar-SA',
      rate: 0.85, // أبطأ قليلاً للوضوح
      pitch: 1.1, // أعلى قليلاً للحيوية
      volume: 1.0
    });

    // ربط معالجات الأحداث
    this.tts.onStart = () => {
      console.log('🎤 بدء النطق');
    };

    this.tts.onEnd = () => {
      console.log('🎤 انتهاء النطق');
    };

    this.tts.onWordBoundary = (word, charIndex) => {
      console.log(`🗣️ كلمة: ${word} في الموضع ${charIndex}`);
    };
  }

  /**
   * ربط السبورة
   */
  setWhiteboard(whiteboard: MarjanWhiteboardRef): void {
    this.whiteboard = whiteboard;
  }

  /**
   * بدء تدريس سكريبت متزامن
   */
  async startTeaching(script: TeachingScript): Promise<void> {
    if (this.isTeaching) {
      throw new Error('التدريس جاري بالفعل');
    }

    this.currentScript = script;
    this.currentSegmentIndex = 0;
    this.isTeaching = true;

    try {
      console.log(`🎓 بدء تدريس: ${script.title}`);
      
      for (let i = 0; i < script.segments.length; i++) {
        if (!this.isTeaching) break; // إذا تم الإيقاف
        
        this.currentSegmentIndex = i;
        const segment = script.segments[i];
        
        await this.teachSegment(segment, i);
      }
      
      this.onTeachingComplete?.();
      console.log('🎉 انتهى التدريس بنجاح');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      this.onTeachingError?.(errorMessage);
      console.error('❌ خطأ في التدريس:', errorMessage);
    } finally {
      this.isTeaching = false;
    }
  }

  /**
   * تدريس قطعة واحدة
   */
  private async teachSegment(segment: TeachingSegment, index: number): Promise<void> {
    this.onSegmentStart?.(segment, index);
    console.log(`📖 قطعة ${index + 1}: ${segment.text.substring(0, 50)}...`);

    try {
      // تنفيذ أفعال السبورة "قبل" النطق
      if (segment.whiteboardActions && segment.timing === 'before') {
        await this.executeWhiteboardActions(segment.whiteboardActions);
      }

      // تأخير اختياري
      if (segment.delay) {
        await this.delay(segment.delay);
      }

      // النطق مع أفعال السبورة المتزامنة
      if (segment.whiteboardActions && segment.timing === 'during') {
        await this.speakWithSynchronizedActions(segment);
      } else {
        // نطق عادي
        await this.tts.speak(segment.text, {
          pitch: segment.emphasis ? 1.2 : undefined,
          rate: segment.emphasis ? 0.8 : undefined
        });
      }

      // تنفيذ أفعال السبورة "بعد" النطق
      if (segment.whiteboardActions && segment.timing === 'after') {
        await this.executeWhiteboardActions(segment.whiteboardActions);
      }

      this.onSegmentEnd?.(segment, index);

    } catch (error) {
      throw new Error(`خطأ في القطعة ${index + 1}: ${error}`);
    }
  }

  /**
   * نطق مع أفعال متزامنة
   */
  private async speakWithSynchronizedActions(segment: TeachingSegment): Promise<void> {
    if (!segment.whiteboardActions) {
      await this.tts.speak(segment.text);
      return;
    }

    // تقسيم النص حسب عدد الأفعال
    const words = segment.text.split(' ');
    const actionsCount = segment.whiteboardActions.length;
    const wordsPerAction = Math.ceil(words.length / actionsCount);

    const speechSegments = [];
    
    for (let i = 0; i < actionsCount; i++) {
      const startIndex = i * wordsPerAction;
      const endIndex = Math.min((i + 1) * wordsPerAction, words.length);
      const segmentText = words.slice(startIndex, endIndex).join(' ');
      const action = segment.whiteboardActions[i];

      speechSegments.push({
        text: segmentText,
        action: async () => {
          if (action.delay) {
            await this.delay(action.delay);
          }
          await this.executeWhiteboardAction(action);
        }
      });
    }

    await this.tts.speakWithActions(speechSegments);
  }

  /**
   * تنفيذ مجموعة أفعال السبورة
   */
  private async executeWhiteboardActions(actions: WhiteboardAction[]): Promise<void> {
    for (const action of actions) {
      await this.executeWhiteboardAction(action);
    }
  }

  /**
   * تنفيذ فعل واحد على السبورة
   */
  private async executeWhiteboardAction(action: WhiteboardAction): Promise<void> {
    if (!this.whiteboard) {
      console.warn('⚠️ السبورة غير متصلة');
      return;
    }

    try {
      switch (action.type) {
        case 'draw':
        case 'write':
        case 'highlight':
          if (action.function && action.parameters) {
            await this.whiteboard.executeFunction(action.function, action.parameters);
            console.log(`🎨 تم تنفيذ: ${action.function}`);
          }
          break;
          
        case 'clear':
          this.whiteboard.clear();
          console.log('🧹 تم مسح السبورة');
          break;
          
        case 'pause':
          if (action.delay) {
            await this.delay(action.delay);
          }
          break;
      }
    } catch (error) {
      console.error('❌ خطأ في تنفيذ فعل السبورة:', error);
    }
  }

  /**
   * إيقاف التدريس
   */
  stopTeaching(): void {
    this.isTeaching = false;
    this.tts.stop();
    console.log('⏹️ تم إيقاف التدريس');
  }

  /**
   * إيقاف مؤقت
   */
  pauseTeaching(): void {
    this.tts.pause();
    console.log('⏸️ تم إيقاف التدريس مؤقتاً');
  }

  /**
   * استئناف التدريس
   */
  resumeTeaching(): void {
    this.tts.resume();
    console.log('▶️ تم استئناف التدريس');
  }

  /**
   * تأخير
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * الحصول على حالة التدريس
   */
  get teachingStatus() {
    return {
      isTeaching: this.isTeaching,
      currentScript: this.currentScript?.title,
      currentSegment: this.currentSegmentIndex,
      totalSegments: this.currentScript?.segments.length || 0,
      progress: this.currentScript ? 
        Math.round((this.currentSegmentIndex / this.currentScript.segments.length) * 100) : 0
    };
  }
}

// سكريبتات تعليمية جاهزة
export const TEACHING_SCRIPTS: Record<string, TeachingScript> = {
  pythagoras: {
    title: 'نظرية فيثاغورس',
    subject: 'mathematics',
    segments: [
      {
        id: 'intro',
        text: 'مرحباً! اليوم سنتعلم نظرية فيثاغورس، واحدة من أهم النظريات في الرياضيات.',
        timing: 'before',
        delay: 500
      },
      {
        id: 'draw_triangle',
        text: 'دعني أرسم لك مثلثاً قائم الزاوية. هذا هو المثلث الذي تنطبق عليه النظرية.',
        whiteboardActions: [
          {
            type: 'draw',
            function: 'draw_triangle',
            parameters: {
              x1: 200, y1: 300,
              x2: 400, y2: 300,
              x3: 200, y3: 150,
              color: '#0066cc',
              thickness: 3
            }
          }
        ],
        timing: 'during'
      },
      {
        id: 'label_sides',
        text: 'الآن دعني أسمي أضلاع المثلث. هذا الضلع طوله أ، وهذا طوله ب، والوتر طوله ج.',
        whiteboardActions: [
          {
            type: 'write',
            function: 'write_text',
            parameters: { x: 300, y: 320, text: 'أ = 4', size: 16, color: '#0066cc' },
            delay: 1000
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: { x: 180, y: 225, text: 'ب = 3', size: 16, color: '#0066cc' },
            delay: 1000
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: { x: 320, y: 220, text: 'ج = ؟', size: 16, color: '#ff6600' },
            delay: 1000
          }
        ],
        timing: 'during'
      },
      {
        id: 'equation',
        text: 'نظرية فيثاغورس تقول أن مربع الوتر يساوي مجموع مربعي الضلعين الآخرين.',
        whiteboardActions: [
          {
            type: 'write',
            function: 'draw_equation',
            parameters: {
              x: 500, y: 200,
              equation: 'أ² + ب² = ج²',
              size: 20,
              color: '#cc0066'
            }
          }
        ],
        timing: 'during',
        emphasis: true
      },
      {
        id: 'calculation',
        text: 'الآن دعنا نطبق النظرية. أربعة تربيع زائد ثلاثة تربيع يساوي ج تربيع.',
        whiteboardActions: [
          {
            type: 'write',
            function: 'draw_equation',
            parameters: {
              x: 500, y: 240,
              equation: '4² + 3² = ج²',
              size: 18,
              color: '#cc0066'
            },
            delay: 1000
          },
          {
            type: 'write',
            function: 'draw_equation',
            parameters: {
              x: 500, y: 280,
              equation: '16 + 9 = ج²',
              size: 18,
              color: '#cc0066'
            },
            delay: 2000
          }
        ],
        timing: 'during'
      },
      {
        id: 'result',
        text: 'إذن ج تربيع يساوي خمسة وعشرين، وبالتالي ج يساوي خمسة!',
        whiteboardActions: [
          {
            type: 'write',
            function: 'draw_equation',
            parameters: {
              x: 500, y: 320,
              equation: 'ج = 5',
              size: 20,
              color: '#009900'
            }
          },
          {
            type: 'draw',
            function: 'draw_arrow',
            parameters: {
              from_x: 480, from_y: 320,
              to_x: 320, to_y: 220,
              color: '#009900',
              thickness: 2
            },
            delay: 1000
          }
        ],
        timing: 'during',
        emphasis: true
      },
      {
        id: 'conclusion',
        text: 'رائع! لقد تعلمنا كيفية استخدام نظرية فيثاغورس لحساب طول الوتر. هل لديك أسئلة؟',
        timing: 'after',
        delay: 1000
      }
    ]
  },

  chemical_reaction: {
    title: 'التفاعلات الكيميائية',
    subject: 'chemistry',
    segments: [
      {
        id: 'intro',
        text: 'مرحباً! اليوم سنتعلم عن التفاعلات الكيميائية من خلال تجربة بسيطة.',
        timing: 'before',
        delay: 500
      },
      {
        id: 'setup',
        text: 'تخيل أن لديك خل وبيكربونات الصوديوم. دعني أرسم لك ما يحدث عندما نخلطهما.',
        whiteboardActions: [
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 150, y: 100,
              text: 'خل (حمض الأسيتيك)',
              size: 16,
              color: '#ff6600'
            }
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 450, y: 100,
              text: 'بيكربونات الصوديوم',
              size: 16,
              color: '#0066cc'
            },
            delay: 1000
          }
        ],
        timing: 'during'
      },
      {
        id: 'reaction',
        text: 'عندما نخلط هاتين المادتين، يحدث تفاعل كيميائي ينتج غاز ثاني أكسيد الكربون.',
        whiteboardActions: [
          {
            type: 'draw',
            function: 'draw_arrow',
            parameters: {
              from_x: 300, from_y: 120,
              to_x: 400, to_y: 180,
              color: '#009900',
              thickness: 3
            }
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 350, y: 200,
              text: 'CO₂ + H₂O + ملح',
              size: 18,
              color: '#009900'
            },
            delay: 1500
          }
        ],
        timing: 'during',
        emphasis: true
      },
      {
        id: 'bubbles',
        text: 'الفقاعات التي تراها هي غاز ثاني أكسيد الكربون يهرب من المحلول.',
        whiteboardActions: [
          {
            type: 'draw',
            function: 'draw_circle',
            parameters: {
              center_x: 200, center_y: 250,
              radius: 15,
              color: '#66ccff',
              fill: true,
              fill_color: '#66ccff'
            }
          },
          {
            type: 'draw',
            function: 'draw_circle',
            parameters: {
              center_x: 250, center_y: 230,
              radius: 12,
              color: '#66ccff',
              fill: true,
              fill_color: '#66ccff'
            },
            delay: 500
          },
          {
            type: 'draw',
            function: 'draw_circle',
            parameters: {
              center_x: 300, center_y: 240,
              radius: 18,
              color: '#66ccff',
              fill: true,
              fill_color: '#66ccff'
            },
            delay: 1000
          }
        ],
        timing: 'during'
      },
      {
        id: 'equation',
        text: 'يمكننا كتابة هذا التفاعل كمعادلة كيميائية.',
        whiteboardActions: [
          {
            type: 'write',
            function: 'draw_equation',
            parameters: {
              x: 150, y: 350,
              equation: 'CH₃COOH + NaHCO₃ → CO₂ + H₂O + CH₃COONa',
              size: 16,
              color: '#cc0066'
            }
          }
        ],
        timing: 'during',
        emphasis: true
      },
      {
        id: 'conclusion',
        text: 'هذا مثال رائع على كيف تتفاعل المواد الكيميائية لتكوين مواد جديدة. هل تريد تجربة تفاعلات أخرى؟',
        timing: 'after',
        delay: 1000
      }
    ]
  },

  photosynthesis: {
    title: 'البناء الضوئي',
    subject: 'biology',
    segments: [
      {
        id: 'intro',
        text: 'مرحباً! اليوم سنتعلم كيف تصنع النباتات طعامها من خلال عملية البناء الضوئي.',
        timing: 'before',
        delay: 500
      },
      {
        id: 'plant',
        text: 'دعني أرسم لك نبتة وأوضح لك أجزاءها المهمة.',
        whiteboardActions: [
          {
            type: 'draw',
            function: 'draw_line',
            parameters: {
              from_x: 300, from_y: 400,
              to_x: 300, to_y: 250,
              color: '#228B22',
              thickness: 8
            }
          },
          {
            type: 'draw',
            function: 'draw_circle',
            parameters: {
              center_x: 250, center_y: 200,
              radius: 30,
              color: '#32CD32',
              fill: true,
              fill_color: '#90EE90'
            },
            delay: 1000
          },
          {
            type: 'draw',
            function: 'draw_circle',
            parameters: {
              center_x: 350, center_y: 180,
              radius: 25,
              color: '#32CD32',
              fill: true,
              fill_color: '#90EE90'
            },
            delay: 1500
          }
        ],
        timing: 'during'
      },
      {
        id: 'sunlight',
        text: 'النبات يحتاج لضوء الشمس، وثاني أكسيد الكربون من الهواء، والماء من التربة.',
        whiteboardActions: [
          {
            type: 'draw',
            function: 'draw_circle',
            parameters: {
              center_x: 150, center_y: 80,
              radius: 40,
              color: '#FFD700',
              fill: true,
              fill_color: '#FFFF99'
            }
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 130, y: 85,
              text: '☀️',
              size: 24
            },
            delay: 1000
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 400, y: 120,
              text: 'CO₂',
              size: 16,
              color: '#666666'
            },
            delay: 2000
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 280, y: 450,
              text: 'H₂O',
              size: 16,
              color: '#0066cc'
            },
            delay: 3000
          }
        ],
        timing: 'during'
      },
      {
        id: 'process',
        text: 'في الأوراق الخضراء، تحدث عملية سحرية تحول هذه المواد إلى سكر وأكسجين.',
        whiteboardActions: [
          {
            type: 'draw',
            function: 'draw_arrow',
            parameters: {
              from_x: 180, from_y: 120,
              to_x: 250, to_y: 180,
              color: '#FFD700',
              thickness: 3
            }
          },
          {
            type: 'draw',
            function: 'draw_arrow',
            parameters: {
              from_x: 380, from_y: 140,
              to_x: 330, to_y: 180,
              color: '#666666',
              thickness: 2
            },
            delay: 1000
          },
          {
            type: 'draw',
            function: 'draw_arrow',
            parameters: {
              from_x: 300, from_y: 420,
              to_x: 300, to_y: 350,
              color: '#0066cc',
              thickness: 2
            },
            delay: 2000
          }
        ],
        timing: 'during',
        emphasis: true
      },
      {
        id: 'products',
        text: 'النتيجة: النبات يحصل على الغذاء (السكر)، ونحن نحصل على الأكسجين للتنفس!',
        whiteboardActions: [
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 500, y: 200,
              text: 'سكر (غذاء)',
              size: 16,
              color: '#ff6600'
            }
          },
          {
            type: 'write',
            function: 'write_text',
            parameters: {
              x: 500, y: 240,
              text: 'O₂ (أكسجين)',
              size: 16,
              color: '#009900'
            },
            delay: 1000
          },
          {
            type: 'draw',
            function: 'draw_arrow',
            parameters: {
              from_x: 380, from_y: 200,
              to_x: 480, to_y: 210,
              color: '#ff6600',
              thickness: 2
            },
            delay: 2000
          }
        ],
        timing: 'during'
      },
      {
        id: 'conclusion',
        text: 'لهذا السبب النباتات مهمة جداً - فهي تنتج الأكسجين الذي نتنفسه! أليس هذا رائع؟',
        timing: 'after',
        delay: 1000,
        emphasis: true
      }
    ]
  }
};

// إنشاء instance للاستخدام
export const synchronizedTeacher = new SynchronizedTeacher();
