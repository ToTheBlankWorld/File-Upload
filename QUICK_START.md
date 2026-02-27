# 🚀 Quick Start Guide

## Setup in 5 Minutes

### Step 1: Open Terminal
Navigate to the project folder:
```
cd d:\Gitam Leaker\N8N Workflows\File Upload Project
```

### Step 2: Install Dependencies
```
npm install
```
Wait for installation to complete.

### Step 3: Start Server
```
npm start
```
You should see:
```
Server running on http://localhost:3000
```

### Step 4: Open in Browser
Click: http://localhost:3000

### Step 5: Set Up n8n Webhook
While the server is running:

1. Open n8n: `http://localhost:5678`
2. Create a new workflow
3. Add **Webhook** node
4. Copy the webhook URL
5. Update `.env` file with your webhook URL:
   ```
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/YOUR_WEBHOOK_ID
   ```
6. Restart the server (Ctrl+C, then `npm start`)

### Step 6: Configure Gmail in n8n
1. Add **Gmail Credential** in n8n
2. Authenticate with `myn8nuploade@gmail.com`
3. Set the sender email in the Gmail node
4. Activate the workflow

## That's it! ✓

Your file upload system is now live!

## Quick Test

1. Go to http://localhost:3000
2. Enter a recipient email (your email)
3. Upload a small file
4. Click "Send File"
5. Check your inbox for the email with attachment!

## Useful Commands

```bash
# Start the server
npm start

# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port 3000 (if needed)
taskkill /PID <PID> /F
```

## Need Help?

- **Server won't start?** Check if port 3000 is already in use
- **File not sending?** Verify n8n webhook URL in `.env`
- **Email not received?** Check Gmail credentials in n8n
- **Can't access http://localhost:3000?** Make sure `npm start` is running

---

**Now test it!** Open your browser and go to http://localhost:3000
