const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/collaborations/requests
// @desc    Get all collaboration requests for the logged-in user's posts
// @access  Private
router.get('/requests', protect, async (req, res) => {
  try {
    const posts = await Post.find({ 
      author: req.user._id,
      'collaborationRequests.0': { $exists: true }
    })
    .select('title collaborationRequests')
    .populate('collaborationRequests.user', 'firstName lastName schoolName profilePicture');
    
    // Flatten all requests
    const requests = [];
    posts.forEach(post => {
      post.collaborationRequests.forEach(request => {
        requests.push({
          _id: request._id,
          postId: post._id,
          postTitle: post.title,
          user: request.user,
          userName: request.userName,
          message: request.message,
          status: request.status,
          createdAt: request.createdAt
        });
      });
    });
    
    // Sort by date
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
    
  } catch (error) {
    console.error('Error fetching collaboration requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching collaboration requests'
    });
  }
});

// @route   PUT /api/collaborations/:postId/:requestId
// @desc    Accept or reject collaboration request
// @access  Private
router.put('/:postId/:requestId', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Find and update request
    const request = post.collaborationRequests.id(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    request.status = status;
    await post.save();
    
    res.status(200).json({
      success: true,
      message: `Request ${status}`,
      data: request
    });
    
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;