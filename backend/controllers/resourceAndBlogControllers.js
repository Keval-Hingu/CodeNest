import Resource from '../models/resource.model.js';
import User from '../models/user.model.js';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 }).populate('author', 'username');
        res.json(resources);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single resource by ID
// @route   GET /api/resources/:id
// @access  Public
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('author', 'username');

        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        res.json(resource);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Resource not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req, res) => {
    const { title, content, link, fileUrl, type, subject } = req.body;

    try {
        // Find the authenticated user
        const user = await User.findById(req.user.id).select('-password');
        
        const newResource = new Resource({
            title,
            content,
            link,
            fileUrl,
            type,
            subject,
            author: user.id
        });

        const resource = await newResource.save();
        res.status(201).json(resource);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update an existing resource
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = async (req, res) => {
    const { title, content, link,fileUrl, type, subject } = req.body;

    try {
        let resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Check if the authenticated user is the author
        if (resource.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updatedResource = await Resource.findByIdAndUpdate(
            req.params.id,
            { $set: { title, content, link,fileUrl, type, subject } },
            { new: true }
        );

        res.json(updatedResource);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Resource not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Check if the authenticated user is the author
        if (resource.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await resource.deleteOne();

        res.json({ msg: 'Resource removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Resource not found' });
        }
        res.status(500).send('Server Error');
    }
};