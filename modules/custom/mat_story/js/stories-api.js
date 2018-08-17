(function ($, Drupal) {

	// Script for animating elements
  $('.animation-wrapper').wrap('<div class="outer-wrapper"/>');
	// global variables
	var $board = $(".outer-wrapper"); // animation wrapper
  var $scroll = $('.outer-wrapper');    // scrollable wrapper

 

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
  var containerHeight;
	var config = {
	  //_num: 10,                      // number of elements displayed in wrapper
    _num: {
      group: 3,
      first_and_last: 5,
      other_pages: 10
    },
	  overlap: true,
	  interval: 10000,
	  radius: 50,                  // [%] - (depends on board width and height)
	  _width: $board.width(),
    _total_width: 0,
	  _height: $board.height(),
	  _el_width: 110,
	  _el_height: 110,
	  movement: {
	    _entry: {speed: 3000, delay: 100, type: "linear"},
	    _leave: {speed: 3000, delay: 100, type: "linear"},
	    _fast: {speed: 1200, type: "linear", css: function() { return this.speed + "ms transform " + this.type}},
	    _smooth: {max: 4000, min: 80000, type: "linear", radius: 50, leave: 80000,
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
	      _speed: 4000,
	      _interval: 3000,
	      _size: 60,
        _radius: 30
	    }
	  }
	};


  var sliderSections = {
    active: 0, 
    sections: [], 
    add: function(from, to) {
      sliderSections.sections.push({from: from*$board.width()/100, to: to*$board.width()/100})
    },
    check: function(value) {
      for(var i = 0; i < sliderSections.sections.length; i++) {
        if(sliderSections.sections[i].from > value && sliderSections.sections[i].to <= value) {
          sliderSections.active = i;
          return sliderSections.active;
        }
      }
    },
    slider_width: 0,
    getSliderWidth() {
      return sliderSections.sections[0].from - sliderSections.sections[sliderSections.sections.length - 1].from;
    }
  };                    // prepared for sections of slider (to track in which)



  function checkMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  var mobile = checkMobile();

  var $p, $h1, $button

  function isOverlapingX(value) {
    // offset top - height --- top + height
    if(value > $p.offset().left && value < $p.width() + $p.offset().left) return true;
    if(value > $h1.offset().left && value < $h1.width() + $h1.offset().left) return true;
    if(value > $button.offset().left && value < $button.width() + $button.offset().left) return true;
    return false;
  }

  function isOverlapingY(value) {
    var offset = ($('.controls').offset().top + $('.controls').height());
    /*console.log("h1: " + ($h1.offset().top - offset) + " - " + ($h1.offset().top - offset + $h1.height()));
    console.log("p: " + ($p.offset().top - offset) + " - " + ($p.offset().top - offset + $p.height()));
    console.log("button: " + ($button.offset().top - offset) + " - " + ($button.offset().top - offset + $button.height()));

    console.log(value)
    console.log("____________________")*/

    // offset top - height --- top + height
    if(value - config._el_height > $h1.offset().top - offset && value < $h1.offset().top - offset + $h1.height()) return true;
    if(value - config._el_height > $p.offset().top - offset && value < $p.offset().top - offset + $p.height()) return true;
    //if(value > $h1.offset().top - $p.height() && value < $h1.offset().top - offset + $h1.height()) return false;
    //console.log("c offset", offset)
   /* console.log("h1 offset" , $h1.offset().top - ($('.controls').offset().top + $('.controls').height()))
    console.log("p offset" , $p.offset().top - ($('.controls').offset().top + $('.controls').height()))
    console.log("a offset" , $button.offset().top - ($('.controls').offset().top + $('.controls').height()))*/
    if(value - config._el_height > $button.offset().top - $p.height() && value < $button.offset().top - offset + $button.height()) return true;
    return false;
  }
  
  function findStory(target) {
    for(var i = 0; i < stories.length; i++) {
      if(stories[i].target == target) {
        return stories[i];
      }
    }
  }

  function getStoriesReady(category, letter, init) {
    let fadeElementsOut = [];
    let fadeElementsIn = [];
    let elementsToMove = [];


    stories.forEach(function(story) {
      if(category && story.category_id != category) {
        if(story.display) fadeElementsOut.push(story);
        story.display = false;
      } else if(letter && letter.toLowerCase() != story.last_name[0].toLowerCase() && letter.toLowerCase() != story.first_name[0].toLowerCase()) {
        if(story.display) fadeElementsOut.push(story);
        story.display = false;
      } else {
        if(!story.display) fadeElementsIn.push(story);
        else if(story.prevSlide != story.slide) elementsToMove.push(story);
        
        story.display = true;
      }
    })
    
    
    stories = sortForSlider(stories);

    console.log("fadeElementsIn", fadeElementsIn)
    console.log("fadeElementsOut", fadeElementsOut)
    console.log("elementsToMove", elementsToMove)


    fadeElementsOut.forEach(function(story, i) {
      setTimeout(function() {
        story.fadeOut();
      }, config.movement._leave.delay*i)
    })

    fadeElementsIn.forEach(function(story, i) {
      setTimeout(function() {
        story.fadeIn();
      }, config.movement._entry.delay*i)
    })

    elementsToMove.forEach(function(story, i) {
      setTimeout(function() {
        story.move();
      }, config.movement._entry.delay*i)
    })

    setSlider();
  }

  function createDOMStories () {
    // create DOM elements
  /* * * * * * * * * * * * * * * * */
  //$positions.forEach((row, i) => {
    stories.forEach((item, j) => {
      $('<div />', {
        'data-id': item.story_id,                           // set category id attribut
        'data-animated': false,
        'data-i':j,
        'data-j': j,
        'data-category': item.category_id,                  // set category attribut
        'class': 'item pulse-' + randomBetween(2,4),        // select between two classes available for item
        'id': 'story' + item.story_id                       // item id --> connected with item.target in object
      })
      .mouseenter((e) => {                                   // __mouse hover event
        $(e.target).find('.label').css('display', 'block');
        setTimeout(() =>{ $(e.target).addClass('hovered');}, 50);

        // to-do
        // stop enimation
      })
      .mouseleave((e) => {                                   // __mouse leave event
        $(e.target).removeClass('hovered');
        setTimeout(() => {$(e.target).find('.label').css('display', 'none'); }, 50);

        // to-do
        // animate element
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
      $(e.target).closest('.item').removeClass('hovered');
      setTimeout(() => {$(e.target).closest('.label').css('display', 'none'); }, 50);
    })
  //});


    //createStories();
    //createDomElements();
    /*** TO-DO !!!! ****/
    // for mobile
    //prepareDesktopElements();

    //getPositions(stories);

    getStoriesReady(null, null, true);

    getFilters();
    
  }
  

function getFirstAndLastPosition(row, last) {
  var x = {value: 0, counter: 0}, 
      y = {value: 0, counter: 0}, 
      titlePos = row.positions.from * config._width, 
      left = last ? config._el_width/2 : config._el_width + 10, 
      right = last ? config._el_width + 10 : config._el_width/2;
  // /(x.value - row.positions.from * config._width/100) > config.title.left && (x.value - row.positions.from*config._width/100) < config.title.left + config.title.width)

  while(x.counter < 40 && (x.value == 0 || isOverlapingX(x.value))) {
    x.value = randomBetween((row.positions.from - config._el_width) + left, (row.positions.to + config._el_width) - right);
    x.counter++;
  }
  while(y.counter < 40 && (y.value == 0 || isOverlapingY(y.value))) {
    y.value = randomBetween(config._height - config._el_width,  config._el_width);
    y.counter++;
  }
  return {x: x.value, y: y.value}
}

function getPositionsBySections(arr) {
  calculateWrapperWidth(arr.length);

  $positions.forEach(function(row, i) {
    row.items.forEach(function(item) {
      
      var test = randomBetween(row.positions.from, row.positions.to);

      if(i == 0 || i == $positions.length - 1) {
        item.position = getFirstAndLastPosition(row, i);
      } else {
        item.position = {
          x: randomBetween(row.positions.from, row.positions.to),
          y: randomBetween(config._height - config._el_width - 40, config._el_width)
        }
      }
    })
  })

  animations.fade_in($positions);
}

var $positions = [];
function getPositions(arr) {
  var tmp = [...arr], helper = [], from = 0;
  $positions = [];

  
  $positions.push({
    positions: {
      from: 100*$board.width()/100,
      to: 0
    },
    items: tmp.splice(0, config._num.first_and_last),
    slider: sliderSections.sections.length
  });
 // sliderSections.add(100, 0);

  var lastItems = tmp.splice(tmp.length-config._num.first_and_last, config._num.first_and_last);


  while(tmp.length > 0) {
    helper.push(tmp.shift());
    if(helper.length == config._num.other_pages || tmp.length == 0) {
      $positions.push({
        positions: {
          from: from*$board.width()/100,
          to: (from - helper.length*100/config._num.other_pages)*$board.width()/100
        },
        items: helper,
        slider: sliderSections.sections.length
      })
      //sliderSections.add(from, from - helper.length*100/config._num.other_pages);

      from = from - helper.length*100/config._num.other_pages;
      helper = [];
    }
  }


  if(lastItems.length > 0) {
    $positions.push({
      positions: {
        from: from*$board.width()/100,
        to: (from - 100)*$board.width()/100
      },
      items: lastItems,
      slider: sliderSections.sections.length
    });
    //sliderSections.add(from, from-100);

  }

  console.log("POSITIONS", $positions, sliderSections);
  
  sliderSections.check(100);

  getPositionsBySections(arr);
}


  function sortForSlider(arr) {
    let counter = 0;    // counter of elements which are already set
    let slide = 0;      // current slider
    let totalDisplayed = 0;  // total number of displayed items
    let displayedInMiddleSlide = 0;
    let from = 0;
    sliderSections.sections = [];

    arr.forEach(function(item) {
      if(item.display) totalDisplayed++;
    })
    
    arr.forEach(function(item) {
      if(item.display) {
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

    console.log("sliderSections", sliderSections);
    return arr;
  }

  Drupal.behaviors.mat_stories_api = {
    attach: function (context, settings) {
      config._width = $board.width();

      $.getJSON('/stories-api?_format=json', function(data) {
        // prevent Drupal from reloading script
        if(!initialised) {
          $p = $('.slider-wrapper .container-small p'), $h1 = $('.slider-wrapper .container-small h1'), $button = $('.slider-wrapper .container-small a');
      		
	      	config.limit = {x: config._width/100*config.radius, y: config._height/100*config.radius};
          config.title = {
            top: $('.slider-wrapper .container-small').offset().top - $('.slider-wrapper .container-small').height(),
            left: $('.slider-wrapper .container-small').offset().left,
            height: $('.slider-wrapper .container-small').height(),
            width: $('.slider-wrapper .container-small').width()
          }



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
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"}, {
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
          }, {
            "story_id":"101",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          },{
            "story_id":"1011",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Custom cat",
            "category_id":"10",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"1012",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Custom cat",
            "category_id":"10",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"1013",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Custom cat",
            "category_id":"10",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          },{
            "story_id":"1014",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Custom cat",
            "category_id":"10",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          },{
            "story_id":"102",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"103",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"104",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"105",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"106",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"107",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"108",
            "first_name":"Kristin",
            "last_name":"Michelle Dennis",
            "category":"Patients Waiting",
            "category_id":"4",
            "featured_image":"\/sites\/default\/files\/2018-05\/slider1.jpg",
            "image_1":"\/sites\/default\/files\/2018-05\/nature2.jpg",
            "image_2":"\/sites\/default\/files\/2018-05\/kid1.jpg",
            "image_3":"\/sites\/default\/files\/2018-05\/kid4.jpg",
            "content":"\u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E \u003Cp\u003EElmer Jamall Stephen Augustine Jr. was known to family and friends as Jamall or G-Wells. Jamall was full of love and life. His friends told me they called him G-Wells because he was always happy in spirit and gave his support with a smile on his face.\u003C\/p\u003E\n\n\u003Cp\u003EFive months before Jamall passed, he had been feeling tired and sleepy. He had a cold and flu-like symptoms. I told him to go to the doctor because I felt something besides the flu was going on with his body. A history of diabetes runs in my family, and I felt he had some of the symptoms of a diabetic. He promised me he would go to the doctor the following day. The next day was too late. I would never see him conscious again.\u003C\/p\u003E"
          }, {
            "story_id":"109",
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


          JSON.forEach((item, i) => {
            //let newItem = item;
            let newItem = {
              ...item,
              target: '#story' + item.story_id,
              getCss: function() {
                $(this.target).css({
                  'transform': 'translate(' + this.position.x + 'px, ' + this.position.y + 'px) scale(' + this.scale + ')',
                  '-webkit-transition': this.speed + 'ms all ' + config.movement._smooth.type,
                  '-moz-transition': item.speed + 'ms all ' + config.movement._smooth.type,
                  '-ms-transition': item.speed + 'ms all ' + config.movement._smooth.type,
                  '-o-transition': item.speed + 'ms all ' + config.movement._smooth.type,
                  'transition': item.speed + 'ms all ' + config.movement._smooth.type,
                  'filter': 'blur(' + this.blur + ')'
                })
              },
              position: {x: 0, y: 0},
              getXPosition: function(from, to) {
                this.prevPosition = this.position.x;
                this.position.x = randomBetween(from, to);
              },
              getYPosition: function(from, to) {
                this.position.y = randomBetween(from, to);
              },
              scale: '0',
              blur: '3.4px',
              speed: '0s',
              display: false,
              fadeOut: function() {
                this.scale = '0';
                this.blur = '3.4px';
                this.speed = config.movement._leave.speed;

                animations.stopMovement(this);
                this.getCss();

                setTimeout(() => {
                  this.speed = config.background.image_bubbles._speed;
                  this.getCss();
                  animations.animateBubble(this);
                }, config.movement._leave.speed);
              },
              fadeIn: function() {
                this.getStartingPosition();

                setTimeout(() => {
                  this.scale = '1';
                  this.blur = '0';
                  this.speed = config.movement._entry.speed;
                  this.getCss();
                }, 100);
                

                setTimeout(() => {
                  animations.makeElMove(this);
                }, 1000)
                
              },
              move: function() {
                this.fadeOut();
                this.fadeIn();
                setTimeout(() => {
                  
                }, config.movement._leave.speed)
              },
              slide: "undefined",
              getStartingPosition: function() {
                this.speed = 0;
                this.getXPosition(sliderSections.sections[this.slide].from, sliderSections.sections[this.slide].to);
                this.getYPosition(config._el_height, config._height - config._el_height);
                this.getCss();
              }
            };
            stories.push(newItem);
          })


          


          //console.log("stories", stories);

	        /* Check, if id in parameter and open story in modal, if is*/
					var check_params = window.location.href.split('#')
					if(check_params.length > 1) {
					  openModal(check_params[check_params.length - 1]);
					}

          createDOMStories();

          makeAnimatedBackground();
      	}
      });
    }
  };






var animations = {
  done: true,
  animateBubble: (el) => {
    
    if(el.animate) return;

    animations.stopMovement(el);
    el.animate = setInterval(() => {
      // get new coordinates for element
      //getCoordinates(el);
      var x = Math.floor(Math.random() * (config._width*100/config._total_width/2 - config._el_width));
      var y = Math.floor(Math.random() * (containerHeight - config._el_height));

      el.position = {
        x: randomBetween(el.position.x - config.background.image_bubbles._radius/2, el.position.x + config.background.image_bubbles._radius/2), 
        y: randomBetween(el.position.y - config.background.image_bubbles._radius/2, el.position.y + config.background.image_bubbles._radius/2)
      }

      $(el.target).css({
        '-webkit-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
        '-moz-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
        '-ms-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
        '-o-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
        'transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")"
      });
    }, config.background.image_bubbles._interval);
  },
  makeElMove: (el) => {
    if(el.movement) return;

    el.speed = config.movement._smooth.max;
    el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
    el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));
    // get new coordinates for element
    //$(el.target).css({'transform': translate(el.positions.x + 'px', el.positions.y + 'px') scale(1)})
/*
    $(el.target).css({
      'transform': 'translate(' + el.position.x + 'px, ' + el.position.y + 'px) scale(1)',
      '-webkit-transition': el.speed + 'ms all ' + config.movement._smooth.type,
      '-moz-transition': el.speed + 'ms all ' + config.movement._smooth.type,
      '-ms-transition': el.speed + 'ms all ' + config.movement._smooth.type,
      '-o-transition': el.speed + 'ms all ' + config.movement._smooth.type,
      'transition': el.speed + 'ms all ' + config.movement._smooth.type
    })*/
    el.getCss();

    el.animate = setInterval(() => {
      el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
      el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));
      // get new coordinates for element
      el.getCss();
    }, el.speed);

    el.movement = true;
  },
  stopMovement: (el) => {
    clearInterval(el.animate);

    el.movement = false;
  },
  fade_in: (elements, category, letter) => {
    
    var t = 1;
    elements.forEach(function(row, i) {
      row.items.forEach(function(el, j) {

        if(category && category != $(el.target).data('category')) {
          //console.log($(el.target).data('category'));
          return;
        } else {
          //if(category && category != $(el.target))
          $(el.target).css({
            '-webkit-transition': 'all ease-in-out 0ms',
            '-moz-transition': 'all ease-in-out 0ms',
            '-ms-transition': 'all ease-in-out 0ms',
            '-o-transition': 'all ease-in-out 0ms',
            'transition': 'all ease-in-out 0ms',
            'opacity': 1,
            '-webkit-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            '-moz-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            '-ms-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            '-o-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)'
          })
          t++;

          el.scale = 1;
          el.speed = config.movement._entry.speed;

          setTimeout(() => {
            $(el.target).css({
              'opacity': 1,
              '-webkit-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
              '-moz-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
              '-ms-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
              '-o-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
              'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(1)',
              '-webkit-filter': 'blur(0) brightness(1)',
              'filter': 'blur(0) brightness(1)',
              '-webkit-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
              '-moz-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
              '-ms-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
              '-o-transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms',
              'transition': 'all ease-in-out ' + config.movement._entry.speed + 'ms'
            });
            setTimeout(function() {
              animations.makeElMove(el);
            }, config.movement._entry.speed);
            //t++;
            //animations.makeElMove(el);
            
          }, t*config.movement._entry.delay )
        }

        
      })
    })
  },
  fade_out: (category, letter) => {
    $positions.forEach(function(row) {
      row.items.forEach(function(el) {
        animations.stopMovement(el);


        if(category && category == $(el.target).data('category')) {
          console.log($(el.target).data('category'));
          return;
        } else {

          
          console.log(el)
          el.scale = 0.6;
          el.speed = config.background.image_bubbles._speed;

          $(el.target).css({
            '-webkit-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
            '-moz-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
            '-ms-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
            '-o-transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
            'transition': 'all ease-in-out ' + config.movement._leave.speed + 'ms',
            'filter': 'blur(3.4px) brightness(1)',
            '-webkit-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            '-moz-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            '-ms-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            '-o-transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)',
            'transform': 'translate(' + el.position.x + 'px,'+ el.position.y + 'px) scale(0.6)'
          })
          animations.makeElMove(el);
        }
      })
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
  /*JSON.forEach((item) => {
    let test = item;
    test.speed = (randomBetween(config.movement._smooth.max, config.movement._smooth.min))/1000;
    test.target = '#story' + item.story_id
    stories.push(test);
  })
*/
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

    $('.selected').text("A-Z");

    getStoriesReady(null, null);
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

      // animations.fade_out($(e.target).data('category-id'));

      var filtered = [];
      stories.forEach(function(item) {
        if(item.category_id == $(e.target).data('category-id')) {
          filtered.push(item);
        }
      })

      


      if(mobile) {
        //$('.filter-wrapper').slickGoTo(1);
        var slider = $( '.filter-wrapper' );
        slider[0].slick.slickGoTo(parseInt($(e.target).data('slick-index')));

        if($(e.target).data('slick-index') == 0) {
          $('.selected').text("A-Z");
        }
      } else {
        //animations.fade_out($(e.target).data('category-id'));
        //getPositions(filtered);
        getStoriesReady($(e.target).data('category-id'), null);
      }


      /*setTimeout(() => {
        // animations.fade_in($(e.target).data('category-id'));
        //createDomElements($(e.target).data('category-id'));
      }, config.movement._leave.delay * $displayedStories[active_index].length-1)*/
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
      $('.cat-item').removeClass('bold');
      getStoriesReady(null, $(e.target).data('letter'));
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
  getPositions(stories);

  
  /* * * * * * * * * * * * * * * * */

  

}



var sliderStopped = true;
var previousSliderPoint = 0;
function moveSlider(to) {
  $scroll.animate({
    scrollLeft: to
  }, 10);
}



function moveItems(value) {
  stories.forEach(function(el) {
    el.position.x = el.position.x + (el.scale == 1 ? value :( value/2));
    el.speed = Math.abs(value) > 100 ? Math.abs(value) + 100 : 100;
    if(el.movement)
        animations.stopMovement(el);
      el.getCss();
  })
  /*
  $positions.forEach(function(row) {
    row.items.forEach(function(el) {
      el.position.x = el.position.x + (el.scale == 1 ? value :( value/2));

      if(el.movement)
        animations.stopMovement(el);

      el.getCss();

      $(el.target).css({
        '-webkit-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
          '-moz-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
          '-ms-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
          '-o-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
          'transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(" + el.scale + ")",
          '-webkit-transition': (Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 ) + "ms transform linear",
          '-moz-transition': (Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 ) + "ms transform linear",
          '-ms-transition': (Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 ) + "ms transform linear",
          '-o-transition': (Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 ) + "ms transform linear",
          'transition': (Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 ) + "ms transform linear"
      })
    })
  })*/

  smallItems.forEach(function(el) {
    el.position.x = el.position.x + value/2;

    //if(el.movement)
      animations.stopMovement(el);

    $(el.target).css({
      '-webkit-transform': "translate(" + el.position.x + "px, " + el.position.y + "px)",
      '-moz-transform': "translate(" + el.position.x + "px, " + el.position.y + "px)",
      '-ms-transform': "translate(" + el.position.x + "px, " + el.position.y + "px)",
      '-o-transform': "translate(" + el.position.x + "px, " + el.position.y + "px)",
      'transform': "translate(" + el.position.x + "px, " + el.position.y + "px)",
      '-webkit-transition': Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 + "ms transform linear",
      '-moz-transition': Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 + "ms transform linear",
      '-ms-transition': Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 + "ms transform linear",
      '-o-transition': Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 + "ms transform linear",
      'transition': Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 + "ms transform linear"
    })
  })
}


function setSlider(width) {
  let $slider = $('.stories-api .outer-wrapper');
  let prevSliderValue = 0;
  let max = sliderSections.getSliderWidth()

  $( "#slider" ).slider(
    { max: max,
      disabled: !max,
      value: 0,
      slide: ( event, ui ) => { 
        moveItems(Number(ui.value - prevSliderValue));
        prevSliderValue = ui.value;

        if((ui.value <= 10 || ui.value >= (max - 10)) && $('.slider-wrapper .container-small').hasClass('fade-out')) {
          $('.slider-wrapper .container-small').removeClass('fade-out');
        } else if((ui.value > 10 && ui.value < (max - 10)) && !$('.slider-wrapper .container-small').hasClass('fade-out')){
          $('.slider-wrapper .container-small').addClass('fade-out');
        }

        console.log(sliderSections.check(config._width - ui.value ));
     },
     change: ( event, ui ) => {
/*
      $positions.forEach(function(row) {
        row.items.forEach(function(el) {
          if(el.scale == 1) {
            $(el.target).css({
              'transform': 'translate(' + el.position.x + 'px, ' + el.position.y + 'px) scale(' + el.scale + ')',
              '-webkit-transition': el.speed + 'ms all ' + config.movement._smooth.type,
              '-moz-transition': el.speed + 'ms all ' + config.movement._smooth.type,
              '-ms-transition': el.speed + 'ms all ' + config.movement._smooth.type,
              '-o-transition': el.speed + 'ms all ' + config.movement._smooth.type,
              'transition': el.speed + 'ms all ' + config.movement._smooth.type
            })


            animations.makeElMove(el);
          }
        })
      })*/
      stories.forEach(function(story) {
        animations.makeElMove(story);
      })
      

      smallItems.forEach(function(el) {
        $(el.target).css({
          '-webkit-transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
          '-moz-transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
          '-o-transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
          'transition': 'transform ' + config.background.image_bubbles._speed + 'ms linear',
          'opacity': 1
        })
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

function calculateWrapperWidth(num, arr) {
  let width = 100;

  if(num - config._num.first_and_last*2 > 0) {
    num = num - config._num.first_and_last*2
    width = 200 + 100*Math.floor(num / config._num.other_pages) + 100*(num % config._num.other_pages)/config._num.other_pages;
  }
  $('.animation-wrapper').css('width', width + '%');
  setSlider(width); 
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
  /*active_index = 0;


  $displayedStories = [];   // empty current arrat of stories
  $board.html('');          // empty board
  sliderTo(0);              // send draggable slider back to 0
*/
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

var smallItems = [];  // helper arr

let makeAnimatedBackground = (w) => {
  var $body = $('.stories-api');
  
  $('<div/>', {         // create background animation base in html
    class: 'animated-background'
  }).appendTo($body);

  containerHeight = $('.animated-background').height();
  // create bubbles with background image
  config.background.image_bubbles._images.forEach((item, i) => {
    var x = Math.floor(Math.random() * (w - config._el_width));
    var y = Math.floor(Math.random() * (containerHeight - config._el_height));
    item.position = {x: x, y: y}
    
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
    smallItems.push({target: '#smallItem' + i, speed: config.background.image_bubbles._speed, scale: 1});
  });

  smallItems.forEach((el) => {
    // spread elements on board
    getCoordinates(el);
    el.animated = false;

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
/*
      var x = randomBetween(el.position.x - config.background.image_bubbles._radius/2, el.position.x + config.background.image_bubbles._radius/2);
      var y = randomBetween(el.position.y - config.background.image_bubbles._radius/2, el.position.y + config.background.image_bubbles._radius/2);

      el.position = {
        x: x, 
        y: y
      }*/
//console.log(el.position)
      /*$(el.target).css({
        '-webkit-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(1)",
        '-moz-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(1)",
        '-ms-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(1)",
        '-o-transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(1)",
        'transform': "translate(" + el.position.x + "px, " + el.position.y + "px) scale(1)"
      });*/

      animations.animateBubble(el);
    }, 100);
    // and start interval animation
    
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



