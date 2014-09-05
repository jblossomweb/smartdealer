var carPaymentCalc = new Calculator(
    {
        "MonthlyPayment": "$Factor*$MonthlyInterestRate/($Factor-1)*$FinAmt",
        "Factor": "Math.pow(1+$MonthlyInterestRate,$Term)",
        "MonthlyInterestRate": "$APR/100/12",
        "FinAmt": "$VehicleCost+$CLDInsurance"
    }
);

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