(function($) {
  'use strict';

$.fn.isInViewport = function(props) {
  var elementTop = $(this).offset().top + props;
  var elementBottom = elementTop + $(this).outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();
  return elementBottom > viewportTop && elementTop < viewportBottom;
 };
 
 function getShadow(angle, distance, spread, size) {
    angle = (180 - angle) * (Math.PI)/180;  // convert to radians
    var h_shadow = Math.round(Math.cos(angle)*distance);
    var v_shadow = Math.round(Math.sin(angle)*distance);
    spread = size*spread / 100;
    var blur = size - spread;

    return (h_shadow + 'px ' +  (v_shadow) + 'px ' +  size + 'px rgba(0,0,0,' + (size/100 < 0.4 ? size/100 : 0.4) + ')');
  }

  
  
 

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
      var $ca_elem = $('.paragraph--type--carousel .field--name-field-slide-items > .field__item a, .search-result.result-story-profile .search-result--heading > a', context);
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


  var animateCounting;

  function setCountInterval(field, interval, limit, counter) {
    animateCounting = setInterval(function() {
      counter ++;
      $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
      
      if(counter >= limit) {
        clearInterval(animateCounting);
      }

    }, interval);
  }

  function splitTextInSpan(text) {
    var html = "";
    for(var i = 0; i < text.length; i++) {
      html += '<span class="shine-letter">' + text[i] +'</span>';
    }

    return html;
  }
  function animateNumber(field) {
    $(field).data('animated', true);
    $(field).css({'transition': $(field).data('count-repeat')*$(field).data('count-interval') + 'ms opacity linear', 'opacity': 1});
    $(field).attr('data-delay', 0);
    var $shine = $(field).next('.shine').length > 0 ? $($(field).next('.shine')[0]) : null;

    var counter = 0;                                // count iterations

    var animateCounting = setInterval(function() {
      counter ++;

      $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
      if($shine) {$shine.html($(field).text());}


      if(counter >= $(field).data('count-repeat')/2) {
        clearInterval(animateCounting);
        animateCounting = setInterval(function() {
          counter ++;
          
          $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
          if($shine) {$shine.html($(field).text());}


          if(counter >= $(field).data('count-repeat')/4*3) {
            clearInterval(animateCounting);
            animateCounting = setInterval(function() {
              counter ++;
              
              $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
              if($shine) {$shine.html($(field).text());}


              if(counter >= $(field).data('count-repeat')/10*9) {
                clearInterval(animateCounting);
                
                animateCounting = setInterval(function() {
                  counter ++;
                  
                  $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
                  if($shine) {$shine.html(splitTextInSpan($(field).text()));}


                  if(counter == $(field).data('count-repeat')) {
                    clearInterval(animateCounting);
                  }

                }, $(field).data('count-interval')+100);
              }

            }, $(field).data('count-interval')+60);
          }
        }, $(field).data('count-interval')+30);
      }
    }, $(field).data('count-interval'));
  }


  // "Why give life" page animations
  Drupal.behaviors.countingNumbersAnimation = {
    attach: function (context, settings) {
      var $numbers = $('.field.field--name-field-number.field--type-string.field--label-hidden.entity_type-paragraph.field__item');
      var $shine = $('.paragraph--type--landing-page-counter .field.field--name-field-number.field--type-string.field--label-hidden.entity_type-paragraph.field__item');
      $shine.each(function() {
        $(this).after($('<div/>', {'class': 'shine field--name-field-number'}));
      });

      $numbers.toArray().forEach(function(el, i) {
        var text = $(el).text();
        
        $(el).attr({
          'data-number': text.replace(/\D/g,''),
          'data-count-char': text.search(',') < 0 ? '' : ',',
          'data-count-repeat': Number(text) > 5000 ? 100 : (Number(text.replace(/\D/g,'')) < 100 ? Number(text.replace(/\D/g,'')) : 50),
          'data-count-interval': Number(text.replace(/\D/g,'')) > 5000 ? 10 : 20,
          'data-count-surfix': text.search('X') < 0 ? '' : 'X',
          'data-count-holder': text.search(',') < 0 ? ' ' : '0'
        });

                                        
        $(el).text(convertInString(0, $(el).text().replace(',', '').length, $(el).data('count-char'), $(el).data('count-surfix'), $(el).data('count-holder')));   // set text to 0
        
        if($(el).next('.shine')) {
          $(el).next('.shine').html($(el).text());
        } else {
          $(el).css('opacity', 0.6);  // low opacity for transition effect
        }
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

  Drupal.behaviors.scrollAnimations = {
    attach: function(context, settings) {
      var lastScrollTop = 0, direction;
      var $paralaxWrapper = $('.paragraph--type--landing-page-stories');


      var parallaxElementsParent = ['.hearts-container', '.paragraph--type--landing-page-stories'];

      parallaxElementsParent.forEach(function(parent) {
        $(parent + ' .parallax').each(function() {
          $(this).css({'top': ($(this).offset().top - $(parent).offset().top) + 'px', 'bottom': 'auto'});
        });
      });
      

    // drop shine on element
    $(window).on( "mousemove scroll", function( event ) {
      $('.shine-letter').each(function(i, el) {
        if($(this).isInViewport(0)) {

          var elPosition = {
            x: $(el).offset().left + $(el).width()/2,
            y: $(el).offset().top + $(el).height()/2
          };

          var angleRadians = Math.atan2( elPosition.x - event.pageX,  elPosition.y - event.pageY)* 180 / Math.PI;
          var size = Math.sqrt(Math.pow((elPosition.x - event.pageX), 2) + Math.pow((elPosition.y - event.pageY), 2));
          $(this).css('text-shadow', getShadow(angleRadians + 90, (size/10 < 30 ? size/10 : 30), (size/10 < 80 ? size/10 : 80), (size/10 < 80 ? size/10 : 80)));
        }
      });
    });
     $(window).scroll(function(event){
       var st = $(this).scrollTop();
       if (st > lastScrollTop){
         direction = 'down';
       } else {
        direction = 'up';
       }
       lastScrollTop = st;
     });

     $(window).on('scroll', function() {
      var mobile_device = $('html').hasClass('device-mobile');  // check if device is mobile


      $('.parallax').each(function() {
       if($(this).isInViewport(0)) { //-Number($(this).css('top').replace('px', '')))
        var currentPosition = Number($(this).css('top').replace('px', ''));
        if(direction == 'down') {
         $(this).css('top', currentPosition - Number($(this).data('parallax-depth')) + 'px');
        } else {
         $(this).css('top', currentPosition + Number($(this).data('parallax-depth')) + 'px');
        }
       }
      });
      
      // get breaking point for animation
      var myth_fact_breakpoint =  mobile_device ? $(window).height()/4*3 : 100;

      $('.paragraph--type--myth-vs-fact').each(function() {
       if($(this).isInViewport(myth_fact_breakpoint)) {
        $(this).addClass('animate');
       } else if(mobile_device) {
          $(this).removeClass('animate');
       }
      });  
     });
    }
  };

  // Focus labels
  Drupal.behaviors.labelFocus = {
    attach: function (context, settings) {
      $('form input', context).keyup(function() {
        if(!$.trim(this.value).length) {
          $(this).parent().find('label').removeClass('labelfocus');
        } else { 
          $(this).parent().find('label').addClass('labelfocus');
        }
      });
    }
  };

  // Focus labels
  Drupal.behaviors.limitCharacters = {
    attach: function (context, settings) {
      $('#node-story-profile-story-submission-form .step2-content', context).append('<p id="charNum">0/500 Words</p>');
      function countChar(val) {
        var len = val.value.length;
        if (len >= 501) {
          val.value = val.value.substring(0, 501);
        } else {
          $('#charNum').text(len+'/500 Words');
        }
      }
      $('#node-story-profile-story-submission-form textarea', context).on('keyup', function() {
        countChar(this);
      });
    }
  };
})(jQuery);

