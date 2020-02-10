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
            this.clear();
        }
        clear() {
            this.isNum = false; // Flag is true whenever we are parsing a number
            this.pointYet = false; // Flag is true if we are parsing a number and have already had our one decimal point
            this.expr = addEndMethods(["0"]);
            // this.accumulator = 0;
        }
        add_char(character) {
            if(isDigit(character)){
                // If there's a result left over from the last calculation clear it
                if(this.expr.length === 1 && typeof(this.expr[0]) == typeof(1)) this.expr.pop();
                this.isNum = true;
                if(character === '.' && this.pointYet) return false; // don't add more than one point
                if(character === '.') this.pointYet = true; // flag we have our one decimal point
                if(!this.expr.penultimate() || !isDigit(this.expr.penultimate())){ // if at start of num
                    // remove preceding zero unless we are starting a decimal fraction
                    if(this.expr.last() === "0" && character !== ".") this.expr.pop();
                }
            } else { // An operator has been entered...
                if(this.isNum){
                    // If we had been dealing with digits up to this point consolidate those digits into
                    // a number and reset number related flags
                    consolidateNum(this.expr);
                    this.isNum = false;
                    this.pointYet = false;
                }
                // Get rid of any previous operators
                if(character === "-"){
                    // A minus should only delete the prev operator if it is another
                    // minus, as it may be the start of a negative number
                    if(this.expr.last() === "-") this.expr.pop()
                } else {
                    if(isOp(this.expr.last())){
                        this.expr.pop() // delete prev operator
                        if(isOp(this.expr.last())) this.expr.pop() // both if there's two
                    } 
                }                
            }
            this.expr.push(character);
        }
        evaluate() {
            // If we are parsing a number finish doing that
            if(this.isNum){ consolidateNum(this.expr); }

            // Order of precedence: Left to right, * & /, + & -
            let ops={
                "*": (a,b)=>a*b, "/": (a,b)=>a/b, "+": (a,b)=>a+b, "-": (a,b)=>a-b,
            };
            function nextOPS(expr, op1, op2){
                let op1Idx = expr.indexOf(op1);
                let op2Idx = expr.indexOf(op2);
                if((op1Idx === -1) && (op2Idx === -1)) return false;
                if(op1Idx === -1) return op2Idx;
                if(op2Idx === -1) return op1Idx;
                if(op2Idx > op1Idx) return op1Idx;
                return op2Idx;
            }
            function runOP(expr, idx){
                let [arg1, op, arg2] = expr.slice(idx-1,idx+2);
                expr[idx-1] = ops[op](arg1,arg2);
                expr.splice(idx,2);
            }
            // Evaluate Left to Right
            while(nextOPS(this.expr,"*","/")){ // mul & div 1st
                runOP(this.expr, nextOPS(this.expr,"*","/"));             
            }
            while(nextOPS(this.expr,"+","-")){ // add & sub 2nd
                runOP(this.expr, nextOPS(this.expr,"+","-"));             
            }
                        
            this.accumulator = Number(Number(this.expr[0]).toFixed(10));
            this.isNum = false;
            this.pointYet = false;
        }
        get equals() {
            this.evaluate();
            return this.accumulator.toString();
        }
        get display() {
            return this.expr.join("") || "0";
        }
    }
    return new Calculator();
}