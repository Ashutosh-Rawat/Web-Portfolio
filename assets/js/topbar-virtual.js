$(function () {
  // Initialize EmailJS with your public key
  emailjs.init("Z--PbmHadH3VtMEnr");

  // Add custom easing function
  $.extend($.easing, {
    easeInOutExpo: function (x, t, b, c, d) {
      if (t === 0) return b;
      if (t === d) return b + c;
      if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    },
  });

  // Enhanced Notification system
  function showNotification(message, isError = false) {
    const $notification = $("#notification");
    const $message = $("#notification-message");

    // Clear any existing timeout
    if ($notification.data("timeout")) {
      clearTimeout($notification.data("timeout"));
    }

    // Set notification content and style
    $notification
      .removeClass("show success error")
      .addClass("show")
      .addClass(isError ? "error" : "success");
    $message.text(message);

    // Auto-hide after 5 seconds
    const timeout = setTimeout(() => {
      $notification.removeClass("show");
    }, 5000);

    // Store timeout reference
    $notification.data("timeout", timeout);
  }

  // Close notification manually
  $(document).on("click", ".close-notification", function () {
    const $notification = $("#notification");
    $notification.removeClass("show");

    // Clear the timeout if clicked manually
    if ($notification.data("timeout")) {
      clearTimeout($notification.data("timeout"));
    }
  });

  // Contact form submission handler
  $(".vg-contact-form").submit(function (e) {
    e.preventDefault();

    const $btn = $("#sendMessageBtn");
    const $spinner = $btn.find(".spinner");
    const $sendText = $btn.find(".send-text");

    // Show loading state
    $sendText.text("Sending...");
    $spinner.show();
    $btn.prop("disabled", true);

    // Get form data
    const formData = {
      to_email: "ashutoshrawat325@gmail.com",
      from_name: $(this).find('[name="Name"]').val(),
      from_email: $(this).find('[name="Email"]').val(),
      reply_to: $(this).find('[name="Email"]').val(),
      message: $(this).find('[name="Message"]').val(),
      date: new Date().toLocaleString(),
    };

    // Send email
    emailjs
      .send("service_q4wmmat", "template_1cz8o6k", formData)
      .then(() => {
        showNotification("Message sent successfully!");
        this.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("Failed to send message. Please try again.", true);
      })
      .finally(() => {
        // Reset button state
        $sendText.text("Send Message");
        $spinner.hide();
        $btn.prop("disabled", false);
      });
  });

  // Enhanced Smooth Scrolling for Navigation
  $(".navbar-nav .nav-link").on("click", function (e) {
    const target = $(this).attr("href");

    // Check if target is external link
    if (target.includes(".html")) {
      return; // Let default behavior handle it
    }

    e.preventDefault();

    // Calculate offset considering sticky navbar
    const navbarHeight = $(".navbar.sticky").outerHeight() || 70;
    const targetPosition = $(target).offset().top - navbarHeight;

    // Smooth scroll with easing
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: targetPosition,
        },
        800,
        "easeInOutExpo",
        function () {
          // Update URL hash after scroll completes
          if (history.pushState) {
            history.pushState(null, null, target);
          } else {
            window.location.hash = target;
          }
        }
      );

    // Update active nav item
    $(".navbar-nav .nav-item").removeClass("active");
    $(this).parent().addClass("active");

    // Close mobile menu if open
    $(".navbar-collapse").collapse("hide");
  });

  // Resume Download Functionality
  $("#downloadResumeBtn").on("click", function (e) {
    e.preventDefault();

    // Create temporary link
    const link = document.createElement("a");
    link.href = "assets/docs/ashutosh_singh_rawat_resume.pdf";
    link.download = "Ashutosh_Singh_Rawat_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("Resume download started!");
  });

  // Initialize WOW.js for animations
  new WOW({
    boxClass: "wow",
    animateClass: "animated",
    offset: 50,
    mobile: true,
    live: true,
  }).init();

  // Back to top button
  const $backToTop = $(".btn-back_to_top");

  // Function to update active nav item based on scroll position
  function updateActiveNavItem() {
    const scrollPosition = $(window).scrollTop();
    const navbarHeight = $(".navbar.sticky").outerHeight() || 70;
    let foundActive = false;

    // Reset all active states
    $(".navbar-nav .nav-item").removeClass("active");

    // Check each section
    $("[id]").each(function () {
      const $section = $(this);
      const sectionTop = $section.offset().top - navbarHeight - 100;
      const sectionBottom = sectionTop + $section.outerHeight();

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const sectionId = $section.attr("id");
        $(`.navbar-nav a[href="#${sectionId}"]`).parent().addClass("active");
        foundActive = true;
        return false; // Break the loop after first match
      }
    });

    // If at top of page and no section found, highlight home
    if (!foundActive && scrollPosition < 100) {
      $('.navbar-nav a[href="#home"]').parent().addClass("active");
    }
  }

  // Handle scroll events with throttling
  let scrollTimeout;
  $(window).on("scroll", function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      // Show/hide back to top button
      if ($(window).scrollTop() > 400) {
        $backToTop.addClass("active");
      } else {
        $backToTop.removeClass("active");
      }

      // Update active nav item
      updateActiveNavItem();
    }, 100);
  });

  // Back to top button click handler
  $backToTop.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      800,
      "easeInOutExpo"
    );
  });

  // Handle page load with hash
  function handleInitialHash() {
    const hash = window.location.hash;
    if (hash && $(hash).length) {
      // Scroll to section after short delay to allow DOM to load
      setTimeout(function () {
        const targetPosition =
          $(hash).offset().top - $(".navbar.sticky").outerHeight();
        $("html, body").scrollTop(targetPosition);
      }, 100);

      // Highlight the corresponding nav item
      $(`.navbar-nav a[href="${hash}"]`).parent().addClass("active");
    }
  }
  handleInitialHash();

  // Close mobile menu when clicking outside
  $(document).on("click", function (e) {
    const $navbarCollapse = $(".navbar-collapse");
    const $navbarToggler = $(".navbar-toggler");

    if (
      !$(e.target).closest(".navbar").length &&
      $navbarCollapse.hasClass("show") &&
      !$(e.target).is($navbarToggler)
    ) {
      $navbarCollapse.collapse("hide");
    }
  });

  // Projects data
  const projects = {
    "job-portal": {
      title: "Job Portal - Easily",
      period: "July 2024 - December 2024",
      description:
        "A dynamic job portal with comprehensive features for job seekers and employers, including profile management, job listings, and application tracking.",
      technologies: [
        "HTML5",
        "CSS3",
        "Bootstrap 5",
        "JavaScript",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose",
        "EJS",
      ],
      images: [
        "../assets/img/projects/easily/easily-img1.png",
        "../assets/img/projects/easily/easily-img2.png",
        "../assets/img/projects/easily/easily-img3.png",
        "../assets/img/projects/easily/easily-img4.png",
        "../assets/img/projects/easily/easily-img5.png",
      ],
      liveLink: "https://jobportal-easily.onrender.com/",
      codeLink: "https://github.com/Ashutosh-Rawat/JobPortal---Easily",
    },
    "ecommerce-api": {
      title: "E-commerce API",
      period: "January 2024 - March 2024",
      description:
        "A RESTful API for e-commerce applications with product management, user authentication, and order processing capabilities.",
      technologies: ["Node.js", "Express.js", "MongoDB", "JWT", "REST"],
      images: [
        "../assets/img/projects/ecom-api/ecom-api-img1.png",
        "../assets/img/projects/ecom-api/ecom-api-img2.png",
        "../assets/img/projects/ecom-api/ecom-api-img3.png",
      ],
      liveLink: "https://ecom-api-kcuj.onrender.com/api/docs",
      codeLink: "https://github.com/Ashutosh-Rawat/ecom-api",
    },
    "music-player": {
      title: "Music Player",
      period: "November 2023 - December 2023",
      description:
        "An interactive audio player with playlist management, visual effects, and responsive controls for an enhanced listening experience.",
      technologies: ["HTML5 Audio API", "JavaScript", "CSS3", "Web Audio API"],
      images: [
        "../assets/img/projects/music-player/music-player-img1.png",
        "../assets/img/projects/music-player/music-player-img2.png",
      ],
      liveLink: "https://ashutosh-rawat.github.io/musicplayer/",
      codeLink: "https://github.com/Ashutosh-Rawat/musicplayer",
    },
    movieflix: {
      title: "MovieFlix",
      period: "April 2024 - June 2024",
      description:
        "A streaming service clone with movie listings, user profiles, and responsive design that works across all devices.",
      technologies: ["React", "Node.js", "MongoDB", "Redux"],
      images: [
        "../assets/img/projects/movieflix/movieflix-img1.png",
        "../assets/img/projects/movieflix/movieflix-img2.png",
        "../assets/img/projects/movieflix/movieflix-img3.png",
        "../assets/img/projects/movieflix/movieflix-img4.png",
        "../assets/img/projects/movieflix/movieflix-img5.png",
        "../assets/img/projects/movieflix/movieflix-img6.png",
      ],
      liveLink:
        "https://ashutosh-rawat.github.io/Video-streaming-website-clone/",
      codeLink:
        "https://github.com/Ashutosh-Rawat/Video-streaming-website-clone",
    },
  };

  // Initialize project carousel
  function initProjectCarousel(images, title) {
    const $carousel = $(".project-carousel");
    $carousel.owlCarousel("destroy");
    $carousel.empty();

    images.forEach((img, index) => {
      $carousel.append(`
        <div class="item">
          <img src="${img}" alt="${title} - Screenshot ${
        index + 1
      }" class="img-fluid">
        </div>
      `);
    });

    $carousel.owlCarousel({
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
        '<span class="ti-arrow-right"></span>',
      ],
      responsive: {
        0: { stagePadding: 10 },
        768: { stagePadding: 30 },
        992: { stagePadding: 50 },
      },
    });
  }

  // Initialize Isotope for filtering
  const $grid = $(".gridder").isotope({
    itemSelector: ".grid-item",
    layoutMode: "fitRows",
    stagger: 30,
    hiddenStyle: {
      opacity: 0,
      transform: "scale(0.001)",
    },
    visibleStyle: {
      opacity: 1,
      transform: "scale(1)",
    },
  });

  // Filter projects
  $(".filterable-button").on("click", "button", function () {
    const filterValue = $(this).attr("data-filter");
    $(".filterable-button button").removeClass("selected");
    $(this).addClass("selected");

    $grid.isotope({
      filter: filterValue,
      transitionDuration: "0.6s",
    });
  });

  // Project Click Handler
  $(document).on("click", ".grid-item", function () {
    const projectId = $(this).data("project");

    if (!projectId) {
      console.error("No project ID found for this item");
      return;
    }

    const project = projects[projectId];

    if (!project) {
      console.error(`Project data not found for ID: ${projectId}`);
      return;
    }

    // Set modal content
    $(".project-title").text(project.title);
    $(".period-text").text(project.period);
    $(".project-description").html(project.description);

    // Build technology tags
    const $techTags = $(".tech-tags");
    $techTags.empty();
    project.technologies.forEach((tech) => {
      $techTags.append(`<span class="tech-tag">${tech}</span>`);
    });

    // Set project links
    $("#projectLiveLink")
      .attr("href", project.liveLink || "#")
      .toggleClass("disabled", !project.liveLink);
    $("#projectCodeLink")
      .attr("href", project.codeLink || "#")
      .toggleClass("disabled", !project.codeLink);

    // Initialize carousel
    initProjectCarousel(project.images, project.title);

    // Show modal with animation
    $("#projectModal")
      .modal("show")
      .on("shown.bs.modal", function () {
        $(".project-carousel").trigger("refresh.owl.carousel");
      });
  });

  // Handle window resize
  $(window).on("resize", function () {
    // Update body padding when navbar height changes (now +4px)
    $("body").css("padding-top", $(".navbar.sticky").outerHeight() + 4);
  });

  // Initialize on page load
  updateActiveNavItem();
  $("body").css("padding-top", $(".navbar.sticky").outerHeight() + 4); // +4px here too

  // Initialize counter animation
  $(".number").each(function () {
    const $this = $(this);
    const target = parseInt($this.attr("data-number"));
    const duration = 2000;

    $({ count: 0 }).animate(
      { count: target },
      {
        duration: duration,
        easing: "swing",
        step: function () {
          $this.text(Math.floor(this.count));
        },
        complete: function () {
          $this.text(target);
        },
      }
    );
  });
});
