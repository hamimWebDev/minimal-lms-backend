# Secure Authentication Implementation

This document explains the secure authentication system implemented with access tokens and refresh tokens for the LMS platform.

## Overview

The authentication system implements industry-standard security practices using:
- **Access Tokens**: Short-lived (15 minutes) for API authorization
- **Refresh Tokens**: Long-lived (7 days) stored in HttpOnly cookies for token renewal
- **Token Rotation**: Each refresh generates a new refresh token, invalidating the old one
- **Secure Cookie Settings**: HttpOnly, Secure, SameSite for maximum security

## Backend Implementation

### 1. User Model Updates

The User model has been extended to support refresh token storage:

```typescript
// user.interface.ts
export interface IRefreshToken {
  token: string;
  createdAt: Date;
  isRevoked: boolean;
}

export interface IUser {
  // ... existing fields
  refreshTokens?: IRefreshToken[];
}
```

```typescript
// user.model.ts
refreshTokens: [{
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60, // 7 days
  },
  isRevoked: {
    type: Boolean,
    default: false,
  }
}]
```

### 2. Authentication Services

#### Login Process
```typescript
const loginUser = async (email: string, password: string) => {
  // 1. Verify credentials
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user?.password);
  
  // 2. Generate tokens
  const accessToken = jwt.sign(payload, config.jwt_secret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, config.jwt_refresh_secret, { expiresIn: "7d" });
  
  // 3. Store refresh token in database
  await User.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        token: refreshToken,
        createdAt: new Date(),
        isRevoked: false
      }
    }
  });
  
  return { accessToken, refreshToken, user };
};
```

#### Token Refresh Process
```typescript
const refreshToken = async (refreshToken: string) => {
  // 1. Verify refresh token
  const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret);
  
  // 2. Check if token exists and is not revoked
  const user = await User.findOne({ 
    email: decoded?.email,
    'refreshTokens.token': refreshToken,
    'refreshTokens.isRevoked': false
  });
  
  // 3. Generate new tokens
  const newAccessToken = jwt.sign(payload, config.jwt_secret, { expiresIn: "15m" });
  const newRefreshToken = jwt.sign(payload, config.jwt_refresh_secret, { expiresIn: "7d" });
  
  // 4. Token rotation - revoke old, add new
  await User.findByIdAndUpdate(user._id, {
    $pull: { refreshTokens: { token: refreshToken } },
    $push: {
      refreshTokens: {
        token: newRefreshToken,
        createdAt: new Date(),
        isRevoked: false
      }
    }
  });
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
};
```

#### Logout Process
```typescript
const logout = async (refreshToken: string) => {
  // Revoke the specific refresh token
  await User.findOneAndUpdate(
    { 
      email: decoded?.email,
      'refreshTokens.token': refreshToken 
    },
    { 
      $set: { 'refreshTokens.$.isRevoked': true } 
    }
  );
};

const logoutAll = async (userId: string) => {
  // Revoke all refresh tokens for the user
  await User.findByIdAndUpdate(userId, {
    $set: { 'refreshTokens.$[].isRevoked': true }
  });
};
```

### 3. Authentication Controller

#### Cookie Management
```typescript
// Login - Set refresh token in HttpOnly cookie
res.cookie("refreshToken", result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

// Refresh - Update cookie with new refresh token
res.cookie("refreshToken", result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

// Logout - Clear cookie
res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});
```

### 4. Authentication Middleware

Updated to handle Bearer token format:

```typescript
const auth = (allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token and check permissions
    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = decoded;
    next();
  };
};
```

## Frontend Implementation

### 1. API Service Configuration

```typescript
class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: Function; reject: Function }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true, // Important for cookies
    });

    // Request interceptor - Add Bearer token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor - Handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          
          if (this.isRefreshing) {
            // Queue request if already refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            });
          }
          
          this.isRefreshing = true;
          
          try {
            // Refresh token automatically sent via cookies
            const response = await axios.post('/auth/refresh-token', {}, { 
              withCredentials: true 
            });
            
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Process queued requests
            this.failedQueue.forEach(({ resolve }) => resolve());
            this.failedQueue = [];
            
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            return this.api(error.config);
          } catch (refreshError) {
            // Clear auth state and redirect
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }
}
```

### 2. Redux Store Management

```typescript
// Auth slice with secure token management
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      return response.data; // accessToken and user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.refreshToken(); // No params needed
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 3. Usage Example

```typescript
// Component using secure authentication
const SecureAuthExample: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      // Access token stored in localStorage
      // Refresh token stored in HttpOnly cookie
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleProtectedApiCall = async () => {
    try {
      // Token refresh handled automatically by API interceptor
      const response = await apiService.getProtectedData();
      console.log('Protected data:', response);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      // Clears localStorage and HttpOnly cookie
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
};
```

## Security Features

### 1. Token Security
- **Access Tokens**: 15-minute expiration, stored in memory/localStorage
- **Refresh Tokens**: 7-day expiration, stored in HttpOnly cookies
- **Token Rotation**: Each refresh generates a new refresh token
- **Server-side Validation**: Tokens verified against database

### 2. Cookie Security
- **HttpOnly**: Prevents XSS attacks
- **Secure**: HTTPS only in production
- **SameSite**: Prevents CSRF attacks
- **Path**: Restricted to application path

### 3. Database Security
- **Token Storage**: Refresh tokens stored with user records
- **Token Revocation**: Immediate invalidation on logout
- **Automatic Cleanup**: Expired tokens automatically removed

### 4. API Security
- **Bearer Token Format**: Standard Authorization header
- **Automatic Refresh**: Seamless token renewal
- **Request Queuing**: Prevents multiple refresh attempts
- **Error Handling**: Graceful degradation on auth failures

## Environment Variables

```bash
# Backend (.env)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
NODE_ENV=production

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

## API Endpoints

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login (sets refresh token cookie)
- `POST /auth/refresh-token` - Token refresh (uses cookie)
- `POST /auth/logout` - User logout (clears cookie)
- `POST /auth/logout-all` - Logout from all devices

### Protected Routes
- All routes requiring authentication use the `auth()` middleware
- Access tokens sent via `Authorization: Bearer <token>` header
- Automatic token refresh on 401 responses

## Best Practices Implemented

1. **Token Rotation**: Prevents token reuse attacks
2. **HttpOnly Cookies**: Protects against XSS
3. **Secure Headers**: Prevents CSRF and other attacks
4. **Database Validation**: Server-side token verification
5. **Automatic Cleanup**: Expired tokens removed automatically
6. **Error Handling**: Graceful failure handling
7. **Request Queuing**: Prevents race conditions
8. **Environment-based Security**: Different settings for dev/prod

## Testing the Implementation

1. **Login**: Verify tokens are generated and stored correctly
2. **API Calls**: Test protected endpoints with valid tokens
3. **Token Expiry**: Wait for access token to expire and verify auto-refresh
4. **Logout**: Verify tokens are properly invalidated
5. **Security**: Test with invalid/expired tokens
6. **Cross-tab**: Test token refresh across multiple tabs

This implementation provides enterprise-grade security while maintaining a smooth user experience with automatic token management.
