queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);


function getMonth(error, data) {

    // only call "createGraphics" the month value after the dropdown option has been selected
    $("#monthSelector").change(function () {
        filterData(data);
    });
}

function showTitleBudget() {
    document.getElementById("BudgetTitle").innerHTML=`<h2>Results By Budget</h2>`;
    document.getElementById("resultsBudget").innerHTML=`New Search`;
}

 function showTitleWeather() {
     document.getElementById("WeatherTitle").innerHTML=`<h2>Results By Weather</h2>`;
     document.getElementById("resultsTemp").innerHTML=`New Search`;
 }




function filterData(data) {

    //get the text for the option selected
    var monthSelected = $('#monthSelector :selected').text();

    ///////CHECK WHAT HAPPENS WHEN IS JANUARY!!!
    //this will create an object only containing the data for the month
    var dataMonth = data.filter(function (element) {
        return (element.month === monthSelected);
    });

    //convert to number the number fields
    dataMonth.forEach(function (d) {
        d.hostelNight = parseInt(d.hostelNight);
        d.meals = parseInt(d.meals);
        d.drinks = parseInt(d.drinks);
        d.transport = parseInt(d.transport);
        d.attractions = parseInt(d.attractions);
        d.visitorsCity = parseInt(d.visitorsCity);
        d.minTemp = parseInt(d.minTemp);
        d.maxTemp = parseInt(d.maxTemp);

    })

    //https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
    document.getElementById("resultsBudget").addEventListener("click", filterByBudget(dataMonth));
    document.getElementById("resultsTemp").addEventListener("click", filterByWeather(dataMonth));
}





function filterByBudget(dataMonth) {
    return function () {

        var filteredBy = 'Budget';

        //get input value
        var maxBudgetValue = parseInt(document.getElementById("maxBudget").value);
        //add validation!! not empty and number

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

        //If there is one or more cities matching the criteria it will call the function createDataForGraphics(dataBudget);
        if (checkIfObjectEmpty(dataBudget)) {
            document.getElementById("infoMessage").innerHTML=`<h2 class="text-danger">We're sorry but Europe is not that cheap!</h2>`;
            $("#budgetCharts").hide();

        }
        else {
            document.getElementById("infoMessage").innerHTML="";
            $("#budgetCharts").show();
            createDataForGraphics(dataBudget, filteredBy);
        }

       

    }
};


function filterByWeather(dataMonth) {
    return function () {

        var filteredBy = 'Weather';

        //get input values
        var minTemp = document.getElementById("minTemp").value;
        var maxTemp = document.getElementById("maxTemp").value;

        //add validation!! not empty and number


        //this will create an Object only containing the cities that fit the budget
        
            var dataWeather = dataMonth.filter(function (element) {
            return (minTemp >= element.minTemp && maxTemp <= element.maxTemp);
        });


        //If there is one or more cities matching the criteria it will call the function createDataForGraphics(dataBudget);
        if (checkIfObjectEmpty(dataWeather)) {
            document.getElementById("infoMessageWeather").innerHTML=`<h2 class="text-danger">We're sorry but we don't cities with that average weather</h2>`;
            $("#weatherCharts").hide();

        }
        else {
            document.getElementById("infoMessageWeather").innerHTML="";
            $("#weatherCharts").show();
            createDataForGraphics(dataWeather, filteredBy);
        }

        //checks if the value object after filtering by budget is empty
        

    }
};

//this function will check if there is or there isn't matching results in the data
//if the object is empty meand that not matches where found
function checkIfObjectEmpty(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key))
            return false;
    }
    return true;
}






function createDataForGraphics(data, filteredBy) {
    var ndx = crossfilter(data);


    if (filteredBy === 'Budget') {
        fiterByCountry(ndx);
        createCurrencyChart(ndx);
        createCityChart(ndx);
        createTotalDailyBudget(ndx);
        createCorrelationCharts(data, ndx)
    }
    if (filteredBy === 'Weather') {
        createTempCityChart(ndx);
    }
   

    dc.renderAll();
}



function fiterByCountry(ndx) {
    {
        var dim = ndx.dimension(dc.pluck('country'));
        var group = dim.group();

        dc.selectMenu('#countrySelector')
            .multiple(true)
            .dimension(dim)
            .group(group);

    }
}


function createCurrencyChart(ndx) {

    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency")
        .height(100)
        .radius(50)
        .dimension(dimCurrency)
        .group(groupCurrency)
        .transitionDuration(1500);
}

function createCityChart(ndx) {

    var dimCity = ndx.dimension(dc.pluck('city'))
    var groupCity = dimCity.group();

    dc.pieChart("#city")
        .height(100)
        .radius(50)
        .dimension(dimCity)
        .group(groupCity)
        .transitionDuration(1500);
}

function createTotalDailyBudget(ndx) {

    var cityDim = ndx.dimension(dc.pluck('city'));
    var hostel = cityDim.group().reduceSum(dc.pluck('hostelNight'));
    var meals = cityDim.group().reduceSum(dc.pluck('meals'));
    var drinks = cityDim.group().reduceSum(dc.pluck('drinks'));
    var transport = cityDim.group().reduceSum(dc.pluck('transport'));
    var attractions = cityDim.group().reduceSum(dc.pluck('attractions'));


    dc.barChart('#totalDailyBudget')
        .width(400)
        .height(120)
        .dimension(cityDim)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .group(hostel, "hostel")
        .stack(meals, "meals")
        .stack(drinks, "drinks")
        .stack(attractions, "attractions")
        .stack(transport, "transport")
        .title(function (d) {
            return 'In ' + d.key + ' the ' + this.layer + ' by day cost: ' + d.value;
        })
        .transitionDuration(1500)
        .elasticX(true)
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('City')
        .yAxisLabel('Total daily budget')
        .yAxis().ticks(8);
    //.legend(dc.legend().x(320).y(20).itemHeight(15).gap(5));
    // .margins({top: 10, right: 50, bottom: 30, left: 40});

}



function createCorrelationCharts(data, ndx) {

    //var dimArrivals = ndx.dimension(dc.pluck('visitorsCity'));

    data.forEach(function (d) {
        d.column1 = +d.column1;
    });

    var maxArrivals = d3.max(data, function (d) { return d.visitorsCity; });

    var dimBudget = ndx.dimension(function (d) {
        var totalBudget = d.hostelNight + d.meals + d.drinks + d.attractions + d.transport;
        return [d.visitorsCity, totalBudget, d.city];
        // return [d.hostelNight];

    })

    var budgetGroup = dimBudget.group();

  /*  var cityColours = d3.scale.ordinal()
        .domain(["Vienna", "Brussels", "Prague", "Copenhagen", "Helsinki", "Paris", "Berlin", "Athens",
            "Budapest", "Dublin", "Milan", "Rome", "Amsterdam", "Oslo", "Warsaw", "Lisbon",
            "Barcelona", "Madrid", "Stockholm", "Istanbul", "Edinburgh", "London"])
        .range(["#FBEC5D", "#F2C649", "#6050DC", "#0BDA51", "#979AAA", "#F37A48", "#FDBE02", "#FF8243",
            "#74C365", "#880085", "#EAA221", "#C32148", "#800000", "#B03060", "#E0B0FF", "#915F6D", "#EF98AA",
            "#47ABCC", "#30BFBF", "#ACACE6", "#5E8C31", "#D9E650"]);
*/

    dc.scatterPlot("#correlation")
        .height(120) //breading space around pie chart, dont confuse with diameter
        .width(400)
        .x(d3.scale.linear().domain([0, maxArrivals]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel('Number of country visitor (2017 or 2018)')
        .yAxisLabel("Budget")
        .title(function (d) {
            return "In " + d.key[2] + " you will need a daily bugget of " + d.key[1] + " \nand there was " + d.key[0] + " millions visits in 2017";
        })
     /*   .colorAccessor(function (d) {
            return d.key[0];
        })
        .colors(cityColours)*/
        .dimension(dimBudget)
        .group(budgetGroup);
}

function createTempCityChart(ndx){

}


