const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getAllPosts, 
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getSimilarPosts,
  getCategories,
  approvePost
} = require('../controllers/post.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getAllPosts);
router.get('/categories', getCategories);
router.get('/my', protect, authorize('LANDLORD', 'ADMIN'), getMyPosts);
router.patch('/:id/approve', protect, authorize('ADMIN'), approvePost);
router.get('/:id', getPostById);
router.get('/:id/similar', getSimilarPosts);
router.post('/', protect, authorize('LANDLORD', 'ADMIN'), createPost);
router.put('/:id', protect, authorize('LANDLORD', 'ADMIN'), updatePost);
router.delete('/:id', protect, authorize('LANDLORD', 'ADMIN'), deletePost);

module.exports = router;
