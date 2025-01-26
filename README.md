# 🛸 Alien Transmissions PWA

A sci-fi themed Progressive Web App (PWA) that brings the excitement of alien communications to your browser! Built with Vue 3, Vite, and enhanced with push notifications, this app features a unique alien-themed interface and interactive notification system.

[Live Demo](https://your-username.github.io/csmcl-nexus-omboarding/) | [Documentation](#documentation)

![Alien Transmissions Screenshot](screenshot.png)

## ✨ Features

### 🔔 Advanced Notification System
- **Multiple Notification Types**:
  - 🚨 **Alerts**: High-priority messages for urgent situations
  - 👽 **Messages**: Standard alien communications
  - 🌟 **Discoveries**: Special announcements for new findings

- **Custom Message Management**:
  - Create and manage your own alien messages
  - Organize messages by category
  - Random message selection
  - Persistent storage using Pinia

- **Scheduling System**:
  - Schedule notifications for future delivery
  - View and manage scheduled transmissions
  - Cancel scheduled messages
  - Real-time updates

### 🎨 Alien-Themed UI
- Futuristic design with glowing effects
- Animated components
- Responsive layout
- Dark mode optimized
- Custom sci-fi buttons and indicators

### 🚀 PWA Features
- Installable on desktop and mobile
- Offline support
- Push notifications
- Automatic updates

## 🛠️ Technology Stack

- **Frontend**:
  - Vue 3 with Composition API
  - Vite for fast development
  - Tailwind CSS for styling
  - Pinia for state management

- **PWA**:
  - VitePWA plugin
  - Service Workers
  - Web Push API
  - Workbox for caching

- **Backend**:
  - Express.js server
  - Web Push for notifications
  - VAPID key authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Modern browser with Push API support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/csmcl-nexus-omboarding.git
cd csmcl-nexus-omboarding
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your VAPID keys:
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

## 📱 Usage Guide

### Setting Up Notifications

1. Visit the app in your browser
2. Click "REQUEST ACCESS" to enable notifications
3. Allow notifications when prompted
4. Test the connection with different notification types

### Managing Custom Messages

1. Navigate to the Message Control panel
2. Select a message type (Alert, Message, Discovery)
3. Click "Add Message" to create new messages
4. Use the delete button to remove messages
5. Messages are automatically saved and persisted

### Scheduling Notifications

1. Click "SCHEDULE TRANSMISSION"
2. Select message type and content
3. Choose delivery time
4. View scheduled messages in the list
5. Cancel if needed

## 🔧 Configuration

### VAPID Keys
Generate your VAPID keys using the provided script:
```bash
cd server
node generate-vapid.js
```

### Customizing Notification Sounds
1. Add your sound files to `public/sounds/`
2. Update the notification configurations in `server/server.js`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons and sounds from [source]
- Inspired by sci-fi and alien themes
- Built with Vue.js and modern web technologies

## 📞 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/your-username/csmcl-nexus-omboarding](https://github.com/your-username/csmcl-nexus-omboarding)
