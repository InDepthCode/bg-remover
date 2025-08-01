import { Router } from 'express';
import multer from 'multer';
import { removeBackgroundHybrid } from '../services/hybridBackgroundRemoval';
import { validateImageFile } from '../middleware/validateImageFile';
import { handleAsyncError } from '../utils/asyncHandler';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  },
  fileFilter: (req, file, cb) => {
    console.log('File received:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // More flexible file type checking
    const isImage = file.mimetype.startsWith('image/') || 
                   file.originalname.match(/\.(jpg|jpeg|png|webp)$/i);
    
    if (isImage) {
      console.log('File type accepted:', file.mimetype);
      cb(null, true);
    } else {
      console.log('File type rejected:', file.mimetype);
      cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'));
    }
  },
});

// Remove background endpoint
router.post('/remove-background', 
  upload.single('image'),
  validateImageFile,
  handleAsyncError(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided',
        code: 'NO_FILE'
      });
    }

    try {
      console.log('Starting background removal for file:', req.file.originalname);
      console.log('File size:', req.file.size, 'bytes');
      console.log('File mimetype:', req.file.mimetype);
      
      // Use hybrid background removal (local + API fallback)
      const result = await removeBackgroundHybrid(req.file.buffer, true);
      
      if (!result.success) {
        console.error('Background removal failed:', result.error);
        return res.status(500).json({
          error: result.error,
          code: 'PROCESSING_ERROR',
          method: result.method
        });
      }
      
      console.log(`Background removal successful using ${result.method} method`);
      if (result.apiUsage) {
        console.log(`API usage: ${result.apiUsage.total - result.apiUsage.remaining}/${result.apiUsage.total} (${result.apiUsage.remaining} remaining)`);
      }
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="processed-image.png"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Processing-Method': result.method,
        'X-API-Remaining': result.apiUsage ? result.apiUsage.remaining.toString() : 'unlimited'
      });

      res.send(result.processedImage);
    } catch (error) {
      console.error('Background removal error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return res.status(401).json({
            error: 'Invalid API configuration',
            code: 'API_ERROR'
          });
        }
        
        if (error.message.includes('rate limit')) {
          return res.status(429).json({
            error: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT'
          });
        }
      }

      res.status(500).json({
        error: 'Failed to process image',
        code: 'PROCESSING_ERROR'
      });
    }
  })
);

// Image processing status endpoint
router.get('/status', handleAsyncError(async (req, res) => {
  const { backgroundRemovalManager } = require('../services/backgroundRemovalManager');
  const usage = backgroundRemovalManager.getUsageStats();
  
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    services: {
      backgroundRemoval: 'available',
      localProcessing: 'available',
      apiProcessing: usage.removeBgUsed < usage.removeBgLimit ? 'available' : 'quota_exceeded'
    },
    usage: {
      api: {
        used: usage.removeBgUsed,
        limit: usage.removeBgLimit,
        remaining: usage.removeBgLimit - usage.removeBgUsed
      },
      local: {
        processed: usage.localProcessed
      },
      total: {
        processed: usage.totalProcessed
      }
    }
  });
}));

export { router as imageRoutes };
