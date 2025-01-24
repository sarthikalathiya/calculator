export const MathUtils = {
    isValidExpression(expr) {
        let count = 0;
        for (let char of expr) {
            if (char === '(') count++;
            if (char === ')') count--;
            if (count < 0) return false;
        }
        return count === 0;
    },

    isOperator(char) {
        return '+-*/'.includes(char);
    },

    countParentheses(expr) {
        const open = (expr.match(/\(/g) || []).length;
        const close = (expr.match(/\)/g) || []).length;
        return { open, close };
    },

    CONSTANTS: {
        'pi': Math.PI,
        'eps': Math.E
    },

    formatNumber(num) {
        return Number.isInteger(num) ? num.toString() : num.toPrecision(6);
    },

    calculateSquareRoot(value) {
        const num = parseFloat(value);
        if (isNaN(num)) throw new Error('Invalid number');
        if (num < 0) throw new Error('Cannot calculate square root of negative number');
        return Math.sqrt(num);
    },

    calculateLog(value, isNatural = false) {
        const num = parseFloat(value);
        if (isNaN(num)) throw new Error('Invalid number');
        if (num <= 0) throw new Error('Cannot calculate logarithm of zero or negative number');
        return isNatural ? Math.log(num) : Math.log10(num);
    },

    wrapInParentheses(value) {
        return value < 0 ? `(${value})` : value;
    },

    calculateFactorial(n) {
        const num = parseInt(n);
        if (isNaN(num)) throw new Error('Invalid number');
        if (num < 0) throw new Error('Cannot calculate factorial of negative number');
        if (num > 100) throw new Error('Number too large for factorial');
        if (num === 0) return 1;
        
        let result = 1;
        for(let i = 2; i <= num; i++) {
            result *= i;
        }
        return result;
    },

    calculateSquare(value) {
        const num = parseFloat(value);
        if (isNaN(num)) throw new Error('Invalid number');
        return num * num;
    }
};
