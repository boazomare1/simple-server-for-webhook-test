import React, { useState } from 'react';
import api from '../services/api';
import './ApiRequestForm.css';

interface ApiRequestFormProps {
  onSuccess: (message: string) => void;
}

const ApiRequestForm: React.FC<ApiRequestFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    registration_number: '',
    customer_email: '',
    policy_number: '',
    insurance_company: 'PACIS Insurance',
    partner_reference: `DIRECT_TEST_${Date.now()}`,
  });

  const [requestType, setRequestType] = useState<'direct' | 'broker'>('direct');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logBookFile, setLogBookFile] = useState<File | null>(null);
  const [insuranceCertificateFile, setInsuranceCertificateFile] = useState<File | null>(null);
  const [customInsuranceCompany, setCustomInsuranceCompany] = useState('');
  const [useCustomInsurance, setUseCustomInsurance] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'log_book' | 'insurance_certificate') => {
    const file = e.target.files?.[0] || null;
    if (fileType === 'log_book') {
      setLogBookFile(file);
    } else {
      setInsuranceCertificateFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const callbackUrl = `${api.getWebhookReceiverUrl()}/webhook`;
      
      // Use custom insurance company if selected
      const finalFormData = {
        ...formData,
        insurance_company: useCustomInsurance ? customInsuranceCompany : formData.insurance_company,
      };
      
      if (requestType === 'direct') {
        await api.createDirectApiRequest({
          ...finalFormData,
          callback_url: callbackUrl,
        });
        onSuccess('✅ Direct API Request created successfully! Check your webhook receiver dashboard for updates.');
      } else {
        await api.createBrokerApiRequest({
          ...finalFormData,
          callback_url: callbackUrl,
          log_book: logBookFile || undefined,
          insurance_certificate: insuranceCertificateFile || undefined,
        });
        onSuccess('✅ Broker API Request created successfully! Check your webhook receiver dashboard for updates.');
      }
      
      // Reset form
      setFormData({
        customer_name: '',
        customer_phone: '',
        registration_number: '',
        customer_email: '',
        policy_number: '',
        insurance_company: 'PACIS Insurance',
        partner_reference: `DIRECT_TEST_${Date.now()}`,
      });
      setLogBookFile(null);
      setInsuranceCertificateFile(null);
      setCustomInsuranceCompany('');
      setUseCustomInsurance(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create API request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = () => {
    setFormData({
      customer_name: `Test Customer ${Date.now()}`,
      customer_phone: `+2547${Math.floor(Math.random() * 10000000)}`,
      registration_number: `KCA ${Math.floor(Math.random() * 1000)}T`,
      customer_email: `test${Date.now()}@example.com`,
      policy_number: `POLICY_${Date.now()}`,
      insurance_company: requestType === 'broker' ? 'LAMI Insurance' : 'PACIS Insurance',
      partner_reference: `${requestType.toUpperCase()}_TEST_${Date.now()}`,
    });
  };

  return (
    <div className="api-request-form">
      <div className="form-header">
        <h2>📝 Create API Request</h2>
        <p>Create a new API request for vehicle assessment</p>
      </div>

      <div className="request-type-selector">
        <label>
          <input
            type="radio"
            name="requestType"
            value="direct"
            checked={requestType === 'direct'}
            onChange={(e) => setRequestType(e.target.value as 'direct' | 'broker')}
          />
          <span>Direct Integration (No Certificate Required)</span>
        </label>
        <label>
          <input
            type="radio"
            name="requestType"
            value="broker"
            checked={requestType === 'broker'}
            onChange={(e) => setRequestType(e.target.value as 'direct' | 'broker')}
          />
          <span>Broker Integration (Certificate Required)</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customer_name">Customer Name *</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              required
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="customer_phone">Customer Phone *</label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleInputChange}
              required
              placeholder="+254712345678"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="registration_number">Registration Number *</label>
            <input
              type="text"
              id="registration_number"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleInputChange}
              required
              placeholder="KCA 123T"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="customer_email">Customer Email *</label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleInputChange}
              required
              placeholder="customer@example.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="policy_number">Policy Number *</label>
            <input
              type="text"
              id="policy_number"
              name="policy_number"
              value={formData.policy_number}
              onChange={handleInputChange}
              required
              placeholder="POLICY_123456"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="insurance_company">Insurance Company *</label>
            <div className="insurance-company-section">
              <div className="insurance-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="insurance_type"
                    value="preset"
                    checked={!useCustomInsurance}
                    onChange={() => setUseCustomInsurance(false)}
                  />
                  <span>Select from list</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="insurance_type"
                    value="custom"
                    checked={useCustomInsurance}
                    onChange={() => setUseCustomInsurance(true)}
                  />
                  <span>Enter custom name</span>
                </label>
              </div>
              
              {!useCustomInsurance ? (
                <select
                  id="insurance_company"
                  name="insurance_company"
                  value={formData.insurance_company}
                  onChange={handleInputChange}
                  required
                >
                  <option value="PACIS Insurance">PACIS Insurance</option>
                  <option value="LAMI Insurance">LAMI Insurance</option>
                  <option value="Jubilee Insurance">Jubilee Insurance</option>
                  <option value="CIC Insurance">CIC Insurance</option>
                  <option value="APA Insurance">APA Insurance</option>
                </select>
              ) : (
                <input
                  type="text"
                  id="custom_insurance_company"
                  name="custom_insurance_company"
                  value={customInsuranceCompany}
                  onChange={(e) => setCustomInsuranceCompany(e.target.value)}
                  placeholder="Enter insurance company name"
                  required
                />
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="partner_reference">Partner Reference</label>
          <input
            type="text"
            id="partner_reference"
            name="partner_reference"
            value={formData.partner_reference}
            onChange={handleInputChange}
            placeholder="Your reference number"
          />
        </div>

        {requestType === 'broker' && (
          <div className="file-uploads">
            <div className="form-group">
              <label htmlFor="log_book">Log Book (PDF)</label>
              <input
                type="file"
                id="log_book"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'log_book')}
              />
              {logBookFile && <span className="file-name">Selected: {logBookFile.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="insurance_certificate">Insurance Certificate (PDF)</label>
              <input
                type="file"
                id="insurance_certificate"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'insurance_certificate')}
              />
              {insuranceCertificateFile && <span className="file-name">Selected: {insuranceCertificateFile.name}</span>}
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={generateTestData} className="generate-data-btn">
            🎲 Generate Test Data
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating Request...' : 'Create API Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiRequestForm;

