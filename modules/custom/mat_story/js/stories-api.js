(function ($, Drupal) {

  // global variables
  var $board = $(".animation-wrapper"); // animation wrapper
  var stories = [];                   // list of all stories
  var smallItems = [];  // helper arr
  var initialised = false;
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var config = {
    _num: {
      first_and_last: 5,
      other_pages: 10
    },
    _width: $board.width(),
    _height: $board.height(),
    _el_width: 110,
    _el_height: 110,
    movement: {
      _entry: {speed: 500, delay: 100 },
      _leave: {speed: 500, delay: 100 },
      _smooth: {speed: 4000, radius: 50 }
    },
    background: {
      _big_bubbles: 5,
      _small_bubbles: 10,
      image_bubbles: {
        _images: [
          "/sites/default/files/2018-05/nature2.jpg",
          "/sites/default/files/2018-05/slider1.jpg",
          "/sites/default/files/2018-05/sight-bg-b.png",
          "/sites/default/files/2018-05/kid4.jpg",
          "/sites/default/files/2018-05/girl-slide.jpg"
        ],
        _speed: 4000,
        _size: 60,
        _radius: 30
      }
    }
  };

  var selectedCategory = null;
  var selectedLetter = null;

  function getDevice() {
    if($(window).width() > 991) {
      return "desktop";
    } else if($(window).width() < 415) {
      return "mobile";
    } else {
      return "tablet";
    }
  }

  var device = getDevice();

  function mobile() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
     return true;
    } else {
      return false;
    }
  };
  
  var animations = {
    //done: true,
    animateBubble: function(el)  {
      if(el.movement || device !="desktop") return;

      animations.stopMovement(el);
      el.animate = setInterval(function() {
        var x = randomBetween(el.position.x + config.background.image_bubbles._radius/2, el.position.x - config.background.image_bubbles._radius/2);
        var y = randomBetween(el.position.y + config.background.image_bubbles._radius/2, el.position.y - config.background.image_bubbles._radius/2);

        el.position.x = x;
        el.position.y = y;

        getCss(el);
      }, config.background.image_bubbles._speed);
    },
    makeElMove: function(el) {
      if(el.movement || mobile()) return;

      el.speed = config.movement._smooth.speed;
      el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
      el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));
      getCss(el);
      
      el.animate = setInterval(function() {
        el.speed = config.movement._smooth.speed;
        el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
        el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));
        
        if(el.position.x > el.from) el.position.x = el.from;
        else if(el.position.x < el.to) el.position.x = el.to;

        if(el.position.y < el.up) el.position.y = el.up;
        else if(el.position.y > el.down) el.position.y = el.down;

        getCss(el);
      }, el.speed + 100);

      el.movement = true;
    },
    stopMovement: function(el) {
      clearInterval(el.animate);
      clearTimeout(el.timeout);

      el.movement = false;
    }
  }

  function randomBetween(max, min) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  function findStory(id) {
    for(var i = 0; i < stories.length; i++) {
      if(stories[i].story_id == id) {
        return stories[i];
      }
    }
  }

  function checkConditions(story) {
    if(!selectedCategory && !selectedLetter) return true;
    else if(!selectedCategory && selectedLetter && (
      selectedLetter.toLowerCase() == story.last_name[0].toLowerCase() ||
      selectedLetter.toLowerCase() == story.first_name[0].toLowerCase())) return true;
    else if(!selectedLetter && selectedCategory &&
      story.category_id == selectedCategory) return true;
    else if(selectedLetter && (
      selectedLetter.toLowerCase() == story.last_name[0].toLowerCase() ||
      selectedLetter.toLowerCase() == story.first_name[0].toLowerCase()) &&
      selectedCategory && story.category_id == selectedCategory) return true;
    else return false;
  }

  function getMobileClasses() {
    var displayed = [];
    stories.forEach(function(story) {
      if(story.display) {
        displayed.push(story);
        $(story.target).removeClass('hide');
      } else {
        $(story.target).addClass('hide');
      }
    })

    var pattern = [1, 2, 3, 4, 5, 3, 2, 1, 3, 5, 4, 3], counter = 0;
    displayed.forEach(function(story, i) {
      $(story.target).attr("data-pattern", pattern[counter]);
      counter++;
      if(counter == pattern.length) counter = 0;
    })
  }

  var displayedStories = [];
  var itemsToDisplay = [];
  function getDisplayedStories(category, letter) {
    // array of items which are currently not dislayed
    displayedStories = [];

    // fade all stories out
    stories.forEach(function(story) {
      fadeOut(story);

      if(checkConditions(story)) {
        displayedStories.push(story);
      }
    })

    displayedStories = sortForSlider(displayedStories);

    // fade in stories which are not already visible and displayed
    setTimeout(function() {
      displayedStories.forEach(function(story, i) {
        fadeIn(story);
      })
    }, config.movement._leave.speed)
    

    getMobileClasses();
  }


  function isVisible(el) {
    return (el.position.x > -1 * config._el_width && el.position.x < config._width);
  }
    

  function getRandomTitleLimit(el) {
    if(el.position.y) {
      if(el.position.y < $('.container-small').offset().top - $('.animation-wrapper').offset().top  - config._el_height/2) {
        el.up = 0;
        el.down = $('.container-small').offset().top - $('.animation-wrapper').offset().top  - config._el_height/2;
      } else {
        el.up = $('.container-small').offset().top - $('.animation-wrapper').offset().top + $('.container-small').height();
        el.down = config._height - 190;
      }
      return el;
    }
    

    if(randomBetween(2, 0) == 1) {
      el.up = 0;
      el.down = $('.container-small').offset().top - $('.animation-wrapper').offset().top  - config._el_height/2;
    } else {
      el.up = $('.container-small').offset().top - $('.animation-wrapper').offset().top + $('.container-small').height();
      el.down = config._height - 190;
    }
    return el;
  }

  function sortForSlider(arr, index) {
    var totalPosition = config._width - config._el_width/2;
    var counter = 0;
    var itemsCounter = 0;
    
    arr.forEach(function(item) {
      // less then number for first slider
      if(counter < config._num.first_and_last && arr.length != 2) {
        item.from = totalPosition;

        if(arr.length > config._num.first_and_last) totalPosition -= Math.round(config._width/config._num.first_and_last);
        else totalPosition -= Math.round(config._width/arr.length);
        
        item.to = totalPosition;

        if(item.to < 0) item.to = 0;

        itemsCounter++;
        if(itemsCounter%config._num.first_and_last == 0 || 
           itemsCounter%config._num.first_and_last == 1) {
          
          item.up = 0;
          item.down = config._height - 190;
        } else {
          item = getRandomTitleLimit(item);
        }
      } else if(counter < arr.length - config._num.first_and_last && arr.length != 2) {
        item.from = totalPosition;
        totalPosition -= Math.round(config._width/config._num.other_pages);
        item.to = totalPosition;

        item.up = 0;
        item.down = config._height - 190;
      } else {
        item.from = totalPosition;
        totalPosition -= Math.round(config._width/config._num.first_and_last);
        item.to = totalPosition;

        itemsCounter++;
        if(itemsCounter%config._num.first_and_last == 0 || itemsCounter%config._num.first_and_last == 1 && arr.length != 2) {
          item.up = 0;
          item.down = config._height - 190;
        } else {
          item = getRandomTitleLimit(item);
        }
      }
      
      counter++;
    })
    setSlider(totalPosition);
    return arr;
  }

  function getTransition(speed) {
    return (
      'transform ' + speed + 'ms linear 0ms, ' +
      'opacity ' + speed + 'ms linear 0ms, ' +
      'filter ' + speed + 'ms linear 0ms, ' +
      'z-index 0ms linear, ' + 
      'box-shadow 200ms linear'
    )
  }
  function getCss(el) {
    $(el.target).css({
      '-webkit-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
      '-moz-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
      '-ms-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
      '-o-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
      'transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
      '-webkit-transition': getTransition(el.speed),
      '-moz-transition': getTransition(el.speed),
      '-o-transition': getTransition(el.speed),
      'transition': getTransition(el.speed),
      'opacity': 1,
      'filter': 'blur(' + el.blur + ')',
      '-webkit-filter': 'blur(' + el.blur + ')'
    })
  }
  function fadeOut(el) {
    el.display = false;

    if(getDevice() != 'desktop'){
      return;
    }
    setTimeout(function() {
      clearInterval(el.animate);
      clearTimeout(el.timeout);

      el.movement = false;


      el.scale = '0';
      el.blur = '3.4px';
      el.speed = config.movement._leave.speed;

      getCss(el);
    }, 100);
    

    //return el;
  }

  function moveItems(value) {
    stories.forEach(function(el) {
      el.position.x = el.position.x + (el.scale == 1 ? value :( value/2));
      if(el.from) {
        el.from = el.from + value;
        el.to = el.to + value;
      }

      if(el.movement)
          animations.stopMovement(el);

      el.speed = Math.abs(value) > 100 ? config.movement._smooth.speed : 100;
      getCss(el);
    })

    smallItems.forEach(function(el) {
      el.position.x = el.position.x + value/2;
      
      animations.stopMovement(el);
      if(el.position.x > config._width + 60) {
        el.position.x = -60;
        el.position.y = randomBetween(config._el_height, config._height);
        el.speed = 0;
        getCss(el);

        //el.position.x = randomBetween(0, config._width);
      } else if(el.position.x < -60) {
        el.position.x = config._width + 60;
        el.position.y = randomBetween(config._el_height, config._height);
        el.speed = 0;
        getCss(el);

        //el.position.x = randomBetween(0, config._width);
      }
      else {
        el.speed = Math.abs(value) > 100 ? config.background.image_bubbles._speed : 100;
        getCss(el);
      }
    })
  }
  function fadeIn(el) {
    el.display = true;

    el.speed = 0;
    el.position.x = randomBetween(el.from, el.to);
    el.position.y = randomBetween(el.up, el.down);
    
    getCss(el);

    setTimeout(function() {
      el.scale = '1';
      el.blur = '0';
      el.speed = config.movement._entry.speed;
      getCss(el);
    }, 100);

    setTimeout(function() {
      if(getDevice() == 'desktop' && el.position.x >= config._el_width*(-1) && el.position.x <= config._width * config._el_width)
        animations.makeElMove(el);
    }, 1000)

    return el;
  }

  Drupal.behaviors.mat_stories_api = {
    attach: function (context, settings) {
      config._width = $board.width();
      $.getJSON('/stories-api?_format=json', function(data) {
        // prevent Drupal from reloading script
        if(!initialised) {
          $p = $('.slider-wrapper .container-small p'), 
          $h1 = $('.slider-wrapper .container-small h1'), 
          $button = $('.slider-wrapper .container-small a'); 

          data.forEach(function(item, i) {
            var newItem = {
              first_name: item.first_name,
              last_name: item.last_name,
              category: item.category,
              featured_image: item.featured_image,
              category_id: item.category_id,
              content: item.content,
              image_1: item.image_1,
              image_2: item.image_2,
              image_3: item.image_3,
              field_story_profile_components: item.field_story_profile_components,
              target: '#story' + item.story_id,
              story_id: item.story_id,
              position: {x: 0, y: 0},
              scale: '0',
              blur: '3.4px',
              speed: '0s',
              display: false,
              slide: "undefined"
            };

            stories.push(newItem);
          })

          /* Check, if id in parameter and open story in modal, if is*/
          var check_params = window.location.href.split('#')
          if(check_params.length > 1) {
            openModal(check_params[check_params.length - 1]);
          }
          createDOMStories();
        }
      });
    }
  };

  function appendSlick() {
    $('.filter-wrapper').slick({
      arrows: false,
      infinite: false,
      variableWidth: true
    }).on("afterChange", function (event, slick, currentSlide, nextSlide){
      /*selectedCategory = $('.slick-active').data('category-id');
      getMobileStories();
      $('.selected').text("A-Z");*/
    }).on("beforeChange", function (event, slick, currentSlide, nextSlide){
      // If the user is navigating from the first slide to the right (show the left-side gradient bg).
      if (currentSlide == 0) {
        $('.filter-wrapper.slick-slider').addClass('away-from-left-edge');
      }
      if (nextSlide == 0) {
        $('.filter-wrapper.slick-slider').removeClass('away-from-left-edge');
      }
    });
  }

  function closeLabel(e) {
    var $item = $(e.target).closest('.item');
    var item = findStory($item.data('id'));


    $(e.target).removeClass('hovered');
    $('body').removeClass('story-in-front');
    setTimeout(function() {$(e.target).closest('.label').css('display', 'none'); }, 50);

    if(getDevice() == 'desktop' && item)
      animations.makeElMove(item);
  }

  function showLabel(e) {
    var targetIsItem = $(e.target).hasClass('item');
    var isButton = $(e.target).hasClass('pop-story');
    
    if(isButton && mobile()) {
      openModal($(e.target).data('id'));
    } 

    if(!targetIsItem && mobile()) return;


    var $label = $(e.target).find('.label');
    var $item = $(e.target).closest('.item');

    if(mobile() && $item.hasClass('hovered')) {
      closeLabel(e);
      return;
    }

    $label.css('display', 'block');
    $('.item').removeClass('hovered');

    setTimeout(function() { $item.addClass('hovered');}, 50);

    if(mobile()) return;

    var item = findStory($(e.target).data('id'));
    animations.stopMovement(item);

    $(e.target).css({
      'transform': 'translate(' + $(e.target).offset().left + 'px, ' + ($(e.target).offset().top - $('.slider-wrapper').offset().top) + 'px) scale(1)'
    })

    if(item.position.y > config._height - config._el_height - 130) {
      item.speed = 1500;
      item.position.y = config._height - config._el_height - 130;
      getCss(item);
    }
  }

  function getMobileStories() {
    displayedStories = [];

    stories.forEach(function(story) {
      if(checkConditions(story)) {
        story.display = true;
        displayedStories.push(story);
      } else {
        story.display = false;
      }
    })
    getMobileClasses();
  }

  function createDOMStories () {
    stories.forEach(function(item, j){
      $('<div />', {
        'data-id': item.story_id,                           // set category id attribut
        'data-animated': false,
        'data-category': item.category_id,                  // set category attribut
        'class': 'item pulse-' + randomBetween(2,4) + ' ' + (j%2==0 ? 'left' : 'right'),        // select between two classes available for item
        'id': 'story' + item.story_id                       // item id --> connected with item.target in object
      })
      .mouseenter(function(e) {                                   // __mouse hover event
        showLabel(e);
      })
      .mouseleave(function(e) {                                   // __mouse leave event
        closeLabel(e);
      })
      .click(function(e) {                                        // __click event
        if(mobile()) {
          showLabel(e);
        } else {
          openModal($(e.target).data('id'));
        }
      })
      .css({'backgroundImage': 'url(' + item.featured_image + ')', transition: 'none'})     // set some style
      .append($('<div/>', {                       // add label to elemen
        'class': 'label',
        'html': '<label>'+item.first_name+' '+item.last_name+'</label><small>'+item.category+'</small><button class="pop-story" data-id="'+item.story_id +'"/>'
      }))
      .appendTo($board);    // append element to board
    })

    config._height = $board.height();

    makeAnimatedBackground();
    mobile() ? getMobileStories() : getDisplayedStories();
    
    getFilters();
  }


  function addLettersFilter (arr) {
    var letters = [];
    $('.dropdown .dropdown-inner').html('');

    arr.forEach(function(story) {
      var first = false, last = false;
      letters.forEach(function(letter) {
        if(story.last_name[0].toUpperCase() == letter) {
          last = true;
        }
        if(story.first_name[0].toUpperCase() == letter) {
          first = true;
        }
      })
      if(!last) {letters.push(story.last_name[0].toUpperCase())}
      if(!first) {letters.push(story.first_name[0].toUpperCase())}
    }) 
    letters = letters.sort();

    $(('<div/>'), {
      'text': 'All',
      'class': 'option all',
      'css': {
        'display': 'none'
      }
    }).appendTo('.dropdown .dropdown-inner').click(function(e) {
      $('.selected').text("A — Z");
      $('.option.all').css('display', 'none');
      $('.option').removeClass('active');

      selectedLetter = null;
      mobile() ? getMobileStories() : getDisplayedStories();
    });

    letters.forEach(function(letter) {
      $(('<div/>'), {
        'text': letter,
        'class': 'cat-item',
        'data-letter': letter,
        'class': 'option'
      }).appendTo('.dropdown .dropdown-inner').click(function(e) {
        $('.selected').text($(e.target).data('letter'));
        $('.option.all').css('display', 'flex');

        $('.option').removeClass('active');
        $(e.target).addClass('active');
        selectedLetter = $(e.target).data('letter');
        mobile() ? getMobileStories() : getDisplayedStories();
      })
    })
  }

  function getFilters() {
    var $filters = $('.filter-wrapper');
    var letters = [], categories = [];

    categories.push({category: stories[0].category, category_id: stories[0].category_id});
    letters.push(stories[0].last_name[0].toUpperCase());

    stories.forEach(function(story) {
      var exists = false, initial = false;

      categories.forEach(function(category) {
        if(story.category_id == category.category_id) {
          exists = true;
        }
      })
      letters.forEach(function(letter) {
        if(story.last_name[0].toUpperCase() == letter) {
          initial = true;
        }
      })
      if(!exists) {categories.push({category: story.category, category_id: story.category_id})}
      if(!initial) {letters.push(story.last_name[0].toUpperCase())}
    });

    letters = letters.sort();

    // create "show all" filter
    $(('<div/>'), {
      'text': 'All stories',
      'class': 'active cat-item'
    }).appendTo('.filter-wrapper').click(function(e) {
      $('.cat-item').removeClass('active');
      $(e.target).addClass('active');

      $('.selected').text("A — Z");

      selectedLetter = null;
      selectedCategory = null;
      mobile() ? getMobileStories() : getDisplayedStories();
      addLettersFilter(stories);
    })
    // append all categories to filter wrapper
    categories.forEach(function(category, i) {
      $(('<div/>'), {
        'class': 'cat-item',
        'data-category-id': category.category_id,
        'data-category': category.category,
        'data-index': i,
        'text': category.category
      }).appendTo('.filter-wrapper').click(function(e) {
        $('.cat-item').removeClass('active');
        $(e.target).addClass('active');
        // reset letter filter
        $('.selected').text("A — Z");
        selectedLetter = null;

        var filtered = [];
        stories.forEach(function(item) {
          if(item.category_id == $(e.target).data('category-id')) {
            filtered.push(item);
          }
        })

        if(getDevice() == 'mobile') {
          var slider = $( '.filter-wrapper' );
          slider[0].slick.slickGoTo(parseInt($(e.target).data('slick-index')));

          if($(e.target).data('slick-index') == 0) {
            $('.selected').text("A — Z");
          }
        }

        selectedCategory = $(e.target).data('category-id');
        mobile() ? getMobileStories() : getDisplayedStories();
        addLettersFilter(displayedStories);
      })
    });

    addLettersFilter(stories);

    if(getDevice() == 'mobile') {
      appendSlick();
    }
  }

  function setSlider(width) {

    var prevSliderValue = 0;
    var max = width*(-1);

    $( "#slider" ).slider(
      { max: max,
        disabled: (max <= config._el_width),
        value: 0,
        slide: function( event, ui ) {
          if(isChrome) {
            moveItems(Number(ui.value - prevSliderValue));
            prevSliderValue = ui.value;
          }

          if((ui.value <= 10 || ui.value >= (max - 10)) && $('.slider-wrapper .container-small').hasClass('fade-out')) {
            $('.slider-wrapper .container-small').css('z-index', '3');
            setTimeout(function() {
              $('.slider-wrapper .container-small').removeClass('fade-out');
            }, 50);
          } else if((ui.value > 10 && ui.value < (max - 10)) && !$('.slider-wrapper .container-small').hasClass('fade-out')){
            $('.slider-wrapper .container-small').addClass('fade-out');
            setTimeout(function() {
              $('.slider-wrapper .container-small').css('z-index', '0');
            }, 1000);
          }
       },
       change: function( event, ui ) {
        if(!isChrome) {
          moveItems(Number(ui.value - prevSliderValue));
          prevSliderValue = ui.value;
        }
        if(getDevice() == 'desktop') {
          stories.forEach(function(story) {
            if(story.position.x >= (-config._el_width) && story.position.x <= config._width) {
              animations.makeElMove(story);
            }
          })
        }

        smallItems.forEach(function(el) {
          animations.stopMovement(el);

          el.speed = config.background.image_bubbles._speed;
          animations.animateBubble(el);
        })
       }
      }
    );

    $('#slider span')
    .prepend($('<div/>', {
      'class': "prev"
    }))
    .append($('<div/>', {
      'class': "next"
    }));
  }

  function openModal(id) {
    var $overlay = $('.story-overlay'), selectedStory;
    var $body = $('body');

    $(".modal-inner").animate({ scrollTop: 0 }, "fast");

    selectedStory = findStory(id);

    if(!selectedStory) return;

    $overlay.addClass('open');
    $('html').addClass('modal-open'); // Prevent the body from scrolling while the modal is open.
    setTimeout(function() {
      $overlay.addClass('fade-in');
    }, 50);

    setTimeout(function() {
      $('#modal').addClass('drop');
    }, 350);

    selectedStory.featured_image ? $('#image').attr('src', selectedStory.featured_image) : $('#image').attr('src', '');
    $('#name').text(selectedStory.first_name + ' ' + selectedStory.last_name);
    $('#role').text(selectedStory.category);
    $('#gallery').html(
      (selectedStory.image_1 ? '<img src="' + (selectedStory.image_1) + '">' : '') +
      (selectedStory.image_2 ? '<img src="' + (selectedStory.image_2) + '">' : '') +
      (selectedStory.image_3 ? '<img src="' + (selectedStory.image_3) + '">' : '')
    )
    $('#content').html(selectedStory.content);

    // append Paragraphs: components field
    if (selectedStory.field_story_profile_components) {
      $('#components').append(selectedStory.field_story_profile_components);
    } else {
      $('#components').html('');
    }

    // set link for copy function
    $('#link').attr('href', window.location.href.split('#')[0] + '#' + id);

    // set facebook, twitter share links
    $('#fb').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href.split('/stories')[0] + '/node/' + id);
    $('#tw').attr('href', 'http://www.twitter.com/share?url=' + window.location.href.split('#')[0] + '#' + id);
  }

  $('#link').click(function(e) {
    e.preventDefault();

    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#link').attr('href')).select();
    document.execCommand("copy");
    $temp.remove();

    $('#link-copied').addClass('show');

    setTimeout(function() {
      $('#link-copied').removeClass('show');
    }, 3000);
  });

  function closeModal() {
    var $overlay = $('.story-overlay'), selectedStory;
    var $body = $('body');

    $('html').removeClass('modal-open'); // Re-enable body scrolling.
    $('#modal').removeClass('drop');

    setTimeout(function() {
      $overlay.removeClass('fade-in');
    }, 50);

    setTimeout(function() {
      $overlay.removeClass('open');
    }, 350);
  }

  $('.dropdown-wrapper').click(function() {
    if($('.dropdown').hasClass('open')) {
      $('.dropdown').removeClass('open')
    } else {
      $('.dropdown').addClass('open')
    }
  })

  $('.dropdown').mouseleave(function() { $('.dropdown').removeClass('open') });


  var prevWidth = $(window).width(), resizeTimer;
  // on window resize, update config
  $(window).resize(function()  {
    if(mobile()) return;

    config._width = $board.width();
    config._height = $board.height();

    var resized = $(window).width() - prevWidth;
    moveItems(resized);
    prevWidth = $(window).width();

    clearTimeout(resizeTimer);
    // timeout set so animations don't get fired on each users resize
    resizeTimer = setTimeout(function() {
      getDisplayedStories();
    }, 250);
  });

  $('[data-role="closemodal"]').click(function() {
    closeModal();
  })

  function makeAnimatedBackground(w)  {
    var $body = $('.stories-api');
    if(mobile()) return;

    $('<div/>', {         // create background animation base in html
      class: 'animated-background'
    }).appendTo($body);

    // create bubbles with background image
    config.background.image_bubbles._images.forEach(function(item, i) {
      $('<div/>', {
        class: 'small-item',
        id: 'smallItem' + i
      })
      .css({
        'backgroundImage': 'url(' + item + ')'
      })
      .appendTo('.animated-background');
      smallItems.push(
        {
          target: '#smallItem' + i,
          speed: config.background.image_bubbles._speed,
          scale: 1,
          position: {x: 0, y: 0},
          animated: false,
          opacity: 1
        });
    });

    smallItems.forEach(function(el) {
      el.position.x = randomBetween(config._el_width, config._width - config._el_width);
      el.position.y = randomBetween(config._el_height, config._height);
      getCss(el);
      animations.animateBubble(el);
    })

    while(config.background._small_bubbles > 0 ){
      config.background._small_bubbles--;
      $('<div/>', {
        class: 'star pulse-star-' + randomBetween(1,3)
      }).appendTo('.animated-background').css({
        left: randomBetween(config._width - 30, 30) + 'px',
        top: randomBetween(config._height - 30, 30) + 'px'
      });
    }

    while(config.background._big_bubbles > 0 ){
      var size = randomBetween(60, 30) + "vw";
      config.background._big_bubbles--;
      $('<div/>', {
        class: 'bubble pulse-bubble'
      }).appendTo('.animated-background').css({
        left: randomBetween(config._width - 30, 30) + 'px',
        top: randomBetween(config._height - 30, 30) + 'px',
        width:  size,
        height: size
      });
    }
  };


  $('.container-small').on('mouseenter', function() {
    $('.item').removeClass('hovered');
    $('body').removeClass('story-in-front');
  })

  $('.pop-story').on('click', function(e) {
    openModal($(e.target).data('id'));
  })

  var prev = 0, scrolled = 0, bg_position = 0;
  document.addEventListener('scroll', function(e) {
    if(mobile()) {
      $('.animation-wrapper').css('backgroundPosition', '0 ' + (($(document).scrollTop())/3) + 'px');
    }    
  })
  

})(jQuery, Drupal);
