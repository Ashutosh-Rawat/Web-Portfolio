// Initialize animations
new WOW().init();

// Back to top button
const backToTopButton = document.querySelector('.btn-back_to_top');

// Show/hide back to top button
window.addEventListener('scroll', function() {
  if (window.scrollY > 400) {
    backToTopButton.classList.add('active');
  } else {
    backToTopButton.classList.remove('active');
  }
  updateActiveNavItem();
});

// Back to top functionality
backToTopButton.addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Update active nav item based on scroll position
function updateActiveNavItem() {
  const sections = document.querySelectorAll('.section[id]');
  const scrollPosition = window.scrollY + 100; // Adjusted offset
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.navbar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      const correspondingNavItem = document.querySelector(`.navbar-nav a[href="#${sectionId}"]`).parentElement;
      if (correspondingNavItem) {
        correspondingNavItem.classList.add('active');
      }
    }
  });
}

// Smooth scrolling for nav links
document.querySelectorAll('.navbar-nav .nav-link.scroll-to').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const navbarHeight = document.querySelector('.navbar.sticky').offsetHeight;
      const targetPosition = targetElement.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        window.location.hash = targetId;
      }
      
      // Update active nav item
      document.querySelectorAll('.navbar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
      });
      this.parentElement.classList.add('active');
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    }
  });
});

// Handle page load with hash
function handleInitialHash() {
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const navbarHeight = document.querySelector('.navbar.sticky').offsetHeight;
        window.scrollTo({
          top: target.offsetTop - navbarHeight,
          behavior: 'auto'
        });
      }
    }, 100);
  }
}

// Initialize counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.number');
  const speed = 200;
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-number');
    const count = +counter.innerText;
    const increment = target / speed;
    
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(animateCounters, 1);
    } else {
      counter.innerText = target;
    }
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const navbar = document.querySelector('.navbar');
  const navbarToggler = document.querySelector('.navbar-toggler');
  
  if (!navbar.contains(e.target) && !e.target.isSameNode(navbarToggler)) {
    const navbarCollapse = document.querySelector('.navbar-collapse.show');
    if (navbarCollapse) {
      navbarCollapse.classList.remove('show');
    }
  }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize active nav item
  updateActiveNavItem();
  
  // Handle hash links on page load
  handleInitialHash();
  
  // Initialize counter animations
  animateCounters();
  
  // Initialize WOW.js
  new WOW().init();
});