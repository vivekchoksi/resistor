
ResistorCalculator.COLOR_VALUES = {	
	"black" : 0, 
	"brown" : 1, 
	"red" : 2,
	"orange" : 3,
	"yellow" : 4,
	"green" : 5,
	"blue" : 6,
	"purple" : 7,
	"gray" : 8,
	"white" : 9
};

ResistorCalculator.TOLERANCES = {
	"brown" : 1, // ±1%,
	"red" : 2,
	"gold" : 5, 
	"silver" : 10
}

ResistorCalculator.COLOR_ALIASES = {	
	"blk" : "black",
	"grey" : "gray",
	"violet" : "purple",
};


ResistorCalculator.DEFAULT_TEXT = "Ex: br Black r";

ResistorCalculator.DEFAULT_COLORS = ["brown", "black", "red", "gold"]

function ResistorCalculator(id, imgcontainer){	// TODO: create a button saying "show more info"?

	/* Create new elements */
	this.inputcode = document.getElementById(id);
	this.inputcode.style.color = "#888";
	this.inputcode.value = ResistorCalculator.DEFAULT_TEXT;

	this.responsetext = document.createElement("P");
	this.responsetext.className = "responsetext";
	this.inputcode.parentNode.appendChild(this.responsetext);

	var container = document.getElementById(imgcontainer);

	this.stripes = [];
	for (var i = 0; i < 4; i++){
		this.stripes[i] = document.createElement("DIV");
		this.stripes[i].id = "stripe" + i.toString();
		container.appendChild(this.stripes[i]);
	}

	this.displayDefaults();

	/* Event handlers */
	var obj = this;
	this.inputcode.onkeyup = function(){
		obj.displayResistance();
	}
	this.inputcode.onfocus = function(){
		obj.inputcode.style.color = "#000";
		if (obj.inputcode.value == ResistorCalculator.DEFAULT_TEXT) obj.inputcode.value = "";
		obj.displayResistance();
	}
	this.inputcode.onblur = function(){
		obj.inputcode.style.color = "#888";
		if (obj.inputcode.value == "") obj.displayDefaults();
	}
}

ResistorCalculator.prototype.displayResistance = function(){

	/* Grab input text as array into colorcode */
	var colorcode = this.inputcode.value.toLowerCase().split(" "); 
	colorcode = ResistorCalculator.removeSpaces(colorcode);

	var vals = [];
	var validinput = true; 	

	var iterations = (colorcode.length == 4) ? 4 : 3;

	/* Validate user input and translate each color to a numeric value */
	for (var i = 0; i < iterations; i++){
		colorcode[i] = (i == 3) ? ResistorCalculator.getColor(colorcode[i], ResistorCalculator.TOLERANCES) : ResistorCalculator.getColor(colorcode[i], ResistorCalculator.COLOR_VALUES, ResistorCalculator.COLOR_ALIASES);
		if (colorcode[i] == false)
			validinput = false;
		else
			vals[i] = (i == 3) ? ResistorCalculator.TOLERANCES[colorcode[i]] : ResistorCalculator.COLOR_VALUES[colorcode[i]];

		this.displayColor(i, colorcode[i]);
	}

	/* If the user didn't input the tolerance band color */
	if (colorcode.length < 4)
		this.displayColor(3, ResistorCalculator.DEFAULT_COLORS[3]);

	if (colorcode.length !=3 && colorcode.length != 4)
		validinput = false;

	if (validinput)
		this.responsetext.innerHTML = ResistorCalculator.formatValue(vals);
	else
		this.responsetext.innerHTML = "Expecting three color bands <br /><span class='small'>(and optional tolerance band)...</span>"
}

ResistorCalculator.formatValue = function(vals){
	var tolerance = "";
	if (vals.length == 4) tolerance = " (with tolerance of &plusmn;" + vals[3] + "%)";

	var value = (vals[0] * 10 + vals[1]) * Math.pow(10, vals[2]); 
	var valueAsString = value.toString();
	var ret = "";

	if (valueAsString.length > 6)
		ret = (value / 1000000) + " M"
	else if (valueAsString.length > 3)
		ret = (value / 1000) + " k";
	else ret = (value / 1000) + " ";

	return ret + "&Omega;" + tolerance;
}

/* Change the color of a band */
ResistorCalculator.prototype.displayColor = function(index, color){
	color = (color == undefined) ? "" : color;
	var myStripe = document.getElementById("stripe" + index.toString());
	myStripe.className = (index == 3) ? "stripe tol " + color : "stripe " + color;
}

/* Strip the user input text array of empty strings */
ResistorCalculator.removeSpaces = function (colorcode) {	// change to static function? 
	var index = colorcode.indexOf("");
	while (index != -1){
		colorcode.splice(index, 1);
		index = colorcode.indexOf("");
	}
	return colorcode;
}

ResistorCalculator.prototype.displayDefaults = function(){
	this.responsetext.innerHTML = "Type in the resistor's color code!";	
	this.inputcode.value = ResistorCalculator.DEFAULT_TEXT;
	for (var i = 0; i < 4; i++){
		var myStripe = document.getElementById("stripe" + i.toString());
		myStripe.className = (i == 3) ? "stripe tol " + ResistorCalculator.DEFAULT_COLORS[i] : "stripe "  + ResistorCalculator.DEFAULT_COLORS[i];
	}
}

/* Translate user input to a standard color name */
ResistorCalculator.getColor = function(input, arr, aliases){
	for (var key in arr){
		if (key.indexOf(input) == 0)
			return key;
	}
	for (var key in aliases){
		if (key.indexOf(input) == 0)
			return aliases[key];
	}
	return false;
}
