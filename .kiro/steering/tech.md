# Technology Stack

## Backend
- **Framework**: Django 6.0.1 with Django REST Framework 3.16.1
- **Database**: SQLite3 (development), configurable for production
- **Authentication**: Token-based authentication via DRF
- **API Documentation**: drf-spectacular (OpenAPI/Swagger)
- **Data Processing**: pandas, matplotlib for analytics
- **Export Libraries**: reportlab (PDF), openpyxl (Excel)
- **Deployment**: Gunicorn WSGI server, Heroku-ready (Procfile included)

## Frontend Web
- **Framework**: React 19.2.3 with Create React App
- **HTTP Client**: Axios 1.13.3
- **Charts**: Chart.js 4.5.1, react-chartjs-2 5.3.1, Recharts 3.7.0
- **Testing**: Jest, React Testing Library

## Frontend Desktop
- **Framework**: PyQt5 5.15.9
- **HTTP Client**: requests 2.31.0
- **Data Visualization**: matplotlib 3.8.0, numpy 1.24.0
- **Configuration**: python-dotenv 1.0.0

## Development Environment
- **Python**: 3.10+ required
- **Node.js**: Compatible with React 19.x
- **Virtual Environment**: Python venv recommended

## Common Commands

### Backend Development
```bash
# Setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Database
python backend/manage.py makemigrations
python backend/manage.py migrate
python backend/manage.py createsuperuser

# Development server
python backend/manage.py runserver

# Create demo user
python backend/manage.py create_demo_user
```

### Frontend Web Development
```bash
# Setup
cd frontend-web
npm install

# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Frontend Desktop Development
```bash
# Setup
cd frontend-desktop
pip install -r requirements.txt

# Run application
python main.py
```

## API Configuration
- **Base URL**: http://localhost:8000/api
- **Authentication**: Token header format: `Authorization: Token <token>`
- **CORS**: Enabled for all origins in development