import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config';

// Types for API responses
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface ApiRequest {
  customer_name: string;
  customer_phone: string;
  registration_number: string;
  customer_email: string;
  policy_number: string;
  insurance_company: string;
  callback_url: string;
  partner_reference: string;
  log_book?: File;
  insurance_certificate?: File;
}

export interface ApiRequestResponse {
  id: string;
  status: string;
  message: string;
}

export interface ViewApiRequestsResponse {
  message: string;
  client: string;
  data: Array<{
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    registration_number: string;
    policy_number: string;
    insurance_company: string;
    callback_url: string;
    partner_reference: string;
    created_by: string;
    created_at: string;
  }>;
}

export interface CompletedAssessment {
  assessment_id: number;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  registration_number: string;
  chassis_number: string;
  engine_number: string;
  engine_capacity: string;
  manufacture_year: string;
  registration_date: string;
  // Add other fields as needed
}

export interface CompletedAssessmentsResponse {
  success: boolean;
  message: string;
  data: {
    assessments: CompletedAssessment[];
  };
}

export interface WebhookStats {
  total: number;
  successful: number;
  failed: number;
  lastReceived: string;
}

export interface WebhookTestPayload {
  booking_no: string;
  status: string;
  assessment_id: number;
  reg_no: string;
  completion_date: string;
  pdf_url: string;
  partner_reference: string;
  customer_name: string;
  insurance_company: string;
  policy_number: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseUrl: string;
  private webhookReceiverUrl: string;

  constructor() {
    this.baseUrl = config.API_BASE_URL;
    this.webhookReceiverUrl = config.WEBHOOK_RECEIVER_URL;
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/api/get-token', {
      email,
      password,
    });
    
    // Store tokens
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    
    return response.data;
  }

  // API Request Creation
  async createDirectApiRequest(requestData: Omit<ApiRequest, 'log_book' | 'insurance_certificate'>): Promise<ApiRequestResponse> {
    const response: AxiosResponse<ApiRequestResponse> = await this.api.post('/api/create-api-request', requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  async createBrokerApiRequest(requestData: ApiRequest): Promise<ApiRequestResponse> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('customer_name', requestData.customer_name);
    formData.append('customer_phone', requestData.customer_phone);
    formData.append('registration_number', requestData.registration_number);
    formData.append('customer_email', requestData.customer_email);
    formData.append('policy_number', requestData.policy_number);
    formData.append('insurance_company', requestData.insurance_company);
    formData.append('callback_url', requestData.callback_url);
    formData.append('partner_reference', requestData.partner_reference);
    
    // Add files if provided
    if (requestData.log_book) {
      formData.append('log_book', requestData.log_book);
    }
    if (requestData.insurance_certificate) {
      formData.append('insurance_certificate', requestData.insurance_certificate);
    }

    const response: AxiosResponse<ApiRequestResponse> = await this.api.post('/api/create-api-request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // View API Requests
  async viewApiRequests(): Promise<ViewApiRequestsResponse> {
    const response: AxiosResponse<ViewApiRequestsResponse> = await this.api.get('/api/view-api-requests');
    return response.data;
  }

  async getCompletedAssessments(): Promise<CompletedAssessmentsResponse> {
    const response: AxiosResponse<CompletedAssessmentsResponse> = await this.api.get('/api/completed-assessments');
    return response.data;
  }

  // Webhook Testing
  async testWebhookReceiver(payload: WebhookTestPayload): Promise<any> {
    try {
      // Use ngrok URL for webhook testing
      const response = await axios.post(`${this.webhookReceiverUrl}/webhook`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Webhook test error:', error);
      throw error;
    }
  }

  async getWebhookStats(): Promise<WebhookStats> {
    try {
      // Use local backend for stats
      const localBackendUrl = config.LOCAL_BACKEND_URL || 'http://localhost:3001';
      const response: AxiosResponse<WebhookStats> = await axios.get(`${localBackendUrl}/api/stats`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Webhook stats error:', error);
      throw error;
    }
  }

  // Simulation & Testing
  async simulateAssessmentCompletion(bookingNo: string): Promise<any> {
    const response = await this.api.post('/api/simulate-completion', {
      booking_no: bookingNo,
      simulate: true,
    });
    return response.data;
  }

  async testWebhookEndpoint(callbackUrl: string, bookingNo: string): Promise<any> {
    const response = await this.api.post('/api/test-webhook', {
      callback_url: callbackUrl,
      booking_no: bookingNo,
    });
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getWebhookReceiverUrl(): string {
    return this.webhookReceiverUrl;
  }
}

const apiService = new ApiService();
export default apiService;
