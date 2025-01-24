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
    }
};
