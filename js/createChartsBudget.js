function createRowChart(ndx) {
    var dimCity = ndx.dimension(dc.pluck('city'));
    var budgetGroup = dimCity.group().reduceSum(function (d) {
        var totalBudget = d.hostelNight + d.meals + d.drinks + d.attractions + d.transport;
        return [totalBudget];
    });

    dc.rowChart("#rowChart")
        .height(600)
        .useViewBoxResizing(true)
        .x(d3.scale.linear().domain([0, 200]))
        .title(function (d) { return "Minimun daily budget in " + d.key + ": " + d.value + "€"; })
        .elasticX(true)
        .transitionDuration(1500)
        .ordinalColors(["#006B99", "#2E85AB", "#5CA0BE", "#8BBBD0", "#B9D6E3", "#0E9E8D", "#39AFA1", "#65C1B6", "#91D2CB", "#BDE4DF", "#F2C44F", "#ECC970", "#F0D590", "#F6E6BD", "#F4994E", "#F6AB6E", "#F9C9A2", "#FAD5B7", "#E86443", "#EA7254", "#EC8065", "#F3B3A3", "#F6C6BA", "#F9D9D1"])
        .dimension(dimCity)
        .group(budgetGroup);
}

function createTotalDailyBudget(ndx) {
    var cityDim = ndx.dimension(dc.pluck('city'));
    var hostel = cityDim.group().reduceSum(dc.pluck('hostelNight'));
    var meals = cityDim.group().reduceSum(dc.pluck('meals'));
    var drinks = cityDim.group().reduceSum(dc.pluck('drinks'));
    var transport = cityDim.group().reduceSum(dc.pluck('transport'));
    var attractions = cityDim.group().reduceSum(dc.pluck('attractions'));

    dc.barChart('#dailyBudget_Temp')
        .height(300)
        .useViewBoxResizing(true) // allows chart to be responsive        
        .margins({ top: 15, right: 10, bottom: 55, left: 35 })
        .dimension(cityDim)
        .group(hostel, "hostel")
        .stack(meals, "meals")
        .stack(drinks, "drinks")
        .stack(attractions, "attractions")
        .stack(transport, "transport")
        .title(function (d) {
            return 'In ' + d.key + ' the ' + this.layer + ' by day cost: ' + d.value + '€';
        })
        .ordinalColors(["#006B99", "#0E9E8D", "#F2C44F", "#F4994E", "#E86443"])
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .barPadding(0.3)
        .xAxisLabel('City')
        .yAxisLabel('Total daily budget')
        .yAxis().ticks(6);
    //??????.legend(dc.legend().x(320).y(20).itemHeight(15).gap(5));
};

function createCurrencyChart(ndx) {
    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency_precipitation")
        .height(200)
        .innerRadius(25)
        .legend(dc.legend().x(0).y(10).itemHeight(13).gap(5))
        .useViewBoxResizing(true) // allows chart to be responsive
        .externalRadiusPadding(40)
        .dimension(dimCurrency)
        .group(groupCurrency)
        .renderLabel(false)
        .ordinalColors(["#006B99", "#4593B4", "#0E9E8D", "#65C1B6", "#F2C44F", "#F0D590", "#F4994E", "#F8BE8E", "#E86443"])
        .transitionDuration(1500);
};

function createCorrelationCharts(data, ndx) {
    var maxArrivals = d3.max(data, function (d) { return d.visitorsCity; });

    var dimBudget = ndx.dimension(function (d) {
        var totalBudget = d.hostelNight + d.meals + d.drinks + d.attractions + d.transport;
        return [d.visitorsCity, totalBudget, d.city];
    });

    var budgetGroup = dimBudget.group();

    dc.scatterPlot("#correlation")
        .height(200)
        .useViewBoxResizing(true) // allows chart to be responsive
        .x(d3.scale.linear().domain([0, maxArrivals]))
        .brushOn(false)
        .symbolSize(10)
        .clipPadding(10)
        .xAxisLabel('Number of country visitors (2017 or 2018)')
        .yAxisLabel("Budget")
        .transitionDuration(1500)
        .colors('#E76F51')
        .title(function (d) {
            return "In " + d.key[2] + " you will need a daily bugget of " + d.key[1] + " \nand there was " + d.key[0] + " millions visits in 2017";
        })
        .dimension(dimBudget)
        .group(budgetGroup);
}

function show_avg(ndx, product, element) {
    var average_cost = ndx.groupAll().reduce(
        //function adder
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
        //function remover
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
        //Initialise
        function () {
            return { count: 0, totaldrinks: 0, averagedrinks: 0, totalmeals: 0, averagemeals: 0, totalattractions: 0, averageattractions: 0, totaltransport: 0, averagetransport: 0, totalhostel: 0, averagehostel: 0 }
        }
    );

    dc.numberDisplay(element)
        .formatNumber(function (d) {
            if (product != "transport") {
                return d3.format(".2s")(d) + "€";
            }
            else {
                return d3.format(".0s")(d) + "€";
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

function createTableBudget(ndx) {
    var total = 0;
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
                label: "Daily budget",
                format: function (d) {
                    total = d.hostelNight + d.drinks + d.meals + d.attractions + d.transport;
                    return total
                }
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
                label: "Currency",
                format: function (d) { return d.currency }
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
            total = d.hostelNight + d.drinks + d.meals + d.attractions + d.transport;
            return total;
        })
        .showGroups(false)// this will remove the [object][object] at the top of the rows
        .order(d3.ascending);
}
