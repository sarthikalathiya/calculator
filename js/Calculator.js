import { MathUtils } from "./utils.js";

/**
 * Calculator class that handles all calculator operations and display logic
 * Supports basic arithmetic, trigonometry, logarithms, and other mathematical functions
 */
export class Calculator {
  /**
   * Initialize calculator with display element and sets up event listeners
   * @param {HTMLElement} displayElement - The input element that shows calculator input/output
   */
  constructor(displayElement) {
    this.displayValue = "";
    this.displayElement = displayElement;
    this.isDegreeMode = true;
    this.history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    this.initializeDisplay();
    this.initializeHistory();


    document.addEventListener("keydown", (e) => {
      const key = e.key;
      if (document.activeElement === this.displayElement && key === "Enter") {
        e.preventDefault();
      }
      if (/^[0-9.]$/.test(key)) {
        this.appendNumber(key);
      } else if (["+", "-", "/"].includes(key)) {
        this.handleOperation(key);
      } else if (key === "*") {
        this.handleOperation("×");
      } else if (key === "Backspace") {
        this.handleOperation("back");
      } else if (key === "Escape") {
        this.handleOperation("clear");
      } else if (key === "(") {
        this.handleOperation("(");
      } else if (key === ")") {
        this.handleOperation(")");
      } else if (key === "Enter" || key === "=") {
        this.handleOperation("eval");
      }
    });
  }

  initializeDisplay() {
    this.updateDisplay();
  }
  initializeHistory() {
    const historyList = document.querySelector('.history-list');
    this.renderHistory(historyList);
  }

  // Adds a new calculation to history and updates localStorage
  addToHistory(expression, result) {
    this.history.unshift({ expression, result, timestamp: Date.now() });
    if (this.history.length > 1024) this.history.pop();
    localStorage.setItem('calculatorHistory', JSON.stringify(this.history));

    const historyPanel = document.querySelector('.history-panel');
    if (historyPanel.classList.contains('show')) {
      this.renderHistory(document.querySelector('.history-list'));
    }
  }

  // Renders the calculation history in the history panel
  renderHistory(historyList) {
    if (!historyList) return;

    const clearButton = document.querySelector('.clear-history');
    if (this.history.length === 0) {
      historyList.innerHTML = '<div class="history-item no-history">No history available</div>';
      clearButton.style.display = 'none'; // Hide clear button
      return;
    }

    clearButton.style.display = 'block'; // Show clear button
    historyList.innerHTML = this.history
      .map(item => `
        <div class="history-item" data-expression="${item.expression}">
          <div class="history-expression">${item.expression}</div>
          <div class="history-result">${item.result}</div>
        </div>
      `)
      .join('');
  }

  // Clears all calculation history from localStorage and UI
  clearHistory() {
    this.history = [];
    localStorage.removeItem('calculatorHistory');
    this.renderHistory(document.querySelector('.history-list'));
  }
}

// Updates the calculator display with current value
Calculator.prototype.updateDisplay = function () {
  if (this.displayElement) {
    this.displayElement.value = this.displayValue;
    this.displayElement.scrollLeft = this.displayElement.scrollWidth;
  }
};

// Toggles the sign (positive/negative) of the last number in the expression
// Handles complex cases including operators and parentheses
Calculator.prototype.toggleSign = function () {
  if (!this.displayValue) return;

  const lastNumber = this.displayValue.split(/[\+\-\×\/\(\)]/).pop();
  if (!lastNumber) return;

  const lastNumberIndex = this.displayValue.lastIndexOf(lastNumber);

  if (lastNumberIndex === -1) return;

  const hasNegative = this.displayValue[lastNumberIndex - 1] === "-";
  const hasPreviousOperator =
    lastNumberIndex > 0 &&
    MathUtils.isOperator(this.displayValue[lastNumberIndex - 2]);

  if (hasNegative && (lastNumberIndex === 1 || hasPreviousOperator)) {
    this.displayValue =
      this.displayValue.slice(0, lastNumberIndex - 1) +
      this.displayValue.slice(lastNumberIndex);
  } else if (lastNumberIndex === 0) {
    this.displayValue = "-" + this.displayValue;
  } else {
    this.displayValue =
      this.displayValue.slice(0, lastNumberIndex) +
      "-" +
      this.displayValue.slice(lastNumberIndex);
  }
  this.updateDisplay();
};

// Appends a number or decimal point to the current expression
// Includes validation for decimal points and handling of special cases
Calculator.prototype.appendNumber = function (number) {
  if (number === "Plus/Minus") {
    this.toggleSign();
    return;
  }

  // Prevent adding numbers directly after constants
  if (this.displayValue.endsWith('PI') || this.displayValue.endsWith('EPS')) {
    return;
  }

  if (number === ".") {
    const numbers = this.displayValue.split(/[\+\-\×\/\(\)]/);
    const lastNumber = numbers[numbers.length - 1];

    if (lastNumber && lastNumber.includes(".")) {
      return;
    }
  }

  this.displayValue += number;
  this.updateDisplay();
};

// Handles all calculator operations including arithmetic, functions, and special operations
// Core method for processing user inputs and maintaining expression state
Calculator.prototype.handleOperation = function (operation) {
  try {
    switch (operation) {
      case "clear":
        this.displayValue = "";
        break;
      case "back":
        this.displayValue = this.displayValue.slice(0, -1);
        break;
      case "(":
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "×";
        }
        this.displayValue += "(";
        break;
      case ")":
        const counts = MathUtils.countParentheses(this.displayValue);
        if (counts.open > counts.close) {
          this.displayValue += ")";
        }
        break;
      case "×":
      case "+":
      case "-":
      case "/":
        if (!this.displayValue) return;
        // Replace the last operator if there are multiple operators in a row
        if (MathUtils.isOperator(this.displayValue.slice(-1))) {
          this.displayValue = this.displayValue.slice(0, -1);
        }
        this.displayValue += operation;
        break;
      case "log":
      case "ln":
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "×";
        }
        this.displayValue += operation + "(";
        break;
      case "x^y":
        if (this.displayValue && !MathUtils.isOperator(this.displayValue.slice(-1)) && this.displayValue.slice(-1) !== "(") {
          this.displayValue += "^(";
        }
        break;
      case "n!":
        if (this.displayValue) {
          const match = this.displayValue.match(/(\d+|\([^()]+\))$/);
          if (match) {
            const lastNumberOrExpr = match[0];
            const lastIndex = this.displayValue.lastIndexOf(lastNumberOrExpr);
            this.displayValue =
              this.displayValue.slice(0, lastIndex + lastNumberOrExpr.length) +
              "!";
          }
        }
        break;
      case "mod":
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "%";
        } else {
          return;
        }
        break;
      case "10x":
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "×";
        }
        this.displayValue += "pow10(";
        break;
      case "sin":
      case "cos":
      case "tan":
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "×";
        }
        this.displayValue += operation + "(";
        break;
      case "pi":
      case "eps":
        const constant = MathUtils.CONSTANTS[operation];
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "×";
        }
        this.displayValue += operation.toUpperCase();
        break;
      case "root":
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "×";
        }
        this.displayValue += "sqrt(";
        break;
      case "eval":
        if (!this.displayValue) return;
        try {
          const result = this.evaluateExpression(this.displayValue);
          this.displayValue = MathUtils.formatNumber(result);
        } catch (error) {
          console.error("Evaluation error:", error);
          this.displayValue = "Invalid Operation";
        }
        break;
    }
  } catch (error) {
    console.error("Operation error:", error);
    this.displayValue = "Invalid Operation";
  }
  this.updateDisplay();
};

// Evaluates the mathematical expression and returns the result
// Handles complex expressions with nested operations and functions
Calculator.prototype.evaluateExpression = function (expr) {
  const originalExpr = expr;
  // replace × with * before processing
  expr = expr.replace(/×/g, '*');

  expr = this.processNestedOperations(expr);

  expr = expr
    .replace(/PI/g, Math.PI.toString())
    .replace(/EPS/g, Math.E.toString())
    .replace(/\^/g, "**");

  if (!MathUtils.isValidExpression(expr)) {
    throw new Error("Invalid expression");
  }

  const result = Function("return " + expr)();
  if (!Number.isFinite(result)) {
    throw new Error("Invalid result or division by zero");
  }

  // Add to history only if the expression is not a simple number
  if (!/^\d+$/.test(originalExpr)) {
    this.addToHistory(originalExpr, MathUtils.formatNumber(result));
  }
  return result;
};

// Processes nested mathematical operations in the expression
Calculator.prototype.processNestedOperations = function (expr) {
  const patterns = {
    trig: /(sin|cos|tan)\(([^()]+)\)/g,
    log: /(log|ln)\(([^()]+)\)/g,
    factorial: /(\d+|\([^()]+\))!/g,
    power: /pow10\(([^()]+)\)/g,
    modulo: /(\d+\.?\d*|\))%(\d+\.?\d*)/g,
    sqrt: /sqrt\(([^()]+)\)/g,  // Fixed pattern for sqrt
  };

  let prevExpr;
  do {
    prevExpr = expr;
    expr = expr.replace(patterns.trig, (match, func, innerExpr) => {
      const evalInner = this.evaluateExpression(innerExpr);
      const angleInRad = this.isDegreeMode ? (evalInner * Math.PI) / 180 : evalInner;
      return MathUtils.calculateTrig(func, angleInRad);
    });

    expr = expr.replace(patterns.log, (match, func, innerExpr) => {
      const evalInner = this.evaluateExpression(innerExpr);
      return func === 'log' ? Math.log10(evalInner) : Math.log(evalInner);
    });

    expr = expr.replace(patterns.factorial, (match, number) => {
      // If it's a parenthesized expression, evaluate it first
      if (number.startsWith('(')) {
        number = this.evaluateExpression(number.slice(1, -1));
      }
      return MathUtils.calculateFactorial(number);
    });

    expr = expr.replace(patterns.power, (match, innerExpr) => {
      const evalInner = this.evaluateExpression(innerExpr);
      return MathUtils.calculatePowerOf10(evalInner);
    });

    expr = expr.replace(patterns.modulo, (match, a, b) => {
      const num1 = this.evaluateExpression(a);
      const num2 = this.evaluateExpression(b);
      return MathUtils.calculateModulo(num1, num2);
    });

    expr = expr.replace(patterns.sqrt, (match, innerExpr) => {
      const evalInner = Function('return ' + innerExpr)();  // Evaluate the inner expression
      return Math.sqrt(evalInner);
    });
  } while (expr !== prevExpr);

  return expr;
};