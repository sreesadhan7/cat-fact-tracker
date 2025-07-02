'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`animate-spin rounded-full border-4 border-purple-200 border-t-purple-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">{text}</p>
      )}
    </div>
  );
}
