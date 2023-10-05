import createStagger from './stagger';
import { verticalElasticsInit, horizontalElasticsInit } from './elastic';
import circadian from './circadian';


// change image and logo on dark mode
var myriadlistaImage = document.getElementById("myriadlista-img");
var darkMyriadlistaImageSrc = "myriadlista-dark.png";
var lightMyriadlistaImageSrc = "myriadlista-light.png";

function refreshTheme(image) {
  myriadlistaImage.src = image;
}


let isDarkMode;

function applyTheme() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    refreshTheme(darkMyriadlistaImageSrc);
    isDarkMode = true;
  } else {
    document.documentElement.classList.remove('dark');
    refreshTheme(lightMyriadlistaImageSrc);
    isDarkMode = false;
  }
}


function switchTheme(event, setMode) {
  const currentTheme = localStorage.getItem('theme');

  localStorage.setItem('theme', setMode);

  if (event === 'click') {
    if (setMode !== currentTheme) {
      const setIconClass = document.getElementById("theme-icon");
      // append class 'day' to line
      if (setMode === 'dark') {
        setIconClass.classList.remove("day");
      } else {
        setIconClass.classList.add("day");
      }
      // Re-apply theme on switch
      applyTheme();
    }
  } else {
    // Re-apply theme on page load
    applyTheme();
  }
}

const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
if (isDay) {
  switchTheme('load', 'light');
} else {
  switchTheme('load', 'dark');
}


// trailer
function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

const trailer = document.getElementById("trailer");

const usingMouse = !isTouchDevice();

if (usingMouse) {

  trailer.style.display = "grid";

  const animateTrailer = (e, interacting) => {
    const x = e.clientX - trailer.offsetWidth / 2, y = e.clientY - trailer.offsetHeight / 2;
    const keyframes = {
      transform: `translate(${x}px, ${y}px) scale(${interacting ? 4 : 1})`
    }
    trailer.animate(keyframes, { 
      duration: 800, 
      fill: "forwards" 
    });
  }

  const getTrailerClass = (type) => {
    switch(type) {
      case "link":
        return "fa-arrow-up-right-from-square";
      default:
        return "fa-hand-pointer";
    }
  }

  window.onmousemove = e => {
    const interactable = e.target.closest(".interactable"), interacting = interactable !== null;
    const cursorSvg = document.getElementById("trailer-icon");
    
    animateTrailer(e, interacting);
    trailer.dataset.type = interacting ? interactable.dataset.type : "";

    if(interacting) {
      if (trailer.dataset.type === "link") {
        cursorSvg.classList.replace("fa-hand-pointer", getTrailerClass(interactable.dataset.type));
      } else {
        cursorSvg.classList.replace("fa-arrow-up-right-from-square", getTrailerClass(interactable.dataset.type));
      }
    }
  }
  
}



// stagger content
// about headline
const aboutHTML = `
  <div class="px-1 lg:px-2 text-5xl lg:text-7xl text-dark dark:text-light font-mono font-medium">
    about
  </div>
`;
createStagger({
  gridOptions: [7, 23],
  contentId: 'about',
  contentHTML: aboutHTML,
});

// experience headline
const experienceHTML = `
  <div class="px-1 lg:px-2 text-5xl lg:text-7xl text-dark dark:text-light font-mono font-medium">
    experience
  </div>
`;
createStagger({
  gridOptions: [5, 29],
  contentId: 'experience',
  contentHTML: experienceHTML,
});

// projects headline
const projectsHTML = `
  <div class="px-1 lg:px-2 text-5xl lg:text-7xl text-dark dark:text-light font-mono font-medium">
    projects
  </div>
`;
createStagger({
  gridOptions: [7, 32],
  contentId: 'projects',
  contentHTML: projectsHTML,
});



// elastic
verticalElasticsInit({ isDarkMode });
horizontalElasticsInit({ isDarkMode });



// portfolio image scroll
function scrollContainer(containerId) {
  var container = document.getElementById(containerId);
  var speed = 1; // adjust this value to change the scrolling speed
  var currentPosition = 0;
  var scrollDirection = 1; // 1 for scrolling down, -1 for scrolling up

  function scrollImage() {
    var image = container.querySelector("img");
    var containerRect = container.getBoundingClientRect();
    if (
      containerRect.top >= 0 &&
      containerRect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
      // container div is currently visible on the page
      currentPosition += speed * scrollDirection;
      if (currentPosition > image.height - container.clientHeight) {
        scrollDirection = -1;
        currentPosition = image.height - container.clientHeight;
      } else if (currentPosition < 0) {
        scrollDirection = 1;
        currentPosition = 0;
      }
      image.style.top = -currentPosition + "px";
    }
    requestAnimationFrame(scrollImage);
  }

  requestAnimationFrame(scrollImage);
}

// call the function
scrollContainer("myriadlista");
scrollContainer("athena");
scrollContainer("urbandimensions");
scrollContainer("extrapaints");



// circadian theme switch
circadian({ switchTheme });
