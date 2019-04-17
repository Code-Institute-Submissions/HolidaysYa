function showTitle(option) {
    document.getElementById("title").innerHTML = `<h2>Results By ${option}</h2>`;

     if(option==="Budget"){
         document.getElementById("titleRowChart").innerHTML = "Budget needed per day (€)";
         document.getElementById("stackedComposite").innerHTML = "Budget distribution (€)";
         document.getElementById("pieChart").innerHTML = "Currency";
         document.getElementById("scatterChart").innerHTML = "Correlation between cost of visiting and number of visitor per year";  
        }
        else{
        document.getElementById("titleRowChart").innerHTML = "Precipitation per month (mm)";
        document.getElementById("stackedComposite").innerHTML = "Maximun and Minimun temperatures";
        document.getElementById("pieChart").innerHTML = "Chances of precipitation";
        document.getElementById("scatterChart").innerHTML = "Correlation between av.temperature and precipitation and number of visitor per year";
    }
}

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
        // Remove the data entry
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
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
                return d.count;
                })
        .group(total);
}

