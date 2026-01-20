# Authentication & Project Completion Implementation Guide

This guide explains the complete authentication system and project completion flow implemented in the Freelance Project Marketplace.

## 🏗️ Architecture Overview

### Backend (FastAPI + MongoDB)
- **JWT-based authentication** with bcrypt password hashing
- **Protected routes** using FastAPI dependencies
- **MongoDB** for user and project storage
- **Motor** async MongoDB driver

### Frontend (React + Redux Toolkit)
- **Redux slices** for auth and projects state management
- **Axios interceptor** for automatic JWT token attachment
- **LocalStorage** for token persistence
- **Protected routes** using React Router

---

## 📁 File Structure

### Backend Files

```
server/app/
├── jwt_utils.py          # JWT token creation & verification + password hashing
├── dependencies.py       # Authentication dependencies for protected routes
├── database.py           # MongoDB connection & collections
├── auth.py              # Authentication routes (signup/login)
├── main.py              # Main app with project routes
├── schemas.py           # Pydantic models for request validation
└── requirements.txt     # Python dependencies
```

### Frontend Files

```
freelance-marketplace/src/
├── features/
│   ├── auth/
│   │   └── authSlice.js      # Redux auth state management
│   └── projects/
│       └── projectSlice.js   # Redux projects state management
├── config/
│   └── api.js                # Axios instance with JWT interceptor
├── pages/
│   ├── Login.jsx             # Login page
│   └── Signup.jsx            # Signup page
└── app/
    └── store.js              # Redux store configuration
```

---

## 🔐 Backend Implementation

### 1. JWT Utilities (`jwt_utils.py`)

**Key Functions:**
- `hash_password()` - Hash passwords using bcrypt
- `verify_password()` - Verify password against hash
- `create_access_token()` - Generate JWT tokens
- `verify_token()` - Decode and validate JWT tokens

**Configuration:**
- Algorithm: HS256
- Token expiry: 7 days
- Secret key: Should be moved to environment variables in production

### 2. Authentication Dependencies (`dependencies.py`)

**get_current_user()**
- Extracts JWT from Authorization header
- Verifies token validity
- Fetches user from database
- Returns user object or raises 401 error

**get_current_user_optional()**
- Same as above but returns None instead of error
- Useful for routes that work with/without auth

### 3. Database Setup (`database.py`)

**Collections:**
- `users_collection` - Stores user accounts
- `projects_collection` - Stores project listings

**User Schema:**
```python
{
    "_id": ObjectId,
    "name": str,
    "email": str (unique),
    "password_hash": str,
    "created_at": datetime
}
```

### 4. Authentication Routes (`auth.py`)

#### POST `/auth/signup`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Process:**
1. Check if email already exists
2. Hash password using bcrypt
3. Store user in database
4. Return user info (without password)

#### POST `/auth/login`
**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Process:**
1. Find user by email
2. Verify password hash
3. Generate JWT token
4. Return user + token

### 5. Protected Project Routes (`main.py`)

#### PATCH `/projects/{project_id}/complete` 🔒 Protected

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439011",
  "title": "Project Title",
  "description": "...",
  "budget": 5000,
  "tech_stack": ["React", "Node.js"],
  "status": "COMPLETED",
  "created_at": "2024-01-15T10:30:00"
}
```

**Process:**
1. Verify JWT token via `get_current_user` dependency
2. Find project in database
3. Update status to "COMPLETED"
4. Store completedBy user ID
5. Return full updated project

---

## 🎨 Frontend Implementation

### 1. API Configuration (`config/api.js`)

**Axios Instance with JWT Interceptor:**

```javascript
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  
  return config;
});
```

**Key Features:**
- Automatically attaches JWT token to every request
- Reads token from localStorage
- No need to manually add Authorization header

### 2. Auth Redux Slice (`authSlice.js`)

**State Structure:**
```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    token: string  // JWT token stored here
  },
  isAuthenticated: boolean,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}
```

**Actions:**

#### `loginUser` (async thunk)
- Calls `/auth/login`
- Stores user + token in localStorage
- Updates Redux state

#### `signupUser` (async thunk)
- Calls `/auth/signup`
- Does NOT store token (user must login after signup)
- Redirects to login page

#### `logoutUser` (reducer)
- Clears Redux state
- Removes user from localStorage
- Resets authentication status

**LocalStorage Persistence:**
- User object (with token) saved on login
- Restored on app reload
- Cleared on logout

### 3. Projects Redux Slice (`projectSlice.js`)

**State Structure:**
```javascript
{
  projects: Array,
  currentProject: Object | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}
```

**Actions:**

#### `fetchProjects` (async thunk)
- Fetches all projects
- No authentication required
- Safely handles array response

#### `createProject` (async thunk)
- Creates new project
- Optional authentication
- If authenticated, createdBy is auto-set

#### `markAsCompleted` (async thunk)
- **Requires authentication** (JWT token)
- Calls PATCH `/projects/{id}/complete`
- Updates project in state with backend response
- No fake state updates - always uses server data

**Key Features:**
- ✅ Handles undefined payload in rejected cases
- ✅ Updates both projects array and currentProject
- ✅ Uses backend response for state updates (no client-side guessing)

### 4. Login Page (`Login.jsx`)

**Features:**
- Email & password validation
- Password visibility toggle
- Error handling with toast notifications
- Auto-redirect to home if already authenticated
- Stores token on successful login

### 5. Signup Page (`Signup.jsx`)

**Features:**
- Strong password validation (8+ chars, uppercase, number, special char)
- Password confirmation matching
- Password visibility toggles
- Success redirect to login page
- Does NOT auto-login after signup

---

## 🔄 Authentication Flow

### Signup Flow
```
1. User fills signup form
2. Frontend validates password strength
3. POST /auth/signup with credentials
4. Backend hashes password
5. Backend stores user in MongoDB
6. Success → Redirect to login page
7. User must login to get token
```

### Login Flow
```
1. User fills login form
2. POST /auth/login with credentials
3. Backend verifies email exists
4. Backend verifies password hash
5. Backend generates JWT token
6. Frontend receives user + token
7. Token stored in localStorage
8. Redux state updated
9. User redirected to home
10. All subsequent requests include JWT token
```

### Protected Route Flow
```
1. User tries to complete a project
2. Frontend sends PATCH request
3. Axios interceptor adds JWT token
4. Backend extracts token from header
5. Backend verifies token
6. Backend extracts user ID from token
7. Backend checks user exists in DB
8. Backend updates project
9. Backend returns updated project
10. Frontend updates Redux state
```

### Logout Flow
```
1. User clicks logout
2. Redux action clears state
3. LocalStorage cleared
4. User redirected to login
5. Subsequent requests have no token
6. Protected routes return 401
```

---

## 🛡️ Security Features

### Password Security
- ✅ Bcrypt hashing (never store plain passwords)
- ✅ Strong password validation on frontend
- ✅ Password confirmation check
- ✅ Password visibility toggle

### Token Security
- ✅ JWT tokens with expiration (7 days)
- ✅ Tokens verified on every protected request
- ✅ User existence checked in database
- ✅ Invalid tokens rejected with 401

### API Security
- ✅ CORS configured for specific origins
- ✅ HTTPBearer authentication scheme
- ✅ Automatic token refresh handling
- ✅ Secure token storage in localStorage

---

## 🚀 Testing the Implementation

### 1. Test Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### 3. Test Protected Route
```bash
curl -X PATCH http://localhost:8000/projects/PROJECT_ID/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Best Practices Implemented

### Backend
✅ Password hashing with bcrypt
✅ JWT tokens for stateless authentication
✅ Dependency injection for auth
✅ Proper error handling with HTTP exceptions
✅ User data validation with Pydantic
✅ Async/await for database operations

### Frontend
✅ Centralized Axios instance
✅ Automatic token attachment via interceptor
✅ Redux Toolkit for state management
✅ LocalStorage for token persistence
✅ Protected routes with authentication checks
✅ Error handling with user feedback
✅ No direct state manipulation (use backend responses)

---

## 🔧 Environment Variables

### Backend
Create `server/.env`:
```env
SECRET_KEY=your-super-secret-key-min-32-characters
MONGODB_URL=your-mongodb-connection-string
DATABASE_NAME=freelancehub
```

### Frontend
Create `freelance-marketplace/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** Check if token is properly stored in localStorage and sent in Authorization header

### Issue: Token expired
**Solution:** User needs to login again. Implement token refresh mechanism if needed.

### Issue: CORS errors
**Solution:** Ensure backend CORS allows frontend origin

### Issue: Password validation fails
**Solution:** Ensure password meets requirements (8+ chars, uppercase, number, special char)

---

## 🎯 Next Steps

1. **Move SECRET_KEY to environment variables** (currently hardcoded)
2. **Add token refresh mechanism** (refresh tokens)
3. **Add email verification** for signup
4. **Add password reset functionality**
5. **Add role-based access control (RBAC)**
6. **Add rate limiting** for auth endpoints
7. **Add audit logging** for security events
8. **Add multi-factor authentication (MFA)**

---

## 📚 Additional Resources

- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT.io](https://jwt.io/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Bcrypt Documentation](https://github.com/pyca/bcrypt/)
- [MongoDB Motor](https://motor.readthedocs.io/)