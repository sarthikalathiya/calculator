import { Calculator } from "./js/Calculator.js";

document.querySelector(".theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  const icon = document.querySelector(".theme-toggle i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});

document.getElementById("trigToggle").addEventListener("click", function () {
  document.getElementById("trigDropdown").classList.toggle("show");
  document
    .querySelector("#trigToggle .fa-chevron-down")
    .classList.toggle("rotate-arrow");
});

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
