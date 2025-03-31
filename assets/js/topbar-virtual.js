$(function() {
  // Initialize EmailJS with your public key
  emailjs.init("Z--PbmHadH3VtMEnr");

  // Add custom easing function if needed
  $.extend($.easing, {
    easeInOutExpo: function(x, t, b, c, d) {
      if (t === 0) return b;
      if (t === d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  });

  // Enhanced Notification system
  function showNotification(message, isError = false) {
    const $notification = $('#notification');
    const $message = $('#notification-message');
    
    // Clear any existing timeout
    if ($notification.data('timeout')) {
      clearTimeout($notification.data('timeout'));
    }
    
    // Set notification content and style
    $notification.removeClass('show success error')
               .addClass('show')
               .addClass(isError ? 'error' : 'success');
    $message.text(message);
    
    // Auto-hide after 5 seconds
    const timeout = setTimeout(() => {
      $notification.removeClass('show');
    }, 5000);
    
    // Store timeout reference
    $notification.data('timeout', timeout);
  }

  // Close notification manually
  $(document).on('click', '.close-notification', function() {
    const $notification = $('#notification');
    $notification.removeClass('show');
    
    // Clear the timeout if clicked manually
    if ($notification.data('timeout')) {
      clearTimeout($notification.data('timeout'));
    }
  });

  // Contact form submission handler
  $('.vg-contact-form').submit(function(e) {
    e.preventDefault();
    
    const $btn = $('#sendMessageBtn');
    const $spinner = $btn.find('.spinner');
    const $sendText = $btn.find('.send-text');
    
    // Show loading state
    $sendText.text('Sending...');
    $spinner.show();
    $btn.prop('disabled', true);
    
    // Get form data
    const formData = {
      to_email: 'ashutoshrawat325@gmail.com',
      from_name: $(this).find('[name="Name"]').val(),
      from_email: $(this).find('[name="Email"]').val(),
      reply_to: $(this).find('[name="Email"]').val(),
      message: $(this).find('[name="Message"]').val(),
      date: new Date().toLocaleString()
    };
    
    // Send email
    emailjs.send('service_q4wmmat', 'template_1cz8o6k', formData)
      .then(() => {
        showNotification('Message sent successfully!');
        this.reset();
      })
      .catch((error) => {
        console.error('Error:', error);
        showNotification('Failed to send message. Please try again.', true);
      })
      .finally(() => {
        // Reset button state
        $sendText.text('Send Message');
        $spinner.hide();
        $btn.prop('disabled', false);
      });
  });

  // Enhanced Smooth Scrolling for Navigation
  $('[data-animate="scrolling"]').on('click', function(e) {
    e.preventDefault();
    const target = $(this).attr('href');
    
    // Check if target exists
    if (target === '#' || !$(target).length) return;
    
    // Calculate offset considering sticky navbar
    const navbarHeight = $('.navbar.sticky').outerHeight() || 70;
    const targetPosition = $(target).offset().top - navbarHeight;
    
    // Smooth scroll with fallback to 'swing' if custom easing fails
    try {
      $('html, body').stop().animate({
        scrollTop: targetPosition
      }, 800, 'easeInOutExpo');
    } catch (e) {
      $('html, body').stop().animate({
        scrollTop: targetPosition
      }, 800, 'swing');
    }
    
    // Update active nav item
    $('.navbar-nav .nav-item').removeClass('active');
    $(this).parent().addClass('active');
    
    // Close mobile menu if open
    $('.navbar-collapse').collapse('hide');
  });

  // Resume Download Functionality
  $('#downloadResumeBtn').on('click', function(e) {
    e.preventDefault();
    
    // Create temporary link
    const link = document.createElement('a');
    link.href = '../../assets/docs/ashutosh_singh_rawat_ashutoshrawat325_gmail_com.pdf';
    link.download = 'Ashutosh_Singh_Rawat_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Optional: Track download event
    console.log('Resume downloaded');
    showNotification('Resume download started!');
  });

  // Projects data - updated with all projects
  const projects = {
    'job-portal': {
      title: 'Job Portal - Easily',
      period: 'July 2024 - December 2024',
      description: 'A dynamic job portal with comprehensive features...',
      technologies: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'EJS'],
      images: ['../assets/img/work/work-1.jpg', '../assets/img/work/work-1-2.jpg', '../assets/img/work/work-1-3.jpg'],
      liveLink: 'https://jobportal-easily.onrender.com/',
      codeLink: 'https://github.com/Ashutosh-Rawat/job-portal'
    },
    'ecommerce-api': {
      title: 'E-commerce API',
      period: 'January 2024 - March 2024',
      description: 'A RESTful API for e-commerce applications with product management, user authentication, and order processing.',
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST'],
      images: ['../assets/img/work/work-2.jpg', '../assets/img/work/work-2-2.jpg'],
      liveLink: '#',
      codeLink: '#'
    },
    'music-player': {
      title: 'Music Player',
      period: 'November 2023 - December 2023',
      description: 'An interactive audio player with playlist management and visual effects.',
      technologies: ['HTML5 Audio API', 'JavaScript', 'CSS3', 'Web Audio API'],
      images: ['../assets/img/work/work-3.jpg'],
      liveLink: '#',
      codeLink: '#'
    },
    'movieflix': {
      title: 'MovieFlix',
      period: 'April 2024 - June 2024',
      description: 'A streaming service clone with movie listings and user profiles.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Redux'],
      images: ['../assets/img/work/work-4.jpg'],
      liveLink: '#',
      codeLink: '#'
    }
  };

  // Project Modal Initialization with event delegation
  $(document).on('click', '.grid-item', function() {
    const projectId = $(this).data('project');
    
    if (!projectId) {
      console.error('No project ID found for this item');
      return;
    }

    const project = projects[projectId];
    
    if (!project) {
      console.error(`Project data not found for ID: ${projectId}`);
      return;
    }

    // Set modal content
    $('.project-title').text(project.title);
    $('.period-text').text(project.period);
    $('.project-description').html(project.description);
    
    // Build technology tags
    const techTags = $('.tech-tags');
    techTags.empty();
    project.technologies.forEach(tech => {
      techTags.append(`<span class="tech-tag">${tech}</span>`);
    });
    
    // Set project links
    $('#projectLiveLink').attr('href', project.liveLink || '#');
    $('#projectCodeLink').attr('href', project.codeLink || '#');
    
    // Initialize carousel
    const carousel = $('.project-carousel');
    carousel.owlCarousel('destroy');
    carousel.empty();
    
    project.images.forEach((img, index) => {
      carousel.append(`
        <div class="item">
          <img src="${img}" alt="${project.title} - Screenshot ${index + 1}" class="img-fluid">
        </div>
      `);
    });
    
    // Configure carousel
    carousel.owlCarousel({
      items: 1,
      loop: true,
      margin: 20,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      navText: [
        '<span class="ti-arrow-left"></span>',
        '<span class="ti-arrow-right"></span>'
      ],
      responsive: {
        0: { stagePadding: 10 },
        768: { stagePadding: 30 },
        992: { stagePadding: 50 }
      }
    });
    
    // Show modal with animation
    $('#projectModal').modal('show')
      .on('shown.bs.modal', function() {
        carousel.trigger('refresh.owl.carousel');
      });
  });

  // Initialize Isotope for filtering
  const $grid = $('.gridder').isotope({
    itemSelector: '.grid-item',
    percentPosition: true,
    layoutMode: 'fitRows',
    stagger: 30,
    hiddenStyle: {
      opacity: 0,
      transform: 'scale(0.001)'
    },
    visibleStyle: {
      opacity: 1,
      transform: 'scale(1)'
    }
  });

  // Filter projects
  $('.filterable-button').on('click', 'button', function() {
    const filterValue = $(this).attr('data-filter');
    $('.filterable-button button').removeClass('selected');
    $(this).addClass('selected');
    
    $grid.isotope({ 
      filter: filterValue,
      transitionDuration: '0.6s'
    });
  });

  // Initialize WOW.js for animations
  new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 50,
    mobile: true,
    live: true
  }).init();

  // Back to top button
  const backTop = $(".btn-back_to_top");

  $(window).scroll(function() {
    if ($(window).scrollTop() > 400) {
      backTop.css('visibility', 'visible').addClass('animated fadeIn');
    } else {
      backTop.css('visibility', 'hidden').removeClass('fadeIn');
    }
  });

  backTop.click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 800, 'swing');
    return false;
  });

  // Enhanced Sticky Navigation
  const stickyNav = {
    $navbar: $('.navbar.sticky'),
    navOffsetTop: 0,
    sections: [],

    init: function() {
      if (this.$navbar.length === 0) return;

      // Add fixed position and z-index to navbar
      this.$navbar.css({
        'position': 'fixed',
        'top': 0,
        'width': '100%',
        'z-index': 1030,
        'transition': 'all 0.3s ease'
      });

      // Add padding to body to prevent content jump
      $('body').css('padding-top', this.$navbar.outerHeight());

      this.navOffsetTop = this.$navbar.offset().top;
      this.cacheSections();
      this.bindEvents();
      this.update();
    },

    cacheSections: function() {
      this.sections = [];
      $('[data-animate="scrolling"]').each((i, link) => {
        const target = $(link).attr('href');
        if (target && target !== '#') {
          this.sections.push({
            link: link,
            target: $(target),
            top: $(target).offset().top - 100
          });
        }
      });
    },

    bindEvents: function() {
      $(window).on('scroll', () => this.update());
      $(window).on('resize', () => {
        // Update body padding when navbar height changes
        $('body').css('padding-top', this.$navbar.outerHeight());
        this.navOffsetTop = this.$navbar.offset().top;
        this.cacheSections();
        this.update();
      });
    },

    update: function() {
      const scrollTop = $(window).scrollTop();
      
      // Always keep navbar fixed at top
      this.$navbar.css('background-color', scrollTop > 50 ? 'rgba(52, 58, 64, 0.95)' : 'rgba(104, 102, 102, 0.8)');

      // Update active section in navigation
      this.sections.forEach(section => {
        if (scrollTop >= section.top && 
            (scrollTop < section.top + section.target.outerHeight())) {
          $(section.link).parent().addClass('active')
            .siblings().removeClass('active');
        }
      });
    }
  };

  // Initialize sticky navigation
  stickyNav.init();
});