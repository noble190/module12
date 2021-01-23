function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

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
    let samplesArray = data.samples;
    console.log("full samples array from json: ", samplesArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let selectedSample = samplesArray.find(element => element.id === sample);
    console.log("selected sample from dropdown value id: ", selectedSample);

    //  5. Create a variable that holds the first sample in the array. 
    //Combined with step 4.

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let selectedSampleOTU_IDs = selectedSample.otu_ids;
    let selectedSampleOTU_Labels = selectedSample.otu_labels;
    let selectedSampleValues = selectedSample.sample_values;
    console.log("testing vars: ", selectedSampleOTU_IDs, selectedSampleOTU_Labels, selectedSampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

   let yticks = 
   selectedSampleOTU_IDs.slice(0,10)
   .reverse()
   .map((tickVal) => {return "OTU " + tickVal.toString()});
   console.log("y ticks: ", yticks);

    // 8. Create the trace for the bar chart. 
    //console.log("test", selectedSampleValues.slice(0,10))
    let barData = [
      {
        x: selectedSampleValues.slice(0,10).reverse(), 
        y: yticks,
        hovertext: selectedSampleOTU_Labels.slice(0,10),
        type: "bar",
        orientation: "h"
      }
    ];
    
    // 9. Create the layout for the bar chart. 
    let barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    let bubbleData = [
      {
        x: selectedSampleOTU_IDs,
        y: selectedSampleValues,
        text: selectedSampleOTU_Labels,
        mode: "markers",
        marker: {
          color: selectedSampleOTU_IDs,
          size: selectedSampleValues.map(val => val * 0.8)
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin: 50,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    
    let selectedMetadata = data.metadata.find(element => element.id.toString() === sample);
    /*
    let selectedMetadata = data.metadata.find((element) => {
      console.log("element searched: ", element, "id: ", element.id, "search criteria: ", sample, element.id === sample)
      element.id == sample
    });
    */
    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    //not needed, used find()

    // 3. Create a variable that holds the washing frequency.
    let selectedWashingFrequency = parseFloat(selectedMetadata.wfreq);
    console.log("washing frequency: ", selectedWashingFrequency);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
     {
       value: selectedWashingFrequency,
       title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week" },
       type: "indicator",
       mode: "gauge+number",
       gauge: {
         axis: { range: [0,10] },
         bar: { color: "black" },
         steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
        ],
       }
     }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 150, r: 50, l: 50, b: 50 },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
