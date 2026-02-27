const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { recipientEmail, senderName } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    // Read file and convert to base64
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileBase64 = fileBuffer.toString('base64');

    // Prepare file data for n8n
    const fileData = {
      filename: req.file.originalname,
      data: fileBase64,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    // Trigger n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/file-upload';

    const payload = {
      recipientEmail: recipientEmail,
      senderName: senderName || 'File Upload System',
      file: fileData,
      timestamp: new Date().toISOString()
    };

    console.log('Triggering n8n webhook with payload:', payload);

    const response = await axios.post(n8nWebhookUrl, payload, {
      timeout: 30000
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded and sent successfully',
      file: req.file.originalname,
      recipientEmail: recipientEmail
    });

  } catch (error) {
    console.error('Error processing upload:', error.message);

    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      error: 'Failed to process upload',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`n8n Webhook URL: ${process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/file-upload'}`);
});
