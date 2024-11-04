const display = document.getElementById('display');
let displayValue = "0";
let firstOperand = null;
let secondOperand = null;
let operator = null;

let waitingForSecondOperand = false;

const updateDisplay = () => {
    display.textContent = displayValue;
};

const clearAll = () => {
    displayValue = "0";
    firstOperand = null;
    secondOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
};