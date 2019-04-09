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
        .height(200)

        .useViewBoxResizing(true) // allows chart to be responsive
        .dimension(dimPrecipitation)
        .group(groupPrecipitation)
        .transitionDuration(1500);
};


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
        .height(600)

        .useViewBoxResizing(true) // allows chart to be responsive
        .x(d3.scale.linear().domain([0, maxArrivals]))
        .clipPadding(10)
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

        ]);

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
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(grp1, "maximun temperature")
        .yAxisLabel("Temperature")
        .xAxisLabel("City")
        .renderArea(false)
        //.legend(dc.legend().x(600).y(0).itemHeight(13).gap(5))
        .margins({ top: 10, right: 50, bottom: 80, left: 50 })
        .renderHorizontalGridLines(true)
        ._rangeBandPadding(1)
        .compose([
            dc.lineChart(composite)
                .dimension(dim)
                .colors('red')
                .renderArea(false)
                .group(grp1, "maximun temperature")
                .dashStyle([2, 2]),
            dc.lineChart(composite)
                .dimension(dim)
                .colors('blue')
                .renderArea(false)
                .group(grp2, "minimun temperature")
                .dashStyle([5, 5])
        ])
        .brushOn(false)
        .transitionDuration(1500);
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