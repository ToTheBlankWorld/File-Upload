# 🚀 Railway Deployment Guide (Website + n8n)

Deploy your **File Upload Website + n8n** completely on Railway!

---

## 📋 Prerequisites

1. **GitHub Account** - For code repository
2. **Railway Account** - [Sign up free](https://railway.app)
3. **Your Project Code** - Already created

---

## 🎯 Overview

You'll deploy **2 services** on Railway:

```
┌─────────────────────────────────────────────┐
│           Railway Project                    │
├─────────────────────────────────────────────┤
│  Service 1: File Upload Website              │
│  ├─ URL: your-app.railway.app               │
│  └─ Port: 3000                              │
│                                              │
│  Service 2: n8n (Self-Hosted)                │
│  ├─ URL: your-n8n.railway.app               │
│  └─ Port: 5678                              │
│                                              │
│  ✓ Connected via internal Railway network   │
└─────────────────────────────────────────────┘
```

---

## ✅ Part 1: Prepare GitHub Repository

### Step 1: Initialize Git (if not done)

Go to your project folder:
```bash
cd "d:\Gitam Leaker\N8N Workflows\File Upload Project"
```

Initialize git:
```bash
git init
git config user.name "Your Name"
git config user.email "your-email@gmail.com"
```

### Step 2: Add & Commit Files

```bash
git add .
git commit -m "Initial commit: File upload system"
```

### Step 3: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `file-upload-system`
3. Click **Create Repository**
4. Follow the instructions to push:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/file-upload-system.git
git push -u origin main
```

Now your code is on GitHub! ✓

---

## 🌐 Part 2: Deploy Website to Railway

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub Repo"**

### Step 2: Select Repository

1. Click **"Configure GitHub App"**
2. Authorize Railway
3. Select your `file-upload-system` repo
4. Click **"Deploy"**

Railway will auto-detect Node.js and install dependencies!

### Step 3: Configure Environment Variables

1. Go to **"Variables"** tab
2. Add these variables:

```
PORT=3000
N8N_WEBHOOK_URL=https://YOUR_N8N_URL/webhook/file-upload
NODE_ENV=production
```

**Don't know N8N_WEBHOOK_URL yet?** We'll set it after deploying n8n.

### Step 4: Get Your Website URL

- Railway assigns automatic URL: `your-project-abc123.railway.app`
- Visit it → Your website is live! ✓
- Save this URL for later

**Example:** `https://file-upload-9xk2.railway.app`

---

## 🤖 Part 3: Deploy n8n to Railway (Self-Hosted)

### Option A: Using Docker (Recommended)

#### Step 1: Create n8n Repository

Create a new GitHub repo named `n8n-railway`:

```bash
mkdir n8n-railway
cd n8n-railway
git init
```

#### Step 2: Create Dockerfile

Create file named `Dockerfile`:

```dockerfile
FROM n8nio/n8n

EXPOSE 5678

ENV N8N_SECURE_COOKIE=false
ENV N8N_PROTOCOL=https
ENV N8N_HOST=YOUR_N8N_DOMAIN.railway.app
ENV N8N_PORT=5678
ENV N8N_EDITOR_BASE_URL=https://YOUR_N8N_DOMAIN.railway.app/
ENV N8N_WEBHOOK_TUNNEL_URL=https://YOUR_N8N_DOMAIN.railway.app/

# Optional: Database persistence
# This uses SQLite by default, stored in /home/node/.n8n
VOLUME ["/home/node/.n8n"]

CMD ["n8n", "start"]
```

#### Step 3: Create docker-compose.yml

For local testing:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_SECURE_COOKIE=false
      - N8N_PROTOCOL=http
      - N8N_HOST=localhost
      - N8N_PORT=5678
    volumes:
      - n8n_storage:/home/node/.n8n

volumes:
  n8n_storage:
```

#### Step 4: Push to GitHub

```bash
git add .
git commit -m "Initial n8n setup"
git remote add origin https://github.com/YOUR_USERNAME/n8n-railway.git
git push -u origin main
```

#### Step 5: Deploy to Railway

1. Go to Railway → **New Project**
2. Select GitHub repo: `n8n-railway`
3. Railway detects Docker automatically
4. Click **Deploy**

### Option B: Direct n8n Deployment (Simpler)

If you prefer simpler setup without Docker:

1. Create `package.json`:
```json
{
  "name": "n8n-railway",
  "version": "1.0.0",
  "scripts": {
    "start": "n8n start"
  },
  "dependencies": {
    "n8n": "latest"
  }
}
```

2. Create `Procfile`:
```
web: npm start
```

3. Push to GitHub and deploy same way

---

## 🔗 Part 4: Connect Website ↔ n8n

### Step 1: Get n8n URL

After n8n deployment completes:
- Railway assigns URL: `your-n8n-abc.railway.app`
- This is your n8n instance!

**Example:** `https://n8n-file-upload-xyz.railway.app`

### Step 2: Access n8n Dashboard

1. Visit: `https://your-n8n-abc.railway.app`
2. First time: Create admin password
3. You're in! ✓

### Step 3: Create Webhook in n8n

1. **New Workflow**
2. Add **Webhook** node
3. Set:
   - Authentication: None
   - Method: POST
4. Click "Test" or "Execute Workflow"
5. Copy the full webhook URL (shown at bottom)

**Example:** `https://your-n8n-abc.railway.app/webhook/WORKFLOW_ID/trigger`

### Step 4: Update Website Configuration

1. Go to **Railway Dashboard**
2. Select **File Upload Website** service
3. Go to **Variables**
4. Update:
   ```
   N8N_WEBHOOK_URL=https://your-n8n-abc.railway.app/webhook/WORKFLOW_ID/trigger
   ```
5. Railway auto-redeploys! ✓

### Step 5: Test Connection

```bash
# From your terminal, test the webhook:
curl -X POST https://your-n8n-abc.railway.app/webhook/WORKFLOW_ID/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "your-email@gmail.com",
    "senderName": "Test",
    "file": {
      "filename": "test.txt",
      "size": 1024,
      "filepath": "/tmp/test.txt",
      "mimetype": "text/plain"
    },
    "timestamp": "2024-01-27T12:00:00Z"
  }'
```

---

## ⚙️ Part 5: Configure n8n Workflow

### Option 1: Import Workflow (Easy)

1. In n8n Dashboard: Click **Import**
2. Select `n8n-workflow.json` from your project
3. Configure Gmail credentials
4. Activate workflow ✓

### Option 2: Create Manually

1. **New Workflow**
2. Add nodes:
   - **Webhook** (trigger)
   - **Gmail** (send email)
   - **Set** (response)

**Gmail Node Configuration:**
```
From: myn8nuploade@gmail.com
To: {{ $json.recipientEmail }}
Subject: 📎 File Attachment: {{ $json.file.filename }}

Body (HTML):
<h2>File Attachment</h2>
<p>Hi,</p>
<p>{{ $json.senderName }} sent you a file!</p>
<p><strong>File:</strong> {{ $json.file.filename }}<br>
<strong>Size:</strong> {{ ($json.file.size/1024/1024).toFixed(2) }} MB</p>
<p>See attachment below.</p>
```

4. Test and activate ✓

---

## 📧 Part 6: Gmail Authentication in n8n

### On Railway n8n Instance:

1. Go to **Credentials** → **New** → **Gmail**
2. Click **OAuth2 Connection**
3. Click **"Connect my account"**
4. Sign in with: `myn8nuploade@gmail.com`
5. Grant permissions
6. Done! ✓

### Alternative: Use Gmail App Password

If OAuth doesn't work:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification
3. Scroll down → **App Passwords**
4. Select: Mail, Windows Computer
5. Copy generated password
6. In n8n Gmail credential:
   - Email: `myn8nuploade@gmail.com`
   - Password: (paste app password)
   - SMTP: smtp.gmail.com:587

---

## 🧪 Part 7: End-to-End Test

### Test Flow:

1. **Open website:** `https://your-app-xyz.railway.app`
2. **Upload file** with test recipient email
3. **Check logs** in Railway
4. **Check n8n** execution logs
5. **Check email** inbox ✓

### Monitoring:

**Website Service:**
- Railway Dashboard → File Upload service
- Click **"Logs"** to see Node.js output
- Shows: file received, webhook triggered, responses

**n8n Service:**
- Railway Dashboard → n8n service
- Click **"Logs"** to see n8n activity
- Or in n8n Dashboard → Execution History

---

## 🔐 Part 8: Security & Environment

### Recommended Environment Variables

**Website Service:**
```
PORT=3000
NODE_ENV=production
N8N_WEBHOOK_URL=https://your-n8n.railway.app/webhook/WORKFLOW_ID
CORS_ORIGIN=https://your-app.railway.app
```

**n8n Service:**
```
N8N_SECURE_COOKIE=true
N8N_PROTOCOL=https
N8N_HOST=your-n8n.railway.app
N8N_ENCRYPTION_KEY=your-secure-random-key
N8N_DB_TYPE=sqlite
```

### Database for n8n

By default: **SQLite** (file-based)
- Persists in `/home/node/.n8n`
- Good for small projects

For production with multiple instances:
- Add **PostgreSQL** service in Railway
- Update n8n environment variables

---

## 💾 Part 9: File Storage

### Current Setup:
- Files stored in `/uploads` directory
- Temporary storage (cleaned up)
- Good for small/medium load

### For Production:
Consider moving to cloud storage:

**Option 1: AWS S3**
```bash
npm install aws-sdk
```

Update `server.js` to upload to S3 instead of local directory.

**Option 2: Railway Volumes** (Easy!)

Add volume to website service in Railway:
```
/uploads:/mnt/uploads
```
This persists uploaded files.

**Option 3: Google Cloud Storage**
- Create bucket
- Store files there instead
- Cost: ~$0.02/GB

---

## 📊 Part 10: Monitoring & Logs

### Railway Dashboard

**Website Service → Logs:**
```
Server running on http://localhost:3000
File uploaded: document.pdf
Webhook triggered: https://your-n8n...
```

**n8n Service → Logs:**
```
n8n started
Workflow executed
Email sent: user@example.com
```

### Check Status

```bash
# Check if services are running
curl https://your-app-xyz.railway.app/health
# Should return: {"status": "Server is running"}

# Test n8n
curl https://your-n8n-xyz.railway.app/api/v1/health
```

---

## 💰 Cost on Railway

| Component | Tier | Cost/Month |
|-----------|------|-----------|
| File Upload Website | Hobby ($5 credit/month) | Free* |
| n8n Service | Hobby | Free* |
| Database (PostgreSQL) | Optional | $15+ |
| **Total** | | **Free-$15/mo** |

*Free tier: $5/month credit (covers both services)

Paid plans:
- Standard: $20/month usage + costs
- Pro: $50/month + costs

---

## 🔄 Part 11: Auto-Deploy on Push

Railway auto-deploys when you push to GitHub!

```bash
# Make changes locally
cd d:\Gitam Leaker\N8N Workflows\File Upload Project
# ... edit files ...

# Push to GitHub
git add .
git commit -m "Update email template"
git push origin main

# Railway automatically redeploys! ✓
# Check Railway logs to confirm
```

---

## ⚡ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Website can't connect to n8n | Check webhook URL in Railway variables |
| n8n webhook returns 404 | Verify webhook path in n8n node |
| Gmail not sending | Check OAuth credentials in n8n |
| Files not uploading | Check `/uploads` directory permissions |
| Services won't start | Check logs in Railway dashboard |

---

## 📱 Access Your Services

**After everything is deployed:**

| Service | URL |
|---------|-----|
| Website | `https://your-app-xyz.railway.app` |
| n8n | `https://your-n8n-xyz.railway.app` |
| n8n Webhook | `https://your-n8n-xyz.railway.app/webhook/WORKFLOW_ID` |

---

## 🎉 You're Done!

Your complete system is now live on Railway:
- ✅ Website hosted and accessible
- ✅ n8n self-hosted and running
- ✅ Webhook connected
- ✅ Email automation working
- ✅ Auto-deployed on code push

**Next Steps:**
1. Share your website URL with users
2. Monitor logs regularly
3. Keep dependencies updated
4. Add custom domain (optional)

---

## 📚 Useful Links

- [Railway Docs](https://docs.railway.app)
- [n8n Docs](https://docs.n8n.io)
- [n8n on Docker](https://docs.n8n.io/hosting/environments/docker/)
- [Gmail Node in n8n](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail)

---

**Everything running on Railway, zero server management needed!** 🚀
