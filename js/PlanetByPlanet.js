class PlanetByPlanet {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 70, right: 50, left: 60 }
    }
    this.data = _data; 

    this.initVis();
  }

  initVis() {
    let vis = this;
console.log("Here16")
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleBand()
        .domain(vis.data.map(function(d) { return d.numPlanets; }))
        .range([0, vis.width])
        .padding(0.4);
    vis.yScale = d3.scaleLinear()
        .domain([d3.min( vis.data, d => d.count), d3.max( vis.data, d => d.count)])
        .range([vis.height, 0])
        .nice();
    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);
        //.tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    console.log("Here121")

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');
    //Title
    vis.svg.append("text")
       .attr('transform', `translate(${vis.width/2 - 100}, ${vis.config.margin.top -10 })`)
       .attr("font-size", "20px")
       .text("Exoplanets by Exoplanets in System")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");
// Construct a new ordinal scale with a range of ten categorical colours
      vis.colorPalette = d3.scaleOrdinal(d3.schemeDark2);
      vis.colorPalette.domain( vis.data.map(function(d) { return d.numPlanets;}));

    //Add circles for each event in the data
    vis.chart.selectAll('rect')
      .data(vis.data)
      .enter()
      .append('rect')
      .attr('fill', (d) => vis.colorPalette(d.numPlanets) )
      .attr('x', (d) => {
        return vis.xScale(d.numPlanets)}) 
      .attr('y', (d) => vis.yScale(d.count) ) 
      .attr('width', vis.xScale.bandwidth())
      .attr('height', (d) => vis.height - vis.yScale(d.count));

    // X axis
    vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.height + vis.config.margin.top})`)
        .call(d3.axisBottom(vis.xScale))
        .selectAll("text")
        .style("text-anchor", "start")
        .style("word-wrap", "break-word")
        .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "18px")
        .attr("dx", "-0.3em")
        .attr("dy", "1em")
        .attr("transform", "rotate(0)")

    // X axis Label    
    vis.svg.append("text")
       .attr("transform", `translate(${vis.width/2 + vis.config.margin.left},${vis.height + vis.config.margin.bottom + 35})`)
       .style("text-anchor", "middle")
       .text("Number of Exoplanets in System")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "18px");

    // Add the y axis
    vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)
        .call(d3.axisLeft(vis.yScale))
        .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-4.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
    
    // Y axis Label    
    vis.svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -(vis.height/2) - vis.config.margin.top)
       .attr("y", 15)
       .style("text-anchor", "middle")
       .text("Number of Exoplanets")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "18px");

      //updateVis(); //call updateVis() at the end - we aren't using this yet. 
  }
/**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    
    

    vis.renderVis();
  }

  /**
   * This function contains the D3 code for binding data to visual elements
   * Important: the chart is not interactive yet and renderVis() is intended
   * to be called only once; otherwise new paths would be added on top
   */
  renderVis() {
    let vis = this;

   
  }
}/*
 updateVis() {

   
   renderVis(); 

 }

 renderVis() { 

  }



}*/