class Line {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      brushHeight: 70,
      margin: { top: 40, bottom: 40, right: 50, left: 60 },
      brushMargin: { top: 10, bottom: 10, right: 50, left: 60 }
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
    vis.height = vis.config.containerHeight - vis.config.brushHeight - vis.config.margin.top - vis.config.margin.bottom;
    vis.brushHeight = vis.config.brushHeight - vis.config.brushMargin.top - vis.config.brushMargin.bottom;
    

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

   

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

    vis.updateVis();


  }


  //leave this empty for now
 updateVis() { 
    let vis = this;
    vis.svg.selectAll('.y-axis').remove();
    vis.svg.selectAll('.x-axis').remove();
    vis.svg.selectAll('.chart').remove();
    vis.svg.selectAll('.plan').remove();

    //reusable functions for x and y 
        //if you reuse a function frequetly, you can define it as a parameter
        //also, maybe someday you will want the user to be able to re-set it.
    vis.xValue = d => d.year; 
    vis.yValue = d => d.cost;
    let min = d3.min(vis.data, d => d.year)
    let max = d3.max(vis.data, d => d.year)
    if(min!=null){
        let dif = max - min;
        if(dif < 10){
            let newMin = min - 10 + dif
            for(let i = min -1; i >= newMin; i--){
                vis.data.unshift({"year":i,"cost":0})
            }
            min = newMin;
        }
    }
    else{
        min = 1992
        max = 2022
    }
    let yMin = d3.min(vis.data, d => d.cost)
    let yMax = d3.max(vis.data, d => d.cost)
    if(yMin==null){
        yMin = 0
        yMax = 1
    }
    //setup scales
    vis.xScaleFocus = d3.scaleLinear()
            .domain([min,max])
            .range([0, vis.width]);

    vis.xScale = d3.scaleLog()
        .domain([min,max])
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .domain([yMin,yMax])
        .range([vis.height, 0])
        .nice(); 

    vis.yScaleFocus = d3.scaleLinear()
            .domain([yMin,yMax])
            .range([vis.brushHeight, 0])
            .nice();
    
    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)    
    .tickFormat(d3.format(".0f"))  // Add this line
    .ticks(8);
    vis.yAxis = d3.axisLeft(vis.yScale);

    vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus).tickSizeOuter(0);
    vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus);
        // Append focus group with x- and y-axes
        vis.focus = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.height + vis.config.brushHeight})`);

        vis.focus.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', vis.width)
            .attr('height', vis.brushHeight);
        
        vis.focusLinePath = vis.focus.append('path')
            .attr('class', 'chart-line');

        vis.xAxisFocusG = vis.focus.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height + vis.config.brushHeight})`);

        vis.yAxisFocusG = vis.focus.append('g')
            .attr('class', 'axis y-axis');

    // Append x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis); 

    vis.brushG = vis.chart.append('g')
            .attr('class', 'brush x-brush')
            .attr('transform', `translate(0,${vis.height + vis.brushHeight})`)



        // Initialize brush component
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.brushHeight]])
            .on('brush', function({selection}) {
              if (selection) vis.brushed(selection);
            })
            .on('end', function({selection}) {
              if (!selection) vis.brushed(null);
            });
    // Set the scale input domains
        vis.xScaleFocus.domain(d3.extent(vis.data, vis.xValue));
        vis.yScaleFocus.domain(d3.extent(vis.data, vis.yValue));
    vis.line = d3.line()
            .x(d => vis.xScaleFocus(vis.xValue(d)))
            .y(d => vis.yScaleFocus(vis.yValue(d)));

    vis.area = d3.area()
            .x(d => vis.xScaleContext(vis.xValue(d)))
            .y1(d => vis.yScaleContext(vis.yValue(d)))
            .y0(vis.config.contextHeight);

    vis.focusLinePath
        .datum(vis.data)
        .attr('d', vis.focusline);

    vis.contextAreaPath
        .datum(vis.data)
        .attr('d', vis.area);

     vis.xAxisFocusG.call(vis.xAxisFocus);
    vis.yAxisFocusG.call(vis.yAxisFocus);
    vis.xAxisG.call(vis.xAxis);

    // Update the brush and define a default position
    const defaultBrushSelection = [vis.xScaleFocus(2015), vis.xScaleFocus.range()[1]];
    vis.brushG
        .call(vis.brush)
        .call(vis.brush.move, defaultBrushSelection);

    //if(d3.max(vis.data, d => d.cost)!=null){
    /*vis.bisectDate = d3.bisector(vis.xValue).left;
   // Initialize area generator- helper function 
    vis.area = d3.area()
        .x(d => vis.xScale(vis.xValue(d)))
        .y1(vis.height)
        .y0(vis.height);

    // Add area path
    vis.areaPath = vis.chart
        .append('path')
        .data([vis.data]) 
        .attr('fill', '#7fe9c9')
        .attr('d', vis.area)
        .attr('class','chart')


    //Initialize line generator helper function
    vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(vis.height);


    // Add line path 
    vis.linePath = vis.chart.append('path')
        .data([vis.data])
        .attr('class','chart')
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
    const trackingArea = vis.chart
    .append('rect')
    .attr('class','plan')
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
          
          
          vis.tooltip.select('rect')
                .attr('transform', `translate(${vis.xScale(d.year)},${0})`);
         if(d.year < max - 5){
           vis.tooltip.select('text')
              .attr('transform', `translate(${vis.xScale(d.year ) + 10},${(vis.yScale(d.cost) - 10)})`)
              .text(Math.round(d.cost) + " Exoplanets");
        }
        else{
           vis.tooltip.select('text')
              .attr('transform', `translate(${vis.xScale(d.year ) - 100},${(vis.yScale(d.cost) - 10)})`)
              .text(Math.round(d.cost) + " Exoplanets");
        }
    })

    vis.area = d3.area()
        .x(d => vis.xScale(vis.xValue(d)))
        .y1(d => vis.yScale(vis.yValue(d)))
        .y0(vis.height);


    //Initialize line generator helper function
    vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(d => vis.yScale(vis.yValue(d)));

    vis.areaPath.transition()
        .duration(1000)
        .attr('d', vis.area)
    vis.linePath.transition()
        .duration(1000)
        .attr('d', vis.line);
    }*/
}


 //leave this empty for now...
 renderVis() { 

  }

brushed(selection) {
    let vis = this;

    // Check if the brush is still active or if it has been removed
    if (selection) {
      // Convert given pixel coordinates (range: [x0,x1]) into a time period (domain: [Date, Date])
      const selectedDomain = selection.map(vis.xScale.invert, vis.xScale);

      // Update x-scale of the focus view accordingly
      vis.xScaleFocus.domain(selectedDomain);
    } else {
      // Reset x-scale of the focus view (full time period)
      vis.xScaleFocus.domain(vis.xScale.domain());
    }

    // Redraw line and update x-axis labels in focus view
    vis.focusLinePath.attr('d', vis.line);
    vis.xAxisFocusG.call(vis.xAxisFocus);
  }

}