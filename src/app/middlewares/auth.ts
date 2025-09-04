import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import config from '../config';

// Define a more specific type for the JWT payload
interface CustomJWTPayload extends JwtPayload {
  id: string;
  role: 'admin' | 'user' | 'superAdmin'; // Use your defined Role type/enum
}

const auth = (allowedRoles: ('admin' | 'user' | 'superAdmin')[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;
    

    if (!token) {
      res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt_secret as string) as CustomJWTPayload;
      
      // Check if the role in the token is allowed
      if (!allowedRoles.includes(decoded?.role)) {
        res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });
        return;
      }

      // Attach decoded user info to the request
      req.user = decoded; // req.user should be typed via declaration merging
      next();
    } catch (err) {
      // Handle specific JWT errors if needed (e.g., TokenExpiredError)
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ success: false, message: 'Unauthorized: Token expired' });
        return;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        return;
      }
      // Generic error
      res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      return;
    }
  };
};

export default auth;
