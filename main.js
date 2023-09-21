// // Implement theme mode
const themeSwitcher = document.getElementById("theme-switcher");

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
    // applyTheme();
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







// GSAP 3 introduces advanced stagger values
// Create an array 'grid' to define the number of rows and columns for a grid.
// Initialize a GSAP timeline 'tl' that repeats infinitely with a delay between each repetition.
var grid = [7, 23], //[rows, columns]
    tl = gsap.timeline({
      onComplete: function() {
        const content = document.getElementById("content");
        content.style.opacity = 1;
        const shadow = document.getElementById("staggered-shadow");
        shadow.classList.add("staggered-shadow");
      }
    });

var observer;

// Define a function 'animateBoxes' to animate elements with a stagger effect.
function animateBoxes(from, axis, ease) {
  // Use a stagger call to animate elements with the class "box" using GSAP.
  tl.from(".box", {
    duration: 0.3,
    scale: 0.1,
    y: 60,
    yoyo: true,
    ease: "power1.inOut",
    stagger: {
      amount: 1.5,
      grid: grid,
      axis: axis,
      ease: ease,
      from: from
    }
  });
}

// Build a grid of <div class="box"> elements (unrelated to animation code).
buildGrid({
  grid: grid,
  className: "box",
  gutter: -1,
  parent: "#staggered"
});

// Start the animation by calling 'animateBoxes' with "center" as the 'from' parameter.
animateBoxes("random");

// Define a function 'onCellClick' to handle click events on grid cells.
function onCellClick(e) {
  // Update some state or perform actions when a grid cell is clicked.
  updateFrom(e.target.index);
  updateAnimation();
}



// Modify the buildGrid function to place a content div on top of the grid
function buildGrid(vars) {
  vars = vars || {};
  var staggered = document.createElement("div"),
    rows = vars.grid[0] || 5,
    cols = vars.grid[1] || 5,
    parent = typeof vars.parent === "string" ? document.querySelector(vars.parent) : vars.parent ? vars.parent : document.body,
    gutter = vars.gutter || 1,
    parentWidth = parent.clientWidth,
    w = (parentWidth - cols * gutter) / cols,
    className = vars.className || "",
    css = "display: inline-block; margin: 0 " + (gutter / parentWidth * 100) + "% " + (gutter / parentWidth * 100) + "% 0; width: " + (w / parentWidth * 100) + "%;",
    l = rows * cols,
    i, box;

  // Create a content div with "Hello World" text and position it on top of the grid
  var content = document.createElement("div");
  content.innerHTML = `
    <div id="content" style="opacity: 0; transition: opacity 300ms ease-in-out;">
      <div class="px-1 lg:px-2 text-5xl lg:text-7xl text-dark dark:text-light font-mono font-medium">
        about
      </div>
    </div>`
  ;
  content.classList.add("content");
  staggered.appendChild(content);
  

  // Create grid elements and add event listeners if provided.
  for (i = 0; i < l; i++) {
    box = document.createElement("div");
    box.style.cssText = css;
    box.setAttribute("class", className);
    box.index = i;
    box.setAttribute("data-index", i);
    
    if (vars.onCellClick) {
      box.addEventListener("click", vars.onCellClick);
    }
    staggered.appendChild(box);
  }

  // Apply styles to the grid container.
  staggered.style.cssText = "position: relative; width:100%; line-height: 0; padding:" + gutter + "px 0 0 " + gutter + "px; display:inline-block;";
  parent.appendChild(staggered);

  return staggered;
}




// Adjust the rotation and force 3D rendering to avoid pixel snapping in some browsers.
gsap.set(".box", { rotation: 0.5, force3D: true });

// Create an Intersection Observer to monitor when elements are in the viewport
observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // When an element is in view, restart the animation
      tl.restart();
    }
  });
}, { threshold: 0.5 }); // Adjust the threshold as needed

// Observe all elements with the class "box"
document.querySelectorAll(".box").forEach(box => {
  observer.observe(box);
});










// elastic
// Create a class called RAFClass
class RAFClass {
  constructor() {
    // Initialize instance variables and bind methods
    this.bind()
    this.callbacks = [] // Array to store callback functions
    this.dt = 0.15 // Time difference for animation frame
    this.lastF = Date.now() // Last frame timestamp
    this.render() // Start rendering loop
  }

  // Subscribe a callback function to be called on each animation frame
  subscribe(name, callback) {
    this.callbacks.push({
      name: name,
      callback: callback
    })
  }

  // Unsubscribe a callback function by name
  unsubscribe(name) {
    this.callbacks.forEach((item, i) => {
      if (item.name == name) this.callbacks.splice(i, i + 1)
    });
  }

  // Render method for animation loop
  render() {
    requestAnimationFrame(this.render) // Request next animation frame
    this.callbacks.forEach(item => {
      item.callback() // Call subscribed callback functions
    });

    this.dt = Date.now() - this.lastF // Calculate time difference
    this.lastF = Date.now() // Update last frame timestamp
  }

  // Bind methods to the current instance
  bind() {
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
    this.render = this.render.bind(this)
  }
}

// Create an instance of the RAFClass
const RAF = new RAFClass();

// Initialize a variable for transitioning
let transitioning = !1; // Likely to be a boolean flag

// Function for initializing elastic elements
function verticalElasticsInit() {
  
  let n = document.querySelectorAll(".elasticbox-vertical"), // Select elements with the class "elasticbox"
      o = [], // Array to store data for each element
      e = { x: 0, y: 0 }; // Mouse position object

  // Function to handle mouseenter event on an element
  function t(n) {
    o.forEach((o) => {
      o.container.classList == n.target.classList && ((o.mouseIn = !0), null != o.anim && o.anim.kill());
    });
  }

  // Function to handle mouseleave event on an element
  function a(n) {
    o.forEach((o, e) => {
      if (o.container.classList == n.target.classList) {
        if (((o.mouseIn = !1), (o.anim = TweenLite.to(o.handlePos, 1, { x: o.handleInitPos.x, y: o.handleInitPos.y, ease: Elastic.easeOut.config(1, 0.3) })), transitioning)) return;
      }
    });
  }

  // Function to handle mousemove event on an element
  function i(n) {
    let o = n.target.getBoundingClientRect();
    (e.x = n.clientX - o.left), (e.y = n.clientY - o.top);
  }

  // Iterate through each element with class "elasticbox"
  n.forEach((n, e) => {
    let s = document.createElement("canvas"),
        l = s.getContext("2d"),
        c = (l.canvas.width = n.offsetWidth),
        r = (l.canvas.height = n.offsetHeight);
    n.classList.add("boxid_" + e),
      n.appendChild(s),
      o.push({ ctx: l, canvas: s, container: n, mouseIn: !1, handlePos: { x: c / 2, y: r / 2 }, handleInitPos: { x: c / 2, y: r / 2 }, anim: null }),
      window.isMobile || (n.addEventListener("mouseenter", t), n.addEventListener("mouseleave", a), n.addEventListener("mousemove", i));
  }),

  // Function to handle window resize event
  window.addEventListener("resize", function () {
    o.forEach((o, e) => {
      (o.ctx.canvas.width = n[e].offsetWidth), (o.ctx.canvas.height = n[e].offsetHeight);
    });
  }),

  // Subscribe the rendering function to the RAFClass
  RAF.subscribe("elasticsRAF", function () {
    o.forEach((o, t) => {
      let a = (o.ctx.canvas.width = n[t].offsetWidth),
          i = (o.ctx.canvas.height = n[t].offsetHeight);
      
      o.mouseIn && (
        (o.handlePos.x += 0.5 * (e.x - o.handlePos.x)),
        (o.handlePos.y += 0.5 * (e.y - o.handlePos.y))
      ),

      o.ctx.clearRect(0, 0, a, i),
      o.ctx.beginPath(),
      o.ctx.moveTo(a / 2, 0),
      o.ctx.lineWidth = 4;
      o.ctx.strokeStyle = isDarkMode ? "#F5F2EB" : "#04454D";
      o.ctx.quadraticCurveTo(o.handlePos.x, o.handlePos.y, a / 2, i),
      o.ctx.stroke(),
      o.ctx.closePath();

    });
  });

}


function horizontalElasticsInit() {
  let elements = document.querySelectorAll(".elasticbox-horizontal"); // Select elements with the class "elasticbox-horizontal"
  let data = []; // Array to store data for each element
  let mousePosition = { x: 0, y: 0 }; // Mouse position object

  // Function to handle mouseenter event on an element
  function onMouseEnter(event) {
    data.forEach((item) => {
      if (item.container.classList == event.target.classList) {
        item.mouseIn = true;
        if (item.anim !== null) {
          item.anim.kill();
        }
      }
    });
  }

  // Function to handle mouseleave event on an element
  function onMouseLeave(event) {
    data.forEach((item) => {
      if (item.container.classList == event.target.classList) {
        item.mouseIn = false;
        item.anim = TweenLite.to(item.handlePos, 1, {
          x: item.handleInitPos.x,
          y: item.handleInitPos.y,
          ease: Elastic.easeOut.config(1, 0.3),
        });
        if (transitioning) return;
      }
    });
  }

  // Function to handle mousemove event on an element
  function onMouseMove(event) {
    let rect = event.target.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
  }

  // Iterate through each element with class "elasticbox-horizontal"
  elements.forEach((element, index) => {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let canvasWidth = (context.canvas.width = element.offsetWidth);
    let canvasHeight = (context.canvas.height = element.offsetHeight);
    element.classList.add("boxid_" + index);
    element.appendChild(canvas);
    data.push({
      ctx: context,
      canvas: canvas,
      container: element,
      mouseIn: false,
      handlePos: { x: canvasWidth / 2, y: canvasHeight / 2 },
      handleInitPos: { x: canvasWidth / 2, y: canvasHeight / 2 },
      anim: null,
    });
    if (!window.isMobile) {
      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mouseleave", onMouseLeave);
      element.addEventListener("mousemove", onMouseMove);
    }
  });

  // Function to handle window resize event
  window.addEventListener("resize", function () {
    data.forEach((item, index) => {
      item.ctx.canvas.width = elements[index].offsetWidth;
      item.ctx.canvas.height = elements[index].offsetHeight;
    });
  });

  // Subscribe the rendering function to the RAFClass
  RAF.subscribe("elasticsRAF", function () {
    data.forEach((item, index) => {
      let canvasWidth = (item.ctx.canvas.width = elements[index].offsetWidth);
      let canvasHeight = (item.ctx.canvas.height = elements[index].offsetHeight);

      if (item.mouseIn) {
        item.handlePos.x += 0.5 * (mousePosition.x - item.handlePos.x);
        item.handlePos.y += 0.5 * (mousePosition.y - item.handlePos.y);
      }

      item.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      item.ctx.beginPath();
      item.ctx.moveTo(0, canvasHeight / 2);
      item.ctx.lineWidth = 4;
      item.ctx.strokeStyle = isDarkMode ? "#F5F2EB" : "#04454D";
      item.ctx.quadraticCurveTo(
        item.handlePos.x,
        item.handlePos.y,
        canvasWidth,
        canvasHeight / 2
      );
      item.ctx.stroke();
      item.ctx.closePath();
    });
  });
}


// Call the elasticsInit function to initialize elastic elements
verticalElasticsInit();
horizontalElasticsInit();



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

