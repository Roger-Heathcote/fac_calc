function NewCalc(){

    const isOp = (character) => "+-*/".includes(character);
    const isDigit = (character) => "0123456789.".includes(character);

    // Mix-in that adds the methods .last and .penultimate to an object with a length
    function addEndMethods(obj){
        obj.last = function(){ return this[this.length-1]; };
        obj.penultimate = function(){ return this[this.length-2]; };
        return obj;
    }
    
    // pops number chars off expression and pushes the actual number back on
    function consolidateNum(expr){
        let digits = [];
        while(isDigit(expr.last())){ digits.unshift(expr.pop());}
        let oneBack = expr.length-1;
        let twoBack = oneBack - 1;
        // If we find a minus sign at the front of the number and it's either at the
        // very start of the expression, or it's preceeded by another operator then
        // grab it, our number is negative.
        if(oneBack >= 0 && expr.last() == "-"){
            if(twoBack < 0 || isOp(expr[twoBack]) ) digits.unshift( expr.pop() );
        }
        expr.push(Number(digits.join('')));
    }

    class Calculator {
        constructor() {
            this.isNum = false; // Flag is true whenever we are parsing a number
            this.pointYet = false; // Flag is true if we are parsing a number and have already had our one decimal point
            this.expression = addEndMethods([]);
            this.accumulator = 0;
        }
        clear() {
            this.expression = []; // TODO addEndMethods
            this.accumulator = 0;
            this.isNum = false; // Flag is true whenever we are parsing a number
            this.pointYet = false; // Flag is true if we are parsing a number and have already had our one decimal point
        }
        get acc() {
            return this.accumulator;
        }
        add_char(character) {
            if(isDigit(character)){
                // If there's a result left over from the last calculation clear it
                if(this.expression.length === 1 && typeof(this.expression[0]) == typeof(1)) this.expression.pop();
                this.isNum = true;
                if(character === '.' && this.pointYet) return false; // don't add more than one point
                if(character === '.') this.pointYet = true; // flag we have our one decimal point
                if(!this.expression.penultimate() || !isDigit(this.expression.penultimate())){ // if at start of num
                    // remove preceding zero unless we are starting a decimal fraction
                    if(this.expression.last() === "0" && character !== ".") this.expression.pop();
                }
            } else { // An operator has been entered...
                if(this.isNum){
                    // If we had been dealing with digits up to this point consolidate those digits into
                    // a number and reset number related flags
                    consolidateNum(this.expression);
                    this.isNum = false;
                    this.pointYet = false;
                }
                // Get rid of any previous operators
                if(character === "-"){
                    // A minus should only delete the prev operator if it is another
                    // minus, as it may be the start of a negative number
                    if(this.expression.last() === "-") this.expression.pop()
                } else {
                    if(isOp(this.expression.last())){
                        this.expression.pop() // delete prev operator
                        if(isOp(this.expression.last())) this.expression.pop() // both if there's two
                    } 
                }                
            }
            this.expression.push(character);
        }
        evaluate() {
            // If we are parsing a number finish doing that
            if(this.isNum){ consolidateNum(this.expression); }

            // Order of precedence: Left to right, Multiplication & Division, Addition & subtraction

            function nextMulDiv(expr){
                let mulIdx = expr.indexOf("*");
                let divIdx = expr.indexOf("/");
                if((mulIdx === -1) && (divIdx === -1)) return false;
                if(mulIdx === -1) return divIdx;
                if(divIdx === -1) return mulIdx;
                if(divIdx > mulIdx) return mulIdx;
                return divIdx;
            }

            while(nextMulDiv(this.expression)){
                let idx = nextMulDiv(this.expression);
                let result;
                let v1 = this.expression[idx-1];
                let v2 = this.expression[idx+1];
                if(this.expression[idx] === "*") result = v1 * v2;
                if(this.expression[idx] === "/") result = v1 / v2;
                this.expression[idx-1] = result;
                this.expression.splice(idx,2);
            }
            
            function nextPlusMin(expr){
                let mulIdx = expr.indexOf("+");
                let divIdx = expr.indexOf("-");
                if((mulIdx === -1) && (divIdx === -1)) return false;
                if(mulIdx === -1) return divIdx;
                if(divIdx === -1) return mulIdx;
                if(divIdx > mulIdx) return mulIdx;
                return divIdx;
            }
            
            while(nextPlusMin(this.expression)){
                let idx = nextPlusMin(this.expression);
                let result;
                let v1 = this.expression[idx-1];
                let v2 = this.expression[idx+1];
                if(this.expression[idx] === "+") result = v1 + v2;
                if(this.expression[idx] === "-") result = v1 - v2;
                this.expression[idx-1] = result;
                this.expression.splice(idx,2);
            }
            
            this.accumulator = Number(Number(this.expression[0]).toFixed(10));
            this.isNum = false;
            this.pointYet = false;
        }
        get equals() {
            if(this.expression.length) this.evaluate();
            return this.accumulator.toString();
        }
        get display() {
            return this.expression.join("") || "0";
        }
    }
    return new Calculator();
}