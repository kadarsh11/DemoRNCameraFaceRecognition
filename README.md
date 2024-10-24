# RN Demo Camera App with Facial Recognition

1. Install dependencies

   ```bash
   npm install
   npx expo prebuild
   ```

2. Start the app

   ```bash
    eas build --profile development --platform android
   ```

## Features

This project utilizes **react-native-vision-camera** and **react-native-mlkit** to capture photos and extract detailed data related to both the image and human faces. All processing is performed locally on the device, ensuring no internet connection is required. Future enhancements could include integrating a custom face recognition model for improved accuracy and functionality.

## Screenshots

<img src="/screenshot/1.jpg" width="400" />
<img src="/screenshot/2.jpg" width="400" />
<img src="/screenshot/3.jpg" width="400" />
