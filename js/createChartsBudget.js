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
        .useViewBoxResizing(true) 
        .height(500)// allows chart to be responsive
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



