
import { Base } from '../types';

export const mockBases: Base[] = [
  {
    id: 'base-1',
    name: 'Crypto Beats',
    background: '/backgrounds/base-1-bg.jpg',
    characters: [
      {
        id: 'char-1',
        name: 'Bitcoin Drummer',
        image: '/characters/base-1/character-1.gif',
        audioTrack: '/audio/base-1/drums.mp3',
      },
      {
        id: 'char-2',
        name: 'Ethereum Synth',
        image: '/characters/base-1/character-2.gif',
        audioTrack: '/audio/base-1/synth.mp3',
      },
      {
        id: 'char-3',
        name: 'Dogecoin Bass',
        image: '/characters/base-1/character-3.gif',
        audioTrack: '/audio/base-1/bass.mp3',
      },
      {
        id: 'char-4',
        name: 'NFT Vocal',
        image: '/characters/base-1/character-4.gif',
        audioTrack: '/audio/base-1/vocal.mp3',
      },
      {
        id: 'char-5',
        name: 'Solana Beat',
        image: '/characters/base-1/character-1.gif', // Reusing image for now
        audioTrack: '/audio/base-1/drums.mp3', // Reusing audio for now
      },
      {
        id: 'char-6',
        name: 'Cardano Melody',
        image: '/characters/base-1/character-2.gif', // Reusing image for now
        audioTrack: '/audio/base-1/synth.mp3', // Reusing audio for now
      },
    ],
  },
  {
    id: 'base-2',
    name: 'Blockchain Lounge',
    background: '/backgrounds/base-2-bg.jpg',
    characters: [
      {
        id: 'char-7',
        name: 'Smart Contract Keys',
        image: '/characters/base-2/character-1.gif',
        audioTrack: '/audio/base-2/keys.mp3',
      },
      {
        id: 'char-8',
        name: 'Gas Fee Guitar',
        image: '/characters/base-2/character-2.gif',
        audioTrack: '/audio/base-2/guitar.mp3',
      },
      {
        id: 'char-9',
        name: 'Altcoin Sax',
        image: '/characters/base-2/character-3.gif',
        audioTrack: '/audio/base-2/sax.mp3',
      },
      {
        id: 'char-10',
        name: 'Whale Trumpet',
        image: '/characters/base-2/character-4.gif',
        audioTrack: '/audio/base-2/trumpet.mp3',
      },
      {
        id: 'char-11',
        name: 'NFT Drums',
        image: '/characters/base-2/character-1.gif', // Reusing image for now
        audioTrack: '/audio/base-2/keys.mp3', // Reusing audio for now
      },
      {
        id: 'char-12',
        name: 'Token Violin',
        image: '/characters/base-2/character-2.gif', // Reusing image for now
        audioTrack: '/audio/base-2/guitar.mp3', // Reusing audio for now
      },
    ],
  },
];
