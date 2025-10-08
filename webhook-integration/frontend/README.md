# Webhook Integration Dashboard

A React application for testing and managing webhook integrations with the Links Valuers API.

## Features

- 🔐 **Authentication**: Login with email/password to access the dashboard
- 📝 **API Request Creation**: Create direct and broker integration requests
- 📊 **Request Management**: View all API requests and completed assessments
- 🔔 **Webhook Testing**: Test webhook functionality and view statistics
- 🎯 **Simulation**: Simulate assessment completion workflows

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   REACT_APP_WEBHOOK_RECEIVER_URL=http://localhost:3001
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

## API Endpoints

The application consumes the following API endpoints:

### Authentication
- `POST /api/get-token` - Login and get access token

### API Request Management
- `POST /api/create-api-request` - Create new API request (direct or broker)
- `GET /api/view-api-requests` - View all API requests
- `GET /api/completed-assessments` - View completed assessments

### Webhook Testing
- `POST /api/simulate-completion` - Simulate assessment completion
- `POST /api/test-webhook` - Test webhook endpoint

## Usage

1. **Login**: Use your partner credentials to access the dashboard
2. **Create Request**: Fill out the form to create a new API request
3. **View Requests**: Monitor the status of your API requests
4. **Test Webhooks**: Use the webhook testing tools to verify integration

## Components

- `Login` - Authentication component
- `Dashboard` - Main dashboard with navigation
- `ApiRequestForm` - Form for creating API requests
- `ApiRequestsList` - List and view API requests
- `WebhookDashboard` - Webhook testing and statistics

## Technologies

- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- CSS3 for styling

## Development

The application is built with Create React App and includes:
- TypeScript support
- Hot reloading
- ESLint configuration
- Responsive design