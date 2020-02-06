const fs = require('fs');
const calc_class_text = fs.readFileSync('./calc.js','utf8');
eval(calc_class_text);

const CLEAR = "\x1b[0m"
const BLACKONYELLOW = "\x1b[30m\x1b[43m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m"

function test(msg,a,b){
    if(typeof(a) !== typeof(b)){
        console.log(RED + "FAIL:", CLEAR + msg);
        console.log("Types differ", typeof(a), "!==", typeof(b));                
        return false
    }
    // If it's a list
    if(typeof(a) == typeof([])){
        // Check lengths are equal
        if(a.length !== b.length){
            console.log(RED + "FAIL:", CLEAR + msg);
            console.log("Length's differ", a.length, "!==", b.length);                
            return false
        }
        // Check elements are equal
        for(let idx=0; idx<a.length; idx++){
            if(a[idx] !== b[idx]){
                console.log(RED + "FAIL:", CLEAR + msg);
                console.log("Element", idx,"differs", a[idx], "!==", b[idx]);                
                return false;
            }
        }
        console.log(GREEN + "PASS:", CLEAR + msg);
        return true;
    } else {
        if(a !== b){
            console.log(RED + "FAIL:", CLEAR + msg);
            console.log(a, "!==", b);
        }
        else {
            console.log(GREEN + "PASS:", CLEAR + msg);
        }
    }
}

function addChars(calc, string) {
    string.split('').map( (c)=>{
        calc.add_char(c);
        // console.log("POST ADD:", calc.expression);   
    })
    // console.log(calc.expression);
}
// TESTS
// TESTS
// TESTS

console.log(BLACKONYELLOW + "\nTESTS",CLEAR);

{
    const C = NewCalc()
    test("Default val of fresh instance is zero", C.equals, 0);
}
{
    const C = NewCalc();
    C.add_char("3");
    test("Value of expression '3' is 3", C.equals, 3);
}
// display method needed for story #8
{
    const C = NewCalc();
    addChars(C, "123+456");
    test("Display of expression '123+456' is '123+456'", C.display, '123+456');
}
// Test for story #13 - no dupes except negatives
{
    const C = NewCalc();
    addChars(C, "123+*456");
    test("Display of expression '123+*456' is '123*456'", C.display, '123*456');
}
// Test numbers are being parsed correctly
{
    const C = NewCalc();
    addChars(C, "123");
    C.evaluate();
    test("Test '123' is represented as [123] internally", C.expression, [123]);
}
// Test numbers are being parsed correctly
{
    const C = NewCalc();
    addChars(C, "123+");
    C.evaluate();
    test("Test '123+' is represented as [123, '+'] internally", C.expression, [123,'+']);
}
{
    const C = NewCalc();
    addChars(C, "123+456");
    C.evaluate();
    // console.log(C.expression);
    test("Test '123+456' is represented as [123, '+', 456] internally", C.expression, [123,'+',456]);
}
{
    const C = NewCalc();
    addChars(C, "12.3+456");
    C.evaluate();
    // console.log(C.expression);
    test("Test '12.3+456' is represented as [12.3, '+', 456] internally", C.expression, [12.3,'+',456]);
}
//Test for story #13 - no dupes EXCEPT NEGATIVES
{
    const C = NewCalc();
    addChars(C, "123+-456");
    C.evaluate();
    // console.log(C.expression);
    test("Display of expression '123+-456' is '123+-456'", C.display, '123+-456');
}

{ //Story 13 check internal representation
    const C = NewCalc();
    addChars(C, "123+-456");
    C.evaluate();
    // console.log(C.expression);
    test("Internal representation of '123+-456' is represented as [123, '+', -456]", C.expression, [123, '+', -456]);    
}
{ //Story 13 check internal representation with negative predecessor.
    const C = NewCalc();
    addChars(C, "123--456");
    C.evaluate();
    // console.log(C.expression);
    test("Internal representation of '123--456' is represented as [123, '-', 456]", C.expression, [123, '-', 456]);
}
{ //Story 13 triple negative ignored
    const C = NewCalc();
    addChars(C, "123---456");
    C.evaluate();
    // console.log(C.expression);
    test("Internal representation of '123---456' is represented as [123, '-', 456]", C.expression, [123, '-', 456]);
}
{ //Story 13 boatload of operators ignored ignored
    const C = NewCalc();
    addChars(C, "123-+//+--*+*--456");
    C.evaluate();
    console.log(C.expression);
    test("Internal representation of '123-+//+--*+*--456' is represented as [123, '*', -456]", C.expression, [123, '*', -456]);
}
{ // make sure multiple decimal points are ignored
    const C = NewCalc();
    addChars(C, "1.2.3+4.5.6");
    C.evaluate();
    console.log(C.expression);
    test("Internal representation of '1.2.3+4.5.6' is represented as [1.23, '+', 4.56]", C.expression, [1.23, '+', 4.56]);
}

{ // make sure leading decimals are okay
    const C = NewCalc();
    addChars(C, ".2+.6");
    C.evaluate();
    console.log(C.expression);
    test("Internal representation of '.2+.6' is represented as [0.2, '+', 0.6]", C.expression, [0.2, '+', 0.6]);
}
{ // get rid of leading zeros
    const C = NewCalc();
    addChars(C, "02+02");
    C.evaluate();
    console.log(C.expression);
    test("Internal representation of '02+02' is [2, '+', 2]", C.expression, [2, '+', 2]);
}
{ // get rid of leading zeros 1
    const C = NewCalc();
    addChars(C, "02");
    // C.evaluate();
    console.log(C.expression);
    test("Display of '02' is '2'", C.display, "2");
}

{ // get rid of leading zeros 2
    const C = NewCalc();
    addChars(C, "0.2");
    // C.evaluate();
    console.log(C.expression);
    test("Display of '0.2' is '0.2'", C.display, "0.2");
}

{ // get rid of leading zeros 3
    const C = NewCalc();
    addChars(C, "0002000");
    // C.evaluate();
    console.log(C.expression);
    test("Display of '0002000' is '2000'", C.display, "2000");
}

{ // get rid of leading zeros 4
    const C = NewCalc();
    addChars(C, ".1+2.000+0.345");
    C.evaluate();
    // console.log("POST EVAL:",C.expression);
    test("Display of '.1+2.000+0.345' is '0.1+2.0+0.345'", C.display, "0.1+2+0.345");
}
{ // get rid of leading zeros 5
    const C = NewCalc();
    addChars(C, ".1+2.000+0.345");
    C.evaluate();
    // console.log("POST EVAL:",C.expression);
    test("Internal representation of '.1+2.000+0.345' is '0.1+2.0+0.345'", C.expression, [0.1, "+", 2, "+", 0.345]);
}


