var WordClock = {
	"grid" : [
		["F","I","T","M","I","S","E","R","F","I","R","E"],
		["I","T","T","W","E","N","T","Y","I","W","A","Y"],
		["L","E","E","H","A","L","F","A","V","O","R","S"],
		["L","A","N","Q","U","A","R","T","E","R","E","D"],
		["U","L","A","M","I","N","U","T","E","S","U","M"],
		["P","A","T","T","I","E","S","T","H","R","E","E"],
		["A","P","O","R","T","F","I","V","E","O","L","O"],
		["S","P","I","T","W","O","X","N","I","N","E","C"],
		["T","L","O","V","E","U","R","U","G","E","V","L"],
		["U","E","A","R","L","R","A","T","H","Y","E","O"],
		["R","I","S","E","V","E","N","O","T","E","N","C"],
		["E","R","I","V","E","T","E","R","N","I","C","K"]
	],
	"classes" : {
		/*
			Identifies where the class should be applied; array items are:
			* Row of first letter (zero-based)
			* Column of first letter (zero-based)
			* Direction ("H" = horizontal [down]; "V" = vertical [across])
			* Number of characters
		*/
		"a" :                 [  1, 10, "H",  1 ],
		"h1" :                [  6,  9, "V",  3 ],
		"h2" :                [  7,  3, "H",  3 ],
		"h3" :                [  5,  7, "H",  5 ],
		"h4" :                [  6,  5, "V",  4 ],
		"h5" :                [  6,  5, "H",  4 ],
		"h6" :                [  5,  6, "V",  3 ],
		"h7" :                [ 10,  2, "H",  5 ],
		"h8" :                [  6,  8, "V",  5 ],
		"h9" :                [  7,  7, "H",  4 ],
		"h10" :               [ 10,  8, "H",  3 ],
		"h11" :               [  5, 10, "V",  6 ],
		"h0" :                [  6,  4, "V",  6 ],
		"is" :                [  0,  4, "H",  2 ],
		"it" :                [  0,  1, "H",  2 ],
		"m5" :                [  0,  8, "V",  4 ],
		"m10" :               [  1,  2, "V",  3 ],
		"quarter" :           [  3,  3, "H",  7 ],
		"m20" :               [  1,  2, "H",  6 ],
		"half" :              [  2,  3, "H",  4 ],
		"minutes" :           [  4,  3, "H",  7 ],
		"oclock" :            [  6, 11, "V",  6 ],
		"past" :              [  5,  0, "V",  4 ],
		"to" :                [  5,  2, "V",  2 ],
		"invisibleBorder_1" : [  0,  0, "V",  1 ],
		"invisibleBorder_2" : [  1,  1, "V", 11 ],
		"invisibleBorder_3" : [ 11,  0, "H",  4 ],
		"invisibleBorder_4" : [  5,  4, "H",  1 ],
		"invisibleBorder_5" : [ 11,  5, "H",  6 ],
		"invisibleBorder_6" : [  4, 11, "H",  1 ]
	}
}

var lineSize;
var timeNow;

function StartClock() {
	
	var screenHeight = $( window ).height();
	var screenWidth = $( window ).width();
	var screenMin = Math.min( screenHeight, screenWidth );
	var fontSize = screenMin * 0.04;
	var cellSize = screenMin * 0.06;
	lineSize = screenMin * .005;

	$( "#DivTable" ).empty();
	for ( var r = 0; r < WordClock["grid"].length; r++ ) {
		var thisRowDiv = "<div id=\"r" + r + "\" class=\"DivTableRow\">";
		$( "#DivTable" ).append( thisRowDiv );
		for ( var c = 0; c < WordClock["grid"][r].length; c++ ) {
			var thisCellDiv = "<div id=\"r" + r + "c" + c + "\" class=\"DivTableCell\">" + WordClock["grid"][r][c] + "</div>";
			$( "#r" + r ).append( thisCellDiv );
		}
	}

	for ( var thisClass in WordClock["classes"] ) {
		var thisRow = WordClock["classes"][thisClass][0];
		var thisColumn = WordClock["classes"][thisClass][1];
		var thisDirection = WordClock["classes"][thisClass][2];
		var thisCharacterCount = WordClock["classes"][thisClass][3];
		var thisDisplayClass = thisClass.replace ( /_\d+?$/, "" );
		for ( var i = 0; i < thisCharacterCount; i++ ) {
			$( "#r" + thisRow + "c" + thisColumn ).addClass( thisDisplayClass );
			if ( thisDirection == "V" ) {
				thisRow++;
			} else {
				thisColumn++
			}
		}
	}
	
	// Resizing is best done after the grid is built.
	$( ".DivTableCell" ).css( "font-size", fontSize + "px" );
	$( ".DivTableCell" ).css( "min-width", cellSize + "px" );
	$( ".DivTableCell" ).css( "height", cellSize + "px" );
	var verticalOffset = $( "#DivTable" ).height() * -0.5;
	$( "#DivTable" ).css( "top", verticalOffset + "px" );
	$( ".invisibleBorder" ).css( "border-width", lineSize + "px" );
	
	thisURL = window.location.toString();
	var definedTime = false;
	var definedTimeMinutes;
	var definedTimeHours;
	if ( thisURL.indexOf( "?" ) > -1 ) {
		thisQueryString = thisURL.split( "?" );
		theseArguments = thisQueryString[1].split( "&" );
		for ( var i = 0; i < theseArguments.length; i++ ) {
			if ( theseArguments[i].slice( 0, 5 ).toUpperCase() == "TIME=" ) {
				thisTimeString = theseArguments[i].slice( 5 ).replace( /:|\.|,|-/g, "" );
				definedTimeMinutes = parseInt( thisTimeString.slice( -2 ) );
				definedTimeHours = parseInt( thisTimeString.slice( 0, -2 ) );
				if ( definedTimeHours <= 24 && definedTimeMinutes <= 59 ) {
					definedTimeHours = definedTimeHours % 12;
					definedTimeMinutes = PreviousFiveMinuteMark( definedTimeMinutes );
					definedTime = true;
				}
			}
		}
	}
	
	if ( definedTime == true ) {
		DisplayResults( definedTimeHours, definedTimeMinutes );
	} else {
		if ( typeof clockInterval !== "undefined" ) {
			clearInterval( clockInterval );
		}
		clockInterval = setInterval(
			function() {
				UpdateDisplay();
			},
			250
		);
	}

}

function UpdateDisplay() {
	
	nowTime = new Date();
	var nowHours = nowTime.getHours() % 12;
	var nowMinutes = nowTime.getMinutes();
	var nowSeconds = nowTime.getSeconds();
	var nowMilliseconds = nowTime.getMilliseconds();
	var cellsInGrid = $( ".DivTableCell" ).length;
	var displayMinutes = PreviousFiveMinuteMark( nowMinutes );
	var elapsedMinutes = nowMinutes - displayMinutes;
	var elapsedMilliseconds = ( elapsedMinutes * 60 * 1000 ) + ( nowSeconds * 1000 ) + nowMilliseconds;
	var grayLetterCount = Math.floor( ( elapsedMilliseconds / 300000 ) * ( cellsInGrid + 1 ) );
	//                                                        300000 = milliseconds in 5 minutes
	
	$( ".DivTableCell" ).removeClass( "grayLetter" );
	$( ".DivTableCell" ).slice( 0, grayLetterCount ).addClass( "grayLetter" );
	
	$( ".DivTableCell" ).removeClass( "wordCircle" );
	$( ".DivTableCell" ).removeClass( "wordTop" );
	$( ".DivTableCell" ).removeClass( "wordBottom" );
	$( ".DivTableCell" ).removeClass( "wordLeft" );
	$( ".DivTableCell" ).removeClass( "wordRight" );
	$( ".DivTableCell" ).removeClass( "wordVertical" );
	$( ".DivTableCell" ).removeClass( "wordHorizontal" );
	
	DisplayResults( nowHours, displayMinutes );
	
}

function DisplayResults( hours, minutes ) {
	DisplayClass( "it" );
	DisplayClass( "is" );
	switch ( minutes ) {
		case 0:
			DisplayClass( "oclock" );
			break;
		case 5:
			DisplayClass( "m5" );
			DisplayClass( "minutes" );
			DisplayClass( "past" );
			break;
		case 10:
			DisplayClass( "m10" );
			DisplayClass( "minutes" );
			DisplayClass( "past" );
			break;
		case 15:
			DisplayClass( "a" );
			DisplayClass( "quarter" );
			DisplayClass( "past" );
			break;
		case 20:
			DisplayClass( "m20" );
			DisplayClass( "minutes" );
			DisplayClass( "past" );
			break;
		case 25:
			DisplayClass( "m20" );
			DisplayClass( "m5" );
			DisplayClass( "minutes" );
			DisplayClass( "past" );
			break;
		case 30:
			DisplayClass( "half" );
			DisplayClass( "past" );
			break;
		case 35:
			DisplayClass( "m20" );
			DisplayClass( "m5" );
			DisplayClass( "minutes" );
			DisplayClass( "to" );
			hours = ( hours + 1 ) % 12;
			break;
		case 40:
			DisplayClass( "m20" );
			DisplayClass( "minutes" );
			DisplayClass( "to" );
			hours = ( hours + 1 ) % 12;
			break;
		case 45:
			DisplayClass( "a" );
			DisplayClass( "quarter" );
			DisplayClass( "to" );
			hours = ( hours + 1 ) % 12;
			break;
		case 50:
			DisplayClass( "m10" );
			DisplayClass( "minutes" );
			DisplayClass( "to" );
			hours = ( hours + 1 ) % 12;
			break;
		case 55:
			DisplayClass( "m5" );
			DisplayClass( "minutes" );
			DisplayClass( "to" );
			hours = ( hours + 1 ) % 12;
			break;
	}
	DisplayClass( "h" + hours );
}

function DisplayClass( className ) {
	var thisDirection = WordClock["classes"][className][2];
	var thisCharacterCount = WordClock["classes"][className][3];
	var firstClass;
	var middleClass;
	var lastClass;
	if ( thisDirection == "H" ) {
		firstClass = "wordLeft";
		middleClass = "wordHorizontal";
		lastClass = "wordRight";
	} else {
		firstClass = "wordTop";
		middleClass = "wordVertical";
		lastClass = "wordBottom";
	}
	$( "." + className ).removeClass( "grayLetter" );
	if ( thisCharacterCount == 1 ) {
		$( "." + className ).addClass( "wordCircle" );
	} else {
		$( "." + className ).slice( 0, 1 ).addClass( firstClass );
		$( "." + className ).slice( 1, ( thisCharacterCount - 1 ) ).addClass( middleClass );
		$( "." + className ).slice( -1 ).addClass( lastClass );
	}
	$( "." + className ).css( "border-width", lineSize + "px" );
}

function PreviousFiveMinuteMark( minutes ) {
	return( Math.floor( minutes / 5 ) * 5 );
}

