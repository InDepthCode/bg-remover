# BackgroundAI Backend

Node.js backend service for AI-powered background removal.

## Features

- Express.js REST API
- TypeScript for type safety
- Multer for file uploads
- Sharp for image processing
- Remove.bg API integration
- Rate limiting and security
- Error handling and logging
- Health check endpoints

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Remove.bg API key

### Installation
```bash
npm install
```

### Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3001
REMOVE_BG_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:3000
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## API Endpoints

### Image Processing
- `POST /api/remove-background` - Remove background from image
- `GET /api/status` - Service status

### Health Check
- `GET /health` - Application health check

## Project Structure
```
src/
├── middleware/              # Express middleware
│   ├── errorHandler.ts
│   ├── requestLogger.ts
│   └── validateImageFile.ts
├── routes/                  # API routes
│   └── imageRoutes.ts
├── services/                # Business logic
│   └── backgroundRemovalService.ts
├── utils/                   # Utilities
│   └── asyncHandler.ts
└── server.ts               # Main server file
```
