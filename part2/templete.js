// Load the data
const iris = d3.csv("iris.csv");

// Once the data is loaded, proceed with plotting
iris.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
        d.PetalWidth = +d.PetalWidth;
    });

    // Define the dimensions and margins for the SVG
let 
    width = 600;
    height = 400;

let margin = {
    top: 30,
    bottom: 50,
    left: 50,
    right: 30
}


    // Create the SVG container
let svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "lightyellow")
        
    // Set up scales for x and y axes
    // d3.min(data, d => d.bill_length_mm)-5

const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.Species))
        .range(d3.schemeCategory10);

    // Add scales     
let yScale = d3.scaleLinear()
               .domain([0, d3.max(data, d => d.PetalLength) + .5])
              .range([height-margin.bottom, margin.top])

let xScale = d3.scaleLinear()
               .domain([0, d3.max(data, d => d.PetalWidth) + .5])
               .range([margin.left, width - margin.right])

let yAxis = svg.append("g")
                .call(d3.axisLeft().scale(yScale))
                .attr("transform", `translate(${margin.left},0)`)
let xAxis = svg.append("g")
               .call(d3.axisBottom().scale(xScale))
               .attr('transform', `translate(0, ${height - margin.bottom})`)



    // Add circles for each data point
let circle = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.PetalWidth))
            .attr("cy", d => yScale(d.PetalLength))
            .attr("r", 4)
            .style("fill", d => colorScale(d.Species));


    // Add x-axis label
svg.append("text")
    .attr("x", 0 - height/2)
    .attr("y", 25)
    .text("Petal Width")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")

    // Add y-axis label
svg.append("text")
    .attr("x", width/2)
    .attr("y", height - 5)
    .text("Petal Legnth")
    .style("text-anchor" , "middle")

    // Add legend
const legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

// Add circles to the legend
legend.append("circle")
    .attr("cx", width - 15)
    .attr("cy", 11) 
    .attr("r", 6)
    .style("fill", d => colorScale(d)); 

legend.append("text")
        .attr("x", width - 120)
        .attr("y", 15)
        .text(d => d);
});

iris.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
        d.PetalWidth = +d.PetalWidth;
    });

    // Define the dimensions and margins for the SVG
    let width = 600;
    let height = 400;

    let margin = {
        top:30,
        bottom: 50, 
        left: 50, 
        right: 30};

    // Create the SVG container
    let svg = d3.select('#boxplot')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'pink');
    // Set up scales for x and y axes
    let xScale = d3.scaleBand()
        .domain(data.map(d => d.Species))
        .range([margin.left, width - margin.right])
        .padding(0.5);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.PetalLength)])
        .range([height - margin.bottom, margin.top]);

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.PetalLength).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const iqr = q3 - q1;
        const minimum = Math.max(d3.min(values), q1 - 1.5 * iqr);
        const maximum = Math.min(d3.max(values), q3 + 1.5 * iqr);
        return {q1, median, q3, minimum, maximum};
    };
    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.Species);

     // Calculating the mathematical values for each species
    quartilesBySpecies.forEach((quartiles, Species) => {
        // Finding xscale coordinate for a species and setting boxwdith for each species
        const x = xScale(Species);
        const boxWidth = xScale.bandwidth();

        // Draw vertical lines
        svg.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("x2", x + boxWidth / 2)
            .attr("y1", yScale(quartiles.minimum))
            .attr("y2", yScale(quartiles.maximum))
            .attr("stroke", "black");

        // Draw the box
        svg.append("rect")
            .attr("x", x)
            .attr("width", boxWidth)
            .attr("y", yScale(quartiles.q3))
            .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
            .attr("fill", "lightblue")
            .attr("stroke", "black");

        // Draw the median line
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(quartiles.median))
            .attr("y2", yScale(quartiles.median))
            .attr("stroke", "black");
        
    });
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));
});


