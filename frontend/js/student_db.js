// ========================
// DASHBOARD SCRIPTS
// ========================

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  const sidebarEl = document.querySelector('.sidebar');
  const menuToggleEl = document.getElementById('menuToggle');
  
  if (sidebarEl && menuToggleEl && window.innerWidth <= 968) {
    if (!sidebarEl.contains(e.target) && !menuToggleEl.contains(e.target)) {
      sidebarEl.classList.remove('open');
    }
  }
});
// Navigation Active State
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    if (this.getAttribute('data-page')) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Close mobile menu
      if (window.innerWidth <= 968) {
        sidebar.classList.remove('open');
      }
      
      // You can add page switching logic here
      console.log('Navigating to:', this.getAttribute('data-page'));
    }
  });
});

// Auto-update Date Range
function updateDateRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const formatDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  const dateRangeText = document.getElementById('dateRangeText');
  if (dateRangeText) {
    dateRangeText.textContent = `${formatDate(firstDay)} - ${formatDate(lastDay)}`;
  }
}

updateDateRange();

// Filter Buttons
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // You can add filtering logic here
    console.log('Filter:', this.textContent);
  });
});

// Chart Bar Hover Effect with Tooltips
const chartBars = document.querySelectorAll('.chart-bar');

chartBars.forEach(bar => {
  bar.addEventListener('mouseenter', function() {
    const value = this.getAttribute('data-value');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.textContent = `${value} projects`;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--color-text-primary);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      z-index: 10;
      box-shadow: var(--shadow-lg);
    `;
    
    // Add arrow
    const arrow = document.createElement('div');
    arrow.style.cssText = `
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid var(--color-text-primary);
    `;
    tooltip.appendChild(arrow);
    
    this.style.position = 'relative';
    this.appendChild(tooltip);
  });
  
  bar.addEventListener('mouseleave', function() {
    const tooltip = this.querySelector('.chart-tooltip');
    if (tooltip) tooltip.remove();
  });
});

// Action Buttons
document.querySelector('.btn-upload')?.addEventListener('click', () => {
  alert('Opening project upload form...');
  // You can replace this with actual modal opening logic
});

document.querySelector('.btn-collaborate')?.addEventListener('click', () => {
  alert('Finding collaborators...');
  // Navigate to collaborations page
});

document.querySelector('.btn-join-chat')?.addEventListener('click', () => {
  alert('Joining school chat room...');
  // Navigate to chat page
});

// Calendar Navigation
const calendarNav = document.querySelectorAll('.calendar-nav .icon-btn');

calendarNav.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const direction = index === 0 ? 'prev' : 'next';
    console.log(`Navigating ${direction} month`);
    // Add calendar navigation logic here
  });
});

// Table View Buttons
const viewBtns = document.querySelectorAll('.btn-view');

viewBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const row = this.closest('tr');
    const projectName = row.querySelector('strong').textContent;
    alert(`Opening project: ${projectName}`);
    // Navigate to project details page
  });
});

// ========================
// FIXED NOTIFICATION FUNCTIONS FOR STUDENT_DB.JS
// Replace the notification section in your student_db.js with this
// ========================

let collaborationRequests = [];

async function loadCollaborationRequests() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found');
      return;
    }
    
    const response = await fetch(window.location.origin + '/api/collaborations/requests', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      collaborationRequests = data.data;
      updateNotificationBadge();
      renderNotifications();
    }
  } catch (error) {
    console.error('Error loading requests:', error);
  }
}

function updateNotificationBadge() {
  const dot = document.getElementById('notificationDot');
  
  // Check if element exists before trying to modify it
  if (!dot) {
    console.warn('Notification badge element not found');
    return;
  }
  
  const pendingCount = collaborationRequests.filter(r => r.status === 'pending').length;
  
  if (pendingCount > 0) {
    dot.style.display = 'block';
  } else {
    dot.style.display = 'none';
  }
}

function toggleNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  
  if (!dropdown) {
    console.warn('Notification dropdown element not found');
    return;
  }
  
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  
  if (dropdown.style.display === 'block') {
    loadCollaborationRequests();
  }
}

function closeNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

function renderNotifications() {
  const list = document.getElementById('notificationList');
  
  if (!list) {
    console.warn('Notification list element not found');
    return;
  }
  
  if (collaborationRequests.length === 0) {
    list.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--color-text-muted);">No collaboration requests</p>';
    return;
  }
  
  list.innerHTML = collaborationRequests.map(req => `
    <div class="notification-item">
      <div class="notification-item-header">
        <span class="notification-title">${req.userName}</span>
        <span class="notification-time">${timeAgo(req.createdAt)}</span>
      </div>
      <p style="font-size: 12px; color: var(--color-accent); margin-bottom: 8px;">Project: ${req.postTitle}</p>
      <p class="notification-message">${req.message}</p>
      ${req.status === 'pending' ? `
        <div class="notification-actions">
          <button class="btn-accept" onclick="handleCollabRequest('${req.postId}', '${req._id}', 'accepted')">
            <i class="fas fa-check"></i> Accept
          </button>
          <button class="btn-decline" onclick="handleCollabRequest('${req.postId}', '${req._id}', 'rejected')">
            <i class="fas fa-times"></i> Decline
          </button>
        </div>
      ` : `
        <p style="font-size: 12px; color: ${req.status === 'accepted' ? 'var(--color-success)' : 'var(--color-error)'}; font-weight: 600;">
          ${req.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
        </p>
      `}
    </div>
  `).join('');
}

async function handleCollabRequest(postId, requestId, status) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${window.location.origin}/api/collaborations/${postId}/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showAlert(`Request ${status}!`, 'success');
      loadCollaborationRequests();
    }
  } catch (error) {
    console.error('Error handling request:', error);
    showAlert('Failed to update request', 'error');
  }
}

function showAlert(message, type) {
  // Create a simple alert/toast
  const alert = document.createElement('div');
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  alert.textContent = message;
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Load notifications on page load - but only if elements exist
window.addEventListener('DOMContentLoaded', () => {
  // Only initialize notifications if the required elements exist
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  
  if (notificationBtn && notificationDropdown) {
    loadCollaborationRequests();
    // Reload every 30 seconds
    setInterval(loadCollaborationRequests, 30000);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        closeNotifications();
      }
    });
  } else {
    console.log('Notification elements not found on this page - skipping notification initialization');
  }
});

// User Profile Click
document.querySelector('.user-profile')?.addEventListener('click', () => {
  console.log('Opening user menu...');
  // Open user dropdown menu
});

// Search Functionality
const searchInput = document.querySelector('.search-input');

if (searchInput) {
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value;
    if (query.length > 2) {
      console.log('Searching for:', query);
      // Add search logic here
    }
  }, 500));
}

// Debounce Helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Stat Cards Animation on Scroll
const statCards = document.querySelectorAll('.stat-card');

const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

statCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// Refresh Buttons
document.querySelectorAll('.card-actions .icon-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (icon.classList.contains('fa-sync-alt')) {
      // Rotate refresh icon
      icon.style.animation = 'spin 0.5s linear';
      setTimeout(() => {
        icon.style.animation = '';
      }, 500);
      
      console.log('Refreshing data...');
      // Add refresh logic here
    }
  });
});

// Add spin animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Initialize Tooltips
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltipText = this.getAttribute('data-tooltip');
      
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = tooltipText;
      tooltip.style.cssText = `
        position: absolute;
        background: var(--color-text-primary);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.85rem;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
        animation: fadeIn 0.2s ease;
      `;
      
      this.style.position = 'relative';
      this.appendChild(tooltip);
    });
    
    element.addEventListener('mouseleave', function() {
      const tooltip = this.querySelector('.custom-tooltip');
      if (tooltip) tooltip.remove();
    });
  });
}

initTooltips();

// Console Art
console.log('%c🎓 JongoHub Dashboard', 'color: #CC00FF; font-size: 24px; font-weight: bold;');
console.log('%c💜 Student Collaboration Platform', 'color: #00FF88; font-size: 14px;');
console.log('%c🚀 Built with passion for student success!', 'color: #00FFFF; font-size: 12px;');

// Window Resize Handler
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateDateRange();
  }, 250);
});