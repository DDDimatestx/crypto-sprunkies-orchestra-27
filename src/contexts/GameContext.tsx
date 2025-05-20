
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Base, Character, GameState } from '../types';

type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_BASE'; payload: Base }
  | { type: 'ADD_CHARACTER'; payload: Character }
  | { type: 'REMOVE_CHARACTER'; payload: string }
  | { type: 'RESET_GAME' };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const initialState: GameState = {
  isLoading: true,
  currentBase: null,
  activeCharacters: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CURRENT_BASE':
      return { ...state, currentBase: action.payload, activeCharacters: [] };
    case 'ADD_CHARACTER':
      if (state.activeCharacters.some(char => char.id === action.payload.id)) {
        return state;
      }
      return { ...state, activeCharacters: [...state.activeCharacters, action.payload] };
    case 'REMOVE_CHARACTER':
      return {
        ...state,
        activeCharacters: state.activeCharacters.filter(char => char.id !== action.payload),
      };
    case 'RESET_GAME':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
