// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
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
function renderXCircles(circlesGroup, newXScale,chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale,chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


function update_abbrX(AbbrGroup , newXScale, chosenXAxis){
  AbbrGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))

  return AbbrGroup;

}

function update_abbrY(AbbrGroup , newYScale, chosenYAxis){
  AbbrGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis]))

  return AbbrGroup;

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
        var xLabel = "Age (Median)";
        console.log("age");
        break;

    case "income":
        var xLabel = "Household income (Median)";
        console.log("income");
        break;

    default:
       console.log("default");
       var xLabel = "Poverty (%)";
  }


  // swicth yAxis label
  switch(chosenYAxis){
    case "healthcare":
        var yLabel = "Lacks of healthcare";
        console.log("healthcare");
        break;


    case "smokes":
        var yLabel = "Smokes (%)";
        console.log("smokes");
        break;

    case "obesity":
        var yLabel = "Obese (%)";
        
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
    toolTip.show(data,this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data,this);
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
     //console.log(dataCsv);

// Step 2: Create scale functions
    // ==============================
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

    var yAxis =chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

          // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(dataCsv)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))  //center coord x
    .attr("cy", d => yLinearScale(d[chosenYAxis]))//center coord y
    .attr("r", "15")
    .attr("fill", "skyblue")
    .attr("opacity", ".8");

    var AbbrGroup = chartGroup.selectAll()
    .data(dataCsv)
    .enter()
    .append("text")
    .text(function(d) {
      console.log(d.abbr);
      return d.abbr;})
    .attr("x", d => xLinearScale(d[chosenXAxis]))  //center coord x
    .attr("y", d => yLinearScale(d[chosenYAxis]))//center coord y
    .attr("class", "scatterText")
    .style("font-size", "13")
    .style("font-size", "13")
    .style("text-anchor", "middle")
    .style('fill', 'white');

  // Create group for 3 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household income (Median)");


  // Create group for 3 y- axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(0, ${height / 2})`);

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 0 - margin.left + 60)
    .attr("transform", "rotate(-90)")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks of healthcare (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y",  0 - margin.left + 40)
    .attr("transform", "rotate(-90)")
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesityLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y",  0 - margin.left + 20)
    .attr("transform", "rotate(-90)")
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");


      // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);


  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value")

      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(dataCsv, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,  chosenYAxis,circlesGroup);

        // update stae abbreviation for states
        AbbrGroup = update_abbrX(AbbrGroup , xLinearScale, chosenXAxis);

        switch(chosenXAxis){
          case "poverty":
              povertyLabel
                .classed("active", true)
                .classed("inactive", false);
  
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
  
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
              console.log("poverty");
              break;
      
      
          case "age":
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
  
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
  
              incomeLabel
              .classed("active", false)
              .classed("inactive", true);  
              break;
      
          case "income":
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
  
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
  
            incomeLabel
              .classed("active", true)
              .classed("inactive", false); 
              break;
  
        }
      }
    });

  yLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
      var value = d3.select(this).attr("value")
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(dataCsv, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,  chosenYAxis,circlesGroup);
        
        // update stae abbreviation for states
        AbbrGroup = update_abbrY(AbbrGroup , yLinearScale, chosenYAxis)
      }


    
    
      // swicth yAxis label
      switch(chosenYAxis){
        case "healthcare":
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
  
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
  
            obesityLabel
              .classed("active", false)
              .classed("inactive", false); 
            break;
    
    
        case "smokes":
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
  
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
  
            obesityLabel
              .classed("active", false)
              .classed("inactive", true); 
            break;
    
        case "obesity":
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
  
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
  
            obesityLabel
              .classed("active", true)
              .classed("inactive", false); 
            break;
    
      }
    });

  });