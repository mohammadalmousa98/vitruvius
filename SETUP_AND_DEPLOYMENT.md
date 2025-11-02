# 🚀 Setup and Deployment Guide

Complete guide to run the Baby Care Tracker app locally and publish to app stores.

---

## 📱 Part 1: Running Locally

### Prerequisites

Before you start, install the following:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm or yarn**
   - Comes with Node.js
   - Verify: `npm --version`

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **Expo Go App** (for testing on physical device)
   - iOS: Download from App Store
   - Android: Download from Google Play Store

5. **Optional: Simulators/Emulators**
   - **iOS Simulator**: Requires Mac with Xcode
   - **Android Emulator**: Requires Android Studio

---

### Step-by-Step: Running Locally

#### Step 1: Navigate to Project Directory
```bash
cd /home/user/vitruvius
```

#### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React Native
- Expo
- AsyncStorage
- Linear Gradient
- And more...

#### Step 3: Start the Development Server
```bash
npm start
# or
expo start
```

This will:
- Start the Metro bundler
- Open a browser with Expo DevTools
- Display a QR code in the terminal

#### Step 4: Run on Your Device

**Option A: Physical Device (Easiest)**
1. Install "Expo Go" app on your phone
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. App will load on your device

**Option B: iOS Simulator (Mac only)**
1. Install Xcode from Mac App Store
2. Press `i` in the terminal
3. App will open in iOS Simulator

**Option C: Android Emulator**
1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Press `a` in the terminal
4. App will open in Android Emulator

#### Step 5: Development Tips

- **Hot Reload**: Changes to code automatically reload the app
- **Shake Device**: Opens developer menu (or Cmd+D on iOS simulator, Cmd+M on Android emulator)
- **Clear Cache**: Run `expo start -c` to clear cache

---

## 🏪 Part 2: Publishing to App Stores

### Overview

There are two main approaches:
1. **Expo Managed Workflow** (Easier, recommended for beginners)
2. **Bare Workflow** (More control, requires native development knowledge)

We'll focus on the **Expo Managed Workflow** which is simpler.

---

## 📱 Publishing to Apple App Store (iOS)

### Prerequisites

1. **Apple Developer Account**
   - Cost: $99/year
   - Sign up: https://developer.apple.com/programs/

2. **Mac Computer**
   - Required for iOS app submission

3. **App Store Connect Access**
   - Set up at: https://appstoreconnect.apple.com/

### Steps to Publish

#### 1. Configure App Details

Edit `app.json`:
```json
{
  "expo": {
    "name": "Baby Care Tracker",
    "slug": "baby-care-tracker",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.babycaretracker",
      "buildNumber": "1",
      "supportsTablet": true
    }
  }
}
```

#### 2. Create App Icons

You need proper app icons (not placeholders):
- Main icon: 1024x1024px PNG (no transparency)
- Place in `assets/icon.png`

Use a tool like:
- Figma/Sketch
- Canva
- App Icon Generator online tools

#### 3. Install EAS CLI

```bash
npm install -g eas-cli
```

#### 4. Login to Expo

```bash
eas login
```

#### 5. Configure EAS Build

```bash
eas build:configure
```

This creates an `eas.json` file.

#### 6. Build for iOS

```bash
eas build --platform ios
```

Choose:
- Build type: **production** (for App Store)
- Apple Developer account credentials when prompted

This will:
- Build your app in the cloud
- Create an `.ipa` file
- Take 10-30 minutes

#### 7. Submit to App Store

```bash
eas submit --platform ios
```

Or manually:
1. Download the `.ipa` file from Expo dashboard
2. Use Transporter app (Mac) to upload to App Store Connect
3. Fill out app information in App Store Connect
4. Submit for review

#### 8. App Store Connect Setup

1. Go to https://appstoreconnect.apple.com/
2. Click "My Apps" → "+" → "New App"
3. Fill out:
   - App name
   - Primary language
   - Bundle ID (must match `bundleIdentifier`)
   - SKU (unique identifier)
4. Add:
   - Screenshots (required for all device sizes)
   - App description
   - Keywords
   - Support URL
   - Privacy policy URL
5. Submit for review

**Review Time**: 1-3 days typically

---

## 🤖 Publishing to Google Play Store (Android)

### Prerequisites

1. **Google Play Developer Account**
   - One-time fee: $25
   - Sign up: https://play.google.com/console/signup

2. **No Mac Required**
   - Can be done from any computer

### Steps to Publish

#### 1. Configure App Details

Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.babycaretracker",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

#### 2. Create App Icons

- Icon: 1024x1024px PNG
- Adaptive icon: 1024x1024px PNG (Android)
- Place in `assets/` folder

#### 3. Build for Android

```bash
eas build --platform android
```

Choose:
- Build type: **production** (for Play Store)
- Let Expo manage the keystore (recommended)

This creates an `.aab` or `.apk` file.

#### 4. Create App in Play Console

1. Go to https://play.google.com/console/
2. Click "Create app"
3. Fill out:
   - App name
   - Default language
   - App or game
   - Free or paid

#### 5. Complete Store Listing

Fill out required information:
- App description (short and full)
- Screenshots (phone, tablet)
- App icon (512x512px)
- Feature graphic (1024x500px)
- App category
- Content rating questionnaire
- Privacy policy URL

#### 6. Upload App Bundle

1. Go to "Production" → "Create new release"
2. Upload the `.aab` file from Expo build
3. Add release notes
4. Review and roll out to production

#### 7. Submit for Review

Click "Submit for review"

**Review Time**: Usually a few hours to a few days

---

## 🔧 Important Pre-Publishing Steps

### 1. Test Thoroughly

```bash
# Test production build locally
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### 2. Add Real Icons

Replace placeholder files in `assets/`:
- `icon.png` (1024x1024px)
- `adaptive-icon.png` (1024x1024px for Android)
- `splash.png` (2048x2048px recommended)

### 3. Update App Information

In `app.json`:
- Update `name` (displayed name)
- Update `slug` (unique identifier)
- Update `version` (follow semantic versioning)
- Update `bundleIdentifier`/`package` (unique reverse domain)

### 4. Add Privacy Policy

Required by both stores. Should cover:
- What data is collected (in this case: none, all stored locally)
- How data is used
- Data retention
- User rights

Host it on:
- Your website
- GitHub Pages
- Google Docs (public)

### 5. Create Screenshots

Required for both stores:
- Various device sizes
- Show key features
- Clean, professional looking

Use:
- Real device screenshots
- iOS Simulator screenshots
- Android Emulator screenshots
- Screenshot design tools (Figma, etc.)

---

## 📋 Pre-Submission Checklist

### App Functionality
- [ ] All features work correctly
- [ ] No crashes or bugs
- [ ] Timers work properly
- [ ] Data persists correctly
- [ ] App works offline
- [ ] Tested on multiple devices/screen sizes

### App Store Requirements
- [ ] App icons (all sizes)
- [ ] Splash screen
- [ ] Screenshots for all required device sizes
- [ ] App description
- [ ] Keywords
- [ ] Privacy policy
- [ ] Support URL/email
- [ ] Content rating

### Technical
- [ ] `bundleIdentifier` (iOS) is unique
- [ ] `package` (Android) is unique
- [ ] Version numbers set correctly
- [ ] No console errors
- [ ] Production build tested

---

## 🆘 Troubleshooting

### "Build Failed"
- Check `eas.json` configuration
- Verify Apple/Google credentials
- Check for dependency conflicts
- Review build logs in Expo dashboard

### "Invalid Bundle Identifier"
- Must be unique (not used by another app)
- Format: `com.company.appname`
- No special characters
- All lowercase

### "App Rejected"
- Review rejection reason in store console
- Fix issues
- Increment version number
- Resubmit

### "Can't Run Locally"
- Delete `node_modules` and reinstall: `npm install`
- Clear cache: `expo start -c`
- Update Expo: `npm install expo@latest`
- Check Expo Go app is latest version

---

## 💰 Cost Summary

| Item | iOS | Android |
|------|-----|---------|
| Developer Account | $99/year | $25 one-time |
| Mac Computer | Required | Not required |
| Testing Device | Optional | Optional |
| App Icons/Graphics | Free (DIY) or $5-50 | Free (DIY) or $5-50 |
| **Total First Year** | **$99-149** | **$25-75** |

---

## 🔄 Updating Your App

After initial publication:

1. Make code changes
2. Update version in `app.json`:
   ```json
   {
     "version": "1.1.0",
     "ios": { "buildNumber": "2" },
     "android": { "versionCode": 2 }
   }
   ```
3. Build new version:
   ```bash
   eas build --platform all
   ```
4. Submit update through same process
5. Updates typically reviewed faster than initial submission

---

## 📚 Helpful Resources

- **Expo Documentation**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Play Store Guidelines**: https://play.google.com/console/about/guides/

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Run locally
npm start

# Build for both platforms
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## ⚡ Alternative: Expo Go (For Testing Only)

If you just want to share with friends/family for testing (not public release):

1. Build and publish to Expo:
   ```bash
   expo publish
   ```

2. Share the link or QR code

3. Users need Expo Go app installed

**Note**: This is for testing only, not for public app store release.

---

Good luck with your app launch! 🚀
