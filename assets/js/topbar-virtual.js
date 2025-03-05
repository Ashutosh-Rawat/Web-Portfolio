$(function() {
  // Initialize Isotope for portfolio filtering
  var $grid = $('.gridder').isotope({
    itemSelector: '.grid-item',
    percentPosition: true
  });

  // Filter items on button click
  $('.filterable-button').on('click', 'button', function() {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
  });

  // Initialize Owl Carousel for testimonials (if needed)
  $('.testi-carousel').owlCarousel({
    margin: 0,
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    items: 1,
  });

  // Initialize Nice Select (if needed)
  $('.vg-select').niceSelect();

  // Initialize Tooltips (if needed)
  $('[data-toggle="tooltip"]').tooltip();

  // Initialize WOW.js for animations
  new WOW().init();

  // Back to top button functionality
  var backTop = $(".btn-back_to_top");

  $(window).scroll(function() {
    if ($(document).scrollTop() > 400) {
      backTop.css('visibility', 'visible');
    } else if ($(document).scrollTop() < 400) {
      backTop.css('visibility', 'hidden');
    }
  });

  backTop.click(function() {
    $('html').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });

  // Smooth scrolling for anchor links
  $('[data-animate="scrolling"]').each(function() {
    var self = $(this);
    var target = $(this).data('target') ? $(this).data('target') : $(this).attr('href');

    self.click(function(e) {
      $('body, html').animate({ scrollTop: $(target).offset().top }, 1000);
      return false;
    });
  });

  // Counter animation
  var counterInit = function() {
    if ($('.section-counter').length > 0) {
      $('.section-counter').waypoint(function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
          var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
          $('.number').each(function() {
            var $this = $(this),
              num = $this.data('number');
            $this.animateNumber(
              {
                number: num,
                numberStep: comma_separator_number_step
              }, 5000
            );
          });
        }
      }, { offset: '95%' });
    }
  };
  counterInit();
});

$(document).ready(function () {
  /* Sticky navigation */
  var sticky = {
    $sticky: $('.sticky'),
    offsets: [],
    targets: [],
    stickyTop: null,

    set: function () {
      var self = this;

      var windowTop = Math.floor($(window).scrollTop());

      self.offsets = [];
      self.targets = [];

      // Get current top position of sticky element
      self.stickyTop = self.$sticky.data('offset') ? self.$sticky.css('position', 'absolute').data('offset') : self.$sticky.css('position', 'absolute').offset().top;

      // Cache all targets and their top positions
      self.$sticky.find('a').map(function () {
        var $el = $(this),
          href = $el.data('target') || $el.attr('href'),
          $href = /^#./.test(href) && $(href);

        return $href && $href.length && $href.is(':visible') ? [[$href[0].getBoundingClientRect().top + windowTop, href]] : null;
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0]);
        self.targets.push(this[1]);
      });
    },

    update: function () {
      var self = this;

      var windowTop = Math.floor($(window).scrollTop());
      var $stickyLinks = self.$sticky.find('.navbar-nav .nav-item').removeClass('active');
      var stickyPosition = 'fixed';
      var currentIndex = 0;

      // Toggle fixed position depending on visibility
      if ($(window).width() < 800 || $(window).height() < 500 || self.stickyTop > windowTop) {
        stickyPosition = 'absolute';
        self.$sticky.removeClass('floating');
      } else {
        for (var i = self.offsets.length; i--;) {
          if (windowTop >= self.offsets[i] - 2 && (self.offsets[i + 1] === undefined || windowTop <= self.offsets[i + 1] + 2)) {
            currentIndex = i;
            break;
          }
        }
      }

      self.$sticky.css({ 'position': stickyPosition });

      if (stickyPosition == 'absolute') {
        self.$sticky.removeClass('floating');
      } else {
        self.$sticky.addClass('floating');
      }

      $stickyLinks.eq(currentIndex).addClass('active');
    },

    init: function () {
      var self = this;

      $(window).on('resize', function () {
        self.set();
        self.update();
      });

      $(window).on('scroll', function () {
        self.update();
      });

      $(window).trigger('resize');
    }
  };

  if ($('.navbar').hasClass('sticky')) {
    sticky.init();
  }
});