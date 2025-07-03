'use client';

import { useState } from 'react';
import { CatFact } from '@/types/catFact';
import { Card, CardHeader, CardFooter, CardTitle, CardAction } from '@/components/ui/card';

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
    // Handle different date string formats
    let date;
    
    // If the dateString doesn't include timezone info, treat it as UTC
    if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
      date = new Date(dateString + 'Z'); // Add Z to treat as UTC
    } else {
      date = new Date(dateString);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Debug logging (remove after fixing)
    console.log('Original dateString:', dateString);
    console.log('Parsed date (UTC):', date.toISOString());
    console.log('Current time (UTC):', new Date().toISOString());
    console.log('Local time now:', new Date().toLocaleString());
    
    // Format in user's local timezone
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800 mx-4 my-8 p-4 shadow-md">
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Index Badge */}
          {index !== undefined && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-md">
                ({index})&nbsp;
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
              {fact.fact}
            </CardTitle>
          </div>
        </div>
        
        {/* Action Buttons */}
        <CardAction>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriting}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                fact.favorite
                  ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md hover:shadow-lg focus:ring-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 focus:ring-yellow-400'
              } ${isFavoriting ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={fact.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavoriting ? '⏳' : fact.favorite ? '❤️' : '🤍'}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 focus:ring-red-400 ${
                isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Delete fact"
            >
              {isDeleting ? '⏳' : '🗑️'}
            </button>
          </div>
        </CardAction>
      </CardHeader>
      
      <CardFooter>
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="mr-2">📅</span>
            <span className="font-medium">{formatDate(fact.created_at)}</span>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Source Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              fact.source === 'user' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
            }`}>
              <span className="mr-1">
                {fact.source === 'user' ? '👤' : '🌐'}
              </span>
              {fact.source === 'user' ? 'User Added' : 'API'}
            </span>
            
            {/* Favorite Badge */}
            {fact.favorite && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm">
                <span className="mr-1">⭐</span>
                Favorite
              </span>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
