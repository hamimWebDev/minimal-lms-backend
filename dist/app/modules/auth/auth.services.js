"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const registerUser = async (name, email, password) => {
    // Check if user already exists
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    // Create user with default role 'user' and status 'in-progress'
    // Password will be automatically hashed by the User model pre-save middleware
    const userData = {
        name,
        email,
        password,
        role: 'user',
        status: 'in-progress',
        isDeleted: false,
    };
    const user = await user_model_1.User.create(userData);
    // Use toJSON to automatically exclude password field
    return user.toJSON();
};
const loginUser = async (email, password) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const isMatch = await bcrypt_1.default.compare(password, user?.password);
    if (!isMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid credentials");
    }
    // Generate access token (15 minutes)
    const accessToken = jsonwebtoken_1.default.sign({
        id: user?._id,
        email: user?.email,
        role: user?.role,
    }, config_1.default.jwt_secret, { expiresIn: "15m" });
    // Generate refresh token (7 days)
    const refreshToken = jsonwebtoken_1.default.sign({
        id: user?._id,
        email: user?.email,
        role: user?.role,
    }, config_1.default.jwt_refresh_secret, { expiresIn: "7d" });
    // Store refresh token in user document for rotation
    await user_model_1.User.findByIdAndUpdate(user._id, {
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
const refreshToken = async (refreshToken) => {
    try {
        console.log('Refresh token service called with token:', refreshToken ? 'present' : 'missing');
        // Verify the refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
        if (typeof decoded === 'string' || !decoded) {
            console.log('Invalid refresh token - decoded is string or null');
            throw new Error("Invalid refresh token");
        }
        console.log('Refresh token decoded successfully for user:', decoded.email);
        // Check if user exists and token is valid
        const user = await user_model_1.User.findOne({
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
        const newAccessToken = jsonwebtoken_1.default.sign({
            id: user?._id,
            email: user?.email,
            role: user?.role,
        }, config_1.default.jwt_secret, { expiresIn: "15m" });
        // Generate new refresh token (7 days)
        const newRefreshToken = jsonwebtoken_1.default.sign({
            id: user?._id,
            email: user?.email,
            role: user?.role,
        }, config_1.default.jwt_refresh_secret, { expiresIn: "7d" });
        console.log('New tokens generated successfully');
        // Revoke old refresh token and add new one (token rotation)
        // First remove the old token
        await user_model_1.User.findByIdAndUpdate(user._id, {
            $pull: { refreshTokens: { token: refreshToken } }
        });
        // Then add the new token
        await user_model_1.User.findByIdAndUpdate(user._id, {
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
    }
    catch (error) {
        console.error('Refresh token service error:', error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.log('Refresh token expired');
            throw new Error("Refresh token expired");
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log('Invalid refresh token JWT error');
            throw new Error("Invalid refresh token");
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log('Generic token refresh error:', errorMessage);
        throw new Error(`Token refresh failed: ${errorMessage}`);
    }
};
const logout = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
        if (typeof decoded === 'string' || !decoded) {
            throw new Error("Invalid refresh token");
        }
        // Revoke the refresh token
        await user_model_1.User.findOneAndUpdate({
            email: decoded?.email,
            'refreshTokens.token': refreshToken
        }, {
            $set: { 'refreshTokens.$.isRevoked': true }
        });
        return { success: true };
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
};
const logoutAll = async (userId) => {
    try {
        // Revoke all refresh tokens for the user
        await user_model_1.User.findByIdAndUpdate(userId, {
            $set: { 'refreshTokens.$[].isRevoked': true }
        });
        return { success: true };
    }
    catch (error) {
        throw new Error("Failed to logout from all devices");
    }
};
exports.AuthServices = {
    registerUser,
    loginUser,
    refreshToken,
    logout,
    logoutAll,
};
