

import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { User } from "../user/user.model";

 const registerUser = async (name: string, email: string, password: string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create user with default role 'user' and status 'in-progress'
  // Password will be automatically hashed by the User model pre-save middleware
  const userData = {
    name,
    email,
    password,
    role: 'user' as const,
    status: 'in-progress' as const,
    isDeleted: false,
  };

  const user = await User.create(userData);

  // Use toJSON to automatically exclude password field
  return user.toJSON();
};

 const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    {
      id: user?._id, 
      email: user?.email,
      role: user?.role,
    },
    config.jwt_secret as string,
    { expiresIn: "15m" }
  );
  
  // refresh token
  const refreshToken = jwt.sign(
    {
      id: user?._id,
      email: user?.email,
      role: user?.role,
    },
    config.jwt_refresh_secret as string,
    { expiresIn: "7d" }
  );
  
  return {
    accessToken,
    refreshToken,
    user: user.toJSON(), // Use toJSON to automatically exclude password field
  };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;
  if (typeof decoded === 'string' || !decoded) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findOne({ email: decoded?.email });

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = jwt.sign(
    {
      id: user?._id,
      email: user?.email,
      role: user?.role,
    },
    config.jwt_secret as string,
    { expiresIn: "15m" }
  );

  // Generate new refresh token
  const newRefreshToken = jwt.sign(
    {
      id: user?._id,
      email: user?.email,
      role: user?.role,
    },
    config.jwt_refresh_secret as string,
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: user.toJSON(), // Use toJSON to automatically exclude password field
  };
}

export const AuthServices = {
  registerUser,
  loginUser,
  refreshToken,
};
