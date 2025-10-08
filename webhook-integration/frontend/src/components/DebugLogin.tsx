import React, { useState } from 'react';
import axios from 'axios';
import './DebugLogin.css';

const DebugLogin: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('http://127.0.0.1:8001');
  const [email, setEmail] = useState('partner@completeworkflow.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing connection to:', baseUrl);
      const response = await axios.post(`${baseUrl}/api/get-token`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      setResult({
        success: true,
        status: response.status,
        data: response.data,
        url: `${baseUrl}/api/get-token`
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${baseUrl}/api/get-token`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="debug-login">
      <div className="debug-header">
        <h2>🔧 API Connection Debugger</h2>
        <p>Test different API URLs to find the correct one</p>
      </div>

      <div className="debug-form">
        <div className="form-group">
          <label htmlFor="baseUrl">API Base URL</label>
          <input
            type="text"
            id="baseUrl"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://127.0.0.1:8001"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={testConnection} disabled={loading} className="test-btn">
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {result && (
        <div className="result">
          <h3>Test Result:</h3>
          <div className={`result-card ${result.success ? 'success' : 'error'}`}>
            <div className="result-header">
              <span className="status">{result.success ? '✅ Success' : '❌ Failed'}</span>
              <span className="url">{result.url}</span>
            </div>
            
            {result.success ? (
              <div className="result-data">
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Access Token:</strong> {result.data.access_token?.substring(0, 20)}...</p>
                <p><strong>Token Type:</strong> {result.data.token_type}</p>
              </div>
            ) : (
              <div className="result-data">
                <p><strong>Error:</strong> {result.error}</p>
                <p><strong>Status:</strong> {result.status}</p>
                {result.data && (
                  <p><strong>Response:</strong> {JSON.stringify(result.data)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="common-urls">
        <h3>Common API URLs to try:</h3>
        <div className="url-list">
          <button onClick={() => setBaseUrl('http://127.0.0.1:8001')}>
            http://127.0.0.1:8001
          </button>
          <button onClick={() => setBaseUrl('http://localhost:8001')}>
            http://localhost:8001
          </button>
          <button onClick={() => setBaseUrl('http://127.0.0.1:8000')}>
            http://127.0.0.1:8000
          </button>
          <button onClick={() => setBaseUrl('http://localhost:8000')}>
            http://localhost:8000
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugLogin;

