<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community - JongoCollab</title>
  <link rel="stylesheet" href="css/theme.css">
  <link rel="stylesheet" href="css/student_db.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body {
      background: var(--color-bg-main);
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
    }

    /* Community Header */
    .community-header {
      background: var(--color-bg-card);
      padding: 32px;
      border-radius: 16px;
      border: 2px solid var(--color-border);
      margin-bottom: 24px;
    }

    .community-title {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    /* Filters & Actions */
    .community-controls {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      gap: 8px;
      flex: 1;
      min-width: 200px;
    }

    .filter-btn {
      padding: 10px 20px;
      border: 2px solid var(--color-border);
      background: var(--color-bg-card);
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      color: var(--color-text-secondary);
      transition: all 0.2s ease;
    }

    .filter-btn:hover,
    .filter-btn.active {
      border-color: var(--color-accent);
      background: var(--color-accent-light);
      color: var(--color-accent);
    }

    .search-filter {
      flex: 1;
      min-width: 300px;
      position: relative;
    }

    .search-filter input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      border: 2px solid var(--color-border);
      border-radius: 10px;
      background: var(--color-bg-card);
      color: var(--color-text-primary);
      font-size: 15px;
    }

    .search-filter i {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
    }

    .post-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-neon-pink) 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--shadow-neon-purple);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .post-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 30px rgba(204, 0, 255, 0.5);
    }

    /* Posts Grid */
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    /* Post Card */
    .post-card {
      background: var(--color-bg-card);
      border: 2px solid var(--color-border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .post-card:hover {
      border-color: var(--color-accent);
      box-shadow: var(--shadow-md), var(--shadow-neon-purple);
      transform: translateY(-4px);
    }

    /* Post Header */
    .post-header {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--color-border);
    }

    .post-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-info) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 18px;
    }

    .post-author-info {
      flex: 1;
    }

    .post-author-name {
      font-weight: 700;
      color: var(--color-text-primary);
      display: block;
      margin-bottom: 2px;
    }

    .post-meta {
      display: flex;
      gap: 12px;
      font-size: 13px;
      color: var(--color-text-muted);
    }

    .university-badge {
      padding: 4px 10px;
      background: var(--color-accent-light);
      color: var(--color-accent);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Post Content */
    .post-content {
      padding: 20px;
    }

    .post-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 8px;
    }

    .post-description {
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .tag {
      padding: 6px 12px;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    /* Post Media */
    .post-media {
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-info) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 48px;
      border-radius: 12px;
      margin-bottom: 16px;
      position: relative;
      overflow: hidden;
    }

    .post-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-type-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 12px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }

    /* Post Actions */
    .post-actions {
      padding: 16px 20px;
      display: flex;
      gap: 8px;
      border-top: 1px solid var(--color-border);
    }

    .action-btn-small {
      flex: 1;
      padding: 10px;
      border: 2px solid var(--color-border);
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-weight: 600;
      color: var(--color-text-secondary);
      transition: all 0.2s ease;
    }

    .action-btn-small:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
      background: var(--color-accent-light);
    }

    .action-btn-small.liked {
      border-color: var(--color-error);
      color: var(--color-error);
      background: rgba(255, 68, 68, 0.1);
    }

    .collaborate-btn {
      border-color: var(--color-success);
      color: var(--color-success);
    }

    .collaborate-btn:hover {
      background: var(--color-success-light);
    }

    /* Stats */
    .post-stats {
      padding: 0 20px 16px;
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: var(--color-text-muted);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Post Modal */
    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--color-bg-card);
      border: 2px solid var(--color-border);
      border-radius: 16px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .modal-header {
      padding: 24px;
      border-bottom: 2px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .close-modal {
      background: none;
      border: none;
      font-size: 32px;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 8px;
      line-height: 1;
      transition: all 0.2s ease;
    }

    .close-modal:hover {
      color: var(--color-error);
    }

    .modal-body {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--color-text-primary);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--color-border);
      border-radius: 10px;
      background: var(--color-bg-main);
      color: var(--color-text-primary);
      font-family: inherit;
      font-size: 15px;
    }

    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }

    .file-upload-area {
      border: 2px dashed var(--color-border);
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .file-upload-area:hover {
      border-color: var(--color-accent);
      background: var(--color-accent-light);
    }

    .file-upload-area input {
      display: none;
    }

    .submit-post-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-neon-pink) 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: var(--shadow-neon-purple);
      transition: all 0.3s ease;
    }

    .submit-post-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 30px rgba(204, 0, 255, 0.5);
    }
.loading-spinner {
      text-align: center;
      padding: 40px;
      color: var(--color-text-muted);
      grid-column: 1/-1;
    }

    .loading-spinner i {
      font-size: 48px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--color-bg-card);
      border: 2px solid var(--color-border);
      border-radius: 12px;
      padding: 16px 24px;
      box-shadow: var(--shadow-lg);
      z-index: 2000;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      animation: slideIn 0.3s ease;
    }

    .toast.success { border-color: var(--color-success); }
    .toast.error { border-color: var(--color-error); }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    
    /* Responsive */
    @media (max-width: 768px) {
      .posts-grid {
        grid-template-columns: 1fr;
      }

      .community-controls {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    
    <!-- Sidebar - EXACT COPY FROM STUDENT_DB.HTML -->
    <aside class="sidebar">
      <div class="logo">
        <i class="fas fa-graduation-cap"></i>
        <span>JongoColab</span>
      </div>
      
      <ul class="nav-menu">
        <li class="nav-item">
          <a href="student_db.html" class="nav-link">
            <i class="fas fa-chart-line"></i>
            <span>Overview</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" onclick="navigateToMyProjects(); return false;">
            <i class="fas fa-folder"></i>
            <span>My Projects</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="community.html" class="nav-link active">
            <i class="fas fa-users"></i>
            <span>Community</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" onclick="navigateToSchoolChat(); return false;">
            <i class="fas fa-comments"></i>
            <span>School Chat</span>
            <span class="badge-count">3</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            <i class="fas fa-handshake"></i>
            <span>Collaborations</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            <i class="fas fa-chart-pie"></i>
            <span>Analytics</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="explore.html" class="nav-link">
            <i class="fas fa-book"></i>
            <span>Resources</span>
          </a>
        </li>
      </ul>

      <div class="upgrade-card">
        <i class="fas fa-crown"></i>
        <h3>Upgrade to Pro</h3>
        <p>Unlock premium features and unlimited storage</p>
        <button class="btn-upgrade">Upgrade Now</button>
      </div>

      <ul class="nav-menu nav-bottom">
        <li class="nav-item">
          <a href="#" class="nav-link">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            <i class="fas fa-question-circle"></i>
            <span>Help Center</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" onclick="logout(); return false;">
            <i class="fas fa-sign-out-alt"></i>
            <span>Log Out</span>
          </a>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      
      <!-- Community Header -->
      <div class="community-header">
        <h1 class="community-title">Community Hub</h1>
        <p style="color: var(--color-text-secondary); font-size: 16px;">
          Discover, collaborate, and share projects with students from universities worldwide
        </p>
      </div>

      <!-- Filters & Controls -->
      <div class="community-controls">
        <div class="filter-group">
          <button class="filter-btn active" data-filter="all">All Posts</button>
          <button class="filter-btn" data-filter="code">Code</button>
          <button class="filter-btn" data-filter="design">Design</button>
          <button class="filter-btn" data-filter="project">Projects</button>
        </div>

        <div class="search-filter">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search posts, users, tags..." id="searchInput">
        </div>

        <button class="post-btn" onclick="openPostModal()">
          <i class="fas fa-plus"></i>
          Create Post
        </button>
      </div>

      <!-- Posts Grid -->
      <div class="posts-grid" id="postsGrid">
        <div style="text-align: center; padding: 40px; color: var(--color-text-muted); grid-column: 1/-1;">
          <i class="fas fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
          <p>Loading posts...</p>
        </div>
      </div>

          <div class="post-content">
            <h3 class="post-title">Full-Stack E-Commerce Platform</h3>
            <p class="post-description">
              Built a complete e-commerce solution with React, Node.js, and MongoDB.
            </p>

            <div class="post-tags">
              <span class="tag">React</span>
              <span class="tag">Node.js</span>
              <span class="tag">MongoDB</span>
            </div>

            <div class="post-media">
              <i class="fas fa-code"></i>
              <span class="media-type-badge">GitHub</span>
            </div>

            <div class="post-stats">
              <span class="stat-item"><i class="fas fa-heart"></i> 234</span>
              <span class="stat-item"><i class="fas fa-comment"></i> 45</span>
              <span class="stat-item"><i class="fas fa-eye"></i> 1.2k</span>
            </div>
          </div>

          <div class="post-actions">
            <button class="action-btn-small" onclick="likePost(this)">
              <i class="fas fa-heart"></i> Like
            </button>
            <button class="action-btn-small">
              <i class="fas fa-comment"></i> Comment
            </button>
            <button class="action-btn-small collaborate-btn">
              <i class="fas fa-handshake"></i> Collaborate
            </button>
          </div>
        </div>

      </div>

    </main>
  </div>

  <!-- Create Post Modal -->
  <div class="modal" id="postModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Create New Post</h2>
        <button class="close-modal" onclick="closePostModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="createPostForm" onsubmit="handlePostSubmit(event)">
          <div class="form-group">
            <label>Post Title*</label>
            <input type="text" id="postTitle" placeholder="Enter post title..." required>
          </div>

          <div class="form-group">
            <label>Description*</label>
            <textarea id="postDescription" placeholder="Describe your project..." required></textarea>
          </div>

          <div class="form-group">
            <label>Category*</label>
            <select id="postCategory" required>
              <option value="">Select category</option>
              <option value="code">Code</option>
              <option value="design">Design</option>
              <option value="project">Project</option>
              <option value="research">Research</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" id="postTags" placeholder="React, Node.js, MongoDB...">
          </div>

          <div class="form-group">
            <label>Project Link (GitHub/Figma)</label>
            <input type="url" id="postLink" placeholder="https://github.com/username/project">
          </div>

          <div class="form-group">
            <label>Upload Image (optional)</label>
            <div class="file-upload-area" onclick="document.getElementById('fileInput').click()">
              <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: var(--color-accent); margin-bottom: 12px; display: block;"></i>
              <p style="margin: 0;">Click to upload project images or screenshots</p>
              <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 8px;">Supported: JPG, PNG, GIF (Max 5MB)</p>
              <input type="file" id="fileInput" accept="image/*" multiple>
            </div>
          </div>

          <button type="submit" class="submit-post-btn">Publish Post</button>
        </form>
      </div>
    </div>
  </div>


  
  <!-- Scripts -->
  <script src="js/student_db.js"></script>
  <script>
   // ===================================
// COMPLETE FIXED COMMUNITY.HTML JAVASCRIPT
// Replace the entire <script> section with this
// ===================================

// API Configuration - automatically uses same origin as frontend
const API_BASE_URL = window.location.origin + '/api';
let currentFilter = 'all';
let currentSearch = '';
let userLikes = new Set();

// Get auth token
const getAuthToken = () => localStorage.getItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};

// Show toast notification
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Format time ago
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

// Get initials from name
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Get category icon
const getCategoryIcon = (category) => {
  const icons = {
    code: 'fa-code',
    design: 'fa-palette',
    project: 'fa-folder',
    research: 'fa-flask'
  };
  return icons[category] || 'fa-file';
};

// Create post card HTML - FIXED ID comparison
const createPostCard = (post) => {
  const isLiked = userLikes.has(post._id);
  const authorInitials = getInitials(post.authorName);
  
  // Get current user info from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // FIXED: Extract author ID consistently
  let postAuthorId = post.author;
  
  // If author is populated (object), get the _id
  if (typeof post.author === 'object' && post.author !== null) {
    postAuthorId = post.author._id || post.author.id;
  }
  
  // FIXED: Compare as strings, handle both _id and id
  const currentUserId = currentUser.id || currentUser._id;
  const isOwner = String(postAuthorId) === String(currentUserId);
  
  // Debug logging (remove after fixing)
  if (post.title) {
    console.log('Post ownership check:', {
      postTitle: post.title,
      postAuthorId: String(postAuthorId),
      currentUserId: String(currentUserId),
      isOwner: isOwner
    });
  }
  
  return `
    <div class="post-card" data-category="${post.category}" data-id="${post._id}">
      <div class="post-header">
        <div class="post-avatar">${authorInitials}</div>
        <div class="post-author-info">
          <span class="post-author-name">${post.authorName}</span>
          <div class="post-meta">
            <span class="university-badge">${post.authorSchool}</span>
            <span>• ${timeAgo(post.createdAt)}</span>
          </div>
        </div>
        ${isOwner ? `
          <div style="margin-left: auto; display: flex; gap: 8px;">
            <button onclick="editPost('${post._id}')" style="padding: 8px 12px; border: 2px solid var(--color-border); background: transparent; border-radius: 8px; cursor: pointer; color: var(--color-text-secondary); transition: all 0.2s;">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deletePost('${post._id}')" style="padding: 8px 12px; border: 2px solid var(--color-error); background: transparent; border-radius: 8px; cursor: pointer; color: var(--color-error); transition: all 0.2s;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        ` : ''}
      </div>

      <div class="post-content">
        <h3 class="post-title">${post.title}</h3>
        <p class="post-description">${post.description}</p>

        ${post.tags && post.tags.length > 0 ? `
          <div class="post-tags">
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}

        <div class="post-media">
          <i class="fas ${getCategoryIcon(post.category)}"></i>
          ${post.link ? `<span class="media-type-badge">${post.link.includes('github') ? 'GitHub' : 'Link'}</span>` : ''}
        </div>

        <div class="post-stats">
          <span class="stat-item"><i class="fas fa-heart"></i> ${post.likes?.length || 0}</span>
          <span class="stat-item"><i class="fas fa-comment"></i> ${post.comments?.length || 0}</span>
          <span class="stat-item"><i class="fas fa-eye"></i> ${post.views || 0}</span>
        </div>
      </div>

      <div class="post-actions">
        <button class="action-btn-small ${isLiked ? 'liked' : ''}" onclick="likePost('${post._id}', this)">
          <i class="fas fa-heart"></i> ${isLiked ? 'Liked' : 'Like'}
        </button>
        <button class="action-btn-small" onclick="commentPost('${post._id}')">
          <i class="fas fa-comment"></i> Comment
        </button>
        <button class="action-btn-small collaborate-btn" onclick="collaboratePost('${post._id}')">
          <i class="fas fa-handshake"></i> Collaborate
        </button>
      </div>
    </div>
  `;
};

// Load posts from API
const loadPosts = async () => {
  try {
    const filters = {};
    if (currentFilter !== 'all') filters.category = currentFilter;
    if (currentSearch) filters.search = currentSearch;
    
    const response = await apiRequest(`/posts?${new URLSearchParams(filters)}`);
    
    const postsGrid = document.getElementById('postsGrid');
    
    if (response.data.length === 0) {
      postsGrid.innerHTML = `
        <div style="text-align: center; padding: 80px 20px; color: var(--color-text-muted); grid-column: 1/-1;">
          <i class="fas fa-inbox" style="font-size: 64px; margin-bottom: 16px; opacity: 0.5; display: block;"></i>
          <h3>No posts found</h3>
          <p>Be the first to share your project!</p>
        </div>
      `;
      return;
    }
    
    postsGrid.innerHTML = response.data.map(post => createPostCard(post)).join('');
    
  } catch (error) {
    console.error('Error loading posts:', error);
    showToast('Failed to load posts', 'error');
    document.getElementById('postsGrid').innerHTML = `
      <div style="text-align: center; padding: 80px 20px; color: var(--color-text-muted); grid-column: 1/-1;">
        <i class="fas fa-exclamation-triangle" style="font-size: 64px; margin-bottom: 16px; opacity: 0.5; display: block;"></i>
        <h3>Error loading posts</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
};

// Filter posts
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    loadPosts();
  });
});

// Search functionality
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value;
    loadPosts();
  }, 500);
});

// Like post
const likePost = async (postId, btn) => {
  try {
    const response = await apiRequest(`/posts/${postId}/like`, { method: 'POST' });
    
    if (response.liked) {
      btn.classList.add('liked');
      btn.innerHTML = '<i class="fas fa-heart"></i> Liked';
      userLikes.add(postId);
    } else {
      btn.classList.remove('liked');
      btn.innerHTML = '<i class="fas fa-heart"></i> Like';
      userLikes.delete(postId);
    }
    
    const card = btn.closest('.post-card');
    const likeCount = card.querySelector('.stat-item:first-child');
    likeCount.innerHTML = `<i class="fas fa-heart"></i> ${response.likeCount}`;
    
  } catch (error) {
    console.error('Error liking post:', error);
    showToast('Failed to like post. Please try again.', 'error');
  }
};

// Comment on post
const commentPost = (postId) => {
  const text = prompt('Enter your comment:');
  if (text) {
    apiRequest(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text })
    })
    .then(() => {
      showToast('Comment added successfully');
      loadPosts();
    })
    .catch(error => {
      console.error('Error adding comment:', error);
      showToast('Failed to add comment. Please try again.', 'error');
    });
  }
};

// Collaborate on post
const collaboratePost = (postId) => {
  const message = prompt('Why would you like to collaborate?');
  if (message) {
    apiRequest(`/posts/${postId}/collaborate`, {
      method: 'POST',
      body: JSON.stringify({ message })
    })
    .then(() => {
      showToast('Collaboration request sent!');
    })
    .catch(error => {
      console.error('Error sending collaboration request:', error);
      showToast('Failed to send collaboration request. Please try again.', 'error');
    });
  }
};

// Modal functions
const openPostModal = () => {
  document.getElementById('postModal').classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closePostModal = () => {
  document.getElementById('postModal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('createPostForm').reset();
  // Reset modal title and form handler to default
  document.querySelector('.modal-title').textContent = 'Create New Post';
  document.getElementById('createPostForm').onsubmit = handlePostSubmit;
};

// Close modal on outside click
document.getElementById('postModal').addEventListener('click', (e) => {
  if (e.target.id === 'postModal') {
    closePostModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('postModal').classList.contains('active')) {
    closePostModal();
  }
});

// Handle form submission - SINGLE VERSION
const handlePostSubmit = async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('.submit-post-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Publishing...';
  
  try {
    // Debug: Check what we're sending
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = getAuthToken();
    
    console.log('Creating post with:', {
      user: currentUser,
      hasToken: !!token
    });
    
    const postData = {
      title: document.getElementById('postTitle').value,
      description: document.getElementById('postDescription').value,
      category: document.getElementById('postCategory').value,
      tags: document.getElementById('postTags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t),
      link: document.getElementById('postLink').value || ''
    };
    
    console.log('Post data:', postData);
    
    const response = await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
    
    console.log('Post created:', response);
    
    showToast('Post created successfully!');
    closePostModal();
    loadPosts();
    
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Show more detailed error
    let errorMessage = 'Failed to create post';
    if (error.message.includes('401')) {
      errorMessage = 'Please log in again to create a post';
    } else if (error.message.includes('403')) {
      errorMessage = 'You do not have permission to create posts';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showToast(errorMessage, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Publish Post';
  }
};

// Edit post
const editPost = async (postId) => {
  try {
    // Get the post data
    const response = await apiRequest(`/posts/${postId}`);
    const post = response.data;
    
    // Fill the form with existing data
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDescription').value = post.description;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postTags').value = post.tags.join(', ');
    document.getElementById('postLink').value = post.link || '';
    
    // Change modal title
    document.querySelector('.modal-title').textContent = 'Edit Post';
    
    // Change form submit handler
    const form = document.getElementById('createPostForm');
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const submitBtn = e.target.querySelector('.submit-post-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Updating...';
      
      try {
        const postData = {
          title: document.getElementById('postTitle').value,
          description: document.getElementById('postDescription').value,
          category: document.getElementById('postCategory').value,
          tags: document.getElementById('postTags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t),
          link: document.getElementById('postLink').value || ''
        };
        
        await apiRequest(`/posts/${postId}`, {
          method: 'PUT',
          body: JSON.stringify(postData)
        });
        
        showToast('Post updated successfully!');
        closePostModal();
        loadPosts();
        
      } catch (error) {
        console.error('Error updating post:', error);
        showToast(error.message || 'Failed to update post', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Post';
      }
    };
    
    // Open modal
    openPostModal();
    
  } catch (error) {
    console.error('Error loading post for edit:', error);
    showToast('Failed to load post data', 'error');
  }
};

// Delete post
const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return;
  }
  
  try {
    await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
    showToast('Post deleted successfully!');
    loadPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
    showToast(error.message || 'Failed to delete post', 'error');
  }
};

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
  loadPosts();
});
  </script>
</body>
</html>

// ===================================
// UPDATED backend/routes/auth.js
// With auto-approve option for testing
// ===================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const School = require('../models/School');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ===================================
// REGISTER - AUTO APPROVE FOR TESTING
// ===================================
router.post('/register', [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('schoolName').notEmpty(),
  body('department').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, schoolName, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Find or create school
    let school = await School.findOne({ name: schoolName });
    if (!school) {
      school = await School.create({
        name: schoolName,
        abbreviation: schoolName.substring(0, 4).toUpperCase()
      });
    }

    // ===================================
    // AUTO-APPROVE LOGIC
    // ===================================
    // Option 1: Auto-approve everyone (for testing/development)
    const autoApprove = process.env.AUTO_APPROVE === 'true';
    
    // Option 2: Auto-approve specific domains (for production)
    const autoApproveDomains = process.env.AUTO_APPROVE_DOMAINS 
      ? process.env.AUTO_APPROVE_DOMAINS.split(',') 
      : [];
    const emailDomain = email.split('@')[1];
    const shouldAutoApprove = autoApprove || autoApproveDomains.includes(emailDomain);
    
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      schoolName: school.name,
      department,
      approvalStatus: shouldAutoApprove ? 'approved' : 'pending',
      role: 'student'
    });

    // If auto-approved, return token immediately
    if (shouldAutoApprove) {
      const token = generateToken(user._id);
      
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to JongoCollab.',
        autoApproved: true,
        data: {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            school: user.schoolName,
            department: user.department,
            approvalStatus: user.approvalStatus
          }
        }
      });
    }

    // Otherwise, return pending status
    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.',
      autoApproved: false,
      data: {
        userId: user._id,
        email: user.email,
        approvalStatus: user.approvalStatus
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// ===================================
// LOGIN
// ===================================
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.approvalStatus === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait for approval.',
        approvalStatus: 'pending'
      });
    }

    if (user.approvalStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account registration was rejected. Please contact support.',
        approvalStatus: 'rejected'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          school: user.schoolName,
          department: user.department,
          approvalStatus: user.approvalStatus
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// ===================================
// GET CURRENT USER
// ===================================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        school: user.schoolName,
        department: user.department,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

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
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating post'
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
    
    // Check if already requested - FIXED variable name conflict
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

module.exports = router;
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Post description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['code', 'design', 'project', 'research'],
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  link: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorSchool: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  collaborationRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

module.exports = mongoose.model('Post', postSchema);
// ===================================
// FIXED User Model
// File: backend/models/User.js
// ===================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['student', 'supervisor', 'admin'],
    default: 'student'
  },
  // Changed: Made school field optional since we're using schoolName
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: false  // Changed from required to optional
  },
  schoolName: {
    type: String,
    required: [true, 'School name is required']
  },
  department: {
    type: String,
    enum: ['software', 'ai', 'networking', 'hardware', 'other'],
    required: [true, 'Department is required']
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  arrivalDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
// ===================================
// FIXED backend/middleware/auth.js
// With detailed debugging
// ===================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Has Authorization header:', !!req.headers.authorization);
    console.log('Token extracted:', token ? 'YES' : 'NO');

    if (!token) {
      console.log('ERROR: No token found');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { userId: decoded.id });
    } catch (jwtError) {
      console.log('ERROR: Token verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token'
      });
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('ERROR: User not found in database for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', {
      id: req.user._id,
      email: req.user.email,
      name: `${req.user.firstName} ${req.user.lastName}`,
      approvalStatus: req.user.approvalStatus
    });

    // CRITICAL FIX: Check if user is approved
    if (req.user.approvalStatus !== 'approved') {
      console.log('ERROR: User not approved. Status:', req.user.approvalStatus);
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval',
        approvalStatus: req.user.approvalStatus
      });
    }

    console.log('Auth successful - proceeding to route handler');
    console.log('=== END AUTH DEBUG ===\n');

    next();
  } catch (error) {
    console.log('ERROR: Unexpected auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Check if user is supervisor
const isSupervisor = (req, res, next) => {
  if (req.user.role !== 'supervisor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Supervisor only.'
    });
  }
  next();
};

module.exports = { protect, isAdmin, isSupervisor };
// ===================================
// FIXED Database Connection
// File: backend/config/db.js
// ===================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB without deprecated options
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;