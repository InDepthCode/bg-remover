import { removeBackground as removeBgAPI } from './backgroundRemovalService';
import { localBackgroundRemoval } from './localBackgroundRemoval';
import { backgroundRemovalManager } from './backgroundRemovalManager';

interface RemovalResult {
  success: boolean;
  processedImage?: Buffer;
  error?: string;
  method: 'local' | 'api';
  apiUsage?: {
    remaining: number;
    total: number;
  };
}

export async function removeBackgroundHybrid(imageBuffer: Buffer, useLocal: boolean = true): Promise<RemovalResult> {
  console.log('Starting hybrid background removal...');
  
  // Check API usage
  const usage = backgroundRemovalManager.getUsageStats();
  const canUseAPI = usage.removeBgUsed < usage.removeBgLimit;
  console.log(`Current API usage: ${usage.removeBgUsed}/${usage.removeBgLimit} this month`);
  
  if (useLocal) {
    try {
      console.log('Attempting local background removal...');
      const processedImage = await localBackgroundRemoval.processImage(imageBuffer);
      console.log('Local background removal successful!');
      
      return {
        success: true,
        processedImage,
        method: 'local'
      };
    } catch (error) {
      console.log('Local background removal failed, falling back to API:', error);
      
      // Check if we can use API
      if (!canUseAPI) {
        return {
          success: false,
          error: `Local processing failed and API limit exceeded (${usage.removeBgUsed}/${usage.removeBgLimit})`,
          method: 'local'
        };
      }
      
      // Fall back to Remove.bg API
      try {
        const processedImage = await removeBgAPI(imageBuffer);
        
        return {
          success: true,
          processedImage,
          method: 'api',
          apiUsage: {
            remaining: usage.removeBgLimit - usage.removeBgUsed - 1,
            total: usage.removeBgLimit
          }
        };
      } catch (apiError) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
        return {
          success: false,
          error: `Both local and API processing failed: ${errorMessage}`,
          method: 'api'
        };
      }
    }
  } else {
    console.log('Using Remove.bg API directly...');
    
    if (!canUseAPI) {
      return {
        success: false,
        error: `API limit exceeded (${usage.removeBgUsed}/${usage.removeBgLimit})`,
        method: 'api'
      };
    }
    
    try {
      const processedImage = await removeBgAPI(imageBuffer);
      
      return {
        success: true,
        processedImage,
        method: 'api',
        apiUsage: {
          remaining: usage.removeBgLimit - usage.removeBgUsed - 1,
          total: usage.removeBgLimit
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        method: 'api'
      };
    }
  }
}

// For backward compatibility
export async function removeBackgroundLocal(imageBuffer: Buffer): Promise<Buffer> {
  return await localBackgroundRemoval.processImage(imageBuffer);
}
