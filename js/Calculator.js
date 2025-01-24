import { MathUtils } from "./utils.js";

export class Calculator {
  constructor(displayElement) {
    this.displayValue = "";
    this.displayElement = displayElement;
    this.isDegreeMode = true;
    this.initializeDisplay();

    document.addEventListener("keydown", (e) => {
      const key = e.key;
      if (/^[0-9.]$/.test(key)) {
        this.appendNumber(key);
      } else if (["+", "-", "*", "/"].includes(key)) {
        this.handleOperation(key);
      } else if (key === "Backspace") {
        this.handleOperation("back");
      } else if(key === "Escape") {
        this.handleOperation("clear");
      }
    });
  }

  initializeDisplay() {
    this.updateDisplay();
  }
}

Calculator.prototype.updateDisplay = function () {
  if (this.displayElement) {
    this.displayElement.value = this.displayValue;
    this.displayElement.scrollLeft = this.displayElement.scrollWidth;
  }
};

Calculator.prototype.toggleSign = function () {
  if (!this.displayValue) return;

  const lastNumber = this.displayValue.split(/[\+\-\*\/\(\)]/).pop();
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

Calculator.prototype.appendNumber = function (number) {
  if (number === "." && this.displayValue.includes(".")) return;
  if (number === "Plus/Minus") {
    this.toggleSign();
    return;
  }

  if (number === ".") {
    const numbers = this.displayValue.split(/[\+\-\*\/\(\)]/);
    const lastNumber = numbers[numbers.length - 1];

    if (lastNumber && lastNumber.includes(".")) {
      return;
    }
  }

  this.displayValue += number;
  this.updateDisplay();
};

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
          this.displayValue += "*";
        }
        this.displayValue += "(";
        break;
      case ")":
        const counts = MathUtils.countParentheses(this.displayValue);
        if (counts.open > counts.close) {
          this.displayValue += ")";
        }
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        if(!this.displayValue) return;
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
          this.displayValue += "*";
        }
        this.displayValue += operation + "(";
        break;
      case "square":
        if (this.displayValue) {
          const lastNumber = this.displayValue.split(/[\+\-\*\/\(\)]/).pop();
          if (lastNumber) {
            const lastNumberIndex = this.displayValue.lastIndexOf(lastNumber);
            const before = this.displayValue.slice(0, lastNumberIndex);
            const squared = `(${lastNumber}*${lastNumber})`;
            this.displayValue = before + squared;
          }
        }
        break;
      case "n!":
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "*";
        }
        this.displayValue += "fact(";
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
          this.displayValue += "*";
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
          this.displayValue += "*";
        }
        this.displayValue += operation + "(";
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
      case "pi":
      case "eps":
        const constant = MathUtils.CONSTANTS[operation];
        if (
          this.displayValue &&
          !MathUtils.isOperator(this.displayValue.slice(-1)) &&
          this.displayValue.slice(-1) !== "("
        ) {
          this.displayValue += "*";
        }
        this.displayValue += operation.toUpperCase();
        break;
      case "root":
        if (this.displayValue) {
          try {
            const currentVal = Function("return " + this.displayValue)();
            const result = MathUtils.calculateSquareRoot(currentVal);
            this.displayValue = MathUtils.formatNumber(result);
          } catch {
            this.displayValue = "Error";
          }
        }
        break;
    }
  } catch (error) {
    console.error("Operation error:", error);
    this.displayValue = "Invalid Operation";
  }
  this.updateDisplay();
};

Calculator.prototype.evaluateExpression = function (expr) {
  expr = this.processNestedOperations(expr);
  
  expr = expr
    .replace(/PI/g, Math.PI.toString())
    .replace(/EPS/g, Math.E.toString());

  if (!MathUtils.isValidExpression(expr)) {
    throw new Error("Invalid expression");
  }

  const result = Function("return " + expr)();
  if (!Number.isFinite(result)) {
    throw new Error("Invalid result or division by zero");
  }
  return result;
};

Calculator.prototype.processNestedOperations = function (expr) {
  const patterns = {
    trig: /(sin|cos|tan)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    log: /(log|ln)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    factorial: /fact\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    power: /pow10\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    modulo: /(\d+\.?\d*|\))%(\d+\.?\d*)/g
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

    expr = expr.replace(patterns.factorial, (match, innerExpr) => {
      const evalInner = this.evaluateExpression(innerExpr);
      return MathUtils.calculateFactorial(evalInner);
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
  } while (expr !== prevExpr);

  return expr;
};

Calculator.prototype.evaluate = function () {
  if (!this.displayValue) return;

  try {
    if (!MathUtils.isValidExpression(this.displayValue)) {
      throw new Error("Invalid expression");
    }
    const result = Function("return " + this.displayValue)();
    if (result === Infinity || result === -Infinity) {
      throw new Error("Division by zero");
    }
    if (Number.isNaN(result)) {
      throw new Error("Invalid operation");
    }
    if (!Number.isFinite(result)) {
      throw new Error("Invalid result");
    }
    this.displayValue = String(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    this.displayValue = "Invalid Operation";
  }
};
