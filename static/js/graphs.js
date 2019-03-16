queue()
    .defer(d3.csv, "data/Data.csv")
    .await(createGraphics);

//var optionText =  $('#monthSelector option:selected').text();

function createGraphics(error, data){
   
   $( "#monthSelector" ).change(function() {
   createGraphics2(data);
}); 
    
}



function createGraphics2(error, data) {

    //first we need to extract the data corresponding to the month selected
    //get the text for the option selected

  
    var monthSelected = $('#monthSelector :selected').text();
      console.log(monthSelected);
 
    var dataMonth = data.filter(function(element) {
        return (element.month === 'March');
    });

    //console.log(monthSelected);

    var ndx = crossfilter(dataMonth);

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
