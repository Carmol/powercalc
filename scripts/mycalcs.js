var NEWTON_CONSTANT = 9.81;

// Air density should be a form input parameter
var AIR_DENSITY_CONSTANT = 1.050;

var localStorageAvailable = typeof(localStorage) != "undefined";
var weight;
var inclination;
var speed;
var crr;
var position;

// ******************************************************************
// Document stuff
$(document).ready(function() {

    window.addEventListener("onload", init, false);
    //window.addEventListener("onbeforeunload", beforeUnLoad, false);
    
    //document.documentElement.requestFullScreen();

    init();
});

function init() {
    if (!localStorageAvailable) {
        setStatus("Key value storage is not supported");
        alert("Key value NOT storage supported");
    }
    else {
        document.body.addEventListener("storage", storageHandler, false);
        if (loadData()) {
            setPower();
        }
        else {
            alert("Data not loaded");
        }
    }
}

/*function beforeUnLoad() {
  alert("Before unLoad()");
  }*/

function loadData() {
    weight = checkRange(localStorage.weight);
    speed = checkRange(localStorage.speed);
    inclination = checkRange(localStorage.inclination);
    crr = checkRange(localStorage.crr);
    position = localStorage.position;

    $('#weightNumber').text(weight);
    // Here we just have to change the input type to something more
    // suitable.
    $('#dynWeight').html('<input type="range" min="40" max="150" id="weight"'
        + ' onChange="setValues()" value="' + weight + '" step="5"/>');

    $('#inclinationNumber').text(inclination);
    $('#dynInclination').html('<input type="range" min="0" max="15" id="inclination"'
        + ' onChange="setValues()" value="' + inclination + '" step="1.0" />');

    $('#speedNumber').text(speed);
    $('#dynSpeed').html('<input type="range" min="5" max="50" id="speed" '
        + ' onChange="setValues()" value="' + speed + '" step="1"/>');

    $('#crrNumber').text(crr);
    $('#dynCrr').html('<input type="range" min="0.002" max="0.004" step="0.0005" id="crr"'
        + ' onChange="setValues()" value="' + crr + '" width="300" height="10" />');

    var positionChoiceHTML = '<select name="position" id="position"'
        + ' onChange="setPower()">';

    positionChoiceHTML += (position == "up"
        ? '<option value="up" selected>Upright</option>'
        : '<option value="up">Upright</option>');
    positionChoiceHTML += (position == "brake_levers"
        ? '<option value="brake_levers" selected>Brake levers</option>'
        : '<option value="brake_levers">Brake levers</option>');
    positionChoiceHTML += (position == "bend"
        ? '<option value="bend" selected>Bend</option>'
        : '<option value="bend">Bend</option>');
    positionChoiceHTML += "</select>"
        $('#dynSpan').html(positionChoiceHTML);

    $('#power_title').text(calculatePower(weight, speed, inclination, crr, position)
        + " w").show();

    return true;
}

// ******************************************************************
// Housekeeping of data and values
function checkRange(value) {
    if (!value || !isNumber(value)) value = 0;

    return value;
}

function storeValues() {
    localStorage.setItem("weight", weight);
    localStorage.setItem("inclination", inclination);
    localStorage.setItem("speed", speed);
    localStorage.setItem("crr", crr);
    localStorage.setItem("position", position);

    return true;
}

function storageHandler(event) {
    var info = "A storage event occurred [" +
        "url=" + event.url + ", " +
        "key=" + event.key + ", " +
        "new value=" + event.event.newValue + ", " +
        "old value=" + event.event.oldValue + ", " +
        "window=" + event.event.window+ "]" + "";

    setStatus(info);
}

function setStatus(statusText) {
    var para = document.createElement("p");
    para.appendChild(document.createTextNode(statusText));
    document.getElementById("statusDiv").appendChild(para);
}

function setParameters() {
    weight      = $('#weight').val();
    inclination = $('#inclination').val();
    speed       = $('#speed').val();
    crr         = $('#crr').val();
    position    = $('#position').val();
}


function getPositionIndex(pos) {

    if (position == "up") return 0;
    if (position == "brake_levers") return 1;
    if (position == "bend") return 2;
}


function setValues() {

    $('#weightNumber').text(weight);
    $('#inclinationNumber').text(inclination);
    $('#crrNumber').text(crr);
    $('#speedNumber').text(speed);

    setPower();

    $('#weightNumber').text(weight);
    $('#inclinationNumber').text(inclination);
    $('#crrNumber').text(crr);
    $('#speedNumber').text(speed);
}

function setPower() {
    setParameters();

    //$('#value').text(calculatePower(weight, speed, inclination, crr, position)
    //        + " w").show();
    $('#position').selectedIndex = getPositionIndex(position);
    $('#power_title').text(calculatePower(weight, speed, inclination, crr, position)
            + " w").show();

    storeValues();
}

function isNumber(toCheck) {

    if (/[0-9\.\-]/.test(toCheck)) {
        return true;
    }
    else {
        return false;
    }
}

// The math
function pRollingResistance(weight, spd, grade, crr, position) {

    return crr * weight * NEWTON_CONSTANT * spd;
}

function pWind(weight, spd, grade, crr, position) {

    var Cd = 0.45;
    var A = 0.5;

    if (position == "up")          { Cd = 0.5; A = 0.6;  }
    if (position == "braek_lever") { Cd = 0.45; A = 0.5;  }
    if (position == "bend")        { Cd = 0.4; A = 0.45; }

    return /* 0.5 * */ AIR_DENSITY_CONSTANT * spd * spd * spd * Cd * A;
}

function pGravity(weight, spd, grade, crr, position) {

    return weight * NEWTON_CONSTANT * Math.sin(Math.atan(grade)) * spd;
}

function pAcceleration(weight, spd, grade, crr, position) {
    // We don't calculate this
    return 0;
}

// ******************************************************************
function calculatePower(weight, spd, inclination, crr, position) {

    var calc_speed = 1000 * spd / 3600;
    var calc_inclination = inclination / 100; // percent

    return Number((pRollingResistance(weight, calc_speed, calc_inclination, crr, position)
                + pWind(weight, calc_speed, calc_inclination, crr, position)
                + pGravity(weight, calc_speed, calc_inclination, crr, position)
                + pAcceleration(weight, calc_speed, calc_inclination, crr, position)).toFixed(0));
}
