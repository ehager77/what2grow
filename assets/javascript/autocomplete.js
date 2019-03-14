
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