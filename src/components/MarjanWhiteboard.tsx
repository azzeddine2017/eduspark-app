'use client';

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { MarjanWhiteboard } from '@/lib/marjan-whiteboard';
import { WhiteboardFunctionExecutor } from '@/lib/whiteboard-functions';
import {
  Eraser,
  Download,
  Grid3X3,
  Maximize2,
  Minimize2,
  Palette,
  Circle,
  Square as SquareIcon,
  Triangle,
  Type,
  Minus,
  MousePointer
} from 'lucide-react';

interface MarjanWhiteboardProps {
  className?: string;
  onFunctionCall?: (functionName: string, parameters: Record<string, unknown>) => Promise<void>;
  showControls?: boolean;
  autoResize?: boolean;
}

export interface MarjanWhiteboardRef {
  executeFunction: (functionName: string, parameters: Record<string, unknown>) => Promise<unknown>;
  clear: () => void;
  exportImage: () => string;
  getWhiteboard: () => MarjanWhiteboard | null;
}

const MarjanWhiteboardComponent = forwardRef<MarjanWhiteboardRef, MarjanWhiteboardProps>(({
  className = '',
  onFunctionCall,
  showControls = true,
  autoResize = true
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [whiteboard, setWhiteboard] = useState<MarjanWhiteboard | null>(null);
  const [executor, setExecutor] = useState<WhiteboardFunctionExecutor | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pointer' | 'line' | 'circle' | 'rectangle' | 'triangle' | 'text'>('pointer');
  const [currentColor, setCurrentColor] = useState('#0066cc');
  const [showToolbar, setShowToolbar] = useState(true);

  // إعداد السبورة عند تحميل المكون
  useEffect(() => {
    if (canvasRef.current) {
      const wb = new MarjanWhiteboard(canvasRef.current);
      const exec = new WhiteboardFunctionExecutor(wb);

      setWhiteboard(wb);
      setExecutor(exec);

      // ربط executor مع النافذة للوصول العام
      if (typeof window !== 'undefined') {
        (window as any).marjanWhiteboardExecutor = exec;
      }

      // إعداد التفاعل المباشر مع السبورة
      setupInteractiveDrawing(canvasRef.current, wb);
    }
  }, []);

  // إعداد الرسم التفاعلي
  const setupInteractiveDrawing = (canvas: HTMLCanvasElement, wb: MarjanWhiteboard) => {
    let isDrawing = false;
    let startPoint: { x: number; y: number } | null = null;

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (currentTool === 'pointer') return;

      isDrawing = true;
      startPoint = getMousePos(e);
      setIsAnimating(true);
    };

    const handleMouseUp = async (e: MouseEvent) => {
      if (!isDrawing || !startPoint || !executor) return;

      const endPoint = getMousePos(e);

      try {
        switch (currentTool) {
          case 'line':
            await executor.executeFunction('draw_line', {
              x1: startPoint.x, y1: startPoint.y,
              x2: endPoint.x, y2: endPoint.y,
              color: currentColor,
              thickness: 2
            });
            break;

          case 'circle':
            const radius = Math.sqrt(
              Math.pow(endPoint.x - startPoint.x, 2) +
              Math.pow(endPoint.y - startPoint.y, 2)
            );
            await executor.executeFunction('draw_circle', {
              x: startPoint.x, y: startPoint.y,
              radius: radius,
              color: currentColor,
              thickness: 2
            });
            break;

          case 'rectangle':
            await executor.executeFunction('draw_rectangle', {
              x: Math.min(startPoint.x, endPoint.x),
              y: Math.min(startPoint.y, endPoint.y),
              width: Math.abs(endPoint.x - startPoint.x),
              height: Math.abs(endPoint.y - startPoint.y),
              color: currentColor,
              thickness: 2
            });
            break;

          case 'triangle':
            await executor.executeFunction('draw_triangle', {
              x1: startPoint.x, y1: startPoint.y,
              x2: endPoint.x, y2: endPoint.y,
              x3: startPoint.x - (endPoint.x - startPoint.x), y3: endPoint.y,
              color: currentColor,
              thickness: 2
            });
            break;

          case 'text':
            const text = prompt('أدخل النص:');
            if (text) {
              await executor.executeFunction('write_text', {
                x: startPoint.x, y: startPoint.y,
                text: text,
                size: 16,
                color: currentColor
              });
            }
            break;
        }
      } catch (error) {
        console.error('خطأ في الرسم التفاعلي:', error);
      }

      isDrawing = false;
      startPoint = null;
      setIsAnimating(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    // تنظيف المستمعين عند إلغاء التحميل
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  };

  // تعريض الوظائف للمكونات الأخرى
  useImperativeHandle(ref, () => ({
    executeFunction: async (functionName: string, parameters: any) => {
      if (!executor) {
        throw new Error('السبورة غير جاهزة بعد');
      }
      
      setIsAnimating(true);
      try {
        const result = await executor.executeFunction(functionName, parameters);
        
        // إضافة تأخير بسيط لإظهار التحريك
        setTimeout(() => setIsAnimating(false), 1000);
        
        return result;
      } catch (error) {
        setIsAnimating(false);
        throw error;
      }
    },
    
    clear: () => {
      whiteboard?.clear();
      setIsAnimating(false);
    },
    
    exportImage: () => {
      return whiteboard?.exportAsImage() || '';
    },
    
    getWhiteboard: () => whiteboard
  }), [whiteboard, executor]);

  // وظائف التحكم
  const handleClear = () => {
    whiteboard?.clear();
    setIsAnimating(false);
  };

  const handleDownload = () => {
    if (whiteboard) {
      const imageData = whiteboard.exportAsImage();
      const link = document.createElement('a');
      link.download = `مرجان_السبورة_${new Date().toISOString().slice(0, 10)}_${Date.now()}.png`;
      link.href = imageData;
      link.click();

      // إظهار رسالة نجاح
      console.log('✅ تم تصدير السبورة بنجاح');

      // يمكن إضافة إشعار للمستخدم هنا
      if (typeof window !== 'undefined') {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = '✅ تم تصدير السبورة بنجاح';
        document.body.appendChild(notification);

        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    }
  };

  const handleToggleGrid = () => {
    if (whiteboard) {
      whiteboard.toggleGrid();
      setShowGrid(!showGrid);
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // تجربة رسم سريع للاختبار
  const handleQuickDemo = () => {
    if (!executor) return;
    
    setIsAnimating(true);
    
    // مسح السبورة أولاً
    executor.executeFunction('clear_whiteboard', {});
    
    // رسم مثال سريع لنظرية فيثاغورس
    setTimeout(() => {
      // رسم المثلث
      executor.executeFunction('draw_triangle', {
        x1: 200, y1: 300,
        x2: 400, y2: 300,
        x3: 200, y3: 150,
        color: '#0066cc',
        thickness: 3
      });
    }, 500);
    
    setTimeout(() => {
      // تسمية الأضلاع
      executor.executeFunction('write_text', {
        x: 300, y: 320,
        text: 'أ = 4',
        size: 16,
        color: '#0066cc'
      });
    }, 1500);
    
    setTimeout(() => {
      executor.executeFunction('write_text', {
        x: 180, y: 225,
        text: 'ب = 3',
        size: 16,
        color: '#0066cc'
      });
    }, 2000);
    
    setTimeout(() => {
      executor.executeFunction('write_text', {
        x: 320, y: 220,
        text: 'ج = ؟',
        size: 16,
        color: '#ff6600'
      });
    }, 2500);
    
    setTimeout(() => {
      // كتابة المعادلة
      executor.executeFunction('draw_equation', {
        x: 500, y: 200,
        equation: 'أ² + ب² = ج²',
        size: 20,
        color: '#cc0066'
      });
    }, 3000);
    
    setTimeout(() => {
      executor.executeFunction('draw_equation', {
        x: 500, y: 240,
        equation: '4² + 3² = ج²',
        size: 18,
        color: '#cc0066'
      });
    }, 3500);
    
    setTimeout(() => {
      executor.executeFunction('draw_equation', {
        x: 500, y: 280,
        equation: '16 + 9 = ج²',
        size: 18,
        color: '#cc0066'
      });
    }, 4000);
    
    setTimeout(() => {
      executor.executeFunction('draw_equation', {
        x: 500, y: 320,
        equation: 'ج = 5',
        size: 20,
        color: '#009900'
      });
      
      // رسم سهم يشير للنتيجة
      executor.executeFunction('draw_arrow', {
        x: 480, y: 320,
        to_x: 320, to_y: 220,
        color: '#009900',
        thickness: 2
      });
      
      setIsAnimating(false);
    }, 4500);
  };

  return (
    <div 
      ref={containerRef}
      className={`whiteboard-container relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}
    >
      {/* شريط أدوات الرسم التفاعلي */}
      {showControls && showToolbar && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
              أدوات الرسم
            </div>

            <div className="grid grid-cols-3 gap-1">
              {/* أداة المؤشر */}
              <button
                onClick={() => setCurrentTool('pointer')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'pointer'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title="مؤشر"
              >
                <MousePointer className="w-4 h-4" />
              </button>

              {/* أداة الخط */}
              <button
                onClick={() => setCurrentTool('line')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'line'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title="خط"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* أداة الدائرة */}
              <button
                onClick={() => setCurrentTool('circle')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'circle'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title="دائرة"
              >
                <Circle className="w-4 h-4" />
              </button>

              {/* أداة المستطيل */}
              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'rectangle'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title="مستطيل"
              >
                <SquareIcon className="w-4 h-4" />
              </button>

              {/* أداة المثلث */}
              <button
                onClick={() => setCurrentTool('triangle')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'triangle'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title="مثلث"
              >
                <Triangle className="w-4 h-4" />
              </button>

              {/* أداة النص */}
              <button
                onClick={() => setCurrentTool('text')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'text'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title="نص"
              >
                <Type className="w-4 h-4" />
              </button>
            </div>

            {/* اختيار اللون */}
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">اللون:</div>
              <div className="flex space-x-1 space-x-reverse">
                {['#0066cc', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#000000'].map(color => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      currentColor === color
                        ? 'border-gray-800 dark:border-gray-200 scale-110'
                        : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`لون ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أدوات التحكم */}
      {showControls && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 space-x-reverse z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2 space-x-reverse">
            {/* زر إظهار/إخفاء شريط الأدوات */}
            <button
              onClick={() => setShowToolbar(!showToolbar)}
              className={`p-2 rounded-lg transition-colors ${
                showToolbar
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              title={showToolbar ? 'إخفاء الأدوات' : 'إظهار الأدوات'}
            >
              <Palette className="w-5 h-5" />
            </button>

            {/* زر المسح */}
            <button
              onClick={handleClear}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="مسح السبورة"
              disabled={isAnimating}
            >
              <Eraser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* زر الشبكة */}
            <button
              onClick={handleToggleGrid}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                showGrid ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="إظهار/إخفاء الشبكة"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            
            {/* زر التحميل */}
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="تحميل السبورة"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* زر الشاشة الكاملة */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isFullscreen ? 'تصغير' : 'شاشة كاملة'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            
            {/* زر التجربة السريعة */}
            <button
              onClick={handleQuickDemo}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors bg-purple-100 dark:bg-purple-900"
              title="تجربة سريعة - نظرية فيثاغورس"
              disabled={isAnimating}
            >
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </button>
          </div>
        </div>
      )}

      {/* مؤشر التحريك */}
      {isAnimating && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">مرجان يرسم...</span>
          </div>
        </div>
      )}

      {/* السبورة */}
      <div className={`whiteboard-canvas-container ${isFullscreen ? 'flex items-center justify-center h-full' : ''}`}>
        <canvas
          ref={canvasRef}
          className={`whiteboard-canvas border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white ${
            isFullscreen ? 'max-w-full max-h-full' : 'w-full h-full'
          }`}
          style={{
            width: '100%',
            height: '100%',
            minWidth: '400px',
            minHeight: '300px',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>

      {/* معلومات السبورة */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-4 space-x-reverse">
            <span>📐 السبورة التفاعلية</span>
            <span>🎨 800×600</span>
            {isAnimating && <span className="text-blue-500">⚡ نشط</span>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .whiteboard-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .whiteboard-canvas-container {
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100%;
          height: 100%;
        }

        .whiteboard-canvas {
          cursor: crosshair;
          transition: all 0.3s ease;
          border-radius: 8px;
          width: 100% !important;
          height: 100% !important;
          max-width: 100%;
          max-height: 100%;
        }

        .whiteboard-canvas:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: scale(1.01);
        }

        .whiteboard-canvas:active {
          transform: scale(0.99);
        }

        @media (max-width: 768px) {
          .whiteboard-canvas-container {
            padding: 5px;
            min-height: 300px;
          }

          .whiteboard-canvas {
            width: 100% !important;
            height: 100% !important;
            min-height: 250px;
          }
        }

        @media (min-width: 1200px) {
          .whiteboard-canvas-container {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
});

MarjanWhiteboardComponent.displayName = 'MarjanWhiteboard';

export default MarjanWhiteboardComponent;
