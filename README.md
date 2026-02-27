# File Upload Website with n8n Email Integration

A complete file upload system that allows users to upload files and automatically send them to recipients' emails using n8n automation and Gmail.

## Features

✨ **Modern Web Interface** - Beautiful, responsive UI for file uploads  
📤 **Drag & Drop Support** - Easy file upload with drag and drop  
📧 **Email Integration** - Sends files as email attachments via Gmail  
🔐 **Secure** - File validation and size limits (50MB max)  
⚡ **Fast** - Built with Express.js and optimized for performance  
📱 **Mobile Responsive** - Works great on all devices  

## Project Structure

```
File Upload Project/
├── server.js                 # Node.js/Express backend
├── package.json              # Project dependencies
├── .env                       # Environment configuration
├── n8n-workflow.json         # n8n automation workflow
├── public/
│   └── index.html            # Frontend UI
└── uploads/                  # Temporary file storage (auto-created)
```

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **n8n** (v0.200+) - [Installation Guide](https://docs.n8n.io/hosting/installation/)
- **Gmail Account** - For sending emails

## Installation & Setup

### 1. Install Node.js Dependencies

```bash
cd "d:\Gitam Leaker\N8N Workflows\File Upload Project"
npm install
```

This installs:
- `express` - Web server framework
- `multer` - File upload handling
- `cors` - Cross-origin support
- `axios` - HTTP client for n8n webhook
- `dotenv` - Environment variable management

### 2. Configure Environment Variables

Edit `.env` file with your settings:

```env
PORT=3000
N8N_WEBHOOK_URL=http://localhost:5678/webhook/file-upload
```

**Key Variables:**
- `PORT` - Server port (default: 3000)
- `N8N_WEBHOOK_URL` - Your n8n webhook URL

### 3. Set Up n8n Webhook

In your n8n instance:

1. Create **New Workflow**
2. Add **Webhook Node** (Webhook trigger)
3. Set Authentication: `None`
4. Copy the webhook URL and update `.env` with it

### 4. Configure Gmail Integration in n8n

1. In n8n, add **Gmail Node** to your workflow
2. Click **Add Gmail Credential**
3. Authenticate with your Gmail account: `myn8nuploade@gmail.com`
4. Set up as shown in `n8n-workflow.json`

**Important:** Enable "Less secure app access" or use [App Password](https://support.google.com/accounts/answer/185833):
- Go to [myaccount.google.com](https://myaccount.google.com)
- Security → App Passwords → Generate for Mail

### 5. Create n8n Workflow

Use the provided `n8n-workflow.json`:

1. In n8n Dashboard, click **Import**
2. Select the `n8n-workflow.json` file
3. Configure your **Gmail credentials**
4. Activate the workflow

**Workflow Steps:**
- ✓ Webhook receives file upload request
- ✓ Email node sends file as attachment
- ✓ Success response returned

### 6. Start the Server

```bash
npm start
```

Output should show:
```
Server running on http://localhost:3000
n8n Webhook URL: http://localhost:5678/webhook/file-upload
```

## Usage

### For Users

1. Open `http://localhost:3000` in browser
2. Enter recipient email address
3. (Optional) Enter your name
4. Select or drag-drop a file
5. Click **Send File**
6. File sent successfully! ✓

### File Upload Flow

```
User Upload → Node.js Server → File Storage → n8n Webhook
     ↓
Email Sent → Gmail → Recipient's Inbox (with attachment)
```

## Configuration Examples

### Using Different Email Provider

**SendGrid Alternative:**
```javascript
// Replace Gmail node with SendGrid node
// Update credentials and email template
```

**Outlook/Office365:**
```javascript
// Use Outlook node instead of Gmail
// Configure Microsoft credentials
```

## Troubleshooting

### "Connection refused" on localhost:5678
- Ensure n8n is running: `n8n start`
- Check n8n is on port 5678

### "Error sending email"
- Verify Gmail credentials in n8n
- Check "Less secure app" is enabled
- Verify recipient email is correct

### "File not found"
- Ensure `uploads/` directory exists
- Check file permissions on the server
- Verify file path in n8n workflow

### Large File Issues
- Current limit: 50MB
- Edit `server.js` line to increase:
  ```javascript
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
  ```

## API Reference

### POST `/upload`

**Request:**
```javascript
{
  "file": File,                    // File object
  "recipientEmail": "email@here",  // Required
  "senderName": "John Doe"         // Optional
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "File uploaded and sent successfully",
  "file": "filename.pdf",
  "recipientEmail": "user@example.com"
}
```

## Security Notes

⚠️ **For Production:**
- Use environment variables for sensitive data
- Implement authentication for upload endpoint
- Use HTTPS/SSL certificates
- Set up rate limiting
- Validate file types on server
- Clean up old temp files regularly
- Use secure file storage (S3, Google Drive, etc.)

## File Limits

- **Max Size:** 50MB (configurable)
- **Allowed Types:** All (configure in multer fileFilter)
- **Storage:** Local `uploads/` directory (temp)

## Customization

### Change Email Template
Edit the `htmlText` in n8n Gmail node:
```html
<h2>Custom Header</h2>
<p>Your custom message here</p>
<p>File: {{ $node.Webhook.json.file.filename }}</p>
```

### Add File Type Validation
In `server.js`:
```javascript
fileFilter: (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'application/msword'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
}
```

### Change UI Styling
Modify CSS in `public/index.html` inside `<style>` tag

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `N8N_WEBHOOK_URL` | http://localhost:5678/webhook/file-upload | n8n webhook URL |

## Running on Different Machines

**On Network:**
```bash
# Server listens on all interfaces
# Access from: http://YOUR_IP:3000
```

**Docker Support (Optional):**
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

## Support & Troubleshooting

1. Check server logs: `npm start` output
2. Verify file permissions
3. Check n8n webhook is active
4. Validate email credentials
5. Test with sample file first

## License

MIT - Free to use and modify

---

**Ready to use!** 🚀 Start with `npm start` and open `http://localhost:3000`
