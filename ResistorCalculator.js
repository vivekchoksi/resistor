// FIXME: user can't instantiate 2 RCs b/c band ids wouldn't be unique. 
// could fix prototype methods to go away; instead return a value


/* Constructor function.
 * @param inputField id for the input element where the user types band colors
 * @param imgContainer id of div that will contain the resistor graphics
 * @param resultText id of the element that will display resistance
 */
function ResistorCalculator(inputField, imgContainer, resultText){

    // Store relevant elements on the object 
    this.inputField = document.getElementById(inputField);
    this.resultText = document.getElementById(resultText);
    var imgContainer = document.getElementById(imgContainer);

    this.idPrefix = ResistorCalculator.getId();

    // Create new divs representing color bands
    this.bands = [];
    for (var i = 0; i < 4; i++){
        this.bands[i] = document.createElement("DIV");
        this.bands[i].id = "band" + i.toString();
        imgContainer.appendChild(this.bands[i]);
    }

    this.displayDefaults();

    // Handle events
    var obj = this;
    var isDefaultText = true;
    this.inputField.onkeyup = function(){
        obj.displayResistance();
    };
    this.inputField.onfocus = function(){
        // Clear the input field *only* if it is displaying the
        // default text that the user did not type.
        if (isDefaultText) {
            obj.inputField.value = "";
            isDefaultText = false;
        }

        obj.inputField.style.color = "#000";
        obj.displayResistance();
    };
    this.inputField.onblur = function(){
        obj.inputField.style.color = "#888";
        if (obj.inputField.value == "") {
            obj.displayDefaults();
            isDefaultText = true;
        }
    };
};

ResistorCalculator.prototype.displayResistance = function(){

    // Grab input text as array into inputColors
    var inputColors = this.inputField.value.toLowerCase().split(" "); 
    inputColors = Array.removeSpaces(inputColors);

    var vals = [];
    var isValidInput = true;  

    var iterations = (inputColors.length == 4) ? 4 : 3;

    // Validate user input and translate each color to a numeric value
    for (var i = 0; i < iterations; i++){
        inputColors[i] = (i == 3) ? ResistorCalculator.getColor(inputColors[i], ResistorCalculator.TOLERANCES) : ResistorCalculator.getColor(inputColors[i], ResistorCalculator.COLOR_VALUES, ResistorCalculator.COLOR_ALIASES);
        if (inputColors[i] == false)
            isValidInput = false;
        else
            vals[i] = (i == 3) ? ResistorCalculator.TOLERANCES[inputColors[i]] : ResistorCalculator.COLOR_VALUES[inputColors[i]];

        this.displayColor(i, inputColors[i]);
    }

    // If the user didn't input the tolerance band's color, display its default color
    if (inputColors.length < 4)
        this.displayColor(3, ResistorCalculator.DEFAULT_COLORS[3]);

    if (inputColors.length !=3 && inputColors.length != 4)
        isValidInput = false;

    if (isValidInput)
        this.resultText.innerHTML = ResistorCalculator.formatValue(vals);
    else
        this.resultText.innerHTML = "Expecting three color bands <br /><span class='small'>(and optional tolerance band)...</span>";
};

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
};

/* Change the color of a band */
ResistorCalculator.prototype.displayColor = function(index, color){
    color = (color == undefined) ? "" : color;
    var myBand = document.getElementById("band" + index.toString());
    myBand.className = (index == 3) ? "band tol " + color : "band " + color;
};

/* Strip an array of empty strings */
Array.removeSpaces = function (arr) {
    var index = arr.indexOf("");
    while (index != -1){
        arr.splice(index, 1);
        index = arr.indexOf("");
    }
    return arr;
};

ResistorCalculator.prototype.displayDefaults = function(){
    this.resultText.innerHTML = "Type in the resistor's color code!"; 
    this.inputField.value = ResistorCalculator.DEFAULT_TEXT;
    this.inputField.style.color = "#888";
    for (var i = 0; i < 4; i++){
        var myBand = document.getElementById("band" + i.toString());
        myBand.className = (i == 3) ? "band tol " + ResistorCalculator.DEFAULT_COLORS[i] : "band "  + ResistorCalculator.DEFAULT_COLORS[i];
    }
};

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
};

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
    "brown" : 1, // plus or minus 1 percent,
    "red" : 2,
    "gold" : 5, 
    "silver" : 10
};

ResistorCalculator.COLOR_ALIASES = {
    "blk" : "black",
    "brn" : "brown",
    "grn" : "green",
    "grey" : "gray",
    "violet" : "purple"
};

ResistorCalculator.DEFAULT_TEXT = "Ex: br Black r";

ResistorCalculator.DEFAULT_COLORS = ["brown", "black", "red", "gold"];