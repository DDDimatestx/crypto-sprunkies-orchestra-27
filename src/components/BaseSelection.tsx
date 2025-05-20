
import { useState } from 'react';
import { Base } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface BaseSelectionProps {
  bases: Base[];
  onSelectBase: (base: Base) => void;
}

const BaseSelection = ({ bases, onSelectBase }: BaseSelectionProps) => {
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);

  const handleSelectBase = (base: Base) => {
    setSelectedBase(base);
  };

  const handleConfirmSelection = () => {
    if (selectedBase) {
      onSelectBase(selectedBase);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 to-blue-900 p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Choose Your Base</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bases.map((base) => (
            <Card 
              key={base.id}
              className={`overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                selectedBase?.id === base.id 
                  ? 'ring-4 ring-purple-500 shadow-lg' 
                  : 'hover:ring-2 hover:ring-purple-400'
              }`}
              onClick={() => handleSelectBase(base)}
            >
              <div 
                className="h-40 bg-center bg-cover" 
                style={{ backgroundImage: `url(${base.background})` }}
              />
              <CardHeader>
                <CardTitle>{base.name}</CardTitle>
                <CardDescription>
                  {base.characters.length} characters available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {base.characters.slice(0, 4).map((character) => (
                    <div 
                      key={character.id}
                      className="w-10 h-10 rounded-full overflow-hidden bg-gray-200"
                    >
                      <img 
                        src={character.image} 
                        alt={character.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {base.characters.length > 4 && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      +{base.characters.length - 4}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSelectBase(base)}
                >
                  {selectedBase?.id === base.id ? 'Selected' : 'Select Base'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedBase}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-xl text-xl"
          >
            Start Playing with {selectedBase?.name || 'Selected Base'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BaseSelection;
