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

// console.log(height);

// Create svg wrapper, append an svg group that will hold the chart
var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Bonus Section
// initial axis params
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d =>[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

// render xAxis functions
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d =>[chosenYAxis]) * 1.2
        ])
        .range([0, height]);

    return yLinearScale;
}

// render xAxis functions
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisBottom(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with transition

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]))
        .attr('cy', d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var label;

    if (chosenXAxis === 'poverty') {
        label = 'poverty'
    }
    else if (chosenXAxis === 'age') {
        label = 'p'
    }
    else {
        label = 'income'
    }

    var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offest([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });
    
    circlesGroup.call(toolTip);

    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data);
    })
        .on('mouseout', function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

d3.csv('data.csv').then(function(data, err) {
    if (err) throw err;

    // parse data
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
    });

    // linear scale
    var xLinearScale = xScale(data, chosenXAxis);

    // create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([height, o]);
    
    // initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append('g')
        .call(leftAxis);
    
    // append initial circles
    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('fill', 'pink')
        .attr('opacity', '.5');
    
    // create group for x-axis labels
    var XlabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + 20})`);
    
    var povertyLabel = XlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('In Poverty (%)');
    
    var ageLabel = XlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .classed('active', true)
        .text('Age (Median)');
        
    var incomeLabel = XlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'income')
        .classed('active', true)
        .text('Household Income (Median)');
    
    // append y axis
})