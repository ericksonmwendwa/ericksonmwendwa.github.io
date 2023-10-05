function circadian({ switchTheme }) {
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
}

export default circadian;
