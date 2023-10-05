function createStagger({ gridOptions, contentId, contentHTML }) {

  var grid = gridOptions,
  tl = gsap.timeline({
    onComplete: function() {
      const getContent = document.getElementById(`content-${contentId}`);
      const getShadow = document.getElementById(`staggered-shadow-${contentId}`);
      getContent.style.opacity = 1;
      getShadow.classList.add("staggered-shadow");
    }
  });

  var observer;

  // Define a function 'animateBoxes' to animate elements with a stagger effect.
  function animateBoxes(from, axis, ease) {
    // Use a stagger call to animate elements with the class "box" using GSAP.
    tl.from(`.box-${contentId}`, {
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
    className: `box box-${contentId}`,
    gutter: -1,
    parent: `#staggered-${contentId}`
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
      <div id="content-${contentId}" style="opacity: 0; transition: opacity 300ms ease-in-out;">
        ${contentHTML}
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
      } else {
        const getContent = document.getElementById(`content-${contentId}`);
        const getShadow = document.getElementById(`staggered-shadow-${contentId}`);
        getContent.style.opacity = 0;
        getShadow.classList.remove("staggered-shadow");
      }
    });
  }, { threshold: 0.5 }); // Adjust the threshold as needed

  // Observe all elements with the class "box"
  document.querySelectorAll(".box").forEach(box => {
    observer.observe(box);
  });
  
}


export default createStagger;
