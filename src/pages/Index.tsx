
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import BaseSelection from '../components/BaseSelection';
import GameBoard from '../components/GameBoard';
import { Base } from '../types';
import { mockBases } from '../data/mockBases';
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [gameState, setGameState] = useState<'loading' | 'selection' | 'playing'>('loading');
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [bases, setBases] = useState<Base[]>([]);
  
  // In a real app, we would fetch the bases from an API
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setBases(mockBases);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLoadingComplete = () => {
    setGameState('selection');
  };
  
  const handleSelectBase = (base: Base) => {
    setSelectedBase(base);
    setGameState('playing');
  };
  
  const handleBackToMenu = () => {
    setSelectedBase(null);
    setGameState('selection');
  };
  
  return (
    <div>
      <Toaster position="top-right" />
      
      {gameState === 'loading' && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      
      {gameState === 'selection' && (
        <BaseSelection bases={bases} onSelectBase={handleSelectBase} />
      )}
      
      {gameState === 'playing' && selectedBase && (
        <GameBoard base={selectedBase} onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
};

export default Index;
