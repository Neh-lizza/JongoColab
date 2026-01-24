// ========================
// DASHBOARD SCRIPTS - CLEANED VERSION
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



// Table View Buttons
const viewBtns = document.querySelectorAll('.btn-view');

viewBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const row = this.closest('tr');
    const projectName = row.querySelector('strong').textContent;
    alert(`Opening project: ${projectName}`);
  });
});

// Helper function to format time ago
function timeAgo(date) {
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
}

// User Profile Click
document.querySelector('.user-profile')?.addEventListener('click', () => {
  console.log('Opening user menu...');
});

// Search Functionality
const searchInput = document.querySelector('.search-input');

if (searchInput) {
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value;
    if (query.length > 2) {
      console.log('Searching for:', query);
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
      icon.style.animation = 'spin 0.5s linear';
      setTimeout(() => {
        icon.style.animation = '';
      }, 500);
      
      console.log('Refreshing data...');
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