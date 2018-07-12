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
      $('#views-exposed-form-news-landing-page-1 > fieldset', context).addClass('active');
      $('#views-exposed-form-news-landing-page-1 fieldset legend', context).addClass('active');
      $('#views-exposed-form-news-landing-page-1 > fieldset .fieldset-wrapper', context).slideDown();
      /*$('#views-exposed-form-news-landing-page-1 fieldset legend', context).on('click', function(e) {
        e.preventDefault();
        $('#views-exposed-form-news-landing-page-1 fieldset', context).removeClass('active');
        $('#views-exposed-form-news-landing-page-1 fieldset .fieldset-wrapper', context).slideUp();
        $('#views-exposed-form-news-landing-page-1 fieldset legend', context).removeClass('active');
        $(this).toggleClass('active');
        $(this).parent().toggleClass('active');
        $(this).next().slideDown();
      });*/
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
          $('#header .menu--main li.menu-item--expanded > a, #header .menu--main li.menu-item--expanded > span', context).on('click', function(e){
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

  // Accordion for the sidebar
  Drupal.behaviors.accordionNavigationSidebar = {
    attach: function (context, settings) {
      $('.region-sidebar li.menu-item--active-trail', context).first().find('a').addClass('active');
      $('.region-sidebar li.menu-item--active-trail', context).first().find('ul').slideDown();
      $('.region-sidebar li.menu-item--expanded > a', context).on('click', function(e){
        e.preventDefault();
        $('.region-sidebar li.menu-item--expanded > a', context).removeClass('active');
        $('.region-sidebar li.menu-item--expanded > ul', context).slideUp();
        $(this).toggleClass('active');
        $(this).parent().find('ul').slideToggle();
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

  var write;      // preapred for interval
  /*
   * Helper animation function for animating text - type it lika a mashine:)
   * @param $el_ DOM element which has to be animated [dom]
   * @param parent_ parent selector [string]
   * @param delay_ timeout delay in ms [int]
   */
  function typeText($el, parent, delay) {
    //console.log($el);
    clearInterval(write);                   // clear interval if not done yet
    var text = $.trim($el.text()), title = '', counter = 0;
    $el.text('');                        // set text to empty

    setTimeout(function() {                 // with optional timeout set interval
        write = setInterval(function() {
          $el.text( title += text[counter]); // add letter to string
          counter++;                            // increase counter 
          if(counter == text.length) {          // stop interval, if all letters've been processed
            clearInterval(write);
            $(parent).addClass('animated');     // add class to parent to let DOM know animation is done
          }
        }, 50);  
      }, delay);
  }

  // Hero slider on home page
  Drupal.behaviors.heroSlider = {
    attach: function (context, settings) {
      $('.paragraph--type--landing-page-slider .field--name-field-slides', context).once('hero-slider').slick({
        infinite: true,
        arrows: false,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        fade: true,
        cssEase: 'linear',
        draggable: false
      }).on("beforeChange", function (event, slick, currentSlide, nextSlide){
        // if slide changed, animate next slide
        if(currentSlide != nextSlide) {
          typeText($($('.slick-slide h1')[nextSlide + 1]), '.slick-active', 500);
          $('.slick-slide').removeClass('animated');
        }
      });


      // remove all prefix labels with 'inspired by' text and replace them with one fixed label
      $('h1 .slide--title-prefix').remove();
      $('.node--type-landing-page .slick-list').append($('<div>', {'class': 'fixed-slider-header container', 'text': 'Inspired by'}));


      // add 'inspired by' fixed label
      //$('.slick-list.draggable').append($('<div class="fixed-slider-header"><div class="container">Inspired by</div></div>'));

      // animate first slide
      typeText($($('.slick-slide h1')[1]), '.slick-active', 500);
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

  // Pillars scrollReveal
  Drupal.behaviors.pillars = {
    attach: function (context, settings) {
      $(window).scroll(function(e) {
        var w_w = $(window).width();
        if (w_w >= 768) {
          $('.paragraph--type--pillar-group-item').each(function() {
            if($(this).isInViewport($(this).height()/2) && !$(this).hasClass('animate')) {
              $(this).addClass('animate');
            } 
          });
        }
      });
    }
  };


  /*
   * Helper function for converting num in string
   * @param num_ number to convert [int]
   * @param length_ length of final number - used with holders (5:00003) - [int] 
   * @param char_ splitter in string [string]
   * @param surfix_ added character [string]
   * @param holder_ placeholder for empty spaces
   *        --> (1200, 5, '.', 'x', 0) => 01.200x
   */
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


  /*
   * Function for wrapping text in spans
   * (helper function for shine effect)
   * @param text_ text to wrap [span]
   * @return dom as string
   */
  function splitTextInSpan(text) {
    var html = "";
    for(var i = 0; i < text.length; i++) {    // wrap each char in span
      html += '<span class="shine-letter">' + text[i] +'</span>';
    }
    return html;
  }

  /*
   * Odometer animation
   * @param field_ element for animate [dom]
   *
   * That function could use some finish touches :) Odometer has to count slowly at the end
   * and couldn't find better sollution than reseting interval...
   * Function'll handle all from element attributes.
   */
  function animateNumber(field) {
    $(field).data('animated', true);
    $(field).css({'transition': $(field).data('count-repeat')*$(field).data('count-interval') + 'ms opacity linear', 'opacity': 1});
    $(field).attr('data-delay', 0);
    // increase counter in every iteration
    // in every iteration add part of number
    // on half way stop interval and start slower one
    // ...
    // when counter comes to end, stop all intervals
    var $shine = $(field).next('.shine').length > 0 ? $($(field).next('.shine')[0]) : null;
    var $shadow = $($(field).parent()).find('.number-shadow ');
    var counter = 0; // count iterations                               
    var animateCounting = setInterval(function() {
      counter ++;
  
      $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
      if($shine) { $shine.html($(field).text()); $shadow.html($(field).text()); }     // apply value on shine

      if(counter == $(field).data('count-repeat')) {
        clearInterval(animateCounting); 
        return;
      }
      if(counter >= $(field).data('count-repeat')/2) { // on half way, slow down
        clearInterval(animateCounting);       

        animateCounting = setInterval(function() {
          counter ++;
          $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
          if($shine) { $shine.html($(field).text()); $shadow.html($(field).text()); }

          if(counter == $(field).data('count-repeat')) {
            clearInterval(animateCounting); 
            return;
          }
          if(counter >= $(field).data('count-repeat')/4*3) {
            clearInterval(animateCounting);

            animateCounting = setInterval(function() {
              counter ++;
              $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
              if($shine) { $shine.html($(field).text()); $shadow.html($(field).text()); }

              if(counter == $(field).data('count-repeat')) {
                clearInterval(animateCounting); 
                return;
              }
              if(counter >= $(field).data('count-repeat')/10*9) {
                clearInterval(animateCounting);

                animateCounting = setInterval(function() {
                  counter ++;
                  $(field).text(convertInString(Math.round($(field).data('number')/$(field).data('count-repeat')*counter), String($(field).data('number')).length, $(field).data('count-char'), $(field).data('count-surfix'), $(field).data('count-holder')));
                  if($shine) { $shine.html(splitTextInSpan($(field).text())); $shadow.html($(field).text()); }

                  if(counter == $(field).data('count-repeat')) {
                    clearInterval(animateCounting); 
                    return;
                  }
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


  // Make odometer from selected fields
  Drupal.behaviors.countingNumbersAnimation = {
    attach: function (context, settings) {
      // collect dom elements in variable ([...el1, ...el2])
      var $numbers = $('.field.field--name-field-number.field--type-string.field--label-hidden.entity_type-paragraph.field__item');
      // mark elements to apply shine effect
      var $shine = $('.paragraph--type--landing-page-counter .field.field--name-field-number.field--type-string.field--label-hidden.entity_type-paragraph.field__item');
      // create dom elements for shine duplicats
      $shine.each(function() {
        $(this).after($('<div/>', {'class': 'number-shadow field--name-field-number'}));
        $(this).after($('<div/>', {'class': 'shine field--name-field-number'}));

      });
      // set all needed attributes
      $numbers.toArray().forEach(function(el, i) {
        if($('html').hasClass('device-mobile') && $(el).text().replace(/\D/g,'') > 10000) {
          $(el).text($(el).text().replace(/\D/g,'')/1000 + 'K');
        }
        var text = $(el).text();
        $(el).attr({
          'data-number': text.replace(/\D/g,''),
          'data-count-char': text.search(',') < 0 ? '' : ',',
          'data-count-repeat': Number(text) > 5000 ? 100 : (Number(text.replace(/\D/g,'')) < 100 ? Number(text.replace(/\D/g,'')) : 50),
          'data-count-interval': Number(text.replace(/\D/g,'')) > 5000 ? 10 : 20,
          'data-count-surfix': text.search('X') < 0 ? (text.search('K') < 0 ? '' : 'K') : 'X',
          'data-count-holder': text.search(',') < 0 ? ' ' : '0'
        });              
        //if($(el).data('number') > 10)
        // set elements text to 0              
        $(el).text(convertInString(0, $(el).text().replace(/\D/g,'').length, $(el).data('count-char'), $(el).data('count-surfix'), $(el).data('count-holder')));   // set text to 0
        // apply same text in shine element
        if($(el).next('.shine')) { $(el).next('.shine').html($(el).text()); $($(el).parent()).find('.number-shadow ').html($(el).text()); } 
        else { $(el).css('opacity', 0.6); }
      });

      // add scroll watcher -- strart animation when user scrolls to position
      $(window).scroll(function(e) {
        $numbers.toArray().forEach(function(el, i) {
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
      var scrolled, deltaY, currentPosition;
      var mobile_device = $('html').hasClass('device-mobile');  // check if device is mobile
      var $paralaxWrapper = $('.paragraph--type--landing-page-stories');
      var parallaxElementsParent = ['.hearts-container', '.paragraph--type--landing-page-stories'];

      /*parallaxElementsParent.forEach(function(parent) {
        $(parent + ' .parallax').each(function() {
          $(this).css({'top': ($(this).offset().top - $(parent).offset().top) + 'px', 'bottom': 'auto'});
        });
      });*/
      


    
    $(window).on("mousewheel", function(event) {
      var st = $(this).scrollTop();
       if (st > lastScrollTop){
         direction = 'down';
       } else {
        direction = 'up';
       }
       lastScrollTop = st;

      if(direction == "up" && $(this).scrollTop() == 0) return;
      
      deltaY = Math.abs(event.originalEvent.deltaY)>=40 ? event.originalEvent.deltaY/40 : event.originalEvent.deltaY;
      $('.parallax').each(function() {
        if($(this).isInViewport(0) && (!mobile_device || mobile_device && $(this).data('mobile-parallax'))) { //-Number($(this).css('top').replace('px', '')))
          currentPosition = Number($(this).css('top').replace('px', ''));   
          $(this).css('top', currentPosition - Number($(this).data('parallax-depth')*deltaY) + 'px');
       }
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
     

     var prevPx = 0;
     $(window).on('scroll', function() {
      
      
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
      function checkInputValue(getThis) {
        var inputValue = getThis.value;
        if (inputValue) {
          $('label[for="' + getThis.id + '"]').addClass('labelfocus');
        } else {
          $('label[for="' + getThis.id + '"]').removeClass('labelfocus');
        }
      }
      var $input_selector = $('form :input', context);
      $input_selector.each(function() {
        checkInputValue(this);
      });
      $input_selector.on('focus keyup', function() {
          $('label[for="' + this.id + '"]').addClass('labelfocus');
      }).blur(function() {
        checkInputValue(this);
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

  // Open Social share window
  Drupal.behaviors.socialShareWindow = {
    attach: function (context, settings) {
      $('.share-window').click(function(e) {
        e.preventDefault();
        window.open($(this).attr('href'), 'fbShareWindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        return false;
      });
    }
  };

  // Story form auto open steps
  Drupal.behaviors.storyFormSteps = {
    attach: function (context, settings) {
      function goToByScroll(id){ id = id.replace("link", ""); $('html,body', context).once().animate({ scrollTop: $("."+id).offset().top},'slow'); }
      $(document).bind('mouseup touchend click keyup', function(e) {

        var step1_progress = false;
        var step2_progress = false;
        var step3_progress = false;
        var step4_progress = false;

        // Step 1
        var step1_field1 = $('input#edit-field-story-first-name-0-value', context);
        var step1_field2 = $('input#edit-field-story-last-name-0-value', context);
        var step1_field3 = $('input[name="field_story_category"]:checked', context);
        
        if (step1_field1.val() && step1_field2.val() && step1_field3.val()) {
          step1_progress = true;
        } else {
          step1_progress = false;
        }
        
        if (step1_progress == true) {
          $('.step2 .step-link', context).addClass('active');
          $('.step2 .step-content', context).slideDown();
          goToByScroll('step2');
        }
        
        // Step 2
        var step2_field1 = $('textarea#edit-body-0-value', context);
        if (step2_field1.val()) {
          step2_progress = true;
        } else {
          step2_progress = false;
        }

        if (step2_progress == true) {
          $('.step3 .step-link', context).addClass('active');
          $('.step3 .step-content', context).slideDown();
          goToByScroll('step3');
        }

        // step 3
        var step3_field1 = $('input[name="files[field_story_featured_image_0]"]', context);
        step3_field1.on('click', function() {
          $('.step4 .step-link', context).addClass('active');
          $('.step4 .step-content', context).slideDown();
          goToByScroll('step4');
        });


        // step 4
        var step4_field1 = $('input#edit-field-submissioner-first-name-0-value', context);
        var step4_field2 = $('input#edit-field-submissioner-last-name-0-value', context);
        var step4_field3 = $('input#edit-field-submissioner-email-0-value', context);
        var step4_field4 = $('input#edit-field-submissioner-phone-number-0-value', context);

        if (step4_field1.val() && step4_field2.val() && step4_field3.val() && step4_field4.val()) {
          step4_progress = true;
        } else {
          step4_progress = false;
        }

        if (step4_progress == true) {
          $('.step5 .step-link', context).addClass('active');
          $('.step5 .step-content', context).slideDown();
          goToByScroll('step5');
        }
        

      });
    }
  };

})(jQuery);

