'use client';

import { useState, useEffect, useCallback } from 'react';
import CatFactCard from '@/components/CatFactCard';
import AddFactForm from '@/components/AddFactForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/theme-toggle';
import { StatsCard } from '@/components/Charts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CatFact } from '@/types/catFact';

export default function Home() {
  const [catFacts, setCatFacts] = useState<CatFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGettingRandomFact, setIsGettingRandomFact] = useState(false);
  const [isAddingFact, setIsAddingFact] = useState(false);
  const [newFact, setNewFact] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userAddedFactIds, setUserAddedFactIds] = useState<Set<number>>(new Set());
  const factsPerPage = 5;

  const fetchFacts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/catfacts');
      if (response.ok) {
        const facts = await response.json();
        const transformedFacts = facts.map((fact: { id: number; fact: string; created_at: string }) => ({
          id: fact.id,
          fact: fact.fact,
          source: userAddedFactIds.has(fact.id) ? 'user' : 'api',
          created_at: fact.created_at,
          favorite: false
        }));
        setCatFacts(transformedFacts);
      } else {
        throw new Error('Failed to fetch facts');
      }
    } catch (error) {
      console.error('Error fetching facts:', error);
      toast.error('Unable to connect to the backend. Make sure the API server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  }, [userAddedFactIds]);

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
          // Track this fact as user-added
          setUserAddedFactIds(prev => new Set([...prev, result.data.id]));
          // Instead of manually adding to state, refresh from server to get accurate data
          await fetchFacts();
          setCurrentPage(1); // Reset to first page when new fact is added
          toast.success('Cat fact added successfully!');
        } else {
          if (result.error === 'DUPLICATE_FACT') {
            toast.warning('This cat fact already exists in the database. Try adding a different fact!');
          } else {
            toast.error(result.message || 'Failed to add fact');
          }
        }
      } else {
        throw new Error('Failed to add fact');
      }
    } catch (error) {
      console.error('Error adding fact:', error);
      toast.error('Failed to add the cat fact. Please try again.');
    }
  };

  const handleAddFactClick = async () => {
    if (!newFact.trim()) return;
    
    setIsAddingFact(true);
    try {
      await handleAddFact(newFact.trim());
      setNewFact('');
    } finally {
      setIsAddingFact(false);
    }
  };

  const handleDeleteFact = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/catfacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Instead of just removing from local state, refresh from server
        await fetchFacts();
        // Remove from userAddedFactIds if it was user-added
        setUserAddedFactIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success('Cat fact deleted successfully!');
      } else {
        throw new Error('Failed to delete fact');
      }
    } catch (error) {
      console.error('Error deleting fact:', error);
      toast.error('Failed to delete the cat fact. Please try again.');
    }
  };

  const handleToggleFavorite = async (id: number) => {
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
        
        const formData = new FormData();
        formData.append('fact', randomFactData.fact);
        
        const addResponse = await fetch('http://localhost:8000/catfacts', {
          method: 'POST',
          body: formData,
        });

        if (addResponse.ok) {
          const result = await addResponse.json();
          if (result.success && result.data) {
            // Instead of manually adding to state, refresh from server to get accurate data
            await fetchFacts();
            setCurrentPage(1); // Reset to first page when new fact is added
            toast.success('Random cat fact added successfully!');
          } else if (result.error === 'DUPLICATE_FACT') {
            toast.warning('That random cat fact already exists! Try getting another one.');
          } else {
            toast.error(result.message || 'Failed to add random fact');
          }
        } else {
          throw new Error('Failed to add random fact');
        }
      } else {
        throw new Error('Failed to get random fact');
      }
    } catch (error) {
      console.error('Error getting random fact:', error);
      toast.error('Failed to get a random cat fact. Please try again.');
    } finally {
      setIsGettingRandomFact(false);
    }
  };

  // Calculate useful stats
  const stats = {
    total: catFacts.length,
    userAdded: catFacts.filter(fact => fact.source === 'user').length,
    apiFacts: catFacts.filter(fact => fact.source === 'api').length,
    favorites: catFacts.filter(fact => fact.favorite).length
  };

  // Pagination logic
  const totalPages = Math.ceil(catFacts.length / factsPerPage);
  const startIndex = (currentPage - 1) * factsPerPage;
  const endIndex = startIndex + factsPerPage;
  const currentFacts = catFacts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        
        {/* Theme Toggle in Top Right */}
        <div className="flex justify-end mb-1">
          <ThemeToggle />
        </div>
        
        {/* Header at Top Center */}
        <div className="text-center mb-2">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="flex items-center justify-center space-x-4 mb-1">
              <span className="text-7xl">🐱</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Cat Fact Tracker
              </h1>
            </div>
            <h4 className="text-gray-600 dark:text-gray-400 text-xl font-light">
              Discover and manage amazing cat facts
            </h4>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Facts"
            value={stats.total}
            icon="chart-bar"
            color="blue"
            description="All cat facts in the system"
          />
          
          <StatsCard
            title="API Facts"
            value={stats.apiFacts}
            icon="activity"
            color="blue"
            description="Facts from external API"
          />
          
          <StatsCard
            title="Favorites"
            value={stats.favorites}
            icon="chart-pie"
            color="red"
            description="Facts you've favorited"
          />
          
          <StatsCard
            title="User Added"
            value={stats.userAdded}
            icon="trending-up"
            color="red"
            description="Facts you've added"
          />
        </div>

        {/* Add Fact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-10 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">
            Add New Cat Fact
          </h2>
          <AddFactForm fact={newFact} onFactChange={setNewFact} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <Button
            onClick={() => handleAddFactClick()}
            disabled={!newFact.trim() || isAddingFact}
            size="lg"
            variant="outline"
            className="border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium px-6 py-3 transition-all duration-200"
          >
            {isAddingFact ? 'Adding...' : '✨ Add Cat Fact'}
          </Button>
          
          <Button
            onClick={handleGetRandomFact}
            disabled={isGettingRandomFact}
            size="lg"
            variant="outline"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium px-6 py-3 transition-all duration-200"
          >
            {isGettingRandomFact ? 'Getting...' : '🎲 Get Random Fact'}
          </Button>
          
          <Button
            onClick={fetchFacts}
            size="lg"
            variant="outline"
            className="border-2 border-gray-500 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium px-6 py-3 transition-all duration-200"
          >
            🔄 Refresh
          </Button>
        </div>

        {/* Facts List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner text="Loading cat facts..." />
          </div>
        ) : catFacts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-6">😺</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
              No cat facts yet!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Add your first cat fact or get a random one to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6 pt-4">
              {currentFacts.map((fact, idx) => (
                <CatFactCard
                  key={fact.id}
                  fact={fact}
                  index={startIndex + idx + 1}
                  onDelete={handleDeleteFact}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-12">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  size="default"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 font-medium transition-all duration-200"
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      size="default"
                      variant={currentPage === page ? "default" : "outline"}
                      className={`w-12 h-12 font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                          : "border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  size="default"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 font-medium transition-all duration-200"
                >
                  Next
                </Button>
              </div>
            )}
            
            {/* Pagination Info */}
            <div className="text-center mt-8 text-base text-gray-500 dark:text-gray-400 font-light">
              Showing {startIndex + 1}-{Math.min(endIndex, catFacts.length)} of {catFacts.length} facts
            </div>
          </>
        )}
      </div>
    </div>
  );
}
