// src/controllers/authControllers.js

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Get the JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }

        // 2. Create a new user instance
        user = new User({
            username,
            email,
            password, // Password will be hashed by the pre-save hook in the User model
        });

        // 3. Save the new user to the database
        await user.save();

        // 4. Generate a token
        const token = generateToken(user._id);

        // Set the token as a secure, httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'strict', // Mitigate CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 2. Compare the provided password with the hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 3. Generate a token
        const token = generateToken(user._id);

        // Set the token as a secure, httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        // The user object is attached to the request by the authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error in authrntication Controller :", error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Log out the user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    // For a stateless token-based system, logging out primarily happens on the client side
    // by deleting the token. This endpoint is a confirmation.

    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0), // Set the expiry date to a past time
    });

    res.status(200).json({ msg: 'Logout successful' });
};

export {login , logout , getMe ,register, generateToken};