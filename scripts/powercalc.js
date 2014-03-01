
/*
function myFocus(field)
{
	field.focus();
}

function nix() 
{
  myFocus($('weight'));
}
*/

$(document).ready(function()
{
	$('#inclination').focus();
	//myFocus($('inclination'));
	//window.setTimeout(nix, 2000);
});

//********************************************************************
//Some global   variables
var weight;
var speed;
var inclination;
var power;

// ******************************************************************
// The submission



$("#calculation").submit(function()
{
  alert("nix");
  return false;
});

/*
	if ($('#weight')) {
		var weightStr = $('#weight').val();
		if (weightStr != "") {
			weight = parseInt(weightStr);
		}
    else {
			alert("Weight is not ok");
			return false;
		}
	}
	if ($('#speed')) {
		var speedStr = $('#speed').val();
		if (speedStr != "") {
			speed = parseInt(speedStr);
		}
    else {
			alert("Speed is not ok");
			return false;
		}
	}
	if ($('#inclination')) {
		var inclinationStr = $('#inclination').val();
		if (inclinationStr != "") {
			inclination = parseInt(inclinationStr);
		}
    else {
			alert("Inclination is not ok");
			return false;
		}
	}
	var pp = speed * weight * inclination;

	$("#power").attr("value", pp);

	return false;
});

*/
