"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
            return;
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
            // Check if the role in the token is allowed
            if (!allowedRoles.includes(decoded?.role)) {
                res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource' });
                return;
            }
            // Attach decoded user info to the request
            req.user = decoded; // req.user should be typed via declaration merging
            next();
        }
        catch (err) {
            // Handle specific JWT errors if needed (e.g., TokenExpiredError)
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({ success: false, message: 'Unauthorized: Token expired' });
                return;
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
                return;
            }
            // Generic error
            res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
            return;
        }
    };
};
exports.default = auth;
