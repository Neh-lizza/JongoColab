// ========================
// LANDING PAGE SCRIPTS
// ========================

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  
  if (window.pageYOffset > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
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

// Observe sections for animation
document.querySelectorAll('.path-card, .feature-item, .institution-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Cookie consent handling
const cookieNotice = document.querySelector('.cookie-notice');
if (cookieNotice && localStorage.getItem('cookieConsent')) {
  cookieNotice.style.display = 'none';
}

document.querySelectorAll('.cookie-actions button').forEach(button => {
  button.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true');
  });
});

// Mobile menu toggle (for future implementation)
const mobileMenuToggle = document.createElement('button');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
mobileMenuToggle.style.display = 'none';

// Add to navigation for mobile
const navActions = document.querySelector('.nav-actions');
if (navActions) {
  navActions.prepend(mobileMenuToggle);
}

// Show/hide mobile menu on small screens
function handleResize() {
  if (window.innerWidth <= 768) {
    mobileMenuToggle.style.display = 'block';
  } else {
    mobileMenuToggle.style.display = 'none';
  }
}

window.addEventListener('resize', handleResize);
handleResize();

// Add particle effect to hero (optional enhancement)
function createParticles() {
  const hero = document.querySelector('.hero');
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  particlesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  `;
  
  // Create floating particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: rgba(204, 0, 255, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    particlesContainer.appendChild(particle);
  }
  
  // Add float animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  if (hero) {
    hero.insertBefore(particlesContainer, hero.firstChild);
  }
}

// Initialize particles on load
createParticles();

// Add typing effect to hero title (optional)
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Console easter egg
console.log('%c🚀 Welcome to JongoHub!', 'color: #CC00FF; font-size: 24px; font-weight: bold;');
console.log('%c💜 Built with passion for student collaboration', 'color: #CC00FF; font-size: 14px;');
console.log('%c👨‍💻 Interested in contributing? Check out our GitHub!', 'color: #00FFFF; font-size: 12px;');