
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setShowEnterButton(true);
    }
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 to-blue-900 p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in mb-8">
          CryptoSprunks
        </h1>
        
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome to the Musical World of CryptoSprunks!</h2>
          
          <p className="text-white/90 mb-6">
            CryptoSprunks is a musical playground where you can create your own unique compositions by selecting animated characters. 
            Each character plays a different musical instrument, and when combined, they create harmonious melodies!
          </p>
          
          <p className="text-white/90 mb-6">
            Choose from different bases, each with its own theme, background, and set of characters. 
            Mix and match characters to create your perfect symphony!
          </p>
          
          <div className="w-full bg-white/20 rounded-full h-4 mb-6">
            <div 
              className="bg-gradient-to-r from-purple-400 to-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-white/80 mb-4">
            {progress < 100 ? "Loading assets..." : "Ready to play!"}
          </p>
          
          {showEnterButton && (
            <Button 
              onClick={onComplete}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-2 rounded-full text-lg font-medium transition-all duration-300 animate-bounce"
            >
              Enter CryptoSprunks
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
