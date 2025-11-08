module.exports = {
  apps: [
    {
      name: 'lifetex-ai-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
