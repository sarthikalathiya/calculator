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
    }
};
