(function($) {
  'use strict';

  // Toggling visibility of the main navigation (on mobile)
  Drupal.behaviors.mobileNavigation = {
    attach: function (context, settings) {
      $('#header .bars', context).once('mobile-navigation').on('click', function() {
        $('body').toggleClass('mobile-menu--opened');
      });
    }
  };

  // Accordion for the main navigation (on mobile)
  Drupal.behaviors.accordionNavigation = {
    attach: function (context, settings) {
      function setAccordion() {
        var windowWidth = $(window).width();

        if (windowWidth < 768) {
          $('#block-mat-main-menu .menu-item--expanded > span, #block-mat-main-menu .menu-item--expanded > a')
                        .attr('aria-expanded', 'false')
                        .attr('role', 'button')
                        .attr('data-toggle', 'collapse')
                        .addClass('collapsed');

          $('#block-mat-main-menu .menu-item--expanded > ul').addClass('collapse')
                                 .attr('data-parent', '#block-mat-main-menu');                

          $('#block-mat-main-menu .menu-item--expanded').each(function(n) {
            $(this).attr('id', 'heading' + n);

            $(this).find('.menu-item--expanded > ul').attr('data-parent', '#heading' + n);

            $(this).find('> span, > a').attr('data-target', '#collapse' + n)
                                       .attr('aria-controls', 'collapse' + n);

            $(this).find('> ul').attr('id', 'collapse' + n)
                                .attr('aria-labelledby', 'heading' + n);
          });
        } else {
          $('#block-mat-main-menu .menu-item--expanded > span, .menu-item--expanded > a').attr('data-toggle', '');
        }
      }

      setAccordion();
      $(window).on('resize', setAccordion);

      // Styling for opened item of the main navigation (on mobile)
      $('#block-mat-main-menu .menu-item--expanded', context).once('opened-item').on('click', function() {
        $(this).siblings().removeClass('menu-item--opened');
        $(this).addClass('menu-item--opened');
      });
    }
  };

  // Search in main navigation (overlay and mobile)
  Drupal.behaviors.topbarSearch = {
    attach: function (context, settings) {
      // To open Search overlay
      $('#topbar--search-open', context).once('search-overlay').on('click', function() {
        $('#block-header-search-block').addClass('search-block--opened');
      });

      // To close Search overlay
      $('#topbar--search-close .i-close', context).once('search-overlay-close').on('click', function() {
        $('#block-header-search-block').removeClass('search-block--opened');
      });

      // Setting placeholder on mobile
      var placeholderOrigin = $('#block-header-search-block .form-text').attr('placeholder');

      function setMobilePlaceholder() {
        var windowWidth = $(window).width();
        
        if (windowWidth < 768) {
         $('#block-header-search-block .form-text').attr('placeholder', Drupal.t('Search'));
        } else {
          $('#block-header-search-block .form-text').attr('placeholder', placeholderOrigin);
        }
      }

      setMobilePlaceholder();
      $(window).on('resize', setMobilePlaceholder);
    }
  };


  // Hero slider on home page
  Drupal.behaviors.heroSlider = {
    attach: function (context, settings) {
      $('.paragraph--type--landing-page-slider .field--name-field-slides', context).once('hero-slider').slick({
        infinite: true,
        arrows: false,
        slidesToShow: 1
      });
    }
  };

  // Carousel
  Drupal.behaviors.carousel = {
    attach: function (context, settings) {
      

      $('.paragraph--type--carousel > .field--name-field-slide-items', context).once('carousel').slick({
        infinite: true,
        arrows: true,
        slidesToScroll: 1,
        slidesToShow: 4,
        centerMode: false,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 2220,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 1774,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 1420,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });
    }
  };
  

})(jQuery);