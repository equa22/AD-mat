(function ($, Drupal) {

	// Script for animating elements

	// global variables
	var $board = $(".animation-wrapper"); // animation wrapper
	var $el = [];                       // matrix with elements
	var active_index = 0;
	var $active_group;
	var animation_interval;             // prepared for interval function
	var baseUrl = '';
	var sentItemsToBoard;               // prepared for timeout function for items to entry
	var JSON;
	var categories = [];                // array of all categories (get them from stories)
	var letters = [];                   // array of stories initials
	var stories = [];                   // list of all stories
	var initialised = false;
	var config = {
	  _num: 3,                      // number of elements displayed in wrapper
	  overlap: true,
	  interval: 10000,
	  radius: 50,                  // [%] - (depends on board width and height)
	  _width: $board.width(),
	  _height: $board.height(),
	  _el_width: 110,
	  _el_height: 110,
	  movement: {
	    _entry: {speed: 3000, delay: 500, type: "linear"},
	    _leave: {speed: 3000, delay: 200, type: "linear"},
	    _fast: {speed: 1200, type: "linear", css: function() { return this.speed + "ms transform " + this.type}},
	    _smooth: {max: 80000, min: 80000, type: "cubic-bezier(0.36, 0.32, 0.75, 0.72)",
	            css: function() { return (Math.floor(Math.random() * this.max) + this.min) + 'ms all ' + this.type}}
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
	      _speed: 30000,
	      _interval: 13000,
	      _size: 60
	    }
	  }
	};

  function checkMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  var mobile = checkMobile();
  console.log(mobile);

  Drupal.behaviors.mat_stories_api = {
    attach: function (context, settings) {

      $.getJSON('/stories-api?_format=json', function(data) {
      	// prevent Drupal from reloading script
      	if(!initialised) {
      		initialised = true;
	      	config.limit = {x: config._width/100*config.radius, y: config._height/100*config.radius};

	        JSON = [{
            "story_id":"96",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/sight-bg-b.png",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"86",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          },...data];

	        createStories();
	        getFilters();
	        makeAnimatedBackground();


	        /* Check, if id in parameter and open story in modal, if is*/
					var check_params = window.location.href.split('#')
					if(check_params.length > 1) {
					  openModal(check_params[check_params.length - 1]);
					}
      	}
      });
    }
  };






var animations = {
  done: true,
  fade_in: (el, delay) => {
    $displayedStories[active_index].forEach((el, i) => {
      // set new coordinates for element
      getCoordinates(el);

      $(el.target).css({
        'opacity': 0.3,
        '-webkit-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)',
        '-moz-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)',
        '-ms-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)',
        '-o-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)',
        'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)'
      });

      setTimeout(() => {
        $(el.target).css({
          'opacity': 1,
          '-webkit-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
          '-moz-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
          '-ms-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
          '-o-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
          'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
          '-webkit-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
          '-moz-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
          '-ms-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
          '-o-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
          'transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms'
        });
      }, (i+1)* config.movement._entry.delay )

      // start animation
      setTimeout(() => {
        animations.start(el);
      }, (i+1)*config.movement._entry.delay + config.movement._entry.speed);
    })
  },
  fade_out: (el, delay) => {
    $displayedStories[active_index].forEach((el, i) => {
      animations.stop(el);

      $(el.target).css({
        'opacity': 1,
        //'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
        '-webkit-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
        '-moz-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
        '-ms-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
        '-o-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
        'transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms'
      })

      setTimeout(() => {
        $(el.target).css({
          'opacity': 0,
          '-webkit-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)',
          '-moz-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)',
          '-ms-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)',
          'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)'
        });
      }, i*config.movement._leave.delay);
    })
  },
  stop: (el) => {
    $(el.target).data('animated', false);

    clearInterval(el.animate);
    clearTimeout(el.timeout);

    el.position = {x: $(el.target).offset().left, y: ($(el.target).offset().top - $board.offset().top)};

    $(el.target).css({
      '-webkit-transform': "translate(" + $(el.target).offset().left + "px, " + ($(el.target).offset().top - $board.offset().top) + "px) scale(1)",
      '-moz-transform': "translate(" + $(el.target).offset().left + "px, " + ($(el.target).offset().top - $board.offset().top) + "px) scale(1)",
      '-ms-transform': "translate(" + $(el.target).offset().left + "px, " + ($(el.target).offset().top - $board.offset().top) + "px) scale(1)",
      '-o-transform': "translate(" + $(el.target).offset().left + "px, " + ($(el.target).offset().top - $board.offset().top) + "px) scale(1)",
      'transform': "translate(" + $(el.target).offset().left + "px, " + ($(el.target).offset().top - $board.offset().top) + "px) scale(1)"
    });
  },
  start: (el) => {
    $(el.target).data('animated', true);


    // set smooth movement
    $(el.target).css({
      '-webkit-transition': el.speed + 's transform ' + config.movement._smooth.type,
      '-moz-transition': el.speed + 's transform ' + config.movement._smooth.type,
      '-ms-transition': el.speed + 's transform ' + config.movement._smooth.type,
      '-o-transition': el.speed + 's transform ' + config.movement._smooth.type,
      'transition': el.speed + 's transform ' + config.movement._smooth.type
    });	//config.movement._smooth.css()

    getCoordinates(el);
    el.animate = setInterval(() => {
      // get new coordinates for element
      getCoordinates(el);
    }, (el.speed)*1000);
  },
  goTo: function(index) {
    var timer = 0;
    this.done = false;
    clearTimeout(sentItemsToBoard);


    $displayedStories.forEach((group, i) => {
      group.forEach((el, delay) => {
        animations.stop(el);        // stop animation - clear interval
        clearTimeout(el.timeout);   // clear timeout - prevent from animating

        // send all previous items to the left
        if(i < index) {
          timer += (delay*50);
          $(el.target).css({
            '-webkit-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-moz-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-ms-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-o-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            'transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-webkit-transform': "translate(-" + (config._el_width + 40) + "px, " + randomBetween(config._height, 0) + "px)",
            '-moz-transform': "translate(-" + (config._el_width + 40) + "px, " + randomBetween(config._height, 0) + "px)",
            '-ms-transform': "translate(-" + (config._el_width + 40) + "px, " + randomBetween(config._height, 0) + "px)",
            '-o-transform': "translate(-" + (config._el_width + 40) + "px, " + randomBetween(config._height, 0) + "px)",
            'transform': "translate(-" + (config._el_width + 40) + "px, " + randomBetween(config._height, 0) + "px)"
          })
        // send all next items to the riright
        } else if(i > index) {
          timer += (delay*50);
          $(el.target).css({
            '-webkit-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-moz-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-ms-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-o-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            'transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            '-webkit-transform': "translate(calc(100vw + " + (config._el_width + 40) + "px), " + randomBetween(config._height, 0) + "px)",
            '-moz-transform': "translate(calc(100vw + " + (config._el_width + 40) + "px), " + randomBetween(config._height, 0) + "px)",
            '-ms-transform': "translate(calc(100vw + " + (config._el_width + 40) + "px), " + randomBetween(config._height, 0) + "px)",
            '-o-transform': "translate(calc(100vw + " + (config._el_width + 40) + "px), " + randomBetween(config._height, 0) + "px)",
            'transform': "translate(calc(100vw + " + (config._el_width + 40) + "px), " + randomBetween(config._height, 0) + "px)"
          })
        }
      })
    });

    // start animating active items
    sentItemsToBoard = setTimeout(() => {
      sliderTo(index);

      $displayedStories[active_index].forEach((el, delay) => {
        $(el.target).css({
          '-webkit-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*150 + "ms",
          '-moz-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*150 + "ms",
          '-ms-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*150 + "ms",
          '-o-transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*150 + "ms",
          'transition': config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*150 + "ms"
        });
        getCoordinates(el);
        el.timeout = setTimeout(() => {
          animations.start(el);
        }, delay*150 + config.movement._fast.speed);

        if(delay == $displayedStories[active_index].length - 1) {
          setTimeout(() => {
            animations.done = true; // last element was animated
          }, config.movement._fast.speed)
        }
      })
    }, timer)

    active_index = index;
  }
}


// get all items from JSON and save them in array
let createStories = () => {
  JSON.forEach((item) => {
    let test = item;
    test.speed = (randomBetween(config.movement._smooth.max, config.movement._smooth.min))/1000;
    test.target = '#story' + item.story_id
    stories.push(test);
  })

  createDomElements();
};

// get all categories and create filters
let getFilters = () => {
  var $filters = $('.filter-wrapper');
  if(mobile) {
    $('.controls').insertBefore('.views-element-container');
  }
  categories.push({category: stories[0].category, category_id: stories[0].category_id});
  letters.push(stories[0].last_name[0].toUpperCase());

  stories.forEach((story) => {
    var exists = false, initial = false;

    categories.forEach((category) => {
      if(story.category_id == category.category_id) {
        exists = true;
      }
    })
    letters.forEach((letter) => {
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
    'class': 'bold cat-item'
  }).appendTo('.filter-wrapper').click((e) => {
    $('.cat-item').removeClass('bold');
    $(e.target).addClass('bold');

    animations.fade_out();
      setTimeout(() => {
        createDomElements();
      }, config.movement._leave.delay * $displayedStories[active_index].length-1)
    $('.selected').text("A-Z");
  })
  // append all categories to filter wrapper
  categories.forEach((category, i) => {
    $(('<div/>'), {
      'class': 'cat-item',
      'data-category-id': category.category_id,
      'data-category': category.category,
      'data-index': i,
      'text': category.category
    }).appendTo('.filter-wrapper').click((e) => {
      $('.cat-item').removeClass('bold');
      $(e.target).addClass('bold');

      animations.fade_out();
      if(mobile) {
        //$('.filter-wrapper').slickGoTo(1);
        var slider = $( '.filter-wrapper' );
        slider[0].slick.slickGoTo(parseInt($(e.target).data('slick-index')));

        if($(e.target).data('slick-index') == 0) {
          $('.selected').text("A-Z");
        }
      }


      setTimeout(() => {
        createDomElements($(e.target).data('category-id'));
      }, config.movement._leave.delay * $displayedStories[active_index].length-1)
      //
    })
  });

  letters.forEach((letter) => {
    $(('<div/>'), {
      'text': letter,
      'class': 'cat-item',
      'data-letter': letter,
      'class': 'option'
    }).appendTo('.dropdown .dropdown-inner').click((e) => {
      $('.selected').text($(e.target).data('letter'));
      animations.fade_out();
      setTimeout(() => {
        createDomElements(null, $(e.target).data('letter'));
      }, config.movement._leave.delay * $displayedStories[active_index].length-1)
      //
    })
  })


  if(mobile) {
    $('.filter-wrapper').slick({
        arrows: false,
        infinite: false,
        variableWidth: true
    }).on("afterChange", function (event, slick, currentSlide, nextSlide){
      createDomElements($('.slick-active').data('category-id'));

      $('.selected').text("A-Z");
    });
  }
}




function prepareDesktopElements(category, letter) {
  var tmp_array = [], filtered = [];    // helper arrays

  // push proper items in tmp_array
  for(var i = 0, counter = 0; i < stories.length; i++) {
    if((!category && !letter) || category == stories[i].category_id || letter == stories[i].last_name[0].toUpperCase()) {
      tmp_array.push(stories[i]);  // add element in matrix
      counter++;
    }
    // if last item, or tmp_array reached max number, push items in matrix and eempty array
    if(counter % config._num == 0 && tmp_array.length > 0 || i == stories.length - 1 && tmp_array.length > 0) { // end of column or last entry
      $displayedStories.push(tmp_array);                      // add column in matrix and start in new column
      tmp_array = [];
    }
  }

  // create DOM elements
  /* * * * * * * * * * * * * * * * */
  $displayedStories.forEach((row) => {
    row.forEach((item) => {
      $('<div />', {
        'data-id': item.story_id,                           // set category id attribut
        'data-animated': false,
        'data-category': item.category_id,                  // set category attribut
        'class': 'item pulse-' + randomBetween(2,4),        // select between two classes available for item
        'id': 'story' + item.story_id                       // item id --> connected with item.target in object
      })
      .mouseenter((e) => {                                   // __mouse hover event
        $displayedStories[active_index].forEach((el) => {    // find dom element in array and stop animation
          if($(e.target).data('id') == el.story_id) {
            animations.stop(el);
            $(e.target).find('.label').css('display', 'block');
            setTimeout(() =>{ $(e.target).addClass('hovered');}, 50);
          }
        })
      })
      .mouseleave((e) => {                                   // __mouse leave event
        $displayedStories[active_index].forEach((el) => {    // find dom element in array and restart animation
          if($(e.target).data('id') == el.story_id) {
            animations.start(el);
            $(e.target).removeClass('hovered');
            setTimeout(() => {$(e.target).find('.label').css('display', 'none'); }, 50);
          }
        })
      })
      .click((e) => {                                        // __click event
        openModal($(e.target).data('id'));
      })
      .css({'backgroundImage': 'url(' + baseUrl + item.featured_image + ')', transition: 'none'})     // set some style
      .append($('<div/>', {                       // add label to elemen
        'class': 'label',
        'html': '<label>'+item.first_name+' '+item.last_name+'</label><small>'+item.category+'</small><button class="pop-story" data-id="'+item.story_id +'"/>'
      }))
      .appendTo($board);    // append element to board
    })

    // add same leave event on items label
    $('.label').mouseleave((e) => {
      if(!$($(e.target).closest('.item')).hasClass('hovered')) return;

      $displayedStories[active_index].forEach((el) => {
        if($($(e.target).closest('.item')).data('id') == el.story_id) {
          animations.start(el);

          $(e.target).closest('.item').removeClass('hovered');
          setTimeout(() => {$(e.target).closest('.label').css('display', 'none'); }, 50);
        }
      })
    }).mouseenter((e) => {                                   // __mouse hover event
      if($($(e.target).closest('.item')).hasClass('hovered')) return;

      $displayedStories[active_index].forEach((el) => {    // find dom element in array and stop animation
        if($($(e.target).closest('.item')).data('id') == el.story_id) {
          animations.stop(el);

          $(e.target).closest('.label').css('display', 'block');
          setTimeout(() => { $(e.target).closest('.item').addClass('hovered');}, 50);
        }
      })
    })
  });
  /* * * * * * * * * * * * * * * * */

  animations.fade_in();

  // apply slider
  $( "#slider" ).slider(
    { max: $displayedStories.length - 1,
     disabled: $displayedStories.length > 1 ? false : true,
     change: ( event, ui ) => {
      var selected = ui.value;

       //Math.round(ui.value*($displayedStories.length - 1)/100)
      if(selected < active_index) {
        animations.goTo(selected);
      } else if(selected > active_index) {
        animations.goTo(selected);
      }
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


function prepareMobileElements(category, letter) {
  var filtered = [];    // helper arrays

  // push proper items in tmp_array
  for(var i = 0, counter = 0; i < stories.length; i++) {

    if((!category && !letter) || category == stories[i].category_id || letter == stories[i].last_name[0].toUpperCase()) {
      filtered.push(stories[i]);  // add element in matrix
      counter++;
    }
  }
  $displayedStories.push(filtered);

  filtered.forEach((item, i) => {
    $('<div />', {
      'data-id': item.story_id,                           // set category id attribut
      'data-animated': false,
      'data-category': item.category_id,                  // set category attribut
      'class': 'item pulse-' + randomBetween(2,4) + ' ' + (i%2==0 ? 'left' : 'right') ,        // select between two classes available for item
      'id': 'story' + item.story_id                       // item id --> connected with item.target in object
    })
    .css({
      'backgroundImage': 'url(' + baseUrl + item.featured_image + ')',
      '-webkit-transition': 'none',
      '-moz-transition': 'none',
      '-ms-transition': 'none',
      '-o-transition': 'none',
      'transition': 'none' })
    .click((e) => {                                        // __click event
      openModal($(e.target).data('id'));
    })
    .appendTo($board);
  })
}

let $displayedStories = [];
let createDomElements = (category, letter) => {
  active_index = 0;


  $displayedStories = [];   // empty current arrat of stories
  $board.html('');          // empty board
  sliderTo(0);              // send draggable slider back to 0

  if(!mobile) {
    prepareDesktopElements(category, letter);
  } else {
    prepareMobileElements(category, letter);
  }
}


let randomBetween = (max, min) => {
  return Math.floor(Math.random() * (max - min) ) + min;
}


/*
 * Get random coordinates on board
 * @return x and y values in pixels [string]
 */
let getCoordinates = (el) => {
  var x = Math.floor(Math.random() * (config._width - config._el_width));
  var y = Math.floor(Math.random() * (config._height - config._el_height));


  el.position = {x: x, y: y};
  $(el.target).css({
    '-webkit-transform': "translate(" + x + "px, " + y + "px) scale(1)",
    '-moz-transform': "translate(" + x + "px, " + y + "px) scale(1)",
    '-ms-transform': "translate(" + x + "px, " + y + "px) scale(1)",
    '-o-transform': "translate(" + x + "px, " + y + "px) scale(1)",
    'transform': "translate(" + x + "px, " + y + "px) scale(1)"
  });
}

/*
 * Start moving elements in active group on board
 */
let startAnimation = () => {
  $displayedStories[active_index].forEach((el, i) => {
    animations.start(el);
  })
}

let sliderTo = (num) => {
  active_index = num;

  $('.ui-slider-handle').css({'left': (num > 0 ? num*100/($displayedStories.length - 1) : 0) + '%'});
}

let openModal = (id) => {
  var $overlay = $('.story-overlay'), selectedStory;
  var $body = $('body');
  stories.forEach((story) => {
    if(story.story_id == id) {
      selectedStory = story;
    }
  })

  if(!selectedStory) return;


  $overlay.addClass('open');
  $body.addClass('modal-open'); // Prevent the body from scrolling while the modal is open.
  setTimeout(() => {
    $overlay.addClass('fade-in');
  }, 50);

  setTimeout(() => {
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

$('#link').click((e) => {
	e.preventDefault();

  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($('#link').attr('href')).select();
  document.execCommand("copy");
  $temp.remove();

  $('#link-copied').addClass('show');

  setTimeout(() => {
  	$('#link-copied').removeClass('show');
  }, 3000);
});

let closeModal = () => {
  var $overlay = $('.story-overlay'), selectedStory;
  var $body = $('body');

  $body.removeClass('modal-open'); // Re-enable body scrolling.
  $('#modal').removeClass('drop');

  setTimeout(() => {
    $overlay.removeClass('fade-in');
  }, 50);

  setTimeout(() => {
    $overlay.removeClass('open');
  }, 350);
}

$('.dropdown-wrapper').click(() => {
  if($('.dropdown').hasClass('open')) {
    $('.dropdown').removeClass('open')
  } else {
    $('.dropdown').addClass('open')
  }
})

$('.dropdown').mouseleave(() => { $('.dropdown').removeClass('open') });
// on window resize, update config
$(window).resize(() => {
  config._width = $board.width();
  config._height = $board.height();
});

$('[data-role="closemodal"]').click(() => {
  closeModal();
})

var MOUSE_OVER = false;

if(mobile) {
  $('body').bind('mousewheel', (e) => {
    if(MOUSE_OVER){
      if(e.preventDefault) { e.preventDefault(); }
      e.returnValue = false;
      return false;
    }
  });

  $('.animation-wrapper').mouseenter(() => { MOUSE_OVER=true; });
  $('.animation-wrapper').mouseleave(() => { MOUSE_OVER=false; });

  $('.animation-wrapper').bind('mousewheel', (e) => {
    var delta = e.originalEvent.deltaY;
    e.preventDefault();
    if(active_index > 0 && delta > 0 && animations.done){
      animations.goTo(active_index - 1);
    }
    else if(active_index < $displayedStories.length - 1 && delta < 0 && animations.done) {
      animations.goTo(active_index + 1);
    }
  });
}


let makeAnimatedBackground = () => {
  var $body = $('.stories-api');
  var smallItems = [];  // helper arr

  $('<div/>', {         // create background animation base in html
    class: 'animated-background'
  }).appendTo($body);

  // create bubbles with background image
  config.background.image_bubbles._images.forEach((item, i) => {
    var x = Math.floor(Math.random() * (config._width - config._el_width));
    var y = Math.floor(Math.random() * (containerHeight - config._el_height));


    $('<div/>', {
      class: 'small-item',
      id: 'smallItem' + i
    })
    .css({
      'backgroundImage': 'url(' + item + ')',
      '-webkit-transform': "translate(" + x + "px, " + y + "px) scale(1)",
      '-moz-transform': "translate(" + x + "px, " + y + "px) scale(1)",
      '-ms-transform': "translate(" + x + "px, " + y + "px) scale(1)",
      '-o-transform': "translate(" + x + "px, " + y + "px) scale(1)",
      'transform': "translate(" + x + "px, " + y + "px) scale(1)",
      '-webkit-transition': 'transform 0ms linear,  opacity 1s linear ' + (i*0.1) + 's',
      '-moz-transition': 'transform 0ms linear,  opacity 1s linear ' + (i*0.1) + 's',
      '-o-transition': 'transform 0ms linear,  opacity 1s linear ' + (i*0.1) + 's',
      'transition': 'transform 0ms linear,  opacity 1s linear ' + (i*0.1) + 's'
    })
    .appendTo('.animated-background');
    smallItems.push({target: '#smallItem' + i, speed: config.background.image_bubbles._speed});
  });


  var containerHeight = $('.animated-background').height();

  smallItems.forEach((el) => {
    // spread elements on board
    getCoordinates(el);

    // get new position to animate them
    setTimeout(() => {
    	$(el.target).css({
    		'width': config.background.image_bubbles._size + 'px',
    		'height': config.background.image_bubbles._size + 'px',
        '-webkit-transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
        '-moz-transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
        '-o-transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
        'transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
    		'opacity': 1
    	})

      var x = Math.floor(Math.random() * (config._width - config._el_width));
      var y = Math.floor(Math.random() * (containerHeight - config._el_height));


      $(el.target).css({
        '-webkit-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        '-moz-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        '-ms-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        '-o-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        'transform': "translate(" + x + "px, " + y + "px) scale(1)"
      });
    }, 100);
    // and start interval animation
    el.animate = setInterval(() => {
      // get new coordinates for element
      //getCoordinates(el);
      var x = Math.floor(Math.random() * (config._width - config._el_width));
      var y = Math.floor(Math.random() * (containerHeight - config._el_height));


      $(el.target).css({
        '-webkit-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        '-moz-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        '-ms-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        '-o-transform': "translate(" + x + "px, " + y + "px) scale(1)",
        'transform': "translate(" + x + "px, " + y + "px) scale(1)"
      });
    }, config.background.image_bubbles._interval);
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



})(jQuery, Drupal);



