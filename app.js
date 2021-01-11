// Create function to build the barchart and the bubble chart.
function buildPlots(id) {
  d3.json('samples.json').then(function(data) {
    // console.log(data);

    // Filter Data to contain desired info based on selected id 
    var sample_data = data.samples;
    console.log(sample_data);
    var result1 = sample_data.filter(sample => sample.id.toString() === id)[0];
    console.log(result1);

    // Create variables and retrieve the data for the desired data points to build the charts
    var ids = result1.otu_ids;
    console.log(ids);
    var values = result1.sample_values;
    // console.log(values);
    var topValues = result1.sample_values.slice(0,10).reverse();
    // console.log(topValues);
    var labels = result1.otu_labels;
    // console.log(labels);
    var topLabels = result1.otu_labels.slice(0,10);
    // console.log(topLabels);
    // Top ten bacteria ids
    var top_ids = (result1.otu_ids.slice(0,10)).reverse();
    // console.log(top_ids);
    // Reformat the ids
    var otuID = top_ids.map(d => 'OTU' + d);
    // console.log(otuID);


    // Create traces for the id'd data
    var trace = {
      x: topValues,
      y: otuID,
      text: topLabels,
      color: 'red',
      type: 'bar',
      orientation:'h',
    };
    var data = [trace];

    // Create the chart layout
    var layout = {
      title: 'Top 10 OTU',
      yaxis:{tickmode:'linear'}
    };
    
    // Plot the bar chart with the acquired data
    Plotly.newPlot('bar',data,layout);

    // Create the bubble chart
    var trace1 = {
      x: ids,
      y: values,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
      },
      text: labels,
    };

    var data1 = [trace1];

    var layout1 = {
      title: 'OTU Data',
      height: 600,
      weight: 1000,
    };
    Plotly.newPlot('bubble', data1, layout1);

  })
};

buildPlots();


// Function to retrieve data for demographics info 
function getData(id) {
  d3.json('samples.json').then(function(data) {
    var metadata = data.metadata;
    // console.log(metadata);

    // Filter metadata by id
    var result = metadata.filter(meta => meta.id.toString() === id)[0];
    console.log(result);
    // var id = metadata[0].id;
    // console.log(id);
    // Select the demographic area to add in metadata
    var demographic = d3.select('#sample-metadata');

    // Clear the selection data so it doesn't aggregate on itself
    demographic.html("");

    // Append the text box with all the demographic information 
    Object.entries(result).forEach(key => {
      demographic.append('h5').text(key[0].toUpperCase() + ': ' + key[1] + "\n");
    });
});
};

getData();

// Option Changed function 
function optionChanged(id) {
  buildPlots(id);
  getData(id);
}

function init() {
  var dropdown = d3.select('#selDataset');
  d3.json('samples.json').then((data)=> {
    // console.log(data)

    // Append the 'options' part of the dropdown menu already created in index.html 
    data.names.forEach(function(name) {
      dropdown.append('option').text(name).property('value');
    });

    // Call the data and plots functions to contain the first id and it's info 
    buildPlots(data.names[0]);
    getData(data.names[0]);
  });
}

init();
