// var carPaymentCalc = new Calculator(
//     {
//         "MonthlyPayment": "$Factor*$MonthlyInterestRate/($Factor-1)*$FinAmt",
//         "Factor": "Math.pow(1+$MonthlyInterestRate,$Term)",
//         "MonthlyInterestRate": "$APR/100/12",
//         "FinAmt": "$VehicleCost+$CLDInsurance"
//     }
// );
// var monthlyPayment = carPaymentCalc.Calculate(
//     "MonthlyPayment",
//     {
//         "Term": 36,
//         "APR": 2.9,
//         "VehicleCost": 10000,
//         "CLDInsurance": 200
//     }
// );
// alert(monthlyPayment);//.toFixed(2));
// // monthlyPayment should be around 296.18

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

alert(monthlyPayment);
//monthlyPayment should be around 297.75

var termAtLowerMonthlyPayment = carPaymentCalc.GoalSeek(
    "Term",
    {
        "MonthlyPayment": 200
    },
    {
        "Term": 36, 

        // this is a starting guess, but find term such that MonthlyPayment will be 200 instead of 296.18
        "APR": 2.9,
        "VehicleCost": 10000,
        "CLDCentsPerKPerDay": 79
    }
);
// termAtLowerMonthlyPayment should be around 54.84

alert(termAtLowerMonthlyPayment); // I don't think this works for different params.
