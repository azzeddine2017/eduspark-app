'use client';

import { useState } from 'react';

interface Node {
  id: string;
  name: string;
  region: string;
  country: string;
  status: string;
  userCount?: number;
  revenue?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface WorldMapProps {
  nodes: Node[];
  selectedNode?: string;
  onNodeSelect?: (nodeId: string) => void;
}

// إحداثيات تقريبية للمناطق الرئيسية
const regionCoordinates: Record<string, { lat: number; lng: number }> = {
  'المغرب': { lat: 31.7917, lng: -7.0926 },
  'مصر': { lat: 26.8206, lng: 30.8025 },
  'السعودية': { lat: 23.8859, lng: 45.0792 },
  'الإمارات': { lat: 23.4241, lng: 53.8478 },
  'الأردن': { lat: 30.5852, lng: 36.2384 },
  'لبنان': { lat: 33.8547, lng: 35.8623 },
  'تونس': { lat: 33.8869, lng: 9.5375 },
  'الجزائر': { lat: 28.0339, lng: 1.6596 },
  'العراق': { lat: 33.2232, lng: 43.6793 },
  'سوريا': { lat: 34.8021, lng: 38.9968 },
  'فلسطين': { lat: 31.9522, lng: 35.2332 },
  'الكويت': { lat: 29.3117, lng: 47.4818 },
  'قطر': { lat: 25.3548, lng: 51.1839 },
  'البحرين': { lat: 25.9304, lng: 50.6378 },
  'عمان': { lat: 21.4735, lng: 55.9754 },
  'اليمن': { lat: 15.5527, lng: 48.5164 }
};

export default function WorldMap({ nodes, selectedNode, onNodeSelect }: WorldMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // تحضير بيانات العقد مع الإحداثيات
  const nodesWithCoordinates = nodes.map(node => ({
    ...node,
    coordinates: regionCoordinates[node.region] || regionCoordinates[node.country] || { lat: 0, lng: 0 }
  }));

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#10B981'; // أخضر
      case 'PENDING':
        return '#F59E0B'; // برتقالي
      case 'SUSPENDED':
        return '#EF4444'; // أحمر
      default:
        return '#6B7280'; // رمادي
    }
  };

  const getNodeSize = (userCount: number = 0) => {
    if (userCount > 1000) return 12;
    if (userCount > 500) return 10;
    if (userCount > 100) return 8;
    return 6;
  };

  return (
    <div className="relative w-full h-96 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* خريطة العالم المبسطة */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ background: 'linear-gradient(to bottom, #E0F2FE 0%, #BAE6FD 100%)' }}
      >
        {/* خلفية المحيطات */}
        <rect width="1000" height="500" fill="#0EA5E9" opacity="0.1" />
        
        {/* القارات المبسطة */}
        {/* أفريقيا */}
        <path
          d="M480 180 L520 180 L540 220 L530 280 L510 320 L480 300 L460 280 L470 220 Z"
          fill="#10B981"
          opacity="0.2"
          stroke="#10B981"
          strokeWidth="1"
        />
        
        {/* آسيا */}
        <path
          d="M520 120 L700 120 L720 180 L680 220 L640 200 L580 180 L540 160 Z"
          fill="#10B981"
          opacity="0.2"
          stroke="#10B981"
          strokeWidth="1"
        />
        
        {/* أوروبا */}
        <path
          d="M450 120 L520 120 L540 160 L500 180 L460 160 Z"
          fill="#10B981"
          opacity="0.2"
          stroke="#10B981"
          strokeWidth="1"
        />
        
        {/* أمريكا الشمالية */}
        <path
          d="M150 120 L300 120 L320 180 L280 220 L200 200 L120 180 Z"
          fill="#10B981"
          opacity="0.2"
          stroke="#10B981"
          strokeWidth="1"
        />
        
        {/* أمريكا الجنوبية */}
        <path
          d="M200 220 L280 220 L300 320 L250 380 L200 360 L180 280 Z"
          fill="#10B981"
          opacity="0.2"
          stroke="#10B981"
          strokeWidth="1"
        />

        {/* العقد على الخريطة */}
        {nodesWithCoordinates.map((node) => {
          // تحويل الإحداثيات الجغرافية إلى إحداثيات SVG
          const x = ((node.coordinates.lng + 180) / 360) * 1000;
          const y = ((90 - node.coordinates.lat) / 180) * 500;
          const size = getNodeSize(node.userCount);
          const color = getNodeColor(node.status);
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;

          return (
            <g key={node.id}>
              {/* دائرة النبض للعقد النشطة */}
              {node.status === 'ACTIVE' && (
                <circle
                  cx={x}
                  cy={y}
                  r={size + 4}
                  fill={color}
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
              
              {/* العقدة الرئيسية */}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={color}
                stroke={isSelected ? '#7C3AED' : '#FFFFFF'}
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer transition-all duration-200 hover:scale-110"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onNodeSelect?.(node.id)}
              />
              
              {/* تسمية العقدة */}
              {(isHovered || isSelected) && (
                <g>
                  {/* خلفية التسمية */}
                  <rect
                    x={x - 40}
                    y={y - size - 25}
                    width="80"
                    height="20"
                    fill="#1F2937"
                    rx="4"
                    opacity="0.9"
                  />
                  {/* نص التسمية */}
                  <text
                    x={x}
                    y={y - size - 12}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {node.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* مفتاح الخريطة */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          حالة العقد
        </h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 ml-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">نشطة</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 ml-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">قيد المراجعة</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 ml-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">معلقة</span>
          </div>
        </div>
      </div>

      {/* معلومات العقدة المحددة */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 min-w-48">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {node.name}
                </h4>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>المنطقة:</span>
                    <span>{node.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الحالة:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      node.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : node.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {node.status === 'ACTIVE' ? 'نشطة' : 
                       node.status === 'PENDING' ? 'قيد المراجعة' : 'معلقة'}
                    </span>
                  </div>
                  {node.userCount && (
                    <div className="flex justify-between">
                      <span>المستخدمين:</span>
                      <span>{node.userCount.toLocaleString()}</span>
                    </div>
                  )}
                  {node.revenue && (
                    <div className="flex justify-between">
                      <span>الإيرادات:</span>
                      <span>${node.revenue.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* إحصائيات سريعة */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {nodes.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            إجمالي العقد
          </div>
        </div>
      </div>
    </div>
  );
}
