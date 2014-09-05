smartdealer
===========

Here is a JavaScript puzzle we'd like you to try to solve to prove how good you are. It shouldn't take more than an hour.


Write a JavaScript class using http://jsfiddle.net/ that can be used to calculate answers from a set of given formulas.

When you instantiate the JavaScript class, you give its constructor a parameter which lists the formulas. For example:

```js
var carPaymentCalc = new Calculator(
    {
        "MonthlyPayment": "$Factor*$MonthlyInterestRate/($Factor-1)*$FinAmt",
        "Factor": "Math.pow(1+$MonthlyInterestRate,$Term)",
        "MonthlyInterestRate": "$APR/100/12",
        "FinAmt": "$VehicleCost+$CLDInsurance"
    }
);
```

Then, you can call the Calculate method, giving some parameters needed by the formulas, to produce the answer. For example:

```js
var monthlyPayment = carPaymentCalc.Calculate(
    "MonthlyPayment",
    {
        "Term": 36,
        "APR": 2.9,
        "VehicleCost": 10000,
        "CLDInsurance": 200
    }
);
// monthlyPayment should be around 296.18
```

My solution for the class is less than 20 lines of JavaScript code, so if you're much over that, your solution is too complicated.

As a bonus (if you feel that was too easy), how would you change the class to handle a set of formulas that contain circular dependency? For example:

```js
var carPaymentCalc = new Calculator(
    {
        "MonthlyPayment": "$Factor*$MonthlyInterestRate/($Factor-1)*$FinAmt",
        "Factor": "Math.pow(1+$MonthlyInterestRate,$Term)",
        "MonthlyInterestRate": "$APR/100/12",
        "FinAmt": "$VehicleCost+$CLDInsurance",
        "CLDInsurance": "$MonthlyPayment*$CLDCentsPerKPerDay/100000*$Term*30"
    }
);
var monthlyPayment = carPaymentCalc.Calculate(
    "MonthlyPayment",
    {
        "Term": 36,
        "APR": 2.9,
        "VehicleCost": 10000,
        "CLDCentsPerKPerDay": 79
    }
);
// monthlyPayment should be around 297.75
```

If this is super easy for you, try the guru bonus round: write another method on the JavaScript class that does goal seek. For example:

```js
var termAtLowerMonthlyPayment = carPaymentCalc.GoalSeek(
    "Term",
    {
        "MonthlyPayment": 200
    },
    {
        "Term": 36, // this is a starting guess, but find term such that MonthlyPayment will be 200 instead of 296.18
        "APR": 2.9,
        "VehicleCost": 10000,
        "CLDCentsPerKPerDay": 79
    }
);
// termAtLowerMonthlyPayment should be around 54.84
```
