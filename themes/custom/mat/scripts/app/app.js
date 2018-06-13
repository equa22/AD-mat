(function($) {
  'use strict';

  // Toggling visibility of the main navigation (on mobile)
  Drupal.behaviors.mobileNavigation = {
    attach: function (context, settings) {
      $('#header .bars', context).once('mobile-navigation').on('click', function() {
        $('body').toggleClass('mobile-menu--opened');
        $('html').toggleClass('no-overflow');
      });
    }
  };

  // Accordions for newsroom, sidebar
  Drupal.behaviors.newsroomAccordion = {
    attach: function (context, settings) {
      $('#views-exposed-form-news-landing-page-1 > fieldset', context).first().addClass('active');
      $('#views-exposed-form-news-landing-page-1 fieldset legend', context).first().addClass('active');
      $('#views-exposed-form-news-landing-page-1 > fieldset .fieldset-wrapper', context).first().slideDown();
      $('#views-exposed-form-news-landing-page-1 fieldset legend', context).on('click', function(e) {
        e.preventDefault();
        $('#views-exposed-form-news-landing-page-1 fieldset', context).removeClass('active');
        $('#views-exposed-form-news-landing-page-1 fieldset .fieldset-wrapper', context).slideUp();
        $('#views-exposed-form-news-landing-page-1 fieldset legend', context).removeClass('active');
        $(this).toggleClass('active');
        $(this).parent().toggleClass('active');
        $(this).next().slideDown();
      });
    }
  };

  // Masonry init for newsroom view
  Drupal.behaviors.masonryNewsroom = {
    attach: function (context, settings) {
      $(window).on('load', function() {
        var w_w = $(window).width();
        if (w_w >= 768) {
          var $grid = $('.view-news-landing .view-content', context).masonry({
            itemSelector : '.views-row'
          });
        }
      });
      $(document).ajaxStop(function() {
        var w_w = $(window).width();
        if (w_w >= 768) {
          var $grid = $('.view-news-landing .view-content', context).masonry({
            itemSelector : '.views-row'
          });
        }
      });
    }
  };

  // Scroll review newsroom
  Drupal.behaviors.newsroomScrollReview = {
    attach: function (context, settings) {
      $(window).on('load', function() {
        window.sr = ScrollReveal();
        sr.reveal('.view-news-landing .view-content > .views-row');
        sr.reveal('.view-news-landing #views-exposed-form-news-landing-page-1');
      });
      $(document).ajaxStop(function() {
        sr.reveal('.view-news-landing .view-content > .views-row');
        sr.reveal('.view-news-landing #views-exposed-form-news-landing-page-1');
      });
    }
  };

  // Accordion for the main navigation (on mobile)
  Drupal.behaviors.accordionNavigation = {
    attach: function (context, settings) {
      function accordionMenu() {
        var w_w = $(window).width();
        if (w_w < 768) {
          $('.menu--main li.menu-item--expanded > a, .menu--main li.menu-item--expanded > span', context).on('click', function(e){
            e.preventDefault();
            var element = $(this).parent('li');
            if (element.hasClass('active')) {
              element.removeClass('active');
              element.find('li').removeClass('active');
            } else {
              element.addClass('active');
              element.siblings('li').removeClass('active');
              element.siblings('li').find('li').removeClass('active');
            }
          });
        }
      }
      accordionMenu();
      $(window).resize(function() {
        accordionMenu();
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

  // Highlight slide block
  Drupal.behaviors.highlightSlide = {
    attach: function (context, settings) {
      $('.region-highlight-slider .field--name-field-highlight-slides', context).once('highlight-slide').slick({
        dots: true,
        infinite: true,
        arrows: true,
        slidesToShow: 1
      });
    }
  };

  // Carousel
  Drupal.behaviors.carousel = {
    attach: function (context, settings) {
      $('.paragraph--type--carousel .carousel--wrapper > .field--name-field-slide-items', context).once('carousel').slick({
        infinite: true,
        arrows: true,
        slidesToScroll: 1,
        slidesToShow: 5,
        centerMode: false,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 2130,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 1770,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              centerMode: true
            }
          }
        ]
      });
    }
  };

  // Masonry and ScrollReveal init for pillars
  Drupal.behaviors.pillars = {
    attach: function (context, settings) {
      $(window).on('load', function() {
        var w_w = $(window).width();

        if (w_w >= 768) {
          var $grid = $('.field--name-field-pillar-group-items', context).once('pillars').masonry({
            itemSelector : '.field--name-field-pillar-group-items > .field__item'
          });

          sr.reveal('.paragraph--type--pillar-group-item');
        }
      });
    }
  };
})(jQuery);