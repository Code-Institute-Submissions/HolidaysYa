function createTable(ndx) {

    var allDimension = ndx.dimension(function (d) {
        return (d);
    });



    var tableChart = dc.dataTable('#table');
    tableChart
        .useViewBoxResizing(true) // allows chart to be responsive
        .dimension(allDimension)
        .group(function (data) {
            return (data);
        })
        .size(Infinity)
        .columns([
            {
                label: "Month",
                format: function (d) { return d.month }
            },
            {
                label: "City",
                format: function (d) { return d.city }
            },
            {
                label: "Country",
                format: function (d) { return d.country }
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
                label: "min.Temperature(C)",
                format: function (d) { return d.minTemp }
            },
            {
                label: "max.Temperature(C)",
                format: function (d) { return d.maxTemp }
            },
            {
                label: "Precipitation",
                format: function (d) { return d.precipitation }
            },
            {
                label: "Currency",
                format: function (d) { return d.currency }
            },
            {
                label: "Visitors per year\n (Millions)",
                format: function (d) { return d.visitorsCity }
            },
            {
                label: "Find out more...",
                format: function (d) { return d.wikiLink }
            }
        ])

        .sortBy(function (d) {
            return d.value;
        })
        .showGroups(false)// this will remove the [object][object] at the top of the rows
        .order(d3.ascending);
}


function showTitle(option) {
    document.getElementById("Title").innerHTML = `<h2>Results By ${option}</h2>`;

     if(option==="Budget"){
         document.getElementById("titleRowChart").innerHTML = "Euros needed per day";
         document.getElementById("stackedComposite").innerHTML = "Budget distribution";
         document.getElementById("pieChart").innerHTML = "Currency";
         document.getElementById("scatterChart").innerHTML = "Correlation between total budget needed and number of visitor per year";

    
        }else{
        document.getElementById("titleRowChart").innerHTML = "Precipitation per month (mm)";
        document.getElementById("stackedComposite").innerHTML = "Maximun and Minimun temperatures";
        document.getElementById("pieChart").innerHTML = "Chances of precipitation";
        document.getElementById("scatterChart").innerHTML = "Correlation between av.temperature and precipitation and number of visitor per year";

    }

    }


// function countCities(ndx){

//     var countChart = dc.dataCount("#mystats");
//     countChart
//     .dimension(ndx)
//     .group(ndx.groupAll());


// }

function countCities(ndx) {

    var total = ndx.groupAll().reduce(

        //Add a data entry
        //p and v by convention, p will keep track of the changes and v will be input values from the actual values from the dataset that will affect the values of p

        //inline function adder
        function (p, v) {
            p.count++;
            return p;
        },

        //inline function remover

        // Remov ethe data entry
        function (p, v) {
            p.count--;          
            return p;
        },

        //inline function initialiser

        //Initialise the Reducer
        function () {
            return { count: 0 }
        }
    );



    dc.numberDisplay('#totalCities')
        .formatNumber(d3.format(".1s"))
        .valueAccessor(function (d) {
                return d.count;
                })
        .group(total);
}

