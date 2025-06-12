// محرك السبورة الافتراضية لمرجان المعلم الافتراضي
// Marjan Virtual Whiteboard Engine

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: 'line' | 'circle' | 'rectangle' | 'triangle' | 'text' | 'arrow' | 'curve' | 'highlight';
  points: Point[];
  style: DrawingStyle;
  timestamp: number;
  animationDuration?: number;
  metadata?: {
    label?: string;
    concept?: string;
    step?: number;
  };
}

export interface DrawingStyle {
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  fontSize?: number;
  fontFamily?: string;
  opacity: number;
  dashArray?: number[];
  text?: string;
}

export interface WhiteboardState {
  elements: DrawingElement[];
  currentStep: number;
  isAnimating: boolean;
  backgroundColor: string;
  gridVisible: boolean;
}

export class MarjanWhiteboard {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: WhiteboardState;
  private animationQueue: DrawingElement[] = [];
  private currentAnimation: number | null = null;
  
  // إعدادات السبورة
  private readonly CANVAS_WIDTH = 800;
  private readonly CANVAS_HEIGHT = 600;
  private readonly GRID_SIZE = 20;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.state = {
      elements: [],
      currentStep: 0,
      isAnimating: false,
      backgroundColor: '#ffffff',
      gridVisible: false
    };
    
    this.setupCanvas();
    this.setupEventListeners();
  }
  
  /**
   * إعداد الكانفاس للرسم عالي الجودة
   */
  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = this.CANVAS_WIDTH * dpr;
    this.canvas.height = this.CANVAS_HEIGHT * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = this.CANVAS_WIDTH + 'px';
    this.canvas.style.height = this.CANVAS_HEIGHT + 'px';
    
    // إعدادات الرسم الأساسية
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.textAlign = 'right'; // للنصوص العربية
    this.ctx.textBaseline = 'middle';
  }
  
  /**
   * إعداد مستمعي الأحداث
   */
  private setupEventListeners(): void {
    // يمكن إضافة مستمعين للتفاعل المباشر لاحقاً
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  /**
   * رسم خط مستقيم
   */
  drawLine(from: Point, to: Point, style: Partial<DrawingStyle> = {}, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'line',
      points: [from, to],
      style: this.mergeStyle(style),
      timestamp: Date.now(),
      animationDuration: animated ? 1000 : 0
    };
    
    return this.addElement(element, animated);
  }
  
  /**
   * رسم دائرة
   */
  drawCircle(center: Point, radius: number, style: Partial<DrawingStyle> = {}, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'circle',
      points: [center, { x: center.x + radius, y: center.y }],
      style: this.mergeStyle(style),
      timestamp: Date.now(),
      animationDuration: animated ? 1500 : 0
    };
    
    return this.addElement(element, animated);
  }
  
  /**
   * رسم مستطيل
   */
  drawRectangle(topLeft: Point, width: number, height: number, style: Partial<DrawingStyle> = {}, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'rectangle',
      points: [
        topLeft,
        { x: topLeft.x + width, y: topLeft.y + height }
      ],
      style: this.mergeStyle(style),
      timestamp: Date.now(),
      animationDuration: animated ? 1200 : 0
    };
    
    return this.addElement(element, animated);
  }
  
  /**
   * رسم مثلث
   */
  drawTriangle(p1: Point, p2: Point, p3: Point, style: Partial<DrawingStyle> = {}, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'triangle',
      points: [p1, p2, p3],
      style: this.mergeStyle(style),
      timestamp: Date.now(),
      animationDuration: animated ? 2000 : 0
    };
    
    return this.addElement(element, animated);
  }
  
  /**
   * كتابة نص
   */
  writeText(position: Point, text: string, style: Partial<DrawingStyle> = {}, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'text',
      points: [position],
      style: this.mergeStyle({ ...style, text }),
      timestamp: Date.now(),
      animationDuration: animated ? text.length * 100 : 0
    };
    
    return this.addElement(element, animated);
  }
  
  /**
   * رسم سهم
   */
  drawArrow(from: Point, to: Point, style: Partial<DrawingStyle> = {}, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'arrow',
      points: [from, to],
      style: this.mergeStyle({ strokeColor: '#ff4444', strokeWidth: 3, ...style }),
      timestamp: Date.now(),
      animationDuration: animated ? 800 : 0
    };
    
    return this.addElement(element, animated);
  }
  
  /**
   * تظليل منطقة
   */
  highlightArea(topLeft: Point, width: number, height: number, style: Partial<DrawingStyle> = {}, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'highlight',
      points: [
        topLeft,
        { x: topLeft.x + width, y: topLeft.y + height }
      ],
      style: this.mergeStyle({ 
        fillColor: '#ffff00', 
        opacity: 0.3, 
        strokeWidth: 0,
        ...style 
      }),
      timestamp: Date.now(),
      animationDuration: animated ? 500 : 0
    };
    
    return this.addElement(element, animated);
  }
  
  /**
   * إضافة عنصر للسبورة
   */
  private addElement(element: DrawingElement, animated: boolean): string {
    this.state.elements.push(element);
    
    if (animated && !this.state.isAnimating) {
      this.animateElement(element);
    } else if (!animated) {
      this.redraw();
    }
    
    return element.id;
  }
  
  /**
   * تحريك عنصر
   */
  private animateElement(element: DrawingElement): void {
    if (this.state.isAnimating) {
      this.animationQueue.push(element);
      return;
    }
    
    this.state.isAnimating = true;
    const startTime = Date.now();
    const duration = element.animationDuration || 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.redraw();
      this.renderElementWithProgress(element, progress);
      
      if (progress < 1) {
        this.currentAnimation = requestAnimationFrame(animate);
      } else {
        this.state.isAnimating = false;
        this.currentAnimation = null;
        this.redraw();
        
        // تشغيل العنصر التالي في الطابور
        if (this.animationQueue.length > 0) {
          const nextElement = this.animationQueue.shift()!;
          setTimeout(() => this.animateElement(nextElement), 200);
        }
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * رسم عنصر مع تقدم التحريك
   */
  private renderElementWithProgress(element: DrawingElement, progress: number): void {
    this.ctx.save();
    this.applyStyle(element.style);
    
    switch (element.type) {
      case 'line':
        this.renderLineWithProgress(element.points[0], element.points[1], progress);
        break;
      case 'circle':
        this.renderCircleWithProgress(element.points[0], this.getDistance(element.points[0], element.points[1]), progress);
        break;
      case 'rectangle':
        this.renderRectangleWithProgress(element.points[0], element.points[1], progress);
        break;
      case 'triangle':
        this.renderTriangleWithProgress(element.points[0], element.points[1], element.points[2], progress);
        break;
      case 'text':
        this.renderTextWithProgress(element.points[0], element.style.text || '', progress);
        break;
      case 'arrow':
        this.renderArrowWithProgress(element.points[0], element.points[1], progress);
        break;
      case 'highlight':
        this.renderHighlightWithProgress(element.points[0], element.points[1], progress);
        break;
    }
    
    this.ctx.restore();
  }
  
  /**
   * رسم خط مع تقدم
   */
  private renderLineWithProgress(from: Point, to: Point, progress: number): void {
    const currentTo = {
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress
    };
    
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(currentTo.x, currentTo.y);
    this.ctx.stroke();
  }
  
  /**
   * رسم دائرة مع تقدم
   */
  private renderCircleWithProgress(center: Point, radius: number, progress: number): void {
    const currentAngle = 2 * Math.PI * progress;
    
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, currentAngle);
    this.ctx.stroke();
  }
  
  /**
   * رسم نص مع تقدم
   */
  private renderTextWithProgress(position: Point, text: string, progress: number): void {
    const charactersToShow = Math.floor(progress * text.length);
    const partialText = text.substring(0, charactersToShow);
    
    if (partialText) {
      this.ctx.fillText(partialText, position.x, position.y);
    }
  }
  
  /**
   * رسم سهم مع تقدم
   */
  private renderArrowWithProgress(from: Point, to: Point, progress: number): void {
    // رسم الخط الأساسي
    this.renderLineWithProgress(from, to, progress);
    
    // رسم رأس السهم عند اكتمال الخط
    if (progress > 0.8) {
      const arrowProgress = (progress - 0.8) / 0.2;
      this.renderArrowHead(to, from, arrowProgress);
    }
  }
  
  /**
   * رسم رأس السهم
   */
  private renderArrowHead(to: Point, from: Point, progress: number): void {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const arrowLength = 15 * progress;
    const arrowAngle = Math.PI / 6;
    
    const arrowPoint1 = {
      x: to.x - arrowLength * Math.cos(angle - arrowAngle),
      y: to.y - arrowLength * Math.sin(angle - arrowAngle)
    };
    
    const arrowPoint2 = {
      x: to.x - arrowLength * Math.cos(angle + arrowAngle),
      y: to.y - arrowLength * Math.sin(angle + arrowAngle)
    };
    
    this.ctx.beginPath();
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
    this.ctx.stroke();
  }
  
  /**
   * رسم تظليل مع تقدم
   */
  private renderHighlightWithProgress(topLeft: Point, bottomRight: Point, progress: number): void {
    const width = (bottomRight.x - topLeft.x) * progress;
    const height = bottomRight.y - topLeft.y;
    
    this.ctx.fillRect(topLeft.x, topLeft.y, width, height);
  }
  
  /**
   * رسم مستطيل مع تقدم
   */
  private renderRectangleWithProgress(topLeft: Point, bottomRight: Point, progress: number): void {
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    const perimeter = 2 * (width + height);
    const currentLength = perimeter * progress;
    
    this.ctx.beginPath();
    
    if (currentLength <= width) {
      // الضلع العلوي
      this.ctx.moveTo(topLeft.x, topLeft.y);
      this.ctx.lineTo(topLeft.x + currentLength, topLeft.y);
    } else if (currentLength <= width + height) {
      // الضلع العلوي + الضلع الأيمن
      this.ctx.rect(topLeft.x, topLeft.y, width, currentLength - width);
    } else if (currentLength <= 2 * width + height) {
      // ثلاثة أضلاع
      this.ctx.moveTo(topLeft.x, topLeft.y);
      this.ctx.lineTo(topLeft.x + width, topLeft.y);
      this.ctx.lineTo(topLeft.x + width, topLeft.y + height);
      this.ctx.lineTo(topLeft.x + width - (currentLength - width - height), topLeft.y + height);
    } else {
      // المستطيل كاملاً
      this.ctx.rect(topLeft.x, topLeft.y, width, height);
    }
    
    this.ctx.stroke();
  }
  
  /**
   * رسم مثلث مع تقدم
   */
  private renderTriangleWithProgress(p1: Point, p2: Point, p3: Point, progress: number): void {
    const side1Length = this.getDistance(p1, p2);
    const side2Length = this.getDistance(p2, p3);
    const side3Length = this.getDistance(p3, p1);
    const totalLength = side1Length + side2Length + side3Length;
    const currentLength = totalLength * progress;
    
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    
    if (currentLength <= side1Length) {
      const ratio = currentLength / side1Length;
      this.ctx.lineTo(
        p1.x + (p2.x - p1.x) * ratio,
        p1.y + (p2.y - p1.y) * ratio
      );
    } else if (currentLength <= side1Length + side2Length) {
      this.ctx.lineTo(p2.x, p2.y);
      const ratio = (currentLength - side1Length) / side2Length;
      this.ctx.lineTo(
        p2.x + (p3.x - p2.x) * ratio,
        p2.y + (p3.y - p2.y) * ratio
      );
    } else {
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      const ratio = (currentLength - side1Length - side2Length) / side3Length;
      this.ctx.lineTo(
        p3.x + (p1.x - p3.x) * ratio,
        p3.y + (p1.y - p3.y) * ratio
      );
    }
    
    this.ctx.stroke();
  }
  
  /**
   * تطبيق نمط الرسم
   */
  private applyStyle(style: DrawingStyle): void {
    this.ctx.strokeStyle = style.strokeColor;
    this.ctx.fillStyle = style.fillColor || style.strokeColor;
    this.ctx.lineWidth = style.strokeWidth;
    this.ctx.globalAlpha = style.opacity;
    
    if (style.dashArray) {
      this.ctx.setLineDash(style.dashArray);
    } else {
      this.ctx.setLineDash([]);
    }
    
    if (style.fontSize) {
      this.ctx.font = `${style.fontSize}px ${style.fontFamily || 'Arial, sans-serif'}`;
    }
  }
  
  /**
   * دمج الأنماط مع القيم الافتراضية
   */
  private mergeStyle(style: Partial<DrawingStyle>): DrawingStyle {
    return {
      strokeColor: '#000000',
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      ...style
    };
  }
  
  /**
   * إعادة رسم جميع العناصر
   */
  redraw(): void {
    this.clearCanvas();
    
    if (this.state.gridVisible) {
      this.drawGrid();
    }
    
    this.state.elements.forEach(element => {
      this.renderElement(element);
    });
  }
  
  /**
   * رسم عنصر كاملاً
   */
  private renderElement(element: DrawingElement): void {
    this.ctx.save();
    this.applyStyle(element.style);
    
    switch (element.type) {
      case 'line':
        this.renderLine(element.points[0], element.points[1]);
        break;
      case 'circle':
        this.renderCircle(element.points[0], this.getDistance(element.points[0], element.points[1]));
        break;
      case 'rectangle':
        this.renderRectangle(element.points[0], element.points[1]);
        break;
      case 'triangle':
        this.renderTriangle(element.points[0], element.points[1], element.points[2]);
        break;
      case 'text':
        this.renderText(element.points[0], element.style.text || '');
        break;
      case 'arrow':
        this.renderArrow(element.points[0], element.points[1]);
        break;
      case 'highlight':
        this.renderHighlight(element.points[0], element.points[1]);
        break;
    }
    
    this.ctx.restore();
  }
  
  /**
   * رسم خط كامل
   */
  private renderLine(from: Point, to: Point): void {
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }
  
  /**
   * رسم دائرة كاملة
   */
  private renderCircle(center: Point, radius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    if (this.ctx.fillStyle !== this.ctx.strokeStyle) {
      this.ctx.fill();
    }
  }
  
  /**
   * رسم مستطيل كامل
   */
  private renderRectangle(topLeft: Point, bottomRight: Point): void {
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    
    this.ctx.beginPath();
    this.ctx.rect(topLeft.x, topLeft.y, width, height);
    this.ctx.stroke();
    
    if (this.ctx.fillStyle !== this.ctx.strokeStyle) {
      this.ctx.fill();
    }
  }
  
  /**
   * رسم مثلث كامل
   */
  private renderTriangle(p1: Point, p2: Point, p3: Point): void {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineTo(p3.x, p3.y);
    this.ctx.closePath();
    this.ctx.stroke();
    
    if (this.ctx.fillStyle !== this.ctx.strokeStyle) {
      this.ctx.fill();
    }
  }
  
  /**
   * رسم نص كامل
   */
  private renderText(position: Point, text: string): void {
    this.ctx.fillText(text, position.x, position.y);
  }
  
  /**
   * رسم سهم كامل
   */
  private renderArrow(from: Point, to: Point): void {
    this.renderLine(from, to);
    this.renderArrowHead(to, from, 1);
  }
  
  /**
   * رسم تظليل كامل
   */
  private renderHighlight(topLeft: Point, bottomRight: Point): void {
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    this.ctx.fillRect(topLeft.x, topLeft.y, width, height);
  }
  
  /**
   * مسح السبورة
   */
  clear(): void {
    this.state.elements = [];
    this.state.currentStep = 0;
    this.clearCanvas();
    
    if (this.currentAnimation) {
      cancelAnimationFrame(this.currentAnimation);
      this.currentAnimation = null;
    }
    
    this.state.isAnimating = false;
    this.animationQueue = [];
  }
  
  /**
   * مسح الكانفاس
   */
  private clearCanvas(): void {
    this.ctx.fillStyle = this.state.backgroundColor;
    this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  }
  
  /**
   * رسم الشبكة
   */
  private drawGrid(): void {
    this.ctx.save();
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    this.ctx.globalAlpha = 0.5;
    
    // خطوط عمودية
    for (let x = 0; x <= this.CANVAS_WIDTH; x += this.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.CANVAS_HEIGHT);
      this.ctx.stroke();
    }
    
    // خطوط أفقية
    for (let y = 0; y <= this.CANVAS_HEIGHT; y += this.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.CANVAS_WIDTH, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  /**
   * تبديل عرض الشبكة
   */
  toggleGrid(): void {
    this.state.gridVisible = !this.state.gridVisible;
    this.redraw();
  }
  
  /**
   * تصدير السبورة كصورة
   */
  exportAsImage(): string {
    return this.canvas.toDataURL('image/png');
  }
  
  /**
   * الحصول على حالة السبورة
   */
  getState(): WhiteboardState {
    return { ...this.state };
  }
  
  /**
   * حساب المسافة بين نقطتين
   */
  private getDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  
  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
