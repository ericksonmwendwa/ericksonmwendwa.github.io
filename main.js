// // Implement theme mode
const themeSwitcher = document.getElementById("theme-switcher");

// change image and logo on dark mode
var myriadlistaImage = document.getElementById("myriadlista-img");
var darkMyriadlistaImageSrc = "myriadlista-dark.png";
var lightMyriadlistaImageSrc = "myriadlista-light.png";

var athenaLogo = document.getElementById("athena-logo");
var lightAthenaLogoSrc = "athena-logo_light.svg";
var darkAthenaLogoSrc = "athena-logo_dark.svg";

var heroSvg = document.getElementById("hero-svg");
var lightHeroSvg = "hero-light.svg";
var darkHeroSvg = "hero-dark.svg";

function refreshTheme(svg, image, logo) {
  heroSvg.src = svg;
  myriadlistaImage.src = image;
  athenaLogo.src = logo;
}

function applyTheme() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    refreshTheme(darkHeroSvg, darkMyriadlistaImageSrc, darkAthenaLogoSrc);
  } else {
    document.documentElement.classList.remove('dark');
    refreshTheme(lightHeroSvg, lightMyriadlistaImageSrc, lightAthenaLogoSrc);
  }
}


function switchTheme(event, setMode) {
  const currentTheme = localStorage.getItem('theme');
  console.log("currentTheme", currentTheme);
  console.log("setMode", setMode);

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
    console.log('setting theme on load');
    // Re-apply theme on page load
    applyTheme();
  }
}

const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
console.log("isDay", isDay);
if (isDay) {
  switchTheme('load', 'light');
} else {
  switchTheme('load', 'dark');
}


// navbar
// check for click in classlist, get the id of the clicked element and scroll to the element
const navbar = document.getElementById("navbar");
const offset = 105;
navbar.addEventListener("click", function (e) {
  if (e.target.classList.contains("nav-link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    const targetElement = document.querySelector(id);
    if (targetElement) {
      const offsetPosition = targetElement.offsetTop - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }
});


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
document.addEventListener("DOMContentLoaded", function () {

  const circadian = document.getElementById("circadian");
  for (let i = 0; i < 24; i++) {
    const lineContainer = document.createElement("div");
    lineContainer.classList.add("line-container", "w-fit", "lg:w-full", "px-1", "lg:px-3", "xl:px-6");
    // add data attribute to line container for night mode
    lineContainer.setAttribute("data-theme", "dark");
    const line = document.createElement("div");
    line.classList.add("line");
    if (i > 6 && i < 18) {
      line.classList.add("day");
      lineContainer.setAttribute("data-theme", "light");
    }
    line.id = `line-${i}`;
    lineContainer.appendChild(line);
    circadian.appendChild(lineContainer);
  }


  const increaseHeight = (element, amount) => {
    const initialHeight = parseInt(element.style.height, 10) || 20;
    element.style.height = `${initialHeight + amount}px`;
  };

  const decreaseHeight = (element, amount) => {
    const initialHeight = parseInt(element.style.height, 10) || 20;
    element.style.height = `${initialHeight - amount}px`;
  };

  let currentLine;

  const setCurrentLine = (line) => {
    increaseHeight(line, 16);
    line.style.bottom = "16px";

    // Add an icon on top of the line
    const icon = document.createElement("div");
    icon.id = "theme-icon";
    icon.classList.add("theme-icon", "bg-white", "rounded-full", "absolute", "bottom-0", "left-1/2", "transform", "-translate-x-1/2", "translate-y-1/2");
    line.appendChild(icon);
  }

  const setCurrentLineOnClick = (lineIndex) => {
    const newCurrentLine = document.getElementById(`line-${lineIndex}`);
    if (currentLine !== newCurrentLine) {

      currentLine.removeChild(currentLine.lastChild);
      decreaseHeight(currentLine, 16);
      currentLine.style.bottom = "0px";
      
      currentLine = newCurrentLine;

      setCurrentLine(currentLine);
    }
  };

  // set default current line
  const setDefaultCurrentLine = () => {
    const currentHour = new Date().getHours();
    const defaultCurrentLine = document.getElementById(`line-${currentHour}`);
    currentLine = defaultCurrentLine;
    setCurrentLine(currentLine);
  };

  // Call setDefaultCurrentLine initially to set the default current line
  setDefaultCurrentLine();


  const lineContainer = document.getElementsByClassName("line-container");
  const lines = document.getElementsByClassName("line");

  for (let i = 0; i < lines.length; i++) {

    // check for click event
    lineContainer[i].addEventListener("click", function () {
      // get the data-theme attribute
      const theme = lineContainer[i].getAttribute("data-theme");
      // set as current line
      setCurrentLineOnClick(i);
      // switch theme
      switchTheme('click', theme);
    });


    lineContainer[i].addEventListener("mouseenter", function () {
      // Enlarge the hovered line by 7px at the top
      increaseHeight(lines[i], 32);

      // Enlarge the immediate left line by 4px at the top
      if (i > 0) {
        increaseHeight(lines[i - 1], 16);
      }

      // Enlarge the immediate right line by 4px at the top
      if (i < lines.length - 1) {
        increaseHeight(lines[i + 1], 16);
      }
    });

    lineContainer[i].addEventListener("mouseleave", function () {
      // Reset the height of the hovered line and the immediate left and right lines
      decreaseHeight(lines[i], 32);

      // Reset the immediate left line
      if (i > 0) {
        decreaseHeight(lines[i - 1], 16);
      }

      // Reset the immediate right line
      if (i < lines.length - 1) {
        decreaseHeight(lines[i + 1], 16);
      }
    });

  }

});

