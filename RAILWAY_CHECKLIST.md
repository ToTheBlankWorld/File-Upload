# 🚀 Railway Deployment Checklist

Quick reference for deploying on Railway - **follow in order!**

---

## ✅ Pre-Deployment Checklist

- [ ] Node.js installed locally
- [ ] GitHub account created
- [ ] Railway account created (free at railway.app)
- [ ] Gmail account ready (myn8nuploade@gmail.com)
- [ ] Project files ready in local folder

---

## 📦 Step 1: Prepare GitHub (5 min)

### 1.1 Initialize Git
```bash
cd "d:\Gitam Leaker\N8N Workflows\File Upload Project"
git init
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 1.2 Commit Code
```bash
git add .
git commit -m "Initial commit: file upload system"
```

### 1.3 Create GitHub Repo
- [ ] Go to github.com/new
- [ ] Name: `file-upload-system`
- [ ] Create repository
- [ ] Copy URL: `https://github.com/YOUR_USERNAME/file-upload-system.git`

### 1.4 Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/file-upload-system.git
git push -u origin main
```

✓ **Code is now on GitHub!**

---

## 🌐 Step 2: Deploy Website (10 min)

### 2.1 Create Railway Project
- [ ] Go to railway.app
- [ ] Click **"New Project"**
- [ ] Select **"Deploy from GitHub Repo"**
- [ ] Authorize GitHub
- [ ] Select `file-upload-system` repo
- [ ] Railway auto-builds and deploys!

### 2.2 Set Environment Variables
- [ ] Go to **Variables** tab in Railway
- [ ] Add:
  ```
  PORT=3000
  NODE_ENV=production
  ```
- ⏭️ **DON'T SET N8N_WEBHOOK_URL YET** (we'll do this later)

### 2.3 Get Website URL
- [ ] Railway assigns automatic URL
- [ ] Copy it: `https://your-project-abc.railway.app`
- [ ] Visit URL → Website should load ✓

**Website URL:** `____________________________`

---

## 🤖 Step 3: Deploy n8n (10 min)

### 3.1 Create n8n GitHub Repo
```bash
mkdir n8n-railway
cd n8n-railway
git init
```

### 3.2 Add Files

**File 1: Dockerfile**
```dockerfile
FROM n8nio/n8n
EXPOSE 5678
ENV N8N_SECURE_COOKIE=false
ENV N8N_PROTOCOL=https
ENV N8N_PORT=5678
VOLUME ["/home/node/.n8n"]
CMD ["n8n", "start"]
```

**File 2: .dockerignore**
```
node_modules
.git
```

### 3.3 Push to GitHub
```bash
git add .
git commit -m "n8n self-hosted setup"
git remote add origin https://github.com/YOUR_USERNAME/n8n-railway.git
git push -u origin main
```

### 3.4 Deploy to Railway
- [ ] Go to railway.app
- [ ] Click **"New Project"**
- [ ] Select **"Deploy from GitHub Repo"**
- [ ] Select `n8n-railway` repo
- [ ] Railway detects Docker and deploys!

### 3.5 Wait for n8n to Start
- [ ] Check logs (might take 2-3 minutes)
- [ ] Once running, Railway shows URL
- [ ] Copy it: `https://your-n8n-xyz.railway.app`

**n8n URL:** `____________________________`

---

## 🔗 Step 4: Create n8n Webhook (5 min)

### 4.1 Access n8n Dashboard
- [ ] Visit your n8n URL from Step 3.5
- [ ] First time: Create admin password
- [ ] You're logged in!

### 4.2 Create Webhook
- [ ] Click **"New Workflow"**
- [ ] Add **Webhook** node
- [ ] Settings:
  - [ ] Authentication: None
  - [ ] Method: POST
- [ ] Click **"Execute Workflow"** button
- [ ] Copy the full webhook URL

**Webhook URL:** `____________________________`

---

## 🔄 Step 5: Connect Services (5 min)

### 5.1 Update Website with Webhook URL
- [ ] Go to Railway Dashboard
- [ ] Select **File Upload Website**
- [ ] Go to **Variables**
- [ ] Add variable:
  ```
  N8N_WEBHOOK_URL=<paste your webhook URL from Step 4.2>
  ```
- [ ] Railway auto-redeploys ✓

### 5.2 Verify Connection
```bash
# Test webhook
curl -X POST <your-webhook-url> \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "test@example.com",
    "senderName": "Tester",
    "file": {"filename": "test.txt", "size": 100, "filepath": "/tmp/test.txt", "mimetype": "text/plain"},
    "timestamp": "2024-01-01T00:00:00Z"
  }'
```

✓ **Services are connected!**

---

## 📧 Step 6: Setup n8n Workflow (15 min)

### 6.1 Add Gmail Node
- [ ] In n8n Workflow, add **Gmail** node after Webhook
- [ ] Click **Add Credential**
- [ ] Login with: `myn8nuploade@gmail.com`
- [ ] Grant permissions
- [ ] OAuth complete! ✓

### 6.2 Configure Gmail

Set the following:

| Field | Value |
|-------|-------|
| From Email | myn8nuploade@gmail.com |
| To Email | `{{ $json.recipientEmail }}` |
| Subject | 📎 File: `{{ $json.file.filename }}` |

**HTML Body:**
```html
<h2>File Attachment</h2>
<p>Hi,</p>
<p>{{ $json.senderName }} sent you a file!</p>
<p><strong>File:</strong> {{ $json.file.filename }}<br>
<strong>Size:</strong> {{ ($json.file.size/1024/1024).toFixed(2) }} MB</p>
<p>See the attachment below.</p>
```

### 6.3 (Optional) Add Response Node
- [ ] Add **Set** node
- [ ] Return: `{"status": "success"}`

### 6.4 Test Workflow
- [ ] Go back to Webhook node
- [ ] Click **"Test Webhook"**
- [ ] Fill in test data
- [ ] Execute and check logs ✓

### 6.5 Activate Workflow
- [ ] Click **"Active"** toggle (top right)
- [ ] Workflow is now live! ✓

---

## 🧪 Step 7: Full System Test (5 min)

### 7.1 Test Upload
- [ ] Visit website URL
- [ ] Fill form:
  - [ ] Your Name: Your name
  - [ ] Recipient Email: Your email
  - [ ] Upload file: Any document
- [ ] Click **"Send File"**
- [ ] Should see: "File sent successfully!"

### 7.2 Check Email
- [ ] Open your email inbox
- [ ] Look for email from: `myn8nuploade@gmail.com`
- [ ] Check attachment is there ✓

### 7.3 Check Logs
- [ ] Railway Dashboard → Website service → Logs
- [ ] Should show: "File uploaded" + webhook triggered
- [ ] Railway Dashboard → n8n service → OR n8n Dashboard → Execution logs
- [ ] Should show: Workflow executed, email sent ✓

✓ **Everything works!**

---

## 📊 Monitoring Going Forward

### Weekly Checks
- [ ] Visit website - working?
- [ ] Test upload - receiving emails?
- [ ] Check Railway logs - any errors?
- [ ] Check n8n logs - executions running?

### Monthly Maintenance
- [ ] Update packages: `npm update`
- [ ] Review n8n execution history
- [ ] Check storage usage (file uploads)
- [ ] Verify still have free credits

---

## 🆘 Troubleshooting

### Website won't load
→ Check Railway logs for errors
→ Verify environment variables are set

### Files not sending
→ Check `N8N_WEBHOOK_URL` variable is correct
→ Test webhook URL manually with curl

### n8n won't start
→ Check logs in Railway
→ May take 3-5 minutes to start first time
→ Restart service if hung

### Gmail not authenticating
→ Re-authenticate in n8n credentials
→ Or use app password instead of OAuth

### No emails received
→ Check n8n execution logs
→ Verify recipient email is correct
→ Check spam/junk folder

---

## 💡 Quick Commands

```bash
# Push updates to live (auto-deploys)
git add .
git commit -m "Description of change"
git push origin main

# Check if services running
curl https://your-app.railway.app/health
curl https://your-n8n.railway.app/api/v1/health
```

---

## 📝 Summary of URLs

| Service | URL |
|---------|-----|
| **Website** | __________________________ |
| **n8n Dashboard** | __________________________ |
| **Webhook** | __________________________ |

---

## ✅ Final Verification Checklist

- [ ] Website loads
- [ ] n8n dashboard accessible
- [ ] Webhook URL works
- [ ] Gmail authenticated
- [ ] File upload works
- [ ] Email received with attachment
- [ ] Environment variables set correctly
- [ ] Services auto-restart on Railway
- [ ] GitHub pushes auto-deploy

---

## 🎉 You're Live!

Your file upload system is now running on Railway with:
- ✅ Auto-scaling
- ✅ Auto-deploy on GitHub push
- ✅ Always on (no cold starts)
- ✅ Free tier for small projects
- ✅ Easy to scale up

**Share your website URL with users!**

---

**Need help?** Check `RAILWAY_DEPLOYMENT.md` for detailed steps!
