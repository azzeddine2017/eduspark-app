'use client';

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { MarjanWhiteboard } from '@/lib/marjan-whiteboard';
import { WhiteboardFunctionExecutor } from '@/lib/whiteboard-functions';
import { 
  Eraser, 
  Download, 
  Grid3X3, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Palette,
  Settings
} from 'lucide-react';

interface MarjanWhiteboardProps {
  className?: string;
  onFunctionCall?: (functionName: string, parameters: any) => Promise<void>;
  showControls?: boolean;
  autoResize?: boolean;
}

export interface MarjanWhiteboardRef {
  executeFunction: (functionName: string, parameters: any) => Promise<any>;
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
    }
  }, []);

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
      link.download = `marjan-whiteboard-${Date.now()}.png`;
      link.href = imageData;
      link.click();
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
      {/* أدوات التحكم */}
      {showControls && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 space-x-reverse z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2 space-x-reverse">
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
            width: isFullscreen ? 'auto' : '800px',
            height: isFullscreen ? 'auto' : '600px',
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
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 640px;
        }
        
        .whiteboard-canvas {
          cursor: crosshair;
          transition: all 0.3s ease;
        }
        
        .whiteboard-canvas:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        @media (max-width: 768px) {
          .whiteboard-canvas-container {
            padding: 10px;
            min-height: 400px;
          }
          
          .whiteboard-canvas {
            width: 100% !important;
            height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
});

MarjanWhiteboardComponent.displayName = 'MarjanWhiteboard';

export default MarjanWhiteboardComponent;
