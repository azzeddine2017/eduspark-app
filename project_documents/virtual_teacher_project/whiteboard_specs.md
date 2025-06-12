# 📝 مواصفات السبورة الافتراضية التفاعلية
## تحويل الشرح إلى تجربة بصرية تفاعلية

---

## 🎯 **الرؤية العامة**

### **الهدف:**
إنشاء سبورة افتراضية ذكية يتحكم بها المعلم الافتراضي لتوضيح المفاهيم بصرياً أثناء الشرح الصوتي.

### **التجربة المستهدفة:**
```
المعلم: (صوتياً) "دعنا نرسم مثلثاً قائم الزاوية لفهم نظرية فيثاغورس"
السبورة: (ترسم تلقائياً) مثلث قائم الزاوية مع تسمية الأضلاع
المعلم: (صوتياً) "هذا هو الضلع الأول، طوله 3 وحدات"
السبورة: (تكتب) "أ = 3" بجانب الضلع
المعلم: (صوتياً) "والضلع الثاني طوله 4 وحدات"
السبورة: (تكتب) "ب = 4" بجانب الضلع الثاني
المعلم: (صوتياً) "الآن، ما طول الوتر؟"
السبورة: (تظلل الوتر وتكتب) "ج = ؟"
```

---

## 🔧 **المكونات التقنية**

### **1. محرك الرسم الأساسي**

```typescript
// lib/whiteboard-engine.ts
export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: 'line' | 'circle' | 'rectangle' | 'text' | 'arrow' | 'curve';
  points: Point[];
  style: DrawingStyle;
  timestamp: number;
  animationDuration?: number;
}

export interface DrawingStyle {
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  fontSize?: number;
  fontFamily?: string;
  opacity: number;
}

export class WhiteboardEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private elements: DrawingElement[] = [];
  private animationQueue: DrawingElement[] = [];
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupCanvas();
  }
  
  private setupCanvas() {
    // إعداد الكانفاس للرسم عالي الجودة
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }
  
  // رسم خط
  drawLine(from: Point, to: Point, style: DrawingStyle, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'line',
      points: [from, to],
      style,
      timestamp: Date.now(),
      animationDuration: animated ? 1000 : 0
    };
    
    if (animated) {
      this.animateElement(element);
    } else {
      this.renderElement(element);
    }
    
    this.elements.push(element);
    return element.id;
  }
  
  // رسم دائرة
  drawCircle(center: Point, radius: number, style: DrawingStyle, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'circle',
      points: [center, { x: center.x + radius, y: center.y }],
      style,
      timestamp: Date.now(),
      animationDuration: animated ? 1500 : 0
    };
    
    if (animated) {
      this.animateElement(element);
    } else {
      this.renderElement(element);
    }
    
    this.elements.push(element);
    return element.id;
  }
  
  // كتابة نص
  writeText(position: Point, text: string, style: DrawingStyle, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'text',
      points: [position],
      style: { ...style, text },
      timestamp: Date.now(),
      animationDuration: animated ? text.length * 100 : 0
    };
    
    if (animated) {
      this.animateTextElement(element);
    } else {
      this.renderElement(element);
    }
    
    this.elements.push(element);
    return element.id;
  }
  
  // رسم مثلث
  drawTriangle(p1: Point, p2: Point, p3: Point, style: DrawingStyle, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'triangle',
      points: [p1, p2, p3],
      style,
      timestamp: Date.now(),
      animationDuration: animated ? 2000 : 0
    };
    
    if (animated) {
      this.animateTriangle(element);
    } else {
      this.renderElement(element);
    }
    
    this.elements.push(element);
    return element.id;
  }
  
  // رسم سهم
  drawArrow(from: Point, to: Point, style: DrawingStyle, animated = true): string {
    const element: DrawingElement = {
      id: this.generateId(),
      type: 'arrow',
      points: [from, to],
      style,
      timestamp: Date.now(),
      animationDuration: animated ? 800 : 0
    };
    
    if (animated) {
      this.animateElement(element);
    } else {
      this.renderElement(element);
    }
    
    this.elements.push(element);
    return element.id;
  }
  
  private animateElement(element: DrawingElement) {
    const startTime = Date.now();
    const duration = element.animationDuration || 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.clearCanvas();
      this.renderAllElements();
      this.renderElementWithProgress(element, progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  private animateTextElement(element: DrawingElement) {
    const text = element.style.text || '';
    const startTime = Date.now();
    const duration = element.animationDuration || 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const charactersToShow = Math.floor(progress * text.length);
      
      this.clearCanvas();
      this.renderAllElements();
      
      // رسم النص تدريجياً
      const partialText = text.substring(0, charactersToShow);
      this.renderText(element.points[0], partialText, element.style);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  private renderElement(element: DrawingElement) {
    this.ctx.save();
    this.applyStyle(element.style);
    
    switch (element.type) {
      case 'line':
        this.renderLine(element.points[0], element.points[1]);
        break;
      case 'circle':
        this.renderCircle(element.points[0], this.getDistance(element.points[0], element.points[1]));
        break;
      case 'text':
        this.renderText(element.points[0], element.style.text || '', element.style);
        break;
      case 'triangle':
        this.renderTriangle(element.points[0], element.points[1], element.points[2]);
        break;
      case 'arrow':
        this.renderArrow(element.points[0], element.points[1]);
        break;
    }
    
    this.ctx.restore();
  }
  
  private applyStyle(style: DrawingStyle) {
    this.ctx.strokeStyle = style.strokeColor;
    this.ctx.fillStyle = style.fillColor || style.strokeColor;
    this.ctx.lineWidth = style.strokeWidth;
    this.ctx.globalAlpha = style.opacity;
    
    if (style.fontSize) {
      this.ctx.font = `${style.fontSize}px ${style.fontFamily || 'Arial'}`;
    }
  }
  
  private renderLine(from: Point, to: Point) {
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }
  
  private renderCircle(center: Point, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
  
  private renderText(position: Point, text: string, style: DrawingStyle) {
    this.ctx.fillText(text, position.x, position.y);
  }
  
  private renderTriangle(p1: Point, p2: Point, p3: Point) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineTo(p3.x, p3.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }
  
  private renderArrow(from: Point, to: Point) {
    // رسم الخط الأساسي
    this.renderLine(from, to);
    
    // رسم رأس السهم
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;
    
    const arrowPoint1 = {
      x: to.x - arrowLength * Math.cos(angle - arrowAngle),
      y: to.y - arrowLength * Math.sin(angle - arrowAngle)
    };
    
    const arrowPoint2 = {
      x: to.x - arrowLength * Math.cos(angle + arrowAngle),
      y: to.y - arrowLength * Math.sin(angle + arrowAngle)
    };
    
    this.renderLine(to, arrowPoint1);
    this.renderLine(to, arrowPoint2);
  }
  
  // مسح السبورة
  clear() {
    this.elements = [];
    this.clearCanvas();
  }
  
  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  private renderAllElements() {
    this.elements.forEach(element => this.renderElement(element));
  }
  
  private generateId(): string {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
}
```

### **2. واجهة Function Calling للمعلم الافتراضي**

```typescript
// lib/whiteboard-functions.ts
export interface WhiteboardFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

export const whiteboardFunctions: WhiteboardFunction[] = [
  {
    name: 'draw_line',
    description: 'رسم خط مستقيم على السبورة',
    parameters: {
      type: 'object',
      properties: {
        from_x: { type: 'number', description: 'النقطة الأولى - المحور السيني' },
        from_y: { type: 'number', description: 'النقطة الأولى - المحور الصادي' },
        to_x: { type: 'number', description: 'النقطة الثانية - المحور السيني' },
        to_y: { type: 'number', description: 'النقطة الثانية - المحور الصادي' },
        color: { type: 'string', description: 'لون الخط', default: '#000000' },
        thickness: { type: 'number', description: 'سمك الخط', default: 2 }
      },
      required: ['from_x', 'from_y', 'to_x', 'to_y']
    }
  },
  
  {
    name: 'draw_circle',
    description: 'رسم دائرة على السبورة',
    parameters: {
      type: 'object',
      properties: {
        center_x: { type: 'number', description: 'مركز الدائرة - المحور السيني' },
        center_y: { type: 'number', description: 'مركز الدائرة - المحور الصادي' },
        radius: { type: 'number', description: 'نصف قطر الدائرة' },
        color: { type: 'string', description: 'لون الدائرة', default: '#000000' },
        fill: { type: 'boolean', description: 'ملء الدائرة', default: false }
      },
      required: ['center_x', 'center_y', 'radius']
    }
  },
  
  {
    name: 'write_text',
    description: 'كتابة نص على السبورة',
    parameters: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'موقع النص - المحور السيني' },
        y: { type: 'number', description: 'موقع النص - المحور الصادي' },
        text: { type: 'string', description: 'النص المراد كتابته' },
        size: { type: 'number', description: 'حجم الخط', default: 16 },
        color: { type: 'string', description: 'لون النص', default: '#000000' }
      },
      required: ['x', 'y', 'text']
    }
  },
  
  {
    name: 'draw_triangle',
    description: 'رسم مثلث على السبورة',
    parameters: {
      type: 'object',
      properties: {
        x1: { type: 'number', description: 'النقطة الأولى - المحور السيني' },
        y1: { type: 'number', description: 'النقطة الأولى - المحور الصادي' },
        x2: { type: 'number', description: 'النقطة الثانية - المحور السيني' },
        y2: { type: 'number', description: 'النقطة الثانية - المحور الصادي' },
        x3: { type: 'number', description: 'النقطة الثالثة - المحور السيني' },
        y3: { type: 'number', description: 'النقطة الثالثة - المحور الصادي' },
        color: { type: 'string', description: 'لون المثلث', default: '#000000' }
      },
      required: ['x1', 'y1', 'x2', 'y2', 'x3', 'y3']
    }
  },
  
  {
    name: 'draw_arrow',
    description: 'رسم سهم للإشارة إلى شيء معين',
    parameters: {
      type: 'object',
      properties: {
        from_x: { type: 'number', description: 'بداية السهم - المحور السيني' },
        from_y: { type: 'number', description: 'بداية السهم - المحور الصادي' },
        to_x: { type: 'number', description: 'نهاية السهم - المحور السيني' },
        to_y: { type: 'number', description: 'نهاية السهم - المحور الصادي' },
        color: { type: 'string', description: 'لون السهم', default: '#ff0000' }
      },
      required: ['from_x', 'from_y', 'to_x', 'to_y']
    }
  },
  
  {
    name: 'clear_whiteboard',
    description: 'مسح السبورة بالكامل',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  
  {
    name: 'highlight_area',
    description: 'تظليل منطقة معينة للفت الانتباه',
    parameters: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'الزاوية العلوية اليسرى - المحور السيني' },
        y: { type: 'number', description: 'الزاوية العلوية اليسرى - المحور الصادي' },
        width: { type: 'number', description: 'عرض المنطقة' },
        height: { type: 'number', description: 'ارتفاع المنطقة' },
        color: { type: 'string', description: 'لون التظليل', default: '#ffff00' },
        opacity: { type: 'number', description: 'شفافية التظليل', default: 0.3 }
      },
      required: ['x', 'y', 'width', 'height']
    }
  }
];

export class WhiteboardFunctionExecutor {
  constructor(private whiteboard: WhiteboardEngine) {}
  
  async executeFunction(functionName: string, parameters: any): Promise<string> {
    switch (functionName) {
      case 'draw_line':
        return this.whiteboard.drawLine(
          { x: parameters.from_x, y: parameters.from_y },
          { x: parameters.to_x, y: parameters.to_y },
          {
            strokeColor: parameters.color || '#000000',
            strokeWidth: parameters.thickness || 2,
            opacity: 1
          }
        );
        
      case 'draw_circle':
        return this.whiteboard.drawCircle(
          { x: parameters.center_x, y: parameters.center_y },
          parameters.radius,
          {
            strokeColor: parameters.color || '#000000',
            fillColor: parameters.fill ? parameters.color : undefined,
            strokeWidth: 2,
            opacity: 1
          }
        );
        
      case 'write_text':
        return this.whiteboard.writeText(
          { x: parameters.x, y: parameters.y },
          parameters.text,
          {
            strokeColor: parameters.color || '#000000',
            fontSize: parameters.size || 16,
            fontFamily: 'Arial',
            strokeWidth: 1,
            opacity: 1,
            text: parameters.text
          }
        );
        
      case 'draw_triangle':
        return this.whiteboard.drawTriangle(
          { x: parameters.x1, y: parameters.y1 },
          { x: parameters.x2, y: parameters.y2 },
          { x: parameters.x3, y: parameters.y3 },
          {
            strokeColor: parameters.color || '#000000',
            strokeWidth: 2,
            opacity: 1
          }
        );
        
      case 'draw_arrow':
        return this.whiteboard.drawArrow(
          { x: parameters.from_x, y: parameters.from_y },
          { x: parameters.to_x, y: parameters.to_y },
          {
            strokeColor: parameters.color || '#ff0000',
            strokeWidth: 2,
            opacity: 1
          }
        );
        
      case 'clear_whiteboard':
        this.whiteboard.clear();
        return 'whiteboard_cleared';
        
      case 'highlight_area':
        // تنفيذ تظليل المنطقة
        return 'area_highlighted';
        
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }
}
```

---

## 🎨 **مكون React للسبورة**

```typescript
// components/VirtualWhiteboard.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { WhiteboardEngine, WhiteboardFunctionExecutor } from '@/lib/whiteboard-engine';
import { Eraser, Download, RotateCcw } from 'lucide-react';

interface VirtualWhiteboardProps {
  onFunctionCall?: (functionName: string, parameters: any) => Promise<void>;
  className?: string;
}

export default function VirtualWhiteboard({ 
  onFunctionCall, 
  className = '' 
}: VirtualWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [whiteboard, setWhiteboard] = useState<WhiteboardEngine | null>(null);
  const [executor, setExecutor] = useState<WhiteboardFunctionExecutor | null>(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const wb = new WhiteboardEngine(canvasRef.current);
      const exec = new WhiteboardFunctionExecutor(wb);
      
      setWhiteboard(wb);
      setExecutor(exec);
      
      // ربط executor مع onFunctionCall
      if (onFunctionCall) {
        // تسجيل الدوال المتاحة للمعلم الافتراضي
        window.whiteboardExecutor = exec;
      }
    }
  }, [onFunctionCall]);
  
  const clearWhiteboard = () => {
    whiteboard?.clear();
  };
  
  const downloadWhiteboard = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };
  
  return (
    <div className={`whiteboard-container ${className}`}>
      {/* أدوات التحكم */}
      <div className="whiteboard-controls">
        <button
          onClick={clearWhiteboard}
          className="control-button"
          title="مسح السبورة"
        >
          <Eraser className="w-5 h-5" />
        </button>
        
        <button
          onClick={downloadWhiteboard}
          className="control-button"
          title="تحميل السبورة"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
      
      {/* السبورة */}
      <canvas
        ref={canvasRef}
        className="whiteboard-canvas"
        width={800}
        height={600}
      />
      
      <style jsx>{`
        .whiteboard-container {
          position: relative;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          overflow: hidden;
        }
        
        .whiteboard-controls {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        
        .control-button {
          padding: 8px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .control-button:hover {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .whiteboard-canvas {
          display: block;
          width: 100%;
          height: 100%;
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
}
```

---

## 🎯 **أمثلة تطبيقية للمواد الدراسية**

### **الرياضيات:**
- رسم الأشكال الهندسية والمعادلات
- توضيح الرسوم البيانية والدوال
- حل المسائل خطوة بخطوة بصرياً

### **الفيزياء:**
- رسم الدوائر الكهربائية
- توضيح القوى والحركة
- رسم الموجات والذبذبات

### **الكيمياء:**
- رسم التفاعلات الكيميائية
- توضيح بنية الجزيئات
- رسم الجدول الدوري التفاعلي

### **البرمجة:**
- رسم خرائط التدفق (Flowcharts)
- توضيح هياكل البيانات
- رسم مخططات UML

---

**🎯 الهدف: تحويل كل درس إلى تجربة بصرية تفاعلية تعزز الفهم والاستيعاب**
