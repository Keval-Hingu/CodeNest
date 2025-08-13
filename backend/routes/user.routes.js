// src/routes/userRoutes.js

import express from 'express';
import * as userController from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


// @route   GET /api/users/me
// @desc    Get the profile of the authenticated user
// @access  Private
router.get('/me', authMiddleware, userController.getMyProfile);

// @route   PUT /api/users/me
// @desc    Update the authenticated user's profile
// @access  Private
router.put('/me', authMiddleware, userController.updateMyProfile);

// @route   GET /api/users/:id
// @desc    Get a user's public profile by ID
// @access  Public
router.get('/:id', userController.getUserProfileById);


export default router;