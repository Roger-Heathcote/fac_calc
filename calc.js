function NewCalc(){

    class Calculator {
        constructor() {
            this.expression = ""
            this.accumulator = 0;
        }
        set clear(_) {
            this.expression = ""
            this.accumulator = 0;
        }
        get equals() {
            return 0;
        }
    }

    return new Calculator();
}