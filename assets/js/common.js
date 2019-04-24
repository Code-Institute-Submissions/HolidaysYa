// this file has the JavaScript code that is common for both dashboards: filters, function to update titles and count of number of cities filtered

// function to create the filters
function fiterBy(ndx, element) {
    var dim;
    if (element === "#filterByRegion") {
        dim = ndx.dimension(dc.pluck('region'));
    }
    else if (element === "#filterByCountry") {
        dim = ndx.dimension(dc.pluck('country'));
    }
    else if (element === "#filterByCity") {
        dim = ndx.dimension(dc.pluck('city'));
    }
    var group = dim.group();

    dc.selectMenu(element)
        .multiple(true)
        .dimension(dim)
        //I use "d.key" for the title so only the name appears but not the count
        .title(function (d) { return d.key; })
        .group(group);
}

// this function will update the text in the titles depending on what dashboard we want to see
function updateTextTitles(option) {
    document.getElementById("title").innerHTML = `<h2>Results By ${option}</h2>`;
     if(option==="Budget"){
         document.getElementById("titleRowChart").innerHTML = "Budget needed per day (€)";
         document.getElementById("stackedComposite").innerHTML = "Budget distribution (€)";
         document.getElementById("pieChart").innerHTML = "Currency";
         document.getElementById("scatterChart").innerHTML = "Correlation between cost of visiting and number of visitor per year";  
        }
        else{
        document.getElementById("titleRowChart").innerHTML = "Precipitation per month (mm)";
        document.getElementById("stackedComposite").innerHTML = "Maximum and Minimum temperatures(°C)";
        document.getElementById("pieChart").innerHTML = "Chances of precipitation";
        document.getElementById("scatterChart").innerHTML = "Correlation between Avg. temperature/Precipitation and number of visitor per year";
    }
}

// this function will count the number of rows filtered and it will be display using a numberDisplay
function countCities(ndx) {
    var total = ndx.groupAll().reduce(
        //p keeps track of the changes, v will be input values from the dataset
        //function adder
        function (p, v) {
            p.count++;
            return p;
        },
        //function remover
        function (p, v) {
            p.count--;          
            return p;
        },
        //Initialise the Reducer
        function () {
            return { count: 0 };
        }
    );

    dc.numberDisplay('#totalCities')
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
                return d.count;
                })
        .group(total);
}

