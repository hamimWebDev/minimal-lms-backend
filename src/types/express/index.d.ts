import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../../app/modules/user/user.constant'; // Adjust path if needed

// Define the specific shape of your JWT payload
interface CustomJWTPayload extends JwtPayload {
  id: string;
  role: UserRole;
}

// Define the shape of your decoded JWT payload if possible
// For example:
// interface DecodedUserPayload {
//   userId: string;
//   email: string;
//   role: string;
//   // Add other properties from your JWT payload
// }

declare global {
  namespace Express {
    interface Request {
      user?: CustomJWTPayload; // Use the specific payload type
    }
  }
}

// Ensure this file is included in your tsconfig.json typeRoots or include array.
// Example tsconfig.json modification:
// {
//   "compilerOptions": {
//     "typeRoots": ["./node_modules/@types", "./src/types"]
//   },
//   "include": ["src/**/*", "src/types/**/*.d.ts"]
// } 