const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store webhook data in memory
let webhookData = [];
let stats = {
  total: 0,
  successful: 0,
  failed: 0,
  lastReceived: null
};

// Webhook receiver endpoint
app.post('/webhook', (req, res) => {
  try {
    const webhookPayload = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: req.body,
      headers: req.headers,
      ip: req.ip
    };

    webhookData.unshift(webhookPayload); // Add to beginning
    webhookData = webhookData.slice(0, 100); // Keep only last 100 webhooks

    // Update stats
    stats.total++;
    stats.successful++;
    stats.lastReceived = new Date().toISOString();

    console.log('✅ Webhook received:', JSON.stringify(webhookPayload.data, null, 2));
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully',
      id: webhookPayload.id
    });
  } catch (error) {
    stats.failed++;
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Webhook processing failed',
      error: error.message 
    });
  }
});

// Get webhook data
app.get('/api/webhooks', (req, res) => {
  res.json(webhookData);
});

// Get statistics
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

// Clear webhook data
app.delete('/api/webhooks', (req, res) => {
  webhookData = [];
  stats = {
    total: 0,
    successful: 0,
    failed: 0,
    lastReceived: null
  };
  res.json({ message: 'Webhook data cleared' });
});

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook receiver server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook`);
});

