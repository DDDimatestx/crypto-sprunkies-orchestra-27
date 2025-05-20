
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

2. **Size**: Recommended size is 200x200 pixels or higher, but keep file size under 500KB for performance

3. **Background**: Transparent background is recommended

### Audio Requirements

1. **File Format**: MP3 or OGG format
   - MP3 for better compatibility
   - OGG for better quality-to-size ratio

2. **Duration**: All audio stems within a base must have the exact same duration

3. **Loop Points**: Audio should be designed to loop seamlessly

4. **Synchronization**: All stems should be precisely beat-matched and phase-aligned

### How to Add New Bases

1. Add the required files to the appropriate directories
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
    // Add more characters
  ]
}
```

## Important Tips

1. **Audio Synchronization**: For best results, create your audio stems from the same source track to ensure perfect synchronization

2. **File Optimization**:
   - Compress GIF files using tools like ezgif.com
   - Optimize audio files to balance quality and file size

3. **Testing**: Always test new content in the application before final deployment
