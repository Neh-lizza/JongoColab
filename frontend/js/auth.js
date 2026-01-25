// ===================================
// FIXED AUTH.JS - NO AUTO-LOGIN
// File: frontend/js/auth.js
// ===================================

// ===================================
// API CONFIGURATION
// ===================================
const API_BASE_URL = '/api';

// ===================================
// LOCAL STORAGE FUNCTIONS
// ===================================

function setToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
}

function setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
}

function isAuthenticated() {
    return !!getToken();
}

// ===================================
// REMOVED: Auto-redirect if authenticated
// Users must manually login each time
// ===================================

// Protect dashboard pages
function protectPage() {
    if (!isAuthenticated()) {
        console.log('Not authenticated - redirecting to auth page');
        window.location.href = 'auth.html';
        return;
    }
    
    // Validate token in background
    validateCurrentSession();
}

// Validate current session
async function validateCurrentSession() {
    try {
        const result = await getCurrentUser();
        if (result.success) {
            setUserData(result.data);
        }
    } catch (error) {
        console.error('Session validation failed:', error);
        // Clear invalid session
        removeToken();
        window.location.href = 'auth.html';
    }
}

// ===================================
// API FUNCTIONS
// ===================================

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

function logoutUser() {
    console.log('Logging out user...');
    removeToken();
    window.location.href = 'auth.html';
}

// ===================================
// UI FUNCTIONS
// ===================================

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

function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    
    if (!alertContainer) {
        console.warn('Alert container not found');
        return;
    }
    
    const typeMap = {
        'error': 'error',
        'success': 'success',
        'info': 'warning',
        'warning': 'warning'
    };
    
    const alertType = typeMap[type] || 'success';
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${alertType}`;
    
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
    
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

function showForgotPassword() {
    const email = prompt('Enter your email address:');
    
    if (email) {
        setTimeout(() => {
            showAlert('success', `Password reset link sent to ${email}`);
        }, 500);
    }
}

// ===================================
// FORM HANDLERS
// ===================================

async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showAlert('error', 'Please fill in all fields');
        return;
    }
    
    const credentials = { email, password };
    
    try {
        const button = e.target.querySelector('.btn-auth');
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Signing in...</span>';
        button.disabled = true;
        
        const result = await loginUser(credentials);
        
        console.log('Login successful:', result);
        
        // Store token and user data
        setToken(result.data.token);
        setUserData(result.data.user);
        
        showAlert('success', 'Login successful! Redirecting to dashboard...');
        
        setTimeout(() => {
            window.location.href = 'student_db.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login failed:', error);
        
        if (error.message.includes('pending approval')) {
            showAlert('warning', 'Your account is pending admin approval. Please wait.');
        } else if (error.message.includes('rejected')) {
            showAlert('error', 'Your account was rejected. Please contact support.');
        } else {
            showAlert('error', error.message || 'Invalid email or password');
        }
        
        const button = e.target.querySelector('.btn-auth');
        button.innerHTML = '<span>Sign in</span>';
        button.disabled = false;
    }
}

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
    
    const userData = {
        firstName,
        lastName,
        email,
        schoolName: institution,
        department,
        password
    };
    
    try {
        const button = e.target.querySelector('.btn-auth');
        button.innerHTML = '<span>Creating account...</span>';
        button.disabled = true;
        
        const result = await registerUser(userData);
        
        console.log('Registration result:', result);
        
        // ===================================
        // FIXED: Never auto-login after signup
        // Always show success and switch to login
        // ===================================
        if (result.autoApproved) {
            showAlert('success', 'Account created successfully! Please login to continue.');
        } else {
            showAlert('warning', 'Account created! Waiting for admin approval.');
        }
        
        // Clear the form
        e.target.reset();
        
        // Switch to login form after 2 seconds
        setTimeout(() => {
            toggleForm('login');
            document.getElementById('loginEmail').value = email;
        }, 2000);
        
    } catch (error) {
        console.error('Registration failed:', error);
        showAlert('error', error.message || 'Registration failed. Please try again.');
        
        const button = e.target.querySelector('.btn-auth');
        button.innerHTML = '<span>Create account</span>';
        button.disabled = false;
    }
}

// ===================================
// DASHBOARD FUNCTIONS
// ===================================

async function loadDashboardData() {
    try {
        const userData = getUserData();

        if (userData) {
            updateUserProfile(userData);
        }

        const result = await getCurrentUser();
        
        if (result.success) {
            setUserData(result.data);
            updateUserProfile(result.data);
        }

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        
        if (error.message.includes('authorized') || error.message.includes('token')) {
            showAlert('error', 'Session expired. Please login again.');
            setTimeout(() => {
                logoutUser();
            }, 1500);
        }
    }
}

function updateUserProfile(userData) {
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = `${userData.firstName} ${userData.lastName}`;
    }

    const userInstitutionElement = document.querySelector('.user-institution');
    if (userInstitutionElement) {
        userInstitutionElement.textContent = userData.school || userData.schoolName || 'N/A';
    }

    const dashboardTitle = document.querySelector('.dashboard-header h1');
    if (dashboardTitle) {
        dashboardTitle.textContent = `Welcome back, ${userData.firstName}!`;
    }

    const userAvatar = document.querySelector('.user-avatar img');
    if (userAvatar) {
        const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
        userAvatar.src = `https://via.placeholder.com/45/CC00FF/FFFFFF?text=${initials}`;
        userAvatar.alt = `${userData.firstName} ${userData.lastName}`;
    }

    localStorage.setItem('userSchool', userData.school || userData.schoolName);
    localStorage.setItem('userDepartment', userData.department);
}

function navigateToCommunity() {
    window.location.href = 'Community.html';
}

function navigateToSchoolChat() {
    const userData = getUserData();
    
    if (!userData) {
        showAlert('error', 'Please login to access school chat');
        window.location.href = 'auth.html';
        return;
    }
    
    localStorage.setItem('chatContext', JSON.stringify({
        school: userData.school || userData.schoolName,
        department: userData.department,
        userId: userData.id,
        userName: `${userData.firstName} ${userData.lastName}`
    }));
    
    window.location.href = 'chat.html';
}

function navigateToMyProjects() {
    const token = localStorage.getItem('authToken');
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

    // ===================================
    // FIXED: No auto-redirect on auth page
    // Users always see login/signup forms
    // ===================================
    if (currentPage.includes('auth.html') || currentPage.endsWith('/')) {
        console.log('On auth page - ready for manual login');
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }
        
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignupSubmit);
        }
    }

    // If on dashboard, protect and load data
    if (currentPage.includes('student_db.html') || currentPage.includes('dashboard.html')) {
        protectPage();
        loadDashboardData();
    }

    // Check URL parameters
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

// Social login handlers
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-social')?.forEach(button => {
        button.addEventListener('click', (e) => {
            const provider = e.currentTarget.textContent.trim();
            showAlert('warning', `${provider} login coming soon!`);
        });
    });
});

// ===================================
// LOGOUT FUNCTION FOR NAV LINKS
// ===================================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser();
    }
}

// ===================================
// EXPORT FUNCTIONS FOR HTML
// ===================================
window.toggleForm = toggleForm;
window.togglePassword = togglePassword;
window.showForgotPassword = showForgotPassword;
window.logoutUser = logoutUser;
window.logout = logout;
window.navigateToCommunity = navigateToCommunity;
window.navigateToSchoolChat = navigateToSchoolChat;
window.navigateToMyProjects = navigateToMyProjects;