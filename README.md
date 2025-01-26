# 🛸 CSMCL Nexus Onboarding

A sci-fi themed Progressive Web App (PWA) built with Vue 3 + Vite, featuring alien-styled push notifications and a futuristic UI.

## ✨ Features

- 👽 Alien-themed UI with glowing effects and animations
- 🚀 Full PWA support with offline functionality
- 📡 Push notifications with alien transmissions
- 🎨 Custom sci-fi components and styling
- 🌌 Space-themed dark mode design

## 🛠️ Tech Stack

- Vue 3 with `<script setup>`
- Vite for blazing fast development
- Tailwind CSS for styling
- Workbox for PWA capabilities
- Web Push for notifications

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd csmcl-nexus-omboarding
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your VAPID keys (for push notifications):
```env
VITE_VAPID_PUBLIC_KEY=your_public_key
VITE_VAPID_PRIVATE_KEY=your_private_key
```

4. Start the development server:
```bash
npm run dev
```

5. Start the notification server:
```bash
cd server
npm install
node server.js
```

## 🏗️ Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📱 PWA Features

- Installable on desktop and mobile devices
- Works offline
- Push notifications for alien transmissions
- Automatic updates when new content is available

## 🎨 UI Components

- `AlienLogo`: Animated alien logo with glowing effects
- `SciFiButton`: Futuristic button with hover animations
- `AlienNotifications`: Push notification management with sci-fi styling
- Space-themed background with star effect

## 🔐 Security

- VAPID keys for secure push notifications
- Environment variables for sensitive data
- Service worker for secure offline functionality

## 📄 License

MIT License - feel free to use this project for your own alien communications!
