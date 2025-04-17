$(function() {
    // Initialize WOW.js for animations
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 50,
        mobile: true,
        live: true
    }).init();

    // Animate progress bars when they come into view
    function animateProgressBars() {
        $('.stat-progress').each(function() {
            const width = $(this).data('width') || $(this).attr('style').match(/width: (\d+)%/)[1];
            $(this).css('width', '0').animate({
                width: width + '%'
            }, 1000);
        });
    }

    // Run animation when progress bars are in viewport
    $(window).scroll(function() {
        $('.amcat-stats').each(function() {
            const position = $(this).offset().top;
            const scroll = $(window).scrollTop();
            const windowHeight = $(window).height();
            
            if (scroll + windowHeight > position + 100) {
                animateProgressBars();
                // Remove the scroll event after animation runs
                $(window).off('scroll');
            }
        });
    });

    // Trigger animation if elements are already in view on page load
    if ($('.amcat-stats').length && $('.amcat-stats').offset().top < $(window).height()) {
        animateProgressBars();
    }

    // Smooth scrolling for navigation links
    $('a[href^="#"]').not('[href="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        
        const navbarHeight = $('.navbar.sticky').outerHeight() || 70;
        const targetPosition = $(target).offset().top - navbarHeight;
        
        $('html, body').stop().animate({
            scrollTop: targetPosition
        }, 800, 'swing');
        
        // Update active nav item
        $('.navbar-nav .nav-item').removeClass('active');
        $(this).parent().addClass('active');
        
        // Close mobile menu if open
        $('.navbar-collapse').collapse('hide');
    });

    // External link indicators
    $('a[target="_blank"]').append(' <span class="ti-link"></span>');

    // Back to top button
    const backTop = $(".btn-back_to_top");

    $(window).scroll(function() {
        if ($(window).scrollTop() > 400) {
            backTop.addClass('active');
        } else {
            backTop.removeClass('active');
        }
    });

    backTop.click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800, 'swing');
        return false;
    });

    // Set active nav item based on scroll position
    function updateActiveNavItem() {
        const scrollPosition = $(window).scrollTop() + ($(window).height() / 2);
        const navbarHeight = $('.navbar.sticky').outerHeight() || 70;
        
        $('.section').each(function() {
            const sectionId = $(this).attr('id');
            const sectionTop = $(this).offset().top - navbarHeight;
            const sectionBottom = sectionTop + $(this).outerHeight();
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                $('.navbar-nav .nav-item').removeClass('active');
                $(`.navbar-nav a[href="#${sectionId}"]`).parent().addClass('active');
            }
        });
    }

    // Run on scroll and page load
    $(window).scroll(updateActiveNavItem);
    updateActiveNavItem();

    // Highlight current section on page load if hash exists
    const hash = window.location.hash;
    if (hash) {
        $(`.navbar-nav a[href="${hash}"]`).parent().addClass('active');
    }
});