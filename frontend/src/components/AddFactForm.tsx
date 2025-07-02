'use client';

import { useState } from 'react';

interface AddFactFormProps {
  onAddFact: (fact: string) => void;
}

export default function AddFactForm({ onAddFact }: AddFactFormProps) {
  const [fact, setFact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fact.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddFact(fact.trim());
      setFact('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Add a New Cat Fact
        </label>
        <textarea
          id="fact"
          value={fact}
          onChange={(e) => setFact(e.target.value)}
          placeholder="Enter an interesting cat fact..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={!fact.trim() || isSubmitting}
        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </>
        ) : (
          '✨ Add Cat Fact'
        )}
      </button>
    </form>
  );
}
