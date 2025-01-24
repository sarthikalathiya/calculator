import { MathUtils } from './utils.js';

export class Calculator {
    constructor(displayElement) {
        this.displayValue = '';
        this.displayElement = displayElement;
        this.initializeDisplay();
    }

    initializeDisplay() {
        this.updateDisplay();
    }
}

Calculator.prototype.updateDisplay = function() {
    if (this.displayElement) {
        this.displayElement.value = this.displayValue;
    }
};

Calculator.prototype.toggleSign = function () {
    if (!this.displayValue) return;

    const lastNumber = this.displayValue.split(/[\+\-\*\/\(\)]/).pop();
    if (!lastNumber) return;

    const lastNumberIndex = this.displayValue.lastIndexOf(lastNumber);

    if (lastNumberIndex === -1) return;

    const hasNegative = this.displayValue[lastNumberIndex - 1] === '-';
    const hasPreviousOperator = lastNumberIndex > 0 &&
        MathUtils.isOperator(this.displayValue[lastNumberIndex - 2]);

    if (hasNegative && (lastNumberIndex === 1 || hasPreviousOperator)) {
        this.displayValue = this.displayValue.slice(0, lastNumberIndex - 1) +
            this.displayValue.slice(lastNumberIndex);
    } else if (lastNumberIndex === 0) {
        this.displayValue = '-' + this.displayValue;
    } else {
        this.displayValue = this.displayValue.slice(0, lastNumberIndex) +
            '-' + this.displayValue.slice(lastNumberIndex);
    }
    this.updateDisplay();
};

Calculator.prototype.appendNumber = function (number) {
    if (number === '.' && this.displayValue.includes('.')) return;
    if (number === 'Plus/Minus') {
        this.toggleSign();
        return;
    }
    this.displayValue += number;
    this.updateDisplay();
};

Calculator.prototype.handleOperation = function (operation) {
    try {
        switch (operation) {
            case 'clear':
                this.displayValue = '';
                break;
            case 'back':
                this.displayValue = this.displayValue.slice(0, -1);
                break;
            case '(':
                if (this.displayValue &&
                    !MathUtils.isOperator(this.displayValue.slice(-1)) &&
                    this.displayValue.slice(-1) !== '(') {
                    this.displayValue += '*';
                }
                this.displayValue += '(';
                break;
            case ')':
                const counts = MathUtils.countParentheses(this.displayValue);
                if (counts.open > counts.close) {
                    this.displayValue += ')';
                }
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                if (MathUtils.isOperator(this.displayValue.slice(-1))) {
                    this.displayValue = this.displayValue.slice(0, -1);
                }
                this.displayValue += operation;
                break;
            case 'log':
            case 'ln':
                if (this.displayValue &&
                    !MathUtils.isOperator(this.displayValue.slice(-1)) &&
                    this.displayValue.slice(-1) !== '(') {
                    this.displayValue += '*';
                }
                this.displayValue += operation + '(';
                break;
            case 'square':
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
            case 'n!':
                if (this.displayValue && 
                    !MathUtils.isOperator(this.displayValue.slice(-1)) &&
                    this.displayValue.slice(-1) !== '(') {
                    this.displayValue += '*';
                }
                this.displayValue += 'fact(';
                break;
            case 'eval':
                if (!this.displayValue) return;
                try {
                    let processedExpr = this.displayValue
                        .replace(/log\(([^()]+)\)/g, (match, expr) => `Math.log10(${expr})`)
                        .replace(/ln\(([^()]+)\)/g, (match, expr) => `Math.log(${expr})`)
                        .replace(/fact\(([^()]+)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            return MathUtils.calculateFactorial(result);
                        });

                    if (!MathUtils.isValidExpression(processedExpr)) {
                        throw new Error('Invalid expression');
                    }
                    const result = Function('return ' + processedExpr)();
                    if (!Number.isFinite(result)) {
                        throw new Error('Invalid result');
                    }
                    this.displayValue = MathUtils.formatNumber(result);
                } catch (error) {
                    console.error('Evaluation error:', error);
                    this.displayValue = 'Error';
                }
                break;
            case 'pi':
            case 'eps':
                const constant = MathUtils.CONSTANTS[operation];
                if (this.displayValue &&
                    !MathUtils.isOperator(this.displayValue.slice(-1)) &&
                    this.displayValue.slice(-1) !== '(') {
                    this.displayValue += '*';
                }
                this.displayValue += MathUtils.formatNumber(constant);
                break;
            case 'root':
                if (this.displayValue) {
                    try {
                        const currentVal = Function('return ' + this.displayValue)();
                        const result = MathUtils.calculateSquareRoot(currentVal);
                        this.displayValue = MathUtils.formatNumber(result);
                    } catch {
                        this.displayValue = 'Error';
                    }
                }
                break;
        }
    } catch (error) {
        console.error('Operation error:', error);
        this.displayValue = 'Error';
    }
    this.updateDisplay();
};

Calculator.prototype.evaluate = function () {
    if (!this.displayValue) return;

    try {
        if (!MathUtils.isValidExpression(this.displayValue)) {
            throw new Error('Invalid expression');
        }
        const result = Function('return ' + this.displayValue)();
        if (!Number.isFinite(result)) {
            throw new Error('Invalid result');
        }
        this.displayValue = String(result);
    } catch (error) {
        console.error('Evaluation error:', error);
        this.displayValue = 'Error';
    }
};
