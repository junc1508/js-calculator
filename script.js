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
 //deal with the display of 0000 => 0 and 0001 => 1
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) {
      return;
    }
    
    const currentNumber = parseFloat(this.currentOperand + number.toString());
    //if nothing yet, append number
    if (this.currentOperand == '') {
      this.currentOperand = currentNumber.toString();
      this.formula += number.toString();
      //if 00000, does not update formula or currentOperand
      //if number change from 0 to something
    } else if (currentNumber != 0 && this.currentOperand == '0') {
      this.formula = this.formula.slice(0, -1) + number.toString();
      this.currentOperand = currentNumber.toString()
      //normal append
    } else if (currentNumber != 0 && this.currentOperand != '0') {
      this.formula = this.formula + number.toString();
      this.currentOperand = currentNumber.toString();
    }

    this.updateDisplay(this.currentOperand);
  }
  

  //choose operation between + - x /
  //will do corresponding calculation
  chooseOperation(operation) {
     //if result is empty => no first number cannot put operation sign except for - or +
     if (this.result=='') {
      //operation is the first button clicked, need to be + or -
      if (this.formula == '') {
        if (operation == '-') {
          this.currentOperand = operation;
          this.formula = operation;
          this.updateDisplay(operation);
        }
        if (operation == '+') {
          this.formula = operation;
          this.updateDisplay(operation);
        } 
      } 
      if (this.formula == '+' && operation == '-') {
        this.formula = operation;
        this.currentOperand = operation;
        this.updateDisplay(operation);
      }
    } 
    if (this.formula == '+' || this.formula == '-') {
      return;
    }
  
    //if currentOperand is empty string, meaning we already compute before or no number
    if (this.currentOperand != '' || this.currentOperand !='-') {
      this.compute();
    }

    //choose operation, one special case is --. 
    //This is the only double operation that we are allowed to have

    const lastKey = this.formula.slice(-1);
    const pattern = /[-\+\u00f7\u00d7]/;
    
    //update this.operation, this.formula 
    //and this.currentOperand when this is the first operation
    //if this operation is immediately after other operation(s)
    if (pattern.test(lastKey)) {
      //if formula ends with '--'
      const lastButOneKey = this.formula.slice(-2, -1);
      if (pattern.test(lastButOneKey)) {
        //if last two is --, - does nothing
        if (lastKey=='-' && lastButOneKey == '-' && operation == '-') {
          return;
        } 
        //last two button are operation buttons but not -- 
        //reset the last two key of this.formula to operation
        this.operation = operation;
        this.formula = this.formula.slice(0, -2) + operation;
        //reset currentOperand incase we have negative case before
        this.currentOperand = '';
        
        
        //last but one is not operation button
        //last one is operation button
        //allow operation = '-' for negative currentOperand
        //other operation buttons '+ * /' replace the last operation button
      } else {
        //last button clicked is operation button 
        //result is not empty
        //if operation is '-', currentOperand is negative
        if (operation =='-') {
          this.currentOperand = operation;
          this.formula += operation;
          //do not update operation
          
          //operation is not '-', replace previous operation
        } else {
          this.formula = this.formula.slice(0,-1) + operation;
          this.operation = operation;
        }
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
    if (this.currentOperand == '' || this.currentOperand == '-') {
      return;
    }
    let res = parseFloat(this.result);
    const current = parseFloat(this.currentOperand);
    //res is '' meaning current is the first number
    if (isNaN(res)) {
      this.result = this.currentOperand;
      console.log(this.result);
      return;
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
