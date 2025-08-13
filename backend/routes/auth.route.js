// src/routes/authRoutes.js

import express from "express";
const router = express.Router();
import { login , logout , register , getMe } from '../controllers/authControllers.js';
import authMiddleware from "../middlewares/authMiddleware.js";

// route : /api/auth

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current authenticated user's profile
// @access  Private
router.get('/me', authMiddleware, getMe);

// Note: A "logout" route on a stateless API typically just provides a success message,
// as the client is responsible for deleting the token.
// @route   POST /api/auth/logout
// @desc    Log out the user (for client-side token deletion)
// @access  Private
router.get('/logout', authMiddleware,logout);

export default router;