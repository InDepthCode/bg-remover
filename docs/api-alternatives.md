# Alternative Background Removal APIs

## Free/Cheaper Alternatives to Remove.bg

### 1. Clipdrop API (Stability AI)
- **Free Tier**: 100 API calls/month
- **Pricing**: $9/month for 1,000 calls
- **Quality**: High quality, good for people and objects
- **Website**: https://clipdrop.co/apis

### 2. Photoshop API (Adobe)
- **Free Tier**: 100 API calls/month  
- **Pricing**: Pay-as-you-go
- **Quality**: Excellent quality
- **Website**: https://developer.adobe.com/photoshop/

### 3. Picup.ai
- **Free Tier**: 50 API calls/month
- **Pricing**: $5/month for 500 calls
- **Quality**: Good for bulk processing
- **Website**: https://picup.ai/

### 4. Cutout.pro
- **Free Tier**: 10 API calls/month
- **Pricing**: $9.90/month for 1,000 calls
- **Quality**: Good quality
- **Website**: https://www.cutout.pro/

## Local AI Solutions (Unlimited Usage)

### 1. rembg (Python)
```bash
pip install rembg
rembg i input.jpg output.png
```
- **Pros**: Free, unlimited, good quality
- **Cons**: Requires Python setup

### 2. @imgly/background-removal (JavaScript)
```bash
npm install @imgly/background-removal
```
- **Pros**: Runs in browser/Node.js, unlimited
- **Cons**: Larger bundle size

### 3. BRIA RMBG-1.4 (Hugging Face)
- **API**: Free through Hugging Face
- **Self-hosted**: Can run locally
- **Quality**: State-of-the-art results

### 4. U²-Net Models
- **TensorFlow.js**: Can run in browser
- **Python**: Multiple implementations available
- **Quality**: Good for most use cases

## Recommended Strategy

1. **Primary**: Local AI (unlimited usage)
2. **Fallback 1**: Remove.bg (50/month for premium quality)
3. **Fallback 2**: Clipdrop (100/month additional)
4. **Fallback 3**: Adobe Photoshop API (100/month additional)

Total: **250+ API calls/month + unlimited local processing**
