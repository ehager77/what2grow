//js for animations or anything with p5 ignore
/*function setup() {
    createCanvas(windowWidth, windowHeight);
    console.log('starting');
  
}*/

//google sign in info 
function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

//geolocation with p5

// must be in HTTPS
function setup() {
    createCanvas(200, 50);
    console.log('starting');
    noStroke();
    // get position once
    if (!navigator.geolocation) {
        alert("navigator.geolocation is not available");
    }
    navigator.geolocation.getCurrentPosition(setPos);
}

function setPos(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    background(255, 255, 255);
    textSize(12);
    text("Current position: " + nf(lat, 2, 2) + " " + nf(lng, 2, 2), 10, height / 2)

}

//js for animations or anything with p5

//auto complete test
$(function() {
    var availableTags = [
        "Corn",
        "Potato ",
        "Tomato",
        "Carrot",
        "Cabbage",
        "Onion",


    ];
    $("#plants").autocomplete({
        source: availableTags
    });
});