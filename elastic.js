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
function verticalElasticsInit({ isDarkMode }) {
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


function horizontalElasticsInit({ isDarkMode }) {
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


export { verticalElasticsInit, horizontalElasticsInit }
