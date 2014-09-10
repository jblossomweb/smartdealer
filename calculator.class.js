var Calculator = function(formulas) {
	this.formulas = [];
  	for(var formula in formulas){
  		this.formulas[formula] = formulas[formula];
  	}
};
Calculator.prototype.Calculate = function(formula,params){
	var calculate = this.formulas[formula];
  if(typeof(calculate) === 'undefined'){
    return false; //invalid formula
  }
	for(var param in params){
  		calculate = calculate.replace(new RegExp('\\$'+param,'g'),params[param]);
  	}
  	if(calculate.indexOf('$') !== -1){
  		var vars = calculate.match(new RegExp('\\$(\\w+)','g'));
  		for (var i in vars){
  			calculate = calculate.replace(new RegExp('\\'+vars[i],'g'),this.Calculate(vars[i].substr(1),params));
  		}
  	}
  	return eval(calculate);
};