import { removeBackground, Config } from '@imgly/background-removal';
import sharp from 'sharp';

interface LocalRemovalResult {
  success: boolean;
  processedImage?: Buffer;
  error?: string;
  method: 'local';
}

export class LocalBackgroundRemovalService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('Initializing local background removal...');
      
      // Configure the library
      const config: Config = {
        debug: false,
        model: 'isnet', // More accurate model
        publicPath: '/models/', // Adjust if needed
        progress: (key, current, total) => {
          console.log(`Loading ${key}: ${Math.round((current / total) * 100)}%`);
        }
      };

      // The library will automatically download the model on first use
      this.initialized = true;
      console.log('Local background removal initialized successfully');
    } catch (error) {
      console.error('Failed to initialize local background removal:', error);
      throw error;
    }
  }

  async removeBackground(imageBuffer: Buffer): Promise<LocalRemovalResult> {
    try {
      await this.initialize();
      
      console.log('Starting local background removal...');
      
      // Convert buffer to blob for the library
      const blob = new Blob([imageBuffer]);
      
      // Remove background using local AI
      const result = await removeBackground(blob);
      
      // Convert result blob back to buffer
      const arrayBuffer = await result.arrayBuffer();
      const processedBuffer = Buffer.from(arrayBuffer);
      
      console.log('Local background removal completed successfully');
      
      return {
        success: true,
        processedImage: processedBuffer,
        method: 'local'
      };
      
    } catch (error) {
      console.error('Local background removal failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'local'
      };
    }
  }

  async processImage(imageBuffer: Buffer): Promise<Buffer> {
    const result = await this.removeBackground(imageBuffer);
    
    if (!result.success || !result.processedImage) {
      throw new Error(result.error || 'Local processing failed');
    }
    
    return result.processedImage;
  }
}

export const localBackgroundRemoval = new LocalBackgroundRemovalService();
