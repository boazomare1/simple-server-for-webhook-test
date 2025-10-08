import React, { useState, useEffect } from 'react';
import api, { WebhookStats, WebhookTestPayload } from '../services/api';
import './WebhookDashboard.css';

const WebhookDashboard: React.FC = () => {
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [testPayload, setTestPayload] = useState<WebhookTestPayload>({
    booking_no: 'LV_TEST_001',
    status: 'completed',
    assessment_id: 12345,
    reg_no: 'KCA 999T',
    completion_date: new Date().toISOString(),
    pdf_url: 'https://portal.linksvaluers.com/pdf-report/LV_TEST_001',
    partner_reference: `TEST_REF_${Date.now()}`,
    customer_name: 'Test Customer',
    insurance_company: 'PACIS Insurance',
    policy_number: 'POLICY_TEST_001',
  });

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getWebhookStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch webhook statistics');
    } finally {
      setLoading(false);
    }
  };

  const testWebhookReceiver = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      console.log('🧪 Testing webhook receiver with payload:', testPayload);
      console.log('🔗 Webhook URL:', api.getWebhookReceiverUrl());
      const result = await api.testWebhookReceiver(testPayload);
      console.log('✅ Webhook test result:', result);
      setSuccessMessage('✅ Webhook receiver test successful! Check the dashboard for the received data.');
      fetchStats(); // Refresh stats after successful test
    } catch (err: any) {
      console.error('❌ Webhook test error:', err);
      setError(err.message || err.response?.data?.message || 'Webhook test failed. Please check your webhook receiver URL.');
    } finally {
      setLoading(false);
    }
  };

  const simulateAssessmentCompletion = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await api.simulateAssessmentCompletion(testPayload.booking_no);
      setSuccessMessage('✅ Assessment completion simulated! Webhook should be triggered - check dashboard!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Simulation failed. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  const testWebhookEndpoint = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const callbackUrl = `${api.getWebhookReceiverUrl()}/webhook`;
      await api.testWebhookEndpoint(callbackUrl, testPayload.booking_no);
      setSuccessMessage('✅ Webhook endpoint test successful!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Webhook endpoint test failed.');
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = () => {
    const randomId = Math.floor(Math.random() * 10000);
    setTestPayload({
      booking_no: `LV_TEST_${randomId}`,
      status: 'completed',
      assessment_id: randomId,
      reg_no: `KCA ${Math.floor(Math.random() * 1000)}T`,
      completion_date: new Date().toISOString(),
      pdf_url: `https://portal.linksvaluers.com/pdf-report/LV_TEST_${randomId}`,
      partner_reference: `TEST_REF_${Date.now()}`,
      customer_name: `Test Customer ${randomId}`,
      insurance_company: 'PACIS Insurance',
      policy_number: `POLICY_TEST_${randomId}`,
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="webhook-dashboard">
      <div className="dashboard-header">
        <h2>🔔 Webhook Testing Dashboard</h2>
        <p>Test webhook functionality and view statistics</p>
      </div>

      <div className="dashboard-content">
        {/* Statistics Section */}
        <div className="stats-section">
          <div className="section-header">
            <h3>📊 Webhook Statistics</h3>
            <button onClick={fetchStats} className="refresh-btn" disabled={loading}>
              🔄 Refresh
            </button>
          </div>
          
          {loading && !stats ? (
            <div className="loading">Loading statistics...</div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Webhooks</div>
              </div>
              <div className="stat-card success">
                <div className="stat-number">{stats.successful}</div>
                <div className="stat-label">Successful</div>
              </div>
              <div className="stat-card error">
                <div className="stat-number">{stats.failed}</div>
                <div className="stat-label">Failed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {stats.lastReceived ? new Date(stats.lastReceived).toLocaleString() : 'Never'}
                </div>
                <div className="stat-label">Last Received</div>
              </div>
            </div>
          ) : (
            <div className="no-stats">No statistics available</div>
          )}
        </div>

        {/* Test Payload Section */}
        <div className="test-payload-section">
          <div className="section-header">
            <h3>🧪 Test Payload Configuration</h3>
            <button onClick={generateTestData} className="generate-btn">
              🎲 Generate Test Data
            </button>
          </div>
          
          <div className="payload-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking_no">Booking Number</label>
                <input
                  type="text"
                  id="booking_no"
                  value={testPayload.booking_no}
                  onChange={(e) => setTestPayload(prev => ({ ...prev, booking_no: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={testPayload.status}
                  onChange={(e) => setTestPayload(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customer_name">Customer Name</label>
                <input
                  type="text"
                  id="customer_name"
                  value={testPayload.customer_name}
                  onChange={(e) => setTestPayload(prev => ({ ...prev, customer_name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg_no">Registration Number</label>
                <input
                  type="text"
                  id="reg_no"
                  value={testPayload.reg_no}
                  onChange={(e) => setTestPayload(prev => ({ ...prev, reg_no: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="assessment_id">Assessment ID</label>
                <input
                  type="number"
                  id="assessment_id"
                  value={testPayload.assessment_id}
                  onChange={(e) => setTestPayload(prev => ({ ...prev, assessment_id: parseInt(e.target.value) }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="policy_number">Policy Number</label>
                <input
                  type="text"
                  id="policy_number"
                  value={testPayload.policy_number}
                  onChange={(e) => setTestPayload(prev => ({ ...prev, policy_number: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test Actions Section */}
        <div className="test-actions-section">
          <div className="section-header">
            <h3>🎯 Test Actions</h3>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={testWebhookReceiver} 
              disabled={loading}
              className="action-btn primary"
            >
              🔔 Test Webhook Receiver
            </button>
            
            <button 
              onClick={simulateAssessmentCompletion} 
              disabled={loading}
              className="action-btn secondary"
            >
              🎭 Simulate Assessment Completion
            </button>
            
            <button 
              onClick={testWebhookEndpoint} 
              disabled={loading}
              className="action-btn tertiary"
            >
              🔗 Test Webhook Endpoint
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default WebhookDashboard;
