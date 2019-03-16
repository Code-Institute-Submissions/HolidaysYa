queue()
    .defer(d3.csv, "data/Data.csv")
    .await(createGraphics);

//var optionText =  $('#monthSelector option:selected').text();



function createGraphics(error, data) {

   
    createBudgetCharts(data);

    dc.renderAll();
}




function createBudgetCharts(data) {
    
    
    
     //first we need to extract the data corresponding to the month selected
    //get the text for the option selected

    var monthSelected;
    $("#monthSelector").change(function() {
        monthSelected = $('#monthSelector option:selected').text();
        //alert( "Handler for .change() called." );
        return
    }).change();


    console.log(monthSelected);



    var dataMonth = data.filter(function(element) {
        return (element.month == monthSelected);
    });

    //console.log(monthSelected);

    var ndx = crossfilter(dataMonth);


    var dimCurrency = ndx.dimension(dc.pluck('currencyCode'))
    var groupCurrency = dimCurrency.group();

    dc.pieChart("#currency")
        .height(200) //breading space around pie chart, dont confuse with diameter
        .radius(90)
        .dimension(dimCurrency)
        .group(groupCurrency)
        .transitionDuration(1500);

}
