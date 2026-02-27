# Deployment Guide

Deploy your File Upload System to various platforms.

## Local Development (Already Done ✓)

```bash
npm install
npm start
# Access at http://localhost:3000
```

---

## Heroku Deployment

### Prerequisites
- Heroku account ([Sign up](https://www.heroku.com))
- Heroku CLI installed

### Steps

1. **Create Procfile**
```
web: npm start
```

2. **Create .herokuenv** (different from .env)
```
PORT=3000
N8N_WEBHOOK_URL=https://your-n8n.example.com/webhook/file-upload
```

3. **Initialize Git** (if not already)
```bash
git init
git add .
git commit -m "Initial commit"
```

4. **Create Heroku App**
```bash
heroku create your-app-name
```

5. **Set Environment Variables**
```bash
heroku config:set N8N_WEBHOOK_URL=https://your-n8n/webhook/FILE_ID
```

6. **Deploy**
```bash
git push heroku main
```

7. **View Logs**
```bash
heroku logs --tail
```

Your site: `https://your-app-name.herokuapp.com`

---

## AWS EC2 Deployment

### Prerequisites
- AWS EC2 instance (Ubuntu 20.04 recommended)
- SSH access to instance

### Steps

1. **Connect to EC2 Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Install Node.js**
```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2** (for process management)
```bash
sudo npm install -g pm2
```

4. **Upload Project**
```bash
# From your local machine
scp -i your-key.pem -r File\ Upload\ Project ubuntu@your-ec2-ip:/home/ubuntu/
```

5. **Setup Environment**
```bash
cd File\ Upload\ Project
npm install
```

6. **Configure .env**
```bash
nano .env
# Edit with your n8n webhook URL
```

7. **Start with PM2**
```bash
pm2 start server.js --name "file-upload"
pm2 startup
pm2 save
```

8. **Setup Nginx Reverse Proxy**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

9. **Setup SSL Certificate** (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Your site: `https://your-domain.com`

---

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Run

```bash
# Build image
docker build -t file-upload-system .

# Run container
docker run -p 3000:3000 \
  -e N8N_WEBHOOK_URL=http://your-n8n:5678/webhook/FILE_ID \
  file-upload-system
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - N8N_WEBHOOK_URL=http://n8n:5678/webhook/file-upload
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - n8n

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=sqlite
    volumes:
      - n8n_storage:/home/node/.n8n
    restart: always

volumes:
  n8n_storage:
```

Run:
```bash
docker-compose up -d
```

---

## DigitalOcean Deployment

### Prerequisites
- DigitalOcean account
- Droplet (Ubuntu 20.04)

### Steps

1. **Create Droplet**
   - Size: $5/month (1GB RAM, 1vCPU)
   - Region: Closest to you
   - OS: Ubuntu 20.04

2. **SSH into Droplet**
```bash
ssh root@your_ip
```

3. **Setup Server** (run as root)
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Create app directory
mkdir -p /var/www/file-upload
cd /var/www/file-upload
```

4. **Copy Files**
```bash
# From local machine
rsync -avz -e ssh File\ Upload\ Project/ root@your_ip:/var/www/file-upload/
```

5. **Install Dependencies & Start**
```bash
npm install
npm start  # Test it first

# Then with PM2
pm2 start server.js --name "file-upload"
pm2 startup
pm2 save
```

6. **Setup Firewall**
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

7. **Optional: Point Domain**
   - Add A record to your domain pointing to droplet IP
   - Access via domain + Nginx (as shown in AWS guide)

Cost: ~$5/month

---

## Replit Deployment (Free!)

### Steps

1. **Create Account** at [replit.com](https://replit.com)

2. **Create New Repl**
   - Language: Node.js
   - Name: file-upload-system

3. **Upload Files**
   - Copy all files into Repl
   - Or clone from GitHub

4. **Install Dependencies**
```bash
npm install
```

5. **Run**
   - Click "Run" button
   - Your live URL appears (e.g., `https://your-replit.replit.dev`)

6. **Make Public**
   - Share → Generate link
   - Your public URL

**Free but with limitations:**
- Project sleeps after inactivity
- Limited RAM/storage
- Replit domain required

---

## Railway Deployment

### Steps

1. **Sign up** at [railway.app](https://railway.app)

2. **Connect GitHub** (or connect project)

3. **Add Project**
   - Click "New Project"
   - Deploy from repo or CLI

4. **Add Environment Variables**
   - Dashboard → Variables
   - `N8N_WEBHOOK_URL=...`

5. **Deploy**
   - Railway auto-deploys on push
   - Get assigned domain automatically

**Easy & reliable! Best for small projects**

---

## Environment Variables for Production

Never commit `.env` file to git!

```env
# Server
PORT=3000
NODE_ENV=production

# n8n Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/file-upload

# Security (optional)
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT=100  # Requests per hour
MAX_FILE_SIZE=52428800  # 50MB in bytes

# Email Override (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=myn8nuploade@gmail.com
SMTP_PASS=your_app_password
```

---

## Performance Optimization

### 1. Increase File Size Limit
```javascript
limits: { fileSize: 100 * 1024 * 1024 } // 100MB
```

### 2. Add Compression
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Add Caching Headers
```javascript
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

### 4. Database Integration (Optional)
For larger scale, add MongoDB:
```bash
npm install mongoose
```

---

## Monitoring & Logs

### PM2 Monitoring
```bash
pm2 status           # Check status
pm2 logs             # View logs
pm2 delete file-upload  # Stop process
pm2 restart file-upload # Restart
```

### Docker Logs
```bash
docker logs container_id
docker logs -f container_id  # Follow logs
docker exec -it container_id /bin/sh  # Shell access
```

---

## Backup & Recovery

### Backup Uploaded Files
```bash
# From server to local
rsync -avz -e ssh ubuntu@your-ip:/path/to/uploads/ ./backup/

# Or use cron for automatic backups
crontab -e
0 2 * * * rsync -avz /var/www/file-upload/uploads/ /backup/
```

### Database Backup (if using MongoDB)
```bash
mongodump --out /backup/
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

**On Ubuntu with Nginx:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**Auto-renewal:**
```bash
sudo systemctl enable certbot.timer
```

---

## Cost Comparison

| Platform | Cost | Difficulty | Best For |
|----------|------|-----------|----------|
| Local | Free | Very Easy | Development |
| Heroku | $7/mo | Easy | Quick deployment |
| Railway | $5-20/mo | Easy | Reliable hosting |
| Replit | Free | Very Easy | Learning |
| AWS EC2 | $5-30/mo | Medium | Scalability |
| DigitalOcean | $5-24/mo | Medium | Full control |
| Docker | Varies | Hard | Enterprise |

---

## Scaling Tips

1. **Use Load Balancer** - Distribute traffic
2. **Horizontal Scaling** - Run multiple instances
3. **Cloud Storage** - Upload to S3, Google Drive
4. **Queue System** - Use Redis for job queue
5. **CDN** - Cache static files
6. **Database** - Store file metadata in DB

---

**Choose a deployment method and go live! 🚀**

Most recommended for beginners: **Railway.app** (easy, free tier available)
