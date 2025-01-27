import { Calculator } from "./js/Calculator.js";

function initializeApp() {
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

  const angleModeElement = document.getElementById("angleMode");
  angleModeElement.addEventListener("click", function () {
    calculator.isDegreeMode = !calculator.isDegreeMode;
    this.textContent = calculator.isDegreeMode ? "DEG" : "RAD";
  });

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
      button.blur();
    });
  });

  document.querySelector(".theme-toggle").addEventListener("click", function () {
    const isDarkMode = !document.body.classList.contains("dark-mode");
    setTheme(isDarkMode);
  });

  document.getElementById("trigToggle").addEventListener("click", function () {
    document.getElementById("trigDropdown").classList.toggle("show");
    document
      .querySelector("#trigToggle .fa-chevron-down")
      .classList.toggle("rotate-arrow");
  });

  document.querySelector('.history-toggle').addEventListener('click', function (e) {
    const historyPanel = document.querySelector('.history-panel');
    historyPanel.classList.add('show');
    this.style.display = 'none';
    calculator.renderHistory(document.querySelector('.history-list'));
  });

  document.querySelector('.clear-history').addEventListener('click', function (e) {
    e.stopPropagation();
    calculator.clearHistory();
  });

  document.querySelector('.history-list').addEventListener('click', function (e) {
    e.stopPropagation();
    const historyItem = e.target.closest('.history-item');
    if (historyItem && !historyItem.classList.contains('no-history')) {
      calculator.displayValue = historyItem.dataset.expression;
      calculator.updateDisplay();
    }
  });

  document.querySelector('.history-close').addEventListener('click', function () {
    document.querySelector('.history-panel').classList.remove('show');
    document.querySelector('.history-toggle').style.display = 'block';
  });
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', initializeApp);
