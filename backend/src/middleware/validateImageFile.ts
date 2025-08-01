import { Request, Response, NextFunction } from 'express';

export const validateImageFile = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({
      error: 'No image file provided',
      code: 'NO_FILE'
    });
    return;
  }

  // Additional file validation
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    res.status(400).json({
      error: 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.',
      code: 'INVALID_FILE_TYPE'
    });
    return;
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (req.file.size > maxSize) {
    res.status(413).json({
      error: 'File too large. Maximum size is 10MB.',
      code: 'FILE_TOO_LARGE'
    });
    return;
  }

  next();
};
