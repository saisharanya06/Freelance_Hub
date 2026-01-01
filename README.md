# Freelance Project Marketplace

A modern full-stack freelance marketplace application built with React, TailwindCSS, Redux Toolkit, and FastAPI.

## 🚀 Features

- **Beautiful UI/UX**: Modern glassmorphism design with gradient backgrounds and smooth animations
- **Project Management**: Create, view, and manage freelance projects
- **Real-time Updates**: Redux Toolkit for efficient state management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **RESTful API**: Well-structured FastAPI backend with MongoDB
- **Type Safety**: Pydantic models for data validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- Python (v3.10 or higher)
- MongoDB (v4.4 or higher)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Freelance\ Project\ Marketplace
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env  # Windows
# or
cp .env.example .env    # macOS/Linux

# Edit .env file with your MongoDB URL if different
# MONGODB_URL=mongodb://localhost:27017
# DATABASE_NAME=freelance_marketplace
# CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../freelance-marketplace

# Install dependencies
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service):
net start MongoDB

# On macOS (if installed with Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

## 🚀 Running the Application

### Start Backend Server

```bash
# From the server directory
cd server

# Activate virtual environment if not already activated
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Start the server
python run.py
```

The API will be available at `http://localhost:8000`
API documentation will be at `http://localhost:8000/docs`

### Start Frontend Development Server

```bash
# From the freelance-marketplace directory
cd freelance-marketplace

# Start the dev server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

1. **Home Page**: View the hero section and featured projects
2. **Browse Projects**: Navigate to the Projects page to see all available projects
3. **Post a Project**: Use the Post Project form to create a new freelance opportunity
4. **View Details**: Click on any project card to see full details
5. **Mark as Completed**: Change project status from the details page

## 🔗 API Endpoints

- `GET /api/projects` - Get all projects (with pagination)
- `POST /api/projects` - Create a new project
- `GET /api/projects/{id}` - Get project by ID
- `PATCH /api/projects/{id}/status` - Update project status
- `DELETE /api/projects/{id}` - Delete a project

## 🎨 Design Features

- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** using Tailwind's gradient utilities
- **Smooth animations** powered by Framer Motion
- **Responsive grid layouts** for all screen sizes
- **Interactive hover effects** on cards and buttons
- **Toast notifications** for user feedback
- **Dark mode support** with theme toggle

## 📂 Project Structure

```
Freelance Project Marketplace/
├── freelance-marketplace/        # Frontend React app
│   ├── src/
│   │   ├── app/                  # Redux store configuration
│   │   ├── components/           # Reusable UI components
│   │   ├── features/             # Redux slices
│   │   ├── pages/                # Page components
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── public/                   # Static assets
│   └── package.json
│
└── server/                       # Backend FastAPI app
    ├── app/
    │   ├── config.py             # Configuration
    │   ├── database.py           # Database connection
    │   ├── models.py             # Pydantic models
    │   ├── services.py           # Business logic
    │   ├── routes.py             # API routes
    │   └── main.py               # FastAPI app
    ├── requirements.txt          # Python dependencies
    └── run.py                    # Server entry point
```

## 🔧 Configuration

### Environment Variables

Backend (`.env` in `server/` directory):
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=freelance_marketplace
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Frontend API URL is configured in `src/features/projects/projectSlice.js`:
```javascript
const API_URL = "http://localhost:8000/api";
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check if the port 27017 is available
- Verify MONGODB_URL in .env file

### CORS Errors
- Verify CORS_ORIGINS in backend .env includes your frontend URL
- Check if both servers are running

### Port Already in Use
- Frontend (5173): Change port in vite.config.js
- Backend (8000): Change port in run.py

## 📝 License

This project is created as an assignment submission for the Full Stack Internship.

## 👨‍💻 Author

Created with ❤️ for the Full Stack Internship Assignment