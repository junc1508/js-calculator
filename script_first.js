class Calculator {
  //formularElement, currentElement, currentOperand are all string
  constructor(formulaElement, currentElement) {
    this.formulaElement = formulaElement
    this.currentElement = currentElement;
    this.clear();
  }
  // clear everything
  clear() {
    this.currentOperand = '';
    this.formula = '';
    this.result = '';
    this.operation = undefined;
    this.updateDisplay(0);
  }
  
  
  //append the clicked number to the current number
 //update current operand and formula string
 // convert numbers to a string to prevent the compiler from performing the actual operation
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) {
      return;
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
    this.formula = this.formula + number.toString();
    this.updateDisplay(this.currentOperand);
  }
  
  //choose operation between + - x /
  //will do corresponding calculation
  chooseOperation(operation) {
     //if result is empty => no first number cannot put operation sign except for -
     if (this.result=='' && operation != '-') {
      return;
    }
    //if currentOperand is empty string, meaning we already compute before or no number
    if (this.currentOperand != '') {
      this.compute();
    }
    //choose operation, one special case is --. 
    //This is the only double operation that we are allowed to have

    const lastKey = this.formula.slice(-1);
    const pattern = /[-\+\u00f7\u00d7]/;
    
    //update this.operation and this.formula
    //if we pressed operation right before this operation
    if (pattern.test(lastKey)) {
      //if formula ends with '--'
      const lastButOneKey = this.formula.slice(-2, -1);
      if (lastKey=='-' && lastButOneKey == '-') {
        //'-' does nothing
        if (operation == '-') {
          return;
          //'+ * /' replaces the last 2 kesy
        } else {
          this.operation = operation;
          this.formula = this.formula.slice(0, -2) + operation;
        }

        //the last two key is not '--'
        //the last key is operationButton
        // allow '--' if the last key is '-'
      } else if (lastKey == '-' && operation == '-') {
        this.formula += operation;
        this.operation = '+';
        //the last key is operationButton
        //replace the last operation with current operation
      } else {
        this.formula = this.formula.slice(0, -1) + operation;
        this.operation = operation;
      }

      //this is the first time we press operation
      //update this.formula, this. currentOperand and this.operation
    } else {
      this.formula += operation;
      this.currentOperand = '';
      this.operation = operation;
    }

    this.updateDisplay(operation);
  
  }
  
  //calculate and return result, used by equalButton
  equal(){
    this.compute();
    this.currentOperand = '';
    this.updateDisplay(this.result);
  }


  //do calculation
  compute() {
    let res = parseFloat(this.result);
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) {
      return;
    }
    //res is '' meaning current is the first number
    if (isNaN(res)) {
      if (this.operation == '-'){
        res = 0;
        console.log(this.result);
      } else {
        this.result = this.currentOperand;
        console.log(this.result);
        return;
      }
    }
    //calculate the result
    switch(this.operation) {
      case '+':
        res += current;
        break;
      case '-':
        res -= current;
        break;
      case '\u{00d7}':
        res = res * current;
        break;
      case '\u{00f7}':
        res = res/current;
        break;
      default:
        return;
    }
    this.result = res.toString();
    console.log(this.result);
  }



  //update display of currentOperandTextElement and formularElement in .output class
  //the currentElement is the button clicked or result (if clicked equal).
  updateDisplay(current) {
    this.currentElement.innerText = current;
    this.formulaElement.innerText = this.formula;
  }

}


// find all the elements: buttons and display
// 1) number buttons, select by class name .data-number
const numberButtons = document.querySelectorAll('.data-number');
// 2) operation buttons
const operationButtons = document.querySelectorAll('.data-operation');
// 3) = button
const equalButton = document.querySelector('.data-equals');
// 4) AC button
const allClearButton = document.querySelector('.data-all-clear');

// display: current operand
const currentElement = document.querySelector('.current');
//display: formular string
const formulaElement = document.querySelector('.formula');
//previous result
const previousOperandTextElement = '';

//we can determine where to place the display text for your calculator.
const calculator = new Calculator(formulaElement, currentElement);

//unbberButton invokes appendNumber and updateDisplay
numberButtons.forEach((button) => {
  button.addEventListener('click', e => {
    calculator.appendNumber(button.innerText);
    
  })
})

//operation button invokes chooseOperation, display
operationButtons.forEach((button) => {
  button.addEventListener('click', e=> {
    calculator.chooseOperation(button.innerText);
  })
})

//allclearbutton clears all
allClearButton.addEventListener('click', e => {
  calculator.clear();
})

//equal button calculate
equalButton.addEventListener('click', e=> {
  calculator.equal();
})
