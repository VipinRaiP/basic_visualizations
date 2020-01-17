/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.2 - Looping with intervals
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("District Id");

// Y Label
g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Total Alcohol Cases")

/* Get the data from sql db */

var data;

$.get('/alcoholData',function(res,status){
    console.log(res);
    data = res;

    data.forEach(function(d) {
        d.DistrictId = +d.DistrictId;
        d.Count = +d.Count;
    });

    // X Scale
    var x = d3.scaleBand()
        .domain(data.map(function(d){ return d.DistrictId }))
        .range([0, width])
        .padding(0.2);

    // Y Scale
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Count })])
        .range([height, 0]);

    // X Axis
    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height +")")
        .call(xAxisCall);

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return d; });
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    // Bars
    var rects = g.selectAll("rect")
        .data(data)
        
    rects.enter()
        .append("rect")
            .attr("y", function(d){ return y(d.Count); })
            .attr("x", function(d){ return x(d.DistrictId) })
            .attr("height", function(d){ return height - y(d.Count); })
            .attr("width", x.bandwidth)
            .attr("fill", function(d){ if(d.Count<3000) {return "green";} else return "red"});


})







