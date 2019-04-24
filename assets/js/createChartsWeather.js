
/*function to calculte the maximum temperature and precipitation
from the cities filtered and show them in a number display*/
function show_max_weather(ndx, column, element) {
    /* In order to calculate the maximum temperature (from all the maximum temperatures
        for the cities filtered) I used Stackoverflow for help and they suggest to use the 
        following code. Then I replicated the code to calculate the minimun temperature*/

    var maxDim = ndx.dimension(dc.pluck(column));

    dc.numberDisplay(element)
        .group(dim_max_groupAll(maxDim, column))
        .valueAccessor(x => x)
        .formatNumber(d3.format('.0f'))
        .render();
}

function dim_max_groupAll(maxDim, column) {
    return {
        value: function () {
            return maxDim.top(1)[0][column];
        }
    };
}

/*function to calculte the minimum temperature and precipitation
from the cities filtered and show them in a number display*/
function show_min_weather(ndx, column, element) {
    var minDim = ndx.dimension(dc.pluck(column));

    dc.numberDisplay(element)
        .group(dim_min_groupAll(minDim, column))
        .valueAccessor(x => x)
        .formatNumber(d3.format('.0f'))
        .render();
}

function dim_min_groupAll(minDim, column) {
    return {
        value: function () {
            return minDim.bottom(1)[0][column];
        }
    };
}

/*function to calculate the average temperature for the 
cities filtered and show it in a number display*/
function show_avg_temp(ndx, element) {
    var average_temp = ndx.groupAll().reduce(
        //function adder
        function (p, v) {
            p.count++;
            p.totalmax += +v.maxTemp;
            p.totalmin += +v.minTemp;
            p.totalavg = (p.totalmax + p.totalmin) / 2;
            p.averageTemp = p.totalavg / p.count;
            return p;
        },
        //function remover
        function (p, v) {
            p.count--;
            if (p.count == 0) {
                p.totalmax = 0;
                p.totalmin = 0;
                p.totalavg = 0;
                p.averageTemp = 0;
            }
            else {
                p.totalmax -= +v.maxTemp;
                p.totalmin -= +v.minTemp;
                p.totalavg = (p.totalmax + p.totalmin) / 2;
                p.averageTemp = p.totalavg / p.count;
            }
            return p;
        },
        //Initialise
        function () {
            return { count: 0, totalmax: 0, totalmin: 0, totalavg: 0, averageTemp: 0 };
        }
    );

    dc.numberDisplay(element)
        .formatNumber(function (d) {
            return d3.format(".1f")(d);
        })
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return d.averageTemp;
            }
        })
        .group(average_temp);
}

// function to display the row chart with the average precipitation for the cities filtered
function createRowChartWeather(ndx) {
    var dimCity = ndx.dimension(dc.pluck('city'));
    var precipitationGroup = dimCity.group().reduceSum(dc.pluck('precipitation'));

    dc.rowChart("#rowChart")
        .height(600)
        .useViewBoxResizing(true) // to make the chart responsive
        .elasticX(true)
        .title(function (d) {
            return "The average precipitation for " + d.key + " is: " + d.value + "mm";
        })
        .transitionDuration(1500)
        .ordinalColors(["#006B99", "#2E85AB", "#5CA0BE", "#8BBBD0", "#B9D6E3", "#0E9E8D", "#39AFA1", "#65C1B6", "#91D2CB", "#BDE4DF", "#F2C44F", "#ECC970", "#F0D590", "#F6E6BD", "#F4994E", "#F6AB6E", "#F9C9A2", "#FAD5B7", "#E86443", "#EA7254", "#EC8065", "#F3B3A3", "#F6C6BA", "#F9D9D1"])
        .dimension(dimCity)
        .group(precipitationGroup);
}

//function to display the composite line chart with the max. and min. temperatures
function cityTemp(ndx) {
    var dim = ndx.dimension(dc.pluck('city')),
        grp1 = dim.group().reduceSum(dc.pluck('maxTemp')),
        grp2 = dim.group().reduceSum(dc.pluck('minTemp'));

    var composite = dc.compositeChart("#dailyBudget_Temp");
    composite
        .height(250)
        .useViewBoxResizing(true) // to make the chart responsive
        .margins({ top: 60, right: 20, bottom: 55, left: 35 })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        /* in a composite chart .group shouldn't be included in
        this part of the code, only in the composite sub-charts code
        but it seems that the ordinal scale and composite charts don't display
        properly unless you add the .group in this part of the code as well */
        .group(grp1, "max. Temperature (°C)")
        .yAxisLabel("Temperature (°C)")
        .xAxisLabel("City")
        .title(function (d) {
            return d.key + ": " + d.value + "°C";
        })
        .clipPadding(10)
        .legend(dc.legend().x(30).y(0).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        ._rangeBandPadding(1)
        .compose([
            dc.lineChart(composite)
                .group(grp1, "max. Temperature (°C)")
                .colors('#E86443')
                .dashStyle([3, 3]),
            dc.lineChart(composite)
                .group(grp2, "min. Temperature (°C)")
                .colors('#006B99')
                .dashStyle([8, 3])
        ])
        .brushOn(false)
        .transitionDuration(1500);
}

/*function to display the composite scatter plot chart with the average temperature
and average precipitation and their correlation with the number of visits per year*/
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

    var composite = dc.compositeChart("#correlation");
    composite
        .height(250)
        .useViewBoxResizing(true) // to make the chart responsive
        .margins({ top: 55, right: 50, bottom: 40, left: 30 })
        .legend(dc.legend().x(40).y(0).itemHeight(13).gap(5))
        .x(d3.scale.linear().domain([0, maxArrivals]))
        .xAxisLabel('Number of country visitors per year')
        .yAxisLabel("Avg. Temperature (°C)")
        .rightYAxisLabel("Avg. Precipitation (mm)")
        .clipPadding(10)
        .shareTitle(false) //false so I can use different title for temperature and precipitation
        .renderHorizontalGridLines(true)
        .brushOn(false)
        .compose([
            dc.scatterPlot(composite)
                .dimension(dimTemp)
                .symbolSize(7)
                .colors('#F2C44F')
                .title(function (d) {
                    return d.key[2] + ": Average temperature: " + d.key[1] + "°C \n" + d.key[0] + " millions visits per year";
                })
                .group(temperatureGroup, "temperature (°C)"),
            dc.scatterPlot(composite)
                .dimension(dimPreci)
                .symbolSize(7)
                .colors('#0E9E8D')
                .title(function (d) {
                    return d.key[2] + ": Average precipitation: " + d.key[1] + " mm\n" + d.key[0] + " millions visits per year";
                })
                .group(precipitationGroup, "precipitation (mm)")
                .useRightYAxis(true)
        ]);
}

// function to display a pie chart with the chances of precipitation
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

    var groupPrecipitation = dimPrecipitation.group();

    dc.pieChart("#currency_precipitation")
        .height(250)
        .innerRadius(40)
        .legend(dc.legend().x(0).y(0).itemHeight(13).gap(5))
        .useViewBoxResizing(true) // to make the chart responsive
        .externalRadiusPadding(20)
        .dimension(dimPrecipitation)
        .group(groupPrecipitation)
        .title(function (d) {
            return "Number of cities with " + d.key + "\nchance of precipitation:  " + d.value;
        })
        .renderLabel(false)
        .ordinalColors(["#E86443", "#F2C44F", "#0E9E8D"])
        .transitionDuration(1500);
}

// this function creates the table
function createTableWeather(ndx) {
    var allDimension = ndx.dimension(function (d) {
        return (d);
    });

    var tableChart = dc.dataTable('#table');
    tableChart
        .height(300)
        .width(400)
        .useViewBoxResizing(true) // to make the chart responsive
        .dimension(allDimension)
        .group(function (data) {
            return (data);
        })
        .size(Infinity)
        .columns([
            {
                label: "City",
                format: function (d) { return d.city; }
            },
            {
                label: "Country",
                format: function (d) { return d.country; }
            },
            {
                label: "Min.Temp(°C)",
                format: function (d) { return d.minTemp; }
            },
            {
                label: "Max.Temp(°C)",
                format: function (d) { return d.maxTemp; }
            },
            {
                label: "Avg.Temp(°C)",
                format: function (d) { return (d.maxTemp + d.minTemp) / 2; }
            },
            {
                label: "Precipitation",
                format: function (d) { return d.precipitation; }
            },
            {
                label: "Visitors (Millions/year)",
                format: function (d) { return d.visitorsCity; }
            },
            {
                label: "Find out more...",
                format: function (d) { return d.wikiLink; }
            }
        ])
        .sortBy(function (d) {
            return (d.maxTemp + d.minTemp) / 2;
        })
        .order(d3.descending)
        .showGroups(false);// this will remove the [object][object] at the top of the rows
}

