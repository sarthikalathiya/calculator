import { Calculator } from './js/Calculator.js';

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

const calculator = new Calculator(document.getElementById('calcInput'));

const angleModeElement = document.getElementById('angleMode');
// console.log(angleModeElement.innerText);
angleModeElement.addEventListener('click', function() {
    calculator.isDegreeMode = !calculator.isDegreeMode;
    this.textContent = calculator.isDegreeMode ? 'DEG' : 'RAD';
});

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