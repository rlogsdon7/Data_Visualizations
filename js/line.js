class Line {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 40, right: 50, left: 60 }
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
      
    let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                    //so it is good to create a variable that is a reference to 'this' class instance

    //set up the width and height of the area where visualizations will go- factoring in margins               
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    //reusable functions for x and y 
        //if you reuse a function frequetly, you can define it as a parameter
        //also, maybe someday you will want the user to be able to re-set it.
    vis.xValue = d => d.year; 
    vis.yValue = d => d.cost;

    //setup scales
    vis.xScale = d3.scaleLog()
        .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .domain( d3.extent(vis.data, vis.yValue) )
        .range([vis.height, 0])
        .nice(); //this just makes the y axes behave nicely by rounding up

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

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
    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)    
    .tickFormat(d3.format(".0f"))  // Add this line
    .ticks(8);
    vis.yAxis = d3.axisLeft(vis.yScale);

    // Append x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis); 

    //Title
    vis.svg.append("text")
       .attr('transform', `translate(${vis.width/2 - 80}, ${vis.config.margin.top -20 })`)
       .attr("font-size", "20px")
       .text("Exoplanets Discovered Over Time")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");
    // X axis Label    
    vis.svg.append("text")
       .attr("transform", `translate(${vis.width/2 + vis.config.margin.left},${vis.height + vis.config.margin.bottom + 35})`)
       .style("text-anchor", "middle")
       .text("Year Discovered")
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


  //leave this empty for now
 updateVis() { 
    let vis = this;
vis.bisectDate = d3.bisector(vis.xValue).left;
   // Initialize area generator- helper function 
    vis.area = d3.area()
        .x(d => vis.xScale(vis.xValue(d)))
        .y1(d => vis.yScale(vis.yValue(d)))
        .y0(vis.height);

    // Add area path
    vis.chart.append('path')
        .data([vis.data]) 
        .attr('fill', '#7fe9c9')
        .attr('d', vis.area);


    //Initialize line generator helper function
    vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(d => vis.yScale(vis.yValue(d)));


    // Add line path 
    vis.chart.append('path')
        .data([vis.data])
        .attr('stroke',  '#1b9e77')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', vis.line);

    vis.tooltip = vis.chart.append('g')
        .attr('class', 'tooltip')
        .style('display', 'none');

    vis.tooltip.append('circle')
        .attr('r', 4);
    vis.bisectYear = d3.bisector(d => d.year).left;
    vis.tooltip.append('text');    
    const trackingArea = vis.chart.append('rect')
    .attr('width', vis.width)
    .attr('height', vis.height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseenter', () => {
      vis.tooltip.style('display', 'block');
    })
    .on('mouseleave', () => {
      vis.tooltip.style('display', 'none');
    })
    .on('mousemove', function(event) {
      // Get date that corresponds to current mouse x-coordinate
          
          const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
          const year = vis.xScale.invert(xPos);

          // Find nearest data point
          const index = vis.bisectYear(vis.data, year, 1);
          const a = vis.data[index - 1];
          const b = vis.data[index];
          const d = b && (year - a.year > b.year - year) ? b : a; 
          // Update tooltip
          vis.tooltip.select('circle')
              .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.cost)})`);
          
          vis.tooltip.select('text')
              .attr('transform', `translate(${vis.xScale(d.year ) + 10},${(vis.yScale(d.cost) - 10)})`)
              .text(Math.round(d.cost) + " Exoplanets");

           vis.tooltip.select('rect')
                .attr('transform', `translate(${vis.xScale(d.year)},${0})`);
    })
console.log("HELLO")
          


//// d contains: { year: ..., cost: ... }
}


 //leave this empty for now...
 renderVis() { 

  }



}