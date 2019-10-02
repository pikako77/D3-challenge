// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`); // change the (0,0) coord (left, top)

/// Functions for level 2
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// Step 2: Create scale functions
    // ==============================

    // create xScale() and yScale() to handle multiple axes for x and y
function xScale(Data, chosenAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenAxis])* 0.8,
               d3.max(Data, d => d[chosenAxis])* 1.2 ])
      .range([0, width]);
  return xLinearScale;
}

function yScale(Data, chosenAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenAxis])* 0.8,
             d3.max(Data, d => d[chosenAxis])* 1.2 ])
    .range([height, 0]);
return yLinearScale;
}

// function used for updating xAxis and yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // swicth xAxis label
  switch(chosenXAxis){
    case "poverty":
        var xLabel = "Poverty (%)";
        console.log("poverty");
        break;


    case "age":
        var xLabel = "Age";
        console.log("age");
        break;

    case "income":
        var xLabel = "income";
        console.log("income");
        break;

    default:
       console.log("default");
       var xLabel = "Poverty (%)";
  }


  // swicth yAxis label
  switch(chosenYAxis){
    case "healthcare":
        var yLabel = "healthcare";
        console.log("healthcare");
        break;


    case "smokes":
        var yLabel = "smokes";
        console.log("smokes");
        break;

    case "obesity":
        var yLabel = "obesity";
        console.log("obesity");
        break;

    default:
       console.log("default");
       var yLabel = "healthcare";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//// End Functions for level 2


/////////////////////////////////////////////////////////////////
// Load data
// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(dataCsv) {
    dataCsv.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age ;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    //console.log(data.abbr);
    //console.log(data.obesity);
     });
     //dataCsv.forEach(d=>console.log(d.abbr));

// Step 2: Create scale functions
    // ==============================
    // var xLinearScale = d3.scaleLinear()
    //   .domain([6, d3.max(dataCsv, d => d.poverty)])
    //   .range([0, width]);

    // var yLinearScale = d3.scaleLinear()
    //   .domain([0, d3.max(dataCsv, d => d.healthcare)])
    //   .range([height, 0]);
    var xLinearScale = xScale(dataCsv, chosenXAxis);
    var yLinearScale = yScale(dataCsv, chosenYAxis);

        // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

          // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(dataCsv)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))  //center coord x
    .attr("cy", d => yLinearScale(d.healthcare))//center coord y
    .attr("r", "15")
    .attr("fill", "skyblue")
    .attr("opacity", ".7");

  //   var AbbrGroup = chartGroup.selectAll("text")
  //   .data(dataCsv)
  //   .enter()
  //   .append("text")
  //   .style("font-size", "13")
  //   .style("text-anchor", "middle")
  //   .style('fill', 'white')
  //   .attr("x", d => xLinearScale(d.poverty))  //center coord x
  //   .attr("y", d => yLinearScale(d.healthcare))//center coord y
  //   .attr("class", "scatterText")
  //   .text(function(d) {
  //     console.log(d.abbr);
  //     return d.abbr;});
 



  //   // Step 6: Initialize tool tip
  //   // ==============================
  //   var toolTip = d3.tip()
  //     .attr("class", "tooltip")
  //     .offset([80, -60])
  //     .html(function(d) {
  //       return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Porverty : ${d.poverty}`);
  //     });

  //   // Step 7: Create tooltip in the chart
  //   // ==============================
  //   chartGroup.call(toolTip);

  //   // Step 8: Create event listeners to display and hide the tooltip
  //   // ==============================
  //   circlesGroup.on("click", function(data) {
  //     toolTip.show(data, this);
  //   })
  //     // onmouseout event
  //     .on("mouseout", function(data, index) {
  //       toolTip.hide(data);
  //     });
  //     var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

  //     // Create axes labels
  //     chartGroup.append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 0 - margin.left + 40)
  //     .attr("x", 0 - (height / 2))
  //     .attr("dy", "1em")
  //     .attr("class", "axisText")
  //     .text("Healthcare");

  //   chartGroup.append("text")
  //     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  //     .attr("class", "axisText")
  //     .text("Poverty (%)");
  });