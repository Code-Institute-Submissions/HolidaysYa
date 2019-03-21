queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);


function getMonth(error, data) {

    // only call "createGraphics" the month value after the dropdown option has been selected
    $("#monthSelector").change(function () {
        filterData(data);
    });
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
    })

    //https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
    document.getElementById("resultsBudget").addEventListener("click", filterByBudget(dataMonth));
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
            //return (parseInt(element.maxBudget) < maxBudgetValue);
            return (totalBudget < maxBudgetValue);
        });


        //If there is one or more cities matching the criteria it will call the function createDataForGraphics(dataBudget);
        if (tooCheap(dataBudget)) {
            alert('There is nothing that cheap in Europe');  // change it to message in screen
        }
        else {
            createDataForGraphics(dataBudget, filteredBy);
        }

        //checks if the value object after filtering by budget is empty
        function tooCheap(dataBudget) {
            for (var key in dataBudget) {
                if (dataBudget.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        ////////////////////for testing
        //console.log(typeof dataBudget);
        //console.log(typeof maxBudgetValue);


    }
};



function createDataForGraphics(data, filteredBy) {
    //console.log(data);

    var ndx = crossfilter(data);

    if (filteredBy === 'Budget') {
        fiterByCountry(ndx);
        createCurrencyCharts(ndx);
        //genderBalance(ndx);
        createTotalDailyBudget(ndx);
        // createCorrelationCharts(ndx)
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

function createCurrencyCharts(ndx) {

    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency")
        .height(200) //breading space around pie chart, dont confuse with diameter
        .radius(90)
        .dimension(dimCurrency)
        .group(groupCurrency)
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
        .width(600)
        .height(500)
        .dimension(cityDim)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .group(hostel, "hostel")
        .stack(meals, "meals")
        .stack(drinks, "drinks")
        .stack(attractions, "attractions")
        .stack(transport, "transport")
        .title(function(d) {
            return 'In ' + d.key + ' the ' + this.layer + ' by day cost: ' + d.value;
        })
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('City')
       .yAxisLabel('Total daily budget')
        .yAxis().ticks(20);
      //  .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
       //.margins({ top: 10, right: 100, bottom: 30, left: 30 });


}



/*function createCorrelationCharts(ndx) {

    var dimArrivals = ndx.dimension(dc.pluck('arrivals'))
    var groupBudget = dimArrivals.group().reduce(dc.pluck('meals'));

    dc.scatterPlot("#correlation")
        .height(400) //breading space around pie chart, dont confuse with diameter
        .width(600)
        .dimension(dimArrivals)
        .group(groupBudget)
        .transitionDuration(1500)
        .x(d3.scaleLinear().domain([1000000,7000000]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10);

}


function genderBalance(ndx) {

    var dim = ndx.dimension(dc.pluck('city'));
    var group = dim.group();
    var hostel = dim.group().reduceSum(dc.pluck('hostelNight'));


    dc.barChart('#correlation')
        .width(800)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('City')
        .yAxis().ticks(20);

}

*/