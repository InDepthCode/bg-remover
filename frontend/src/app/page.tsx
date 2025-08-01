'use client'

import { useState, useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImageProcessor from '@/components/ImageProcessor'

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = useCallback((file: File) => {
    setUploadedImage(file)
    setProcessedImageUrl(null)
  }, [])

  const handleImageProcess = useCallback(async (file: File) => {
    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setProcessedImageUrl(url)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setUploadedImage(null)
    setProcessedImageUrl(null)
    setIsProcessing(false)
    if (processedImageUrl) {
      URL.revokeObjectURL(processedImageUrl)
    }
  }, [processedImageUrl])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BackgroundAI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Remove backgrounds from your images instantly using advanced AI technology. 
            Upload your image and get professional results in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!uploadedImage ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <ImageProcessor
              uploadedImage={uploadedImage}
              processedImageUrl={processedImageUrl}
              isProcessing={isProcessing}
              onProcess={handleImageProcess}
              onReset={handleReset}
            />
          )}
        </div>

        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Get results in under 10 seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">High Accuracy</h3>
              <p className="text-gray-600">AI-powered precision background removal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your images are processed securely</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
