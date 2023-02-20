class Line {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      contextHeight: 40,
       margin: {top: 40, bottom: 110, right: 20, left: 60},
      contextMargin: {top: 160, bottom: 40, right: 50, left: 60},
      width: _config.containerWidth,
      height:  _config.containerHeight
      //width: _config.containerWidth || 500,
      //height: _config.containerHeight || 140,
      //margin: { top: 40, bottom: 40, right: 50, left: 60 }
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
      
    let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                    //so it is good to create a variable that is a reference to 'this' class instance

    //set up the width and height of the area where visualizations will go- factoring in margins               
    vis.width = vis.config.width - vis.config.margin.right - vis.config.margin.left;
    vis.height = vis.config.height - vis.config.margin.top - vis.config.margin.bottom;
    vis.containerHeight = vis.config.height + vis.config.margin.top + vis.config.margin.bottom;

// Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.width)
        .attr('height',  vis.config.height);

    //Title
    vis.svg.append("text")
       .attr('transform', `translate(${(vis.width - vis.config.margin.left - vis.config.margin.right)/2 - 65}, ${vis.config.margin.top -20 })`)
       .attr("font-size", "20px")
       .text("Exoplanets Discovered Over Time")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");
    // X axis Label    
    vis.svg.append("text")
       .attr("transform", `translate(${(vis.width - vis.config.margin.left - vis.config.margin.right)/2 + vis.config.margin.left},${vis.height + vis.config.margin.bottom + 35})`)
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
    vis.xAxisLine = vis.svg.append("line")
        .attr("x1", vis.config.margin.left)
        .attr("y1", vis.height + vis.config.margin.top)
        .attr("x2", vis.width + vis.config.margin.left)
        .attr("y2", vis.height + vis.config.margin.top)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    vis.yAxisLine = vis.svg.append("line")
        .attr("x1", vis.config.margin.left)
        .attr("y1", vis.config.margin.top)
        .attr("x2", vis.config.margin.left)
        .attr("y2", vis.height + vis.config.margin.top)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    vis.static = true;
    vis.updateVis();


  }
  updateVis() { 
        let vis = this;
        vis.svg.selectAll('.y-axis').remove();
        vis.svg.selectAll('.x-axis').remove();
        vis.svg.selectAll('.chart').remove();
        vis.svg.selectAll('.plan').remove();
        vis.xValue = d => parseFloat(d.year); 
        vis.yValue = d => parseFloat(d.cost);
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
        vis.xScaleFocus = d3.scaleLinear()
            .domain([min,max])
            .range([0, vis.width]);

        vis.xScaleContext = d3.scaleLinear()
            .domain([min,max])
            .range([0, vis.width]);

        vis.yScaleFocus = d3.scaleLinear()
            .range([vis.height, 0])
            .nice();

        vis.yScaleContext = d3.scaleLinear()
            .range([vis.config.contextHeight, 0])
            .nice();

        // Initialize axes
        vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus).ticks(5).tickFormat(d3.format(".0f"));
        vis.xAxisContext = d3.axisBottom(vis.xScaleContext).ticks(5).tickFormat(d3.format(".0f"));
        vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus).ticks(5);


         // Append focus group with x- and y-axes
        vis.focus = vis.svg.append('g')
            .attr('id', 'focus')
            .attr('class', 'chart')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`)

        vis.focus.append('defs').append('clipPath')
            .attr('id', 'clip')
            .attr('class', 'chart')
            .append('rect')
            .attr('width', vis.width + 10)
            .attr('height', vis.height);
        
        vis.focusLinePath = vis.focus.append('path')
            .attr('class', 'chart');

        vis.xAxisFocusG = vis.focus.append('g')
            .attr('class', 'chart')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisFocusG = vis.focus.append('g')
            .attr('class', 'chart');

        vis.tooltipTrackingArea = vis.focus.append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');

        // Empty tooltip group (hidden by default)
        vis.tooltip = vis.focus.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');

        vis.tooltip.append('circle')
            .attr('r', 4);

        vis.tooltip.append('text');


        // Append context group with x- and y-axes
        vis.context = vis.svg.append('g')
            .attr('id', 'context')
            .attr('class', 'chart')
            .attr('transform', `translate(${vis.config.contextMargin.left},${vis.config.contextMargin.top})`);

        vis.contextAreaPath = vis.context.append('path')
            .attr('class', 'chart');

        vis.xAxisContextG = vis.context.append('g')
            .attr('class', 'chart')
            .attr('transform', `translate(0,${vis.config.contextHeight})`);

        vis.brushG = vis.context.append('g')
            .attr('class', 'chart');


        // Initialize brush component
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.config.contextHeight]])
            .on('brush', function({selection}) {
              if (selection) vis.brushed(selection);
            })
            .on('end', function({selection}) {
              if (!selection) 
                {
                vis.brushed(null)
              }else if(selection[0] != 0 || selection[1] != vis.width){
                 updateFromLine(vis.selectedDomain[0],vis.selectedDomain[1])
                 vis.static == false
              }
              else if(selection[0] == 0 && selection[1] == vis.width && vis.static == false){
                 updateFromLine(vis.selectedDomain[0],vis.selectedDomain[1])
                 vis.static == true
              }

            });
        vis.lineBase = d3.line()
        .x(d => vis.xScaleFocus(vis.xValue(d)))
            .y(vis.height);

        // Initialize line and area generators
        vis.line = d3.line()
            .x(d => vis.xScaleFocus(vis.xValue(d)))
            .y(d => vis.yScaleFocus(vis.yValue(d)));

        vis.area = d3.area()
            .x(d => vis.xScaleContext(d.year))
            .y1(d => vis.yScaleContext(d.cost))
            .y0(vis.config.contextHeight);

        // Set the scale input domains
        vis.xScaleFocus.domain(d3.extent(vis.data, vis.xValue));
        vis.yScaleFocus.domain(d3.extent(vis.data, vis.yValue));
        vis.xScaleContext.domain(vis.xScaleFocus.domain());
        vis.yScaleContext.domain(vis.yScaleFocus.domain());

        vis.bisectDate = d3.bisector(vis.xValue).left;


    vis.focusLinePath
        .datum(vis.data)
        .attr('class','chart')
        .attr('stroke',  '#5082b6')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', vis.lineBase)
        .attr("clip-path", "url(#clip)")

    vis.focusLinePath.transition()
        .duration(1000)
        .attr('d', vis.line)

    vis.contextAreaPath
        .attr('class','chart')
        .datum(vis.data)
        .attr('class','chart')
        .attr('fill', '#9dc7f3')
        .attr('d', vis.area)
        .attr("clip-path", "url(#clip)")

    vis.tooltipTrackingArea
        .on('mouseenter', () => {
          if(vis.data.length > 0){
          vis.tooltip.style('display', 'block');
      }
        })
        .on('mouseleave', () => {
          vis.tooltip.style('display', 'none');
        })
        .on('mousemove', function(event) {
          // Get date that corresponds to current mouse x-coordinate
          const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
          const year = vis.xScaleFocus.invert(xPos);

          // Find nearest data point
          const index = vis.bisectDate(vis.data, year, 1);
          const a = vis.data[index - 1];
          const b = vis.data[index];
          const d = b && (year - a.year > b.year - year) ? b : a; 
          if(d != null){
          // Update tooltip
          if(d.year != max){
                vis.tooltip.select('text')
              .attr('transform', `translate(${vis.xScaleFocus(parseFloat(d.year))},${(vis.yScaleFocus(d.cost) - 5)})`)
              .text(Math.round(d.cost));
              vis.tooltip.select('circle')
              .attr('transform', `translate(${vis.xScaleFocus(parseFloat(d.year))},${vis.yScaleFocus(d.cost)})`);
          
          }
          else{
              vis.tooltip.select('text')
                  .attr('transform', `translate(${vis.xScaleFocus(parseFloat(d.year)) - 15},${(vis.yScaleFocus(d.cost) - 5)})`)
                  .text(Math.round(d.cost));
                  vis.tooltip.select('circle')
              .attr('transform', `translate(${vis.xScaleFocus(parseFloat(d.year))},${vis.yScaleFocus(d.cost)})`);
          
            }
        }
        });
    // Update the axes
    vis.xAxisFocusG.call(vis.xAxisFocus);
    vis.yAxisFocusG.call(vis.yAxisFocus);
    vis.xAxisContextG.call(vis.xAxisContext);

    // Update the brush and define a default position
    const defaultBrushSelection = [0, vis.xScaleContext.range()[1]];
    
    if(vis.data.length>0){
    vis.brushG
        .call(vis.brush)
        .call(vis.brush.move, defaultBrushSelection);
    }
  
  }

  brushed(selection) {
    let vis = this;

    // Check if the brush is still active or if it has been removed
    if (selection) {
      // Convert given pixel coordinates (range: [x0,x1]) into a time period (domain: [Date, Date])
      vis.selectedDomain = selection.map(vis.xScaleContext.invert, vis.xScaleContext);
      // Update x-scale of the focus view accordingly
      vis.xScaleFocus.domain(vis.selectedDomain);
      //updateFromLine(selectedDomain[0],selectedDomain[1])
      

    } else {
      // Reset x-scale of the focus view (full time period)
        vis.selectedDomain = vis.xScaleContext.domain()
      vis.xScaleFocus.domain(vis.xScaleContext.domain());
    }

    // Redraw line and update x-axis labels in focus view
    vis.focusLinePath.attr('d', vis.lineBase);
    vis.focusLinePath.transition()
        .duration(1000)
        .attr('d', vis.line)
    vis.xAxisFocusG.call(vis.xAxisFocus);
  }
}