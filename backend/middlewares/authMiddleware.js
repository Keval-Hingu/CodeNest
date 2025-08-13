// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Get the JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = async (req, res, next) => {
    // The token is now in req.cookies, thanks to cookie-parser
    const token = req.cookies.token;

    if (!token) {
        // This error message now correctly reflects that no token was found in the cookie
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);

        // console.log("Decoded object in middleware : ", decoded);
        // Find the user and attach to the request
        req.user = await User.findById(decoded.id).select('-password');
        // console.log("User in middleware :" + req.user);
        if (!req.user) {
            return res.status(401).json({ msg: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        console.error(error.message);

        res.status(401).json({ msg: 'Not authorized, token failed' });
    }
};
export default authMiddleware;