import React from 'react';
import { ChartIcon } from './ChartIcon';

interface StatsCardProps {
  title: string;
  value: number;
  icon: 'chart-line' | 'chart-bar' | 'chart-pie' | 'trending-up' | 'trending-down' | 'activity';
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'gray';
  description?: string;
}

export function StatsCard({ title, value, icon, color, description }: StatsCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
      <div className="flex items-center space-x-4">
        <div className="text-gray-600 dark:text-gray-400">
          <ChartIcon name={icon} size={40} className={colorClasses[color]} />
        </div>
        <div className="text-center flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MiniChartProps {
  data: number[];
  type: 'line' | 'bar';
  color?: string;
  height?: number;
}

export function MiniChart({ data, type, color = 'rgb(59, 130, 246)', height = 60 }: MiniChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  if (type === 'line') {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  }

  // Bar chart
  return (
    <div className="w-full flex items-end justify-between space-x-1" style={{ height }}>
      {data.map((value, index) => {
        const barHeight = ((value - min) / range) * 100;
        return (
          <div
            key={index}
            className="flex-1 rounded-t-sm"
            style={{
              backgroundColor: color,
              height: `${barHeight}%`,
              minHeight: '2px'
            }}
          />
        );
      })}
    </div>
  );
}
