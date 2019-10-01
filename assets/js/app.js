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

// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(dataCsv) {
    dataCsv.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        // data.abbr = +data.abbr;
    //console.log(data.abbr);
     });
     //dataCsv.forEach(d=>console.log(d.abbr));
// Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(dataCsv, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(dataCsv, d => d.healthcare)])
      .range([height, 0]);

        // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
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

    var AbbrGroup = chartGroup.selectAll("text")
    .data(dataCsv)
    .enter()
    .append("text")
    .style("font-size", "10")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(function(d) {
      console.log(d.abbr);
      return d.abbr;})
    .attr("x", d => xLinearScale(d.poverty))  //center coord x
    .attr("y", d => yLinearScale(d.healthcare))//center coord y
    .attr("class", "scatterText");
  



    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Porverty : ${d.poverty}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

      // Create axes labels
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");
  });