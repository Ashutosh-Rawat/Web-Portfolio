$(function() {
    // Initialize WOW.js for animations
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 50,
        mobile: true,
        live: true
    }).init();

    // Cache DOM elements
    const $navbar = $('.navbar.sticky');
    const $navLinks = $('.navbar-nav .nav-link');
    const $sections = $('.section');
    const $backToTop = $('.btn-back_to_top');
    const $navbarCollapse = $('.navbar-collapse');
    const $navbarToggler = $('.navbar-toggler');
    const $body = $('body');

    // Set initial navbar background
    function setNavbarBackground() {
        if ($(window).scrollTop() > 50) {
            $navbar.css('background-color', 'rgba(52, 58, 64, 0.95)');
        } 
        // else {
        //     $navbar.css('background-color', 'rgba(104, 102, 102, 0.8)');
        // }
    }
    setNavbarBackground();

    // Enhanced Smooth Scrolling for Navigation
    function handleNavLinkClick(e) {
        e.preventDefault();
        const $this = $(this);
        const target = $this.attr('href');
        
        if (target === '#' || !$(target).length) return;
        
        const navbarHeight = $navbar.outerHeight() || 70;
        const targetPosition = $(target).offset().top - navbarHeight;
        
        $('html, body').stop().animate({
            scrollTop: targetPosition
        }, {
            duration: 800,
            easing: 'swing',
            complete: function() {
                // Update URL hash after scroll completes
                if (history.pushState) {
                    history.pushState(null, null, target);
                } else {
                    window.location.hash = target;
                }
            }
        });
        
        updateActiveNavItem($this);
        $navbarCollapse.collapse('hide');
    }
    $navLinks.on('click', handleNavLinkClick);

    // Update active nav item
    function updateActiveNavItem($clickedLink) {
        $navLinks.parent().removeClass('active');
        
        if ($clickedLink) {
            $clickedLink.parent().addClass('active');
        } else {
            // Find active section based on scroll position
            const scrollPosition = $(window).scrollTop() + ($(window).height() / 3);
            const navbarHeight = $navbar.outerHeight() || 70;
            let foundActive = false;
            
            $sections.each(function() {
                const $section = $(this);
                const sectionTop = $section.offset().top - navbarHeight;
                const sectionBottom = sectionTop + $section.outerHeight();
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    const sectionId = $section.attr('id');
                    $(`.navbar-nav a[href="#${sectionId}"]`).parent().addClass('active');
                    foundActive = true;
                    return false; // Break the loop
                }
            });
            
            // If no section found, check if we're at the top of the page
            if (!foundActive && $(window).scrollTop() < 100) {
                $navLinks.first().parent().addClass('active');
            }
        }
    }

    // Throttle scroll events
    let scrollTimeout;
    function handleScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            setNavbarBackground();
            updateActiveNavItem();
            
            // Show/hide back to top button
            if ($(window).scrollTop() > 400) {
                $backToTop.addClass('active');
            } else {
                $backToTop.removeClass('active');
            }
        }, 100);
    }
    $(window).on('scroll', handleScroll);

    // Back to top button
    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 800, 'swing');
    });

    // Handle page load with hash
    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash && $(hash).length) {
            // Scroll to section after short delay to allow DOM to load
            setTimeout(function() {
                const targetPosition = $(hash).offset().top - $navbar.outerHeight();
                $('html, body').scrollTop(targetPosition);
            }, 100);
            
            // Highlight the corresponding nav item
            $(`.navbar-nav a[href="${hash}"]`).parent().addClass('active');
        }
    }
    handleInitialHash();

    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.navbar').length && 
            $navbarCollapse.hasClass('show') && 
            !$(e.target).is($navbarToggler)) {
            $navbarCollapse.collapse('hide');
        }
    });

    // Animate progress bars when they come into view
    function animateProgressBars() {
        $('.stat-progress').each(function() {
            const $this = $(this);
            if (!$this.hasClass('animated')) {
                const width = $this.data('width') || $this.attr('style').match(/width: (\d+)%/)[1];
                $this.css('width', '0').animate({
                    width: width + '%'
                }, 1000);
                $this.addClass('animated');
            }
        });
    }

    // Check if progress bars are visible on load
    function checkProgressBarsOnLoad() {
        $('.amcat-stats').each(function() {
            const $element = $(this);
            const elementTop = $element.offset().top;
            const elementBottom = elementTop + $element.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                animateProgressBars();
            }
        });
    }
    checkProgressBarsOnLoad();

    // Animate numbers in fun facts section
    function animateNumbers() {
        $('.number').each(function() {
            const $this = $(this);
            const countTo = $this.attr('data-number');
            const duration = 2000;
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: duration,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }
    animateNumbers();

    // Initialize active nav item on page load
    updateActiveNavItem();

    // Handle window resize
    let resizeTimeout;
    $(window).on('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recalculate positions after resize
            const hash = window.location.hash;
            if (hash && $(hash).length) {
                const targetPosition = $(hash).offset().top - $navbar.outerHeight();
                $('html, body').scrollTop(targetPosition);
            }
        }, 250);
    });
});