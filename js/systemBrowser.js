class SystemBrowser {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 40, right: 50, left: 60 },
      tooltipPadding: _config.tooltipPadding || 15
    }

    this.data = _data; 

    this.initVis();
  }

  initVis() {
      let vis = this; 

      // Width and height as the inner dimensions of the chart area- as before
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

      // Define 'svg' as a child-element (g) from the drawing area and include spaces
      // Add <svg> element (drawing space)
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight)

      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

      vis.chart.append('defs')
            .append('clipPath')
            .attr('id', 'clipSys')
            .attr('class', 'clip')
            .append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height);
      vis.chartHolder = vis.chart.append('g') 
        .attr('clip-path', 'url(#clipSys)');
      vis.xAxisLine = vis.chart.append("line")
        .attr("x1", 0)
        .attr("y1", vis.height)
        .attr("x2", vis.width)
        .attr("y2", vis.height)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    vis.yAxisLine = vis.chart.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", vis.height)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
        //Title
    vis.svg.append("text")
       .attr('transform', `translate(${vis.width/2 - 20}, ${vis.config.margin.top -20 })`)
       .attr("font-size", "20px")
       .text("System Overview")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");
    vis.svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -(vis.height/2) - vis.config.margin.top)
       .attr("y", 15)
       .style("text-anchor", "middle")
       .text("Distance From Host (au)")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "18px");

      vis.updateVis(); //call updateVis() at the end - we aren't using this yet. 
  }


 updateVis() {
  let vis = this;
    vis.svg.selectAll('.y-axis').remove();
    vis.svg.selectAll('.x-axis').remove();
    vis.svg.selectAll('.chart').remove();
    vis.svg.selectAll('.plan').remove();
    vis.chart.selectAll('text').remove();

    var max =  d3.max(vis.data, d => parseFloat(d.pl_orbsmax))

  // Initialize linear and ordinal scales (input domain and output range)
  vis.xScale = d3.scaleLinear()
    .domain([(0 - max)/2.5,max/2.5])
    .range([0, vis.width]);
  vis.yScale = d3.scaleLinear()
    .domain([max, 0]) 
    .range([0, vis.height])
    .nice();

    vis.ryScale = d3.scaleLinear()
    .domain([0, max]) 
    .range([0, vis.width]) 
    .nice();

    vis.rxScale = d3.scaleLinear()
    .domain([0, max]) 
    .range([0, vis.height]) 
    .nice();


  vis.rScale = d3.scaleLog()
    .domain(d3.extent(vis.data, d=> parseFloat(d.pl_bmasse)))
    .range([5, 15]);
  let ticks = 2
  // Initialize axes
  vis.xAxis = d3.axisBottom(vis.xScale)
    .tickFormat(d3.format('.2f'))
    .ticks(ticks);

  vis.yAxis = d3.axisLeft(vis.yScale)
    .tickFormat(d3.format('.2f'))
    .ticks(ticks);

  // Draw the axis

  vis.yAxisGroup = vis.chart.append('g')
    .attr('class', 'axis y-axis')
    .call(vis.yAxis);
  vis.ellipse = vis.chartHolder.selectAll('ellipse')
    .data(vis.data)
    .join('ellipse')
    .attr('class','plan')
    .attr('fill', "none" )
    .attr('opacity', 1)
    .attr('stroke', "gray")
    .attr('stroke-width', 2)
    .attr('rx', (d) => vis.ryScale(parseFloat(d.pl_orbsmax)))
    .attr('ry', (d) => vis.rxScale(parseFloat(d.pl_orbsmax) )) 
    .attr('cy', (d) => vis.yScale(0 ) )
    .attr('cx',(d) =>  vis.xScale(0))

  vis.circles = vis.chart.selectAll('circle')
    .data(vis.data)
    .join('circle')
    .attr('class','plan')
    .attr('fill', (d) => d.planetColor)
    .attr('opacity', 1)
    .attr('stroke', "gray")
    .attr('stroke-width', 2)
    .attr('r', (d) => vis.rScale(parseFloat(d.pl_bmasse)) ) 
    .attr('cy', (d) => vis.yScale(parseFloat(d.pl_orbsmax) )) 
    .attr('cx',(d) =>  vis.xScale(0) );

  vis.circles
    .on('mouseover', (event,d) => {
      d3.select('#tooltip')
      .style('display', 'block')
      .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
      .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
      .html(`
              <div class="tooltip-title">${d.pl_name}</div>
              <div><i>Planet Type: ${d.planetType}</i></div>
              <ul>
                <li>Mass: ${d.pl_bmasse} Earth Masses</li>
                <li>Distance From Host: ${d.pl_orbsmax} (au)</li>
              </ul>
            `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      });
    }

 renderVis() { 

  }
}
