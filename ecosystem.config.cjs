module.exports = {
  apps: [
    // Production environment - port 3002
    {
      name: 'modern-notes-app-prod',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        BASE_PATH: '/modern-notes-app/'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
        BASE_PATH: '/modern-notes-app/'
      }
    },
    // Development environment - port 3003 (using Vite dev server)
    {
      name: 'modern-notes-app-dev',
      script: 'npm',
      args: 'run start:dev',
      instances: 1,
      autorestart: true,
      watch: ['src', 'vite.config.js'],
      ignore_watch: ['node_modules', 'dist', 'logs'],
      watch_options: {
        followSymlinks: false
      },
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3003
      }
    }
  ]
};