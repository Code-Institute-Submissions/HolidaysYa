queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);


function getMonth(error, data) {

    if (error) {  /////////// improve this???
        document.getElementById("error").innerHTML = `<h2 class="text-danger">Error retrieving the data file!</h2>`;
    }

    //Don't show the input fields unless the buttons are pressed
    $(".budgetSelect").hide();
    $(".weatherSelect").hide();


    // only call "filterData" after the dropdown option has been selected
    $("#monthSelector").change(function () {
        filterData(data);
    });
}



function filterData(data) {

    document.getElementById("chooseBudget").addEventListener("click", optionBudget());
    document.getElementById("chooseWeather").addEventListener("click", optionWeather());

    //get the text for the option selected
    var monthSelected = $('#monthSelector :selected').text();

    //////////////////////////////////////////////////////////CHECK WHAT HAPPENS WHEN IS JANUARY!!!
    //this will create an object only containing the data for the month
    var dataMonth = data.filter(function (element) {
        return (element.month === monthSelected);
    });

    //convert to number the number fields
    convertToInteger(dataMonth);


    //https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
    document.getElementById("resultsBudget").addEventListener("click", filterByBudget(dataMonth));
    document.getElementById("resultsTemp").addEventListener("click", filterByWeather(dataMonth));
}





function filterByBudget(dataMonth) {
    return function () {
        //removes the inputs in case we want to seach again by weather
        $('input[name=minTemp').val('');
        $('input[name=maxTemp').val('');

        var filteredBy = 'Budget';
        $(".weather").hide();
        $(".common").show();



        //get input value and converte it to number
        var maxBudgetValue = parseInt(document.getElementById("maxBudget").value);
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

        //If there is one or more cities matching the criteria it will call 
        //the function "createDataForGraphics" if not it will display a message;

        citiesMatchingCriteria(dataBudget, filteredBy);
    }
};


function filterByWeather(dataMonth) {
    return function () {
        //removes the input in case we want to seach again by weather
        $('input[name=maxBudget').val('');

        var filteredBy = 'Weather';
        $(".budget").hide();
        $(".common").show();

        var dataWeather;

        //get input values
        var minTemp = document.getElementById("minTemp").value;
        var maxTemp = document.getElementById("maxTemp").value;

        if (minTemp == "" && maxTemp == "") {
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">Please enter a minumun, a maximun temperature or both</h2>`;
        }
        else if (minTemp != "" && maxTemp == "") {
            //this will create an Object only containing the cities that have that temperature


            dataWeather = dataMonth.filter(function (element) {
                return (minTemp <= element.minTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it will display a message;

            citiesMatchingCriteria(dataWeather, filteredBy);

        }
        else if (minTemp == "" && maxTemp != "") {
            //this will create an Object only containing the cities that have that temperature


            dataWeather = dataMonth.filter(function (element) {
                return (maxTemp >= element.maxTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it will display a message;

            citiesMatchingCriteria(dataWeather, filteredBy);

        }

        else if (minTemp != "" && maxTemp != "" && maxTemp>minTemp) {
            //this will create an Object only containing the cities that have that temperature


            dataWeather = dataMonth.filter(function (element) {
                return (minTemp <= element.minTemp && maxTemp >= element.maxTemp);
            });
            //If there is one or more cities matching the criteria it will call 
            //the function "createDataForGraphics" if not it will display a message;

            citiesMatchingCriteria(dataWeather, filteredBy);

        }
        // else if(if(minTemp != "" && maxTemp != "" && maxTemp<minTemp)){
        //     document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">The maximune temperature must be higher than the minimun</h2>`;
        // }

    }
};


function citiesMatchingCriteria(data, filteredBy) {
    document.getElementById("infoMessage").innerHTML = "";

    if (checkIfObjectEmpty(data)) {

        if (filteredBy == "Budget") {
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">We're sorry but Europe is not that cheap!</h2>`;
        } else {
            document.getElementById("infoMessage").innerHTML = `<h2 class="text-danger">We're sorry but we don't cities with that average weather</h2>`;
        }
        $("#charts").hide();
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



function createDataForGraphics(data, filteredBy) {
    var ndx = crossfilter(data);

    //Budget graphics
    if (filteredBy === 'Budget') {
        fiterByCountry(ndx);
        createCurrencyChart(ndx);
        createCityChart(ndx);
        createTotalDailyBudget(ndx);
        createCorrelationCharts(data, ndx)
        createTable(ndx);

    }

    //weather graphics
    if (filteredBy === 'Weather') {
        fiterByCountry(ndx);
        createCurrencyChart(ndx);
        createCityChart(ndx);
       // createTempCityChart(ndx);
        createTable(ndx);
        cityTemp(ndx);

    }
    dc.renderAll();
}



function fiterByCountry(ndx) {

    var dim = ndx.dimension(dc.pluck('country'));
    var group = dim.group();

    dc.selectMenu('#countrySelector')
        .multiple(true)
        .dimension(dim)
        .group(group);
};


function createCurrencyChart(ndx) {

    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency")
        .height(100)
        .radius(50)
        .dimension(dimCurrency)
        .group(groupCurrency)
        .transitionDuration(1500);
};

function createCityChart(ndx) {

    var dimCity = ndx.dimension(dc.pluck('city'))
    var groupCity = dimCity.group();

    dc.pieChart("#city")
        .height(100)
        .radius(50)
        .dimension(dimCity)
        .group(groupCity)
        .transitionDuration(1500);
};

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
    //??????.legend(dc.legend().x(320).y(20).itemHeight(15).gap(5));
    //?????? .margins({top: 10, right: 50, bottom: 30, left: 40});

};



function createCorrelationCharts(data, ndx) {

    var maxArrivals = d3.max(data, function (d) { return d.visitorsCity; });

    var dimBudget = ndx.dimension(function (d) {
        var totalBudget = d.hostelNight + d.meals + d.drinks + d.attractions + d.transport;
        return [d.visitorsCity, totalBudget, d.city];
    })

    var budgetGroup = dimBudget.group();

    // var cityColours = d3.scale.ordinal()
    //     .domain(["Vienna", "Brussels", "Prague", "Copenhagen", "Helsinki", "Paris", "Berlin", "Athens",
    //         "Budapest", "Dublin", "Milan", "Rome", "Amsterdam", "Oslo", "Warsaw", "Lisbon",
    //         "Barcelona", "Madrid", "Stockholm", "Istanbul", "Edinburgh", "London"])
    //     .range(["#FBEC5D", "#F2C649", "#6050DC", "#0BDA51", "#979AAA", "#F37A48", "#FDBE02", "#FF8243",
    //         "#74C365", "#880085", "#EAA221", "#C32148", "#800000", "#B03060", "#E0B0FF", "#915F6D", "#EF98AA",
    //         "#47ABCC", "#30BFBF", "#ACACE6", "#5E8C31", "#D9E650"]);


    dc.scatterPlot("#correlation")
        .height(120)
        .width(400)
        .x(d3.scale.linear().domain([0, maxArrivals]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel('Number of country visitors (2017 or 2018)')
        .yAxisLabel("Budget")
        .title(function (d) {
            return "In " + d.key[2] + " you will need a daily bugget of " + d.key[1] + " \nand there was " + d.key[0] + " millions visits in 2017";
        })
        // .colorAccessor(function (d) {
        //     return d.key[0];
        // })
        // .colors(cityColours)
        .dimension(dimBudget)
        .group(budgetGroup);
}

function createTable(ndx) {

   
    var allDimension = ndx.dimension(function(d) {
        return (d);
    });
    

   // var dimGroup = allDimension.group().reduceCount();

   var tableChart = dc.dataTable('#table');
    tableChart
        .dimension(allDimension)
        .group(function(data) {
            return (data);
        })
        .size(Infinity)
        .columns(['city', 'country', 'attractions','hostelNight','drinks','meals','transport','minTemp','maxTemp','precipitation','currency','currencyCode','arrivals','visitorsCity'])
        .sortBy(function(d) {
            return d.value;
        })
        .order(d3.ascending);
}


function cityTemp(ndx){

    var dim  = ndx.dimension(dc.pluck('city')),
        
        //   it works with precipitation and linear scale but not with city and ordinal scale
        //   var dim  = ndx.dimension(dc.pluck('precipitation')),


            grp1 = dim.group().reduceSum(dc.pluck('maxTemp')),
            grp2 = dim.group().reduceSum(dc.pluck('minTemp'));

         var composite = dc.compositeChart("#cityTemp");
             composite
                .width(400)
               .height(220)
              .x(d3.scale.ordinal())
              .xUnits(dc.units.ordinal)
              .dimension(dim)
              .group(grp1, "maximun temperature")
            // .x(d3.scale.linear().domain([20,80]))
            
            
               //.dimension(dim)
               .yAxisLabel("Temperature")
               .xAxisLabel("City")
               .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
               .renderHorizontalGridLines(true)
               .compose ([
                  dc.lineChart(composite)
                     .dimension(dim)
                     .colors('red')
                     .group(grp1, "maximun temperature")
                     .dashStyle([2,2]),
                  dc.lineChart(composite)
                     .dimension(dim)
                     .colors('blue')
                     .group(grp2, "minimun temperature")
                    .dashStyle([5,5])
               ])
               .brushOn(false);




}

///////////// other functions


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
    })
}

function optionBudget() {
    //remove inforMessage in case it has the previous message
    document.getElementById("infoMessage").innerHTML = "";

    //hide weather input boxes
    $(".weatherSelect").hide();
    //show budget input box
    $(".budgetSelect").show();

    //hide all charts and we will wait until the "search" button is clicked
    $("#charts").hide();
}

function optionWeather() {
    //remove inforMessage in case it has the previous message
    document.getElementById("infoMessage").innerHTML = "";

    //hide budget input box
    $(".budgetSelect").hide();

    //show weather input boxes
    $(".weatherSelect").show();

    //hide all charts and we will wait until the "search" button is clicked
    $("#charts").hide();
}

//Charts Title depend on the button clicked option
//will be "Budget or Weather"
function showTitle(option) {
    document.getElementById("Title").innerHTML = `<h2>Results By ${option}</h2>`;
    if (option == "Budget") {
        document.getElementById("resultsBudget").innerHTML = `New Search`;
    } else {
        document.getElementById("resultsTemp").innerHTML = `New Search`;
    }
}