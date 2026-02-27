# Alternative n8n Workflow Setup

If you prefer to create the workflow manually instead of importing, follow these steps:

## Manual Workflow Creation in n8n

### 1. Create New Workflow
- Click **"New Workflow"** in n8n Dashboard
- Name it: "File Upload to Email"

### 2. Add Webhook Trigger
- Click **"+"** to add node
- Search and select **"Webhook"**
- Configure:
  - **Authentication:** None
  - **Method:** POST
  - Click **"Execute Workflow"**
  - Copy the webhook URL

### 3. Add Gmail Node
- Click **"+"** to add node after Webhook
- Search and select **"Gmail"**
- Click **"Add Credential"** → **"Gmail OAuth2"**
- Sign in with `myn8nuploade@gmail.com`
- Configure Email:

```
From Email:    myn8nuploade@gmail.com
To Email:      {{ $json.recipientEmail }}
Subject:       📎 File Attachment: {{ $json.file.filename }}

HTML Body:
<h2>File Attachment</h2>
<p>Hi,</p>
<p>{{ $json.senderName || "Someone" }} has sent you a file.</p>
<hr>
<p><strong>File Details:</strong><br>
Name: {{ $json.file.filename }}<br>
Size: {{ ($json.file.size / 1024 / 1024).toFixed(2) }} MB<br>
Sent: {{ $json.timestamp }}
</p>
<p>Please find the attachment below.</p>
<p>Best regards,<br>File Upload System</p>

Attachments: {{ $json.file.filepath }}
```

### 4. (Optional) Add Response Node
- Add **"HTTP Request"** node to confirm success
- Or use built-in response

### 5. Test the Workflow

```bash
# From your terminal, test with curl:
curl -X POST http://localhost:5678/webhook/YOUR_ID \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "your-email@gmail.com",
    "senderName": "Test User",
    "file": {
      "filename": "test.pdf",
      "size": 1024000,
      "filepath": "C:/path/to/file.pdf",
      "mimetype": "application/pdf"
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }'
```

### 6. Activate Workflow
- Click the **"Active"** toggle to turn it ON
- Now your workflow is live!

## Important Notes

- **File Path Issue:** n8n runs on the server, so file path must be accessible
- **Alternative - Base64 Encoding:** If attachments don't work, encode file as base64
- **Gmail Limits:** Max 25MB per email
- **Credential Scope:** Make sure "Send Emails" permission is granted

## Using App Password Instead of OAuth

If you want to use Gmail App Password:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → App Passwords
3. Generate password for "Mail"
4. In n8n, create credential with:
   - Email: `myn8nuploade@gmail.com`
   - Password: (use the app password)

## Troubleshooting the Workflow

**Workflow shows error when triggered:**
- Check webhook URL is correctly formatted
- Verify Gmail credentials are valid
- Check file path exists on server

**Email not received:**
- Check spam/junk folder
- Verify "Less secure app access" is enabled for Gmail
- Check email addresses are valid

**"Attachment not found" error:**
- Ensure file path in JSON matches actual location
- Use full absolute path instead of relative
- Check file permissions

---

Ready to use! Activate and test with the file upload website.
