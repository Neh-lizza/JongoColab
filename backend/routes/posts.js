const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, author, limit = 20, page = 1 } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (author) {
      query.author = author;
    }
    
    // Execute query with pagination
    const posts = await Post.find(query)
      .populate('author', 'firstName lastName schoolName department profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Post.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching posts'
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName schoolName department profilePicture')
      .populate('comments.user', 'firstName lastName profilePicture');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching post'
    });
  }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', [
  protect,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['code', 'design', 'project', 'research']).withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { title, description, category, tags, link, images } = req.body;
    
    // Validate images if provided
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Check if it's a valid base64 string
        if (!image.startsWith('data:image/')) {
          return res.status(400).json({
            success: false,
            message: 'Invalid image format. Must be base64 encoded.'
          });
        }
        
        // Check image size (approximately 2MB for base64)
        // Base64 is ~33% larger than original, so 2MB original ≈ 2.7MB base64
        if (image.length > 2.7 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: 'Image size too large. Maximum 2MB per image.'
          });
        }
      }
    }
    
    // Create post - use req.user._id from protect middleware
    const post = await Post.create({
      title,
      description,
      category,
      tags: tags || [],
      link: link || '',
      images: images || [],
      author: req.user._id,
      authorName: `${req.user.firstName} ${req.user.lastName}`,
      authorSchool: req.user.schoolName
    });
    
    // Populate author details
    await post.populate('author', 'firstName lastName schoolName department profilePicture');
    
    console.log('Post created successfully:', {
      id: post._id,
      title: post.title,
      hasImages: post.images && post.images.length > 0,
      imageCount: post.images?.length || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating post',
      error: error.message
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private (author only)
router.put('/:id', [
  protect,
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('category').optional().isIn(['code', 'design', 'project', 'research'])
], async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get both possible user IDs for comparison
    const postAuthorId = post.author.toString();
    const currentUserId = req.user._id.toString();
    
    console.log('Update authorization check:', {
      postAuthor: postAuthorId,
      requestUser: currentUserId,
      match: postAuthorId === currentUserId
    });
    
    // Check ownership
    if (postAuthorId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    const { title, description, category, tags, link, images } = req.body;
    
    // Validate images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Check if it's a valid base64 string
        if (!image.startsWith('data:image/')) {
          return res.status(400).json({
            success: false,
            message: 'Invalid image format. Must be base64 encoded.'
          });
        }
        
        // Check image size
        if (image.length > 2.7 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: 'Image size too large. Maximum 2MB per image.'
          });
        }
      }
    }
    
    post.title = title || post.title;
    post.description = description || post.description;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.link = link !== undefined ? link : post.link;
    post.images = images || post.images;
    post.updatedAt = Date.now();
    
    await post.save();
    await post.populate('author', 'firstName lastName schoolName department profilePicture');
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating post',
      error: error.message
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private (author only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get both possible user IDs for comparison
    const postAuthorId = post.author.toString();
    const currentUserId = req.user._id.toString();
    
    console.log('Delete authorization check:', {
      postAuthor: postAuthorId,
      requestUser: currentUserId,
      match: postAuthorId === currentUserId
    });
    
    // Check ownership
    if (postAuthorId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }
    
    await post.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting post',
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      liked: likeIndex === -1,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling like'
    });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', [
  protect,
  body('text').trim().notEmpty().withMessage('Comment text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const comment = {
      user: req.user._id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      text: req.body.text
    };
    
    post.comments.unshift(comment);
    await post.save();
    await post.populate('comments.user', 'firstName lastName profilePicture');
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post.comments[0]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment'
    });
  }
});

// @route   POST /api/posts/:id/collaborate
// @desc    Send collaboration request
// @access  Private
router.post('/:id/collaborate', [
  protect,
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if already requested
    const existingRequest = post.collaborationRequests.find(
      collab => collab.user.toString() === req.user._id.toString()
    );
    
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Collaboration request already sent'
      });
    }
    
    const request = {
      user: req.user._id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      message: req.body.message
    };
    
    post.collaborationRequests.push(request);
    await post.save();
    
    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully'
    });
  } catch (error) {
    console.error('Error sending collaboration request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending collaboration request'
    });
  }
});

// @route   GET /api/posts/:id/image/:index
// @desc    Get post image by index
// @access  Public
router.get('/:id/image/:index', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const imageIndex = parseInt(req.params.index);
    
    if (!post.images || !post.images[imageIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    const base64Image = post.images[imageIndex];
    
    // Extract the image data
    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format'
      });
    }
    
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const mimeType = matches[1];
    
    res.set('Content-Type', mimeType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(imageBuffer);
    
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching image'
    });
  }
});

module.exports = router;