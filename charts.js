function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    // console.log(data);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArr = data.samples;
    // console.log(samplesArr);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samplesArr.filter(obj => obj.id === sample);
    // console.log(filteredSample);

    //gauge 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArrFiltered = data.metadata.filter(obj => obj.id === parseInt(sample));
    // console.log(metaArrFiltered);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0];
    // console.log(firstSample);

    //gauge 2. Create a variable that holds the first sample in the metadata array.
    var metaFirstSample = metaArrFiltered[0];
    // console.log(metaFirstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    // console.log(otuIds);
    // console.log(otuLabels);
    // console.log(sampleValues);

    //gauge 3. Create a variable that holds the washing frequency.
    var freq = parseFloat(metaFirstSample.wfreq);
    // console.log(freq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(id => "OTU "+id); 
    // console.log(yticks);
  
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: {text: "<b>Top 10 Bacteria Cultures Found"},
    //  xaxis: {title: "Sample Values"},
    //  yaxis: {title: "OTU IDs"},
     margin: {
      l: 100,
      r: 100,
      t: 80,
      b: 30},
     yaxis: {autorange: "reversed"},
     paper_bgcolor: 'rgba(0,0,0,0)',
     plot_bgcolor: 'rgba(0,0,0,0)',
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Jet"}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "<b>Bacteria Cultures Per Sample"},
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"},
      margin: {
        t: 50,
        b: 70,},
      hovermode: "closest",
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);     


    //gauge 4. Create the trace for the gauge chart.
  var gaugeData = [{
    value: freq,
    domain: {x:[0,1], y: [0,1]},
    type: "indicator",
    mode: "gauge+number",
    title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
    gauge: {
      axis: {range: [null, 10],
             dtick: 2},
      bar: {color: "black"},
      steps: [
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "lime"},
        {range: [8,10], color: "green"}]},
    }];
    
    //gauge 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 30},
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    };

    //gauge 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};


