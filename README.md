# Modern Notes App

A beautiful, modern note-taking application inspired by Vercel's design aesthetic. Built with React, Vite, and Tailwind CSS.

## 🎯 **Live Deployment**

**📍 Production URL**: http://167.172.236.171:3002

**⚙️ Status**: ✅ **LIVE & RUNNING**

## 💡 Features

- ✨ **Vercel-inspired modern UI** with clean design
- 📝 **Rich text notes** with automatic saving
- 🔍 **Instant search** across all notes
- 💾 **Local storage persistence** - your notes stay safe
- 🔧 **Dark/Light mode** with system preference detection
- 🎒 **Tag-based categorization** for organized notes
- ⌨️ **Keyboard shortcuts** (Ctrl+S to save, Esc to cancel)
- 📱 **Mobile-responsive design** that works on all devices
- 🎨 **Beautiful animations** and hover effects

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vitest** - Testing framework
- **Express.js** - Production server
- **PM2** - Process management

## 📝 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/0reilly/modern-notes-app.git
   cd modern-notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   📍 Access at: http://localhost:5173

4. **Run tests**
   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Production Deployment

### Current VPS Setup
- **Server**: Ubuntu VPS
- **Port**: 3002
- **Process Manager**: PM2
- **Access**: Public IP (167.172.236.171)

### Deployment Commands

```bash
# Build the application
npm run build

# Start production server
npm run serve

# Or use the provided start script
./start.sh

# For PM2 process management
pm2 start ecosystem.config.js --env production
```

### Manual Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the server** (binds to 0.0.0.0:3002)
   ```bash
   npm run serve
   ```

3. **Verify deployment**
   ```bash
   curl http://localhost:3002
   ```

## 📁 CI/CD Pipeline

This project uses **GitHub Actions** for automated testing and deployment:

### Workflow Features:
- ✅ **Automated testing** on Node.js 18 & 20
- ✅ **Build verification** and security audits
- ✅ **Deployment package creation**
- ✅ **Health checks** post-deployment

### Pipeline Status:
- **Tests**: 3/3 passing ✅
- **Build**: Successful ✅
- **Security**: No high/critical vulnerabilities ✅

### View Pipeline:
- GitHub Actions: https://github.com/0reilly/modern-notes-app/actions

## 📖 Project Structure

```
modern-notes-app/
├── src/
│   ├── components/
│   │   ├── DarkModeToggle.jsx
│   │   ├── NoteCard.jsx
│   │   ├── NoteEditor.jsx
│   │   ├── RichTextEditor.jsx
│   │   └── TagInput.jsx
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── index.css
│   ├── main.jsx
│   └── test-setup.js
├── .github/workflows/
│   └── deploy.yml
├── dist/ (production build)
├── public/
├── ecosystem.config.js
├── package.json
├── server.js
├── start.sh
├── tailwind.config.js
└── vite.config.js
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Start production server
- `npm run preview` - Preview production build
- `npm test` - Run test suite
- `npm run test:ui` - Run tests with UI

## 🔧 Development

### Key Components

- **App.jsx** - Main application component
- **NoteEditor.jsx** - Note creation/editing interface
- **RichTextEditor.jsx** - Text formatting toolbar
- **DarkModeToggle.jsx** - Theme switching
- **TagInput.jsx** - Tag management

### Testing

Tests are written with **Vitest** and **React Testing Library**:

```bash
# Run tests once
npm test

# Run tests with UI
npm run test:ui
```

## 🛡 Security

- ✅ **Content Security Policy** implemented
- ✅ **XSS protection** for rich text content
- ✅ **npm audit** integrated in CI/CD
- ✅ **No secrets** in repository

## 📈 Performance

- ✅ **Production-optimized** asset bundling
- ✅ **Code splitting** for faster loads
- ✅ **Efficient re-rendering** with React best practices
- ✅ **Optimized images** and fonts delivery

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📑 License

This project is open source and available under the [MIT License](LICENSE).

---

**📍 Live Demo**: http://167.172.236.171:3002  
**💻 Repository**: https://github.com/0reilly/modern-notes-app  
**📅 Last Updated**: September 26, 2025