


var token = "";
//the array will hold all weather API data returned via multiple calls
var arrAll = [];
var startMonth;
//the array will hold the four consecutive nearest months numbers in th future
var fourMonths = [];


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

var root = firebase.database();
var vegetables = root.ref().child('Vegetables')

var veggies = [{
    name: "Tomato",
    minTemp: 20,
    maxTemp: 35,
    minPh: 5.5,
    maxPh: 6.5,
    daysToHarvest: 80,
    plantingMethod: {
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
    name: "Potato",
    temp: "something else"
},
{
    name: "Carrots",
    temp: "something"
},
{
    name: "Cabbage",
    temp: "something"
},
{
    name: "Corn",
    temp: "something"
}]

// for (var i = 0; i < veggies.length; i++) {
//     vegetables.child(veggies[i].name).set(veggies[i]);
// }

for (var i = 0; i < veggies.length; i++) {
    root.ref('Vegetables/' + veggies[i].name).once("value", function (snapshot) {
        console.log(snapshot.val())
    })
}















































































































































































































// <--------------------------------------------------------------------------- Halina (Line 300 onward) ------------------------------------------------------------------>

$.ajaxPrefilter(function (options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

$.ajax({
    url: "https://api.awhere.com/oauth/token",
    type: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic WEVHSTBLUndmY0d5MHJtTXdIck9vR1Y3MlZCR2h0Sng6T1R3RkdERzNuNlBTakdBdw==",
        'Access-Control-Allow-Origin': '*'
    },
    data: "grant_type=client_credentials"
}).then(function (response) {
    token = response.access_token;
    console.log(token);

    startMonth = moment().month();
    console.log("startMonth " + startMonth);

    //make 4 calls for 1 token

    for (var i = 1; i < 5; i++) {

        //build a mmdd range string for the request parameter from startday to endday
        var currMoment = moment();
        console.log(currMoment);
        startMonth = currMoment.month();


        console.log("startMonth " + currMoment.month()); 
        var futureMonth = moment().add(i, 'months').format('MM');

        //build the month range for the weather api and
        //store the four month numbers needed for research
        fourMonths.push(futureMonth);
        console.log(fourMonths);
        monthsRange = futureMonth + "-10," + futureMonth + "-20";
        console.log("mr: " + monthsRange);

        //make API call to get weather data for 10 days of each month
        $.ajax({
            url: "https://api.awhere.com/v2/weather/locations/37.7913017,-122.3943565/norms/" + monthsRange + "/years/2015,2018",
            //url: "https://api.awhere.com/v2/weather/locations/37.7913017,-122.3943565/norms/12-10,12-20/years/2015,2018",
            //url: "https://api.awhere.com/v2/agronomics/locations/37.7913017,-122.3943565/agronomicnorms/01-01,04-30",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(function (response) {
            console.log(response);

            for (var j = 0; j < 10; j++) {
                var wthrDay = {
                    day: response.norms[j].day,
                    maxHumidity: response.norms[j].maxHumidity.average,
                    maxTemp: response.norms[j].maxTemp.average,
                    meanTemp: response.norms[j].meanTemp.average,
                    minTemp: response.norms[j].minTemp.average,
                    precipitation: response.norms[j].precipitation.average

                };
                console.log(wthrDay);

                //we have to push all the data into one array because the call is asynchronous and there is no order related to months order
                arrAll.push(wthrDay);

            }
            console.log(arrAll); //the array is populated

            //call the function separating the array which holds all the data inside 'then' clause because the ajax call is async
            arrMonthly01.length=0;
            arrMonthly02.length=0;
            arrMonthly03.length=0;
            arrMonthly04.length=0;
            /*console.log("01 " + arrMonthly01);
            console.log("02 " + arrMonthly02);
            console.log("03 " + arrMonthly03);
            console.log("04 " + arrMonthly04); */
            
            separateArray(arrAll);

            console.log(arrMonthly01);
            console.log(arrMonthly02);
            console.log(arrMonthly03);
            console.log(arrMonthly04);  

            //call the function to check if there was a day in the month when a min temperature was below the temperature requirement for the plant
            //should we use a count to allow this function to run only once
            //isAllowedToPlantMinTemp(arrMonthly01);



        });
        console.log(arrAll); //the array will be empty because of the asynch          

    }    
  
});

//arrAll has all 4 months average daily weather data needed and now is the time to analyze it
//we can separate the array into 4 arrays by months first

function separateArray(arr) {

    console.log("length: " + arr.length)
    for (var i = 0; i < arr.length; i++) {

        if (arr[i].day.substring(0, 2) == fourMonths[0] && arrMonthly01.length < 10) {
            //console.log("0 day " + [i] + " " +  arr[i].day.substring(0, 2))
            arrMonthly01.push(arr[i])
        }
        else if (arr[i].day.substring(0, 2) == fourMonths[1] && arrMonthly02.length < 10) {
            //console.log("1 day " + [i] + " " +  arr[i].day.substring(0, 2))
            arrMonthly02.push(arr[i])
        }
        else if (arr[i].day.substring(0, 2) == fourMonths[2] && arrMonthly03.length < 10) {
            //console.log("2 day " + [i] + " " +  arr[i].day.substring(0, 2))
            arrMonthly03.push(arr[i])
        }
        else if (arr[i].day.substring(0, 2) == fourMonths[3] && arrMonthly04.length < 10) {
            //console.log("3 day " + [i] + " " +  arr[i].day.substring(0, 2))
            arrMonthly04.push(arr[i])
        }
    }

}

//this function returns true if daily min temeratures within a month were higher than the min required temperature for a plan 
//returns false otherwise
function isAllowedToPlantMinTemp (arr, minReqTemp) {

    for (var i = 0; i <= arr.length; i++) {
        if (arr[i].minTemp <=  minReqTemp) {
            return false;
        }

    }

    return true;

}




        //read the plant data from the firebase

        //check if the min temperature for each month data is not higher than the min tempearture required by a plant
        //for this run 4 loops for each month and check minTemp property for comparison


        //accumulate average for meanTemp.average for each month?

        //accumulate average for maxTemp.average for each month?