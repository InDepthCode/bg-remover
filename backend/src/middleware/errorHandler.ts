import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', err);

  // Multer errors
  if (err.message.includes('File too large')) {
    res.status(413).json({
      error: 'File too large. Maximum size is 10MB.',
      code: 'FILE_TOO_LARGE'
    });
    return;
  }

  if (err.message.includes('Invalid file type')) {
    res.status(400).json({
      error: 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.',
      code: 'INVALID_FILE_TYPE'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};
