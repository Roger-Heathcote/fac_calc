const fs = require('fs');
const calc_class_text = fs.readFileSync('./calc.js','utf8');
eval(calc_class_text);

function test(msg,a,b){
    if(a !== b){
        console.log("FAIL:",msg);
        console.log(a, "!==", b);
    }
    else {
        console.log("PASS:",msg)
    }
}

// TESTS
// TESTS
// TESTS

{
    const C = NewCalc()
    test("Default val of fresh instance is zero", C.equals, 0);
}
