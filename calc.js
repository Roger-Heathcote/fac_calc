function NewCalc(){

    const isOp = (character) => "+-*/".includes(character);
    const isDigit = (character) => "0123456789.".includes(character);

    // Mix-in that adds the methods .last and .penultimate to an object with a length;
    // in our case the array that holds the elements of our expression.
    function addEndMethods(obj){
        obj.last = function(){ return this[this.length-1]; };
        obj.penultimate = function(){ return this[this.length-2]; };
        return obj;
    }
    
    // Pops digit characters off expression and pushes the actual number back on
    function consolidateNum(expr){
        let digits = [];
        while(isDigit(expr.last())){ digits.unshift(expr.pop());}
        let oneBack = expr.length-1;
        let twoBack = oneBack - 1;
        // If we find a minus sign at the front of the number and it's either at the
        // very start of the expression, or it's preceded by another operator then
        // absorb it into digits array, our number is negative.
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
            this._expr = addEndMethods(["0"]); // This holds our expression's elements
            this.clearNumFlags();
        }
        clearNumFlags() {
            this.isNum = false;    // Flag is true whenever we are parsing a number
            this.pointYet = false; // Flag is true if decimal point used in this number
        }
        add_char(character) {
            if(isDigit(character)){
                this.isNum = true;
                // If there's a result left over from the last calculation clear it
                if(this._expr.length === 1 && typeof(this._expr[0]) == typeof(1)) this._expr.pop();
                // Don't allow more than one decimal point
                if(character === '.' && this.pointYet) return false;
                if(character === '.') this.pointYet = true;
                // If we are at the start of a number...
                if(!this._expr.penultimate() || !isDigit(this._expr.penultimate())){
                    // remove preceding zero unless we are starting a decimal fraction
                    if(this._expr.last() === "0" && character !== ".") this._expr.pop();
                }
            } else {
                // An operator has been entered...
                if(this.isNum){
                    // If we had been dealing with digits up to this point consolidate those
                    // digits into a number and reset number related flags
                    consolidateNum(this._expr);
                    this.clearNumFlags();
                }
                // Get rid of any previous operators
                if(character === "-"){
                    // A minus should only delete the prev operator if it is another
                    // minus, as otherwise it is the start of a negative number
                    if(this._expr.last() === "-") this._expr.pop()
                } else {
                    if(isOp(this._expr.last())){
                        this._expr.pop() // delete prev operator
                        if(isOp(this._expr.last())) this._expr.pop() // both if there's two
                    } 
                }                
            }
            this._expr.push(character);
        }
        evaluate() {
            // If we have been parsing a number finish doing that
            if(this.isNum){ consolidateNum(this._expr); }
            // Apply operations until expression has no more operators
            let ops={
                "*": (a,b)=>a*b, "/": (a,b)=>a/b, "+": (a,b)=>a+b, "-": (a,b)=>a-b,
            };
            //Return index of next of either specified operator
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
            while(nextOPS(this._expr,"*","/")){ // mul & div 1st
                runOP(this._expr, nextOPS(this._expr,"*","/"));             
            }
            while(nextOPS(this._expr,"+","-")){ // add & sub 2nd
                runOP(this._expr, nextOPS(this._expr,"+","-"));             
            }
            this.accumulator = Number(Number(this._expr[0]).toFixed(10));
            this.clearNumFlags();
        }
        get equals() {
            this.evaluate();
            return this.accumulator.toString();
        }
        get display() {
            return this._expr.join("") || "0";
        }
    }
    return new Calculator();
}