


var token = "";
//the array will hold all weather API data returned via multiple calls
var arrAll = [];
var startMonth;
//the array will hold the four consecutive nearest months numbers in th future
var fourMonths = [];
var availableTags = [];

//var wthrDay;
var latitude = "37.7749";
var longitude = "-122.4194";

//the arrays will hold monthly weather statistics
var arrMonthly01 = [];
var arrMonthly02 = [];
var arrMonthly03 = [];
var arrMonthly04 = [];

//retrieve the plant's data from the firebase db or Trefle api
var reqTempMinC = 15;
var reqTempOptRange;
var optPhRange;

//boollean vars to hold wether it is ok or not to plant a plant the corresponding month based on monthly min temps
var okPlantMinTempMonth01;
var okPlantMinTempMonth02;
var okPlantMinTempMonth03;
var okPlantMinTempMonth04;

var config = {
    apiKey: "AIzaSyB6QHUTluMJJPvnd2jh7uGY3CdHt_Mhkzk",
    authDomain: "what2grow-1df35.firebaseapp.com",
    databaseURL: "https://what2grow-1df35.firebaseio.com",
    projectId: "what2grow-1df35",
    storageBucket: "what2grow-1df35.appspot.com",
    messagingSenderId: "839354123990"
};

firebase.initializeApp(config);

var database = firebase.database();

var trefleKey = "QythcWY2bk1NVlVvemFRbUFCRmEyUT09";
var veggies = [

    // Cold Weather

    {
        name: "Carrot",
        url: "http://trefle.io/api/plants/127362?token=" + trefleKey,
        minTemp: 5,
        optimalTemp: 22,
        maxTemp: 30,
        minPh: 5.5,
        maxPh: 6.5,
        daysToHarvest: 70,
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: false,
        },
        plantingDensity: {
            greenhouse: false,
            field: 30
        }

    },

    {
        name: "Beets",
        url: "http://trefle.io/api/plants/111288?token=" + trefleKey,
        minTemp: 5,
        optimalTemp: 22,
        maxTemp: 30,
        minPh: 5.5,
        maxPh: 6.5,
        daysToHarvest: 70,
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: false,
        },
        plantingDensity: {
            greenhouse: false,
            field: 30
        }

    },

    {
        name: "Lettuce",
        url: "http://trefle.io/api/plants/147167?token=" + trefleKey,
        minTemp: 5,
        optimalTemp: 20,
        maxTemp: 30,
        minPh: 5.5,
        maxPh: 6.5,
        daysToHarvest: {
            baby: 28,
            fullSize: 55,
        },
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: true,
        },
        plantingDensity: {
            greenhouse: 50,
            field: 25,
        }
    },

    {
        name: "Spinach",
        url: "http://trefle.io/api/plants/183722?token=" + trefleKey,
        minTemp: 2,
        optimalTemp: 18,
        maxTemp: 25,
        minPh: 5.5,
        maxPh: 6.5,
        daysToHarvest: {
            baby: 28,
            fullSize: 55,
        },
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: true,
        },
        plantingDensity: {
            greenhouse: 50,
            field: 25,
        }
    },


    // Medium Weather


    {
        name: "Tomato",
        url: "http://trefle.io/api/plants/182512?token=" + trefleKey,
        minTemp: 10,
        optimalTemp: 25,
        maxTemp: 35,
        minPh: 6.0,
        maxPh: 6.5,
        daysToHarvest: 80,
        plantingMethond: {
            seed: true,
            cutting: true,
            transplant: true
        },
        plantingDensity: {
            greenhouse: 4,
            field: 2
        }
    },

    {
        name: "Corn",
        url: "http://trefle.io/api/plants/193519?token=" + trefleKey,
        minTemp: 10,
        optimalTemp: 28,
        maxTemp: 40,
        minPh: 6.0,
        maxPh: 6.5,
        daysToHarvest: 75,
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: false,
        },
        plantingDensity: {
            greenhouse: false,
            field: 8,
        }
    },

    {
        name: "Peas",
        url: "http://trefle.io/api/plants/167361?token=" + trefleKey,
        minTemp: 5,
        optimalTemp: 22,
        maxTemp: 30,
        minPh: 6.0,
        maxPh: 6.5,
        daysToHarvest: 75,
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: false,
        },
        plantingDensity: {
            greenhouse: false,
            field: 40,
        }
    },

    {
        name: "Pepper",
        url: "http://trefle.io/api/plants/115653?token=" + trefleKey,
        minTemp: 15,
        optimalTemp: 25,
        maxTemp: 30,
        minPh: 6.0,
        maxPh: 6.5,
        daysToHarvest: 75,
        plantingMethond: {
            seed: true,
            cutting: true,
            transplant: true,
        },
        plantingDensity: {
            greenhouse: 4,
            field: 2,
        }
    },

    // Warm Weather

    {
        name: "Cucumber",
        url: "http://trefle.io/api/plants/125316?token=" + trefleKey,
        minTemp: 15,
        optimalTemp: 28,
        maxTemp: 40,
        minPh: 5.5,
        maxPh: 6.5,
        daysToHarvest: 52,
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: true,
        },
        plantingDensity: {
            greenhouse: 4,
            field: 2,
        }
    },

    {
        name: "Okra",
        url: "http://trefle.io/api/plants/101110?token=" + trefleKey,
        minTemp: 18,
        optimalTemp: 32,
        maxTemp: 40,
        minPh: 5.5,
        maxPh: 6.5,
        daysToHarvest: 55,
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: true,
        },
        plantingDensity: {
            greenhouse: 4,
            field: 2,
        }
    },

    {
        name: "Watermelon",
        url: "http://trefle.io/api/plants/121034?token=" + trefleKey,
        minTemp: 18,
        optimalTemp: 32,
        maxTemp: 40,
        minPh: 5.5,
        maxPh: 6.5,
        daysToHarvest: 80,
        plantingMethond: {
            seed: true,
            cutting: false,
            transplant: true,
        },
        plantingDensity: {
            greenhouse: false,
            field: .25,
        }
    },
    {
        name: "Potato"
    }
]














// <---------------------------------------------------------------- Max (Line 300-520) ------------------------------------------------------------------------------------>

var vegetables = database.ref().child('Vegetables')

// code for setting data to firebase database. Only needs to be run once
// for (var i = 0; i < veggies.length; i++) {
//     vegetables.child(veggies[i].name).set(veggies[i]);
// }

for (var i = 0; i < veggies.length; i++) {
    database.ref('Vegetables/' + veggies[i].name).once("value", function (snapshot) {
        console.log(snapshot.val())
        availableTags.push(snapshot.val().name);
    })
}


// $("submitbutton").on("click", function () {
    // var plant = $("#plants").val();
    var plant = "Beets"
    var daysToHarvest;
    var maxPh;
    var minPh;
    var minReqTempC;
    var optimalTemp;
    var plantingField;
    var plantingGreen;
    var cutting;
    var seed;
    var transplant;

    database.ref('Vegetables/' + plant).once("value", function (snapshot) {
        daysToHarvest = snapshot.val().daysToHarvest;
        maxPh = snapshot.val().maxPh;
        minPh = snapshot.val().minPh;
        minReqTempC = snapshot.val().minTemp;
        optimalTemp = snapshot.val().optimalTemp;
        plantingField = snapshot.val().plantingDensity.field;
        plantingGreen = snapshot.val().plantingDensity.greenhouse;
        cutting = snapshot.val().plantingMethod.cutting;
        seed = snapshot.val().plantingMethod.seed;
        transplant = snapshot.val().plantingMethod.transplant;

    })

// })

