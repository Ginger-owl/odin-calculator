// math function
const sum = (a, b) => {
    if (hasPointRegex.test(a) || hasPointRegex.test(b)) {
        result = parseFloat(a) + parseFloat(b);
    } else {
        result = parseInt(a) + parseInt(b);
    }
    return fixedResult(result);
}

const substract = (a, b) => {
    if (hasPointRegex.test(a) || hasPointRegex.test(b)) {
        result = parseFloat(a) - parseFloat(b);
    } else {
        result = parseInt(a) - parseInt(b);
    }
    return fixedResult(result);
}

const multiply = (a, b) => {
    if (hasPointRegex.test(a) || hasPointRegex.test(b)) {
        result = parseFloat(a) * parseFloat(b);
    } else {
        result = parseInt(a) * parseInt(b);
    }
    return fixedResult(result);
}

const divide = (a, b) => {
    if (parseInt(b) === 0) {
        return 'NaN'
    }
    if (hasPointRegex.test(a) || hasPointRegex.test(b)) {
        result = parseFloat(a) / parseFloat(b);
    } else {
        result = parseInt(a) / parseInt(b);
    }
    return fixedResult(result);
}

// Regex to look for point in numbers
const hasPointRegex = new RegExp(/\./);
const fixedResult = (number) => {return parseFloat(number.toPrecision(12))};

// TESTING purposes
const showState = () => {console.log('isInputFinished:', isInputFinished);console.log('isFirstNumberSet:', isFirstNumberSet);console.log('isOperandChosen:', isOperandChosen);console.log('isNewNumberInput:', isNewNumberInput);console.log('operandChosen:', operandChosen);console.log('firstNumber:', firstNumber);console.log('currentValue:', currentValue);}

let isInputFinished = true;
let isFirstNumberSet = false;
let isOperandChosen = false;
let isNewNumberInput = false
let operandChosen = null;
let firstNumber = null;
// Value we work at the moment of input
let currentValue = 0

const display = document.querySelector('#display-area');
const clearBtn = document.querySelector('#text-all');

// Display functions
const resetDisplay = () => {
    if (display.textContent.length === 1) {
        clearBtn.classList.remove('text-all-unchecked')
    } else {
        setFirstNumber();
    }
    currentValue = 0;
    display.textContent = currentValue
    isInputFinished = true;
}

const updateDisplay = (value) => {
    value = String(value)
    if (value === '.') {
        display.textContent = value;
    } else {
        if (Number(value) < 0) {
            value.length > 7 ? display.textContent = value.slice(0, 8): display.textContent = value;
        } else {
            value.length > 7 ? display.textContent = value.slice(0, 7): display.textContent = value;
        }
    }
}

// Reset state's flags
const resetFlags = (currentResult=null) => {
    isInputFinished = true;
    isOperandChosen = false;
    operandChosen = null;
    setFirstNumber(currentResult)
    isNewNumberInput = false;
}

// Technical functions for internal logic
const setOperand = (operand) => {
    isOperandChosen = true;
    operandChosen = operand;
}

const setFirstNumber = (number) => {
    firstNumber = number;
    firstNumber == null ? isFirstNumberSet = false : isFirstNumberSet = true;
}


// Digit manipulations
const addSymbol = (symbol) => {

    // SWAP VALUE IF
    //  1 - NEW INPUT
    //  2 - CURRENT INPUT == 0 (where it is not a float)
    if (isInputFinished) {
        display.textContent = symbol;
    } else {
        if (!(hasPointRegex.test(display.textContent))) {
            if (parseFloat(display.textContent) === 0.0) {
                display.textContent = symbol;
            } else {
                display.textContent += symbol;
            }
        } else {
            if (parseFloat(display.textContent) === 0.0) {
                display.textContent = display.textContent + symbol;
            } else {
                if (symbol != '.') {
                    display.textContent += symbol;
                }
            }
        }
    }
    currentValue = display.textContent
    isInputFinished = false;
    clearBtn.classList.add('text-all-unchecked')
}  

const removeSymbol = () => {
    if (String(currentValue).length === 1) {
        currentValue = 0;
        clearBtn.classList.remove('text-all-unchecked');
    } else {currentValue = String(currentValue).slice(0, -1);} 
}

const changeSign = () => {
    if (!hasPointRegex.test(currentValue)) {
        currentlyDisplayedValue = parseInt(currentValue);
    } else {
        currentlyDisplayedValue = parseFloat(currentValue);
    }
    currentlyDisplayedValue *= -1;
    currentValue = currentlyDisplayedValue;
    if (isInputFinished && parseFloat(firstNumber) === (-1 * parseFloat(currentValue))) {
        firstNumber = parseFloat(firstNumber) * -1;
    }
}

// Dispatcher for  math operations
const calculate = (firstNum, secondNum, operand) => {
    switch (operand) {
        case '+':
            return sum(firstNum, secondNum);    
        case '-':
            return substract(firstNum, secondNum);
        case '*':
            return multiply(firstNum, secondNum);
        case '/':
            return divide(firstNum, secondNum);
    }
}

// Main flow-management func
const operate = (operand) => {
    // ? first number set
    if (isFirstNumberSet) {
        // ? operand is chosen -> calculate
        if (isOperandChosen && isNewNumberInput) {
            currentValue = calculate(firstNumber, currentValue, operandChosen);
            resetFlags(result);
        }
        // ? clicked true operand -> set new operand
        // if clicked equals toggle operand flag to false
        if (operand != '=') {
            setOperand(operand);
            setFirstNumber(currentValue);
            isInputFinished = true;
        } 
    //  if operand not yet chosen and not '=' clicked -> set operand, toggle flag
    } else if (operand != '=') {
        setOperand(operand)
        setFirstNumber(currentValue)
        isInputFinished = true;
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('number')) {
        let digit = e.target.textContent;
        addSymbol(digit);
        isNewNumberInput = true;
    } else if (e.target.classList.contains('operand')) {
        let operand = e.target.textContent;
        operate(operand);
    } else if (e.target.classList.contains('changeSign')) {
        changeSign();
    } else if (e.target.classList.contains('point')) {
        addSymbol('.');
    } else if (e.target.classList.contains('clear-display')) {
        if (e.target.querySelector('.text-all-unchecked')) {
            removeSymbol()
        } else {
            resetDisplay();
            resetFlags();
        }
    }
    updateDisplay(currentValue)
});

document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        addSymbol(e.key);
        isNewNumberInput = true;
    } else if (e.key === 'Enter' || e.key === '=') {
        operate('=');
    } else if (['+', '-', '/', '*'].includes(e.key)) {
        operate(e.key)
    } else if (e.key === 'Tab') {
        changeSign();
    } else if (e.key === '.') {
        addSymbol('.');
    } else if (e.key === 'Backspace') {
        if (e.ctrlKey || currentValue === 0) {
            resetDisplay()
            resetFlags()
        } else {
            removeSymbol()
        }
    }
    updateDisplay(currentValue);
});

document.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('clear-display')) {
        resetDisplay();
        resetFlags();
    }
    updateDisplay(currentValue);
});

resetDisplay();
