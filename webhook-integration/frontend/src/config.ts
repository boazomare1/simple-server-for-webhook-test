// Configuration for the webhook dashboard
export const config = {
  // API Configuration - Your server is running on 127.0.0.1:8001
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8001',
  WEBHOOK_RECEIVER_URL: process.env.REACT_APP_WEBHOOK_RECEIVER_URL || 'https://9bf847bbefac.ngrok-free.app',
};

// Export the webhook receiver URL for easy access
export const WEBHOOK_RECEIVER_URL = config.WEBHOOK_RECEIVER_URL;
