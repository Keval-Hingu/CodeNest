// src/controllers/userController.js

import User from '../models/user.model.js';

// @desc    Get a user's public profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserProfileById = async (req, res) => {
    try {
        
        const user = await User.findById(req.params.id).select('-password -dsaProgress -uploadedResources');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Get the profile of the authenticated user
// @route   GET /api/users/me
// @access  Private
export const getMyProfile = async (req, res) => {
    try {  
        
        const user = await User.findById(req.user.id).select('-password');
        console.log(user);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error( " Error in getMyProfile controller in UserController :" + error.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Update the authenticated user's profile
// @route   PUT /api/users/me
// @access  Private
export const updateMyProfile = async (req, res) => {
    const { name, bio, github, linkedin } = req.body;

    const profileFields = {
        name,
        bio,
        github,
        linkedin
    };

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { profile: profileFields } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
