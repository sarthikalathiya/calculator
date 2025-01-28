import { Calculator } from "./js/Calculator.js";

/**
 * Main application initialization function.
 * Sets up event listeners, theme handling, and calculator functionality.
 */
function initializeApp() {
  // Handles theme switching between light and dark modes
  function setTheme(isDarkMode) {
    const icon = document.querySelector(".theme-toggle i");
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      document.body.classList.remove("dark-mode");
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
    localStorage.setItem("isDarkMode", isDarkMode);
  }

  // Get theme preference
  const savedTheme = localStorage.getItem("isDarkMode");
  if (savedTheme !== null) {
    setTheme(savedTheme === "true");
  }

  // Show UI
  document.body.classList.remove("loading");
  document.body.classList.add("loaded");

  const calculator = new Calculator(document.getElementById("calcInput"));

  // Angle mode toggle (Degrees/Radians)
  const angleModeElement = document.getElementById("angleMode");
  angleModeElement.addEventListener("click", function () {
    calculator.isDegreeMode = !calculator.isDegreeMode;
    this.textContent = calculator.isDegreeMode ? "DEG" : "RAD";
  });

  // Global button click handler for numbers and operations
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const number = button.getAttribute("data-numbers");
      const operation = button.getAttribute("data-operation");

      if (number !== null) {
        calculator.appendNumber(number);
      } else if (operation !== null) {
        calculator.handleOperation(operation);
      }

      // to prevent the button from staying focused after click
      button.blur();
    });
  });

  // Theme toggle handler
  document.querySelector(".theme-toggle").addEventListener("click", function () {
    const isDarkMode = !document.body.classList.contains("dark-mode");
    setTheme(isDarkMode);
  });

  // Trigonometry dropdown toggle handler
  document.getElementById("trigToggle").addEventListener("click", function () {
    document.getElementById("trigDropdown").classList.toggle("show");
    document
      .querySelector("#trigToggle .fa-chevron-down")
      .classList.toggle("rotate-arrow");
  });

  // History panel show handler
  document.querySelector('.history-toggle').addEventListener('click', function (e) {
    const historyPanel = document.querySelector('.history-panel');
    historyPanel.classList.add('show');
    this.style.display = 'none';
    calculator.renderHistory(document.querySelector('.history-list'));
  });

  // History clear handler
  document.querySelector('.clear-history').addEventListener('click', function (e) {
    e.stopPropagation();
    calculator.clearHistory();
  });

  // History item selection handler
  document.querySelector('.history-list').addEventListener('click', function (e) {
    e.stopPropagation();
    const historyItem = e.target.closest('.history-item');
    if (historyItem && !historyItem.classList.contains('no-history')) {
      calculator.displayValue = historyItem.dataset.expression;
      calculator.updateDisplay();
    }
  });

  // History panel close handler
  document.querySelector('.history-close').addEventListener('click', function () {
    document.querySelector('.history-panel').classList.remove('show');
    document.querySelector('.history-toggle').style.display = 'block';
  });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
