# BackgroundAI Frontend

Next.js frontend application for AI-powered background removal.

## Features

- Modern React with Next.js 14+ and App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design for all devices
- Image upload with drag-and-drop
- Real-time processing status
- Before/after image comparison
- Instant download of processed images

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Environment Variables
Create `.env.local`:
```env
BACKEND_URL=http://localhost:3001
```

### Building for Production
```bash
npm run build
npm start
```

## Project Structure
```
src/
├── app/
│   ├── api/                 # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
└── components/
    ├── ImageUploader.tsx   # Image upload component
    └── ImageProcessor.tsx  # Image processing component
```
