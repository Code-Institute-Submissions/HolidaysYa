queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);


function getMonth(error, data) {

    if (error) { /////////// improve this???
        document.getElementById("error").innerHTML = `<h2 class="text-danger">Error retrieving the data file!</h2>`;
    }

    //if the logo is clicked go to the main page
    $(".navbar-brand").click(function () {
        $('#monthId').fadeIn(1000);
        $('#budgetId').addClass('hide');
        $('#weatherId').addClass('hide');
        $('#grafId').addClass('hide');
        $('#graphButtons').addClass('hide');
    })

    //When choose budget button is pressed, hide month selection page and show budget selection page
    $('#chooseBudget').click(function () {
        $('#monthId').slideUp(1000);
        $('#budgetId').removeClass('hide').slideDown(1000);
    })
    //When choose weather button is pressed, hide month selection page and show weather selection page
    $('#chooseWeather').click(function () {
        $('#monthId').slideUp(1000);
        $('#weatherId').removeClass('hide').slideDown(1000);
    })

    //When change month is pressed, hide current screen and show month selection screen
    $(".goback").click(function () {
        $('#monthId').fadeIn(1000);
        $('#budgetId').addClass('hide');
        $('#weatherId').addClass('hide');
        $('#grafId').addClass('hide');
        $('#graphButtons').addClass('hide');
    })

    $("#resultsBudget").click(function () {
        $('#budgetId').slideUp(1000);
        $('#grafId').removeClass('hide').slideDown(1000);
        $('#graphButtons').removeClass('hide').show(1000);
        $('.weather').hide();
        $('.budget').show();
    })
    //When show cities is pressed, hide temperature selection screen and show graphics
    $("#resultsWeather").click(function () {
        $('#weatherId').slideUp(1000);
        $('#grafId').removeClass('hide').slideDown(1000);
        $('#graphButtons').removeClass('hide').show(1000);
        $('.budget').hide();
        $('.weather').show();
    })

    //When change budget is pressed, hide graphics screen and show budget selection screen
    $('#filterBudget').click(function () {
        $('#budgetId').slideDown(1000);
        $('#grafId').addClass('hide');
        $('#graphButtons').addClass('hide');

    })

    //When change temperature is pressed, hide graphics screen and show temperature selection screen
    $('#filterWeather').click(function () {
        $('#weatherId').slideDown(1000);
        $('#grafId').addClass('hide');
        $('#graphButtons').addClass('hide');

    })

    // only call "filterData" after the dropdown option has been selected
    $("#monthSelector").change(function () {
        filterData(data);
    }).change();
    // we add .change() to trigger change() for the default option (January) 

}


function filterData(data) {


    //get the text for the option selected
    var monthSelected = $('#monthSelector :selected').text();

    //this will create an object only containing the data for the month
    var dataMonth = data.filter(function (element) {
        return (element.month === monthSelected);
    });


    //convert to number the number fields
    convertToInteger(dataMonth);


    //https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
    document.getElementById("resultsBudget").addEventListener("click", filterByBudget(dataMonth));
    document.getElementById("resultsWeather").addEventListener("click", filterByWeather(dataMonth));
}

function filterByBudget(dataMonth) {
    return function () {
        //removes the inputs in case we want to seach again by weather
        $('input[name=minTemp').val('');
        $('input[name=maxTemp').val('');

        var filteredBy = 'Budget';

        //get input value and convert it to number
        var maxBudgetValue = document.getElementById("maxBudget").value;
        /////////////////add validation!! not empty and number

        //this will create an Object only containing the cities that fit the budget
        var totalBudget = 0;
        var dataBudget = dataMonth.filter(function (element) {
            totalBudget = element.hostelNight +
                element.meals +
                element.drinks +
                element.transport +
                element.attractions;
            return (totalBudget < maxBudgetValue);
        });


        if (maxBudgetValue == "") {
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">Please enter the budget</h2>`;

        }
        else {

            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it will display a message;
            citiesMatchingCriteria(dataBudget, filteredBy);
        }
    }
};

function filterByWeather(dataMonth) {
    return function () {
        //removes the input in case we want to seach again by weather
        $('input[name=maxBudget').val('');

        var filteredBy = 'Weather';

        var dataWeather;

        //get input values
        var minTemp = document.getElementById("minTemp").value;
        var maxTemp = document.getElementById("maxTemp").value;

        if (minTemp == "" && maxTemp == "") {
            //alert("Please enter a minumun, a maximun temperature or both");
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">Please enter a minumun, a maximun temperature or both</h2>`;

        }
        else if (minTemp != "" && maxTemp == "") {

            //this will create an Object only containing the cities that have that temperature
            dataWeather = dataMonth.filter(function (element) {
                return (minTemp <= element.minTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it show an alert message;

            citiesMatchingCriteria(dataWeather, filteredBy);

        }
        else if (minTemp == "" && maxTemp != "") {
            //this will create an Object only containing the cities that have that temperature
            dataWeather = dataMonth.filter(function (element) {
                return (maxTemp >= element.maxTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it show an alert message;
            citiesMatchingCriteria(dataWeather, filteredBy);

        }

        else if (minTemp != "" && maxTemp != "" && maxTemp > minTemp) {
            //this will create an Object only containing the cities that have that temperature
            dataWeather = dataMonth.filter(function (element) {
                return (minTemp <= element.minTemp && maxTemp >= element.maxTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it show an alert message;
            citiesMatchingCriteria(dataWeather, filteredBy);

        }
        else if (minTemp != "" && maxTemp != "" && maxTemp < minTemp) {
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">The maximune temperature must be higher than the minimun</h2>`;

        }

    }
};

function citiesMatchingCriteria(data, filteredBy) {
    document.getElementById("infoMessage").innerHTML = "";

    if (checkIfObjectEmpty(data)) {
        $("#charts").hide();
        if (filteredBy == "Budget") {
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">We're sorry but Europe is not that cheap!</h2>`;

            // alert("We're sorry but Europe is not that cheap!");
        }
        else {
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">We're sorry but we don't cities with that average weather</h2>`;

            //alert("We're sorry but we don't cities with that average weather");
        }
    }
    else {

        $("#charts").show();
        createDataForGraphics(data, filteredBy);
    }
}


//this function will check if there is or there isn't matching results in the data
//if the object is empty means that not matches where found
function checkIfObjectEmpty(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key))
            return false;
    }
    return true;
}

function convertToInteger(dataMonth) {
    dataMonth.forEach(function (d) {
        d.hostelNight = parseInt(d.hostelNight);
        d.meals = parseInt(d.meals);
        d.drinks = parseInt(d.drinks);
        d.transport = parseInt(d.transport);
        d.attractions = parseInt(d.attractions);
        d.visitorsCity = parseInt(d.visitorsCity);
        d.minTemp = parseInt(d.minTemp);
        d.maxTemp = parseInt(d.maxTemp);
        d.precipitation = parseInt(d.precipitation);

    })
}


