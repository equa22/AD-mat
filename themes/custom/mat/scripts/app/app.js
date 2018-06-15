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
      var $ca_elem = $('.paragraph--type--carousel .field--name-field-slide-items > .field__item a', context);
      $ca_elem.each(function(){
        var $ca_get_id = $(this).attr('href').split('/');
        $(this).attr('href', '/stories#'+$ca_get_id[$ca_get_id.length-1]);
      });
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
          sr.reveal('.paragraph--type--pillar-group-item');
        }
      });
    }
  };


  function convertInString(num, length, char, surfix, holder) {
    var string = String(num);
    while(string.length != length) {
      string = holder + string;
    }

    for(var i = string.length - 1, chars = 0; i >= 0; i--) {
      chars++;
      if(chars == 3 && i > 0) {
        string = string.slice(0, i) + char + string.slice(i);
        chars = 0;
      }
    } 
    return string + surfix;
  }


  function animateNumber(field) {
    $(field).data('animated', true);
    $(field).css({'transition': $(field).data('count-repeat')*$(field).data('count-interval') + 'ms opacity linear', 'opacity': 1});
    
    var counter = 0;                                // count iterations
    var animateCounting = setInterval(function() {
      counter ++;
      $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
      if(counter == $(field).data('count-repeat')) {
        clearInterval(animateCounting);
      }
    }, $(field).data('count-interval'));
  }


  // "Why give life" page animations
  Drupal.behaviors.highlightSlide = {
    attach: function (context, settings) {
      var $numbers = $('.field.field--name-field-number.field--type-string.field--label-hidden.entity_type-paragraph.field__item');
      
      $numbers.toArray().forEach(function(el) {
        var text = $(el).text();
        
        $(el).attr({
          'data-number': text.replace(/\D/g,''),
          'data-count-char': text.search(',') < 0 ? '' : ',',
          'data-count-repeat': Number(text) > 5000 ? 100 : (Number(text.replace(/\D/g,'')) < 100 ? Number(text.replace(/\D/g,'')) : 50),
          'data-count-interval': Number(text.replace(/\D/g,'')) > 5000 ? 10 : 20,
          'data-count-surfix': text.search('X') < 0 ? '' : 'X',
          'data-count-holder': text.search(',') < 0 ? ' ' : '0'
        });

        $(el).css('opacity', 0.6);                                     // low opacity for transition effect
        $(el).text(convertInString(0, $(el).text().replace(',', '').length, $(el).data('count-char'), $(el).data('count-surfix'), $(el).data('count-holder')));   // set text to 0
      });

      $(window).scroll(function(e) {
        $numbers.toArray().forEach(function(el) {
          if($(el).offset().top - ($(window).height() + $(window).scrollTop() - $(el).height()/4*3) <= 0 && !$(el).data('animated')) {
            animateNumber(el);
          }
        });
      });
    }
  };
})(jQuery);