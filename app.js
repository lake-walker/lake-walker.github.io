// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

console.log(height);
// Create svg wrapper, append an svg group that will hold the chart
var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('data.csv').then(function(data) {
    console.log(data);
    // Parse Data/Cast as numbers
    data.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });
    

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', '15')
        .attr('fill', 'blue')
        .attr('opacity', '.5');
    
    // Create axes labels
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Lacks Healthcare')

    chartGroup.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr('class', 'axisText')
        .text('In Poverty');
}).catch(function(error) {
    console.log(error);
});

