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

	var config = {
	  _num: 3,                      // number of elements displayed in wrapper
	  speed: {_max: 10000, _min: 5000},// speed of animated elements -- will be chosen randomly between max&min
	  overlap: true,
	  interval: 10000,
	  radius: 50,                  // [%] - (depends on board width and height)
	  _width: $board.width(),
	  _height: $board.height(),
	  _el_width: 106,
	  _el_height: 106,
	  movement: {
	    _entry: {speed: 1000, delay: 300, type: "linear"},
	    _leave: {speed: 500, delay: 200, type: "linear"},
	    _fast: {speed: 800, type: "linear", css: function() { return this.speed + "ms transform " + this.type}},
	    _smooth: {max: 10000, min: 5000, type: "cubic-bezier(0.36, 0.32, 0.75, 0.72)", 
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
	      _interval: 13000
	    }
	  }
	};


  Drupal.behaviors.mat_stories_api = {
    attach: function (context, settings) {
      
      $.getJSON('/stories-api?_format=json', function(data) {
        config.limit = {x: config._width/100*config.radius, y: config._height/100*config.radius};


        JSON = data;
        createStories();
        getFilters();
        makeAnimatedBackground();


        /* Check, if id in parameter and open story in modal, if is*/
				var check_params = window.location.href.split('#')
				if(check_params.length > 1) {
				  openModal(check_params[check_params.length - 1]);
				}
      });
    }
  };






var animations = {
  done: true,
  fade_in: function(el, delay) {
    $displayedStories[active_index].forEach(function(el, i) {
      // set new coordinates for element
      getCoordinates(el); 

      $(el.target).css({
        'opacity': 0.3,
        'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)'
      });

      setTimeout(function() {
        $(el.target).css({
          'opacity': 1,
          'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
          'transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms'
        });
      }, (i+1)* config.movement._entry.delay )

      // start animation
      setTimeout(function() {
        animations.start(el);
      }, (i+1)*config.movement._entry.delay + config.movement._entry.speed);
    })
  },
  fade_out: function(el, delay) {
    $displayedStories[active_index].forEach(function(el, i) {
      animations.stop(el);
      
      $(el.target).css({
        'opacity': 1,
        'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
        'transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms'
      })
                                      
      setTimeout(function() {
        $(el.target).css({
          'opacity': 0,
          'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0)'
        });
      }, i*config.movement._leave.delay);
    })
  },
  stop: function(el) {
    $(el.target).data('animated', false);
    
    clearInterval(el.animate);
    el.position = {x: $(el.target).offset().left, y: $(el.target).offset().top};

    $(el.target).css('transform', "translate(" + $(el.target).offset().left + "px, " + ($(el.target).offset().top - $board.offset().top) + "px)");
  },
  start: function(el) {
    $(el.target).data('animated', true);

    // set smooth movement
    $(el.target).css('transition', config.movement._smooth.css());
    getCoordinates(el);
    el.animate = setInterval(function() {
      // get new coordinates for element
      getCoordinates(el);
    }, (el.speed)*1000);
  },
  goTo: function(index) {
    var timer = 0;
    this.done = false;
    clearTimeout(sentItemsToBoard);
    
    
    $displayedStories.forEach(function(group, i) {
      group.forEach(function(el, delay) {
        animations.stop(el);        // stop animation - clear interval
        clearTimeout(el.timeout);   // clear timeout - prevent from animating
        
        // send all previous items to the left
        if(i < index) {
          timer += (delay*50);
          $(el.target).css({
            transition: config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            transform: "translate(-" + config._el_width + "px, " + randomBetween(config._height, 0) + "px)"
          })
        // send all next items to the riright
        } else if(i > index) {
          timer += (delay*50);
          $(el.target).css({
            transition: config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*50 + "ms",
            transform: "translate(calc(100vw + " + config._el_width + "px), " + randomBetween(config._height, 0) + "px)"
          })
        } 
      })
    });
    
    // start animating active items
    sentItemsToBoard = setTimeout(function() {
      sliderTo(index);
      
      $displayedStories[active_index].forEach(function(el, delay) {
        $(el.target).css('transition', config.movement._fast.speed + "ms transform " + config.movement._fast.type + " " + delay*150 + "ms");
        getCoordinates(el);
        el.timeout = setTimeout(function() {
          animations.start(el);
        }, delay*150 + config.movement._fast.speed);
        
        if(delay == $displayedStories[active_index].length - 1) {
          setTimeout(function() {
            animations.done = true; // last element was animated
          }, config.movement._fast.speed)
        }
      })
    }, timer)
    
    active_index = index;
  }
}


// get all items from JSON and save them in array
var createStories = function() {
  JSON.forEach(function(item) {
    stories.push({...item, 
                 speed: (randomBetween(config.speed._max, config.speed._min))/1000,
                 target: '#story' + item.story_id});
  })

  createDomElements();
};

// get all categories and create filters
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
    'class': 'bold'
  }).appendTo('.filter-wrapper').click(function(e) {
    animations.fade_out();
      setTimeout(function() {
        createDomElements();
      }, config.movement._leave.delay * $displayedStories[active_index].length-1)
    $('.selected').text("A-Z")
  })
  // append all categories to filter wrapper
  categories.forEach(function(category) {
    $(('<div/>'), {
      'data-category-id': category.category_id,
      'data-category': category.category,
      'text': category.category
    }).appendTo('.filter-wrapper').click(function(e) {
      animations.fade_out();
      setTimeout(function() {
        createDomElements($(e.target).data('category-id'));
      }, config.movement._leave.delay * $displayedStories[active_index].length-1)
      //
    })
  });
  
  letters.forEach(function(letter) {
    $(('<div/>'), {
      'text': letter,
      'data-letter': letter,
      'class': 'option'
    }).appendTo('.dropdown').click(function(e) {
      $('.selected').text($(e.target).data('letter'));
      animations.fade_out();
      setTimeout(function() {
        createDomElements(null, $(e.target).data('letter'));
      }, config.movement._leave.delay * $displayedStories[active_index].length-1)
      //
    })
  })
}







var $displayedStories = [];
function createDomElements(category, letter) {
  active_index = 0;
  

  $displayedStories = [];   // empty current arrat of stories
  $board.html('');          // empty board
  sliderTo(0);              // send draggable slider back to 0   
  
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
  $displayedStories.forEach(function(row) {
    row.forEach(function(item) {            
      $('<div />', {
        'data-id': item.story_id,                           // set category id attribut
        'data-animated': false,
        'data-category': item.category_id,                  // set category attribut
        'class': 'item pulse-' + randomBetween(2,4),        // select between two classes available for item
        'id': 'story' + item.story_id                       // item id --> connected with item.target in object
      })
      .mouseenter(function(e) {                                   // __mouse hover event
        $displayedStories[active_index].forEach(function(el) {    // find dom element in array and stop animation
          if($(e.target).data('id') == el.story_id) {
            animations.stop(el);
            console.log("STOP!!!!")
            $(e.target).find('.label').css('display', 'block');
            setTimeout(function(){ $(e.target).addClass('hovered');}, 50);
          }
        })
      })
      .mouseleave(function(e) {                                   // __mouse leave event
        $displayedStories[active_index].forEach(function(el) {    // find dom element in array and restart animation
          if($(e.target).data('id') == el.story_id) {
            animations.start(el);
            $(e.target).removeClass('hovered');
            setTimeout(function(){$(e.target).find('.label').css('display', 'none'); }, 50);
          }
        })
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
    
    // add same leave event on items label
    $('.label').mouseleave(function(e) {  
      $displayedStories[active_index].forEach(function(el) {
        if($($(e.target).closest('.item')).data('id') == el.story_id) {
          animations.start(el);
          
          $(e.target).closest('.item').removeClass('hovered');
          setTimeout(function(){$(e.target).closest('.label').css('display', 'none'); }, 50);
        }
      })
    }).mouseenter(function(e) {                                   // __mouse hover event
      $displayedStories[active_index].forEach(function(el) {    // find dom element in array and stop animation
        if($($(e.target).closest('.item')).data('id') == el.story_id) {
          animations.stop(el);
          
          $(e.target).closest('.label').css('display', 'block');
          setTimeout(function(){ $(e.target).closest('.item').addClass('hovered');}, 50);
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
     change: function( event, ui ) {
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


function randomBetween(max, min) {
  return Math.floor(Math.random() * (max - min) ) + min;
}


/*
 * Get random coordinates on board
 * @return x and y values in pixels [string]
 */ 
function getCoordinates(el) {
  if(el.position) {
    var x = Math.floor(Math.random() * (el.position.x + config.limit.x) + (el.position.x - config.limit.x));
    var y = Math.floor(Math.random() * (el.position.y + config.limit.y) + (el.position.y - config.limit.y));
    
    if(x < config._el_width) {x = config._el_width}
    else if(x > (config._width - config._el_width)) {x = config._width - config._el_width};
    
    if(y < config._el_height) {y = config._el_height}
    else if(y > (config._height - config._el_height)) {x = config._height - config._el_height};
  } else {
    var x = Math.floor(Math.random() * (config._width - config._el_width));
    var y = Math.floor(Math.random() * (config._height - config._el_height));
  }
  
  
  var x = Math.floor(Math.random() * (config._width - config._el_width));
  var y = Math.floor(Math.random() * (config._height - config._el_height));
  

  el.position = {x: x, y: y};
  $(el.target).css('transform', "translate(" + x + "px, " + y + "px) scale(1)");
  
}

/*
 * Start moving elements in active group on board
 */
function startAnimation() {
  $displayedStories[active_index].forEach(function(el, i) {
    animations.start(el);
  })
}

function sliderTo(num) {
  active_index = num;
  
  $('.ui-slider-handle').css({'left': (num > 0 ? num*100/($displayedStories.length - 1) : 0) + '%'});
}

function openModal(id) {
  var $overlay = $('.overlay'), selectedStory;
  stories.forEach(function(story) {
    if(story.story_id == id) {
      selectedStory = story;
    }
  })

  if(!selectedStory) return;


  $overlay.addClass('open');
  setTimeout(function() {
    $overlay.addClass('fade-in');
  }, 50);
  
  setTimeout(function() {
    $('#modal').addClass('drop');
  }, 350);
  
  
  
  selectedStory.featured_image ? $('#image').attr('src', baseUrl + selectedStory.featured_image) : $('#image').attr('src', '');
  $('#name').text(selectedStory.first_name + ' ' + selectedStory.last_name);
  $('#role').text('DONOR');
  $('#gallery').html(
    (selectedStory.image_1 ? '<img src="' + (baseUrl + selectedStory.image_1) + '">' : '') + 
    (selectedStory.image_2 ? '<img src="' + (baseUrl + selectedStory.image_2) + '">' : '') +
    (selectedStory.image_3 ? '<img src="' + (baseUrl + selectedStory.image_3) + '">' : '')
  )
  $('#content').html(selectedStory.content);
}

function closeModal() {
  var $overlay = $('.overlay'), selectedStory;
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

$('.dropdown').mouseleave(function(){ $('.dropdown').removeClass('open') });
// on window resize, update config
$(window).resize(function() {
  config._width = $board.width();
  config._height = $board.height();
});

$('[data-role="closemodal"]').click(function() {
  closeModal();
})

var MOUSE_OVER = false;

$('body').bind('mousewheel', function(e){
  if(MOUSE_OVER){
    if(e.preventDefault) { e.preventDefault(); } 
    e.returnValue = false; 
    return false; 
  }
});

$('.animation-wrapper').mouseenter(function(){ MOUSE_OVER=true; });
$('.animation-wrapper').mouseleave(function(){ MOUSE_OVER=false; });

$('.animation-wrapper').bind('mousewheel', function(e){
  var delta = e.originalEvent.deltaY;
  e.preventDefault();
  if(active_index > 0 && delta > 0 && animations.done){
    animations.goTo(active_index - 1);
  }
  else if(active_index < $displayedStories.length - 1 && delta < 0 && animations.done) {
    animations.goTo(active_index + 1);
  }
});

var makeAnimatedBackground = function() {
	
  var $body = $('.stories-api');
  var smallItems = [];  // helper arr
  $('<div/>', {         // create background animation base in html
    class: 'animated-background'
  }).appendTo($body);


  
  // create bubbles with background image
  config.background.image_bubbles._images.forEach(function(item, i) {
    $('<div/>', {
      class: 'small-item',
      id: 'smallItem' + i
    }).css({'backgroundImage': 'url(' + item + ')', 'transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear'}).appendTo('.animated-background');
    smallItems.push({target: '#smallItem' + i, speed: config.background.image_bubbles._speed});
  });
  
  smallItems.forEach(function(el) {
    // spread elements on board
    getCoordinates(el);
    
    // get new position to animate them
    setTimeout(function() {
      getCoordinates(el);
    }, 100);
    // and start interval animation
    el.animate = setInterval(function() {
      // get new coordinates for element
      getCoordinates(el);
    }, config.background.image_bubbles._interval);
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









})(jQuery, Drupal);



