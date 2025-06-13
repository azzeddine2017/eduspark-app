// وظائف السبورة الافتراضية لمرجان - Function Calling System
// Marjan Whiteboard Function Calling System

import { MarjanWhiteboard, Point, DrawingStyle } from './marjan-whiteboard';

export interface WhiteboardFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

// قائمة الوظائف المتاحة لمرجان للتحكم في السبورة
export const WHITEBOARD_FUNCTIONS: WhiteboardFunction[] = [
  {
    name: 'draw_line',
    description: 'رسم خط مستقيم على السبورة',
    parameters: {
      type: 'object',
      properties: {
        from_x: { type: 'number', description: 'النقطة الأولى - المحور السيني (0-800)' },
        from_y: { type: 'number', description: 'النقطة الأولى - المحور الصادي (0-600)' },
        to_x: { type: 'number', description: 'النقطة الثانية - المحور السيني (0-800)' },
        to_y: { type: 'number', description: 'النقطة الثانية - المحور الصادي (0-600)' },
        color: { type: 'string', description: 'لون الخط (hex color)', default: '#000000' },
        thickness: { type: 'number', description: 'سمك الخط (1-10)', default: 2 },
        label: { type: 'string', description: 'تسمية الخط (اختياري)' }
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
        center_x: { type: 'number', description: 'مركز الدائرة - المحور السيني (0-800)' },
        center_y: { type: 'number', description: 'مركز الدائرة - المحور الصادي (0-600)' },
        radius: { type: 'number', description: 'نصف قطر الدائرة (5-200)' },
        color: { type: 'string', description: 'لون الدائرة', default: '#000000' },
        fill: { type: 'boolean', description: 'ملء الدائرة', default: false },
        fill_color: { type: 'string', description: 'لون الملء (إذا كان fill=true)' },
        label: { type: 'string', description: 'تسمية الدائرة (اختياري)' }
      },
      required: ['center_x', 'center_y', 'radius']
    }
  },
  
  {
    name: 'draw_rectangle',
    description: 'رسم مستطيل على السبورة',
    parameters: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'الزاوية العلوية اليسرى - المحور السيني (0-800)' },
        y: { type: 'number', description: 'الزاوية العلوية اليسرى - المحور الصادي (0-600)' },
        width: { type: 'number', description: 'عرض المستطيل (10-400)' },
        height: { type: 'number', description: 'ارتفاع المستطيل (10-300)' },
        color: { type: 'string', description: 'لون المستطيل', default: '#000000' },
        fill: { type: 'boolean', description: 'ملء المستطيل', default: false },
        fill_color: { type: 'string', description: 'لون الملء' },
        label: { type: 'string', description: 'تسمية المستطيل (اختياري)' }
      },
      required: ['x', 'y', 'width', 'height']
    }
  },
  
  {
    name: 'draw_triangle',
    description: 'رسم مثلث على السبورة',
    parameters: {
      type: 'object',
      properties: {
        x1: { type: 'number', description: 'النقطة الأولى - المحور السيني (0-800)' },
        y1: { type: 'number', description: 'النقطة الأولى - المحور الصادي (0-600)' },
        x2: { type: 'number', description: 'النقطة الثانية - المحور السيني (0-800)' },
        y2: { type: 'number', description: 'النقطة الثانية - المحور الصادي (0-600)' },
        x3: { type: 'number', description: 'النقطة الثالثة - المحور السيني (0-800)' },
        y3: { type: 'number', description: 'النقطة الثالثة - المحور الصادي (0-600)' },
        color: { type: 'string', description: 'لون المثلث', default: '#000000' },
        fill: { type: 'boolean', description: 'ملء المثلث', default: false },
        fill_color: { type: 'string', description: 'لون الملء' },
        label: { type: 'string', description: 'تسمية المثلث (اختياري)' }
      },
      required: ['x1', 'y1', 'x2', 'y2', 'x3', 'y3']
    }
  },
  
  {
    name: 'write_text',
    description: 'كتابة نص على السبورة',
    parameters: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'موقع النص - المحور السيني (0-800)' },
        y: { type: 'number', description: 'موقع النص - المحور الصادي (0-600)' },
        text: { type: 'string', description: 'النص المراد كتابته' },
        size: { type: 'number', description: 'حجم الخط (12-48)', default: 16 },
        color: { type: 'string', description: 'لون النص', default: '#000000' },
        font: { type: 'string', description: 'نوع الخط', default: 'Arial' }
      },
      required: ['x', 'y', 'text']
    }
  },
  
  {
    name: 'draw_arrow',
    description: 'رسم سهم للإشارة إلى شيء معين',
    parameters: {
      type: 'object',
      properties: {
        from_x: { type: 'number', description: 'بداية السهم - المحور السيني (0-800)' },
        from_y: { type: 'number', description: 'بداية السهم - المحور الصادي (0-600)' },
        to_x: { type: 'number', description: 'نهاية السهم - المحور السيني (0-800)' },
        to_y: { type: 'number', description: 'نهاية السهم - المحور الصادي (0-600)' },
        color: { type: 'string', description: 'لون السهم', default: '#ff0000' },
        thickness: { type: 'number', description: 'سمك السهم', default: 3 },
        label: { type: 'string', description: 'تسمية السهم (اختياري)' }
      },
      required: ['from_x', 'from_y', 'to_x', 'to_y']
    }
  },
  
  {
    name: 'highlight_area',
    description: 'تظليل منطقة معينة للفت الانتباه',
    parameters: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'الزاوية العلوية اليسرى - المحور السيني (0-800)' },
        y: { type: 'number', description: 'الزاوية العلوية اليسرى - المحور الصادي (0-600)' },
        width: { type: 'number', description: 'عرض المنطقة (10-400)' },
        height: { type: 'number', description: 'ارتفاع المنطقة (10-300)' },
        color: { type: 'string', description: 'لون التظليل', default: '#ffff00' },
        opacity: { type: 'number', description: 'شفافية التظليل (0.1-0.8)', default: 0.3 }
      },
      required: ['x', 'y', 'width', 'height']
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
    name: 'draw_coordinate_system',
    description: 'رسم نظام إحداثيات (محاور x و y)',
    parameters: {
      type: 'object',
      properties: {
        origin_x: { type: 'number', description: 'نقطة الأصل - المحور السيني', default: 400 },
        origin_y: { type: 'number', description: 'نقطة الأصل - المحور الصادي', default: 300 },
        x_length: { type: 'number', description: 'طول المحور السيني', default: 200 },
        y_length: { type: 'number', description: 'طول المحور الصادي', default: 150 },
        show_numbers: { type: 'boolean', description: 'إظهار الأرقام على المحاور', default: true }
      },
      required: []
    }
  },
  
  {
    name: 'draw_equation',
    description: 'كتابة معادلة رياضية مع تنسيق خاص',
    parameters: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'موقع المعادلة - المحور السيني (0-800)' },
        y: { type: 'number', description: 'موقع المعادلة - المحور الصادي (0-600)' },
        equation: { type: 'string', description: 'المعادلة الرياضية (مثل: a² + b² = c²)' },
        size: { type: 'number', description: 'حجم الخط', default: 20 },
        color: { type: 'string', description: 'لون المعادلة', default: '#0066cc' }
      },
      required: ['x', 'y', 'equation']
    }
  }
];

export class WhiteboardFunctionExecutor {
  constructor(private whiteboard: MarjanWhiteboard) {}
  
  /**
   * تنفيذ وظيفة السبورة
   */
  async executeFunction(functionName: string, parameters: any): Promise<{
    success: boolean;
    elementId?: string;
    message: string;
  }> {
    try {
      // التحقق من صحة المعاملات
      const validatedParams = this.validateParameters(functionName, parameters);
      
      let elementId: string | undefined;
      let message = '';
      
      switch (functionName) {
        case 'draw_line':
          elementId = this.whiteboard.drawLine(
            { x: validatedParams.from_x, y: validatedParams.from_y },
            { x: validatedParams.to_x, y: validatedParams.to_y },
            {
              strokeColor: validatedParams.color || '#000000',
              strokeWidth: validatedParams.thickness || 2
            }
          );
          message = `تم رسم خط من (${validatedParams.from_x}, ${validatedParams.from_y}) إلى (${validatedParams.to_x}, ${validatedParams.to_y})`;
          break;
          
        case 'draw_circle':
          elementId = this.whiteboard.drawCircle(
            { x: validatedParams.center_x, y: validatedParams.center_y },
            validatedParams.radius,
            {
              strokeColor: validatedParams.color || '#000000',
              fillColor: validatedParams.fill ? (validatedParams.fill_color || validatedParams.color) : undefined,
              strokeWidth: 2
            }
          );
          message = `تم رسم دائرة بمركز (${validatedParams.center_x}, ${validatedParams.center_y}) ونصف قطر ${validatedParams.radius}`;
          break;
          
        case 'draw_rectangle':
          elementId = this.whiteboard.drawRectangle(
            { x: validatedParams.x, y: validatedParams.y },
            validatedParams.width,
            validatedParams.height,
            {
              strokeColor: validatedParams.color || '#000000',
              fillColor: validatedParams.fill ? (validatedParams.fill_color || validatedParams.color) : undefined,
              strokeWidth: 2
            }
          );
          message = `تم رسم مستطيل بأبعاد ${validatedParams.width}×${validatedParams.height}`;
          break;
          
        case 'draw_triangle':
          elementId = this.whiteboard.drawTriangle(
            { x: validatedParams.x1, y: validatedParams.y1 },
            { x: validatedParams.x2, y: validatedParams.y2 },
            { x: validatedParams.x3, y: validatedParams.y3 },
            {
              strokeColor: validatedParams.color || '#000000',
              fillColor: validatedParams.fill ? (validatedParams.fill_color || validatedParams.color) : undefined,
              strokeWidth: 2
            }
          );
          message = `تم رسم مثلث بثلاث نقاط`;
          break;
          
        case 'write_text':
          elementId = this.whiteboard.writeText(
            { x: validatedParams.x, y: validatedParams.y },
            validatedParams.text,
            {
              strokeColor: validatedParams.color || '#000000',
              fontSize: validatedParams.size || 16,
              fontFamily: validatedParams.font || 'Arial',
              strokeWidth: 1
            }
          );
          message = `تم كتابة النص: "${validatedParams.text}"`;
          break;
          
        case 'draw_arrow':
          // إصلاح مشكلة رسم السهم - استخدام خط مع رأس سهم
          const arrowLine = this.whiteboard.drawLine(
            { x: validatedParams.from_x, y: validatedParams.from_y },
            { x: validatedParams.to_x, y: validatedParams.to_y },
            {
              strokeColor: validatedParams.color || '#ff0000',
              strokeWidth: validatedParams.thickness || 3
            }
          );

          // رسم رأس السهم
          const angle = Math.atan2(
            validatedParams.to_y - validatedParams.from_y,
            validatedParams.to_x - validatedParams.from_x
          );
          const arrowLength = 15;
          const arrowAngle = Math.PI / 6;

          // خط رأس السهم الأول
          this.whiteboard.drawLine(
            { x: validatedParams.to_x, y: validatedParams.to_y },
            {
              x: validatedParams.to_x - arrowLength * Math.cos(angle - arrowAngle),
              y: validatedParams.to_y - arrowLength * Math.sin(angle - arrowAngle)
            },
            {
              strokeColor: validatedParams.color || '#ff0000',
              strokeWidth: validatedParams.thickness || 3
            }
          );

          // خط رأس السهم الثاني
          this.whiteboard.drawLine(
            { x: validatedParams.to_x, y: validatedParams.to_y },
            {
              x: validatedParams.to_x - arrowLength * Math.cos(angle + arrowAngle),
              y: validatedParams.to_y - arrowLength * Math.sin(angle + arrowAngle)
            },
            {
              strokeColor: validatedParams.color || '#ff0000',
              strokeWidth: validatedParams.thickness || 3
            }
          );

          elementId = arrowLine;
          message = `تم رسم سهم يشير من (${validatedParams.from_x}, ${validatedParams.from_y}) إلى (${validatedParams.to_x}, ${validatedParams.to_y})`;
          break;
          
        case 'highlight_area':
          elementId = this.whiteboard.highlightArea(
            { x: validatedParams.x, y: validatedParams.y },
            validatedParams.width,
            validatedParams.height,
            {
              fillColor: validatedParams.color || '#ffff00',
              opacity: validatedParams.opacity || 0.3,
              strokeWidth: 0
            }
          );
          message = `تم تظليل منطقة بأبعاد ${validatedParams.width}×${validatedParams.height}`;
          break;
          
        case 'clear_whiteboard':
          this.whiteboard.clear();
          message = 'تم مسح السبورة بالكامل';
          break;
          
        case 'draw_coordinate_system':
          elementId = this.drawCoordinateSystem(validatedParams);
          message = 'تم رسم نظام الإحداثيات';
          break;
          
        case 'draw_equation':
          elementId = this.whiteboard.writeText(
            { x: validatedParams.x, y: validatedParams.y },
            validatedParams.equation,
            {
              strokeColor: validatedParams.color || '#0066cc',
              fontSize: validatedParams.size || 20,
              fontFamily: 'Arial, sans-serif',
              strokeWidth: 1
            }
          );
          message = `تم كتابة المعادلة: ${validatedParams.equation}`;
          break;
          
        default:
          throw new Error(`وظيفة غير معروفة: ${functionName}`);
      }
      
      return {
        success: true,
        elementId,
        message
      };
      
    } catch (error) {
      console.error('خطأ في تنفيذ وظيفة السبورة:', error);
      return {
        success: false,
        message: `خطأ في تنفيذ ${functionName}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }
  
  /**
   * رسم نظام إحداثيات
   */
  private drawCoordinateSystem(params: any): string {
    const originX = params.origin_x || 400;
    const originY = params.origin_y || 300;
    const xLength = params.x_length || 200;
    const yLength = params.y_length || 150;
    
    // رسم المحور السيني
    this.whiteboard.drawLine(
      { x: originX - xLength, y: originY },
      { x: originX + xLength, y: originY },
      { strokeColor: '#333333', strokeWidth: 2 }
    );
    
    // رسم المحور الصادي
    this.whiteboard.drawLine(
      { x: originX, y: originY - yLength },
      { x: originX, y: originY + yLength },
      { strokeColor: '#333333', strokeWidth: 2 }
    );
    
    // رسم سهم المحور السيني
    this.whiteboard.drawArrow(
      { x: originX + xLength - 20, y: originY },
      { x: originX + xLength, y: originY },
      { strokeColor: '#333333', strokeWidth: 2 }
    );
    
    // رسم سهم المحور الصادي
    this.whiteboard.drawArrow(
      { x: originX, y: originY - yLength + 20 },
      { x: originX, y: originY - yLength },
      { strokeColor: '#333333', strokeWidth: 2 }
    );
    
    // كتابة تسميات المحاور
    this.whiteboard.writeText(
      { x: originX + xLength + 10, y: originY + 5 },
      'x',
      { strokeColor: '#333333', fontSize: 16, strokeWidth: 1 }
    );
    
    this.whiteboard.writeText(
      { x: originX - 10, y: originY - yLength - 10 },
      'y',
      { strokeColor: '#333333', fontSize: 16, strokeWidth: 1 }
    );
    
    // إضافة أرقام إذا كان مطلوباً
    if (params.show_numbers) {
      // أرقام المحور السيني
      for (let i = -5; i <= 5; i++) {
        if (i !== 0) {
          const x = originX + (i * xLength / 5);
          this.whiteboard.writeText(
            { x: x, y: originY + 20 },
            i.toString(),
            { strokeColor: '#666666', fontSize: 12, strokeWidth: 1 }
          );
        }
      }
      
      // أرقام المحور الصادي
      for (let i = -3; i <= 3; i++) {
        if (i !== 0) {
          const y = originY - (i * yLength / 3);
          this.whiteboard.writeText(
            { x: originX - 20, y: y },
            i.toString(),
            { strokeColor: '#666666', fontSize: 12, strokeWidth: 1 }
          );
        }
      }
      
      // نقطة الأصل
      this.whiteboard.writeText(
        { x: originX - 15, y: originY + 15 },
        '0',
        { strokeColor: '#666666', fontSize: 12, strokeWidth: 1 }
      );
    }
    
    return 'coordinate_system';
  }
  
  /**
   * التحقق من صحة المعاملات
   */
  private validateParameters(functionName: string, parameters: any): any {
    const functionDef = WHITEBOARD_FUNCTIONS.find(f => f.name === functionName);
    if (!functionDef) {
      throw new Error(`وظيفة غير معروفة: ${functionName}`);
    }
    
    const validated: any = {};
    
    // التحقق من المعاملات المطلوبة
    for (const required of functionDef.parameters.required) {
      if (!(required in parameters)) {
        throw new Error(`معامل مطلوب مفقود: ${required}`);
      }
      validated[required] = parameters[required];
    }
    
    // إضافة المعاملات الاختيارية
    for (const [key, value] of Object.entries(parameters)) {
      if (key in functionDef.parameters.properties) {
        validated[key] = value;
      }
    }
    
    // التحقق من النطاقات
    this.validateRanges(functionName, validated);
    
    return validated;
  }
  
  /**
   * التحقق من نطاقات القيم
   */
  private validateRanges(functionName: string, params: any): void {
    // التحقق من إحداثيات X (0-800)
    const xParams = ['x', 'from_x', 'to_x', 'center_x', 'x1', 'x2', 'x3', 'origin_x'];
    for (const param of xParams) {
      if (param in params) {
        params[param] = Math.max(0, Math.min(800, params[param]));
      }
    }
    
    // التحقق من إحداثيات Y (0-600)
    const yParams = ['y', 'from_y', 'to_y', 'center_y', 'y1', 'y2', 'y3', 'origin_y'];
    for (const param of yParams) {
      if (param in params) {
        params[param] = Math.max(0, Math.min(600, params[param]));
      }
    }
    
    // التحقق من الأبعاد
    if ('width' in params) {
      params.width = Math.max(10, Math.min(400, params.width));
    }
    if ('height' in params) {
      params.height = Math.max(10, Math.min(300, params.height));
    }
    if ('radius' in params) {
      params.radius = Math.max(5, Math.min(200, params.radius));
    }
    
    // التحقق من السماكة
    if ('thickness' in params) {
      params.thickness = Math.max(1, Math.min(10, params.thickness));
    }
    
    // التحقق من حجم الخط
    if ('size' in params) {
      params.size = Math.max(12, Math.min(48, params.size));
    }
    
    // التحقق من الشفافية
    if ('opacity' in params) {
      params.opacity = Math.max(0.1, Math.min(0.8, params.opacity));
    }
  }
  
  /**
   * الحصول على قائمة الوظائف المتاحة
   */
  getAvailableFunctions(): WhiteboardFunction[] {
    return WHITEBOARD_FUNCTIONS;
  }
  
  /**
   * الحصول على وصف وظيفة معينة
   */
  getFunctionDescription(functionName: string): WhiteboardFunction | null {
    return WHITEBOARD_FUNCTIONS.find(f => f.name === functionName) || null;
  }
}
