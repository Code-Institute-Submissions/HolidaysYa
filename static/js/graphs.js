queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);


function getMonth(error, data) {

    if (error) { /////////// improve this???
        document.getElementById("error").innerHTML = `<h2 class="text-danger">Error retrieving the data file!</h2>`;
    }

    //if the logo is clicked go to the main page
    $(".navbar-brand").click(function() {
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
    });

}


function filterData(data) {

    // document.getElementById("chooseBudget").addEventListener("click", optionBudget());
    // document.getElementById("chooseWeather").addEventListener("click", optionWeather());

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


        if (maxBudgetValue=="") {
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

function createDataForGraphics(data, filteredBy) {

    var ndx = crossfilter(data);

    fiterBy(ndx, "#filterByRegion");
    fiterBy(ndx, "#filterByCountry");
    fiterBy(ndx, "#filterByCity");
    createCurrencyChart(ndx);
    createRowChart(ndx);
    createTable(ndx);


    //Budget graphics
    if (filteredBy === 'Budget') {
        createTotalDailyBudget(ndx);
        createCorrelationCharts(data, ndx)
        show_avg(ndx, "hostel", "#hostel_maxtem");
        show_avg(ndx, "meals", "#meals_mintem");
        show_avg(ndx, "drinks", "#drinks_avgtemp");
        show_avg(ndx, "transport", "#transport_maxpreci");
        show_avg(ndx, "attractions", "#attractions_mintemp");
    }

    //weather graphics
    if (filteredBy === 'Weather') {
        // show_avg_weather(ndx, "drinks", "#hostel_maxtem");
        // show_avg_weather(ndx, "mintem", "#meals_mintem");
        // show_avg_weather(ndx, "avgtemp", "#drinks_avgtemp");
        // show_avg_weather(ndx, "maxpreci", "#transport_maxpreci");
        // show_avg_weather(ndx, "mintemp", "#attractions_mintemp");
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
        .group(group);
};

function createCurrencyChart(ndx) {

    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency")
        .useViewBoxResizing(true) // allows chart to be responsive
        // .height(80)
        // .radius(40)
        .dimension(dimCurrency)
        .group(groupCurrency)
        .transitionDuration(1500);
};


function createTotalDailyBudget(ndx) {

    var cityDim = ndx.dimension(dc.pluck('city'));
    var hostel = cityDim.group().reduceSum(dc.pluck('hostelNight'));
    var meals = cityDim.group().reduceSum(dc.pluck('meals'));
    var drinks = cityDim.group().reduceSum(dc.pluck('drinks'));
    var transport = cityDim.group().reduceSum(dc.pluck('transport'));
    var attractions = cityDim.group().reduceSum(dc.pluck('attractions'));


    dc.barChart('#dailyBudget_Temp')
        .useViewBoxResizing(true) // allows chart to be responsive
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


//at the moment this is showing meals but I need to update it to show total!!
function createRowChart(ndx) {
    var dimCity = ndx.dimension(dc.pluck('city'));

    var budgetGroup = dimCity.group().reduceSum(function (d) {
        var totalBudget = d.hostelNight + d.meals + d.drinks + d.attractions + d.transport;
        return [totalBudget];
    });

    dc.rowChart("#rowChart")
        .useViewBoxResizing(true) // allows chart to be responsive
        .x(d3.scale.linear().domain([0, 200]))
        .elasticX(true)
        .dimension(dimCity)
        .group(budgetGroup);


}

function createCorrelationCharts(data, ndx) {

    var maxArrivals = d3.max(data, function (d) { return d.visitorsCity; });

    var dimBudget = ndx.dimension(function (d) {
        var totalBudget = d.hostelNight + d.meals + d.drinks + d.attractions + d.transport;
        return [d.visitorsCity, totalBudget, d.city];
    });

    var budgetGroup = dimBudget.group();

    // var cityColours = d3.scale.ordinal()
    //     .domain(["Vienna", "Brussels", "Prague", "Copenhagen", "Helsinki", "Paris", "Berlin", "Athens",
    //         "Budapest", "Dublin", "Milan", "Rome", "Amsterdam", "Oslo", "Warsaw", "Lisbon",
    //         "Barcelona", "Madrid", "Stockholm", "Istanbul", "Edinburgh", "London"])
    //     .range(["#FBEC5D", "#F2C649", "#6050DC", "#0BDA51", "#979AAA", "#F37A48", "#FDBE02", "#FF8243",
    //         "#74C365", "#880085", "#EAA221", "#C32148", "#800000", "#B03060", "#E0B0FF", "#915F6D", "#EF98AA",
    //         "#47ABCC", "#30BFBF", "#ACACE6", "#5E8C31", "#D9E650"]);


    dc.scatterPlot("#correlation")
        .useViewBoxResizing(true) // allows chart to be responsive
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


function createCorrelationTemp(data, ndx) {

    var maxArrivals = d3.max(data, function (d) { return d.visitorsCity; });
   
    var dimTemp = ndx.dimension(function (d) {
        var avgTemp = (d.maxTemp + d.minTemp) / 2;
        return [d.visitorsCity, avgTemp, d.city];
    });

    var temperatureGroup = dimTemp.group();

    var dimPreci = ndx.dimension(function (d) {
         return [d.visitorsCity, d.precipitation, d.city];
    });

    var precipitationGroup = dimPreci.group();

   // console.log(precipitationGroup.all());

    var composite = dc.compositeChart("#correlation")
    composite
        .useViewBoxResizing(true) // allows chart to be responsive
        .x(d3.scale.linear().domain([0, 150]).range(0,200))

        
        
        .xAxisLabel('Number of country visitors (2017 or 2018)')
        .yAxisLabel("Avg. Temperature")
        .rightYAxisLabel("Avg. Precipitation")
        .shareTitle(false)
        .dimension(dimTemp)
        .group(temperatureGroup,"temperature")
        .renderHorizontalGridLines(true)
        .brushOn(false)
       
        .compose([
            dc.scatterPlot(composite)
                .dimension(dimTemp)
                 .symbolSize(8)
                 .colors('red')
                 .clipPadding(10)
                 .title(function (d) {
                    return d.key[2] + " the average temperature is "+d.key[1] + " degrees\nand there was " + d.key[0] + " millions visits in 2017";
                        })
                         .group(temperatureGroup,"temperature"),
            dc.scatterPlot(composite)
                   .dimension(dimPreci)
                    .symbolSize(8)        
                   .colors('green')
                   .clipPadding(10)
                   .title(function (d) {
                    return d.key[2] + " the average precipitation is "+d.key[1] + " mm\nand there was " + d.key[0] + " millions visits in 2017";
                        })
                  .group(precipitationGroup,"precipitation")
                  .useRightYAxis(true)

        ])
        .elasticX(true)
        .elasticY(true);

}


// function createCorrelationTemp(data, ndx) {

//     var maxArrivals = d3.max(data, function (d) { return d.visitorsCity; });
   
//     var dimTemp = ndx.dimension(function (d) {
//         var avgTemp = (d.maxTemp + d.minTemp) / 2;
//         return [d.visitorsCity, avgTemp, d.city, d.precipitation];
//     });

//     var temperatureGroup = dimTemp.group();

//    // console.log(precipitationGroup.all());

//     dc.scatterPlot("#correlation")
//         .useViewBoxResizing(true) // allows chart to be responsive
//         .x(d3.scale.linear().domain([0, maxArrivals]))
//         .brushOn(false)
//         .symbolSize(8)
//         .clipPadding(10)
//         .xAxisLabel('Number of country visitors (2017 or 2018)')
//         .yAxisLabel("Avg. Temperature")
//         .title(function (d) {
//             return "In " + d.key[2] + " the average temperature is "+ d.key[1] + ",\nthe average precipitation is " + d.key[1] + " mm \nand there was " + d.key[0] + " millions visits in 2017";
//         })
//         .dimension(dimTemp)
//         .group(temperatureGroup)
//         .renderHorizontalGridLines(true)
        
//         .brushOn(false)
//         // .colorAccessor(function (d) {
//         //     return d.key[0];
//         // })
//         // .colors(cityColours)
//         .elasticX(true)
//         .elasticY(true);

// }




function createTable(ndx) {

    var allDimension = ndx.dimension(function (d) {
        return (d);
    });

    var tableChart = dc.dataTable('#table');
    tableChart
        .useViewBoxResizing(true) // allows chart to be responsive
        .dimension(allDimension)
        .group(function (data) {
            return (data);
        })
        .size(Infinity)
        .columns([
            {
                label: "City",
                format: function (d) { return d.city }
            },
            {
                label: "Country",
                format: function (d) { return d.country }
            },
            {
                label: "Hostel",
                format: function (d) { return d.hostelNight }
            },
            {
                label: "Meals",
                format: function (d) { return d.meals }
            },
            {
                label: "Drinks",
                format: function (d) { return d.drinks }
            },
            {
                label: "Transport",
                format: function (d) { return d.transport }
            },
            {
                label: "min.Temperature(C)",
                format: function (d) { return d.minTemp }
            },
            {
                label: "max.Temperature(C)",
                format: function (d) { return d.maxTemp }
            },
            {
                label: "Precipitation",
                format: function (d) { return d.precipitation }
            },
            {
                label: "Currency",
                format: function (d) { return d.currency }
            },
            {
                label: "Visitors per year\n (Millions)",
                format: function (d) { return d.visitorsCity }
            }
        ])

        .sortBy(function (d) {
            return d.value;
        })
        .order(d3.ascending);
}


function cityTemp(ndx) {

    //initial issue with the alignment of the chart was fixed after reading the following link
    //https://github.com/dc-js/dc.js/issues/662
    var dim = ndx.dimension(dc.pluck('city')),

        grp1 = dim.group().reduceSum(dc.pluck('maxTemp')),
        grp2 = dim.group().reduceSum(dc.pluck('minTemp'));

    var composite = dc.compositeChart("#dailyBudget_Temp");
    composite

        .useViewBoxResizing(true) // allows chart to be responsive
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(grp1, "maximun temperature")
        .yAxisLabel("Temperature")
        .xAxisLabel("City")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        ._rangeBandPadding(1)
        .compose([
            dc.lineChart(composite)
                .dimension(dim)
                .colors('red')
                .group(grp1, "maximun temperature")
                .dashStyle([2, 2]),
            dc.lineChart(composite)
                .dimension(dim)
                .colors('blue')
                .group(grp2, "minimun temperature")
                .dashStyle([5, 5])
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
        d.precipitation = parseInt(d.precipitation);

    })
}

// function optionBudget() {
//     //remove inforMessage in case it has the previous message
//     document.getElementById("infoMessage").innerHTML = "";
// }

// function optionWeather() {
//     //remove inforMessage in case it has the previous message
//     document.getElementById("infoMessage").innerHTML = "";
// }

//Charts Title depend on the button clicked option
//will be "Budget or Weather"
function showTitle(option) {
    document.getElementById("Title").innerHTML = `<h2>Results By ${option}</h2>`;
}


/////// testing


function show_avg(ndx, product, element) {

    var average_cost = ndx.groupAll().reduce(

        //Add a data entry
        //p and v by convention, p will keep track of the changes and v will be input values from the actual values from the dataset that will affect the values of p

        //inline function adder
        function (p, v) {
            p.count++;
            p.totaldrinks += +v.drinks;
            p.averagedrinks = p.totaldrinks / p.count;

            p.totalmeals += +v.meals;
            p.averagemeals = p.totalmeals / p.count;

            p.totalattractions += +v.attractions
            p.averageattractions = p.totalattractions / p.count;

            p.totaltransport += +v.transport
            p.averagetransport = p.totaltransport / p.count;

            p.totalhostel += +v.hostelNight
            p.averagehostel = p.totalhostel / p.count;

            return p;
        },

        //inline function remover

        // Remov ethe data entry
        function (p, v) {
            p.count--;
            if (p.count == 0) {
                p.totaldrinks = 0;
                p.averagedrinks = 0;

                p.totalmeals = 0;
                p.averagemeals = 0;

                p.totalattractions = 0;
                p.averageattractions = 0;

                p.totaltransport = 0;
                p.averagetransport = 0;

                p.totalhostel = 0;
                p.averagehostel = 0;
            }
            else {
                p.totaldrinks -= +v.drinks
                p.averagedrinks = p.totaldrinks / p.count;

                p.totalmeals -= +v.meals
                p.averagemeals = p.totalmeals / p.count;

                p.totalattractions -= +v.attractions
                p.averageattractions = p.totalattractions / p.count;

                p.totaltransport -= +v.transport
                p.averagetransport = p.totaltransport / p.count;

                p.totalhostel -= +v.hostelNight
                p.averagehostel = p.totalhostel / p.count;
            }
            return p;
        },

        //inline function initialiser

        //Initialise the Reducer
        function () {
            return { count: 0, totaldrinks: 0, averagedrinks: 0, totalmeals: 0, averagemeals: 0, totalattractions: 0, averageattractions: 0, totaltransport: 0, averagetransport: 0, totalhostel: 0, averagehostel: 0 }
        }
    );



    dc.numberDisplay(element)
        //.formatNumber(d3.format('.2'))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                if (product == "hostel") {
                    return d.averagehostel;
                }
                else if (product == "meals") {
                    return d.averagemeals;
                }
                else if (product == "drinks") {
                    return d.averagedrinks;
                }
                else if (product == "transport") {
                    return d.averagetransport;
                }
                else if (product == "attractions") {
                    return d.averageattractions;
                }
            }
        })
        .group(average_cost);
}



// function show_avg_weather(ndx, product, element) {

//     var average_weather = ndx.groupAll().reduce(

//         //Add a data entry
//         //p and v by convention, p will keep track of the changes and v will be input values from the actual values from the dataset that will affect the values of p

//         //inline function adder
//         function (p, v) {
//             p.count++;

//             p.total += +v.maxTemp;
//             p.averagetemp = p.total / p.count;

//             return p;
//         },

//         //inline function remover

//         // Remov ethe data entry
//         function (p, v) {
//             p.count--;
//             if (p.count == 0) {
//                 p.total = 0;
//                 p.averagetemp = 0;
//             }
//             else {

//                 p.count--;
//                 p.total -= +v.maxTem;
//                 p.averagetemp = p.total / p.count;
//             }
//             return p;
//         },

//         //inline function initialiser

//         //Initialise the Reducer
//         function () {
//             return { count: 0, total: 0, averagetemp: 0 }
//         }
//     );

//     dc.numberDisplay(element)
//         //.formatNumber(d3.format('.2'))
//         .valueAccessor(function (d) {
//             if (d.count == 0) {
//                 return 0;
//             }
//             else {
//                 return d.total;

//             }
//         })
//         .group(average_weather);
// }





// function show_avg_weather(ndx, product, element) {

//     var average_cost = ndx.groupAll().reduce(

//         //Add a data entry
//         //p and v by convention, p will keep track of the changes and v will be input values from the actual values from the dataset that will affect the values of p

//         //inline function adder
//         function (p, v) {
//             p.count++;

//             if(p.totaldrinks<v.maxTemp){
//                 p.totaldrinks=v.maxTemp;
//             }else{
//                 p.totaldrinks=p.totaldrinks;  
//             }

//             // p.totaldrinks += +v.maxTemp;
//             // p.averagedrinks = p.totaldrinks / p.count;

           

//             return p;
//         },

//         //inline function remover

//         // Remov ethe data entry
//         function (p, v) {
//             p.count--;
//             if (p.count == 0) {
//                 p.totaldrinks = 0;
//                 p.averagedrinks = 0;

                          
//             }
//             else {
//                 if(p.totaldrinks<v.maxTemp){
//                     p.totaldrinks=v.maxTemp;
//                 }else{
//                     p.totaldrinks=p.totaldrinks;  
//                 }

//                 // p.totaldrinks -= +v.maxTemp
//                 // p.averagedrinks = p.totaldrinks / p.count;

              
//             }
//             return p;
//         },

//         //inline function initialiser

//         //Initialise the Reducer
//         function () {
//             return { count: 0, totaldrinks: 0, averagedrinks: 0 }
//         }
//     );



//     dc.numberDisplay(element)
//         //.formatNumber(d3.format('.2'))
//         .valueAccessor(function (d) {
//             if (d.count == 0) {
//                 return 0;
//             }
//             else {
//                 if (product == "drinks") {
                 
//                     return d.averagedrinks;
//                 }
               
//             }
//         })
//         .group(average_cost);
// }

