# NEGATIV

NEGATIV is an Expo React Native app that turns photographed or imported film negatives into polished positive images on-device.

## Highlights

- Capture a film negative with an alignment guide
- Import negatives from the gallery
- Choose from color negative, black and white, slide, or auto-detect modes
- Run a multi-step conversion pipeline with progress feedback
- Compare the negative against the converted positive result
- Save the final image back to the device gallery

## Screenshots

| Home | Camera |
| --- | --- |
| ![Home screen](assets/screenshots/home-screen.png) | ![Camera screen](assets/screenshots/camera-screen.png) |

| Processing | Result |
| --- | --- |
| ![Processing screen](assets/screenshots/processing-screen.png) | ![Result screen](assets/screenshots/result-screen.png) |

## Tech Stack

- Expo SDK 51
- React Native 0.74
- React Navigation
- Expo Camera, Image Picker, Media Library, and File System
- WebView-based image processing pipeline

## Getting Started

```bash
npm install
npx expo start
```

Then open the app in Expo Go on iOS or Android.

## Project Structure

```text
.
├── App.js
├── app.json
├── assets/
│   └── screenshots/
├── src/
│   ├── screens/
│   └── utils/
└── package.json
```

## Notes

- Camera capture works best on a physical device.
- Even backlighting and a flat negative produce the best conversions.
