import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const modes = ['light', 'dark'];

async function generateIcons() {
  // Ensure the icons directories exist
  await fs.mkdir('public/icons/light', { recursive: true });
  await fs.mkdir('public/icons/dark', { recursive: true });

  for (const mode of modes) {
    const inputFile = `src/assets/${mode}-logo.png`;
    
    for (const size of sizes) {
      const outputFile = `public/icons/${mode}/icon-${size}x${size}.png`;
      
      try {
        await sharp(inputFile)
          .resize(size, size, {
            fit: 'contain',
            background: mode === 'light' ? { r: 255, g: 255, b: 255, alpha: 0 } : { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toFile(outputFile);
        
        console.log(`Generated ${outputFile}`);
      } catch (error) {
        console.error(`Error generating ${outputFile}:`, error);
      }
    }
  }
}

generateIcons().catch(console.error); 