'use client';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export default function EmptyState({ 
  title = "No cat facts yet!", 
  description = "Add your first cat fact or get a random one to get started.",
  actionButton 
}: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="relative mb-8">
        {/* Main cat emoji with floating animation */}
        <div className="text-8xl mb-4 animate-float">�</div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 text-3xl opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
        <div className="absolute -top-2 -right-6 text-2xl opacity-50 animate-bounce" style={{animationDelay: '1s'}}>🌟</div>
        <div className="absolute -bottom-2 left-2 text-xl opacity-50 animate-bounce" style={{animationDelay: '1.5s'}}>💫</div>
      </div>
      
      <div className="max-w-lg mx-auto">
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {description}
        </p>
        
        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass dark:glass-dark rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Your Own</div>
          </div>
          <div className="glass dark:glass-dark rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl mb-2">🎲</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Get Random</div>
          </div>
          <div className="glass dark:glass-dark rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl mb-2">❤️</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Save Favorites</div>
          </div>
        </div>
        
        {actionButton && (
          <div className="mt-8">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}
