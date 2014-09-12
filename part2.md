Part 2: Circular Dependency
===========================

First I tried setting up an arbitrary recursion limit with a counter in the constructor as 2 class properties.
I got a more accurate answer, without having to detect the circular dependency. 
I noticed I could adjust the recursion limit higher until I got closer and closer to the expected solution of <b>297.75</b>.

But I feel like this is depending on an expected answer, and not what we are looking for, so I scrapped that idea.

Next I tried to detect the circular dependency by parsing the formulas in the param loop, but this seemed to compound the infinity paradox, digging deeper and deeper in the opposite direction.

Then simplicity hit me like a ton of bricks:

To detect the circular dependency, I just kept track of two arrays. 
1 for pending calculations, 1 for leftovers to be recalculated. 

First I checked against pending calculations each time the method is called in the recursion loop. If the formula was already pending calculation, I returned false (just like invalid token), which evals as zero.

This took care of the infinite loop, and gave me a solution where $MonthlyPayment (and thus $CLDInsurance) initially resolved as zero, which yielded 290.37.

( https://github.com/jblossomweb/smartdealer/commit/5ef288b5a01b2efa3b021a2ff6a0b29f8c4a89e9 )

Next I expanded on this by checking for leftovers, and plugging in the newly calculated value as a param, then calling the exact same calculate method. My gut instinct was that this seemed a little inefficient, but so is introducing circular dependency to begin with, so I gave it a shot: 

```js
var solution = eval(calculate);
if(this.calculating.length === 0 && this.leftovers.length > 0){
    params[formula] = solution;
    solution = eval(this.Calculate(formula,params));
}
return solution;
```

This, not surprisingly, introduced a brand new infinite recursion loop (and broken Chrome tab), but curiously enough, the param of `monthlyPayment` that was added to the params array was displaying precisely the value we need (<b>297.7481624....</b>). 

So I tried to clear the leftovers array:
```js
this.leftovers = [];
```
Which stopped the loop, but gave me a solution of ~ <b>297.57</b>. Closer, but still no cigar.

Then I noticed that when I did NOT clear the leftovers, although it seemed instantaneous, the monthlyPayment param's apparent accuracy was because my log showed the 200th or so recursion by the time I could see it. 

Clearing the leftovers array had simply given my the value after the first recursion. Makes sense.

I outputted a counter to the console. Scrolled to the top, and deduced that in this particular case, it took about 4 recursions to get an answer that would subsequently be the same up to 2 decimal places, which would be the acceptable precision in this case. By the 10th recursion, it was so precise, the value looked the same due to the debugger rounding at 14 decimal places.

So it was a matter of exiting the loop at the right moment, confirming a duplicate value at a precision that was acceptable, meaning 2 decimal places, because it's money. We really shouldn't assume this, so ideally I'd want to take in a precision parameter or formatting string. I decided on a precision parameter called `decimals`, with a default value:

```js
Calculator.prototype.Calculate = function(formula,params,decimals){
   decimals = (typeof(decimals) === 'number' && (decimals%1) === 0) ? decimals : 2;
   ....
```

I also kept a memory property for the class, and cleared it when it was no longer needed, so the object could be re-used.

The full commit:

https://github.com/jblossomweb/smartdealer/commit/aa6ca3682512c568247d56561bd30569fdb9083d

snapshot of the class at this commit:

```js
var Calculator = function(formulas) {
	this.formulas = [];
  	for(var formula in formulas){
  		this.formulas[formula] = formulas[formula];
  	}
  this.calculating = [];
  this.leftovers = [];
  this.memory = [];
};
Calculator.prototype.Calculate = function(formula,params,decimals){
  decimals = (typeof(decimals) !== 'undefined' && (decimals%1) === 0) ? decimals : 2; //default
  if(this.calculating.indexOf(formula) !== -1) { // circular dependency
    this.leftovers.push(formula);
    return false;
  }
  this.calculating.push(formula);
	var calculate = this.formulas[formula];
  if(typeof(calculate) === 'undefined') return false; //invalid formula
	for(var param in params){
  		calculate = calculate.replace(new RegExp('\\$'+param,'g'),params[param]);
  	}
  	if(calculate.indexOf('$') !== -1){
  		var vars = calculate.match(new RegExp('\\$(\\w+)','g'));
  		for (var i in vars){
  			calculate = calculate.replace(new RegExp('\\'+vars[i],'g'),this.Calculate(vars[i].substr(1),params,decimals));
  		}
  	}
    this.calculating.splice(this.calculating.indexOf(formula),1);
    var solution = eval(calculate);
    //check for CD leftovers if done with all calculations
    if(this.calculating.length === 0 && this.leftovers.length > 0){
      params[formula] = solution;
      if(this.memory[formula] === solution.toFixed(decimals)){
         // we have reached desired precision.
         this.leftovers.splice(this.leftovers.indexOf(formula),1);
         solution = this.memory[formula];
         this.memory = []; //clear memory so object is re-useable
      } else {
        this.memory[formula] = solution.toFixed(decimals);
        // recursively re-calculate until acceptable precision.
        solution = this.Calculate(formula,params,decimals);
      }
    }
  	return solution;
};
```

This yields the desired value of <b>297.75</b>

Once I did it, it seemed so simple (maybe even elegant), and I wondered why I was spinning my wheels.
