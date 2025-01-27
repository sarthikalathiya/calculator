export const MathUtils = {
  isValidExpression(expr) {
    let count = 0;
    for (let char of expr) {
      if (char === "(") count++;
      if (char === ")") count--;
      if (count < 0) return false;
    }
    return count === 0;
  },

  isOperator(char) {
    return "+-×/".includes(char);
  },

  countParentheses(expr) {
    const open = (expr.match(/\(/g) || []).length;
    const close = (expr.match(/\)/g) || []).length;
    return { open, close };
  },

  CONSTANTS: {
    pi: Math.PI,
    eps: Math.E,
  },

  formatNumber(num) {
    return Number.isInteger(num) ? num.toString() : num.toPrecision(3);
  },

  calculateSquareRoot(value) {
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error("Invalid number");
    if (num < 0)
      throw new Error("Cannot calculate square root of negative number");
    return Math.sqrt(num);
  },

  calculateLog(value, isNatural = false) {
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error("Invalid number");
    if (num <= 0)
      throw new Error("Cannot calculate logarithm of zero or negative number");
    return isNatural ? Math.log(num) : Math.log10(num);
  },

  calculateFactorial(n) {
    const num = parseInt(n);
    if (isNaN(num)) throw new Error("Invalid number");
    if (num < 0)
      throw new Error("Cannot calculate factorial of negative number");
    if (num > 100) throw new Error("Number too large for factorial");
    if (num === 0) return 1;

    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  },

  calculateSquare(value) {
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error("Invalid number");
    return num * num;
  },

  calculateModulo(a, b) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    if (isNaN(num1) || isNaN(num2)) throw new Error("Invalid numbers");
    if (num2 === 0) throw new Error("Cannot divide by zero");
    return num1 % num2;
  },

  calculatePowerOf10(exponent) {
    const num = parseFloat(exponent);
    if (isNaN(num)) throw new Error("Invalid exponent");
    if (Math.abs(num) > 308) throw new Error("Exponent too large");
    return Math.pow(10, num);
  },

  calculateTrig(operation, value) {
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error("Invalid number");

    try {
      switch (operation) {
        case "sin":
          return Math.sin(num);
        case "cos":
          return Math.cos(num);
        case "tan":
          if (Math.abs(Math.cos(num)) < 1e-10) {
            throw new Error("Undefined (tan 90°)");
          }
          return Math.tan(num);
        default:
          throw new Error("Invalid operation");
      }
    } catch (error) {
      console.error(`Trig error (${operation}):`, error);
      throw error;
    }
  },
};
