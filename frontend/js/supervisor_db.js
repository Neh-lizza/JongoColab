// ========================
// SUPERVISOR DASHBOARD SCRIPTS
// ========================

// ===== MODAL FUNCTIONS =====

// Task Modal
function openTaskModal() {
  document.getElementById('taskModal').classList.add('active');
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.remove('active');
  document.getElementById('taskForm').reset();
}

// Notification Modal
function openNotificationModal() {
  document.getElementById('notificationModal').classList.add('active');
}

function closeNotificationModal() {
  document.getElementById('notificationModal').classList.remove('active');
  document.getElementById('notificationForm').reset();
}

// Review Modal
function openReviewModal() {
  alert('Opening Projects Review Panel...');
  // Navigate to projects review page
}

// Close modals on outside click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeTaskModal();
    closeNotificationModal();
  }
});

// Close modals on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTaskModal();
    closeNotificationModal();
  }
});

// ===== FORM SUBMISSIONS =====

// Task Form Submit
document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const taskData = Object.fromEntries(formData.entries());
  
  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
  submitBtn.disabled = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Show success message
  showToast('success', 'Task created successfully!');
  
  // Reset form and close modal
  closeTaskModal();
  submitBtn.innerHTML = originalHTML;
  submitBtn.disabled = false;
  
  // You can add actual API call here
  console.log('Task created:', taskData);
});

// Notification Form Submit
document.getElementById('notificationForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const notificationData = Object.fromEntries(formData.entries());
  
  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
  submitBtn.disabled = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Show success message
  showToast('success', 'Notification posted successfully!');
  
  // Reset form and close modal
  closeNotificationModal();
  submitBtn.innerHTML = originalHTML;
  submitBtn.disabled = false;
  
  // You can add actual API call here
  console.log('Notification posted:', notificationData);
});

// ===== TOAST NOTIFICATIONS =====
function showToast(type, message) {
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
        type === 'error' ? '<i class="fas fa-times-circle"></i>' : 
        '<i class="fas fa-info-circle"></i>'}
    </div>
    <div class="toast-message">${message}</div>
  `;
  
  toast.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    border-left: 4px solid ${type === 'success' ? 'var(--color-success)' : 
                              type === 'error' ? 'var(--color-error)' : 
                              'var(--color-info)'};
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

// ===== TASK ACTIONS =====

// Edit Task
document.querySelectorAll('.task-item .fa-edit').forEach(btn => {
  btn.addEventListener('click', function() {
    const taskItem = this.closest('.task-item');
    const taskTitle = taskItem.querySelector('h4').textContent;
    showToast('info', `Editing: ${taskTitle}`);
    // Open edit modal with task data
  });
});

// View Task Details
document.querySelectorAll('.task-item .fa-eye').forEach(btn => {
  btn.addEventListener('click', function() {
    const taskItem = this.closest('.task-item');
    const taskTitle = taskItem.querySelector('h4').textContent;
    showToast('info', `Viewing: ${taskTitle}`);
    // Navigate to task details page
  });
});

// Delete Task
document.querySelectorAll('.task-item .fa-trash').forEach(btn => {
  btn.addEventListener('click', function() {
    const taskItem = this.closest('.task-item');
    const taskTitle = taskItem.querySelector('h4').textContent;
    
    if (confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      taskItem.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        taskItem.remove();
        showToast('success', 'Task deleted successfully');
      }, 300);
    }
  });
});

// Award Badge
document.querySelectorAll('.task-item .fa-award').forEach(btn => {
  btn.addEventListener('click', function() {
    const taskItem = this.closest('.task-item');
    const taskTitle = taskItem.querySelector('h4').textContent;
    showToast('success', `Certificate generated for: ${taskTitle}`);
    // Generate and send certificate
  });
});

// ===== NOTIFICATION ACTIONS =====

// Edit Notification
document.querySelectorAll('.notification-item .fa-edit').forEach(btn => {
  btn.addEventListener('click', function() {
    const notificationItem = this.closest('.notification-item');
    const title = notificationItem.querySelector('h4').textContent;
    showToast('info', `Editing: ${title}`);
    // Open edit modal
  });
});

// Delete Notification
document.querySelectorAll('.notification-item .fa-trash').forEach(btn => {
  btn.addEventListener('click', function() {
    const notificationItem = this.closest('.notification-item');
    const title = notificationItem.querySelector('h4').textContent;
    
    if (confirm(`Are you sure you want to delete this notification?`)) {
      notificationItem.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        notificationItem.remove();
        showToast('success', 'Notification deleted');
      }, 300);
    }
  });
});

// ===== EXPORT REPORT =====
document.querySelector('.quick-action-btn.orange')?.addEventListener('click', () => {
  showToast('info', 'Generating report...');
  
  setTimeout(() => {
    showToast('success', 'Report downloaded successfully!');
    // Simulate file download
    console.log('Downloading report...');
  }, 2000);
});

// ===== AUTO-UPDATE DEADLINE CALCULATIONS =====
function updateDeadlines() {
  document.querySelectorAll('.task-deadline').forEach(deadline => {
    const dateText = deadline.querySelector('span').textContent;
    const badge = deadline.querySelector('.deadline-badge');
    
    // Calculate days left (this is a simplified version)
    // In production, parse the actual date and calculate
    if (badge && !badge.classList.contains('success')) {
      const match = dateText.match(/\d+/);
      if (match) {
        const daysLeft = parseInt(match[0]);
        if (daysLeft <= 2) {
          badge.classList.remove('active');
          badge.classList.add('warning');
        }
      }
    }
  });
}

updateDeadlines();

// ===== TASK PROGRESS ANIMATION =====
function animateProgress() {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

// Animate on page load
setTimeout(animateProgress, 500);

// ===== STATS COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-value').forEach(counter => {
    const target = parseInt(counter.textContent.replace(/\D/g, ''));
    if (!target) return;
    
    let current = 0;
    const increment = target / 50;
    const isPercentage = counter.textContent.includes('%');
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = isPercentage ? target + '%' : target;
        clearInterval(timer);
      } else {
        counter.textContent = isPercentage ? 
          Math.floor(current) + '%' : 
          Math.floor(current);
      }
    }, 20);
  });
}

// Animate on page load
setTimeout(animateCounters, 300);

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.querySelector('.search-input');

if (searchInput) {
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length > 2) {
      // Filter tasks
      document.querySelectorAll('.task-item').forEach(task => {
        const title = task.querySelector('h4').textContent.toLowerCase();
        const description = task.querySelector('.task-description').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
          task.style.display = '';
        } else {
          task.style.display = 'none';
        }
      });
      
      // Filter notifications
      document.querySelectorAll('.notification-item').forEach(notification => {
        const title = notification.querySelector('h4').textContent.toLowerCase();
        const message = notification.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || message.includes(query)) {
          notification.style.display = '';
        } else {
          notification.style.display = 'none';
        }
      });
    } else {
      // Show all items
      document.querySelectorAll('.task-item, .notification-item').forEach(item => {
        item.style.display = '';
      });
    }
  }, 300));
}

// Debounce helper
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

// ===== CONSOLE INFO =====
console.log('%c👨‍🏫 Supervisor Dashboard', 'color: #00FF88; font-size: 24px; font-weight: bold;');
console.log('%c✅ Task Management Active', 'color: #CC00FF; font-size: 14px;');
console.log('%c📢 Notification System Ready', 'color: #00FFFF; font-size: 14px;');

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + T = New Task
  if ((e.ctrlKey || e.metaKey) && e.key === 't') {
    e.preventDefault();
    openTaskModal();
  }
  
  // Ctrl/Cmd + N = New Notification
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    openNotificationModal();
  }
});

console.log('%c⌨️ Keyboard Shortcuts:', 'color: #FFB800; font-size: 12px; font-weight: bold;');
console.log('%c   Ctrl/Cmd + T = New Task', 'color: #999; font-size: 11px;');
console.log('%c   Ctrl/Cmd + N = New Notification', 'color: #999; font-size: 11px;');