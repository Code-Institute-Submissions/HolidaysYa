
function show_max_weather(ndx, column, element) {
    // in order to calculate the maximum temperature I used Stackoverflow for help and they suggest to use the following code
    var maxDim = ndx.dimension(dc.pluck(column));

    dc.numberDisplay(element)
        .group(dim_max_groupAll(maxDim, column))
        .valueAccessor(x => x)
        .formatNumber(d3.format('.0f'))
        .render();
}

function show_min_weather(ndx, column, element) {
    var minDim = ndx.dimension(dc.pluck(column));

    dc.numberDisplay(element)
        .group(dim_min_groupAll(minDim, column))
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

function dim_min_groupAll(minDim, column) {
    return {
        value: function () {
            return minDim.bottom(1)[0][column];
        }
    };
}

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
            return { count: 0, totalmax: 0, totalmin: 0, totalavg: 0, averageTemp: 0 }
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

function createRowChartWeather(ndx) {
    var dimCity = ndx.dimension(dc.pluck('city'));
    var precipitationGroup = dimCity.group().reduceSum(dc.pluck('precipitation'));

    dc.rowChart("#rowChart")
        .height(600)
        .useViewBoxResizing(true)
        .x(d3.scale.linear().domain([0, 200]))
        //Why this doesn't work is becau
        //.xAxis().tickValues([0, 50, 100, 150])  
        .elasticX(true)
        .transitionDuration(1500)
        .ordinalColors(["#006B99", "#2E85AB", "#5CA0BE", "#8BBBD0", "#B9D6E3", "#0E9E8D", "#39AFA1", "#65C1B6", "#91D2CB", "#BDE4DF", "#F2C44F", "#ECC970", "#F0D590", "#F6E6BD", "#F4994E", "#F6AB6E", "#F9C9A2", "#FAD5B7", "#E86443", "#EA7254", "#EC8065", "#F3B3A3", "#F6C6BA", "#F9D9D1"])
        .dimension(dimCity)
        .group(precipitationGroup);
}


function cityTemp(ndx) {
    //initial issue with the alignment of the chart was fixed after reading the following link
    //https://github.com/dc-js/dc.js/issues/662

    var dim = ndx.dimension(dc.pluck('city')),
        grp1 = dim.group().reduceSum(dc.pluck('maxTemp')),
        grp2 = dim.group().reduceSum(dc.pluck('minTemp'));

    var composite = dc.compositeChart("#dailyBudget_Temp");
    composite
        .height(250)
        .useViewBoxResizing(true) // allows chart to be responsive
        .margins({ top: 60, right: 20, bottom: 55, left: 35 })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(grp1, "max. Temperature")
        .yAxisLabel("Temperature")
        .xAxisLabel("City")
        .clipPadding(10)
        .legend(dc.legend().x(30).y(0).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        ._rangeBandPadding(1)
        .compose([
            dc.lineChart(composite)
                .dimension(dim)
                .group(grp1, "max. Temperature")
                .clipPadding(10)
                .colors('#E86443')
                .dashStyle([3, 3]),
            dc.lineChart(composite)
                .dimension(dim)
                .group(grp2, "min. Temperature")
                .clipPadding(10)
                .colors('#006B99')
                .dashStyle([8, 3])
        ])
        .brushOn(false)
        .transitionDuration(1500);
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
        .height(250)
        .useViewBoxResizing(true) // allows chart to be responsive
        .margins({ top: 55, right: 50, bottom: 40, left: 30 })
        .legend(dc.legend().x(40).y(0).itemHeight(13).gap(5))
        .x(d3.scale.linear().domain([0, maxArrivals]))
        .xAxisLabel('Number of country visitors (2017 or 2018)')
        .yAxisLabel("Avg. Temperature")
        .rightYAxisLabel("Avg. Precipitation")
        .clipPadding(10)
        .shareTitle(false)
        .dimension(dimTemp)
        .group(temperatureGroup, "temperature")
        .renderHorizontalGridLines(true)
        .brushOn(false)
        .compose([
            dc.scatterPlot(composite)
                .dimension(dimTemp)
                // .renderHorizontalGridLines(true)
                .symbolSize(7)
                .colors('#F2C44F')
                .clipPadding(10)
                .title(function (d) {
                    return d.key[2] + " the average temperature is " + d.key[1] + " degrees\nand there was " + d.key[0] + " millions visits in 2017";
                })
                .group(temperatureGroup, "temperature"),
            dc.scatterPlot(composite)
                .dimension(dimPreci)
                // .renderHorizontalGridLines(true)
                .symbolSize(7)
                .colors('#0E9E8D')
                .clipPadding(10)
                .title(function (d) {
                    return d.key[2] + " the average precipitation is " + d.key[1] + " mm\nand there was " + d.key[0] + " millions visits in 2017";
                })
                .group(precipitationGroup, "precipitation")
                .useRightYAxis(true)
        ]);
}



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
        .useViewBoxResizing(true) // allows chart to be responsive
        .externalRadiusPadding(20)
        .dimension(dimPrecipitation)
        .group(groupPrecipitation)
        .renderLabel(false)
        .ordinalColors(["#E86443", "#F2C44F", "#0E9E8D"])
        .transitionDuration(1500);
};


function createTableWeather(ndx) {
    var allDimension = ndx.dimension(function (d) {
        return (d);
    });

    var tableChart = dc.dataTable('#table');
    tableChart
        .height(300)
        .width(400)
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
                label: "min.Temp(C)",
                format: function (d) { return d.minTemp }
            },
            {
                label: "max.Temp(C)",
                format: function (d) { return d.maxTemp }
            },
            {
                label: "avg.Temp(C)",
                format: function (d) { return (d.maxTemp + d.minTemp) / 2 }
            },
            {
                label: "Precipitation",
                format: function (d) { return d.precipitation }
            },
            {
                label: "Visitors (Millions/year)",
                format: function (d) { return d.visitorsCity }
            },
            {
                label: "Find out more...",
                format: function (d) { return d.wikiLink }
            }
        ])
        .sortBy(function (d) {
            return (d.maxTemp + d.minTemp) / 2;
        })
        .showGroups(false)// this will remove the [object][object] at the top of the rows
        .order(d3.ascending);
}

