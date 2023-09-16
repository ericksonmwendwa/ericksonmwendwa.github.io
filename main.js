// // Implement theme mode
const themeSwitcher = document.getElementById("theme-switcher");

// change image and logo on dark mode
var myriadlistaImage = document.getElementById("myriadlista-img");
var darkMyriadlistaImageSrc = "myriadlista-dark.png";
var lightMyriadlistaImageSrc = "myriadlista-light.png";

var athenaLogo = document.getElementById("athena-logo");
var lightAthenaLogoSrc = "athena-logo_light.svg";
var darkAthenaLogoSrc = "athena-logo_dark.svg";

function refreshTheme(svg, image, logo) {
  myriadlistaImage.src = image;
  athenaLogo.src = logo;
}

function applyTheme() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    refreshTheme(darkMyriadlistaImageSrc, darkAthenaLogoSrc);
  } else {
    document.documentElement.classList.remove('dark');
    refreshTheme(lightMyriadlistaImageSrc, lightAthenaLogoSrc);
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



// navbar
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


// experience
const myriadlista_skills = ['Firebase', 'Flutter', 'ReactJS', 'NodeJS', 'TailwindCSS', 'Redux Toolkit', 'Figma'];
const urban_skills = ['HTML', 'TailwindCSS', 'JavaScript', 'Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign'];
const zebra_skills = ['Adobe Illustrator', 'Adobe Photoshop'];
const freelance_skills = ['HTML', 'TailwindCSS', 'JavaScript'];

function displaySkills(containerId, skillsArray) {
  const skillsContainer = document.getElementById(containerId);

  skillsArray.forEach((skill) => {
      const skillBadge = document.createElement("span");
      skillBadge.textContent = skill;
      skillBadge.className = "skill-badge";
      skillsContainer.appendChild(skillBadge);
  });
}

// Call the function to display skills for each group
displaySkills("myriadlista-skills-container", myriadlista_skills);
displaySkills("urban-skills-container", urban_skills);
displaySkills("zebra-skills-container", zebra_skills);
displaySkills("freelance-skills-container", freelance_skills);


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

  const hours = document.getElementById("hours");
  for (let i = 0; i < 24; i++) {
    const hour = document.createElement("div");
    hour.classList.add("hour");
    hour.setAttribute("role", "button");
    hour.setAttribute("tabindex", "-1");
    
    const lineContainer = document.createElement("div");
    lineContainer.classList.add("line-container");
    // add data attribute to line container for night mode
    lineContainer.setAttribute("data-theme", "dark");
    lineContainer.setAttribute("data-type", "theme");
    
    const line = document.createElement("div");
    line.classList.add("line");
    if (i > 6 && i < 18) {
      line.classList.add("day");
      lineContainer.setAttribute("data-theme", "light");
    }
    
    hour.id = `hour-${i}`;
    lineContainer.id = `line-container-${i}`;
    line.id = `line-${i}`;
    
    lineContainer.appendChild(line);
    hour.appendChild(lineContainer);
    hours.appendChild(hour);
  }


  let currentLine;

  function createIcon(currentDiv) {
    const icon = document.createElement("div");
    icon.id = "theme-icon";
    icon.classList.add("theme-icon");
    currentDiv.appendChild(icon);
  }

  function removeIcon() {
    const currentIcon = document.getElementById("theme-icon");
    currentIcon.remove();
  }

  const setCurrentLine = (hour) => {
    currentLine = document.getElementById(`line-${hour}`);
    const currentHour = document.getElementById(`hour-${hour}`);
    currentLine.classList.add("active");
    createIcon(currentHour);
  }

  // set default current line
  const setDefaultCurrentLine = () => {
    const thisHour = new Date().getHours();
    setCurrentLine(thisHour);
  };

  // Call setDefaultCurrentLine initially to set the default current line
  setDefaultCurrentLine();

  const setCurrentLineOnClick = (hour, oldLine) => {
    const newCurrentLine = document.getElementById(`line-${hour}`);
    if (currentLine !== newCurrentLine) {
      oldLine.classList.remove("active");
      removeIcon();
      currentLine = newCurrentLine;
      setCurrentLine(hour);
    }
  };


  const lineContainer = document.getElementsByClassName("line-container");
  const lines = document.getElementsByClassName("line");

  for (let i = 0; i < lines.length; i++) {
    
    lineContainer[i].addEventListener("click", function () {
      const theme = lineContainer[i].getAttribute("data-theme");
      setCurrentLineOnClick(i, currentLine);
      switchTheme('click', theme);
    });

    lineContainer[i].addEventListener("mouseenter", function () {
      // Remove "hover" class from all line-container elements
      for (let j = 0; j < lineContainer.length; j++) {
        lines[j].classList.remove("hover");
      }
  
      if (i > 0) {
        lines[i - 1].classList.add("hover"); // Add to the previous element
      }
      if (i < lines.length - 1) {
        lines[i + 1].classList.add("hover"); // Add to the next element
      }
    });
  
    // Add a mouseleave event listener to remove the "hover" class when mouse leaves
    lineContainer[i].addEventListener("mouseleave", function () {
      if (i > 0) {
        lines[i - 1].classList.remove("hover");
      }
      if (i < lines.length - 1) {
        lines[i + 1].classList.remove("hover");
      }
    });

  }


});

