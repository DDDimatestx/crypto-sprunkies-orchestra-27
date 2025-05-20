
# CryptoSprunks

CryptoSprunks is a musical mixing game where users can select animated characters that each play a unique musical stem, creating synchronized musical compositions.

## How to Populate Content

### File Structure

The application expects content in the following folders:

```
public/
  ├── backgrounds/
  │   ├── base-1-bg.jpg
  │   ├── base-2-bg.jpg
  │   └── ...
  ├── characters/
  │   ├── base-1/
  │   │   ├── character-1.gif
  │   │   ├── character-2.gif
  │   │   └── ...
  │   ├── base-2/
  │   │   └── ...
  └── audio/
      ├── base-1/
      │   ├── drum.mp3
      │   ├── synth.mp3
      │   └── ...
      ├── base-2/
      │   └── ...
```

### Character Requirements

1. **File Format**: GIF or APNG (Animated PNG) is recommended for animated characters
   - GIF is widely supported but has limited color depth
   - APNG provides better quality but slightly less compatibility
   - WebP animations are another modern option with good compression

2. **Size**: 
   - **Main Game Area**: Characters should be designed with a vertical orientation (portrait)
   - **Recommended Dimensions**: 300px width × 500px height
   - **File Size**: Keep under 500KB for performance
   - **Important**: Characters will be displayed in a 36px × 52px container in the game area

3. **Selection Menu**:
   - Characters will display in a 24px × 32px container in the selection menu
   - Only the top portion will be visible to maintain aspect ratio
   - Design your characters with recognizable top portions

4. **Background**: Transparent background is strongly recommended

5. **Animation**: 
   - Keep animations smooth but simple to reduce file size
   - 8-12 frames is usually sufficient for basic animations
   - Loop your animations seamlessly

### Audio Requirements

1. **File Format**: MP3 or OGG format
   - MP3 for better compatibility
   - OGG for better quality-to-size ratio

2. **Duration**: All audio stems within a base must have the exact same duration

3. **Loop Points**: Audio should be designed to loop seamlessly

4. **Synchronization**: All stems should be precisely beat-matched and phase-aligned

### Background Requirements

1. **File Format**: JPG or PNG
   - JPG for photographic backgrounds (smaller file size)
   - PNG for illustrations or when transparency is needed

2. **Dimensions**: 1920px × 1080px is recommended
   - The app is responsive, but this resolution ensures quality on most screens

3. **File Size**: Keep under 1MB for faster loading

### How to Add New Bases

1. Add the required files to the appropriate directories:
   - Add background image to `/public/backgrounds/`
   - Create a folder for characters in `/public/characters/your-base-id/`
   - Create a folder for audio in `/public/audio/your-base-id/`

2. Update the `mockBases.ts` file in `src/data` with your new base information:

```typescript
{
  id: 'your-base-id',
  name: 'Your Base Name',
  background: '/backgrounds/your-base-bg.jpg',
  characters: [
    {
      id: 'your-char-1',
      name: 'Character Name',
      image: '/characters/your-base-id/character-1.gif',
      audioTrack: '/audio/your-base-id/instrument.mp3',
    },
    // Add more characters (up to 4 per base)
  ]
}
```

## Important Tips

1. **Character Design**:
   - Since characters are displayed in vertical rectangles, design them with a vertical orientation
   - Focus detail on the upper portion of the character as this will be most visible in the menu
   - Test your animations in both the menu and main game area

2. **Audio Synchronization**: 
   - For best results, create your audio stems from the same source track to ensure perfect synchronization
   - All stems must have exactly the same duration
   - Use audio editing software to ensure all stems start at the same beat

3. **File Optimization**:
   - Compress GIF files using tools like ezgif.com
   - Optimize audio files to balance quality and file size
   - Compress images using tools like TinyPNG

4. **Testing**: 
   - Always test new content in the application before final deployment
   - Check how it looks on different screen sizes
   - Ensure audio synchronizes properly

5. **Adding New Bases**:
   - Follow the exact file structure
   - Ensure all characters have corresponding audio tracks
   - Update the mockBases.ts file with accurate paths
