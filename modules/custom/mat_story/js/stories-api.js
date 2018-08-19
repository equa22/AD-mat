(function ($, Drupal) {

	// Script for animating elements
  $('.animation-wrapper').wrap('<div class="outer-wrapper"/>');
	// global variables
	var $board = $(".outer-wrapper"); // animation wrapper
  var $scroll = $('.outer-wrapper');    // scrollable wrapper

 

	var baseUrl = '';
	var JSON;
	var categories = [];                // array of all categories (get them from stories)
	var letters = [];                   // array of stories initials
	var stories = [];                   // list of all stories
	var initialised = false;
  var containerHeight;
  var $p, $h1, $button
  function checkMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    
    return check;
  };
  var mobile = checkMobile();
  var animations = {
    //done: true,
    animateBubble: (el) => {
      if(el.movement) return;

      animations.stopMovement(el);
      el.animate = setInterval(() => {
        let x = randomBetween(el.position.x + config.background.image_bubbles._radius/2, el.position.x - config.background.image_bubbles._radius/2);
        let y = randomBetween(el.position.y + config.background.image_bubbles._radius/2, el.position.y - config.background.image_bubbles._radius/2);
        
        el.position.x = x;
        el.position.y = y;

        el.getCss();
      }, config.background.image_bubbles._interval);
    },
    makeElMove: (el) => {
      if(el.movement) return;

      el.speed = config.movement._smooth.max;
      el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
      el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));

      el.getCss();

      el.animate = setInterval(() => {
        el.position.x = randomBetween(el.position.x - (config.movement._smooth.radius/2), el.position.x + (config.movement._smooth.radius/2));
        el.position.y = randomBetween(el.position.y - (config.movement._smooth.radius/2), el.position.y + (config.movement._smooth.radius/2));

        if(el.position.y < config._el_height) {
          el.position.y = config._el_height;
        } else if(el.position > config._height - config._el_height) {
          el.position.y = config._height - config._el_height
        }

        el.getCss();
      }, el.speed);

      el.movement = true;
    },
    stopMovement: (el) => {
      clearInterval(el.animate);
      clearTimeout(el.timeout);
      
      el.getCss();
      el.movement = false;
    }
  }



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

  function isOverlapingX(value) {
    // offset top - height --- top + height
    if(value > $p.offset().left && value < $p.width() + $p.offset().left) return true;
    if(value > $h1.offset().left && value < $h1.width() + $h1.offset().left) return true;
    if(value > $button.offset().left && value < $button.width() + $button.offset().left) return true;
    return false;
  }

  function isOverlapingY(value) {
    var offset = ($('.controls').offset().top + $('.controls').height());

    if(value - config._el_height > $h1.offset().top - offset && value < $h1.offset().top - offset + $h1.height()) return true;
    if(value - config._el_height > $p.offset().top - offset && value < $p.offset().top - offset + $p.height()) return true;

    if(value - config._el_height > $button.offset().top - $p.height() && value < $button.offset().top - offset + $button.height()) return true;
    return false;
  }
  
  function findStory(id) {
    for(var i = 0; i < stories.length; i++) {
      if(stories[i].story_id == id) {
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
    
    if(!mobile) {
      stories = sortForSlider(stories);


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
    } else {
      let classCounter = 0;
      stories.forEach(function(item) {
        if(item.display) {
          if(classCounter % 2 != 0) {
            $(item.target).removeClass('left');
            $(item.target).addClass('right');
          } else {
            $(item.target).addClass('left');
            $(item.target).removeClass('right');
          }
          $(item.target).css('display', 'block');

          classCounter++;
        } else {
          $(item.target).css('display', 'none');
        }
      })
    }
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
              getXPosition: function(from, to, checkOverlap) {
                this.prevPosition = this.position.x;
                let x = randomBetween(from, to);

                if(checkOverlap) {
                  var counter = 0;
                  while(x < 40 && (x == 0 || isOverlapingX(x))) {
                    x = randomBetween(from, to);
                    counter++;
                  }
                }
                this.position.x = x;
              },
              getYPosition: function(from, to, checkOverlap) {
                let y = randomBetween(from, to);

                if(checkOverlap) {
                  let counter = 0;
                    while(counter < 40 && (y == 0 || isOverlapingY(y))) {
                    y = randomBetween(config._height - config._el_width,  config._el_width);
                    counter++;
                  } 
                }
                this.position.y = y;
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
                  animations.makeElMove(this);
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
 
                if(this.slide == 0 || this.slide == sliderSections.sections.length - 1) {

                }
                this.getXPosition((sliderSections.sections[this.slide].from - config._el_width), sliderSections.sections[this.slide].to + config._el_width, this.slide == 0 || this.slide == sliderSections.sections.length - 1);
                this.getYPosition(config._el_height - config._el_width, config._height - config._el_height, this.slide == 0 || this.slide == sliderSections.sections.length - 1);
                this.getCss();
              }
            };
            stories.push(newItem);
          })


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

  function createDOMStories () {
    stories.forEach((item, j) => {
      $('<div />', {
        'data-id': item.story_id,                           // set category id attribut
        'data-animated': false,
        'data-category': item.category_id,                  // set category attribut
        'class': 'item pulse-' + randomBetween(2,4) + ' ' + (j%2==0 ? 'left' : 'right'),        // select between two classes available for item
        'id': 'story' + item.story_id                       // item id --> connected with item.target in object
      })
      .mouseenter((e) => {                                   // __mouse hover event
        $(e.target).find('.label').css('display', 'block');
        setTimeout(() =>{ $(e.target).addClass('hovered');}, 50);

        let item = findStory($(e.target).data('id'));
        animations.stopMovement(item);
      })
      .mouseleave((e) => {                                   // __mouse leave event
        $(e.target).removeClass('hovered');
        setTimeout(() => {$(e.target).closest('.label').css('display', 'none'); }, 50);

        let $item = $(e.target).closest('.item');
        let item = findStory($item.data('id'));
        console.log(item)
        animations.makeElMove(item);
      })
      .click((e) => {                                        // __click event
        openModal("$(e.target).data('id')", $(e.target).data('id'));
      })
      .css({'backgroundImage': 'url(' + baseUrl + item.featured_image + ')', transition: 'none'})     // set some style
      .append($('<div/>', {                       // add label to elemen
        'class': 'label',
        'html': '<label>'+item.first_name+' '+item.last_name+'</label><small>'+item.category+'</small><button class="pop-story" data-id="'+item.story_id +'"/>'
      }))
      .appendTo($board);    // append element to board
    })

    getStoriesReady(null, null, true);
    getFilters();
  }

  let getFilters = () => {
    var $filters = $('.filter-wrapper');
    var filterMobile = $(window).width() <= 768;

    if(filterMobile) {
      $('.controls').insertBefore('.views-element-container');
    }
    console.log(filterMobile)

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
      'class': 'active cat-item'
    }).appendTo('.filter-wrapper').click((e) => {
      $('.cat-item').removeClass('active');
      $(e.target).addClass('active');

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
        $('.cat-item').removeClass('active');
        $(e.target).addClass('active');

        var filtered = [];
        stories.forEach(function(item) {
          if(item.category_id == $(e.target).data('category-id')) {
            filtered.push(item);
          }
        })

        if(filterMobile) {
          var slider = $( '.filter-wrapper' );
          slider[0].slick.slickGoTo(parseInt($(e.target).data('slick-index')));

          if($(e.target).data('slick-index') == 0) {
            $('.selected').text("A-Z");
          }
        } 
        getStoriesReady($(e.target).data('category-id'), null);
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
        $('.cat-item').removeClass('active');
        getStoriesReady(null, $(e.target).data('letter'));
        //
      })
    })

    if(filterMobile) {
      $('.filter-wrapper').slick({
          arrows: false,
          infinite: false,
          variableWidth: true
      }).on("afterChange", function (event, slick, currentSlide, nextSlide){
        getStoriesReady($('.slick-active').data('category-id'), null, true);
        $('.selected').text("A-Z");
      });
    }
  }

  function moveItems(value) {
    stories.forEach(function(el) {
      el.position.x = el.position.x + (el.scale == 1 ? value :( value/2));
      el.speed = Math.abs(value) > 100 ? Math.abs(value) + 100 : 100;
      if(el.movement)
          animations.stopMovement(el);
        el.getCss();
    })

    smallItems.forEach(function(el) {
      el.position.x = el.position.x + value/2;

      animations.stopMovement(el);
      if(el.position.x > config._width + 60) {
        el.position.x = -60;
        el.position.y = randomBetween(config._el_height, config._height);
        el.speed = 0;
        el.getCss();
      } else if(el.position.x < -60) {
        el.position.x = config._width + 60;
        el.position.y = randomBetween(config._el_height, config._height);
        el.speed = 0;
        el.getCss();
      }
      else {
        el.speed = Math.abs(value) > 100 ? Math.abs(value) + 100 : 100 ;
        el.getCss();
      }
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
       change: ( event, ui ) => {
        stories.forEach(function(story) {
          animations.makeElMove(story);
        })

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


  var smallItems = [];  // helper arr

  let makeAnimatedBackground = (w) => {
    var $body = $('.stories-api');
    
    $('<div/>', {         // create background animation base in html
      class: 'animated-background'
    }).appendTo($body);

    containerHeight = $('.animated-background').height();
    // create bubbles with background image
    config.background.image_bubbles._images.forEach((item, i) => {
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
          getPosition: function() {
            this.position.x = randomBetween(config._el_width, config._width - config._el_width); //Math.floor(Math.random() * (config._width - config._el_width));
            this.position.y = randomBetween(config._el_height, config._height); //Math.floor(Math.random() * (config._height - config._el_height));
          },
          getCss: function() {
            $(this.target).css({
              '-webkit-transform': "translate(" + this.position.x + "px, " + this.position.y + "px) scale(1)",
              '-moz-transform': "translate(" + this.position.x + "px, " + this.position.y + "px) scale(1)",
              '-ms-transform': "translate(" + this.position.x + "px, " + this.position.y + "px) scale(1)",
              '-o-transform': "translate(" + this.position.x + "px, " + this.position.y + "px) scale(1)",
              'transform': "translate(" + this.position.x + "px, " + this.position.y + "px) scale(1)",
              '-webkit-transition': 'all ' + this.speed + 'ms linear ',
              '-moz-transition': 'all ' + this.speed + 'ms linear ',
              '-o-transition': 'all ' + this.speed + 'ms linear ',
              'transition': 'all ' + this.speed + 'ms linear ',
              'opacity': 1
            })
          }
        });
    });

    smallItems.forEach((el) => {
      el.getPosition();
      el.getCss();
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


})(jQuery, Drupal);



