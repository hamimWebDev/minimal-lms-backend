

import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { User } from "../user/user.model";
import crypto from "crypto";

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

  // Generate access token (15 minutes)
  const accessToken = jwt.sign(
    {
      id: user?._id, 
      email: user?.email,
      role: user?.role,
    },
    config.jwt_secret as string,
    { expiresIn: "15m" }
  );
  
  // Generate refresh token (7 days)
  const refreshToken = jwt.sign(
    {
      id: user?._id,
      email: user?.email,
      role: user?.role,
    },
    config.jwt_refresh_secret as string,
    { expiresIn: "7d" }
  );

  // Store refresh token in user document for rotation
  await User.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        token: refreshToken,
        createdAt: new Date(),
        isRevoked: false
      }
    }
  });
  
  return {
    accessToken,
    refreshToken,
    user: user.toJSON(), // Use toJSON to automatically exclude password field
  };
};

const refreshToken = async (refreshToken: string) => {
  try {
    console.log('Refresh token service called with token:', refreshToken ? 'present' : 'missing');
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;
    if (typeof decoded === 'string' || !decoded) {
      console.log('Invalid refresh token - decoded is string or null');
      throw new Error("Invalid refresh token");
    }

    console.log('Refresh token decoded successfully for user:', decoded.email);

    // Check if user exists and token is valid
    const user = await User.findOne({ 
      email: decoded?.email,
      'refreshTokens.token': refreshToken,
      'refreshTokens.isRevoked': false
    });

    if (!user) {
      console.log('User not found or refresh token not valid for user:', decoded.email);
      throw new Error("Invalid refresh token");
    }

    console.log('User found:', user.email, 'Status:', user.status, 'IsDeleted:', user.isDeleted);

    // Check if user is still active
    if (user.status === 'blocked' || user.isDeleted) {
      console.log('User account is blocked or deleted');
      throw new Error("User account is blocked or deleted");
    }

    // Generate new access token (10 hours)
    const newAccessToken = jwt.sign(
      {
        id: user?._id,
        email: user?.email,
        role: user?.role,
      },
      config.jwt_secret as string,
      { expiresIn: "15m" }
    );

    // Generate new refresh token (7 days)
    const newRefreshToken = jwt.sign(
      {
        id: user?._id,
        email: user?.email,
        role: user?.role,
      },
      config.jwt_refresh_secret as string,
      { expiresIn: "7d" }
    );

    console.log('New tokens generated successfully');

    // Revoke old refresh token and add new one (token rotation)
    // First remove the old token
    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
    
    // Then add the new token
    await User.findByIdAndUpdate(user._id, {
      $push: {
        refreshTokens: {
          token: newRefreshToken,
          createdAt: new Date(),
          isRevoked: false
        }
      }
    });

    console.log('Refresh token rotation completed');

    const result = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: user.toJSON(),
    };
    
    console.log('Refresh token service completed successfully');
    return result;
  } catch (error) {
    console.error('Refresh token service error:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Refresh token expired');
      throw new Error("Refresh token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid refresh token JWT error');
      throw new Error("Invalid refresh token");
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('Generic token refresh error:', errorMessage);
    throw new Error(`Token refresh failed: ${errorMessage}`);
  }
};

const logout = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;
    if (typeof decoded === 'string' || !decoded) {
      throw new Error("Invalid refresh token");
    }

    // Revoke the refresh token
    await User.findOneAndUpdate(
      { 
        email: decoded?.email,
        'refreshTokens.token': refreshToken 
      },
      { 
        $set: { 'refreshTokens.$.isRevoked': true } 
      }
    );

    return { success: true };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

const logoutAll = async (userId: string) => {
  try {
    // Revoke all refresh tokens for the user
    await User.findByIdAndUpdate(userId, {
      $set: { 'refreshTokens.$[].isRevoked': true }
    });

    return { success: true };
  } catch (error) {
    throw new Error("Failed to logout from all devices");
  }
};

export const AuthServices = {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  logoutAll,
};
