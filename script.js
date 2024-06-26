let themeSwitchContainer = document.getElementById('themeSwitch');
let background = document.getElementById('background');
let calcTitle = document.querySelector('.calc-title');
let screen = document.getElementById('screenContainer');
let btnContainer = document.querySelector('.buttons-container');
let btns = document.querySelectorAll('button');
let screenText = document.querySelector('.screen-text');
let screenTextAfter = document.querySelector('.screen-text-after');
//Declaration of some global variables
var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
var symbols = ['+', '-', '/', 'x', 'RESET', 'DEL', '='];
var compNums = [];
var compSymbols = [];
var mainScreenInput = "";
var secScreenInput = "";
var screenIsEmpty = true;
var updatedMainString = "";
var updatedSecString = "";
var isResultCalled = false;

function resetEverything(){
    screenText.style.top = "0.5";
    screenText.style.fontSize = "2.5em";
    console.log('reset called');
    compNums = [];
    compSymbols = [];
    mainScreenInput = "";
    secScreenInput = "";
    screenIsEmpty = true;
    updatedMainString = "";
    updatedSecString = "";
    screenText.textContent = "0";
    screenTextAfter.textContent = "";
    isResultCalled = false;
}

//THIS FUNCTION IS TO UPDATE THE SCREEN'S TOP NUMBERS
//WHICH INITIALLY START OFF AS 0
function updateMainScreenText(input) {
    mainScreenInput += input;
    if (mainScreenInput != "0") {
        screenText.textContent = mainScreenInput;
    }
    if (screenText.textContent.length > 10 && screenText.textContent.length <= 14) {
        screenText.style.top = "0.8";
        screenText.style.fontSize = "2em";
    } else if (screenText.textContent.length > 14) {
        screenText.style.top = "1";
        screenText.style.fontSize = "1.8em";
    } else {
        screenText.style.top = "0.5";
        screenText.style.fontSize = "2.5em";
    }
}

//THIS FUNCTION IS USED TO UPDATE THE SECONDARY SCREEN NUMBERS
//WHICH INITIALLY START OFF AS EMPTY
function updateSecScreenText(input) {
    secScreenInput += input;
    console.log(secScreenInput);
    screenTextAfter.textContent = secScreenInput;
}

//BASICALLY ADDS THE NUMBERS AND SYMBOLS TOKENS INTO THEIR RESPECTIVE ARRAYS
function compute(symbol) {
    isResultCalled = false;
    compNums.push(screenText.textContent);
    compSymbols.push(symbol);
    if (screenText.textContent != "0") {
        screenText.textContent = "0";
        mainScreenInput = "";
    }
    if (symbols.includes(secScreenInput.substr(-1)) === false && screenIsEmpty === false) {
        updateSecScreenText(symbol);
        console.log(compNums);
        console.log(compSymbols);
    }
}

//THE MAIN FUNCTION WHICH DETERMINES WHAT HAPPENS WHEN A PARTICULAR BUTTON
//IS CLICKED
function btnClicked(arg) {
    var input = arg.toString();
    if (nums.includes(input)) {
        if (isResultCalled){
            resetEverything();
        }
        if (screenIsEmpty === true && input === "0") {
            return;
        }
        if (mainScreenInput.indexOf('.') >= 0 && mainScreenInput.substr(-1) === "0" && input === "0") {
            console.log(mainScreenInput);
            return;
        }
        if (mainScreenInput.indexOf(".") >= 0 && input === ".") {
            return;
        }
        screenIsEmpty = false;
        updateMainScreenText(input);
        updateSecScreenText(input);
    } else if (symbols.includes(arg)) {      
        var input = arg.toString();
        console.log(input);
        switch (input) {
            case "+":
                compute("+");
                break;
            case "-":
                compute("-");
                break;
            case "/":
                compute("/");
                break;
            case "x":
                compute("x");
                break;
            case "=":
                isResultCalled = true;
                if (symbols.includes(screenTextAfter.textContent.substr(-1)) === true) {
                    screenTextAfter.textContent = secScreenInput.slice(0, secScreenInput.length - 1);
                }
                if (screenText.textContent === "0") {
                    console.log('why tho');
                    screenText.textContent = "0";
                }
                secScreenInput = (eval(screenTextAfter.textContent.replace('x', '*'))).toString();
                if (secScreenInput === "0") {
                    screenText.textContent = "0";
                }
                compNums = [];
                compNums.push(secScreenInput.toString());
                compSymbols = [];
                console.log(compNums);
                console.log(compSymbols);
                mainScreenInput = "";
                updateMainScreenText(secScreenInput.toString());
                console.log(secScreenInput);
                break;
            case "DEL":
                if (isResultCalled){
                    resetEverything();
                }
                if (mainScreenInput == "0") {
                    return;
                } else {
                    if (symbols.includes(secScreenInput.substr(-1)) === true) {
                        //Checking if the last element in below screen is a SYMBOL
                        //rather than number so that the above screen can be modified
                        //to the element being accessed in the below screen                        
                        updatedMainString = compNums[compNums.length - 1];
                        compSymbols.pop();
                        console.log(compSymbols);
                        // console.log(updatedMainString);
                    } else {
                        updatedMainString = mainScreenInput.slice(0, mainScreenInput.length - 1);
                        mainScreenInput = "";
                    }
                    updatedSecString = secScreenInput.slice(0, secScreenInput.length - 1);
                    secScreenInput = "";
                    updateSecScreenText(updatedSecString);
                    if (updatedMainString.length == 0) { //checking if the above string is completely deleted                        
                        screenText.textContent = "0";
                        compNums.pop();
                        console.log(compNums);
                    } else {
                        updateMainScreenText(updatedMainString);
                    }
                }
                break;
            case "RESET":
                resetEverything();
                break;
        }
    }
}

//ACCESSING THE BTN CLICKING THROUGH A KEYDOWN
//EVENT LISTENER
document.addEventListener('keydown', function(eventObj) {    
    let key = eventObj.key;
    key == "Enter" ?
        key = "=" :
        key == "Backspace" ?
        key = "DEL" :
        key == "*" ?
        key = "x" :
        key == "r" ?
        key = "RESET" :
        key = key;    
    btnClicked(key);
    //adding the clicked styling to whichever button that is clicked through keyboard
    for (let btn of btns) {
        if (btn.textContent == key) {
            btn.classList.toggle('button-clicked');
        }
    }
    //removing the clicked style on ALL the buttons
    document.addEventListener('keyup', function() {
        for (let btn of btns) {
            btn.classList.remove('button-clicked');
        }
    })
})


// ACCESSING THE BTN CLICKING THROUGH MOUSE CLICK AND PASSING
// THE BTN AS AN ARG TO A FUNCTION
for (let btn of btns) {
    btn.onclick = function() {
        btnClicked(btn.textContent);
    }
}

//Theme toggling LIGHT <--> DARK
themeSwitchContainer.onclick = function() {
    themeSwitchContainer.children[0].classList.toggle('theme-switch-toggle');
    themeSwitchContainer.classList.toggle('theme-switch-container-light');
    background.classList.toggle('background-light');
    calcTitle.classList.toggle('calc-title-light');
    screen.classList.toggle('screen-container-light');
    screen.children[0].classList.toggle('screen-text-light')
    btnContainer.classList.toggle('buttons-container-light');
    screenTextAfter.classList.toggle('screen-text-after-light');
    document.querySelector('.fa-palette').classList.toggle('calc-title-light');
    document.querySelector('.fa-lightbulb').classList.toggle('fa-display-none');
    document.querySelector('.fa-moon').classList.toggle('fa-display-none');
    for (let btn of btns) {
        btn.classList.contains('unique-btn-dark') ?
            btn.classList.toggle('unique-btn-light') :
            btn.classList.contains('equals-light') ?
            btn.classList.toggle('equals-dark') :
            btn.classList.toggle('button-light');
    }
}