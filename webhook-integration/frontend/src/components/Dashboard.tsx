import React, { useState } from 'react';
import ApiRequestForm from './ApiRequestForm';
import ApiRequestsList from './ApiRequestsList';
import WebhookDashboard from './WebhookDashboard';
import DebugLogin from './DebugLogin';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'requests' | 'webhook' | 'debug'>('debug');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🔗 Webhook Integration Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          📝 Create Request
        </button>
        <button
          className={`nav-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📊 View Requests
        </button>
        <button
          className={`nav-button ${activeTab === 'webhook' ? 'active' : ''}`}
          onClick={() => setActiveTab('webhook')}
        >
          🔔 Webhook Testing
        </button>
        <button
          className={`nav-button ${activeTab === 'debug' ? 'active' : ''}`}
          onClick={() => setActiveTab('debug')}
        >
          🔧 Debug API
        </button>
      </nav>

      <main className="dashboard-main">
        {successMessage && (
          <div className="success-banner">
            {successMessage}
          </div>
        )}

        {activeTab === 'create' && (
          <ApiRequestForm onSuccess={handleSuccess} />
        )}

        {activeTab === 'requests' && (
          <ApiRequestsList />
        )}

        {activeTab === 'webhook' && (
          <WebhookDashboard />
        )}

        {activeTab === 'debug' && (
          <DebugLogin />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
