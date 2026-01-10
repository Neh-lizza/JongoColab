// routes/collaborations.js - COMPLETE FIXED VERSION
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/collaborations/requests
// @desc    Get all collaboration requests for the logged-in user's posts
// @access  Private
router.get('/requests', protect, async (req, res) => {
  try {
    console.log('🔔 Fetching collaboration requests for user:', req.user._id);
    
    // Find all posts by the current user that have collaboration requests
    const posts = await Post.find({ 
      author: req.user._id,
      'collaborationRequests.0': { $exists: true }
    })
    .select('title collaborationRequests')
    .populate('collaborationRequests.user', 'firstName lastName schoolName profilePicture');
    
    console.log(`📊 Found ${posts.length} posts with collaboration requests`);
    
    // Flatten all requests from all posts
    const requests = [];
    posts.forEach(post => {
      post.collaborationRequests.forEach(request => {
        requests.push({
          _id: request._id,
          postId: post._id,
          postTitle: post.title,
          userId: request.user?._id || request.user,
          userName: request.userName,
          userSchool: request.user?.schoolName || 'Unknown School',
          userProfilePicture: request.user?.profilePicture || null,
          message: request.message,
          status: request.status,
          createdAt: request.createdAt
        });
      });
    });
    
    // Sort by date (newest first)
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`✅ Returning ${requests.length} total collaboration requests`);
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
    
  } catch (error) {
    console.error('❌ Error fetching collaboration requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching collaboration requests',
      error: error.message
    });
  }
});

// @route   PUT /api/collaborations/:postId/:requestId
// @desc    Accept or reject collaboration request
// @access  Private
router.put('/:postId/:requestId', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    console.log('🔄 Updating collaboration request:', {
      postId: req.params.postId,
      requestId: req.params.requestId,
      newStatus: status,
      user: req.user._id
    });
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "rejected"'
      });
    }
    
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      console.log('❌ Post not found:', req.params.postId);
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check ownership - only post author can accept/reject
    if (post.author.toString() !== req.user._id.toString()) {
      console.log('❌ Authorization failed:', {
        postAuthor: post.author.toString(),
        requestUser: req.user._id.toString()
      });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage collaboration requests for this post'
      });
    }
    
    // Find the specific collaboration request
    const request = post.collaborationRequests.id(req.params.requestId);
    
    if (!request) {
      console.log('❌ Request not found:', req.params.requestId);
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found'
      });
    }
    
    // Update status
    request.status = status;
    await post.save();
    
    console.log('✅ Collaboration request updated successfully');
    
    res.status(200).json({
      success: true,
      message: `Collaboration request ${status}`,
      data: {
        _id: request._id,
        status: request.status,
        postId: post._id,
        postTitle: post.title
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating collaboration request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating collaboration request',
      error: error.message
    });
  }
});

// @route   GET /api/collaborations/sent
// @desc    Get all collaboration requests sent by the logged-in user
// @access  Private
router.get('/sent', protect, async (req, res) => {
  try {
    console.log('📤 Fetching sent collaboration requests for user:', req.user._id);
    
    // Find all posts where current user has sent collaboration requests
    const posts = await Post.find({
      'collaborationRequests.user': req.user._id
    })
    .select('title author collaborationRequests')
    .populate('author', 'firstName lastName schoolName');
    
    // Filter to get only requests from current user
    const sentRequests = [];
    posts.forEach(post => {
      const userRequests = post.collaborationRequests.filter(
        request => request.user.toString() === req.user._id.toString()
      );
      
      userRequests.forEach(request => {
        sentRequests.push({
          _id: request._id,
          postId: post._id,
          postTitle: post.title,
          postAuthor: post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown',
          postAuthorSchool: post.author?.schoolName || 'Unknown School',
          message: request.message,
          status: request.status,
          createdAt: request.createdAt
        });
      });
    });
    
    // Sort by date
    sentRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`✅ Returning ${sentRequests.length} sent requests`);
    
    res.status(200).json({
      success: true,
      count: sentRequests.length,
      data: sentRequests
    });
    
  } catch (error) {
    console.error('❌ Error fetching sent requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching sent requests',
      error: error.message
    });
  }
});

// @route   DELETE /api/collaborations/:postId/:requestId
// @desc    Delete/cancel a collaboration request (for sender)
// @access  Private
router.delete('/:postId/:requestId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const request = post.collaborationRequests.id(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    // Only the sender can delete their own request
    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }
    
    // Remove the request
    request.remove();
    await post.save();
    
    console.log('✅ Collaboration request cancelled');
    
    res.status(200).json({
      success: true,
      message: 'Collaboration request cancelled'
    });
    
  } catch (error) {
    console.error('❌ Error deleting request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;