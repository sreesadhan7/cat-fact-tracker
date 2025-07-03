'use client';

import { useState, useEffect, useCallback } from 'react';
import CatFactCard from '@/components/CatFactCard';
import AddFactForm from '@/components/AddFactForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/components/ToastProvider';
import { CatFact } from '@/types/catFact';

export default function Home() {
  const [catFacts, setCatFacts] = useState<CatFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'user' | 'api'>('all');
  const [isGettingRandomFact, setIsGettingRandomFact] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const fetchFacts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/catfacts');
      if (response.ok) {
        const facts = await response.json();
        // Transform the API response to match our CatFact interface
        const transformedFacts = facts.map((fact: { id: number; fact: string; created_at: string }) => ({
          id: fact.id,
          fact: fact.fact,
          source: 'api', // Backend doesn't track source, so default to 'api'
          timestamp: fact.created_at,
          favorite: false // Backend doesn't track favorites, so default to false
        }));
        setCatFacts(transformedFacts);
      } else {
        throw new Error('Failed to fetch facts');
      }
    } catch (error) {
      console.error('Error fetching facts:', error);
      showError('Unable to connect to the backend. Make sure the API server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchFacts();
  }, [fetchFacts]);

  const handleAddFact = async (fact: string) => {
    try {
      const formData = new FormData();
      formData.append('fact', fact);
      
      const response = await fetch('http://localhost:8000/catfacts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Transform the response to match our CatFact interface
          const newFact = {
            id: result.data.id,
            fact: result.data.fact,
            source: 'user', // Mark user-added facts as 'user'
            timestamp: result.data.created_at,
            favorite: false
          };
          setCatFacts([newFact, ...catFacts]);
          showSuccess('Cat fact added successfully!');
        } else {
          // Handle duplicate facts gracefully
          if (result.error === 'DUPLICATE_FACT') {
            showWarning('This cat fact already exists in the database. Try adding a different fact!');
          } else {
            showError(result.message || 'Failed to add fact');
          }
          return; // Don't throw error for duplicates
        }
      } else {
        throw new Error('Failed to add fact');
      }
    } catch (error) {
      console.error('Error adding fact:', error);
      showError('Failed to add the cat fact. Please try again.');
    }
  };

  const handleDeleteFact = async (id: number) => {
    // Since backend doesn't support delete, just remove from local state
    setCatFacts(catFacts.filter(fact => fact.id !== id));
  };

  const handleToggleFavorite = async (id: number) => {
    // Since backend doesn't support favorites, just toggle in local state
    setCatFacts(catFacts.map(fact => 
      fact.id === id ? { ...fact, favorite: !fact.favorite } : fact
    ));
  };

  const handleGetRandomFact = async () => {
    setIsGettingRandomFact(true);
    try {
      const response = await fetch('http://localhost:8000/catfacts/random');
      if (response.ok) {
        const randomFactData = await response.json();
        
        // Try to add the fact, but handle duplicates gracefully
        const formData = new FormData();
        formData.append('fact', randomFactData.fact);
        
        const addResponse = await fetch('http://localhost:8000/catfacts', {
          method: 'POST',
          body: formData,
        });

        if (addResponse.ok) {
          const result = await addResponse.json();
          if (result.success && result.data) {
            // Transform the response to match our CatFact interface
            const newFact = {
              id: result.data.id,
              fact: result.data.fact,
              source: 'api', // Mark random facts as 'api'
              timestamp: result.data.created_at,
              favorite: false
            };
            setCatFacts([newFact, ...catFacts]);
            showSuccess('Random cat fact added successfully!');
          } else if (result.error === 'DUPLICATE_FACT') {
            showWarning('That random cat fact already exists! Try getting another one.');
          } else {
            showError(result.message || 'Failed to add random fact');
          }
        } else {
          throw new Error('Failed to add random fact');
        }
      } else {
        throw new Error('Failed to get random fact');
      }
    } catch (error) {
      console.error('Error getting random fact:', error);
      showError('Failed to get a random cat fact. Please try again.');
    } finally {
      setIsGettingRandomFact(false);
    }
  };

  const filteredFacts = catFacts.filter(fact => {
    switch (filter) {
      case 'favorites':
        return fact.favorite;
      case 'user':
        return fact.source === 'user';
      case 'api':
        return fact.source !== 'user';
      default:
        return true;
    }
  });

  const stats = {
    total: catFacts.length,
    favorites: catFacts.filter(fact => fact.favorite).length,
    userAdded: catFacts.filter(fact => fact.source === 'user').length,
    fromApi: catFacts.filter(fact => fact.source !== 'user').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🐱 Cat Fact Tracker
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover, collect, and manage fascinating cat facts!
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Facts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-red-500">{stats.favorites}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Favorites</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.userAdded}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">User Added</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.fromApi}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">From API</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Add Fact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Add New Cat Fact</h2>
            <AddFactForm onAddFact={handleAddFact} />
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetRandomFact}
                  disabled={isGettingRandomFact}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isGettingRandomFact ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Getting Random Fact...
                    </>
                  ) : (
                    '🎲 Get Random Cat Fact'
                  )}
                </button>
                <button
                  onClick={fetchFacts}
                  className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          {catFacts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Facts', count: stats.total },
                  { key: 'favorites', label: 'Favorites', count: stats.favorites },
                  { key: 'user', label: 'User Added', count: stats.userAdded },
                  { key: 'api', label: 'From API', count: stats.fromApi },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as 'all' | 'favorites' | 'user' | 'api')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filter === key
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cat Facts List */}
          <div className="space-y-6">
            {loading ? (
              <LoadingSpinner text="Loading cat facts..." />
            ) : filteredFacts.length === 0 ? (
              <EmptyState 
                title={filter === 'all' ? "No cat facts yet!" : `No ${filter} facts found!`}
                description={filter === 'all' 
                  ? "Add your first cat fact or get a random one to get started."
                  : `Try switching to a different filter or add some ${filter} facts.`
                }
                actionButton={
                  <button
                    onClick={handleGetRandomFact}
                    disabled={isGettingRandomFact}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    🎲 Get Your First Cat Fact
                  </button>
                }
              />
            ) : (
              filteredFacts.map((fact) => (
                <CatFactCard
                  key={fact.id}
                  fact={fact}
                  onDelete={handleDeleteFact}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
