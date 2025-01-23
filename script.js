document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});
    
document.getElementById('trigToggle').addEventListener('click', function() {
    document.getElementById('trigDropdown').classList.toggle('show');
    document.querySelector('#trigToggle .fa-chevron-down').classList.toggle('rotate-arrow');
});

// Calculator functionality
const calculator = {
    displayValue: '',
    
    updateDisplay() {
        const display = document.getElementById('calcInput');
        if (display) display.value = this.displayValue;
    },
    
    appendNumber(number) {
        if (number === '.' && this.displayValue.includes('.')) return;
        this.displayValue += number;
        this.updateDisplay();
    },
    
    handleOperation(operation) {
        switch(operation) {
            case 'clear':
                this.displayValue = '';
                break;
            case 'back':
                this.displayValue = this.displayValue.slice(0, -1);
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                // for ++, --, **, // situation
                if ('+-*/'.includes(this.displayValue.slice(-1))) {
                    this.displayValue = this.displayValue.slice(0, -1);
                }
                this.displayValue += operation;
                break;
            case 'eval':
                try {
                    // eval
                    let result = Function('return ' + this.displayValue)();
                    this.displayValue = Number.isFinite(result) ? String(result) : 'Error';
                } catch {
                    this.displayValue = 'Error';
                }
                break;
        }
        this.updateDisplay();
    }
};

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const number = button.getAttribute('data-numbers');
        const operation = button.getAttribute('data-operation');
        
        if (number !== null) {
            calculator.appendNumber(number);
        } else if (operation !== null) {
            calculator.handleOperation(operation);
        }
    });
});


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
});


calculator.updateDisplay();