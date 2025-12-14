// ===================================
// MERGED AUTH.JS - Complete Authentication
// File: frontend/js/auth.js
// ===================================

// ===================================
// API CONFIGURATION
// ===================================
// Use relative URL since frontend is served from same port
const API_BASE_URL = '/api';

// ===================================
// LOCAL STORAGE FUNCTIONS
// ===================================

// Store token in localStorage
function setToken(token) {
    localStorage.setItem('authToken', token);
}

// Get token from localStorage
function getToken() {
    return localStorage.getItem('authToken');
}

// Remove token from localStorage
function removeToken() {
    localStorage.removeItem('authToken');
}

// Store user data
function setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Get user data
function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Redirect to dashboard if authenticated
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'student_db.html';
    }
}

// Protect dashboard pages (redirect to login if not authenticated)
function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'auth.html';
    }
}

// ===================================
// API FUNCTIONS
// ===================================

// Register new user
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Login user
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Get current user data
async function getCurrentUser() {
    try {
        const token = getToken();
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get user data');
        }

        return data;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
}

// Logout user
function logoutUser() {
    removeToken();
    localStorage.removeItem('userData');
    window.location.href = 'auth.html';
}

// ===================================
// UI FUNCTIONS
// ===================================

// Toggle between Login and Sign Up
function toggleForm(formType) {
    const loginWrapper = document.getElementById('loginFormWrapper');
    const signupWrapper = document.getElementById('signupFormWrapper');
    
    if (formType === 'login') {
        signupWrapper.classList.remove('active');
        setTimeout(() => {
            loginWrapper.classList.add('active');
        }, 100);
    } else if (formType === 'signup') {
        loginWrapper.classList.remove('active');
        setTimeout(() => {
            signupWrapper.classList.add('active');
        }, 100);
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Show alert - Updated to support multiple types
function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    
    if (!alertContainer) {
        console.warn('Alert container not found');
        return;
    }
    
    // Map old type names to new ones
    const typeMap = {
        'error': 'error',
        'success': 'success',
        'info': 'warning',
        'warning': 'warning'
    };
    
    const alertType = typeMap[type] || 'success';
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${alertType}`;
    
    // Add icon based on type
    let icon = '';
    switch (alertType) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            ${icon}
            <span>${message}</span>
        </div>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Forgot Password
function showForgotPassword() {
    const email = prompt('Enter your email address:');
    
    if (email) {
        // TODO: Integrate with backend password reset API
        setTimeout(() => {
            showAlert('success', `Password reset link sent to ${email}`);
        }, 500);
    }
}

// ===================================
// FORM HANDLERS
// ===================================

// Login Form Submit - INTEGRATED WITH API
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        showAlert('error', 'Please fill in all fields');
        return;
    }
    
    // Prepare credentials
    const credentials = {
        email,
        password
    };
    
    try {
        // Show loading state
        const button = e.target.querySelector('.btn-auth');
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Signing in...</span>';
        button.disabled = true;
        
        // Call API
        const result = await loginUser(credentials);
        
        // Store token and user data
        setToken(result.data.token);
        setUserData(result.data.user);
        
        // Show success message
        showAlert('success', 'Login successful! Redirecting to dashboard...');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'student_db.html';
        }, 1000);
        
    } catch (error) {
        // Handle different error types
        if (error.message.includes('pending approval')) {
            showAlert('warning', 'Your account is pending admin approval. Please wait.');
        } else if (error.message.includes('rejected')) {
            showAlert('error', 'Your account was rejected. Please contact support.');
        } else {
            showAlert('error', error.message || 'Invalid email or password');
        }
        
        // Restore button
        const button = e.target.querySelector('.btn-auth');
        button.innerHTML = '<span>Sign in</span>';
        button.disabled = false;
    }
}

// Sign Up Form Submit - INTEGRATED WITH API
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const institution = document.getElementById('institution').value;
    const department = document.getElementById('department').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !institution || !department || !password || !confirmPassword) {
        showAlert('error', 'Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('error', 'Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        showAlert('error', 'Password must be at least 8 characters');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('error', 'Please agree to the Terms & Conditions');
        return;
    }
    
    // Prepare user data
    const userData = {
        firstName,
        lastName,
        email,
        schoolName: institution,
        department,
        password
    };
    
    try {
        // Show loading state
        const button = e.target.querySelector('.btn-auth');
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Creating account...</span>';
        button.disabled = true;
        
        // Call API
        const result = await registerUser(userData);
        
        // Check if user was auto-approved
        if (result.autoApproved && result.data.token) {
            // User was auto-approved, store token and redirect
            setToken(result.data.token);
            setUserData(result.data.user);
            
            showAlert('success', 'Account created successfully! Redirecting to dashboard...');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'student_db.html';
            }, 1000);
            
        } else {
            // User needs approval, show message and switch to login
            showAlert('warning', result.message || 'Account created! Waiting for admin approval.');
            
            // Reset form
            e.target.reset();
            
            // Switch to login form after 2 seconds
            setTimeout(() => {
                toggleForm('login');
                document.getElementById('loginEmail').value = email;
            }, 2000);
        }
        
    } catch (error) {
        showAlert('error', error.message || 'Registration failed. Please try again.');
        // Restore button
        const button = e.target.querySelector('.btn-auth');
        button.innerHTML = '<span>Create account</span>';
        button.disabled = false;
    }
}

// ===================================
// DASHBOARD FUNCTIONS
// ===================================

// Load user data on dashboard
async function loadDashboardData() {
    try {
        // Get user data from localStorage first
        const userData = getUserData();

        if (userData) {
            // Update UI with cached data
            updateUserProfile(userData);
        }

        // Fetch fresh data from API
        const result = await getCurrentUser();
        
        if (result.success) {
            // Update localStorage with fresh data
            setUserData(result.data);
            
            // Update UI with fresh data
            updateUserProfile(result.data);
        }

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        
        // If token is invalid, redirect to login
        if (error.message.includes('authorized') || error.message.includes('token')) {
            showAlert('error', 'Session expired. Please login again.');
            setTimeout(() => {
                logoutUser();
            }, 1500);
        }
    }
}

// Update user profile in UI
function updateUserProfile(userData) {
    // Update user name
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = `${userData.firstName} ${userData.lastName}`;
    }

    // Update institution
    const userInstitutionElement = document.querySelector('.user-institution');
    if (userInstitutionElement) {
        userInstitutionElement.textContent = userData.school || 'N/A';
    }

    // Update page title
    const dashboardTitle = document.querySelector('.dashboard-header h1');
    if (dashboardTitle) {
        dashboardTitle.textContent = `Welcome back, ${userData.firstName}!`;
    }

    // Update user avatar with initials
    const userAvatar = document.querySelector('.user-avatar img');
    if (userAvatar) {
        const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
        userAvatar.src = `https://via.placeholder.com/45/CC00FF/FFFFFF?text=${initials}`;
        userAvatar.alt = `${userData.firstName} ${userData.lastName}`;
    }

    // Store school info for chat routing
    localStorage.setItem('userSchool', userData.school || userData.schoolName);
    localStorage.setItem('userDepartment', userData.department);
}
// Navigate to Community page
function navigateToCommunity() {
  window.location.href = 'community.html';
}
// Navigate to school chat
function navigateToSchoolChat() {
    const userData = getUserData();
    
    if (!userData) {
        showAlert('error', 'Please login to access school chat');
        window.location.href = 'auth.html';
        return;
    }
    
    // Store school context for chat page
    localStorage.setItem('chatContext', JSON.stringify({
        school: userData.school || userData.schoolName,
        department: userData.department,
        userId: userData.id,
        userName: `${userData.firstName} ${userData.lastName}`
    }));
    
    // Navigate to chat page
    window.location.href = 'chat.html';
}
// Navigate to My Projects
function navigateToMyProjects() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    window.location.href = 'auth.html';
    return;
  }
  window.location.href = 'my_projects.html';
}

// ===================================
// EVENT LISTENERS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    // If on auth.html, redirect if already authenticated
    if (currentPage.includes('auth.html') || currentPage.endsWith('/')) {
        redirectIfAuthenticated();
        
        // Attach event listeners to forms
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }
        
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignupSubmit);
        }
    }

    // If on student_db.html, protect the page and load data
    if (currentPage.includes('student_db.html') || currentPage.includes('dashboard.html')) {
        protectPage();
        loadDashboardData();
    }

    // Check URL parameters for form type
    const urlParams = new URLSearchParams(window.location.search);
    const formType = urlParams.get('type');

    if (formType === 'signup') {
        toggleForm('signup');
    }

    // Auto-focus first input
    const firstInput = document.querySelector('.auth-form-wrapper.active input');
    if (firstInput) {
        firstInput.focus();
    }
});

// ===================================
// SOCIAL LOGIN HANDLERS (Future)
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-social')?.forEach(button => {
        button.addEventListener('click', (e) => {
            const provider = e.currentTarget.textContent.trim();
            showAlert('warning', `${provider} login coming soon!`);
        });
    });
});

// ===================================
// EXPORT FUNCTIONS FOR HTML ONCLICK
// ===================================
window.toggleForm = toggleForm;
window.togglePassword = togglePassword;
window.showForgotPassword = showForgotPassword;
window.logoutUser = logoutUser;