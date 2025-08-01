import { Router } from 'express';
import multer from 'multer';
import { removeBackground } from '../services/backgroundRemovalService';
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
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
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
      const processedImageBuffer = await removeBackground(req.file.buffer);
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="processed-image.png"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.send(processedImageBuffer);
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
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    services: {
      backgroundRemoval: 'available'
    }
  });
}));

export { router as imageRoutes };
