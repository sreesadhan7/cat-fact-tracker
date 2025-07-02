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
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🐱</div>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {actionButton && (
        <div className="mt-6">
          {actionButton}
        </div>
      )}
    </div>
  );
}
