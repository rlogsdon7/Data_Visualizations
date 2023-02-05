class Habitable {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 40, right: 50, left: 60 }
    }
    this.data = _data; 

    this.initVis();
  }

  initVis() {
    let vis = this;
console.log("Here11111")
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    

      vis.updateVis(); //call updateVis() at the end - we aren't using this yet. 
  }
/**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    
    vis.xScale = d3.scaleBand()
        .domain(vis.data.map(function(d) { return d.habType; }))
        .range([0, vis.width])
        .padding(0.4);
    
    vis.yScale = d3.scaleLinear()
        .domain([d3.min( vis.data, d => d.count), d3.max( vis.data, d => d.count)])
        .range([vis.height, 0])
        .nice();
    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(0)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(d => d + "km");

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);


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
       .attr('transform', `translate(${vis.width/2 - 60}, ${vis.config.margin.top -20 })`)
       .attr("font-size", "20px")
       .text("Exoplanets by Habitability")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");
// Construct a new ordinal scale with a range of ten categorical colours
      vis.colorPalette = d3.scaleOrdinal(d3.schemeDark2);
      vis.colorPalette.domain( vis.data.map(function(d) { return d.index;}));

    //Add circles for each event in the data
    vis.rects = vis.chart.selectAll('rect')
      .data(vis.data)
      .enter()
      .append('rect')
      .attr('fill', (d) => vis.colorPalette(d.index) )
      .attr('x', (d) => {
        return vis.xScale(d.habType)}) 
      .attr('id', (d) => {
        return "byHab" + d.index})  
      .attr('y', (d) => vis.yScale(d.count) ) 
      .attr('width', vis.xScale.bandwidth())
      .attr('height', (d) => vis.height - vis.yScale(d.count));

      vis.rects
          .on('mouseover', (event,d) => {
            //console.log("mouse over! ");
            //console.log(event);
            console.log(d);
            //console.log("byType"+ d.numPlanets)
        d3.select("#byHab" + d.index)
            .style("filter", "brightness(70%)");
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', function(data){
                console.log(d.habType)
                let xVal = event.pageX + 10 + 'px';
                if(d.habType == "Uninhabitable"){
                    console.log(d.habType)
                    xVal = event.pageX - 100 + 'px'
                }
                return xVal})   
            .style('top', event.pageY + 'px')
            .html(`
              <div class="tooltip-title"> ${d.habType}</div>
              <div><i>Number of Exoplanets: ${d.count}</i></div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
          d3.selectAll("rect")
            .style("filter", "brightness(100%)");
        });
    // X axis
    vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.height + vis.config.margin.top})`)
        .call(d3.axisBottom(vis.xScale))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("word-wrap", "break-word")
        .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "12px")
        .attr("dx", "-0em")
        .attr("dy", "1em")
        .attr("transform", "rotate(0)")

    // X axis Label    
    vis.svg.append("text")
       .attr("transform", `translate(${vis.width/2 + vis.config.margin.left},${vis.height + vis.config.margin.bottom + 35})`)
       .style("text-anchor", "middle")
       .text("Habitability")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "12px");

    // Add the y axisS
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
        .style("font-size", "12px");
    

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
}
