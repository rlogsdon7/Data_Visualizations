class Histogram {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 60, right: 50, left: 60 }
    }
    this.data = _data; 

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
       .attr('transform', `translate(${vis.width/2 - 60}, ${vis.config.margin.top -20 })`)
       .attr("font-size", "20px")
       .text("Distance of Exoplanets From Earth")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");
    // X axis Label    
    vis.svg.append("text")
       .attr("transform", `translate(${vis.width/2 + vis.config.margin.left},${vis.height + vis.config.margin.bottom + 15})`)
       .style("text-anchor", "middle")
       .text("Distance From Earth (in parsecs)")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "12px");
    vis.svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -(vis.height/2) - vis.config.margin.top)
       .attr("y", 15)
       .style("text-anchor", "middle")
       .text("Number of Exoplanets")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "12px");

      vis.updateVis(); 
  }
/**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    // X axis: scale and draw:
      var x = d3.scaleLinear()
          .domain([0,  d3.max( vis.data, d => d.sy_dist)])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
          .range([0, vis.width])
          //.padding(0.4);
      vis.svg.append("g")
          .attr('transform', `translate(${vis.config.margin.left},${vis.height + vis.config.margin.top})`)
          .call(d3.axisBottom(x));

      // set the parameters for the histogram
      var histogram = d3.histogram()
          .value(function(d) { return d.sy_dist; })   // I need to give the vector of value
          .domain(x.domain())  // then the domain of the graphic
          .thresholds(x.ticks(70)); // then the numbers of bins

      // And apply this function to data to get the bins
      var bins = histogram(vis.data);

      // Y axis: scale and draw:
      var y = d3.scaleLinear()
          .range([vis.height, 0]);
          y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
      vis.svg.append("g")
          .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)
          .call(d3.axisLeft(y));

      // append the bar rectangles to the svg element
      vis.rects = vis.svg.selectAll("rect")
          .data(bins)
          .enter()
          .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { 
                    let xVal = x(d.x0) + vis.config.margin.left;
                    let yVal = y(d.length) + vis.config.margin.top;
                return "translate(" + xVal + "," + yVal + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return vis.height - y(d.length); })
            .style("fill", "#1b9e77")
     vis.rects
          .on('mouseover', (event,d) => {
            //console.log("mouse over! ");
            //console.log(event);
            console.log(d);
            //console.log(htmltext)
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', x(d.x0) + vis.config.margin.left + 'px')   
            .style('top', window.innerHeight/2.35 + y(d.length) + vis.config.margin.top + 'px')
            .html(`
              <div class="tooltip-title">${d.x0} - ${d.x1} parsecs</div>
              <div><i>Number of Exoplanets: ${d.length}</i></div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });
    

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