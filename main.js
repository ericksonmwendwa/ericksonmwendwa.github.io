// // Implement theme mode
const themeSwitcherMain = document.getElementById("theme-switcher-main");
const themeSwitcherMobile = document.getElementById("theme-switcher-mobile");

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
    themeSwitcherMain.checked = true;
    themeSwitcherMobile.checked = true;
    refreshTheme(darkHeroSvg, darkMyriadlistaImageSrc, darkAthenaLogoSrc);
  } else {
    document.documentElement.classList.remove('dark');
    themeSwitcherMain.checked = false;
    themeSwitcherMobile.checked = false;
    refreshTheme(lightHeroSvg, lightMyriadlistaImageSrc, lightAthenaLogoSrc);
  }
}

// Apply the theme on page load
applyTheme();

// Theme switcher event listener
if (themeSwitcherMain) {
  themeSwitcherMain.addEventListener("click", function () {
    switchTheme();
  });
}
if (themeSwitcherMobile) {
  themeSwitcherMobile.addEventListener("click", function () {
    switchTheme();
  });
}

function switchTheme() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
  // Re-apply theme on switch
  applyTheme();
}

// sticky navbar
const navbar = document.getElementById('navbar');
if (navbar) {
  let lastScrollPosition = window.pageYOffset;

  window.addEventListener('scroll', function() {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition < lastScrollPosition) {
      // User is scrolling up
      navbar.classList.remove('relative');
      navbar.classList.add('sticky');
    } else {
      // User is scrolling down
      navbar.classList.remove('sticky');
      navbar.classList.add('relative');
    }

    lastScrollPosition = currentScrollPosition;
  });
}


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
