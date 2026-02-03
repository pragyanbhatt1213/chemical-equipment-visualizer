# Chemical Equipment Visualizer

## Problem Statement

Industrial facilities process data from hundreds of chemical equipment units daily, but lack effective tools to:
- Rapidly analyze equipment performance across large datasets
- Identify underperforming or at-risk equipment
- Compare equipment efficiency and operational health
- Generate actionable reports for compliance and optimization

Current workflows require manual spreadsheet analysis, consuming hours and prone to human error.

## Solution Overview

Chemical Equipment Visualizer is a full-stack web application that automates chemical equipment analysis and visualization. Upload CSV data, and the system instantly processes it through an AI-powered analysis engine, generating health scores, efficiency rankings, outlier detection, and professional reports.

**Core Value:**
- Process 100+ equipment records in seconds
- Identify risk patterns automatically
- Generate exportable reports (PDF, CSV, Excel)
- Secure token-based authentication
- Production-grade deployment on Railway and Vercel

## Key Features

- **CSV Data Analysis**: Upload equipment datasets with automatic validation and processing
- **Health Scoring**: Calculates equipment health (0-100) based on operational parameters
- **Outlier Detection**: IQR-based statistical analysis identifies anomalous equipment
- **Efficiency Ranking**: Ranks equipment by performance across flowrate, pressure, and temperature
- **Risk Categorization**: Classifies equipment as high, medium, or low risk
- **Type Distribution**: Visual breakdown of equipment by category
- **Report Generation**: Export analysis as PDF, CSV, or Excel
- **Upload History**: Persistent storage of all analyzed datasets with timestamps
- **Role-Based Access**: Token authentication prevents unauthorized access

## System Architecture

### Frontend (Vercel)

**Technology Stack**: React 19, Styled Components, Recharts, Framer Motion

**Components**:
- **Login**: Token-based authentication with demo credentials
- **Upload**: Drag-and-drop CSV interface with validation
- **Dashboard**: Overview metrics and summary statistics
- **Analytics**: Advanced visualizations (health scores, risk distribution, efficiency ranking)
- **History**: Browse and re-analyze previous uploads
- **Type Distribution Chart**: Visual equipment categorization

**Features**:
- Responsive design (desktop/tablet)
- Smooth page transitions and animations
- Real-time error handling
- Token storage in localStorage

### Backend (Railway)

**Technology Stack**: Django 4.2, Django REST Framework, PostgreSQL

**API Endpoints**:
```
POST   /api/login/                    - Authenticate user, return token
POST   /api/upload/                   - Upload and analyze CSV file
GET    /api/history/                  - Retrieve last 5 analyses
GET    /api/health/                   - Health check endpoint
GET    /api/generate-pdf/{id}/        - Export analysis as PDF
GET    /api/export/csv/{id}/          - Export analysis as CSV
GET    /api/export/excel/{id}/        - Export analysis as Excel
```

**Authentication**: Token-based (DRF Token Authentication)

**Data Processing Pipeline**:
1. CSV validation (required columns: Equipment Name, Type, Flowrate, Pressure, Temperature)
2. Statistical analysis (mean, median, std dev per parameter)
3. Health score calculation per equipment
4. Outlier detection (IQR method)
5. Efficiency ranking by parameter performance
6. Risk summary aggregation
7. Persistent storage in PostgreSQL

### Database (PostgreSQL)

**Schema**: Dataset model stores:
- Metadata (filename, upload timestamp)
- Aggregated metrics (avg flowrate, pressure, temperature)
- Type distribution
- Statistical summaries
- Individual equipment health scores
- Outlier lists and risk categories
- Efficiency rankings

## Live Deployment Links

**Frontend**: https://chemical-equipment-visualizer-production.vercel.app/

**Backend API**: https://chemical-equipment-visualizer-production-9cad.up.railway.app/

**API Documentation**: https://chemical-equipment-visualizer-production-9cad.up.railway.app/api/schema/swagger-ui/ (Swagger UI)

## Authentication

### Demo Credentials
```
Username: demo
Password: demo123
```

### How Token Authentication Works
1. User logs in with credentials
2. Backend returns authentication token
3. Token stored in browser localStorage
4. All subsequent API requests include token in Authorization header
5. Token persists across page refreshes and browser sessions

## How to Use (End-User Flow)

### 1. Login
- Navigate to the frontend URL
- Enter demo username and password
- Click "Login" — token is automatically stored

### 2. Prepare CSV Data
Required columns (case-sensitive):
- `Equipment Name` — unique identifier
- `Type` — equipment category (e.g., Pump, Valve, Exchanger)
- `Flowrate` — flow rate in units/minute
- `Pressure` — pressure in bar
- `Temperature` — temperature in Celsius

Example CSV:
```
Equipment Name,Type,Flowrate,Pressure,Temperature
Pump-A1,Pump,45.2,6.8,105
Valve-B2,Valve,32.1,7.2,98
Exchanger-C1,Exchanger,28.5,5.5,110
```

### 3. Upload Dataset
- Click "Upload" or drag-and-drop CSV file
- System validates columns and processes data (takes ~2-5 seconds)
- Receives analysis summary immediately

### 4. View Analysis Results
**Dashboard Tab**: High-level metrics
- Total equipment count
- Average flowrate, pressure, temperature
- Equipment count by type

**Analytics Tab**: Deep-dive insights
- Equipment health score distribution chart
- Risk summary (high/medium/low counts)
- Efficiency ranking leaderboard
- Outlier equipment highlights

### 5. Export Reports
- **PDF Report**: Professional summary with charts and tables
- **CSV Export**: Raw data with calculated health scores
- **Excel Export**: Formatted spreadsheet for further analysis

### 6. View History
- Browse all previous uploads (last 5)
- Re-analyze historical data anytime
- Timestamps show when each dataset was uploaded

## Tech Stack

**Frontend**:
- React 19.2
- Styled Components 6.1
- Recharts 3.7 (data visualization)
- Framer Motion 11.0 (animations)
- Axios 1.13 (HTTP client)

**Backend**:
- Django 4.2
- Django REST Framework 3.14
- django-cors-headers (CORS support)
- python-dateutil (date handling)
- reportlab (PDF generation)
- pandas (CSV processing)
- numpy (statistics)

**Database**:
- PostgreSQL (production)
- SQLite (local development)

**Deployment**:
- Frontend: Vercel (Git-based CI/CD)
- Backend: Railway (Docker, auto-deploy on push)

## Security & Production Readiness

- **Authentication**: Token-based, requires valid credentials
- **CORS**: Configured for frontend domain only
- **HTTPS**: Both frontend and backend served over HTTPS
- **Database**: PostgreSQL with environment-based credentials
- **Logging**: Structured logging for API requests and errors
- **Error Handling**: Graceful error responses with meaningful messages
- **Input Validation**: CSV schema validation before processing
- **Rate Limiting**: Can be extended via Django middleware

## Limitations & Future Improvements

### Current Limitations
- Maximum 5 most recent datasets stored (older automatically archived)
- Single user per token (no multi-user collaboration)
- CSV only (no direct database import)
- Basic health score algorithm (could incorporate more parameters)

### Roadmap
- Multi-user workspaces and data sharing
- Real-time data ingestion from IoT sensors
- Predictive maintenance using ML models
- Custom health score thresholds per equipment type
- Batch analysis for multiple datasets
- Email report delivery
- Mobile app support

## Development

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (for production)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend-web
npm install
npm start
```

### Create Demo User
```bash
cd backend
python manage.py create_demo_user
```

## Submission Notes

This submission demonstrates:
1. **Full-stack integration**: React frontend, Django backend, PostgreSQL database
2. **Production deployment**: Live on Vercel and Railway with HTTPS
3. **Real-world problem solving**: Automates equipment analysis workflow
4. **Scalability**: Handles large CSV uploads with fast processing
5. **User experience**: Intuitive interface with immediate actionable insights
6. **Code quality**: Structured, documented, follows industry best practices

The system is immediately usable with demo credentials and requires no additional setup.

---

**Repository**: https://github.com/pragyanbhatt1213/chemical-equipment-visualizer

**Last Updated**: February 2026
