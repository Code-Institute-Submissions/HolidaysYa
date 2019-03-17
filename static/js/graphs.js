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
        var maxBudgetValue = parseInt(document.getElementById("maxBudget").value);
        //var maxBudgetNumber = parseInt(maxBudgetValue);

        var dataBudget = dataMonth.filter(function (element) {
            return (parseInt(element.maxBudget) < maxBudgetValue);
        });

        //for testing
        console.log(typeof dataBudget);
        console.log(typeof maxBudgetValue);

           

        if (maxBudgetValue<50) {  // update the 50 with the minimun value from the dataset once I know how to
            alert('Europe is not that cheap, sorry!'); //also remove the charts in the screen
        } else{
            createDataForGraphics(dataBudget);
        }

    }
};



function createDataForGraphics(data) {
    console.log(data);
    var ndx = crossfilter(data);
    createBudgetCharts(ndx);
    dc.renderAll();
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
