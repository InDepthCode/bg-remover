'use client'

import { useState, useRef } from 'react'

interface ImageProcessorProps {
  uploadedImage: File
  processedImageUrl: string | null
  isProcessing: boolean
  onProcess: (file: File) => void
  onReset: () => void
}

export default function ImageProcessor({
  uploadedImage,
  processedImageUrl,
  isProcessing,
  onProcess,
  onReset,
}: ImageProcessorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Create preview URL for uploaded image
  useState(() => {
    if (uploadedImage) {
      const url = URL.createObjectURL(uploadedImage)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [uploadedImage])

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement('a')
      link.href = processedImageUrl
      link.download = `processed-${uploadedImage.name.replace(/\.[^/.]+$/, '')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Background Removal
          </h2>
          <button
            onClick={onReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Upload New Image
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Original</h3>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>File: {uploadedImage.name}</p>
              <p>Size: {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          {/* Processed Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Processed</h3>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
              {/* Checkerboard pattern for transparency */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%), 
                    linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #ccc 75%), 
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              />
              
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600">Processing image...</p>
                </div>
              ) : processedImageUrl ? (
                <img
                  src={processedImageUrl}
                  alt="Processed"
                  className="max-w-full max-h-full object-contain relative z-10"
                />
              ) : (
                <div className="text-gray-400">Click "Remove Background" to process</div>
              )}
            </div>
            
            {processedImageUrl && (
              <div className="text-sm text-gray-500">
                <p>Background removed successfully!</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          {!processedImageUrl && !isProcessing && (
            <button
              onClick={() => onProcess(uploadedImage)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Remove Background
            </button>
          )}
          
          {processedImageUrl && (
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Download Result
            </button>
          )}
          
          {processedImageUrl && (
            <button
              onClick={() => onProcess(uploadedImage)}
              disabled={isProcessing}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Process Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
