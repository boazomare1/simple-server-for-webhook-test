const axios = require('axios');

// Test the same login that works in Postman
async function testLogin() {
  const baseUrl = 'http://localhost:8000'; // This is what the React app is using
  const loginData = {
    email: 'partner@completeworkflow.com',
    password: 'password123'
  };

  console.log('🧪 Testing login with React app configuration...');
  console.log('📤 Base URL:', baseUrl);
  console.log('📤 Login data:', loginData);

  try {
    const response = await axios.post(`${baseUrl}/api/get-token`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log('📊 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('📊 Error:', error.message);
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📊 Response data:', error.response.data);
    } else if (error.request) {
      console.error('📊 No response received. Is the server running?');
      console.error('📊 Request details:', error.request);
    }
  }
}

testLogin();

