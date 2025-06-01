
import { useState, useEffect } from 'react';
import { Character, Base } from '../types';
import { Button } from '@/components/ui/button';
import { useAudioSynchronizer } from '../hooks/useAudioSynchronizer';
import { toast } from '@/components/ui/sonner';
import { Mic, Volume2, Play } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface GameBoardProps {
  base: Base;
  onBackToMenu: () => void;
}

const GameBoard = ({ base, onBackToMenu }: GameBoardProps) => {
  const [activeCharacters, setActiveCharacters] = useState<Character[]>([]);
  const [volume, setVolume] = useState([0.7]);
  const { 
    addTrack, 
    removeTrack,
    setVolume: setAudioVolume,
    tracks,
    isInitialized,
    initializeAudio
  } = useAudioSynchronizer();
  
  const placeholders = Array(4).fill(null).map((_, index) => ({
    id: `placeholder-${index}`,
    position: index
  }));

  useEffect(() => {
    setAudioVolume(volume[0]);
  }, [volume, setAudioVolume]);

  const handleAddCharacter = async (character: Character) => {
    console.log('Adding character:', character.name);
    
    if (activeCharacters.length >= 4) {
      toast.warning("Maximum characters reached! Remove some before adding more.");
      return;
    }
    
    // Check if character already active
    if (activeCharacters.some(c => c.id === character.id)) {
      toast.info(`${character.name} is already active`);
      return;
    }
    
    const emptyPositions = placeholders
      .filter(p => !activeCharacters.find(c => c.position === p.position))
      .map(p => p.position);
    
    if (emptyPositions.length === 0) return;
    
    const characterWithPosition = {
      ...character,
      position: emptyPositions[0]
    };
    
    // Add to active characters first
    setActiveCharacters(prev => [...prev, characterWithPosition]);
    
    // Then start audio
    await addTrack(character);
    
    toast.success(`Added ${character.name}`);
  };

  const handleRemoveCharacter = (characterId: string) => {
    const characterToRemove = activeCharacters.find(c => c.id === characterId);
    if (characterToRemove) {
      console.log(`Removing character: ${characterToRemove.name}`);
      
      // Remove from active characters
      setActiveCharacters(prev => prev.filter(c => c.id !== characterId));
      
      // Stop audio
      removeTrack(characterId);
      
      toast.info(`Removed ${characterToRemove.name}`);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('Active characters:', activeCharacters.length);
    console.log('Active tracks:', tracks.length);
    console.log('Audio initialized:', isInitialized);
  }, [activeCharacters, tracks, isInitialized]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-900 to-indigo-800">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBackToMenu}
            className="text-white border-white/50 hover:bg-white/10"
          >
            ← Back to Menu
          </Button>
          <h1 className="text-2xl font-bold text-white">{base.name}</h1>
          
          {!isInitialized && (
            <Button 
              onClick={initializeAudio}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Enable Audio
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-48">
          <Volume2 className="text-white" size={20} />
          <Slider
            className="w-full"
            value={volume}
            onValueChange={setVolume}
            max={1}
            step={0.01}
          />
        </div>
      </div>

      {/* Audio status warning */}
      {!isInitialized && (
        <div className="bg-yellow-500/80 text-black p-2 text-center">
          Click "Enable Audio" button to allow sound playback
        </div>
      )}

      {/* Main game area */}
      <div 
        className="flex-1 p-6 bg-center bg-cover flex flex-col justify-end"
        style={{ backgroundImage: `url(${base.background})` }}
      >
        <div className="flex justify-center gap-4 mb-4">
          {placeholders.map((placeholder) => {
            const character = activeCharacters.find(c => c.position === placeholder.position);
            return (
              <div 
                key={placeholder.id}
                className={`h-80 w-60 rounded-lg overflow-hidden flex items-center justify-center ${
                  character ? 'cursor-pointer transform hover:scale-105 transition-transform' : 'bg-black/20 border border-white/20'
                }`}
                onClick={() => character && handleRemoveCharacter(character.id)}
              >
                {character ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-full h-full object-contain float-animation"
                    />
                    <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs p-1 rounded text-center">
                      Click to remove
                    </div>
                  </div>
                ) : (
                  <div className="text-white/50 flex flex-col items-center justify-center">
                    <Mic className="h-32 w-32 mb-2" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Character selection */}
      <div className="bg-black/50 backdrop-blur-md p-4">
        <h2 className="text-xl font-bold text-white mb-3 text-center">Available Characters</h2>
        <div className="flex justify-center flex-wrap gap-3 max-w-5xl mx-auto">
          {base.characters.map((character) => (
            <div 
              key={character.id}
              className="w-24 h-32 bg-white/10 rounded-lg overflow-hidden cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => handleAddCharacter(character)}
            >
              <div className="h-24 flex items-center justify-center">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="h-full object-contain"
                />
              </div>
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
