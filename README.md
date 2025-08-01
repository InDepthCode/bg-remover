# BackgroundAI - AI-Powered Background Removal

A modern web application that uses artificial intelligence to automatically remove backgrounds from images. Built with Next.js frontend and Node.js backend.

## Features

- 🚀 **Fast Processing**: Remove backgrounds in under 10 seconds
- 🎯 **High Accuracy**: AI-powered precision background removal
- 🔒 **Secure & Private**: Your images are processed securely
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🖼️ **Multiple Formats**: Supports JPEG, PNG, and WEBP images
- ⬇️ **Easy Download**: Get your processed images instantly

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern React patterns

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **Multer** - File upload handling
- **Sharp** - Image processing
- **Remove.bg API** - AI background removal service

## Project Structure

```
tweet-generator/
├── docs/
│   └── prd.md                    # Product Requirements Document
├── frontend/                     # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/             # API routes
│   │   │   ├── globals.css      # Global styles
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Home page
│   │   └── components/
│   │       ├── ImageUploader.tsx
│   │       └── ImageProcessor.tsx
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── backend/                      # Node.js backend service
    ├── src/
    │   ├── middleware/          # Express middleware
    │   ├── routes/              # API routes
    │   ├── services/            # Business logic
    │   ├── utils/               # Utility functions
    │   └── server.ts            # Main server file
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Remove.bg API key (get one at [remove.bg](https://www.remove.bg/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tweet-generator
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env file and add your Remove.bg API key
   # REMOVE_BG_API_KEY=your_api_key_here
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:3001`

2. **Start the frontend application**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to use the application

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
BACKEND_URL=http://localhost:3001
```

## API Endpoints

### Backend API

- `POST /api/remove-background` - Remove background from uploaded image
- `GET /api/status` - Get service status
- `GET /health` - Health check endpoint

### Frontend API Routes

- `POST /api/remove-background` - Proxy to backend for background removal

## Usage

1. **Upload Image**: Drag and drop an image or click to browse files
2. **Process**: Click "Remove Background" to start AI processing
3. **Download**: Download your processed image with transparent background

## Development

### Backend Development
```bash
cd backend
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Frontend Development
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Backend Deployment
1. Set up your production server (AWS, DigitalOcean, etc.)
2. Install Node.js and dependencies
3. Set environment variables
4. Build and start the application:
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment
1. Deploy to Vercel, Netlify, or similar platform
2. Set environment variables
3. Build and deploy:
   ```bash
   npm run build
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [your-email@example.com] or create an issue in the repository.

## Acknowledgments

- [Remove.bg](https://www.remove.bg/) for providing the AI background removal service
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
