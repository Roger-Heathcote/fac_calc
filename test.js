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
    })
}
// TESTS
// TESTS
// TESTS

console.log(BLACKONYELLOW + "\nTESTS",CLEAR);

// BASIC
// BASIC
// BASIC
{
    const C = NewCalc()
    test("Check Default val of fresh instance is zero", C.equals, "0");
}
{
    const C = NewCalc();
    C.add_char("3");
    test("Check value of expression '3' is 3", C.equals, "3");
}

// PARSING
// PARSING
// PARSING

// Test parsing by looking at internal representations - needed during development, remove later
{
    const C = NewCalc();
    addChars(C, "123");
    C.evaluate();
    test("Internal representation of '123' is [123]", C.expression, [123]);
}
{
    const C = NewCalc();
    addChars(C, "123+");
    test("Internal representation of '123+' is [123, '+']", C.expression, [123,'+']);
}
{
    const C = NewCalc();
    addChars(C, "123+456+");
    test("Internal representation of '123+456+0' is [123, '+', 456, '+']", C.expression, [123,'+',456, '+']);
}
{
    const C = NewCalc();
    addChars(C, "12.3+456+1");
    test("Internal representation of '12.3+456+1' is [12.3, '+', 456, '+', '1']", C.expression, [12.3,'+',456, '+', '1']);
}
{
    const C = NewCalc();
    addChars(C, "123+-456-");
    test("Internal representation of '123+-456-' is [123, '+', -456, '-']", C.expression, [123, '+', -456, '-']);    
}

// Story #1 - Hard to test without dependencies
// Story #2 - Hard to test without dependencies
// Story #3 - Hard to test without dependencies
// Story #4 - Hard to test without dependencies
// Story #5 - Hard to test without dependencies
// Story #6 - Hard to test without dependencies

// Story #7 - Clear Function
// Story #7 - Clear Function
// Story #7 - Clear Function
{
    const C = NewCalc();
    C.clear();
    test("Check display is '0' after clearing", C.display, "0");
}
{
    const C = NewCalc();
    addChars(C, "123456789");
    test("Check display of expression '123456789' is '123456789'", C.equals, "123456789");
    C.clear();
    test("Check display is '0' after clearing", C.display, "0");
}

// Story #8 - Hard to test without dependencies

// Story #9 - Arithmetic
// Story #9 - Arithmetic
// Story #9 - Arithmetic
//
{
    const C = NewCalc();
    addChars(C, "3*2");
    test("Check expression '3*2' evaluates to '6'", C.equals, "6");
}
{
    const C = NewCalc();
    addChars(C, "2*3*3");
    test("Check expression '2*3*3' evaluates to '18'", C.equals, "18");
}
{
    const C = NewCalc();
    addChars(C, "2*9/3");
    test("Check expression '2*9/3' evaluates to '6'", C.equals, "6");
}
{
    const C = NewCalc();
    addChars(C, "1+1");
    test("Check expression '1+1' evaluates to '2'", C.equals, "2");
}
{
    const C = NewCalc();
    addChars(C, "0.0.2*50*050+25+50-24-100/000100");
    test("Check expression '0.0.2*50*050+25+50-24-100/000100' evaluates to '100'", C.equals, "100");
}
// Story #10 - Leading zeros
// Story #10 - Leading zeros
// Story #10 - Leading zeros

{ // get rid of leading zeros
    const C = NewCalc();
    addChars(C, "02+02");
    test("Internal representation of '02+02' is '2+2'", C.display, '2+2');
}
{ // get rid of leading zeros 1
    const C = NewCalc();
    addChars(C, "02");
    // C.evaluate();
    test("Display of '02' is '2'", C.display, "2");
}

{ // get rid of leading zeros 2
    const C = NewCalc();
    addChars(C, "0.2");
    // C.evaluate();
    test("Display of '0.2' is '0.2'", C.display, "0.2");
}

{ // get rid of leading zeros 3
    const C = NewCalc();
    addChars(C, "0002000");
    // C.evaluate();
    test("Display of '0002000' is '2000'", C.display, "2000");
}

{ // get rid of leading zeros 4
    const C = NewCalc();
    addChars(C, ".1+2.000+0.345");
    // console.log("POST EVAL:",C.expression);
    test("Display of '.1+2.000+0.345' is '0.1+2.0+0.345'", C.display, "0.1+2+0.345");
}

// Story #11 - Decimal points
// Story #11 - Decimal points
// Story #11 - Decimal points

{ // make sure multiple decimal points are ignored
    const C = NewCalc();
    addChars(C, "1.2.3+4.5.6");
    test("Internal representation of '1.2.3+4.5.6' is [1.23, '+', 4.56]", C.display, '1.23+4.56');
}

{ // make sure leading points are okay
    const C = NewCalc();
    addChars(C, ".2+.6+");
    test("Internal representation of '.2+.6' is [0.2, '+', 0.6]", C.display, '0.2+0.6+');
}

// Story #12 - Arithmetic on decimal fractions
// Story #12 - Arithmetic on decimal fractions
// Story #12 - Arithmetic on decimal fractions
//
{
    const C = NewCalc();
    addChars(C, "2.5-0.5+1.5/0.5+100.0*0.15");
    test("Check expression '2.5-0.5+1.5/0.5+100.0*0.15' evaluates to '20'", C.equals, "20");
}
{
    const C = NewCalc();
    addChars(C, "0.0.004+.0006*6+25/5/4*.3+8-0.5*1.0.02-0.3+4*2.134/0.5/2.6/0.8*0.9+0.0350769231");
    test("Check expression '0.0.004+.0006*6+25/5/4*.3+8-0.5*1.0.02-0.3+4*2.134/0.5/2.6/0.8*0.9+0.0350769230' evaluates to '15'", C.equals, "15");
}

// Story #13 - No duplicate operators except minus
// Story #13 - No duplicate operators except minus
// Story #13 - No duplicate operators except minus
{
    const C = NewCalc();
    addChars(C, "123+*456");
    // No operator dupes
    test("Display of expression '123+*456' is '123*456'", C.display, '123*456');
}
{
    const C = NewCalc();
    addChars(C, "123+-456");
    // No operator dupes EXCEPT negative numbers
    test("Display of expression '123+-456' is '123+-456'", C.display, '123+-456');
}
{
    const C = NewCalc();
    addChars(C, "123--456");
    // No double negative
    test("Display of expression '123--456' is '123-456']", C.display, '123-456');
}
{
    const C = NewCalc();
    addChars(C, "123---456");
    // Nor triple negatives
    test("Display of expression '123---456' is '123-456'", C.display, "123-456");
}
{
    const C = NewCalc();
    addChars(C, "123-+//+--*+*--456");
    // Nor longer sequences of operators
    test("Display of '123-+//+--*+*--456' is '123*-456'", C.display, "123*-456");
}

// Story #14 - Operator after equals
// Story #14 - Operator after equals
// Story #14 - Operator after equals
//
// Starts new expression with result of last

{
    const C = NewCalc();
    addChars(C, "10*10");
    C.equals;
    // Should use previous result
    addChars(C, "*10")
    test("Check 10*10 = * 10 equals '1000'", C.equals, "1000");
}
{
    const C = NewCalc();
    addChars(C, "10*10");
    C.equals;
    // Should disgard previous result
    addChars(C, "10")
    test("Check 10*10 = 10 equals '10'", C.equals, "10");
}
{
    const C = NewCalc();
    addChars(C, "2*2.5*4+400/5");
    C.equals;
    // Should disgard previous result
    addChars(C, "+.1")
    test("Check 2*2.5*4+400/5 = 100.1 equals '100.1'", C.equals, "100.1");
}
{
    const C = NewCalc();
    addChars(C, "1*2.5*4+400/5");
    C.equals;
    // Should disgard previous result
    addChars(C, ".1")
    test("Check 1*2.5*4+400/5 = 0.1 equals '0.1'", C.equals, "0.1");
}

// Story #15 - Arithmetic precision >= 4 places
// Story #15 - Arithmetic precision >= 4 places
// Story #15 - Arithmetic precision >= 4 places

// We will use 10 decimal places of precision

{
    const C = NewCalc();
    addChars(C, "1/3");
    // Answer should be rounded to 10 places
    test("Check expression '1/3' evaluates to '0.3333333333'", C.equals, "0.3333333333");
}
{
    const C = NewCalc();
    addChars(C, "355/113");
    // Answer should be rounded to 10 places
    test("Check expression '355/113' evaluates to '3.1415929204'", C.equals, "3.1415929204");
}
