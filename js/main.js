let planetByPlanetChart, planetByStar, starType, discoveryMethod, habitableChart, histogram, lineChart, timelineCircle, dataTable;
let globalData;
console.log("Hello world");
d3.csv('data/exoplanets.csv')
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');
    console.log(data);
    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      	//d.cost = +d.cost; // convert string 'cost' to number
      	//d.daysFromYrStart = computeDays(d.start); //note- I just created this field in each object in the array on the fly

				//let tokens = d.st_spectype.split("-");
  			//d.year = +tokens[0];
  			d.starType= d.st_spectype.charAt(0).toUpperCase();
  			if(d.st_spectype.charAt(0).toUpperCase()!="A" && d.st_spectype.charAt(0).toUpperCase()!="F" && d.st_spectype.charAt(0).toUpperCase()!="G" && d.st_spectype.charAt(0).toUpperCase()!="K" && d.st_spectype.charAt(0).toUpperCase()!="M"){
  				d.starType = "N/A"
  				d.starColor = "#d95f02"
  			}

  			if(d.starType == "A"){
  				d.starColor = "#1b9e77"
  				if(d.pl_orbsmax > 8.5  && d.pl_orbsmax < 12.5){
  					d.habitable = "Habitable"
  				}
  				else{
  					d.habitable = "Uninhabitable"
  				}
	  		}
	  		if(d.starType == "F"){
	  			d.starColor = "#7570b3"
	  			if(d.pl_orbsmax > 1.5  && d.pl_orbsmax < 2.2){
  					d.habitable = "Habitable"
  				}
  				else{
  					d.habitable = "Uninhabitable"
  				}
	  		}
	  		if(d.starType == "G"){
	  			d.starColor = "#e7298a"
	  			if(d.pl_orbsmax > .95  && d.pl_orbsmax < 1.4){
  					d.habitable = "Habitable"
  				}
  				else{
  					d.habitable = "Uninhabitable"
  				}
	  		}
	  		if(d.starType == "K"){
	  			d.starColor = "#66a61e"
	  			if(d.pl_orbsmax > .38  && d.pl_orbsmax < .56){
  					d.habitable = "Habitable"
  				}
  				else{
  					d.habitable = "Uninhabitable"
  				}
	  		}
	  		if(d.starType == "M"){
	  			d.starColor = "#ebbc35"
	  			if(d.pl_orbsmax > .08  && d.pl_orbsmax < .12){
  					d.habitable = "Habitable"
  				}
  				else{
  					d.habitable = "Uninhabitable"
  				}
	  		}

  	});
  	globalData = data;

  	
		d3.selectAll('.legend-btn').on('click', function() {
		  // Toggle 'inactive' class
		  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
		  let sun = "SUN"
		  // Check which categories are active
		  let selectedCategory = [];
		  d3.selectAll('.legend-btn:not(.inactive)').each(function() {
		  	if(d3.select(this).attr('category')=="SUN"){
		  		sun = "ALL"
		  	}
		    selectedCategory.push(d3.select(this).attr('category'));
		  });

		  // Filter data accordingly and update vis
		  timelineCircle.data = getScatterData(data.filter(d => selectedCategory.includes(d.starType)),sun) ;
		  timelineCircleupdateVis();

		});

		
		planetByStar = new PlanetByStar({
			'parentElement': '#planetByStar',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, getStarData(data),(filterData) => {
				let selectedFilter = [filterData];
				if (filterData != "reset"){
					data = data.filter(d => d.sy_snum == filterData);
					planetByPlanetChart.data = getPlanetData(data);
					planetByStar.data = getStarData(data);
					starType.data = getStarTypeData(data);
					discoveryMethod.data = getMethodData(data);
					habitableChart.data = getHabData(data);
					histogram.data = getHistData(data);
					lineChart.data = getLineData(data);
					timelineCircle.data = getScatterData(data,"ALL");
					planetByStar.updateVis();
					planetByPlanetChart.updateVis();
					starType.updateVis();
					discoveryMethod.updateVis();
					habitableChart.updateVis();
					histogram.updateVis();
					lineChart.updateVis();
					timelineCircle.updateVis();
					drawTable(data);
				} else if (filterData == "reset") {
					data = globalData
					planetByPlanetChart.data = getPlanetData(data);
					planetByStar.data = getStarData(data);
					starType.data = getStarTypeData(data);
					discoveryMethod.data = getMethodData(data);
					habitableChart.data = getHabData(data);
					histogram.data = getHistData(data);
					lineChart.data = getLineData(data);
					timelineCircle.data = getScatterData(data,"ALL");
					planetByStar.updateVis();
					planetByPlanetChart.updateVis();
					starType.updateVis();
					discoveryMethod.updateVis();
					habitableChart.updateVis();
					histogram.updateVis();
					lineChart.updateVis();
					timelineCircle.updateVis();
					drawTable(data);
				}
	});  
		 planetByPlanetChart = new PlanetByPlanet({
			'parentElement': '#planetByPlanet',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, getPlanetData(data),(filterData) => {
				data = data.filter(d => d.sy_pnum == filterData)
				planetByPlanetChart.data = getPlanetData(data);
				planetByStar.data = getStarData(data);
				starType.data = getStarTypeData(data);
				discoveryMethod.data = getMethodData(data);
				habitableChart.data = getHabData(data);
				histogram.data = getHistData(data);
				lineChart.data = getLineData(data);
				timelineCircle.data = getScatterData(data,"ALL");
				planetByStar.updateVis();
				planetByPlanetChart.updateVis();
				starType.updateVis();
				discoveryMethod.updateVis();
				habitableChart.updateVis();
				histogram.updateVis();
				lineChart.updateVis();
				timelineCircle.updateVis();
				drawTable(data);
	}); 
		starType = new StarType({
			'parentElement': '#starType',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, getStarTypeData(data),(filterData) => {
				data = data.filter(d => d.starType == filterData)
				planetByPlanetChart.data = getPlanetData(data);
				planetByStar.data = getStarData(data);
				starType.data = getStarTypeData(data);
				discoveryMethod.data = getMethodData(data);
				habitableChart.data = getHabData(data);
				histogram.data = getHistData(data);
				lineChart.data = getLineData(data);
				timelineCircle.data = getScatterData(data,"ALL");
				planetByStar.updateVis();
				planetByPlanetChart.updateVis();
				starType.updateVis();
				discoveryMethod.updateVis();
				habitableChart.updateVis();
				histogram.updateVis();
				lineChart.updateVis();
				timelineCircle.updateVis();
				drawTable(data);
				
		}); 
		discoveryMethod = new DiscoveryMethod({
			'parentElement': '#discoveryMethod',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, getMethodData(data),(filterData) => {
				data = data.filter(d => d.discoverymethod == filterData)
				planetByPlanetChart.data = getPlanetData(data);
				planetByStar.data = getStarData(data);
				starType.data = getStarTypeData(data);
				discoveryMethod.data = getMethodData(data);
				habitableChart.data = getHabData(data);
				histogram.data = getHistData(data);
				lineChart.data = getLineData(data);
				timelineCircle.data = getScatterData(data,"ALL");
				planetByStar.updateVis();
				planetByPlanetChart.updateVis();
				starType.updateVis();
				discoveryMethod.updateVis();
				habitableChart.updateVis();
				histogram.updateVis();
				lineChart.updateVis();
				timelineCircle.updateVis();
				drawTable(data);
			});
		habitableChart = new Habitable({
			'parentElement': '#habitable',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, getHabData(data),(filterData) => {
				data = data.filter(d => d.habitable == filterData)
				planetByPlanetChart.data = getPlanetData(data);
				planetByStar.data = getStarData(data);
				starType.data = getStarTypeData(data);
				discoveryMethod.data = getMethodData(data);
				habitableChart.data = getHabData(data);
				histogram.data = getHistData(data);
				lineChart.data = getLineData(data);
				timelineCircle.data = getScatterData(data,"ALL");
				planetByStar.updateVis();
				planetByPlanetChart.updateVis();
				starType.updateVis();
				discoveryMethod.updateVis();
				habitableChart.updateVis();
				histogram.updateVis();
				lineChart.updateVis();
				timelineCircle.updateVis();
				drawTable(data);
			}); 
		histogram = new Histogram({
			'parentElement': '#histogram',
			'containerHeight': window.innerHeight/3.98,
			'containerWidth': window.innerWidth/3.1,
			}, getHistData(data)); 
		lineChart = new Line({
      'parentElement': '#line',
      'containerHeight': window.innerHeight/3.98,
			'containerWidth': window.innerWidth/3.1,
      }, getLineData(data)); 
		timelineCircle = new TimelineCircles({
			'parentElement': '#timeline',
			'containerHeight': window.innerHeight/2.35,
			'containerWidth': window.innerWidth/3.1
		},  getScatterData(data,"ALL"));
		dataTable = document.getElementById("dataTable");
		document.getElementById("dataTable").style.width = window.innerWidth/3.2 + "px";
		document.getElementById("dataTable").style.height = window.innerHeight/2.1 + "px";
		
		drawTable(data);
		})
		.catch(error => {
		    console.error(error);
		});

function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }
function resetCharts(){
  	planetByStar.refresh("reset");

  }
function getStarData(data){
  	//lets compute costs per year for the line chart
  	let min = d3.min( data, d => d.sy_snum);
  	let max = d3.max( data, d=> d.sy_snum );
  	let colorPalette = d3.scaleOrdinal(d3.schemeDark2);
  	let resultData = []; //this will be our data for the line chart
		let globalMin = d3.min( globalData, d => d.sy_snum);
  	let globalMax = d3.max( globalData, d=> d.sy_snum );
    colorPalette.domain([globalMin,globalMax])
  	for(let j = globalMin; j<=globalMax;j++){
  		colorPalette(j);
  	}
  	for(let i = min; i <= max; i++){

  		let justThisStar = data.filter( d => d.sy_snum == i ); //only include the selected year
  		let starCount = d3.count(justThisStar, d => d.sy_snum); //sum over the filtered array, for the cost field
  		if(i == 1){
  			resultData.push( {"numStars": 1, "starCount":starCount, "color":colorPalette(i)});
  		}
  		else{
  			resultData.push( {"numStars": i, "starCount":starCount, "color":colorPalette(i)});
  		}

  	}
  	return resultData
  }
function getPlanetData(data){
  	let minPlanets = d3.min( data, d => d.sy_pnum);
  	let maxPlanets = d3.max( data, d=> d.sy_pnum );
  	let colorPalette = d3.scaleOrdinal(d3.schemeDark2);
  	let globalMinPlanets = d3.min( globalData, d => d.sy_pnum);
  	let globalMaxPlanets = d3.max( globalData, d=> d.sy_pnum );
    colorPalette.domain([globalMinPlanets,globalMaxPlanets])
  	for(let j = globalMinPlanets; j<=globalMaxPlanets;j++){
  		colorPalette(j);
  	}
  	let planetCountData = []; //this will be our data for the line chart
  	for(let i = minPlanets; i <= maxPlanets; i++){

  		let justThisPlanet = data.filter( d => d.sy_pnum == i ); //only include the selected year
  		let count = d3.count(justThisPlanet, d => d.sy_snum); //sum over the filtered array, for the cost field
  		if(count>0){
	  		if(i == 1){
	  			planetCountData.push( {"numPlanets": 1, "count":count, "color":colorPalette(i)});
	  		}
	  		else{
	  			planetCountData.push( {"numPlanets": i, "count":count, "color":colorPalette(i)});
	  		}
  		}

  	}
  	return planetCountData
  }
function getStarTypeData(data){
  	//lets compute costs per year for the line chart
  	let colorPalette = d3.scaleOrdinal(d3.schemeDark2);
  	let resultData = []; //this will be our data for the line chart
  	let starsColors = []
		let colorPaletteStars = d3.scaleOrdinal(d3.schemeDark2);
		colorPaletteStars.domain([1,6])
		let stars = ["A","F","G","K","M","N/A"]
		for(let j = 1; j<=6;j++){
			starsColors.push({"star":stars[j-1],"color":colorPaletteStars(j)});
		}
  	let counter = 1;
  	for(let star in stars){
  		let initialSweep = data.filter( d => d.starType == stars[star] ); 
  		let starCount = d3.count(initialSweep, d => d.sy_snum);
  		if(starCount > 0){
  			resultData.push({"starType": stars[star], "index": counter, "count":starCount, "color":starsColors[counter-1].color})
  		}
  		counter++
  	}
  	return resultData
  }
function getMethodData(data){
  	let discMethods = ["Astrometry","Disk Kinematics","Eclipse Timing Variations",
  		"Imaging","Microlensing","Orbital Brightness Modulation","Pulsar Timing","Pulsation Timing Variations","Radial Velocity",
  		"Transit","Transit Timing Variations"]
  	let colorPalette = d3.scaleOrdinal(d3.schemeDark2);
  	let resultData = []; //this will be our data for the line chart
  	let barsColors = []
		colorPalette.domain([1,11])
		for(let j = 1; j<=11;j++){
			barsColors.push({"method":discMethods[j-1],"color":colorPalette(j)});
		}
  	let counter = 1;
  	for(let method in discMethods){
  		let justThisMethod= data.filter( d => d.discoverymethod == discMethods[method] ); //only include the selected year
  		let count = d3.count(justThisMethod, d => d.sy_snum); //sum over the filtered array, for the cost field
  		if(count > 0){
  			resultData.push( {"discMethod":discMethods[method].split(" ").map(word => word[0]).join(""),"toolTip": discMethods[method], "index": counter, "count":count, "color":barsColors[counter-1].color});
  		}
  		counter++
  	}
  	return resultData
  }
  function getHabData(data){
  	let habitableData = []; //this will be our data for the line chart
  	let habitable = d3.count(data.filter( d => d.habitable == "Habitable" ), d => d.sy_snum);
  	let uninhabitable = d3.count(data.filter( d => d.habitable == "Uninhabitable" ), d => d.sy_snum);
  	if(habitable > 0){
  		habitableData.push( {"habType": "Habitable", "index": 1, "count":habitable, "color":"#1b9e77"});
  	}
  	if(uninhabitable > 0){
  		habitableData.push( {"habType": "Uninhabitable", "index": 2, "count":uninhabitable, "color":"#7570b3"});
  	}
  	if(habitable == 0 && uninhabitable == 0 ){
  		habitableData.push( {"habType": "Habitable", "index": 1, "count":habitable, "color":"#1b9e77"});
  		habitableData.push( {"habType": "Uninhabitable", "index": 2, "count":uninhabitable, "color":"#7570b3"});
  	}
  	return habitableData
  }
  function getHistData(data){
  	return data
  }
  function getLineData(data){
  	//lets compute costs per year for the line chart
    let minYear = d3.min( data, d => d.disc_year);
    let maxYear = d3.max( data, d=> d.disc_year );

    let costsPerYear = []; //this will be our data for the line chart
    for(let i = minYear; i <= maxYear; i++){

      let justThisYear = data.filter( d => d.disc_year == i ); //only include the selected year
      let cost = d3.sum(justThisYear, d => d.sy_snum); //sum over the filtered array, for the cost field

      costsPerYear.push( {"year": i, "cost":cost});

    }
  	return costsPerYear
  }
  function getScatterData(data,string){
  	dataFilter = data.filter( d => d.pl_bmasse != "" )
  	dataFilter.sort((a, b) => d3.descending(a.pl_name, b.pl_name))
    dataFilter2 = dataFilter.filter( d => d.pl_rade != "" )
    if(string!="SUN"){
	    dataFilter2.push({"pl_bmasse": 0.0553, "pl_rade":.3825, "pl_name":"Mercury","starType":"SUN","starColor":"#89CFF0"});
	    dataFilter2.push({"pl_bmasse": 0.815, "pl_rade":.9489, "pl_name":"Venus","starType":"SUN","starColor":"#89CFF0"});
	    dataFilter2.push({"pl_bmasse": 1, "pl_rade":1, "pl_name":"Earth","starType":"SUN","starColor":"#89CFF0"});
	    dataFilter2.push({"pl_bmasse": .1075, "pl_rade":.5325, "pl_name":"Mars","starType":"SUN","starColor":"#89CFF0"});
	    dataFilter2.push({"pl_bmasse": 317.8, "pl_rade":11.2092, "pl_name":"Jupiter","starType":"SUN","starColor":"#89CFF0"});
	    dataFilter2.push({"pl_bmasse": 95.2, "pl_rade":9.4494, "pl_name":"Saturn","starType":"SUN","starColor":"#89CFF0"});
	    dataFilter2.push({"pl_bmasse": 14.6, "pl_rade":4.0074, "pl_name":"Uranus","starType":"SUN","starColor":"#89CFF0"});
	    dataFilter2.push({"pl_bmasse": 17.2, "pl_rade":3.8827, "pl_name":"Neptune","starType":"SUN","starColor":"#89CFF0"});
		}
  	return dataFilter2
  }
  function timelineCircleupdateVis(){
  	timelineCircle.updateVis();
  }

  function drawTable(data) {
  	console.log("drawing Table")
  		let tableid = "#dataTable"
	  	let tableWidth = dataTable.offsetWidth;
			let tableHeight = dataTable.offsetHeight;
			let nameFunc = function(data) { return data.pl_name; }
			let hostNameFunc = function(data) { return data.hostname; }
			let discYearFunc = function(data) { return data.disc_year; }
			let starFunc = function(data) { return data.starType; }
			let distFunc = function(data) { return data.sy_dist; }
			let columns = ["Planet Name", "Host Name", "Discovery Year", "Star Type", "Distance From Earth (parsecs)"];
	    var sortNameDescending = function (a, b) { return nameFunc(b) - nameFunc(a) }
	    var width = tableWidth + "px";
	    var height = tableHeight - 60 + "px";
	    var twidth = (tableWidth - 25) + "px";
	    var divHeight = (tableHeight - 60) + "px";
	    d3.selectAll("table").remove();
	    var outerTable = d3.select(tableid).append("table").attr("width", width);
	    outerTable.append("tr")
	      .append("td")
	      .append("table").attr("class", "headerTable").attr("width", width)
	      .append("tr").selectAll("th").data(columns).enter()
			  .append("th").attr("width", twidth).style("font-family", "system-ui").text(function (column) { return column; })
			var inner = outerTable.append("tr").append("td")
			.append("div").attr("class", "scroll").attr("width", width).attr("style", "height:" + divHeight + ";")
			.append("table").attr("class", "bodyTable").attr("border", 1).attr("width", twidth).attr("height", height).attr("style", "table-layout:fixed");

	    var tbody = inner.append("tbody");
  	  // Create a row for each object in the data and perform an intial sort.
    	var rows = tbody.selectAll("tr").data(data).enter().append("tr").sort(sortNameDescending).style("text-align","center");

    	// Create a cell in each row for each column
    	var cells = rows.selectAll("td")
		  .data(function (d) {
		    return columns.map(function (column) {
		      return { column: column, name: nameFunc(d), hostname: hostNameFunc(d), discYear:discYearFunc(d), starType: starFunc(d), dist:distFunc(d)};
		    });
		  })
		  .enter()
		  .append("td")
			.text(function (d) {
				if (d.column === columns[0]) return d.name;
				else if (d.column === columns[1]) return d.hostname;
				else if (d.column === columns[2]) return d.discYear;
				else if (d.column === columns[3]) return d.starType;
				else if (d.column === columns[4]) return d.dist;
			});
		}