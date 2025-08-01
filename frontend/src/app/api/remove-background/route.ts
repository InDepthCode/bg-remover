import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Forward the request to the backend API
    const backendFormData = new FormData()
    backendFormData.append('image', image)

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3003'
    const response = await fetch(`${backendUrl}/api/remove-background`, {
      method: 'POST',
      body: backendFormData,
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const processedImageBuffer = await response.arrayBuffer()

    return new NextResponse(processedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="processed-image.png"',
      },
    })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}
