# ⚡ Quick Start Guide

Get the Baby Care Tracker app running in 5 minutes!

---

## 🎯 For Running Locally (Testing)

### Method 1: On Your Phone (Easiest)

1. **Install Expo Go on your phone**
   - iPhone: Download "Expo Go" from App Store
   - Android: Download "Expo Go" from Google Play

2. **On your computer, run these commands:**
   ```bash
   # Navigate to project
   cd /home/user/vitruvius

   # Install dependencies (first time only)
   npm install

   # Start the app
   npm start
   ```

3. **Scan the QR code**
   - iPhone: Use Camera app to scan QR code
   - Android: Use Expo Go app to scan QR code

4. **Done!** App will load on your phone

### Method 2: On Simulator/Emulator

#### iOS Simulator (Mac only)
```bash
npm install
npm run ios
```

#### Android Emulator
```bash
npm install
npm run android
```

---

## 🏪 For Publishing to App Stores

### Quick Overview

1. **Get developer accounts**
   - Apple: $99/year at developer.apple.com
   - Google: $25 one-time at play.google.com/console

2. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

3. **Build the app**
   ```bash
   eas build --platform ios    # For iPhone
   eas build --platform android # For Android
   ```

4. **Submit to stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

5. **Wait for approval** (1-3 days)

📖 **For detailed instructions, see [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md)**

---

## ❓ Common Issues

**"npm: command not found"**
- Install Node.js from https://nodejs.org/

**"expo: command not found"**
- Run: `npm install -g expo-cli`

**QR code won't scan**
- Make sure phone and computer are on same WiFi network
- Try typing the URL manually in Expo Go

**App won't load**
- Try: `expo start -c` (clears cache)
- Delete `node_modules` and run `npm install` again

---

## 📞 Need Help?

- Full setup guide: [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md)
- Main README: [README.md](./README.md)
- Expo docs: https://docs.expo.dev/

---

**You're ready to go! 🚀**
