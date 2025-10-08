import React, { useState, useEffect } from 'react';
import api, { ViewApiRequestsResponse, CompletedAssessmentsResponse } from '../services/api';
import './ApiRequestsList.css';

const ApiRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<ViewApiRequestsResponse | null>(null);
  const [completedAssessments, setCompletedAssessments] = useState<CompletedAssessmentsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'completed'>('requests');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching API requests...');
      const data = await api.viewApiRequests();
      console.log('📊 API Response:', data);
      setRequests(data);
    } catch (err: any) {
      console.error('❌ API Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch API requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedAssessments = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching completed assessments...');
      const data = await api.getCompletedAssessments();
      console.log('📊 Completed Assessments Response:', data);
      setCompletedAssessments(data);
    } catch (err: any) {
      console.error('❌ Completed Assessments Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch completed assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    } else {
      fetchCompletedAssessments();
    }
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="api-requests-list">
      <div className="list-header">
        <h2>📊 View API Requests</h2>
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            API Requests
          </button>
          <button
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Assessments
          </button>
        </div>
      </div>

      <div className="list-actions">
        <button onClick={activeTab === 'requests' ? fetchRequests : fetchCompletedAssessments} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="list-content">
          {activeTab === 'requests' && (
            <div className="requests-table">
              {requests?.data && requests.data.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Registration</th>
                      <th>Partner Reference</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.data.map((request) => (
                      <tr key={request.id}>
                        <td>{request.id}</td>
                        <td>{request.customer_name}</td>
                        <td>{request.customer_phone}</td>
                        <td>{request.customer_email}</td>
                        <td>{request.registration_number}</td>
                        <td>{request.partner_reference}</td>
                        <td>{formatDate(request.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No API requests found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="completed-table">
              {completedAssessments?.data?.assessments && completedAssessments.data.assessments.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Assessment ID</th>
                      <th>Booking Number</th>
                      <th>Customer Name</th>
                      <th>Registration</th>
                      <th>Chassis Number</th>
                      <th>Engine Capacity</th>
                      <th>Manufacture Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedAssessments.data.assessments.map((assessment) => (
                      <tr key={assessment.assessment_id}>
                        <td>{assessment.assessment_id}</td>
                        <td>{assessment.booking_number}</td>
                        <td>{assessment.customer_name}</td>
                        <td>{assessment.registration_number}</td>
                        <td>{assessment.chassis_number}</td>
                        <td>{assessment.engine_capacity}</td>
                        <td>{assessment.manufacture_year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No completed assessments found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiRequestsList;
