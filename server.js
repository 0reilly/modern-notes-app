import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3002
const BASE_PATH = process.env.BASE_PATH || '/modern-notes-app/'

// Security middleware
app.disable('x-powered-by')  // Hide Express.js information

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})

// Health check endpoint - must come before static file serving
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Serve static files from the dist directory at the base path
app.use(BASE_PATH, express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    // Set proper MIME types for common file extensions
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css')
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript')
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml')
    }
  }
}))

// Handle client-side routing - return index.html for routes that don't match static files
app.get('*', (req, res) => {
  // Only serve index.html for routes that don't have file extensions
  // This prevents the catch-all from intercepting static asset requests
  if (req.path.includes('.')) {
    // Let Express handle static files normally
    return res.status(404).send('Not found')
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Modern Notes App server running on port ${PORT}`)
  console.log(`Base path: ${BASE_PATH}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Health endpoint: http://localhost:${PORT}/health`)
})