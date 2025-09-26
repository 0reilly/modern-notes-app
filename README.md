# Modern Notes App

A beautiful, modern note-taking application inspired by Vercel's design aesthetic. Built with React, Vite, and Tailwind CSS.

## Features

- ✨ **Vercel-inspired modern UI** with clean design
- 📝 **Rich text notes** with automatic saving
- 🔍 **Instant search** across all notes
- 💾 **Local storage persistence** - your notes stay safe
- ⌨️ **Keyboard shortcuts** (Ctrl+S to save, Esc to cancel)
- 📱 **Responsive design** that works on all devices
- 🎨 **Beautiful animations** and hover effects

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vitest** - Testing framework

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd modern-notes-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
## VPS Deployment (Current Setup)

The application is currently deployed on a VPS with IP: **167.172.236.171**

### Access the Application:

- **Production URL**: http://167.172.236.171:3002
- **Port**: 3002 (configured to bind to all network interfaces)

### Starting the Application on VPS:

```bash
cd modern-notes-app
./start.sh
```

Or manually:

```bash
cd modern-notes-app
npm install
npm run build
npm run serve
```

The server will start and bind to `0.0.0.0:3002`, making it accessible from any device on the network.

### Firewall Configuration (if needed):

If the application is not accessible, ensure port 3002 is open in your firewall:

```bash
# For UFW (Ubuntu)
sudo ufw allow 3002

# For iptables
sudo iptables -A INPUT -p tcp --dport 3002 -j ACCEPT
```

- `Ctrl+S` / `Cmd+S` - Save current note
- `Esc` - Cancel editing
- `Enter` in title field - Move to content field

## Project Structure

```
src/
├── components/
│   ├── NoteCard.jsx      # Individual note display component
│   └── NoteEditor.jsx    # Note creation/editing modal
├── App.jsx               # Main application component
├── main.jsx              # React entry point
├── index.css             # Global styles with Tailwind
└── test-setup.js         # Test configuration
```

## Customization

The app uses a Vercel-inspired color palette defined in `tailwind.config.js`. You can customize the colors, fonts, and other design tokens by modifying this file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).