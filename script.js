let display = document.getElementById('display');
let lastInput = document.getElementById('last-input');
let buttons = Array.from(document.getElementsByClassName('num'));
let operators = Array.from(document.getElementsByClassName('op'));
let clearButton = document.querySelector('.clear');
let clearEntryButton = document.querySelector('.clear-entry');
let equalButton = document.querySelector('.equal');
let lastExpression = null;
let repeatedEqual = false;

buttons.map(button => {
    button.addEventListener('click', () => {
        if (display.innerText === '0' || repeatedEqual) {
            display.innerText = '';
            repeatedEqual = false;
        }
        display.innerText += button.innerText;
    });
});

operators.map(button => {
    button.addEventListener('click', () => {
        if (!repeatedEqual) {
            display.innerText += button.innerText;
        } else {
            display.innerText = lastExpression.split(button.innerText)[0] + button.innerText;
            repeatedEqual = false;
        }
    });
});

clearButton.addEventListener('click', () => {
    display.innerText = '0';
    lastInput.innerText = '0';
    lastExpression = null;
    repeatedEqual = false;
});

clearEntryButton.addEventListener('click', () => {
    display.innerText = '0';
});

equalButton.addEventListener('click', () => {
    if (!repeatedEqual) {
        lastExpression = display.innerText;
        lastInput.innerText = lastExpression;
        display.innerText = eval(lastExpression);
        repeatedEqual = true;
    } else {
        let operator = lastExpression.match(/[-+*/%]/g);
        let operands = lastExpression.split(new RegExp(operator.join("|"), "g"));
        if (operator && operands[1]) {
            let newExpression = display.innerText + operator[operator.length - 1] + operands[1];
            lastInput.innerText = newExpression;
            display.innerText = eval(newExpression);
            lastExpression = newExpression;
        }
    }
});

