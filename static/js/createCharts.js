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
        show_avg(ndx, "attractions", "#attractions_minpreci");
    }

    //weather graphics
    if (filteredBy === 'Weather') {
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
        .group(group);
};

function createCurrencyChart(ndx) {

    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency_precipitation")
        .useViewBoxResizing(true) // allows chart to be responsive
        // .height(80)
        // .radius(40)
        .dimension(dimCurrency)
        .group(groupCurrency)
        .transitionDuration(1500);
};


function createPrecipitationChart(ndx) {

    var dimPrecipitation = ndx.dimension(function (d) {
        if (d.precipitation >= 85) {
            return "Hight";
        }
        if (d.precipitation < 85 && d.precipitation >= 40) {
            return "Medium";
        }
        else {
            return "Low";
        }
    });

    var groupPrecipitation = dimPrecipitation.group();  // or groupAll()??

    //console.log(groupPrecipitation.groupAll());

    dc.pieChart("#currency_precipitation")
        .useViewBoxResizing(true) // allows chart to be responsive
        // .height(80)
        // .radius(40)
        .dimension(dimPrecipitation)
        .group(groupPrecipitation)
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
        .barPadding(0.3)
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

    var composite = dc.compositeChart("#correlation")
    composite
        .useViewBoxResizing(true) // allows chart to be responsive
        .x(d3.scale.linear().domain([0, maxArrivals]))


        .xAxisLabel('Number of country visitors (2017 or 2018)')
        .yAxisLabel("Avg. Temperature")
        .rightYAxisLabel("Avg. Precipitation")
        .shareTitle(false)
        .dimension(dimTemp)
        .group(temperatureGroup, "temperature")
        .renderHorizontalGridLines(true)
        .brushOn(false)

        .compose([
            dc.scatterPlot(composite)
                .dimension(dimTemp)
                .symbolSize(8)
                .colors('red')
                .clipPadding(10)
                .title(function (d) {
                    return d.key[2] + " the average temperature is " + d.key[1] + " degrees\nand there was " + d.key[0] + " millions visits in 2017";
                })
                .group(temperatureGroup, "temperature"),
            dc.scatterPlot(composite)
                .dimension(dimPreci)
                .symbolSize(8)
                .colors('green')
                .clipPadding(10)
                .title(function (d) {
                    return d.key[2] + " the average precipitation is " + d.key[1] + " mm\nand there was " + d.key[0] + " millions visits in 2017";
                })
                .group(precipitationGroup, "precipitation")
                .useRightYAxis(true)

        ])
        .elasticX(true)
        .elasticY(true);

}



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
                label: "Month",
                format: function (d) { return d.month }
            },
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
                label: "Attractions",
                format: function (d) { return d.attractions }
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
            },
            {
                label: "Find out more...",
                format: function (d) { return d.wikiLink }
            }
        ])

        .sortBy(function (d) {
            return d.value;
        })
        .showGroups(false)// this will remove the [object][object] at the top of the rows
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


function showTitle(option) {
    document.getElementById("Title").innerHTML = `<h2>Results By ${option}</h2>`;
}




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
        .formatNumber(function (d) {
            if (product != "transport") {
                return "€" + d3.format(".2s")(d);
            }
            else {
                return "€" + d3.format(".0s")(d);
            }

        })
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


function show_max_weather(ndx, column, element) {

    // in order to calculate the maximun temperature I used Stackoverflow for help and they suggest to use the following code
    var maxDim = ndx.dimension(dc.pluck(column));

    dc.numberDisplay(element)
        .group(dim_max_groupAll(maxDim, column))
        .valueAccessor(x => x)
        .formatNumber(d3.format('.0f'))
        .render();

}


function show_min_weather(ndx, column, element) {

    // in order to calculate the maximun temperature I used Stackoverflow for help and they suggest to use the following code
    var minDim = ndx.dimension(dc.pluck(column));

    dc.numberDisplay(element)
        .group(dim_min_groupAll(minDim, column))
        .valueAccessor(x => x)
        .formatNumber(d3.format('.0f'))
        .render();

}

function show_avg_temp(ndx, max, min, element) {

    // in order to calculate the maximun temperature I used Stackoverflow for help and they suggest to use the following code
    var maxDim = ndx.dimension(dc.pluck(max));
    var minDim = ndx.dimension(dc.pluck(min));

    dc.numberDisplay(element)
        .group(dim_avg_groupAll(maxDim, minDim))
        .valueAccessor(x => x)
        .formatNumber(d3.format('.1f'))
        .render();

}


function dim_max_groupAll(maxDim, column) {

    return {
        value: function () {
            return maxDim.top(1)[0][column];
        }
    };


}

function dim_min_groupAll(minDim, column) {

    return {
        value: function () {
            return minDim.bottom(1)[0][column];
        }
    };

}

function dim_avg_groupAll(maxDim, minDim) {

    return {
        value: function () {
            return (maxDim.top(1)[0].maxTemp + minDim.bottom(1)[0].minTemp) / 2;
        }

    }
}
