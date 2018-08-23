
(function ($, Drupal) {

	// global variables
	var $board = $(".animation-wrapper"); // animation wrapper
	var baseUrl = '';
	var JSON;
	var categories = [];                // array of all categories (get them from stories)
	var letters = [];                   // array of stories initials
	var stories = [];                   // list of all stories
  var smallItems = [];  // helper arr
	var initialised = false;
  var containerHeight;
  var $p, $h1, $button;
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
      _entry: {speed: 3000, delay: 100 },
      _leave: {speed: 3000, delay: 100 },
      _smooth: {speed: 4000, radius: 50 }
    },
    background: {
      _big_bubbles: 5,
      _small_bubbles: 10,
      image_bubbles: {
        _images: [
          baseUrl + "/sites/default/files/2018-05/nature2.jpg",
          baseUrl + "/sites/default/files/2018-05/slider1.jpg",
          baseUrl + "/sites/default/files/2018-05/sight-bg-b.png",
          baseUrl + "/sites/default/files/2018-05/kid4.jpg",
          baseUrl + "/sites/default/files/2018-05/girl-slide.jpg"
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

  function checkMobile() {
    /*var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;*/
    if($(window).width() < 415) {
      return true;
    } else
      return false;
  };
  var mobile = checkMobile();
  var animations = {
    //done: true,
    animateBubble: function(el)  {
      if(el.movement) return;

      animations.stopMovement(el);
      el.animate = setInterval(function() {
        var x = randomBetween(el.position.x + config.background.image_bubbles._radius/2, el.position.x - config.background.image_bubbles._radius/2);
        var y = randomBetween(el.position.y + config.background.image_bubbles._radius/2, el.position.y - config.background.image_bubbles._radius/2);

        /*if(x > el.to) x = el.position.to;
        else if(x <= el.from) x = el.position.from;*/
        el.position.x = x;
        el.position.y = y;

        getCss(el);
      }, config.background.image_bubbles._speed);
    },
    makeElMove: function(el) {
      if(el.movement) return;

      el.speed = config.movement._smooth.speed;
      el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
      el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));
      getCss(el);
      
      el.animate = setInterval(function() {
        el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
        el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));
        
        if(el.position.x < config._el_width) el.position.x = config._el_width;
        else if(el.position.x >= config._width) el.position.x = config._width;

        if(el.position.y < 0) el.position.y = 0;
        if(el.position.y > config._height - 190) el.position.y = config._height - 190;

        getCss(el);
      }, el.speed);

      el.movement = true;
    },
    stopMovement: function(el) {
      clearInterval(el.animate);
      clearTimeout(el.timeout);

      getCss(el);
      el.movement = false;
    }
  }


  var sliderSections = {
    sections: [],
    add: function(from, to) {
      sliderSections.sections.push({from: from*$board.width()/100, to: to*$board.width()/100})
    },
    check: function(value) {
      for(var i = 0; i < sliderSections.sections.length; i++) {
        if(sliderSections.sections[i].from > value && sliderSections.sections[i].to <= value) {
          return sliderSections.sections[i];
        }
      }
    },
    getSliderWidth() {
      return sliderSections.sections[0].from - sliderSections.sections[sliderSections.sections.length - 1].from;
    }
  };

  function randomBetween(max, min) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  function isOverlapingX(value, slide) {
    if((value + slide*$board.width()) > $('.container-small').offset().left &&
       (value + slide*$board.width()) < $('.container-small').offset().left + $('.container-small').width()){
      return true;
    }
  else
    return false;
  }

  function isOverlapingY(value) {
    if(value > $('.container-small').offset().top - $('.animation-wrapper').offset().top  - config._el_height/2 &&
       value < $('.container-small').offset().top - $('.animation-wrapper').offset().top + $('.container-small').height()) {
      return true;
    }
    else
      return false;
  }

  function findStory(id) {
    for(var i = 0; i < stories.length; i++) {
      if(stories[i].story_id == id) {
        return stories[i];
      }
    }
  }


  function checkFilters() {
    var cat = [];
    var lett = [];
    stories.forEach(function(story) {
      if(story.display) {

      }
    })
  }
  function getStoriesReady() {
    var fadeElementsOut = [];
    var fadeElementsIn = [];
    var elementsToMove = [];


    stories.forEach(function(story) {
      // category is selected, letter not
      if(!selectedLetter &&
          selectedCategory &&
          story.category_id != selectedCategory) {

        if(story.display) fadeElementsOut.push(story);
        story.display = false;

      // letter is selected, category not
      } else if(!selectedCategory &&
          selectedLetter &&
          selectedLetter.toLowerCase() != story.last_name[0].toLowerCase() &&
          selectedLetter.toLowerCase() != story.first_name[0].toLowerCase()) {

        if(story.display) fadeElementsOut.push(story);
        story.display = false;

        // category and letter is selected
      } else if(selectedCategory &&
          selectedLetter &&
          ( story.category_id != selectedCategory ||
           selectedLetter.toLowerCase() != story.last_name[0].toLowerCase() &&
           selectedLetter.toLowerCase() != story.first_name[0].toLowerCase())) {

        if(story.display) fadeElementsOut.push(story);
        story.display = false;

      } else {
        if(!story.display) fadeElementsIn.push(story);
        else if(story.prevSlide != story.slide) elementsToMove.push(story);

        story.display = true;
      }
    })

    checkFilters()

    if(getDevice() == 'desktop') {
      stories = sortForSlider(stories);

      fadeElementsOut.forEach(function(story, i) {
        setTimeout(function() {
          story = fadeOut(story);
        }, config.movement._leave.delay*i)
      })

      fadeElementsIn.forEach(function(story, i) {
        setTimeout(function() {
          story = fadeIn(story);
        }, config.movement._entry.delay*i)
      })

      elementsToMove.forEach(function(story, i) {
        setTimeout(function() {
          move(story);
        }, config.movement._entry.delay*i)
      })

    } else {
      var classCounter = 0;

      stories.forEach(function(item) {
        animations.stopMovement(item);

        if(item.display) {
          if(classCounter % 2 != 0) {
            $(item.target).removeClass('left');
            $(item.target).addClass('right');
          } else {
            $(item.target).addClass('left');
            $(item.target).removeClass('right');
          }
          $(item.target).css({
            'display': '-ms-flexbox',
            'display': 'flex'
          });

          classCounter++;
        } else {
          $(item.target).css('display', 'none');
        }
      })
    }
  }

  function sortForSlider(arr) {
    var counter = 0;    // counter of elements which are already set
    var slide = 0;      // current slider
    var totalDisplayed = 0;  // total number of displayed items
    var displayedInMiddleSlide = 0;
    var from = 0;
    var totalPosition = config._width - config._el_width;
    sliderSections.sections = [];

    arr.forEach(function(item) {
      if(item.display) totalDisplayed++;
    })

    arr.forEach(function(item, index) {
      if(item.display) {



        // set item range and limit
        if(counter < config._num.first_and_last) {
          item.from = totalPosition;
          totalPosition -= Math.round(config._width/config._num.first_and_last);
          item.to = totalPosition;

        } else if(counter < totalDisplayed - config._num.first_and_last) {
          item.from = totalPosition;
          totalPosition -= Math.round(config._width/config._num.other_pages);
          item.to = totalPosition;

        } else {
          item.from = totalPosition;
          totalPosition -= Math.round(config._width/config._num.first_and_last);
          item.to = totalPosition;

          if(index == arr.length-1) {
            item.to -= config._el_width;
          }
        }

        if(item.slide == slide) item.slideChanged = false;
        else item.slideChanged = true;
        item.prevSlide = item.slide;
        item.slide = slide;

        if(counter < config._num.first_and_last) {
          if(counter == config._num.first_and_last - 1) {
            slide++;                      // move to next slide
            sliderSections.add(100, 0);   // add slide to slider
          }
        } else if(counter < totalDisplayed - config._num.first_and_last) {  // if item is between first and last
          displayedInMiddleSlide++;       // count middle items

          if(displayedInMiddleSlide == config._num.other_pages) {
            displayedInMiddleSlide = 0;   // reset counter
            sliderSections.add(from, from - 100);  // add slide to slider
            from = from - 100;
            slide++;                               // move to next slide
          } else if(counter == totalDisplayed - config._num.first_and_last - 1) {
            sliderSections.add(from, from - displayedInMiddleSlide*100/config._num.first_and_last);   // add slide to slider
            from = from - displayedInMiddleSlide*100/config._num.first_and_last;
            slide++;

            sliderSections.add(from, from - 100);         // add last slide
          }
        }
        counter++;
      }
    })
    if(totalDisplayed < config._num.first_and_last) {
      sliderSections.add(100, 0);
    }
    else if(totalDisplayed > config._num.first_and_last && totalDisplayed < config._num.first_and_last*2) {   // if not enough elements
      sliderSections.add(from, from - 100);
    }


    setSlider(totalPosition);
    console.log("ITEMS", arr)
    console.log("sliderSections", sliderSections)

    return arr;
  }




  function getXPosition(el, from, to, checkOverlap) {
    var x = randomBetween(from, to);

    if(checkOverlap && isOverlapingX(x, el.slide) && isOverlapingY(el.position.y)) {
      var counter = 0;
      while(x < 40 && (x == 0 || isOverlapingX(x))) {
        x = randomBetween(from, to);
        counter++;
      }
    }
    return x;
  }

  function getYPosition(el, from, to, checkOverlap) {
    var y = randomBetween(from, to);

    if(checkOverlap && isOverlapingY(y) && isOverlapingX(el.position.x, el.slide)) {
        var counter = 0;
        while(counter < 40 && (y == 0 || isOverlapingY(y))) {
        y = randomBetween(config._height - config._el_width,  config._el_width);
        counter++;
      }
    }
    return y;
  }

  function getTransition(speed) {
    return (
      'transform ' + speed + 'ms linear 0ms, ' +
      'opacity ' + speed + 'ms linear 0ms, ' +
      'filter ' + speed + 'ms linear 0ms, ' +
      'z-index 0ms linear'
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
    el.scale = '0';
    el.blur = '3.4px';
    el.speed = config.movement._leave.speed;

    animations.stopMovement(el);
    getCss(el);

    return el;
  }

  function fadeIn(el) {
    el = getStartingPosition(el);

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

  function move(el) {
    el = fadeOut(el);
    el = fadeIn(el);
  }

  function getStartingPosition(el) {
    el.speed = 0;
    el.position.x =  getXPosition(el, el.from, el.to, el.slide == 0 || el.slide == sliderSections.sections.length - 1);
    el.position.y =  getYPosition(el, 0, config._height - 190, el.slide == 0 || el.slide == sliderSections.sections.length - 1);
    getCss(el);

    return el;
  }

  Drupal.behaviors.mat_stories_api = {
    attach: function (context, settings) {
      config._width = $board.width();
      $.getJSON('/stories-api?_format=json', function(data) {
        // prevent Drupal from reloading script
        if(!initialised) {
          $p = $('.slider-wrapper .container-small p'), $h1 = $('.slider-wrapper .container-small h1'), $button = $('.slider-wrapper .container-small a');
          data = [{"story_id":"146","first_name":"Magda","last_name":"Graham Larson","field_submissioner_email":"","category":"Living donor","category_id":"3","featured_image":"\/sites\/default\/files\/2018-07\/kate.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. In massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003ERich text coming from component field!\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n"},{"story_id":"392","first_name":"Stiven","last_name":"Rayden","field_submissioner_email":"","category":"Living donor","category_id":"3","featured_image":"\/sites\/default\/files\/2018-06\/stiven.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003Erich text\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n,   \u003Cdiv class=\u0022paragraph paragraph--type--basic-page-quote\u0022\u003E\n            \n        \u003Cblockquote\u003Equote\u003C\/blockquote\u003E\n                \u003Cdiv class=\u0022quote--footer\u0022\u003E\n          \u003Cdiv class=\u0022quote--author\u0022\u003E\n                          name,\n                      \u003C\/div\u003E\n          \u003Cdiv class=\u0022quote--author-about\u0022\u003Eabout\u003C\/div\u003E\n        \u003C\/div\u003E\n              \u003C\/div\u003E\n"},{"story_id":"39","first_name":"Stiven","last_name":"Rayden","field_submissioner_email":"","category":"Living donor","category_id":"3","featured_image":"\/sites\/default\/files\/2018-06\/stiven.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003Erich text\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n,   \u003Cdiv class=\u0022paragraph paragraph--type--basic-page-quote\u0022\u003E\n            \n        \u003Cblockquote\u003Equote\u003C\/blockquote\u003E\n                \u003Cdiv class=\u0022quote--footer\u0022\u003E\n          \u003Cdiv class=\u0022quote--author\u0022\u003E\n                          name,\n                      \u003C\/div\u003E\n          \u003Cdiv class=\u0022quote--author-about\u0022\u003Eabout\u003C\/div\u003E\n        \u003C\/div\u003E\n              \u003C\/div\u003E\n"},{"story_id":"38","first_name":"Ana","last_name":"Holton","field_submissioner_email":"","category":"Recipients","category_id":"5","featured_image":"\/sites\/default\/files\/2018-06\/ana.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"37","first_name":"Kate","last_name":"Graham","field_submissioner_email":"","category":"Liver recipient","category_id":"2","featured_image":"\/sites\/default\/files\/2018-06\/kate.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"36","first_name":"Jim","last_name":"Barlow","field_submissioner_email":"","category":"Recipients","category_id":"5","featured_image":"\/sites\/default\/files\/2018-06\/jim.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"35","first_name":"Miriam","last_name":"Alby","field_submissioner_email":"","category":"Patients Waiting","category_id":"4","featured_image":"\/sites\/default\/files\/2018-06\/miriam.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"34","first_name":"Robert","last_name":"Smith","field_submissioner_email":"","category":"Donors","category_id":"1","featured_image":"\/sites\/default\/files\/2018-06\/smith.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"16","first_name":"First","last_name":"Last","field_submissioner_email":"","category":"Patients Waiting","category_id":"4","featured_image":"\/sites\/default\/files\/2018-05\/nature2.jpg","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003Esearch test\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"7","first_name":"Jamall","last_name":"Augustine","field_submissioner_email":"","category":"Donors","category_id":"1","featured_image":"\/sites\/default\/files\/2018-06\/jamall-a.png","image_1":"\/sites\/default\/files\/2018-06\/jamall-a-img1.png","image_2":"","image_3":"","content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"6","first_name":"Kristina","last_name":"Michelle Dennis","field_submissioner_email":"","category":"Liver recipient","category_id":"2","featured_image":"\/sites\/default\/files\/2018-06\/kristin.png","image_1":"\/sites\/default\/files\/2018-06\/kristin-img1.png","image_2":"\/sites\/default\/files\/2018-06\/kristin-img2.png","image_3":"\/sites\/default\/files\/2018-06\/kristin_0.png","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis.\u0026amp;nbsp;\u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003ESome rich text coming from component!\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n"},
          {"story_id":"12346","first_name":"Magda","last_name":"Graham Larson","field_submissioner_email":"","category":"Living donor","category_id":"3","featured_image":"\/sites\/default\/files\/2018-07\/kate.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. In massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003ERich text coming from component field!\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n"},{"story_id":"123392","first_name":"Stiven","last_name":"Rayden","field_submissioner_email":"","category":"Living donor","category_id":"3","featured_image":"\/sites\/default\/files\/2018-06\/stiven.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003Erich text\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n,   \u003Cdiv class=\u0022paragraph paragraph--type--basic-page-quote\u0022\u003E\n            \n        \u003Cblockquote\u003Equote\u003C\/blockquote\u003E\n                \u003Cdiv class=\u0022quote--footer\u0022\u003E\n          \u003Cdiv class=\u0022quote--author\u0022\u003E\n                          name,\n                      \u003C\/div\u003E\n          \u003Cdiv class=\u0022quote--author-about\u0022\u003Eabout\u003C\/div\u003E\n        \u003C\/div\u003E\n              \u003C\/div\u003E\n"},{"story_id":"12339","first_name":"Stiven","last_name":"Rayden","field_submissioner_email":"","category":"Living donor","category_id":"3","featured_image":"\/sites\/default\/files\/2018-06\/stiven.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003Erich text\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n,   \u003Cdiv class=\u0022paragraph paragraph--type--basic-page-quote\u0022\u003E\n            \n        \u003Cblockquote\u003Equote\u003C\/blockquote\u003E\n                \u003Cdiv class=\u0022quote--footer\u0022\u003E\n          \u003Cdiv class=\u0022quote--author\u0022\u003E\n                          name,\n                      \u003C\/div\u003E\n          \u003Cdiv class=\u0022quote--author-about\u0022\u003Eabout\u003C\/div\u003E\n        \u003C\/div\u003E\n              \u003C\/div\u003E\n"},{"story_id":"12338","first_name":"Ana","last_name":"Holton","field_submissioner_email":"","category":"Recipients","category_id":"5","featured_image":"\/sites\/default\/files\/2018-06\/ana.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"12337","first_name":"Kate","last_name":"Graham","field_submissioner_email":"","category":"Liver recipient","category_id":"2","featured_image":"\/sites\/default\/files\/2018-06\/kate.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"12336","first_name":"Jim","last_name":"Barlow","field_submissioner_email":"","category":"Recipients","category_id":"5","featured_image":"\/sites\/default\/files\/2018-06\/jim.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"12335","first_name":"Miriam","last_name":"Alby","field_submissioner_email":"","category":"Patients Waiting","category_id":"4","featured_image":"\/sites\/default\/files\/2018-06\/miriam.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"12334","first_name":"Robert","last_name":"Smith","field_submissioner_email":"","category":"Donors","category_id":"1","featured_image":"\/sites\/default\/files\/2018-06\/smith.png","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis. \u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"12316","first_name":"First","last_name":"Last","field_submissioner_email":"","category":"Patients Waiting","category_id":"4","featured_image":"\/sites\/default\/files\/2018-05\/nature2.jpg","image_1":"","image_2":"","image_3":"","content":"\u003Cp\u003Esearch test\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"1237","first_name":"Jamall","last_name":"Augustine","field_submissioner_email":"","category":"Donors","category_id":"1","featured_image":"\/sites\/default\/files\/2018-06\/jamall-a.png","image_1":"\/sites\/default\/files\/2018-06\/jamall-a-img1.png","image_2":"","image_3":"","content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E\n","field_story_profile_components":""},{"story_id":"1236","first_name":"Kristina","last_name":"Michelle Dennis","field_submissioner_email":"","category":"Liver recipient","category_id":"2","featured_image":"\/sites\/default\/files\/2018-06\/kristin.png","image_1":"\/sites\/default\/files\/2018-06\/kristin-img1.png","image_2":"\/sites\/default\/files\/2018-06\/kristin-img2.png","image_3":"\/sites\/default\/files\/2018-06\/kristin_0.png","content":"\u003Cp\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium tincidunt urna sed rutrum. Quisque vestibulum nec lectus ut varius. Sed nec tempor nulla. Maecenas viverra rhoncus neque non sagittis.\u0026amp;nbsp;\u003C\/p\u003E\n\u003Cp\u003EIn massa ligula, mollis eu hendrerit consectetur, ornare ut sapien. Aenean luctus massa sed enim maximus elementum. Aenean tortor eros, sollicitudin vitae nibh quis, rutrum fringilla purus. Quisque id accumsan dui, quis semper ligula. Sed rutrum nisi tincidunt augue ornare varius.\u003C\/p\u003E\n","field_story_profile_components":"\n\n\n  \u003Cdiv class=\u0022paragraph paragraph--type--landing-page-rich-text\u0022\u003E\n    \u003Cdiv class=\u0022inner\u0022\u003E\n              \n            \u003Cdiv class=\u0022field field--name-field-text field--type-text-long field--label-hidden entity_type-paragraph field__item\u0022\u003E\u003Cp\u003ESome rich text coming from component!\u003C\/p\u003E\u003C\/div\u003E\n      \n          \u003C\/div\u003E\n  \u003C\/div\u003E\n"}];
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
        $(e.target).find('.label').css('display', 'block');
        $('.item').removeClass('hovered');

        setTimeout(function() { $(e.target).addClass('hovered');}, 50);
        if(mobile) return;

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


      })
      .mouseleave(function(e) {                                   // __mouse leave event
        $(e.target).removeClass('hovered');
        $('body').removeClass('story-in-front');
        setTimeout(function() {$(e.target).closest('.label').css('display', 'none'); }, 50);

        if(mobile) return;

        var $item = $(e.target).closest('.item');
        var item = findStory($item.data('id'));

        if(getDevice() == 'desktop' && item)
          animations.makeElMove(item);
      })
      .click(function(e) {                                        // __click event
        openModal($(e.target).data('id'));
      })
      .css({'backgroundImage': 'url(' + baseUrl + item.featured_image + ')', transition: 'none'})     // set some style
      .append($('<div/>', {                       // add label to elemen
        'class': 'label',
        'html': '<label>'+item.first_name+' '+item.last_name+'</label><small>'+item.category+'</small><button class="pop-story" data-id="'+item.story_id +'"/>'
      }))
      .appendTo($board);    // append element to board
    })

    config._height = $board.height();

    makeAnimatedBackground();
    getStoriesReady(null, null, true);
    getFilters();
  }

  function getFilters() {
    var $filters = $('.filter-wrapper');

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

      $('.selected').text("A-Z");

      selectedLetter = null;
      selectedCategory = null;
      getStoriesReady();
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

        var filtered = [];
        stories.forEach(function(item) {
          if(item.category_id == $(e.target).data('category-id')) {
            filtered.push(item);
          }
        })

        if(mobile) {
          var slider = $( '.filter-wrapper' );
          slider[0].slick.slickGoTo(parseInt($(e.target).data('slick-index')));

          if($(e.target).data('slick-index') == 0) {
            $('.selected').text("A-Z");
          }
        }

        selectedCategory = $(e.target).data('category-id');
        getStoriesReady();
      })
    });

    letters.forEach(function(letter) {
      $(('<div/>'), {
        'text': letter,
        'class': 'cat-item',
        'data-letter': letter,
        'class': 'option'
      }).appendTo('.dropdown .dropdown-inner').click(function(e) {
        $('.selected').text($(e.target).data('letter'));

        selectedLetter = $(e.target).data('letter');
        getStoriesReady();
      })
    })

    if(mobile) {
      $('.filter-wrapper').slick({
          arrows: false,
          infinite: false,
          variableWidth: true,
          centerMode: false
      }).on("afterChange", function (event, slick, currentSlide, nextSlide){

        $('.selected').text("A-Z");
        selectedCategory = $('.slick-active').data('category-id');
        getStoriesReady();
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
  }

  function moveItems(value) {
    stories.forEach(function(el) {
      el.position.x = el.position.x + (el.scale == 1 ? value :( value/2));
      el.speed = Math.abs(value) > 100 ? Math.abs(value) + 100 : 100;
      if(el.movement)
          animations.stopMovement(el);
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
      } else if(el.position.x < -60) {
        el.position.x = config._width + 60;
        el.position.y = randomBetween(config._el_height, config._height);
        el.speed = 0;
        getCss(el);
      }
      else {
        el.speed = Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 ;
        getCss(el);
      }
    })
  }

  function setSlider(width) {

    var prevSliderValue = 0;
    var max = width*(-1);

    $( "#slider" ).slider(
      { max: max,
        disabled: (max <= 0),
        value: 0,
        slide: function( event, ui ) {
          moveItems(Number(ui.value - prevSliderValue));
          prevSliderValue = ui.value;

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
    stories.forEach(function(story) {
      if(story.story_id == id) {
        selectedStory = story;
      }
    })

    if(!selectedStory) return;

    $overlay.addClass('open');
    $body.addClass('modal-open'); // Prevent the body from scrolling while the modal is open.
    setTimeout(function() {
      $overlay.addClass('fade-in');
    }, 50);

    setTimeout(function() {
      $('#modal').addClass('drop');
    }, 350);

    selectedStory.featured_image ? $('#image').attr('src', baseUrl + selectedStory.featured_image) : $('#image').attr('src', '');
    $('#name').text(selectedStory.first_name + ' ' + selectedStory.last_name);
    $('#role').text(selectedStory.category);
    $('#gallery').html(
      (selectedStory.image_1 ? '<img src="' + (baseUrl + selectedStory.image_1) + '">' : '') +
      (selectedStory.image_2 ? '<img src="' + (baseUrl + selectedStory.image_2) + '">' : '') +
      (selectedStory.image_3 ? '<img src="' + (baseUrl + selectedStory.image_3) + '">' : '')
    )
    $('#content').html(selectedStory.content);

    // append Paragraphs: components field
    if (selectedStory.field_story_profile_components) {
      $('#content').append(selectedStory.field_story_profile_components);
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

    $body.removeClass('modal-open'); // Re-enable body scrolling.
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


  var prevWidth = $(window).width();
  // on window resize, update config
  $(window).resize(function()  {

    if(getDevice() == 'desktop') {
      var resized = $(window).width() - prevWidth;
      moveItems(resized);
      prevWidth = $(window).width();
    }


    var width = 0;

    $('.cat-item').toArray().forEach(function(item) {
      width += $(item).outerWidth();
    })

    if(width > $('.filter-wrapper').width() && $('.filter-wrapper.slick-slider').length == 0) {
      $('.filter-wrapper').slick({
        arrows: false,
        infinite: false,
        variableWidth: true
      }).on("afterChange", function (event, slick, currentSlide, nextSlide){
        selectedCategory = $('.slick-active').data('category-id');
        getStoriesReady();
        $('.selected').text("A-Z");
      }).on("beforeChange", function (event, slick, currentSlide, nextSlide){
        // If the user is navigating from the first slide to the right (show the left-side gradient bg).
        if (currentSlide == 0) {
          $('.filter-wrapper.slick-slider').addClass('away-from-left-edge');
        }
        if (nextSlide == 0) {
          $('.filter-wrapper.slick-slider').removeClass('away-from-left-edge');
        }
      });
    } else if(width < $('.filter-wrapper').width() && $('.filter-wrapper.slick-slider').length > 0) { 
        $('.filter-wrapper').slick('unslick'); 
    }

    if(device != getDevice()) {
      device = getDevice();
      
      getStoriesReady();
      
      if(device != 'desktop') {
        $('.container-small').css('z-index', 5);
        $('.container-small').removeClass('fade-out');
      }
    }
    config._width = $board.width();
    config._height = $board.height();
  });

  $('[data-role="closemodal"]').click(function() {
    closeModal();
  })

  function makeAnimatedBackground(w)  {
    var $body = $('.stories-api');

    $('<div/>', {         // create background animation base in html
      class: 'animated-background'
    }).appendTo($body);

    containerHeight = $('.animated-background').height();
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
      el.position.x = getXPosition(el, config._el_width, config._width - config._el_width);
      el.position.y = getYPosition(el, config._el_height, config._height);
      getCss(el);
      animations.animateBubble(el);
    })

    while(config.background._small_bubbles > 0 ){
      config.background._small_bubbles--;
      $('<div/>', {
        class: 'star pulse-star-' + randomBetween(1,3)
      }).appendTo('.animated-background').css({
        left: randomBetween(config._width - 30, 30) + 'px',
        top: randomBetween(containerHeight - 30, 30) + 'px'
      });
    }

    while(config.background._big_bubbles > 0 ){
      var size = randomBetween(60, 30) + "vw";
      config.background._big_bubbles--;
      $('<div/>', {
        class: 'bubble pulse-bubble'
      }).appendTo('.animated-background').css({
        left: randomBetween(config._width - 30, 30) + 'px',
        top: randomBetween(containerHeight - 30, 30) + 'px',
        width:  size,
        height: size
      });
    }
  };


  $('.container-small').on('mouseenter', function() {
    $('.item').removeClass('hovered');
    $('body').removeClass('story-in-front');
  })


})(jQuery, Drupal);
