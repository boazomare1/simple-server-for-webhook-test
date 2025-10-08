const axios = require('axios');

const WEBHOOK_URL = 'https://9bf847bbefac.ngrok-free.app/webhook';

const testPayload = {
  booking_no: 'LV_TEST_001',
  status: 'completed',
  assessment_id: 12345,
  reg_no: 'KCA 999T',
  completion_date: new Date().toISOString(),
  pdf_url: 'https://portal.linksvaluers.com/pdf-report/LV_TEST_001',
  partner_reference: `TEST_REF_${Date.now()}`,
  customer_name: 'Test Customer',
  insurance_company: 'PACIS Insurance',
  policy_number: 'POLICY_TEST_001'
};

async function testWebhook() {
  try {
    console.log('🧪 Testing webhook receiver...');
    console.log('📤 Sending payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await axios.post(WEBHOOK_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Webhook test successful!');
    console.log('📊 Response:', response.data);
    console.log('🔗 Dashboard: https://9bf847bbefac.ngrok-free.app');
    
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
    if (error.response) {
      console.error('📊 Response data:', error.response.data);
    }
  }
}

testWebhook();

