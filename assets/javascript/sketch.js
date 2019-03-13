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


app.signIn = function() {
    // Get `GoogleAuth` instance
    var auth2 = gapi.auth2.getAuthInstance();

    // Sign-In
    auth2.signIn()
        .then(changeProfile);
};

/**
 * Trigger sign-out using Google Sign-In
 */
app.signOut = function() {
    // Get `GoogleAuth` instance
    var auth2 = gapi.auth2.getAuthInstance();

    // Sign-Out
    auth2.signOut()
        .then(changeProfile);
};

/**
 * Invoked when sign-in status is changed
 * @param  {GoogleUser} googleUser GoogleUser object obtained upon
 *                                 successful authentication
 */
var changeProfile = function(googleUser) {
    // See if `GoogleUser` object is obtained
    // If not, the user is signed out
    if (googleUser) {

        // Get `BasicProfile` object
        var profile = googleUser.getBasicProfile();

        // Get user's basic profile information
        app.profile = {
            name: profile.getName(),
            email: profile.getEmail(),
            imageUrl: profile.getImageUrl()
        };

        app.fire('show-toast', {
            text: "You're signed in."
        });

        app.$.dialog.close();

    } else {
        // Remove profile information
        // Polymer will take care of the rest
        app.profile = null;
        app.fire('show-toast', {
            text: "You're signed out."
        });
    }
};

// Initialization:
// Add `auth2` module
gapi.load('auth2', function() {
    // Initialize `auth2`
    gapi.auth2.init().then(function(auth2) {

        // If the user is already signed in
        if (auth2.isSignedIn.get()) {
            var googleUser = auth2.currentUser.get();

            // Change user's profile information
            changeProfile(googleUser);
        }
    });
});

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
        "Beets",
        "Carrot ",
        "Corn",
        "Cucumber",
        "Lettuce",
        "Okra",
        "Peas",
        "Pepper",
        "Potato",
        "Spinach",
        "Tomato",
        "Watermelon"


    ];
    $("#plants").autocomplete({
        source: availableTags
    });
});