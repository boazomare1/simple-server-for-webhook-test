// Configuration for the webhook dashboard
export const config = {
  // API Configuration - Your server is running on 127.0.0.1:8001
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8001',
  // Webhook receiver URL - use ngrok for external webhook testing
  WEBHOOK_RECEIVER_URL: process.env.REACT_APP_WEBHOOK_RECEIVER_URL || 'https://2250d40ad5bc.ngrok-free.app',
  // Local backend URL for stats and internal operations
  LOCAL_BACKEND_URL: process.env.REACT_APP_LOCAL_BACKEND_URL || 'http://localhost:3001',
};

// Export the webhook receiver URL for easy access
export const WEBHOOK_RECEIVER_URL = config.WEBHOOK_RECEIVER_URL;
