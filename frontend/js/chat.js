// ===================================
// SCHOOL CHAT LOGIC
// File: frontend/js/chat.js
// ===================================

// School configurations with colors and emojis
const SCHOOL_CONFIG = {
    'CUIB': {
        fullName: 'Catholic University Institute of Buea',
        abbreviation: 'CUIB',
        emoji: '🎓',
        color: '#CC00FF',
        gradient: 'linear-gradient(135deg, #CC00FF 0%, #00FFDD 100%)'
    },
    'UB': {
        fullName: 'University of Buea',
        abbreviation: 'UB',
        emoji: '📚',
        color: '#00FF88',
        gradient: 'linear-gradient(135deg, #00FF88 0%, #FFB800 100%)'
    },
    'Landmark': {
        fullName: 'Landmark University',
        abbreviation: 'Landmark',
        emoji: '🏛️',
        color: '#FFB800',
        gradient: 'linear-gradient(135deg, #FFB800 0%, #FF00DD 100%)'
    },
    'MIT': {
        fullName: 'Massachusetts Institute of Technology',
        abbreviation: 'MIT',
        emoji: '🎯',
        color: '#FF00DD',
        gradient: 'linear-gradient(135deg, #FF00DD 0%, #00FFFF 100%)'
    },
    'Stanford': {
        fullName: 'Stanford University',
        abbreviation: 'Stanford',
        emoji: '🌟',
        color: '#00FFFF',
        gradient: 'linear-gradient(135deg, #00FFFF 0%, #CC00FF 100%)'
    },
    'Other': {
        fullName: 'Other Institution',
        abbreviation: 'Other',
        emoji: '🏫',
        color: '#9333EA',
        gradient: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)'
    }
};

// Initialize chat on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    setupEventListeners();
});

// Initialize chat with user's school context
function initializeChat() {
    // Get chat context from localStorage
    const chatContext = JSON.parse(localStorage.getItem('chatContext') || '{}');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!chatContext.school && !userData.school) {
        alert('Please login to access school chat');
        window.location.href = 'auth.html';
        return;
    }
    
    // Merge contexts
    const school = chatContext.school || userData.school || userData.schoolName;
    const userName = chatContext.userName || `${userData.firstName} ${userData.lastName}`;
    const department = chatContext.department || userData.department;
    
    // Get school config
    const schoolConfig = getSchoolConfig(school);
    
    // Update chat header with school info
    updateChatHeader(schoolConfig, school);
    
    // Load chat messages (from localStorage for now, later from backend)
    loadChatMessages(school);
    
    // Store current user info
    window.currentUser = {
        name: userName,
        school: school,
        department: department,
        avatar: getInitials(userName)
    };
}

// Get school configuration
function getSchoolConfig(schoolName) {
    // Try to match school name with config
    const schoolKey = Object.keys(SCHOOL_CONFIG).find(key => 
        schoolName.includes(key) || 
        key.includes(schoolName) ||
        SCHOOL_CONFIG[key].fullName.includes(schoolName) ||
        SCHOOL_CONFIG[key].abbreviation === schoolName
    );
    
    return SCHOOL_CONFIG[schoolKey] || SCHOOL_CONFIG['Other'];
}

// Get initials from name
function getInitials(name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return name.charAt(0) + (name.charAt(1) || '');
}

// Update chat header with school info
function updateChatHeader(schoolConfig, schoolName) {
    // Update school avatar
    const schoolAvatar = document.getElementById('schoolAvatar');
    if (schoolAvatar) {
        schoolAvatar.textContent = schoolConfig.emoji;
        schoolAvatar.style.background = schoolConfig.gradient;
    }
    
    // Update chat title
    const chatTitleElement = document.getElementById('chatTitle');
    if (chatTitleElement) {
        chatTitleElement.textContent = `${schoolName} School Chat`;
    }
    
    // Get actual online count from stored users
    const onlineUsers = getOnlineUsers(schoolName);
    updateOnlineCount(onlineUsers.length);
    
    // Update page title
    document.title = `${schoolName} Chat - JongoCollab`;
}

// Get online users for school
function getOnlineUsers(school) {
    const storageKey = `online_users_${school}`;
    const users = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Filter out users who haven't been active in last 5 minutes
    const now = Date.now();
    const activeUsers = users.filter(user => (now - user.lastSeen) < 5 * 60 * 1000);
    
    // Update storage with active users only
    localStorage.setItem(storageKey, JSON.stringify(activeUsers));
    
    return activeUsers;
}

// Update current user as online
function setUserOnline(school, userName) {
    const storageKey = `online_users_${school}`;
    const users = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Remove current user if already exists
    const filteredUsers = users.filter(u => u.name !== userName);
    
    // Add current user with current timestamp
    filteredUsers.push({
        name: userName,
        lastSeen: Date.now()
    });
    
    localStorage.setItem(storageKey, JSON.stringify(filteredUsers));
    
    return filteredUsers.length;
}

// Update online count display
function updateOnlineCount(count) {
    const onlineIndicator = document.getElementById('onlineIndicator');
    const onlineCountBadge = document.getElementById('onlineCountBadge');
    
    if (onlineIndicator) {
        if (count === 1) {
            onlineIndicator.textContent = 'Only you online';
        } else {
            onlineIndicator.textContent = `${count} student${count !== 1 ? 's' : ''} online`;
        }
    }
    
    if (onlineCountBadge) {
        onlineCountBadge.textContent = count;
    }
}

// Keep user online (heartbeat)
function startOnlineHeartbeat(school, userName) {
    // Update immediately
    setUserOnline(school, userName);
    
    // Update every 30 seconds
    setInterval(() => {
        const count = setUserOnline(school, userName);
        updateOnlineCount(count);
    }, 30000);
}

// Load chat messages
function loadChatMessages(school) {
    // Get messages from localStorage (school-specific)
    const storageKey = `chat_messages_${school}`;
    const messages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const messagesArea = document.getElementById('messagesArea');
    if (!messagesArea) return;
    
    // Clear existing messages (keep date divider and typing indicator)
    const existingMessages = messagesArea.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Add saved messages
    messages.forEach(msg => {
        addMessageToUI(msg, false);
    });
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Save message to localStorage
function saveMessage(message) {
    const school = window.currentUser?.school;
    if (!school) return;
    
    const storageKey = `chat_messages_${school}`;
    const messages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    messages.push(message);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
        messages.shift();
    }
    
    localStorage.setItem(storageKey, JSON.stringify(messages));
}

// Add message to UI
function addMessageToUI(message, shouldSave = true) {
    const messagesArea = document.getElementById('messagesArea');
    if (!messagesArea) return;
    
    const isOwn = message.isOwn || false;
    const time = message.time || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const messageHTML = `
        <div class="message ${isOwn ? 'own' : ''}">
            <div class="message-avatar">${message.avatar || '👤'}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${message.sender || 'Anonymous'}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-bubble">
                    ${message.text}
                </div>
            </div>
        </div>
    `;
    
    // Remove typing indicator before adding message
    const typingIndicator = messagesArea.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    messagesArea.insertAdjacentHTML('beforeend', messageHTML);
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Save to localStorage
    if (shouldSave && isOwn) {
        saveMessage({
            sender: message.sender,
            avatar: message.avatar,
            text: message.text,
            time: time,
            isOwn: true,
            timestamp: Date.now()
        });
    }
    
    // Add typing indicator back after 1 second
    if (isOwn) {
        setTimeout(() => {
            addTypingIndicator();
        }, 1000);
    }
}

// Add typing indicator
function addTypingIndicator() {
    const messagesArea = document.getElementById('messagesArea');
    if (!messagesArea) return;
    
    // Check if typing indicator already exists
    if (messagesArea.querySelector('.typing-indicator')) return;
    
    const typingHTML = `
        <div class="typing-indicator">
            <div class="message-avatar">👤</div>
            <div class="typing-bubble">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messagesArea.insertAdjacentHTML('beforeend', typingHTML);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    const currentUser = window.currentUser || {
        name: 'You',
        avatar: '😊'
    };
    
    const message = {
        sender: currentUser.name,
        avatar: currentUser.avatar,
        text: text,
        isOwn: true
    };
    
    addMessageToUI(message, true);
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
}

// Setup event listeners
function setupEventListeners() {
    // Auto-resize textarea
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Send on Enter (Shift+Enter for new line)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Send button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Emoji picker
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    
    if (emojiBtn && emojiPicker) {
        emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            emojiPicker.classList.toggle('show');
        });
        
        document.querySelectorAll('.emoji').forEach(emoji => {
            emoji.addEventListener('click', () => {
                if (messageInput) {
                    messageInput.value += emoji.textContent;
                    messageInput.focus();
                    emojiPicker.classList.remove('show');
                }
            });
        });
        
        // Close emoji picker when clicking outside
        document.addEventListener('click', () => {
            emojiPicker.classList.remove('show');
        });
    }
    
    // Back to dashboard
    const dashboardLinks = document.querySelectorAll('a[href="#"]');
    dashboardLinks.forEach(link => {
        if (link.textContent.includes('Dashboard')) {
            link.href = 'student_db.html';
        }
    });
}

// Export for debugging
window.chatDebug = {
    currentUser: () => window.currentUser,
    loadMessages: loadChatMessages,
    clearMessages: (school) => {
        const storageKey = `chat_messages_${school || window.currentUser?.school}`;
        localStorage.removeItem(storageKey);
        console.log('Messages cleared for', school || window.currentUser?.school);
    }
};