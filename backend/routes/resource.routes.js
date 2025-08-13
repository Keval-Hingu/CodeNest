import express from 'express';
import { getAllResources,getResourceById ,createResource , deleteResource, updateResource} from '../controllers/resourceAndBlogControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all resources with optional filtering and sorting
// @access  Public
router.get('/', getAllResources);

// @route   POST /api/resources
// @desc    Create a new resource (blog, article, link, etc.)
// @access  Private
router.post('/', authMiddleware, createResource);


// @route   GET /api/resources/:id
// @desc    Get a single resource by its ID
// @access  Public
router.get('/:id', getResourceById);

// @route   PUT /api/resources/:id
// @desc    Update an existing resource
// @access  Private
router.put('/:id', authMiddleware, updateResource);

// @route   DELETE /api/resources/:id
// @desc    Delete a resource
// @access  Private
router.delete('/:id', authMiddleware,deleteResource);

export default router;