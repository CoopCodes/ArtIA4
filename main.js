
let scrollPercentage = 0;

function setScrollPercentage(value) {
  scrollPercentage = value;

  requestAnimationFrame(() => {
    // console.log('updating scroll position', scrollPercentage)

    $('main .paragraphs').css('transform', `translateY(-${scrollPercentage}%)`);
  })
}

gsap.registerPlugin(ScrollTrigger);

let audio;
let paused = false;

$(document).on('touchstart click', function() {
  if (audio != undefined) {
    return;
  }

  audio = new Audio('assets/Now I Let It Go.mp3');
  audio.loop = true;
  audio.volume = 0.3;
  audio.play();
});

function pause() {
  if (audio != undefined) {
    if (paused) {
      paused = false;
      audio.play();
      $('.pause').html('<img src="assets/Pause.svg" alt="">');
    } else {
      paused = true;
      audio.pause();
      $('.pause').html('<img src="assets/Play.svg" alt="">');
    }
  }
}

window.pause = pause;


$(document).ready(function() {

  // const firstParagraphRect = $('.paragraph:nth-child(1)')[0].getBoundingClientRect();
  const firstParagraph = $('.paragraph:nth-child(1)');

  // const top = firstParagraphRect.bottom;
  const top = (vh(100) - firstParagraph.offset().top + $(window).scrollTop()) - firstParagraph.height() - 50;

  console.log(top)

  $('.paragraphs').css('top', `${top}px`);  
  
  isFocused();

  // Add an svg filter for each paragraph
  
  let counter = 0;
  $('.paragraph').each(function() {
    let newSVG = $(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">`);
    $(this).prepend(newSVG);

    newSVG.load(`assets/paragraphFilter.svg`, function() {
      const feDisplacementMap = $($($(this).children()[0]).children('filter')[0])

      feDisplacementMap.attr('id', `paragraphFilter${counter}`);

      feDisplacementMap.css('scale', 6);
      
      // change the inline styles of $(this) to make "filter: url(#paragraphFilter{counter}"
      const paragraph = $(`.paragraph:nth-child(${counter+1})`);
      // paragraph.attr('data-index', counter)

      paragraph.css('filter', `url(#paragraphFilter${counter})`);   

      counter++;
    });
  });
})

// Run function on scroll
$(window).on('scroll', function() {      
  isFocused();
  let winScrollNum = $(this).scrollTop();
  let winHeight = $('body').height() - $(this).height();
  let percentage = winScrollNum / winHeight;
  setScrollPercentage(percentage * 100)
})

function isFocused() {
  $('main .paragraphs').children().each(function () {
    let child = $(this);
    let childRect = child[0].getBoundingClientRect();
    
    // check if childRect intersects wit han imaginar yline a vh(70)
    // childRect.bottom < vh(100) && childRect.top > vh(50)
    if (childRect.top <= vh(80) && childRect.top + childRect.height > vh(80)) {
      updateDataAttribute(child, 'data-focus', 'true');
    } else {
      updateDataAttribute(child, 'data-focus', 'false');
    }
  })
}

$(window).on('scrollend', () => {
  // isFocused();

  // Get the focused paragraph
  let focused = $('main .paragraphs').children('[data-focus="true"]')[0];
  // let isAligned = false;
  
  const alignAxis = vh(100) - 50


  // const interval = setInterval(() => {
  //   let focusedRect = focused.getBoundingClientRect();

  //   if (Math.round(focusedRect.bottom) <= alignAxis + 5 && Math.round(focusedRect.bottom) >= alignAxis - 5) {
  //     clearInterval(interval);
  //     console.log("ALIGNED!")
  //   } else if (focusedRect.bottom < alignAxis && focusedRect.bottom !== alignAxis) { // Above the line
  //     // setScrollPercentage(scrollPercentage + 0.1)
  //     // Change scrollTop of window instead
  //     $(window).scrollTop($(window).scrollTop() + 1);
  //   }
  //   else if (focusedRect.bottom > alignAxis && focusedRect.bottom !== alignAxis) { // Below the line
  //     // setScrollPercentage(scrollPercentage - 0.1);
  //     $(window).scrollTop($(window).scrollTop() - 1);
  //   }
  //   console.log(focusedRect.bottom, alignAxis)
    
  // }, 10)
})

$(window).on('resize', isFocused)

// Function to update data attribute and trigger event
function updateDataAttribute(element, attrName, value) {
  element.attr(attrName, value).trigger('dataAttrChanged', [attrName, value]);
}

// Listen for the custom event
$('.paragraph').on('dataAttrChanged', function(event, attrName, value) {
  const index = $(this)[0].dataset.index;
  const paragraph = $(`#paragraphFilter${index} feDisplacementMap`);

  const hidden = 20;
  const visible = 2.5;

  if (value == 'true' && paragraph.attr('scale') == hidden.toString()) {
    console.log("TRUE", paragraph.attr('scale'))
    paragraph.css('scale', paragraph.attr('scale')).animate({
      scale: visible
    }, {
      duration: 1000,
      step: function(now, fx) {
        $(fx.elem).attr('scale', now);
      },
    });
  } 
  else if (value == 'false' && paragraph.attr('scale') == visible.toString()) {
    console.log("FALSE")
    
    paragraph.css('scale', paragraph.attr('scale')).animate({
      scale: hidden
    }, {
      duration: 1000,
      step: function(now, fx) {
        $(fx.elem).attr('scale', now);
      }
    })
    // paragraph.attr('scale', visible).animate({
    //   scale: hidden
    // }, {
    //   duration: 1000,
    //   step: function(now, fx) {
    //     $(fx.elem).attr('scale', now);
    //   }
    // })
  }
});

// const paragraphs = $('.paragraph');

// const observer = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     if (mutation.type === 'attributes' && 
//         (mutation.attributeName === 'style' || 
//          mutation.attributeName === 'data-focus' || 
//          mutation.attributeName === 'data-test')) {
//       checkOpacity($(mutation.target));
//       console.log('test')
//     }
//   });
// });

// paragraphs.each(function() {
//   observer.observe(this, { attributes: true });
// });

function checkOpacity($element) {
  const opacity = $element.css('opacity');
  if (opacity === '0.9') {
    console.log('Opacity changed to 0.9 for:', $element[0]);
    // Add your custom logic here
  }
}

// Function ON scroll, should run once when the scroll starts
var scrolled = false;

$(window).on('scroll', function() {
  if (!scrolled) {
      scrolled = true;
      // Your code to run once when scroll begins
      console.log("Scroll event triggered!");

      // $("#paragraph > feDisplacementMap").attr('scale', 2.5).animate({
      //   scale: 10
      // }, {
      //   duration: 1000, // 1 second
      //   step: function(now, fx) {
      //     $(fx.elem).attr('scale', now);
      //   }
      // })
      

      // Optional: Reset the flag after a delay if you want to allow the event to trigger again
      setTimeout(function() {
        scrolled = false;
      }, 2000); // Reset after 5 seconds
  }
});



export function vh(value) {
  var viewportHeight = window.innerHeight;
  return Math.round(value / 100 * viewportHeight);
}