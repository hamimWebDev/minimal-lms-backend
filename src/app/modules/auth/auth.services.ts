

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
    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;
    if (typeof decoded === 'string' || !decoded) {
      throw new Error("Invalid refresh token");
    }

    const user = await User.findOne({ 
      email: decoded?.email,
      'refreshTokens.token': refreshToken,
      'refreshTokens.isRevoked': false
    });

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
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

    // Revoke old refresh token and add new one (token rotation)
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

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: user.toJSON(),
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
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
