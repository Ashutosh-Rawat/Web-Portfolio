$(function() {
  // Initialize EmailJS with your public key
  emailjs.init("Z--PbmHadH3VtMEnr");

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

  // Enhanced Project Data
  const projects = {
    'job-portal': {
      title: 'Job Portal - Easily',
      period: 'July 2024 - December 2024',
      description: 'A dynamic job portal with comprehensive features:<br><br>• Secure JWT authentication for employers and candidates<br>• Real-time job application tracking system<br>• Automated email notifications<br>• Responsive design for all devices<br>• Form validations for data integrity',
      technologies: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'EJS'],
      images: ['../assets/img/work/work-1.jpg', '../assets/img/work/work-1-2.jpg', '../assets/img/work/work-1-3.jpg'],
      liveLink: 'https://jobportal-easily.onrender.com/',
      codeLink: 'https://github.com/Ashutosh-Rawat/job-portal'
    },
    'ecommerce-api': {
      title: 'E-commerce API',
      period: 'October 2024 - December 2024',
      description: 'Complete e-commerce solution with:<br><br>• Product catalog management<br>• Secure payment processing<br>• User authentication with JWT<br>• MongoDB transactions for safety<br>• Comprehensive Swagger documentation<br>• Winston logging system',
      technologies: ['Node.js', 'Express.js', 'JWT', 'MongoDB', 'Mongoose', 'Swagger UI', 'Winston'],
      images: ['../assets/img/work/work-2.jpg', '../assets/img/work/work-2-2.jpg'],
      liveLink: 'https://ecom-api-kcuj.onrender.com/api/docs',
      codeLink: 'https://github.com/Ashutosh-Rawat/ecommerce-api'
    },
    'music-player': {
      title: 'Music Player App',
      period: 'July 2024 - October 2024',
      description: 'Immersive audio experience featuring:<br><br>• Sleek, intuitive interface<br>• Smooth audio playback controls<br>• Playlist management<br>• Responsive design<br>• Cross-browser compatibility',
      technologies: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'jQuery'],
      images: ['../assets/img/work/work-3.jpg', '../assets/img/work/work-3-2.jpg'],
      liveLink: 'https://ashutosh-rawat.github.io/musicplayer/',
      codeLink: 'https://github.com/Ashutosh-Rawat/musicplayer'
    },
    'movieflix': {
      title: 'MovieFlix Streaming Platform',
      period: 'October 2023 - January 2024',
      description: 'Streaming service clone with:<br><br>• Real-time movie data from TMDb API<br>• Trailer playback functionality<br>• Responsive grid layout<br>• Detailed movie information<br>• User-friendly navigation',
      technologies: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'TMDb API', 'jQuery'],
      images: ['../assets/img/work/work-4.jpg', '../assets/img/work/work-4-2.jpg'],
      liveLink: 'https://ashutosh-rawat.github.io/Video-streaming-website-clone/',
      codeLink: 'https://github.com/Ashutosh-Rawat/Video-streaming-website-clone'
    }
  };

  // Enhanced Project Modal Initialization
  $('.grid-item').on('click', function() {
    const projectId = $(this).data('project');
    const project = projects[projectId];
    
    if (project) {
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
      $('#projectLiveLink').attr('href', project.liveLink);
      $('#projectCodeLink').attr('href', project.codeLink);
      
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
          0: {
            stagePadding: 10
          },
          768: {
            stagePadding: 30
          },
          992: {
            stagePadding: 50
          }
        }
      });
      
      // Show modal with animation
      $('#projectModal').modal('show')
        .on('shown.bs.modal', function() {
          carousel.trigger('refresh.owl.carousel');
        });
    }
  });

  // Portfolio Filtering with Isotope
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

  // Filter items on button click
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

  // Back to top button functionality
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
    }, 800, 'easeInOutExpo');
    return false;
  });

  // Smooth scrolling for anchor links
  $('[data-animate="scrolling"]').on('click', function(e) {
    e.preventDefault();
    const target = $(this).attr('href');
    if (target === '#') return;
    
    $('html, body').animate({
      scrollTop: $(target).offset().top - 70
    }, 800, 'easeInOutExpo');
  });

  // Counter animation
  const counterInit = function() {
    if ($('.section-counter').length > 0) {
      $('.section-counter').waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
          $('.number').each(function() {
            const $this = $(this);
            const num = $this.data('number');
            $this.animateNumber(
              {
                number: num,
                numberStep: $.animateNumber.numberStepFactories.separator(',')
              }, 
              2000
            );
          });
          $(this.element).addClass('animated');
        }
      }, { offset: '85%' });
    }
  };
  counterInit();

  // Initialize other plugins
  $('.testi-carousel').owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    nav: false,
    dots: true
  });

  $('.vg-select').niceSelect();
  $('[data-toggle="tooltip"]').tooltip();

  // Sticky Navigation
  const stickyNav = {
    $navbar: $('.navbar.sticky'),
    navOffsetTop: 0,
    sections: [],

    init: function() {
      if (this.$navbar.length === 0) return;

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
        this.navOffsetTop = this.$navbar.offset().top;
        this.cacheSections();
        this.update();
      });
    },

    update: function() {
      const scrollTop = $(window).scrollTop();
      
      // Toggle sticky class
      if (scrollTop > this.navOffsetTop) {
        this.$navbar.addClass('floating').css('background-color', 'rgba(52, 58, 64, 0.95)');
      } else {
        this.$navbar.removeClass('floating').css('background-color', 'rgba(104, 102, 102, 0.8)');
      }

      // Update active nav item
      this.sections.forEach(section => {
        if (scrollTop >= section.top && 
            (scrollTop < section.top + section.target.outerHeight())) {
          $(section.link).parent().addClass('active')
            .siblings().removeClass('active');
        }
      });
    }
  };

  stickyNav.init();
});