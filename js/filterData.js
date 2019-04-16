queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);

function getMonth(error, data) {
    if (error) {
        $('#errorMessage').html(`<h2>Error retrieving the data</h2>`);
    }

    //convert to number the number fields
    dataParser(data);

    //key, value store data in the element dataset of the document
    $(document).data('data', data);

    //if the logo is clicked go to the main page
    $(".change-month").removeClass('hide').click(function () {
        $('#monthId').removeClass('hide').fadeIn(1000);
        $('#budgetId').addClass('hide');
        $('#weatherId').addClass('hide');
        $('#errors').addClass('hide');
        $('#grafId').addClass('hide');
        $('#hamburguerButton').addClass('hide');
        $('#navbar-collapse-1').addClass('hide');
        $('#sidebar-collapse').addClass('hide');
    })

    $(".change-budget").click(function () {
        $('#budgetId').removeClass('hide').fadeIn(1000);
        $('#monthId').addClass('hide');
        $('#weatherId').addClass('hide');
        $('#errors').addClass('hide');
        $('#grafId').addClass('hide');
        $('#hamburguerButton').addClass('hide');
        $('#navbar-collapse-1').addClass('hide');
        $('#sidebar-collapse').addClass('hide');

    })

    $(".change-temperatures").click(function () {
        $('#weatherId').removeClass('hide').fadeIn(1000);
        $('#monthId').addClass('hide');
        $('#budgetId').addClass('hide');
        $('#errors').addClass('hide');
        $('#grafId').addClass('hide');
        $('#hamburguerButton').addClass('hide');
        $('#navbar-collapse-1').addClass('hide');
        $('#sidebar-collapse').addClass('hide');

    })

    $("#hamburguerButton").click(function () {
        $('#navbar-collapse-1').removeClass('hide');
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

    //buttons on main page (page with month selection)
    $("#resultsBudget").click(onClickFilterByBudget);
    $("#resultsWeather").click(onClickFilterByWeather);

    //buttons on the sidebar
    $("#filterSideBudget").click(onClickFilterByBudget);
    $("#filterSideWeather").click(onClickFilterByWeather);
}

function filterData(monthSelected) {
    // 'data' is the key
    var data = $(document).data('data');
    var dataMonth = data.filter(function (element) {
        return (element.month === monthSelected);
    });
    return dataMonth;
}

function onClickFilterByBudget() {
    var monthSelected = $('#monthSelector :selected').val();
    var dataMonth = filterData(monthSelected);

    //get input value and convert it to number
    var maxBudgetValue = parseInt(document.getElementById("maxBudget").value);
    var maxBudgetValue2 = parseInt(document.getElementById("maxBudget2").value);
    var maxBudget;

    if (!(isNaN(maxBudgetValue))) {
        maxBudget = maxBudgetValue;
        $('input[name=maxBudget]').val('');
    }

    if (!(isNaN(maxBudgetValue2))) {
        maxBudget = maxBudgetValue2;
        $('input[name=maxBudget2]').val('');
    }
    filterDataBudget(maxBudget, dataMonth)
}


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
        return (totalBudget < maxBudget);
    });

    if (isNaN(maxBudget)) {
        showErrorMessage();
        $('#errorMessage').html(`<h2>You need to enter a value</h2>`);
    }
    else {
        //If there is one or more cities matching the criteria it will call 
        //the function "createDataForGraphics" if not it will display a message;
        citiesMatchingCriteria(dataBudget, filteredBy);
    }
}

function onClickFilterByWeather() {
    var monthSelected = $('#monthSelector :selected').val();
    var dataMonth = filterData(monthSelected);

    //get input values
    var minTemp = parseInt(document.getElementById("minTemp").value);
    var maxTemp = parseInt(document.getElementById("maxTemp").value);
    var minTemp2 = parseInt(document.getElementById("minTemp2").value);
    var maxTemp2 = parseInt(document.getElementById("maxTemp2").value);
    var min;
    var max;

    if (!(isNaN(minTemp)) || !(isNaN(maxTemp))) {
        min = minTemp;
        max = maxTemp;
        // $('input[name=minTemp2]').val('');
        // $('input[name=maxTemp2]').val('');
    }
    if (!(isNaN(minTemp2)) || !(isNaN(maxTemp2))) {
        min = minTemp2;
        max = maxTemp2;
        // $('input[name=minTemp]').val('');
        // $('input[name=maxTemp]').val('');
    }
    filterDataWeather(min, max, dataMonth)
    $('input[name=minTemp2]').val('');
    $('input[name=maxTemp2]').val('');
    $('input[name=minTemp]').val('');
    $('input[name=maxTemp]').val('');

}

function filterDataWeather(min, max, dataMonth) {
    var dataWeather;
    console.log(min);
    console.log(max);
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
        showErrorMessage();
        $('#errorMessage').html(`<h2>Please enter maximun and/or minimun temperatures</h2>`);
        return 0;
    }
    else if ((!(isNaN(min))) && (!(isNaN(max))) && max < min) {
        showErrorMessage();
        $('#errorMessage').html(`<h2>The minimum temperature can't be higher that the maximum temperature</h2>`);
        return 0;
    }
    else {
        citiesMatchingCriteria(dataWeather, filteredBy);
    }
}

function citiesMatchingCriteria(data, filteredBy) {
    //document.getElementById("infoMessage").innerHTML = "";

    if (checkIfObjectEmpty(data)) {
        showErrorMessage();
        if (filteredBy == "Budget") {
            // document.getElementById("#errorMessage").innerHTML = `We're sorry but Europe is not that cheap!`;
            $('#errorMessage').html(`<h2>We're sorry but we couldn't find any city in Europe for that daily budget</h2>`);
        }
        if (filteredBy == "Weather") {
            $('#errorMessage').html(`<h2>We're sorry but we couldn't find cities for the selected temperatures</h2>`);
        }
    }
    else {
        if ($(window).width() < 768) {
            $('#hamburguerButton').removeClass('hide');
        }
        $('#errors').addClass('hide');
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

//this function will check if there is or there isn't matching results in the data
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

    fiterBy(ndx, "#filterByRegion");
    fiterBy(ndx, "#filterByCountry");
    fiterBy(ndx, "#filterByCity");
    // createTable(ndx);
    countCities(ndx);

    //Budget graphics
    if (filteredBy === 'Budget') {
        createTableBudget(ndx);
        show_avg(ndx, "hostel", "#hostel_maxtem");
        show_avg(ndx, "meals", "#meals_mintem");
        show_avg(ndx, "drinks", "#drinks_avgtemp");
        show_avg(ndx, "transport", "#transport_maxpreci");
        show_avg(ndx, "attractions", "#attractions_minpreci");
        createRowChart(ndx);
        createTotalDailyBudget(ndx);
        createCurrencyChart(ndx);
        createCorrelationCharts(data, ndx)
    }

    //weather graphics
    if (filteredBy === 'Weather') {
        createTableWeather(ndx);
        createRowChartWeather(ndx);
        createPrecipitationChart(ndx);
        show_max_weather(ndx, 'maxTemp', "#hostel_maxtem");
        show_min_weather(ndx, 'minTemp', "#meals_mintem");
        show_avg_temp(ndx, 'maxTemp', 'minTemp', "#drinks_avgtemp");
        show_max_weather(ndx, 'precipitation', "#transport_maxpreci");
        show_min_weather(ndx, 'precipitation', "#attractions_minpreci");
        cityTemp(ndx);
        createCorrelationTemp(data, ndx);
    }
    dc.renderAll();
}

function fiterBy(ndx, element) {

    var dim;
    if (element == "#filterByRegion") {
        dim = ndx.dimension(dc.pluck('region'));
    }
    else if (element == "#filterByCountry") {
        dim = ndx.dimension(dc.pluck('country'));
    }
    else if (element == "#filterByCity") {
        dim = ndx.dimension(dc.pluck('city'));
    }
    var group = dim.group();

    dc.selectMenu(element)
        .multiple(true)
        .dimension(dim)
        .title(function (d) { return d.key; })
        .group(group);
};

function showErrorMessage() {
    $('#errors').removeClass('hide');
    $('#budgetId').addClass('hide');
    $('#weatherId').addClass('hide');
    $('#monthId').addClass('hide');
    $('#grafId').addClass('hide');
}

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
    })
}