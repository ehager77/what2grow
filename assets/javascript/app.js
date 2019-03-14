


var token = "";
//the array will hold all weather API data returned via multiple calls
var arrAll = [];
var startMonth;
//the array will hold the four consecutive nearest months numbers in th future
var fourMonths = [];

var plants_arr = ["Beets", "Carrot", "Corn", "Cucumber", "Lettuce", "Okra", "Peas", "Pepper", "Potato", "Spinach", "Tomato", "Watermelon"];

var fourMonthSorted = [];
var latitude = "37.7749";
var longitude = "-122.4194";

//the arrays will hold monthly weather statistics
var arrMonthly01 = [];
var arrMonthly02 = [];
var arrMonthly03 = [];
var arrMonthly04 = [];

//retrieve the plant's data from the firebase db or Trefle api
var minReqTempC;
var reqTempOptC = 18;
var optPhRange;

//boollean vars to hold wether it is ok or not to plant a plant the corresponding month based on monthly min temps
var okPlantMinTempMonth01;
var okPlantMinTempMonth02;
var okPlantMinTempMonth03;
var okPlantMinTempMonth04;
var firstSuitableMonth = "NOT";
var firstOptimalMonth = "NOT";

var cards = [];
var count = 0;

var plant;
var daysToHarvest;
var maxPh;
var minPh;
var plantingField;
var plantingGreen;
var cutting;
var seed;
var transplant;

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

var vegetables = database.ref().child('Vegetables')

$.ajaxPrefilter(function (options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        $("#lat").text(latitude);
        $("#long").text(longitude);
    } else {
        $("#lat").text("Position defaulted to San Francisco");
    }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

//arrAll has all 4 months average daily weather data needed and now is the time to analyze it
//we can separate the array into 4 arrays by months first

function separateArray(arr) {

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].day.substring(0, 2) == fourMonths[0] && arrMonthly01.length < 10) {
            arrMonthly01.push(arr[i])
        }
        else if (arr[i].day.substring(0, 2) == fourMonths[1] && arrMonthly02.length < 10) {
            arrMonthly02.push(arr[i])
        }
        else if (arr[i].day.substring(0, 2) == fourMonths[2] && arrMonthly03.length < 10) {
            arrMonthly03.push(arr[i])
        }
        else if (arr[i].day.substring(0, 2) == fourMonths[3] && arrMonthly04.length < 10) {
            arrMonthly04.push(arr[i])
        }
    }
}

//this function returns true if daily min temeratures within a month were higher than the min required temperature for a plan 
//returns false otherwise
function isAllowedToPlantMinTemp(arr, minReqTemp) {
    for (var i = 0; i < arr.length; i++) {
        if (parseFloat(arr[i].minTemp) !== NaN) {
            if (parseFloat(arr[i].minTemp) < minReqTemp) {
                return false;
            }
        }
    }
    return true;
}

//the function returns true is the month is optimal for planting based on the monthly mean temperatures
function isAvrgTempOpt(arr, reqTempOpt) {

    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        if (parseFloat(arr[i].meanTemp) !== NaN) {
            sum = sum + parseFloat(arr[i].meanTemp);
        }
    }

    if (sum / 10 >= reqTempOpt) {
        return true;
    }
    else return false;
}

//returns monthly average min, max and mean temperatures 
function getMonthlyAverages(arr, month) {

    var sumMean = 0;
    var sumMax = 0;
    var sumMin = 0;
    for (var i = 0; i < arr.length; i++) {
        if (parseFloat(arr[i].meanTemp) !== NaN) {
            sumMean = sumMean + parseFloat(arr[i].meanTemp);
        }
        if (parseFloat(arr[i].maxTemp) !== NaN) {
            sumMax = sumMax + parseFloat(arr[i].maxTemp);
        }
        if (parseFloat(arr[i].minTemp) !== NaN) {
            sumMin = sumMin + parseFloat(arr[i].minTemp);
        }
    }
    if (sumMean !== NaN && sumMax !== NaN && sumMin !== NaN) {
        cards.push({
            month: moment(month, 'MM').format('MMMM'),
            mean: convertToFahrenheit(Math.round((sumMean / arr.length))),
            max: convertToFahrenheit(Math.round((sumMax / arr.length))),
            min: convertToFahrenheit(Math.round((sumMin / arr.length)))
        });
    }
    else {
        cards.push({
            month: moment(month, 'MM').format('MMMM'),
            mean: "No data",
            max: "No data",
            min: "No data"
        });
    }
}

//function to convert celsius to Fahrenheit
//using the formula: tF = ((tCel × 9/5) + 32)
function convertToFahrenheit(tC) {
    return ((tC * 9 / 5) + 32);
}

$("#location-button").on("click", function (event) {
    event.preventDefault();
    getLocation();
})

$("#plant-button").on("click", function (event) {
    event.preventDefault();

    if (plants_arr.includes($("#plants").val())) {
        plant = $("#plants").val();
        var plantUrl;

        // if (plant === "Corn") {
        //     database.ref('Vegetables/' + plant).once("value", function (snapshot) {
        //         plantUrl = snapshot.val().url;
        //     })

        //     $.ajax({
        //         url: plantUrl,
        //         method: "GET",
        //     }).then(function (response) {
        //         maxPh = response.main_species.growth.ph_maximum;
        //         minPh = response.main_species.growth.ph_minimum;
        //         minReqTempC = response.main_species.growth.temperature_minimum.deg_c;
        //         cutting = response.main_species.propagation.cuttings;
        //         seed = response.main_species.propagation.seed;
        //         transplant = response.main_species.propagation.container;

        //         $("#crop-name").text(plant);

        //         if (firstSuitableMonth === "NOT") {
        //             $("#suitability").text(firstSuitableMonth)
        //         } else {
        //             $("#suitability").text("Okay");
        //             $("#first-suitable").text(moment(firstSuitableMonth, "MMMM"))
        //         }

        //         if (firstOptimalMonth !== "NOT") {
        //             $("#most-suitable").text(moment(firstOptimalMonth, "MMMM"))
        //         }

        //         $("#days").text(daysToHarvest);


        //         var cuttingP = $("<p>");
        //         var seedP = $("<p>");
        //         var transplantP = $("<p>");

        //         if (cutting === true) {
        //             cuttingP.text("Cutting: Yes")
        //         } else {
        //             cuttingP.text("Cutting: No")
        //         }

        //         if (seed === true) {
        //             seedP.text("Seed: Yes")
        //         } else {
        //             seedP.text("Seed: No")
        //         }

        //         if (transplant === true) {
        //             transplantP.text("Transplant: Yes")
        //         } else {
        //             transplantP.text("Transplant: No")
        //         }

        //         $("#planting").append(cuttingP, seedP, transplantP)
        //     });
        // } else {
        database.ref('Vegetables/' + plant).once("value", function (snapshot) {
            daysToHarvest = snapshot.val().daysToHarvest;
            maxPh = snapshot.val().maxPh;
            minPh = snapshot.val().minPh;
            minReqTempC = snapshot.val().minTemp;
            cutting = snapshot.val().plantingMethod.cutting;
            seed = snapshot.val().plantingMethod.seed;
            transplant = snapshot.val().plantingMethod.transplant;

            $("#user-crop").text(plant);

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
                    monthsRange = futureMonth + "-10," + futureMonth + "-20";
                    console.log("mr: " + monthsRange);

                    //make API call to get weather data for 10 days of each month
                    $.ajax({
                        url: "https://api.awhere.com/v2/weather/locations/37.7913017,-122.3943565/norms/" + monthsRange + "/years/2015,2018",
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
                            //we have to push all the data into one array because the call is asynchronous and there is no order related to months order
                            arrAll.push(wthrDay);

                        }
                        count++;
                        console.log(arrAll); //the array is populated
                        console.log("count is: " + count);

                        //call the function separating the array which holds all the data inside 'then' clause because the ajax call is async
                        arrMonthly01.length = 0;
                        arrMonthly02.length = 0;
                        arrMonthly03.length = 0;
                        arrMonthly04.length = 0;

                        separateArray(arrAll);

                        //log out the four sorted arrays
                        console.log(arrMonthly01);
                        console.log(arrMonthly02);
                        console.log(arrMonthly03);
                        console.log(arrMonthly04);

                        //populate the fourMonthSorted array of objects with the month number as month property and the weather data as weatherData
                        fourMonthSorted[0] = { month: fourMonths[0], weatherData: arrMonthly01 };
                        fourMonthSorted[1] = { month: fourMonths[1], weatherData: arrMonthly02 };
                        fourMonthSorted[2] = { month: fourMonths[2], weatherData: arrMonthly03 };
                        fourMonthSorted[3] = { month: fourMonths[3], weatherData: arrMonthly04 };

                        //to find the first suitable to plan month based on min temperatures loop through the array and call the function to 
                        //check if there was a day in the month when a min temperature was below the temperature requirement for the plant
                        for (var j = 0; j < fourMonthSorted.length; j++) {
                            var okPlantMinTempMonth = isAllowedToPlantMinTemp(fourMonthSorted[j].weatherData, minReqTempC);
                            if (okPlantMinTempMonth) {
                                firstSuitableMonth = fourMonthSorted[j].month;
                                break;
                            }
                        }

                        console.log("firstSuitableMonth " + firstSuitableMonth);

                        //to find the first optimal for planting month based on mean tempartures
                        for (var j = 0; j < fourMonthSorted.length; j++) {
                            var okPlantOptTempMonth = isAvrgTempOpt(fourMonthSorted[j].weatherData, reqTempOptC);
                            if (okPlantOptTempMonth) {
                                firstOptimalMonth = fourMonthSorted[j].month;
                                break;
                            }
                        }

                        console.log("firstOptimalMonth " + firstOptimalMonth);


                        //when all four arrays are populated, calculate the averages
                        if (count === 4) {

                            //Max's code goes here


                            $("#days").text(daysToHarvest);



                            if (cutting === true) {
                                $("#direct-seed").text("Yes")
                            } else {
                                $("#direct-seed").text("No")
                            }

                            if (seed === true) {
                                $("#cuttings").text("Yes")
                            } else {
                                $("#cuttings").text("No")
                            }

                            $("#pH-min").text(minPh)
                            $("#pH-max").text(maxPh)
                            $("#days-to-harvest").text(daysToHarvest);

                            //call the function to get cards array populated with monthly averages for the suitable and optimal months
                            var firstSuitableArr = fourMonthSorted.filter(obj => {
                                console.log("firstSuitable month" + firstSuitableMonth);
                                return obj.month == firstSuitableMonth;
                            });

                            console.log("11: " + firstSuitableArr.length);
                            console.log("12: " + firstSuitableArr[0].weatherData);
                            if (firstSuitableArr !== NaN && firstSuitableArr.length !== 0) {
                                getMonthlyAverages(firstSuitableArr[0].weatherData, firstSuitableMonth);
                            }

                            console.log(cards[0].month + " " + cards[0].min + " " + cards[0].max + " " + cards[0].mean);

                            var firstOptArr = fourMonthSorted.filter(obj => {
                                console.log(firstOptimalMonth);
                                return obj.month == firstOptimalMonth;
                            });

                            console.log("13: " + firstOptArr.length);
                            console.log("14: " + firstOptArr[0].weatherData);
                            if (firstOptArr !== NaN && firstOptArr.length != 0) {
                                getMonthlyAverages(firstOptArr[0].weatherData, firstOptimalMonth);
                            }

                            console.log("card for suitable month:" + cards[0].month + " " + cards[0].min + " " + cards[0].max + " " + cards[0].mean);
                            console.log("card for optimal month:" + cards[1].month + " " + cards[1].min + " " + cards[1].max + " " + cards[1].mean);

                            if (firstSuitableMonth === "NOT") {
                                $("#suitability-status").text(firstSuitableMonth)
                            } else {
                                $("#suitability-status").text("Okay");
                                $("#first-month").text(cards[0].month);
                                $("#min-temp-first").text(cards[0].min);
                                $("#mean-temp-first").text(cards[0].mean);
                                $("#max-temp-first").text(cards[0].max);
                            }

                            if (firstOptimalMonth !== "NOT") {
                                $("#suitability-status").text("Okay");
                                $("#best-month").text(cards[1].month)
                                $("#min-temp-best").text(cards[1].min);
                                $("#mean-temp-best").text(cards[1].mean);
                                $("#max-temp-best").text(cards[1].max);
                            }
                        }

                    });
                }
            });
        })
        // }
    } else {
        $("#plants").val("");
        $("#plants").attr("placeholder", "Please enter a different crop");
    }


})

