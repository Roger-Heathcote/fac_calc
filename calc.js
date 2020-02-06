function NewCalc(){

    const isOp = (character) => "+-*/".includes(character);
    const isDigit = (character) => "0123456789.".includes(character);

    function addLast(obj){
        obj.last = function(){ return this[this.length-1]; };
        return obj;
    }
    
    // pops off number chars and pushes on the actual number
    function consolidateNum(expr){
        let digits = [];
        while(isDigit(expr.last())){ digits.unshift(expr.pop());}
        let oneBack = expr.length-1;
        let twoBack = oneBack - 1;
        if(oneBack >= 0 && expr.last() == "-"){
            if(twoBack < 0 || isOp(expr[twoBack]) ) digits.unshift( expr.pop() );
        }
        // console.log("CONSOLIDATED", expr,"TO", Number(digits.join('')));
        expr.push(Number(digits.join('')));
    }

    class Calculator {
        constructor() {
            this.isNum = false; // Flag is true when we are parsing a number
            this.pointYet = false; // Flag is true if we have already had our decimal point
            this.expression = addLast([]);
            this.accumulator = 0;
        }
        set clear(_) {
            this.expression = []; // TODO addLast
            this.accumulator = 0;
        }
        get acc() {
            return this.accumulator;
        }
        add_char(character) {
            if(!isDigit(character)){
                // An operator has been entered
                if(this.isNum){
                    // If we had been dealing with digits
                    // consolidate digits into a number and reset flags
                    consolidateNum(this.expression);
                    this.isNum = false;
                    this.pointYet = false;
                }
                // Get rid of any previous operators
                const lastChar = this.expression[this.expression.length-1];
                const prevChar = this.expression[this.expression.length-2];
                if(character === "-"){
                    // A minus should only delete the prev operator if it is another
                    // minus, as it may be the start of a negative number
                    if(lastChar === "-") this.expression.pop()
                } else {
                    if(isOp(lastChar)){
                        this.expression.pop() // delete prev operators
                        if(isOp(prevChar)) this.expression.pop() // both if there's two
                    } 
                }                
            } else {
                // A digit has been entered
                this.isNum = true;
                if(character === '.' && this.pointYet) return false; // don't add more than one point
                if(character === '.') this.pointYet = true;

                // If there is a zero at the start of the current number and
                // the new char is anything but a decimal point then get rif of it
                const lastChar = this.expression[this.expression.length-1];
                const prevChar = this.expression[this.expression.length-2];
                if(!prevChar || !isDigit(prevChar)){
                    if(lastChar === "0" && character !== ".") this.expression.pop();
                }
            }

            // This is where the char is actually added
            this.expression.push(character);
        }
        evaluate() {
            if(this.isNum){
                consolidateNum(this.expression);
                this.accumulator = Number(this.expression[0]);
            }
        }
        get equals() {
            if(this.expression.length) this.evaluate();
            return this.accumulator;
        }
        get display() {
            return this.expression.join("");
        }
    }

    return new Calculator();
}