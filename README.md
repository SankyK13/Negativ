# 🎞️ NEGATIV: Film Negative to Positive Converter

**NEGATIV** is a mobile application that converts film negatives into positive digital images using a phone camera or gallery image.

This project was completed in **May 2026** as the final project for **CPE 462-A** at Stevens Institute of Technology.

The goal was to create a simple mobile workflow where users could capture or import a film negative, select the film type, process the image, compare the original and converted result, and save the final image to their phone gallery.

---

## 📱 Project Preview

<p align="center">
  <img src="assets/negativ-home.png" alt="NEGATIV Home Screen" width="250">
  <img src="assets/negativ-processing.png" alt="NEGATIV Processing Screen" width="250">
  <img src="assets/negativ-result.png" alt="NEGATIV Result Screen" width="250">
</p>

---

## 🌟 Overview

Digitizing film negatives usually requires a scanner or desktop editing software. While a phone camera can capture a negative, the raw image usually appears inverted, tinted, low contrast, and difficult to use directly.

NEGATIV was built to make this process easier by combining:

* 📸 Camera capture
* 🖼️ Gallery import
* 🎞️ Film type preset selection
* 🧠 Client-side image processing
* 🔍 Before-and-after comparison
* 💾 Save-to-gallery functionality

The result is a mobile app that turns a photographed film negative into a usable positive digital image.

---

## ✨ Features

### 🎞️ Film Type Preset Selection

Users can select the type of film they want to process before capturing or importing an image.

Film preset options include:

* Auto Detect
* Color Negative
* Black-and-White Negative
* Slide / Positive Film

This helps the app apply more appropriate correction settings depending on the source image.

---

### 📸 Camera Capture

The app allows users to take a new photo of a film negative directly from their phone.

The camera screen includes:

* Camera permission handling
* Negative mode interface
* Center guide frame for alignment
* Flash toggle
* Camera flip button
* Capture button
* Tips for even lighting, keeping the negative flat, and avoiding glare

---

### 🖼️ Gallery Import

Users can also import an existing film negative image from their phone gallery.

This gives users flexibility if they already captured the negative or want to process saved images.

---

### ⚙️ Processing Screen

After an image is captured or imported, the app displays a processing screen instead of leaving the user waiting.

The processing screen includes:

* Animated film icon
* Progress bar
* Current processing step
* Selected film preset
* Conversion status updates

Visible processing steps include:

* Orange mask removal
* Color inversion
* White balance
* Contrast and curves
* Color enhancement
* Sharpening

---

### 🔍 Before-and-After Comparison

The result screen lets users compare the original negative and the converted positive image.

Users can switch between:

* Original negative
* Converted positive
* Side-by-side before-and-after view

This makes it easier to verify that the conversion worked.

---

### 💾 Save to Gallery

After processing, users can save the converted positive image directly to their phone gallery.

The app handles photo library permissions and saves the final image as a JPEG file.

---

## 🛠️ Tech Stack

* React Native
* Expo
* JavaScript
* Expo Camera
* Expo Image Picker
* Expo File System
* Expo Media Library
* React Native WebView
* HTML5 Canvas
* GitHub

---

## 🧠 Image Processing Method

NEGATIV uses a hidden **React Native WebView** with an **HTML5 Canvas** to perform pixel-level image manipulation inside the mobile app.

The general processing pipeline is:

1. Read the captured or imported image as base64 data
2. Load the image into an HTML Canvas
3. Apply orange mask compensation for color negatives
4. Invert negative colors into positive colors
5. Apply auto white balance
6. Stretch the histogram to improve tonal range
7. Apply gamma correction
8. Adjust contrast
9. Increase saturation
10. Normalize brightness
11. Apply sharpening
12. Return the processed image as a JPEG file

This approach allowed the app to process images locally on the device without requiring a server or custom native image-processing module.

---

## 🏗️ App Structure

```txt
negative-to-positive-app/
├── App.js
├── app.json
├── package.json
├── babel.config.js
├── assets/
└── src/
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── CameraScreen.js
    │   ├── ProcessingScreen.js
    │   └── ResultScreen.js
    └── utils/
        ├── imageProcessor.js
        └── theme.js
```

### Main Files

* `HomeScreen.js` handles film preset selection, camera launch, and gallery import
* `CameraScreen.js` handles camera permissions, preview, flash control, and photo capture
* `ProcessingScreen.js` reads the selected image, sends it to the WebView/Canvas processor, receives the converted result, and navigates to the result screen
* `ResultScreen.js` displays the converted image, provides comparison tools, and saves the final image to the gallery
* `imageProcessor.js` contains the Canvas-based image conversion logic
* `theme.js` keeps the app styling consistent

---

## 🚀 How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Expo development server

```bash
npx expo start
```

### 3. Open on a mobile device

Scan the QR code using the **Expo Go** app.

Camera and photo library permissions should be allowed when prompted so the app can capture, import, process, and save images.

---

## ✅ Testing and Results

The app was tested using both camera capture and gallery import.

| Test Case                   | Result |
| --------------------------- | ------ |
| Film preset selection       | Passed |
| Camera capture              | Passed |
| Gallery import              | Passed |
| Image processing            | Passed |
| Before-and-after comparison | Passed |
| Save to Gallery             | Passed |

The final workflow successfully allowed a user to select a film type, capture or import a negative image, process it, compare the original and converted versions, and save the result.

---

## 👨‍💻 My Role

For this project, I contributed to the overall app development, screen flow, and testing of the negative-to-positive conversion workflow.

My work included helping build the mobile app experience, connecting the main screens, testing the image conversion process, and making sure the user could move smoothly from image input to final saved output.

---

## ⚠️ Challenges

Some of the main challenges included:

* Handling image processing inside a React Native mobile app
* Working around React Native’s limited direct pixel-level image manipulation
* Passing image data as base64 between the app and WebView
* Saving processed image output correctly
* Tuning color correction so converted images did not look overly blue
* Making the workflow feel smooth from capture to final result

A major lesson from this project was that a simple color inversion is not enough for film negatives. The app needed additional correction steps such as orange mask compensation, white balance, contrast adjustment, saturation correction, and sharpening.

---

## 🔮 Future Improvements

Future improvements could include:

* More film-specific presets
* Manual adjustment sliders for brightness, contrast, saturation, tint, and sharpness
* Automatic cropping and border detection
* Batch processing for multiple negatives
* Better image enhancement for uneven lighting
* Optional cloud backup or sharing
* Improved support for different film stocks

---

## 📚 What I Learned

This project helped me understand how mobile development and image processing can work together in a real application.

I learned how to:

* Build a mobile app using React Native and Expo
* Use camera and gallery permissions
* Process image files on a mobile device
* Work with base64 image data
* Use WebView and HTML5 Canvas for pixel-level processing
* Design a complete user workflow
* Test mobile features on a physical device
* Improve image output through multiple correction steps

This project also taught me that image-processing applications are highly dependent on real-world input quality. Lighting, focus, glare, and how flat the negative is can heavily affect the final result.

---

## 👥 Team

* Sankalp Khira
* Amy Arias Ramirez
* Rakshita Singh
* Zihan Sun

Created for **CPE 462-A** at Stevens Institute of Technology.

---

## 👨‍💻 Author Note

NEGATIV was one of my first projects where mobile app development and image processing came together in one system.

It showed me how a phone can be used as a practical tool for film digitization without needing a scanner or desktop editing software.
