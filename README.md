# 👶 Baby Care Tracker

A modern, colorful mobile app for iOS and Android that helps parents track their baby's feeding, diaper changes, and sleep patterns. The app features AI-powered suggestions to help you stay on top of your baby's needs!

## 📚 Documentation

- **[⚡ Quick Start Guide](./QUICK_START.md)** - Get running in 5 minutes
- **[🚀 Setup & Deployment Guide](./SETUP_AND_DEPLOYMENT.md)** - Complete guide for local development and app store publishing

## ✨ Features

### Core Tracking Features
- **🍼 Feeding Timer**: Track feeding sessions with a built-in timer
- **✨ Diaper Change Tracker**: Quick-tap to log diaper changes
- **😴 Sleep Timer**: Start/stop timer to track nap and sleep duration

### Smart Features
- **🤖 AI Suggestions**: Get intelligent recommendations for what your baby needs next based on historical patterns
- **📊 Pattern Visualization**: Beautiful color-coded activity timeline showing feeding, cleaning, and sleep patterns over 24 hours
- **📈 Activity Summary**: View counts of daily feedings, diaper changes, and naps
- **⏱️ Duration Tracking**: Automatically tracks duration for feeding and sleep sessions
- **💾 Persistent Storage**: All data is saved locally on your device

### Design
- Modern white background with colorful gradients
- Clean, intuitive interface
- Responsive design for all screen sizes
- Emojis for visual appeal
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator, or physical device with Expo Go app

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd baby-care-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Press `i` in the terminal or scan the QR code with the Camera app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Physical Device**: Install the Expo Go app and scan the QR code

## 📱 Running on Different Platforms

### iOS (Mac required)
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web (for testing)
```bash
npm run web
```

## 📖 How to Use

### Tracking Activities

1. **Feeding**
   - Tap "Start Feeding" when your baby begins eating
   - The timer will count up automatically
   - Tap "Stop Feeding" when done
   - Duration is automatically recorded

2. **Diaper Change**
   - Simply tap "Mark Diaper Changed" whenever you change the diaper
   - Timestamp is automatically recorded

3. **Sleep**
   - Tap "Baby is Asleep" when your baby falls asleep
   - The timer will track sleep duration
   - Tap "Baby is Awake" when they wake up
   - Duration is automatically recorded

### Understanding AI Suggestions

The AI Suggestion card at the top analyzes your baby's patterns and suggests:
- When the next feeding is likely due
- When a diaper change might be needed
- When it's time for a nap

The suggestions are based on:
- Average intervals between activities
- Time since last activity
- Patterns over the last 24 hours

### Viewing Patterns

Scroll down to see:
- **24-Hour Summary**: Color-coded cards showing total feedings, changes, and naps
- **Recent Activities**: Timeline of recent activities with timestamps and durations

## 🎨 Color Scheme

- **Feeding**: Pink gradient (#FF6B9D → #FF8FB3) 🍼
- **Diaper Change**: Teal gradient (#4ECDC4 → #6FE5DB) ✨
- **Sleep**: Purple gradient (#A78BFA → #C4B5FD) 😴
- **All Good**: Green gradient (#10B981 → #34D399) ✅

## 🛠️ Technical Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tools
- **AsyncStorage**: Local data persistence
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **React Native SVG**: Vector graphics support

## 📁 Project Structure

```
baby-care-tracker/
├── App.js                          # Main app component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── components/
│   │   ├── FeedingTimer.js        # Feeding timer component
│   │   ├── CleaningTracker.js     # Diaper change tracker
│   │   ├── SleepTimer.js          # Sleep timer component
│   │   ├── PatternVisualization.js # Activity timeline and stats
│   │   └── AISuggestion.js        # AI suggestion component
│   └── utils/
│       ├── dataManager.js         # AsyncStorage operations
│       └── aiSuggestions.js       # AI logic for suggestions
└── assets/                         # Images and fonts
```

## 🔄 Data Storage

All data is stored locally on your device using AsyncStorage. This means:
- ✅ Your data is private and never leaves your device
- ✅ No internet connection required
- ✅ Works offline 100% of the time
- ⚠️ Data is tied to the app installation (will be lost if app is deleted)

## 🤖 AI Suggestion Algorithm

The AI uses a simple but effective algorithm:
1. Calculates average intervals between each activity type
2. Determines time elapsed since last occurrence
3. Compares elapsed time to average interval
4. Suggests activities that are 90% or more overdue
5. Prioritizes the most overdue activity

## 🎯 Future Enhancements

Potential features for future versions:
- Multiple baby profiles
- Export data to CSV/PDF
- Share reports with caregivers
- Medication tracking
- Growth tracking (weight, height)
- Feeding amount tracking
- Diaper type (wet/dirty/both)
- Photo attachments
- Backup to cloud
- Dark mode
- Widget support
- Notifications/reminders

## 🐛 Troubleshooting

### App won't start
- Make sure all dependencies are installed: `npm install`
- Clear cache: `expo start -c`

### Timers not working
- Make sure the app stays in foreground
- Check that your device isn't in power saving mode

### Data not persisting
- Check AsyncStorage permissions
- Try clearing app data and starting fresh

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👏 Acknowledgments

- Built with React Native and Expo
- Inspired by the needs of new parents everywhere
- Emoji graphics from system fonts

---

Made with ❤️ for parents and caregivers
