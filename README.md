# Modern Notes App

A beautiful, modern note-taking application inspired by Vercel's design aesthetic. Built with React, Vite, and Tailwind CSS with advanced features and PWA support.

## 🎯 **Live Deployment**

**📍 Production URL**: http://167.172.236.171:3002

**⚙️ Status**: ✅ **LIVE & RUNNING**

## 💡 **Enhanced Features**

### 📝 **Advanced Note Management**
- ⭐ **Star important notes** for quick access
- 📂 **Archive notes** to keep your workspace clean
- 🗑️ **Trash system** with restore and permanent delete options
- 📋 **Multiple views**: All Notes, Starred, Archived, Trash
- 📖 **Markdown support** with live preview
- 📄 **Rich text formatting** with toolbar
- 💾 **Auto-save** as you type

### 🎨 **Enhanced UI/UX**
- 🔍 **Advanced search** across titles, content, and tags
- 📉 **Collapsible sidebar** for more workspace
- 📊 **Quick stats** showing note counts
- 📱 **Mobile-optimized** with touch-friendly interface
- ⏱️ **Smooth animations** and transitions
- 🎒 **Dark/Light mode** with system preference detection

### 🛠️ **Productivity Features**
- 📤 **Export/Import** notes as JSON backup
- 📋 **Markdown export** for external use
- 📝 **Fullscreen editing** mode for focus
- ⌨️ **Keyboard shortcuts** (Ctrl+S to save, Esc to cancel)
- 📰 **Tag-based organization** with visual indicators
- 🔍 **Real-time search** with instant results

### 📱 **PWA & Mobile Experience**
- 📶 **Progressive Web App** support
- 📰 **Offline functionality** with service worker
- 📱 **Mobile-first design** with responsive layout
- 📲 **Installable** on mobile devices
- ⚡ **Fast loading** with optimized assets

### 💻 **Settings & Customization**
- 🔧 **Comprehensive settings panel**
- 🎨 **Appearance customization** (fonts, themes)
- 💾 **Data management** (backup, restore, clear)
- 🔒 **Privacy settings** (auto-lock, encryption)
- 📧 **Notification preferences**

## 🛠️ **Tech Stack**

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Marked** - Markdown parsing
- **React Router** - Client-side routing

### Backend & Infrastructure
- **Express.js** - Production server
- **PM2** - Process management
- **Service Worker** - Offline functionality
- **PWA Manifest** - Mobile app capabilities

### Testing & Quality
- **Vitest** - Fast testing framework
- **Testing Library** - Component testing
- **ESLint** - Code quality
- **TypeScript** - Type checking (optional)

## 📝 **Quick Start**

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Local Development

1. **Clone and setup**
   ```bash
   git clone https://github.com/0reilly/modern-notes-app.git
   cd modern-notes-app
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   📍 Access at: http://localhost:5173

3. **Run tests**
   ```bash
   npm test
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📋 **Usage Guide**

### Creating Notes
1. Click "New Note" button or press `Ctrl+N`
2. Add title and content (supports Markdown)
3. Use formatting toolbar for rich text
4. Add tags for organization
5. Save with `Ctrl+S` or click "Save Note"

### Organizing Notes
- **Star notes**: Click star icon to mark as important
- **Archive notes**: Move less-used notes to archive
- **Tag notes**: Use tags for categorization
- **Search**: Use search bar to find notes instantly

### Advanced Features
- **Markdown Preview**: Switch between edit and preview modes
- **Fullscreen Mode**: Focus on writing without distractions
- **Export**: Download notes as Markdown or JSON backup
- **Import**: Restore notes from backup files

## 🚀 **Production Deployment**

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

# Or use PM2 for process management
pm2 start ecosystem.config.js --env production

# Check status
pm2 status
```

### Environment Configuration

Create `.env.production`:
```env
NODE_ENV=production
PORT=3002
```

## 📖 **API & Integration**

### Note Structure
```json
{
  "id": "unique-id",
  "title": "Note Title",
  "content": "Note content with Markdown support",
  "tags": ["tag1", "tag2"],
  "starred": false,
  "archived": false,
  "deleted": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Local Storage Schema
- Key: `modern-notes`
- Value: Array of note objects

## 📈 **Performance**

- **Bundle Size**: ~250KB (gzipped)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+

## 🛠️ **Development**

### Project Structure
```
src/
├── components/          # React components
│   ├── NoteCard.jsx       # Individual note display
│   ├── NoteEditor.jsx     # Note creation/editing
│   ├── Sidebar.jsx        # Navigation sidebar
│   ├── SettingsPanel.jsx  # Settings interface
│   ├── __tests__/         # Component tests
├── App.jsx              # Main application
├── main.jsx            # Entry point
├── index.css           # Global styles
└── ...
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript checking

## 📑 **Security**

- **XSS Protection**: Sanitized Markdown rendering
- **Local Storage**: Client-side data only
- **Rate Limiting**: Express rate limiting
- **HTTPS Ready**: Secure deployment ready

## 💡 **Future Enhancements**

- [ ] **Cloud Sync** with backend service
- [ ] **Collaborative Editing** real-time features
- [ ] **Advanced Search** with filters
- [ ] **Note Templates** for quick creation
- [ ] **Audio Notes** recording support
- [ ] **Image Upload** and management
- [ ] **Export to PDF** functionality
- [ ] **Plugin System** for extensibility

## 💬 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 **Changelog**

### v2.0.0 - Major Enhancement Release
- ✅ **Complete UI overhaul** with sidebar navigation
- ✅ **Advanced note organization** (star, archive, trash)
- ✅ **Markdown support** with live preview
- ✅ **PWA capabilities** for mobile experience
- ✅ **Settings panel** with customization options
- ✅ **Export/Import** functionality
- ✅ **Enhanced mobile responsiveness**

### v1.0.0 - Initial Release
- Basic note creation and editing
- Local storage persistence
- Dark/light mode toggle
- Tag-based organization
- Search functionality

## 📩 **Support**

For issues and feature requests, please create an issue on GitHub.

---

**Built with ❤️ using modern web technologies**