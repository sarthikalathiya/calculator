import { MathUtils } from './utils.js';

export class Calculator {
    constructor(displayElement) {
        this.displayValue = '';
        this.displayElement = displayElement;
        this.isDegreeMode = true;
        this.initializeDisplay();
    }

    initializeDisplay() {
        this.updateDisplay();
    }
}

Calculator.prototype.updateDisplay = function() {
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
    
    if (number === '.') {
        const numbers = this.displayValue.split(/[\+\-\*\/\(\)]/);
        const lastNumber = numbers[numbers.length - 1];
        
        if (lastNumber && lastNumber.includes('.')) {
            return;
        }
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
            case 'mod':
                if (this.displayValue && 
                    !MathUtils.isOperator(this.displayValue.slice(-1)) &&
                    this.displayValue.slice(-1) !== '(') {
                    this.displayValue += '%';
                } else {
                    return;
                }
                break;
            case '10x':
                if (this.displayValue && 
                    !MathUtils.isOperator(this.displayValue.slice(-1)) &&
                    this.displayValue.slice(-1) !== '(') {
                    this.displayValue += '*';
                }
                this.displayValue += 'pow10(';
                break;
            case 'sin':
            case 'cos':
            case 'tan':
                if (this.displayValue &&
                    !MathUtils.isOperator(this.displayValue.slice(-1)) &&
                    this.displayValue.slice(-1) !== '(') {
                    this.displayValue += '*';
                }
                this.displayValue += operation + '(';
                break;
            case 'eval':
                if (!this.displayValue) return;
                try {
                    let processedExpr = this.displayValue
                        // Add constant replacements before other operations
                        .replace(/PI/g, Math.PI)
                        .replace(/EPS/g, Math.E)
                        // Trig functions
                        .replace(/sin\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            const angleInRad = this.isDegreeMode ? result * Math.PI / 180 : result;
                            return MathUtils.calculateTrig('sin', angleInRad);
                        })
                        .replace(/cos\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            const angleInRad = this.isDegreeMode ? result * Math.PI / 180 : result;
                            return MathUtils.calculateTrig('cos', angleInRad);
                        })
                        .replace(/tan\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            const angleInRad = this.isDegreeMode ? result * Math.PI / 180 : result;
                            return MathUtils.calculateTrig('tan', angleInRad);
                        })
                        .replace(/log\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            return Math.log10(result);
                        })
                        .replace(/ln\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            return Math.log(result);
                        })
                        .replace(/fact\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            return MathUtils.calculateFactorial(result);
                        })
                        .replace(/pow10\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (match, expr) => {
                            const result = Function('return ' + expr)();
                            return MathUtils.calculatePowerOf10(result);
                        })
                        .replace(/(\d+\.?\d*|\))%(\d+\.?\d*)/g, (match, a, b) => {
                            const num1 = Function('return ' + a)();
                            return MathUtils.calculateModulo(num1, b);
                        });

                    if (!MathUtils.isValidExpression(processedExpr)) {
                        throw new Error('Invalid expression');
                    }
                    const result = Function('return ' + processedExpr)();
                    if (result === Infinity || result === -Infinity) {
                        throw new Error('Division by zero');
                    }
                    if (Number.isNaN(result)) {
                        throw new Error('Invalid operation');
                    }
                    if (!Number.isFinite(result)) {
                        throw new Error('Invalid result');
                    }
                    this.displayValue = MathUtils.formatNumber(result);
                } catch (error) {
                    console.error('Evaluation error:', error);
                    this.displayValue = `Error: ${error.message}`;
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
                this.displayValue += operation.toUpperCase();
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
        if (result === Infinity || result === -Infinity) {
            throw new Error('Division by zero');
        }
        if (Number.isNaN(result)) {
            throw new Error('Invalid operation');
        }
        if (!Number.isFinite(result)) {
            throw new Error('Invalid result');
        }
        this.displayValue = String(result);
    } catch (error) {
        console.error('Evaluation error:', error);
        this.displayValue = `Error: ${error.message}`;
    }
};
