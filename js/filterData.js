queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);


function getMonth(error, data) {

    if (error) { /////////// improve this???
        document.getElementById("error").innerHTML = `<h2 class="text-danger">Error retrieving the data file!</h2>`;
    }

    //if the logo is clicked go to the main page
    $(".navbar-brand").removeClass('hide').click(function () {
        $('#monthId').fadeIn(1000);
        $('#budgetId').addClass('hide');
        $('#weatherId').addClass('hide');
        $('#grafId').addClass('hide');
        $('#sidebar-collapse').addClass('hide');
        $('#navbar-button').addClass('hide');
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
        //everytime we start a new search we clear the input fields
        $('input[name=minTemp]').val('');
        $('input[name=maxTemp]').val('');
        $('input[name=maxBudget]').val('');
        $('#monthId').removeClass('hide').fadeIn(1000);
        $('#budgetId').addClass('hide');
        $('#weatherId').addClass('hide');
        $('#grafId').addClass('hide');
        $('#sidebar-collapse').addClass('hide');
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

console.log(monthSelected);

    //convert to number the number fields
    convertToInteger(dataMonth);

    //https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
    document.getElementById("resultsBudget").addEventListener("click", filterByBudget(dataMonth));
    document.getElementById("resultsWeather").addEventListener("click", filterByWeather(dataMonth));
}


function filterByBudget(dataMonth) {
    return function () {
        var filteredBy = 'Budget';

        //get input value and convert it to number
        var maxBudgetValue = parseInt(document.getElementById("maxBudget").value);


        //this will create an Object only containing the cities that fit the selected budget
        var totalBudget = 0;
        var dataBudget = dataMonth.filter(function (element) {
            totalBudget = element.hostelNight +
                element.meals +
                element.drinks +
                element.transport +
                element.attractions;
            return (totalBudget < maxBudgetValue);
        });

        if (isNaN(maxBudgetValue)) {
            console.log(maxBudgetValue);

            alert('Please enter the budget')
        }
        else {
            console.log(maxBudgetValue);

            citiesMatchingCriteria(dataBudget, filteredBy);
        }

    }
};

function filterByWeather(dataMonth) {
    return function () {

        var filteredBy = 'Weather';

        var dataWeather;

        //get input values
        var minTemp = document.getElementById("minTemp").value;
        var maxTemp = document.getElementById("maxTemp").value;

        if (minTemp == "" && maxTemp == "") {
            alert("Please enter a minumun, a maximun temperature or both");
            console.log('empty');
        }
        else if (minTemp != "" && maxTemp == "") {

            //this will create an Object only containing the cities that have that temperature
            dataWeather = dataMonth.filter(function (element) {
                return (minTemp <= element.minTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it will show an alert message;
            console.log('min only');

            citiesMatchingCriteria(dataWeather, filteredBy);


        }
        else if (minTemp == "" && maxTemp != "") {
            //this will create an Object only containing the cities that have that temperature
            dataWeather = dataMonth.filter(function (element) {
                return (maxTemp >= element.maxTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it will show an alert message;
            console.log('max only');

            citiesMatchingCriteria(dataWeather, filteredBy);

        }
        else if (minTemp != "" && maxTemp != "" && maxTemp > minTemp) {
            //this will create an Object only containing the cities that have that temperature
            dataWeather = dataMonth.filter(function (element) {
                return (minTemp <= element.minTemp && maxTemp >= element.maxTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it show an alert message;
            console.log('both');

            citiesMatchingCriteria(dataWeather, filteredBy);
        }
        else if (minTemp != "" && maxTemp != "" && maxTemp < minTemp) {
            alert("The maximune temperature must be higher than the minimun");
        }

    }
};

function citiesMatchingCriteria(data, filteredBy) {
    //document.getElementById("infoMessage").innerHTML = "";

    if (checkIfObjectEmpty(data)) {
        console.log('not matches')
        if (filteredBy == "Budget") {
            alert("We're sorry but Europe is not that cheap!");
        }
        else {
            alert("We're sorry but we don't cities with that average weather");
        }
    }
    else {
        console.log('matches')
        if (filteredBy == "Budget") {
            $('#budgetId').slideUp(1000);
            $('#grafId').removeClass('hide').slideDown(1000);
            $('#navbar-button').removeClass('hide');
            $('#sidebar-collapse').removeClass('hide').show(1000);
            $('.weather').hide();
            $('.budget').show();
        } else {
            $('#weatherId').slideUp(1000);
            $('#grafId').removeClass('hide').slideDown(1000);
            $('#navbar-button').removeClass('hide');
            $('#sidebar-collapse').removeClass('hide').show(1000);
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


function createDataForGraphics(data, filteredBy) {

    var ndx = crossfilter(data);

    fiterBy(ndx, "#filterByRegion");
    fiterBy(ndx, "#filterByCountry");
    fiterBy(ndx, "#filterByCity");
    createTable(ndx);
    countCities(ndx);


    //Budget graphics
    if (filteredBy === 'Budget') {
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
    } else if (element == "#filterByCountry") {
        dim = ndx.dimension(dc.pluck('country'));
    } else if (element == "#filterByCity") {
        dim = ndx.dimension(dc.pluck('city'));
    }

    var group = dim.group();

    dc.selectMenu(element)
        .multiple(true)
        .dimension(dim)
        .title(function (d) { return d.key; })
        .group(group);
};