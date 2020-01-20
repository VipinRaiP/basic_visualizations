/*
 *    Scatter plot per district
 */


var margin = { left: 80, right: 200, top: 50, bottom: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 1000 - margin.left - margin.right;

var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var t = function() {
  return d3.transition().duration(1000);
};

var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y");
var bisectDate = d3.bisector(function(d) {
  return d.ReportingDate;
}).left;

// Labels
var xLabel = g
  .append("text")
  .attr("class", "x axisLabel")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Time");
var yLabel = g
  .append("text")
  .attr("class", "y axisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("<%=yLabel%>");

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// X-axis
var xAxisCall = d3
  .axisBottom()
  .ticks(6)
  .tickFormat(d3.timeFormat("%b-%Y"));

var xAxis = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

// Y-axis
var yAxisCall = d3.axisLeft();
var yAxis = g.append("g").attr("class", "y axis");

// Add jQuery UI slider
$("#date-slider").slider({
  range: true,
  max: new Date().getTime(),
  min: parseTime("2017-12-12").getTime(),
  step: 86400000, // One day
  values: [parseTime("2017-12-12").getTime(), new Date().getTime()],
  slide: function(event, ui) {
    $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
    $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
    update();
  }
});

postData = {
  districtId: '<%=districtId%>'
};

var data;

$.post("<%=data%>", postData, function(response, status) {
  console.log(response);
  date = new Date(response[0].ReportingDate);
  console.log(response[0].ReportingDate);
  console.log(date.getTime());
  data = response;
  data.forEach(d => {
    d["ReportingDate"] = new Date(d.ReportingDate).getTime();
  });

  console.log(data);
  // Run the visualization for the first time
  update();
});

 // Adding legends

 var legendGroup = svg.append("g")
 .attr("transform","translate("+(width-80)+","+(height-300)+")");

 //.attr("transform", "translate(0," + height + ")");
legendGroup
.append("circle")
.attr("cx", 200)
.attr("cy", 130)
.attr("r", 6)
.style("fill", "green");

legendGroup  
.append("circle")
.attr("cx", 200)
.attr("cy", 160)
.attr("r", 6)
.style("fill", "red");

legendGroup
.append("text")
.attr("x", 220)
.attr("y", 130)
.text("Less than 30 cases")
.style("font-size", "15px")
.attr("alignment-baseline", "middle");

legendGroup
.append("text")
.attr("x", 220)
.attr("y", 160)
.text("More than 30 cases")
.style("font-size", "15px")
.attr("alignment-baseline", "middle");


function update() {
  sliderValues = $("#date-slider").slider("values");
  dataFiltered = data.filter(function(d) {
    return (
      d.ReportingDate >= sliderValues[0] && d.ReportingDate <= sliderValues[1]
    );
  });

  value = "<%=columnName%>";

  // Update scales
  x.domain(
    d3.extent(dataFiltered, function(d) {
      return d.ReportingDate;
    })
  );
  y.domain([
    d3.min(dataFiltered, function(d) {
      return d[value];
    }),
    d3.max(dataFiltered, function(d) {
      return d[value];
    })
  ]);

  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  var tooltip = d3
    .select("#chart-area")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
    //var color = colorScale(d.manufacturer);
    console.log("called");
    var html =
      "<span> Reporting Date: " +
      formatTime(new Date(d.ReportingDate)) +
      "</span><br/>" +
      "<b> Cases reported: " +
      d[value] +
      "</b>";
    tooltip
      .html(html)
      .style("left", d3.event.pageX + 15 + "px")
      .style("top", d3.event.pageY - 28 + "px")
      .transition()
      .duration(200) // ms
      .style("opacity", 0.9); // started as 0!
  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
    tooltip
      .transition()
      .duration(300) // ms
      .style("opacity", 0); // don't care about position!
  };

  // Update axes
  xAxisCall.scale(x);
  xAxis.transition(t()).call(xAxisCall);
  yAxisCall.scale(y);
  yAxis.transition(t()).call(yAxisCall);

  // JOIN new data with old elements.
  var rects = g.selectAll(".dot").data(dataFiltered, d => d.ReportingDate);

  // EXIT old elements not present in new data.
  rects
    .exit()
    //.attr("fill", "red")
    .transition(t)
    .attr("cy", y(0))
    .remove();

  // ENTER new elements present in new data.
  rects
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("fill", function(d) {
      if (d[value] < 30) return "green";
      else return "red";
    })
    .attr("cx", function(d) {
      return x(d.ReportingDate);
    })
    .attr("cy", y(0))
    .attr("r", 5)
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout)
    .merge(rects)
    .transition(t)
    .attr("cx", function(d) {
      return x(d.ReportingDate);
    })
    .attr("cy", function(d) {
      return y(d[value]);
    });

 
}