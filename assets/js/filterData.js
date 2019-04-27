// queue is used to wait for the data to be loaded before the code is run
queue()
    .defer(d3.csv, "assets/data/Data.csv")
    .await(getMonth);

function getMonth(error, data) {
    if (error) {
        showInfoMessageError();
        $('#infoMessage').html('<h2>Error retrieving the data</h2>');
    }

    //convert to number the number fields
    dataParser(data);

    //key, value store data in the element dataset of the document so it is available in other functions
    $(document).data('data', data);

    //if the logo or "Change month" option is clicked go to the intro screen
    $(".change-month").removeClass('hide').click(function () {
        $('#monthId').removeClass('hide').fadeIn(1000);
        $('#budgetId').addClass('hide');
        $('#weatherId').addClass('hide');
        $('#messages').addClass('hide');
        $('#grafId').addClass('hide');
        $('#hamburguerButton').addClass('hide');
        $('#navbar-collapse-1').hide();
        $('#sidebar-collapse').addClass('hide');
    });

    //if "Change budget" option is clicked go to the budget selection screen
    $(".change-budget").click(function () {
        $('#budgetId').removeClass('hide').fadeIn(1000);
        $('#weatherId').addClass('hide');
        showSecondFilterScreen();
    });

    //if "Change temperature" option is clicked go to the temperature selection screen
    $(".change-temperatures").click(function () {
        $('#weatherId').removeClass('hide').fadeIn(1000);
        $('#budgetId').addClass('hide');
        showSecondFilterScreen();
    });

    /*When the hamburguer button is clicked it will toggle the options inside
    This needs to be done because we may have hide it before when going
    back to the main screen or the weather or budget screens*/
    $("#hamburguerButton").click(function () {
        $('#navbar-collapse-1').slideToggle(1500);
    });

    //When "choose budget" button is pressed, hide month selection screen and show budget selection screen
    $('#chooseBudget').click(function () {
        $('#monthId').slideUp(1000);
        $('#budgetId').removeClass('hide').slideDown(1000); 
        //add a default value in the input box to show all the cities to the user by default
        $('input[name=maxBudget]').val('91');
    });

    //When "choose weather" button is pressed, hide month selection screen and show weather selection screen
    $('#chooseWeather').click(function () {
        $('#monthId').slideUp(1000);
        $('#weatherId').removeClass('hide').slideDown(1000);
        //add a default value in the input boxes to show all the cities to the user by default
        $('input[name=minTemp]').val('-15');
        $('input[name=maxTemp]').val('40');
    });

    //buttons on intro screen (screen with month selection)
    $("#resultsBudget").click(onClickFilterByBudget);
    $("#resultsWeather").click(onClickFilterByWeather);

    //buttons on the sidebar (in the dashboard screen)
    $("#filterSideBudget").click(onClickFilterByBudget);
    $("#filterSideWeather").click(onClickFilterByWeather);
}

// sections that need to be hidden/displayed when the info-message screen is displayed

function showInfoMessage() {
    $('#messages').removeClass('hide');
    $('#budgetId').addClass('hide');
    $('#weatherId').addClass('hide');
    $('#monthId').addClass('hide');
    $('#grafId').addClass('hide');
}

function showInfoMessageError() {
    showInfoMessage()
    $('#messages').removeClass('happy');
    $('#messages').addClass('sad');
}

function showInfoMessageSuccess() {
    showInfoMessage()
    $('#messages').removeClass('sad');
    $('#messages').addClass('happy');
}

// sections that need to be hidden/displayd when the budget and weather screens are displayed
function showSecondFilterScreen() {
    $('#monthId').addClass('hide');
    $('#messages').addClass('hide');
    $('#grafId').addClass('hide');
    $('#hamburguerButton').addClass('hide');
    $('#navbar-collapse-1').hide();
    $('#sidebar-collapse').addClass('hide');
}

function onClickFilterByBudget() {
    // When the "choose by budget" or the button in the sidebar is pressed 
    // we will take the month selected in the drowp down
    var monthSelected = $('#monthSelector :selected').val();
    //we pass the month selected to filter the data by that month
    var dataMonth = filterData(monthSelected);

    //get input value from budget selection screen and convert it to number
    var maxBudgetValue = parseInt(document.getElementById("maxBudget").value);
    //get input value from sidebar input box and convert it to number
    var maxBudgetValue2 = parseInt(document.getElementById("maxBudget2").value);
    var maxBudget;

    //checks what input has a value
    if (!(isNaN(maxBudgetValue))) {
        maxBudget = maxBudgetValue;
    }
    if (!(isNaN(maxBudgetValue2))) {
        maxBudget = maxBudgetValue2;
    }

    //we call the function to filter the data for the budget input value entered
    filterDataBudget(maxBudget, dataMonth);

    //we removed remove the input boxes values
    $('input[name=maxBudget]').val('');
    $('input[name=maxBudget2]').val('');
}

function onClickFilterByWeather() {
    // When the "choose by weather" or the button in the sidebar is pressed 
    // we will take the month selected in the drowp down
    var monthSelected = $('#monthSelector :selected').val();
    //we pass the month selected to filter the data by that month
    var dataMonth = filterData(monthSelected);

    //get input values from weather selection screen the and convert them to number
    var minTemp = parseInt(document.getElementById("minTemp").value);
    var maxTemp = parseInt(document.getElementById("maxTemp").value);
    //get input value from sidebar input boxes and convert them to number
    var minTemp2 = parseInt(document.getElementById("minTemp2").value);
    var maxTemp2 = parseInt(document.getElementById("maxTemp2").value);
    var min;
    var max;

    //checks what input has a value
    if (!(isNaN(minTemp)) || !(isNaN(maxTemp))) {
        min = minTemp;
        max = maxTemp;
    }
    if (!(isNaN(minTemp2)) || !(isNaN(maxTemp2))) {
        min = minTemp2;
        max = maxTemp2;
    }

    //we call the function to filter the data for the weather input value(s) entered
    filterDataWeather(min, max, dataMonth);

    //we removed remove the input boxes values
    $('input[name=minTemp2]').val('');
    $('input[name=maxTemp2]').val('');
    $('input[name=minTemp]').val('');
    $('input[name=maxTemp]').val('');
}

//function to filter the data by the month selected
function filterData(monthSelected) {
    // 'data' is the key
    var data = $(document).data('data');
    var dataMonth = data.filter(function (element) {
        return (element.month === monthSelected);
    });
    return dataMonth;
}

//function to filter the data by budget
function filterDataBudget(maxBudget, dataMonth) {
    var filteredBy = 'Budget';
    var totalBudget = 0;

    //this will create an Object only containing the cities that fit the budget
    var dataBudget = dataMonth.filter(function (element) {
        totalBudget = element.hostelNight +
            element.meals +
            element.drinks +
            element.transport +
            element.attractions;
        return (totalBudget <= maxBudget);
    });

    if (isNaN(maxBudget)) {
        showInfoMessageError();
        $('#infoMessage').html('<h2>You need to enter a value</h2>');
    }
    else {
        //If there is one or more cities matching the criteria it will call 
        //the function "createDataForGraphics" if not it will display a message;
        citiesMatchingCriteria(dataBudget, filteredBy);
    }
}

//function to filter the data by weather
function filterDataWeather(min, max, dataMonth) {
    var dataWeather;
    var filteredBy = 'Weather';

    dataWeather = dataMonth.filter(function (element) {
        if ((!(isNaN(min))) && (!(isNaN(max))) && max > min) {
            return (min <= element.minTemp && max >= element.maxTemp);
        }
        else if ((!(isNaN(min))) && (isNaN(max))) {
            return (min <= element.minTemp);
        }
        else if ((!(isNaN(max))) && (isNaN(min))) {
            return (max >= element.maxTemp);
        }
    });

    if ((isNaN(min)) && (isNaN(max))) {
        showInfoMessageError();
        $('#infoMessage').html('<h2>Please enter maximum and/or minimum temperatures</h2>');
        return 0;
    }
    else if ((!(isNaN(min))) && (!(isNaN(max))) && max < min) {
        showInfoMessageError();
        $('#infoMessage').html("<h2>The minimum temperature can't be higher that the maximum temperature</h2>");
        return 0;
    }
    else {
        citiesMatchingCriteria(dataWeather, filteredBy);
    }
}

//If there are matches the object won't be empty and the dasboard screen will be displayed
function citiesMatchingCriteria(data, filteredBy) {
    //if there are not matches we will display the following error messages in the error message screen
    if (checkIfObjectEmpty(data)) {
        showInfoMessageError();
        if (filteredBy == "Budget") {
            $('#infoMessage').html("<h2>We're sorry but we couldn't find any city in Europe for that daily budget</h2>");
        }
        if (filteredBy == "Weather") {
            $('#infoMessage').html("<h2>We're sorry but we couldn't find cities for the selected temperatures</h2>");
        }
    }
    else {
        //If the website is open from the start in a small screen display the hamburguer button
        if ($(window).width() < 768) {
            $('#hamburguerButton').removeClass('hide');
        }

        //If the website is open in a screen > 767px and then the screen is resized to < 768px display the hamburguer button
        $(window).on("resize", function () {
            widthSize();
        });

        $('#messages').addClass('hide');
        $('#grafId').removeClass('hide').slideDown(1000);
        $('#sidebar-collapse').removeClass('hide').show(1000);

        if (filteredBy == "Budget") {
            $('#budgetId').slideUp(1000);
            $('.weather').hide();
            $('.budget').show();
        }
        if (filteredBy == "Weather") {
            $('#weatherId').slideUp(1000);
            $('.budget').hide();
            $('.weather').show();
        }
        createDataForGraphics(data, filteredBy);
    }
}

function widthSize() {
    $width = $(window).width();
    //Depending on the screen width it will display or hide the hamburguer button
    if ($width < 768) {
        $('#hamburguerButton').removeClass('hide');
    } else {
        $('#hamburguerButton').addClass('hide');
    }
}

//This function will check if there is or there isn't matching results in the data
//if the object is empty means that not matches where found
function checkIfObjectEmpty(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key))
            return false;
    }
    return true;
}

function createDataForGraphics(data, filteredBy) {
    var ndx = crossfilter(data);

    // dashboard filters region, country and city
    fiterBy(ndx, "#filterByRegion");
    fiterBy(ndx, "#filterByCountry");
    fiterBy(ndx, "#filterByCity");

    //Number Display count cities matching the filter
    countCities(ndx);

    //Budget charts
    if (filteredBy === 'Budget') {
        // number displays
        show_avg(ndx, "hostel", "#hostel_maxtem");
        show_avg(ndx, "meals", "#meals_mintem");
        show_avg(ndx, "drinks", "#drinks_avgtemp");
        show_avg(ndx, "transport", "#transport_maxpreci");
        show_avg(ndx, "attractions", "#attractions_minpreci");
        // row chart
        createRowChart(ndx);
        // stacked bar chart
        createTotalDailyBudget(ndx);
        // pie chart
        createCurrencyChart(ndx);
        // scatter plot chart
        createCorrelationCharts(data, ndx);
        // table
        createTableBudget(ndx);
    }

    //Weather charts
    if (filteredBy === 'Weather') {
        // number displays
        show_max_weather(ndx, 'maxTemp', "#hostel_maxtem");
        show_min_weather(ndx, 'minTemp', "#meals_mintem");
        show_avg_temp(ndx, "#drinks_avgtemp");
        show_max_weather(ndx, 'precipitation', "#transport_maxpreci");
        show_min_weather(ndx, 'precipitation', "#attractions_minpreci");
        // row chart
        createRowChartWeather(ndx);
        // composite line chart
        cityTemp(ndx);
        // pie chart
        createPrecipitationChart(ndx);
        // composite scatter plot chart
        createCorrelationTemp(data, ndx);
        // table
        createTableWeather(ndx);
    }
    dc.renderAll();
}

// this function will be used to convert the fields that we need to use in calculations to number
function dataParser(data) {
    data.forEach(function (d) {
        d.hostelNight = parseInt(d.hostelNight);
        d.meals = parseInt(d.meals);
        d.drinks = parseInt(d.drinks);
        d.transport = parseInt(d.transport);
        d.attractions = parseInt(d.attractions);
        d.visitorsCity = parseInt(d.visitorsCity);
        d.minTemp = parseInt(d.minTemp);
        d.maxTemp = parseInt(d.maxTemp);
        d.precipitation = parseInt(d.precipitation);
    });
}