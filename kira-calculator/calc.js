let eqArray = [];
let equation = '';
let prevEquation = '';
let solution;

let base = {
    button: document.querySelector('.button'),
    displayResult: document.querySelector('.result'),
    displayEquation: document.querySelector('.eq'),
    clearBtn: document.querySelector('#clear')
};

function clearDisplay() {
    // changing text of equation and result to empty string
    base.displayEquation.textContent = '';
    base.displayResult.textContent = '';
    eqArray = [];
}

function turnString(eqArr) {
    let eq = '';
    eqArr.forEach(ele => {
        if(Number.isInteger(parseInt(ele)) || ele === '.') {
            eq += ele;
        } else {
            eq += ` ${ele} `;
        }
    })
    return eq;
}

function display(ele) {
    // Pushing every element into a char Array
    eqArray.push(ele);
    // turning chars from array into a string to display
    equation = turnString(eqArray);

    base.displayResult.textContent = '';
    base.displayEquation.textContent = equation;
}

// Bool: checks if a number is int or float
function checkInteger(num) {
    return num === Math.floor(num);
}

function undo() {
    eqArray.pop();
    equation = turnString(eqArray);
    base.displayResult.textContent = '';
    base.displayEquation.textContent = equation;
}

function solve() {
    let newEquation = equation;

    // Creplacing some chars to calculatable digits
    newEquation = newEquation.replaceAll('x', '*');
    newEquation = newEquation.replaceAll('÷', '/');
    newEquation = newEquation.replaceAll('e', '2.718');
    newEquation = newEquation.replaceAll('π', '3.14159');

    // evaluation could show errors because of a wrong expression
    try {
        // evaulating then converting string to Float for fixation        
        solution = eval(newEquation);
        solution = solution.toFixed(3);
    } catch(e) {
        solution = "Wrong equation";
    }

    equation = '';
    base.displayResult.textContent = checkInteger(parseFloat(solution)) ? parseInt(solution) : solution;

}

function square() {
    try {
        if(base.displayEquation.textContent !== '' || base.displayEquation.textContent !== 'Result') {
        solve();
        base.displayResult.textContent = parseFloat(base.displayResult.textContent) ** 2;
        } else {
            base.displayResult.textContent = 'check equation';
        }
    } catch(e) {
        base.displayResult.textContent = 'check Equation';
    }
}