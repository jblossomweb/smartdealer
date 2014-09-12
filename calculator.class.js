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
Calculator.prototype.GoalSeek = function(seek,goals,params,decimals){
  decimals = (typeof(decimals) !== 'undefined' && (decimals%1) === 0) ? decimals : 2; //default
  var increment = Math.pow(10,(0-decimals)); //increment based on desired precision (maybe use a different param).
  for(var goal in goals){ //for now, only returns for the first one if multiple
    var result = this.Calculate(goal,params,decimals);
    console.log("$"+parseFloat(result).toFixed(decimals)+" per month for "+parseFloat(params[seek]).toFixed(decimals)+" months");
    if(result !== goals[goal]){
      if(typeof(this.memory[params[seek]]) !== 'undefined'){
        this.memory = []; //clear memory so object is re-useable
        return parseFloat(params[seek]).toFixed(decimals);
      } else {
        this.memory[params[seek]] = result;
        if(result > goals[goal]){ //I don't think this is universal...
          params[seek] = params[seek]+increment;
        } else {
          params[seek] = params[seek]-increment;
        }
        return this.GoalSeek(seek,goals,params);
      }
    } else {
      this.memory = []; //clear memory so object is re-useable
      return parseFloat(params[seek]).toFixed(decimals);
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  }
};