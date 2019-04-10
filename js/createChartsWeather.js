

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

function show_avg_temp(ndx, max, min, element) {

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



function createRowChart(ndx) {
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
        .margins({ top: 60, right: 20, bottom: 60, left: 35 })
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
                .colors('#f70826')
               .dashStyle([3,3]),
            dc.lineChart(composite)
                .dimension(dim)
                .group(grp2, "min. Temperature")
                .clipPadding(10)
                .colors('#1f98f5')
                .dashStyle([8,3])
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
                .symbolSize(7)
                .colors('#e6770d')
                .clipPadding(10)
                .title(function (d) {
                    return d.key[2] + " the average temperature is " + d.key[1] + " degrees\nand there was " + d.key[0] + " millions visits in 2017";
                })
                .group(temperatureGroup, "temperature"),
            dc.scatterPlot(composite)
                .dimension(dimPreci)
                .symbolSize(7)
                .colors('#1ebfae')
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
        .ordinalColors(["#30a5f1","#ffb53e","#098275"])
        .transitionDuration(1500);
};




