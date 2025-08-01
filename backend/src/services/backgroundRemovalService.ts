import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';

export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  
  if (!apiKey) {
    throw new Error('Remove.bg API key not configured. Please set REMOVE_BG_API_KEY environment variable.');
  }

  try {
    console.log('Processing image with Remove.bg API...');
    
    // Convert any image format to PNG for compatibility with Remove.bg
    const convertedBuffer = await sharp(imageBuffer)
      .png()
      .toBuffer();
    
    console.log('Image converted to PNG format');

    // Create form data for the API request
    const formData = new FormData();
    formData.append('image_file', convertedBuffer, {
      filename: 'image.png',
      contentType: 'image/png'
    });
    formData.append('size', 'auto');
    formData.append('format', 'png');

    console.log('Sending request to Remove.bg API...');

    // Make request to remove.bg API
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': apiKey,
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer',
      timeout: 30000 // 30 seconds timeout
    });

    if (response.status !== 200) {
      console.error('Remove.bg API error:', response.status, response.statusText);
      throw new Error(`Remove.bg API returned status ${response.status}`);
    }

    console.log('Remove.bg API response received successfully');

    // Process the result with Sharp for optimization
    const processedBuffer = await sharp(Buffer.from(response.data))
      .png({ quality: 90, compressionLevel: 6 })
      .toBuffer();

    console.log('Image processing completed successfully');
    return processedBuffer;
    
  } catch (error) {
    console.error('Background removal service error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        throw new Error('Remove.bg API quota exceeded. Please check your subscription.');
      }
      
      if (error.response?.status === 403) {
        throw new Error('Remove.bg API key is invalid or expired.');
      }
      
      if (error.response?.status === 429) {
        throw new Error('Remove.bg API rate limit exceeded. Please try again later.');
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Background removal request timed out. Please try again.');
      }
    }
    
    throw new Error('Failed to remove background from image.');
  }
}

// Alternative local processing function (placeholder for future implementation)
export async function removeBackgroundLocal(imageBuffer: Buffer): Promise<Buffer> {
  // This is a placeholder for local AI model implementation
  // For now, it just returns the original image
  console.warn('Local background removal not implemented. Falling back to original image.');
  
  return sharp(imageBuffer)
    .png()
    .toBuffer();
}

// Health check for the background removal service
export async function checkBackgroundRemovalService(): Promise<boolean> {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  
  if (!apiKey) {
    return false;
  }

  try {
    // Make a simple request to check if the API is accessible
    const response = await axios.get('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey
      },
      timeout: 5000
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Background removal service health check failed:', error);
    return false;
  }
}
