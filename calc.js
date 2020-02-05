function NewCalc(){

    const isOp = (character) => "+-*/".includes(character);
    const isDigit = (character) => "0123456789.".includes(character);
    
    class Calculator {
        constructor() {
            this.isNum = false;
            this.pointYet = false;
            this.expression = [];
            this.accumulator = 0;
        }
        set clear(_) {
            this.expression = [];
            this.accumulator = 0;
        }
        get acc() {
            return this.accumulator;
        }
        add_char(character) {
            // Some character checking goes here
            if(!isDigit(character)){
                if(this.isNum){ // So we were parsing a number but now this isn't a number
                    // If we are parsing a number stop and evaluate it
                    let digits = [];
                    while(isDigit(this.expression[this.expression.length-1])){
                        digits.unshift( this.expression.pop() );
                    }
                    if(true){
                        let oneBack = this.expression.length-1;
                        let twoBack = oneBack - 1;
                        if(oneBack >= 0 && this.expression[oneBack] == "-"){
                            if(twoBack < 0 || isOp(this.expression[twoBack]) ){
                                digits.unshift( this.expression.pop() );
                            }
                        }
                    }
                    let theNum = digits.join('');
                    this.expression.push(Number(theNum));
                    this.isNum = false;
                    this.pointYet = false;
                }
                const lastChar = this.expression[this.expression.length-1]; 
                // console.log("LASTCHAR IS:", lastChar); 
                if(isOp(lastChar) && character !== "-") this.expression.pop()
            }
            if(character === '.' && this.pointYet) return false;
            if(isDigit(character)){
                this.isNum = true;
                if(character === '.') this.pointYet = true;
            }
            this.expression.push(character);
            // console.log( "EXPR:", this.expression )
        }
        evaluate() {
            // console.log("INEVAL:", this.isNum)
            if(this.isNum){
                let digits = [];
                while(isDigit(this.expression[this.expression.length-1])){
                    // console.log("CONSOLIDATING");
                    digits.unshift( this.expression.pop() );
                }
                if(true){
                    let oneBack = this.expression.length-1;
                    let twoBack = oneBack - 1;
                    if(oneBack >= 0 && this.expression[oneBack] == "-"){
                        if(twoBack < 0 || isOp(this.expression[twoBack]) ){
                            digits.unshift( this.expression.pop() );
                        }
                    }
                }                let theNum = digits.join('');
                this.expression.push(Number(theNum));
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