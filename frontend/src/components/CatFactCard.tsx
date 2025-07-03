'use client';

import { useState } from 'react';
import { CatFact } from '@/types/catFact';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface CatFactCardProps {
  fact: CatFact;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  index?: number;
}

export default function CatFactCard({ fact, onDelete, onToggleFavorite, index }: CatFactCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this cat fact?')) {
      setIsDeleting(true);
      try {
        await onDelete(fact.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleFavorite = async () => {
    setIsFavoriting(true);
    try {
      await onToggleFavorite(fact.id);
    } finally {
      setIsFavoriting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full flex flex-col border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex-shrink-0 flex items-center justify-between">
        {index !== undefined && (
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mr-2">#{index}</span>
        )}
        <div className="flex justify-between items-start gap-4 w-full">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
            {fact.fact}
          </p>
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriting}
              className={`p-2 rounded-full transition-all duration-200 ${
                fact.favorite
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400'
              } ${isFavoriting ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={fact.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavoriting ? '⏳' : fact.favorite ? '❤️' : '🤍'}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-2 rounded-full transition-all duration-200 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 ${
                isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Delete fact"
            >
              {isDeleting ? '⏳' : '🗑️'}
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {formatDate(fact.created_at)}
          </span>
        </div>
        
        <div className="flex flex-col space-y-1 flex-grow"></div>
        <div className="flex justify-end mt-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            fact.source === 'user' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
          }`}>
            <span className="mr-1">
              {fact.source === 'user' ? '👤' : '🌐'}
            </span>
            {fact.source === 'user' ? 'User Added' : 'API'}
          </span>
        </div>
        {fact.favorite && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white mt-2">
            <span className="mr-1">⭐</span>
            Favorite
          </span>
        )}
      </CardContent>
    </Card>
  );
}
