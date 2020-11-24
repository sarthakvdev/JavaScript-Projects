let equation = '';
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

    equation = '';
}

function display(ele) {
    // checking and inserting on the basis of Integers or symbols
    if(Number.isInteger(parseInt(ele)) || ele === '.') {
        equation += ele;
    } else {
        equation += ` ${ele} `;
    }

    base.displayResult.textContent = '';
    base.displayEquation.textContent = equation;
}

// Bool: checks if a number is int or float
function checkInteger(num) {
    return num === Math.floor(num);
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
    if(base.displayEquation.textContent !== '') {
        solve();
        base.displayResult.textContent = parseFloat(base.displayResult.textContent) ** 2;

    }
}