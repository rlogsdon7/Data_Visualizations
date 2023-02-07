class DiscoveryMethod {
  constructor(_config, _data,_refresh) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 40, right: 50, left: 60 }
    }
    this.data = _data; 
    this.refresh = _refresh
    this.initVis();
  }

  initVis() {
    let vis = this;
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);
    //Title
    vis.svg.append("text")
       .attr('transform', `translate(${vis.width/2 -98}, ${vis.config.margin.top -20 })`)
       .attr("font-size", "20px")
       .text("Exoplanets by Discovery Method")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");

    // X axis Label    
    vis.svg.append("text")
       .attr("transform", `translate(${vis.width/2 + vis.config.margin.left},${vis.height + vis.config.margin.bottom + 35})`)
       .style("text-anchor", "middle")
       .text("Discovery Method")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "12px")

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

      vis.updateVis(); //call updateVis() at the end - we aren't using this yet. 
  }
/**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    vis.svg.selectAll('.y-axis').remove();
    vis.svg.selectAll('.x-axis').remove();
    vis.svg.selectAll('.chart').remove();
    vis.svg.selectAll('.plan').remove();
    
    
    vis.xScale = d3.scaleBand()
        .domain(vis.data.map(function(d) { return d.toolTip; }))
        .range([0, vis.width])
        .padding(0.4);
    
    vis.yScale = d3.scaleLinear()
        .domain([0, d3.max( vis.data, d => d.count)])
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
        .tickPadding(10)



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
    

    //Add circles for each event in the data
    vis.rects = vis.chart.selectAll('rect')
      .data(vis.data)
      .join('rect')
      .attr('class', 'plan')
      .attr('data',(d) => d.toolTip)
      .attr('fill', (d) => d.color )
      .attr('x', (d) => {
        return vis.xScale(d.toolTip)}) 
      .attr('id', (d) => {
        return "byDisc" + d.toolTip.replace(/\s/g, '')})  
      .attr('width', vis.xScale.bandwidth())
      .attr('y', vis.height)
      .attr('height', 0)

    vis.rects
          .on('mouseover', (event,d) => {
        d3.select("#byDisc" + d.toolTip.replace(/\s/g, ''))
            .style("filter", "brightness(70%)");
          d3.select('#tooltip')
            .attr('data-value',d.toolTip)
            .style('display', 'block')
            .style('left', event.pageX + 10 + 'px')   
            .style('top', event.pageY + 'px')
            .html(`
              <div class="tooltip-title">Discovery Method: ${d.toolTip}</div>
              <div><i>Number of Exoplanets: ${d.count}</i></div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
          d3.selectAll("rect")
            .style("filter", "brightness(100%)");
        });
    // X axis
    vis.label = vis.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${vis.config.margin.left},${vis.height + vis.config.margin.top})`)
        .call(d3.axisBottom(vis.xScale))
        .selectAll("text")
        .style("text-anchor", "start")
        .style("word-wrap", "break-word")
        .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "11px")
        .attr("dx", ".40em")
        .attr("dy", "-.6em")
        .attr("transform", "rotate(-90)")

    vis.label
          .on('mouseover', (event,d) => {
        d3.select("#byDisc" + d.replace(/\s/g, ''))
            .style("filter", "brightness(70%)");
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', event.pageX + 10 + 'px')   
            .style('top', event.pageY + 'px')
            .attr('data-value',d)
            .html(`
              <div class="tooltip-title">Discovery Method: ${d}</div>
              <div><i>Number of Exoplanets: ${vis.data.filter(data => data.toolTip === d)[0].count}</i></div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
          d3.selectAll("rect")
            .style("filter", "brightness(100%)");
        });


    // Add the y axisS
    vis.svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)
        .call(d3.axisLeft(vis.yScale))
        .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-4.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")

    vis.rects.on('click', (event, d) => {
        d3.select('#tooltip').style('display', 'none')
        vis.refresh(d3.select('#tooltip')._groups[0][0].dataset.value);
      })
    vis.label.on('click', (event, d) => {
        d3.select('#tooltip').style('display', 'none')
        vis.refresh(d3.select('#tooltip')._groups[0][0].dataset.value);
      })
    vis.rects.transition()
        .duration(1000)
      .attr('y', (d) => vis.yScale(d.count) ) 
      .attr('height', (d) => vis.height - vis.yScale(d.count));

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