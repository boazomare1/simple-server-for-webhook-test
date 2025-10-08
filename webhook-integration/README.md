# Webhook Integration System

A complete webhook integration system with React dashboard and webhook receiver.

## 🏗️ **Project Structure**

```
webhook-integration/
├── frontend/          # React dashboard
├── backend/           # Webhook receiver server
├── package.json       # Root package.json with workspaces
└── .gitignore        # Single gitignore for entire project
```

## 🚀 **Quick Start**

### **Install All Dependencies**
```bash
npm run install:all
```

### **Start Everything**
```bash
npm start
```

### **Individual Services**
```bash
# Frontend only
npm run start:frontend

# Backend only  
npm run start:backend
```

## 📦 **What's Included**

### **Frontend (React Dashboard)**
- 🔐 Authentication system
- 📝 API request creation (direct & broker)
- 📊 Request management and viewing
- 🔔 Webhook testing and statistics
- 🎯 Simulation tools

### **Backend (Webhook Receiver)**
- 🔗 Webhook endpoint (`/webhook`)
- 📊 Statistics API (`/api/stats`)
- 🎛️ Real-time dashboard
- 📝 Webhook data storage

## 🌐 **URLs**

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Webhook Endpoint**: http://localhost:3001/webhook
- **Backend Dashboard**: http://localhost:3001

## 🔧 **Development**

### **Monorepo Benefits**
- ✅ **Single `node_modules`** - Shared dependencies
- ✅ **One `.gitignore`** - Clean repository
- ✅ **Unified scripts** - Easy management
- ✅ **Shared tooling** - Consistent development

### **Available Scripts**
- `npm start` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies

## 🛠️ **Technologies**

- **Frontend**: React 18, TypeScript, Axios, React Router
- **Backend**: Node.js, Express, CORS
- **Tools**: Concurrently (for running multiple services)
- **Development**: Hot reloading, TypeScript compilation

## 📝 **Usage**

1. **Start the system**: `npm start`
2. **Open frontend**: http://localhost:3000
3. **Login** with your API credentials
4. **Create API requests** and test webhooks
5. **Monitor** webhook activity in real-time

## 🔗 **Integration**

The system integrates with your existing API endpoints:
- Authentication: `/api/get-token`
- API Requests: `/api/create-api-request`
- View Requests: `/api/view-api-requests`
- Completed Assessments: `/api/completed-assessments`

## 📊 **Features**

- **Real-time webhook monitoring**
- **API request management**
- **Statistics and analytics**
- **Test data generation**
- **Error handling and debugging**
- **Responsive design**
