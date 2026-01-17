# Freelance Project Marketplace

A modern full-stack freelance marketplace application built with React, TailwindCSS, Redux Toolkit, and FastAPI.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure login/signup
- **User-Specific Project Tracking**: Each user has their own completion status for projects
- **Project Ownership**: Track who created each project
- **Beautiful UI/UX**: Modern glassmorphism design with gradient backgrounds and smooth animations
- **Project Management**: Create, view, and manage freelance projects
- **Real-time Updates**: Redux Toolkit for efficient state management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **RESTful API**: Well-structured FastAPI backend with MongoDB
- **Type Safety**: Pydantic models for data validation

## 📋 Prerequisites


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
- **PyJWT** - JWT token handling
- **Passlib** - Password hashing with bcrypt

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
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation will be at `http://localhost:8000/docs`

**Note**: On first startup, the application will automatically create required database indexes.

### Start Frontend Development Server

```bash
# From the freelance-marketplace directory
cd freelance-marketplace

# Start the dev server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

### First-Time Setup
1. **Signup**: Create an account with name, email, and password
2. **Login**: Sign in with your credentials to receive a JWT token

### Working with Projects
1. **Browse Projects**: View all available projects with your personal completion status
2. **Post a Project**: Create a new freelance opportunity (requires login)
3. **View Details**: Click on any project card to see full details
4. **Mark as Completed**: Mark projects you've completed - this is personal to your account
5. **View Your Completions**: See all projects you've marked as completed

### Key Features
- ✅ **Authentication Required**: All project operations require login
- ✅ **User-Specific Completion**: When you mark a project as completed, it only affects your view
- ✅ **Project Ownership**: Each project tracks who created it
- ✅ **Persistent Sessions**: JWT tokens are stored in localStorage for seamless experience

## 🔗 API Endpoints

### Authentication (Public)
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Projects (Protected - Requires Authentication)
- `GET /projects` - Get all projects with user-specific completion status
- `POST /projects` - Create a new project (stores creator's user_id)
- `GET /projects/{id}` - Get single project with user-specific completion status
- `PATCH /projects/{id}/complete` - Mark project as completed for current user
- `GET /projects/completed/me` - Get all projects marked as completed by current user

### Response Format
All project responses include:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "budget": number,
  "tech_stack": ["string"],
  "status": "OPEN" | "COMPLETED",
  "created_by": "string (user_id)",
  "created_at": "ISO datetime",
  "isCompleted": boolean  // User-specific flag
}
```

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
│   │   ├── config/               # API configuration with interceptors
│   │   ├── features/
│   │   │   ├── auth/             # Authentication slice
│   │   │   └── projects/         # Projects slice
│   │   ├── pages/                # Page components
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── public/                   # Static assets
│   └── package.json
│
└── server/                       # Backend FastAPI app
    ├── app/
    │   ├── auth.py               # Authentication routes
    │   ├── config.py             # Configuration
    │   ├── database.py           # Database connection & schema
    │   ├── dependencies.py       # Auth dependencies
    │   ├── jwt_utils.py          # JWT token utilities
    │   ├── models.py             # Pydantic models
    │   ├── schemas.py            # Request/Response schemas
    │   ├── services.py           # Business logic
    │   └── main.py               # FastAPI app
    ├── requirements.txt          # Python dependencies
    └── run.py                    # Server entry point
```

## 🗄️ MongoDB Schema

### Collections

#### users
```javascript
{
  "_id": ObjectId,
  "name": String,
  "email": String,          // Unique index
  "password_hash": String,  // Bcrypt hashed
  "created_at": DateTime
}
```

#### projects
```javascript
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "budget": Number,
  "tech_stack": [String],
  "status": "OPEN" | "COMPLETED",
  "created_by": String,     // User ID reference
  "created_at": DateTime
}
```

#### project_completions
```javascript
{
  "_id": ObjectId,
  "user_id": String,        // Reference to users._id
  "project_id": String,     // Reference to projects._id
  "completed_at": DateTime
}
```

**Indexes:**
- `users.email` - Unique index for fast email lookup
- `project_completions.(user_id, project_id)` - Compound unique index for completion tracking

### Architecture Highlights

**User-Specific Completion System:**
- Projects have a global `status` field (OPEN/COMPLETED)
- Each user has their own completion record in `project_completions`
- When fetching projects, the backend joins with `project_completions` to set `isCompleted` flag per user
- Multiple users can mark the same project as completed independently

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