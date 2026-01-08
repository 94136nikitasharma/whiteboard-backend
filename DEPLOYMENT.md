# Deployment Guide

This guide covers multiple deployment options for the Whiteboard Backend.

## Table of Contents

- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [PM2 Process Manager](#pm2-process-manager)
- [Cloud Deployment](#cloud-deployment)
- [Environment Variables](#environment-variables)

---

## Local Development

### Prerequisites
- Node.js v14+
- npm or yarn

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:8080`

---

## Docker Deployment

### Using Docker

1. **Build the image:**
   ```bash
   docker build -t whiteboard-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     -p 8080:8080 \
     -e NODE_ENV=production \
     -e CORS_ORIGIN=* \
     --name whiteboard-backend \
     whiteboard-backend
   ```

3. **Check logs:**
   ```bash
   docker logs -f whiteboard-backend
   ```

### Using Docker Compose

1. **Start services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

---

## PM2 Process Manager

PM2 is a production process manager for Node.js applications with built-in load balancer.

### Installation

```bash
npm install -g pm2
```

### Deployment

1. **Start application:**
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

2. **Monitor:**
   ```bash
   pm2 monit
   ```

3. **View logs:**
   ```bash
   pm2 logs whiteboard-backend
   ```

4. **Restart:**
   ```bash
   pm2 restart whiteboard-backend
   ```

5. **Setup auto-restart on reboot:**
   ```bash
   pm2 startup
   pm2 save
   ```

---

## Cloud Deployment

### Heroku

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend.com
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **Scale:**
   ```bash
   heroku ps:scale web=1
   ```

### AWS EC2

1. **SSH into EC2 instance**

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository:**
   ```bash
   git clone <your-repo>
   cd whiteboard-backend
   ```

4. **Install dependencies:**
   ```bash
   npm ci --only=production
   ```

5. **Setup PM2:**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js --env production
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### DigitalOcean App Platform

1. **Connect your repository**

2. **Configure app:**
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Port: 8080

3. **Set environment variables in dashboard**

4. **Deploy**

### Vercel (Serverless)

**Note:** Socket.io requires persistent connections, so Vercel is not recommended for this application. Use a traditional server instead.

---

## Environment Variables

### Required Variables

```env
PORT=8080                    # Server port
NODE_ENV=production          # Environment mode
CORS_ORIGIN=*               # Allowed origins (or specific domain)
```

### Optional Variables (Future Enhancements)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/whiteboard
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key

# Logging
LOG_LEVEL=info
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `CORS_ORIGIN`
- [ ] Enable HTTPS/TLS
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure firewall rules
- [ ] Enable monitoring and logging
- [ ] Set up automatic backups (if using database)
- [ ] Configure rate limiting
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Enable application monitoring (PM2, DataDog, etc.)
- [ ] Set up error tracking (Sentry, etc.)

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Process list
pm2 list

# Detailed info
pm2 show whiteboard-backend

# Restart on file changes (dev only)
pm2 start ecosystem.config.js --watch
```

### Docker Health Checks

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' whiteboard-backend

# View health check logs
docker inspect whiteboard-backend | jq '.[0].State.Health'
```

### Logs

```bash
# PM2 logs
pm2 logs whiteboard-backend --lines 100

# Docker logs
docker logs -f whiteboard-backend

# Docker Compose logs
docker-compose logs -f
```

---

## Scaling Considerations

### Horizontal Scaling

For multiple server instances:

1. **Use Redis adapter for Socket.io:**
   ```bash
   npm install socket.io-redis
   ```

2. **Update Socket service:**
   ```javascript
   const redisAdapter = require('socket.io-redis');
   io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
   ```

3. **Use sticky sessions in load balancer**

### Database

Replace in-memory storage:

1. **Install MongoDB:**
   ```bash
   npm install mongoose
   ```

2. **Update StorageService** to use MongoDB instead of Map

---

## Security Recommendations

1. **Enable rate limiting:**
   ```bash
   npm install express-rate-limit
   ```

2. **Add helmet for security headers:**
   ```bash
   npm install helmet
   ```

3. **Validate and sanitize inputs**

4. **Implement authentication** (JWT/OAuth)

5. **Use HTTPS in production**

6. **Set secure CORS origin** (not `*`)

---

## Troubleshooting

### Port already in use
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### WebSocket connection fails
- Check firewall rules
- Ensure WebSocket upgrade headers are allowed
- Verify reverse proxy configuration

### High memory usage
- Enable clustering in PM2
- Implement database persistence
- Add memory limits in Docker

---

## Support

For issues or questions:
- Check server logs
- Review environment variables
- Verify network connectivity
- Check Socket.io connection in browser console
