queue()
    .defer(d3.csv, "data/Data.csv")
    .await(getMonth);


function getMonth(error, data) {
    //console.log(data);

    // only call "createGraphics" the month value after the dropdown option has been selected
    $("#monthSelector").change(function () {
        filterData(data);
    });
}


function filterData(data) {

    //get the text for the option selected
    var monthSelected = $('#monthSelector :selected').text();


    //this will create an object only containing the data for the month
    var dataMonth = data.filter(function (element) {
        return (element.month === monthSelected);
    });

    //https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
    document.getElementById("resultsBudget").addEventListener("click", filterByBudget(dataMonth));
}

function filterByBudget(dataMonth) {
    return function () {

        var filteredBy = 'Budget';

        console.log("check!" + dataMonth.maxBudget);
        //get input value
        var maxBudgetValue = parseInt(document.getElementById("maxBudget").value);
        //add validation!! not empty and number

        //this will create an Object only containing the cities that fit the budget
        var dataBudget = dataMonth.filter(function (element) {
            return (parseInt(element.maxBudget) < maxBudgetValue);
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
        console.log(typeof dataBudget);
        console.log(typeof maxBudgetValue);


    }
};



function createDataForGraphics(data, filteredBy) {
    console.log(data);
    var ndx = crossfilter(data);

    if (filteredBy = 'Budget') {
        fiterByCountry(ndx);
        createBudgetCharts(ndx);
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

function createBudgetCharts(ndx) {

    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency")
        .height(200) //breading space around pie chart, dont confuse with diameter
        .radius(90)
        .dimension(dimCurrency)
        .group(groupCurrency)
        .transitionDuration(1500);

}
