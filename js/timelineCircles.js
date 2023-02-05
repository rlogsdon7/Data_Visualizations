class TimelineCircles {

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
      //setting up the chart- things that won't need to update on user actions

      console.log("Let's draw a chart!!");

      // I recommend avoiding simply using the this keyword within complex class code
      // involving SVG elements because the scope of this will change and it will cause
      // undesirable side-effects. Instead, we recommend creating another variable at
      // the start of each function to store the this-accessor
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


      // Initialize linear and ordinal scales (input domain and output range)
      vis.xScale = d3.scaleLog()
        .domain([d3.min(vis.data, d => parseFloat(d.pl_bmasse)), d3.max( vis.data, d => parseFloat(d.pl_bmasse))])
        .range([0, vis.width]);

      vis.yScale = d3.scaleLog()
        .domain([d3.max(vis.data, d => parseFloat(d.pl_rade)), d3.min( vis.data, d => parseFloat(d.pl_rade))]) 
        .range([0, vis.height])
        .nice();



      vis.rScale = d3.scaleLog()
        .domain(d3.extent(vis.data, d=> parseFloat(d.pl_bmasse)))
        .range([5, 15]);


      // Construct a new ordinal scale with a range of ten categorical colours
      vis.colorPalette = d3.scaleOrdinal(d3.schemeDark2);
      vis.colorPalette.domain( vis.data.map(function(d) { return d.starType;}));

      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
          .tickFormat(d3.format('.2f'))
          .ticks(5);

      vis.yAxis = d3.axisLeft(vis.yScale)
          .tickFormat(d3.format('.2f'))
          .ticks(3);


        // Draw the axis
        vis.xAxisGroup = vis.chart.append('g')
          .attr('class', 'axis x-axis') 
          .attr('transform', `translate(0,${vis.height})`)
          .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
          .attr('class', 'axis y-axis')
          .call(vis.yAxis);

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
       .attr('transform', `translate(${vis.width/2 - 80}, ${vis.config.margin.top -20 })`)
       .attr("font-size", "20px")
       .text("Exoplanets By Mass and Radius")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "20px");
    // X axis Label    
    vis.svg.append("text")
       .attr("transform", `translate(${vis.width/2 + vis.config.margin.left},${vis.height + vis.config.margin.bottom + 35})`)
       .style("text-anchor", "middle")
       .text("Mass")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "18x");
    vis.svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -(vis.height/2) - vis.config.margin.top)
       .attr("y", 15)
       .style("text-anchor", "middle")
       .text("Radius")
       .style("font-family", "system-ui")
        .style("color", "black")
        .style("font-size", "18px");

      vis.updateVis(); //call updateVis() at the end - we aren't using this yet. 
  }


 updateVis() {
  let vis = this;


     //Add circles for each event in the data

     //TO DO- how can you change this so that it updates, based on the new data
     //  if some elements have been removed or added, we need to use 'join' rather than enter and append
      vis.circles = vis.chart.selectAll('circle')
          .data(vis.data)
          .join('circle')
          .filter(d => d.starType != "SUN")
         .attr('fill', (d) => vis.colorPalette(d.starType) )
          .attr('opacity', .8)
          .attr('stroke', "gray")
          .attr('stroke-width', 2)
          .attr('r', (d) => vis.rScale(parseFloat(d.pl_bmasse)) ) 
          .attr('cy', (d) => vis.yScale(parseFloat(d.pl_rade)) ) 
          .attr('cx',(d) =>  vis.xScale(parseFloat(d.pl_bmasse)) );

      vis.circles2 = vis.chart.selectAll("circle")
        .data(vis.data)
        .join("circle")
        .filter(d => d.starType == "SUN")
        .attr('fill',"#89CFF0")
          .attr('opacity', .8)
          .attr('stroke', "black")
          .attr('stroke-width', 2)
          .attr('r', (d) => vis.rScale(parseFloat(d.pl_bmasse)) ) 
          .attr('cy', (d) => vis.yScale(parseFloat(d.pl_rade)) ) 
          .attr('cx',(d) =>  vis.xScale(parseFloat(d.pl_bmasse)) )
          .text(d => d.pl_name);

      vis.circles3 = vis.chart.selectAll("text")
        .data(vis.data)
        .join("text")
        .filter(d => d.starType == "SUN")
        .filter(d => d.pl_name != "Venus")
        .filter(d => d.pl_name != "Saturn")
        .filter(d => d.pl_name != "Uranus")
        .text(d => d.pl_name)
        .attr("x", d => vis.xScale(d.pl_bmasse))
        .attr("y", d => vis.yScale(d.pl_rade))
        .attr("text-anchor", "start")
        .attr("dy", 1)
        .attr("dx", 15)
        .style("font-weight", "bold")
        .style("font-size", "15px");

      vis.chart.selectAll("text")
        .data(vis.data)
        .join("text")
        .filter(d => d.starType == "SUN")
        .filter(d => d.pl_name != "Mercury")
        .filter(d => d.pl_name != "Mars")
        .filter(d => d.pl_name != "Earth")
        .filter(d => d.pl_name != "Neptune")
        .filter(d => d.pl_name != "Jupiter")
        .text(d => d.pl_name)
        .attr("x", d => vis.xScale(d.pl_bmasse))
        .attr("y", d => vis.yScale(d.pl_rade))
        .attr("text-anchor", "end")
        .attr("dy", 1)
        .attr("dx", -15)
        .style("font-weight", "bold")
        .style("font-size", "15px");

        vis.circles
          .on('mouseover', (event,d) => {
            //console.log("mouse over! ");
            //console.log(event);
            console.log(d);
            //console.log(htmltext)
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.pl_name}</div>
              <div><i>Star Type: ${d.starType}</i></div>
              <ul>
                <li>Mass: ${d.pl_bmasse}</li>
                <li>Radius: ${d.pl_rade}</li>
              </ul>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

        vis.circles2
          .on('mouseover', (event,d) => {
            //console.log("mouse over! ");
            //console.log(event);
            console.log(d);
            //console.log(htmltext)
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.pl_name}</div>
              <div><i>Star Type: ${d.starType}</i></div>
              <ul>
                <li>Mass: ${d.pl_bmasse}</li>
                <li>Radius: ${d.pl_rade}</li>
              </ul>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

        vis.circles3
          .on('mouseover', (event,d) => {
            //console.log("mouse over! ");
            //console.log(event);
            console.log(d);
            //console.log(htmltext)
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.pl_name}</div>
              <div><i>Star Type: ${d.starType}</i></div>
              <ul>
                <li>Mass: ${d.pl_bmasse}</li>
                <li>Radius: ${d.pl_rade}</li>
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