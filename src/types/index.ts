
export interface Character {
  id: string;
  name: string;
  image: string;
  audioTrack: string;
}

export interface Base {
  id: string;
  name: string;
  background: string;
  baseTrack?: string;
  characters: Character[];
}

export interface GameState {
  isLoading: boolean;
  currentBase: Base | null;
  activeCharacters: Character[];
}
