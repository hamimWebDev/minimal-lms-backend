
import jwt from 'jsonwebtoken';
import config from '../config';
interface TokenPayload {
    userId: string;
    role: 'admin' | 'user' ;
  }
  
  const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.jwt_secret  as string, {
      expiresIn: '1d',
    });
  };
  
export default generateToken;
