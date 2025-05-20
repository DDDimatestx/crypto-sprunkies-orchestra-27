
import { useState, useEffect } from 'react';
import { Character, Base } from '../types';
import { Button } from '@/components/ui/button';
import { useAudioSynchronizer } from '../hooks/useAudioSynchronizer';
import { toast } from '@/components/ui/sonner';

interface GameBoardProps {
  base: Base;
  onBackToMenu: () => void;
}

const GameBoard = ({ base, onBackToMenu }: GameBoardProps) => {
  const [activeCharacters, setActiveCharacters] = useState<Character[]>([]);
  const [started, setStarted] = useState(false);
  const { 
    addTrack, 
    removeTrack, 
    startAll, 
    stopAll, 
    isPlaying 
  } = useAudioSynchronizer();
  
  // Set up the placeholders for the main game area
  const placeholders = Array(8).fill(null).map((_, index) => ({
    id: `placeholder-${index}`,
    position: index
  }));

  const handleAddCharacter = (character: Character) => {
    if (activeCharacters.length >= 8) {
      toast("Maximum characters reached! Remove some before adding more.");
      return;
    }
    
    // Find first empty position
    const emptyPositions = placeholders
      .filter(p => !activeCharacters.find(c => c.position === p.position))
      .map(p => p.position);
    
    if (emptyPositions.length === 0) return;
    
    const characterWithPosition = {
      ...character,
      position: emptyPositions[0]
    };
    
    setActiveCharacters(prev => [...prev, characterWithPosition]);
    addTrack(character);
    
    if (started && !isPlaying) {
      startAll();
    }
  };

  const handleRemoveCharacter = (characterId: string) => {
    setActiveCharacters(prev => prev.filter(c => c.id !== characterId));
    removeTrack(characterId);
    
    if (activeCharacters.length === 1) {
      stopAll();
      setStarted(false);
    }
  };

  const handleStartMusic = () => {
    if (activeCharacters.length === 0) {
      toast("Add some characters first!");
      return;
    }
    
    setStarted(true);
    startAll();
  };

  const handleStopMusic = () => {
    stopAll();
    setStarted(false);
  };

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-900 to-indigo-800">
      {/* Header with back button and controls */}
      <div className="bg-black/30 backdrop-blur-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBackToMenu}
            className="text-white border-white/50 hover:bg-white/10"
          >
            ← Back to Bases
          </Button>
          <h1 className="text-2xl font-bold text-white">{base.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!started ? (
            <Button 
              onClick={handleStartMusic}
              disabled={activeCharacters.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Play
            </Button>
          ) : (
            <Button 
              onClick={handleStopMusic}
              className="bg-red-600 hover:bg-red-700"
            >
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Main game area */}
      <div 
        className="flex-1 p-6 bg-center bg-cover"
        style={{ backgroundImage: `url(${base.background})` }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {placeholders.map((placeholder) => {
            const character = activeCharacters.find(c => c.position === placeholder.position);
            return (
              <div 
                key={placeholder.id}
                className={`aspect-square rounded-lg overflow-hidden flex items-center justify-center ${
                  character ? 'cursor-pointer' : 'border-2 border-dashed border-white/30'
                }`}
                onClick={() => character && handleRemoveCharacter(character.id)}
              >
                {character ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className={`w-full h-full object-contain ${started ? 'float-animation' : ''}`}
                    />
                    <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs p-1 rounded text-center">
                      Click to remove
                    </div>
                  </div>
                ) : (
                  <div className="text-white/40 text-center">Empty</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Character selection area */}
      <div className="bg-black/50 backdrop-blur-md p-4">
        <h2 className="text-xl font-bold text-white mb-3">Available Characters</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {base.characters.map((character) => (
            <div 
              key={character.id}
              className="aspect-square bg-white/10 rounded-lg overflow-hidden cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => handleAddCharacter(character)}
            >
              <img 
                src={character.image} 
                alt={character.name}
                className="w-full h-full object-contain p-2"
              />
              <div className="bg-black/70 p-1 text-white text-xs text-center truncate">
                {character.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
