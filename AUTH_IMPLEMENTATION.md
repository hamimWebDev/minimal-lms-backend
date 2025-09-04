# Secure Authentication Implementation

## Overview
This LMS implements secure authentication using access tokens (15min) and refresh tokens (7 days) with token rotation.

## Key Features
- Access tokens expire in 15 minutes
- Refresh tokens stored in HttpOnly cookies (7 days)
- Automatic token refresh on API calls
- Token rotation (new refresh token on each refresh)
- Server-side token invalidation on logout

## Backend Changes

### User Model
- Added `refreshTokens` array to store active refresh tokens
- Each token includes: token string, creation date, revocation status

### Auth Services
- `loginUser()`: Generates both tokens, stores refresh token in DB
- `refreshToken()`: Validates token, generates new pair, rotates tokens
- `logout()`: Revokes specific refresh token
- `logoutAll()`: Revokes all user's refresh tokens

### Auth Controller
- Sets refresh token in HttpOnly cookie on login/refresh
- Clears cookie on logout
- Proper cookie security settings

### Auth Middleware
- Updated to handle `Bearer <token>` format
- Validates access tokens for protected routes

## Frontend Changes

### API Service
- Added `withCredentials: true` for cookie handling
- Automatic token refresh on 401 responses
- Request queuing during refresh to prevent race conditions
- Updated to use `Bearer` token format

### Redux Store
- Removed refresh token from localStorage (now in cookies)
- Updated auth actions for new API structure
- Added logout and logoutAll actions

## Security Features
- HttpOnly cookies prevent XSS attacks
- Secure cookies in production
- SameSite protection against CSRF
- Token rotation prevents reuse attacks
- Database validation of refresh tokens

## Usage
1. User logs in → receives access token + refresh token cookie
2. API calls use access token → auto-refresh if expired
3. Logout → revokes tokens server-side + clears cookie
4. All devices logout → revokes all user's refresh tokens

## Environment Setup
```bash
# Backend
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=production

# Frontend  
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
