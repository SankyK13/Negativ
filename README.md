# NEGATIV — Film Negative to Positive Converter

A React Native (Expo) app that captures or imports film negatives and converts them into vivid, color-corrected positive images using advanced client-side image processing.

## Features

- **Camera Capture** — Live viewfinder with alignment guide for photographing negatives
- **Gallery Import** — Pick existing negative photos from your camera roll
- **Film Type Presets** — Optimized profiles for:
  - Color Negative (C-41) — Kodak Gold, Portra, Fuji Superia, etc.
  - B&W Negative — Tri-X, HP5, T-Max, etc.
  - Slide / Positive (E-6) — Velvia, Provia, Ektachrome (enhance-only)
  - Auto Detect — best-guess processing
- **9-Stage Processing Pipeline**:
  1. Orange mask compensation (removes C-41 orange tint)
  2. Color inversion (negative → positive)
  3. Auto white balance (gray-world algorithm)
  4. Histogram stretch (auto-levels with 1%/99% clipping)
  5. Gamma correction
  6. Contrast adjustment
  7. Saturation boost
  8. Brightness normalization
  9. Unsharp mask sharpening
- **Before/After Comparison** — Toggle between original negative and converted result
- **Save to Gallery** — One-tap save to your device photo library

## Prerequisites

- **Node.js** ≥ 18
- **Expo CLI**: `npm install -g expo-cli`
- A physical device (camera features require a real phone)

## Quick Start

```bash
# 1. Navigate to the project
cd negative-to-positive-app

# 2. Install dependencies
npm installiii

# 3. Start the dev server
npx expo start

# 4. Scan the QR code with Expo Go (iOS/Android)
```

## Project Structure

```
negative-to-positive-app/
├── App.js                          # Root navigator
├── app.json                        # Expo config & permissions
├── package.json                    # Dependencies
├── babel.config.js
├── assets/                         # App icons
└── src/
    ├── screens/
    │   ├── HomeScreen.js           # Film preset selector + entry point
    │   ├── CameraScreen.js         # Live camera with guide overlay
    │   ├── ProcessingScreen.js     # Progress UI + WebView processor
    │   └── ResultScreen.js         # Before/after + save/share
    └── utils/
        ├── imageProcessor.js       # Canvas-based processing engine
        └── theme.js                # Design tokens
```

## How the Processing Works

The app uses an HTML5 Canvas running inside a hidden WebView for pixel-level
manipulation at full resolution. This approach is cross-platform and avoids
native module linking.

The processing engine:
1. Reads the captured image as base64
2. Injects it into an HTML template with a `<canvas>` element
3. Applies the 9-stage pipeline pixel by pixel
4. Returns the processed image as a high-quality JPEG (95%)
5. Saves it via `expo-file-system`

## Tips for Best Results

- Use **even, diffused lighting** (a tablet/monitor showing white works great)
- Keep the negative **flat** against the light source
- **Avoid glare** — shoot at a slight angle if needed
- Choose the correct **film type preset** for optimal color correction
- For very dense or overexposed negatives, the Auto preset is a good starting point

## Extending the App

### Adding ChatGPT / AI Enhancement

To add AI-powered enhancement, you can integrate OpenAI's API in the
processing pipeline. Add your API key and modify `ProcessingScreen.js`:

```javascript
// After canvas processing, send to OpenAI Vision for enhancement description
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: processedBase64 } },
        { type: 'text', text: 'Analyze this converted film negative...' }
      ]
    }]
  })
});
```

### Custom Film Profiles

Add new presets in `src/utils/imageProcessor.js`:

```javascript
export const FILM_PRESETS = {
  // ...existing presets
  kodak_portra: {
    label: 'Kodak Portra 400',
    orangeMaskRemoval: true,
    maskR: 1.0, maskG: 1.4, maskB: 1.8,
    contrast: 1.2, saturation: 1.15,
    brightness: 1.05, gamma: 0.92,
    curves: true,
  },
};
```

## License

MIT
