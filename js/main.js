let planetByPlanetChart, planetByStar, starType, discoveryMethod, habitableChart, histogram, lineChart, timelineCircle, dataTable;
let globalData;
let data;
let solarSystemData = [];
let lineData,histData,scatData;
let bins;
//console.log("Hello world");
d3.csv('data/exoplanets.csv')
  .then(thisData => {
  	data = thisData;
  	//console.log('Data loading complete. Work with dataset.');
    //console.log(data);
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

	  		let mass = parseFloat(d.pl_bmasse);
	  		if(mass < .00001){
	  			d.planetType = "Asteroidan"
	  			d.planetColor = "#54a53e"
	  		}
	  		if(mass >= .00001 && mass < .1){
	  			d.planetType = "Mercurian"
	  			d.planetColor = "#85c555"
	  		}
	  		if(mass >= .1 && mass < .5){
	  			d.planetType = "Subterran"
	  			d.planetColor = "#51b7c5"
	  		}
				if(mass >= .5 && mass < 2){
	  			d.planetType = "Terran"
	  			d.planetColor = "#0185b5"
	  		}
				if(mass >= 2 && mass < 10){
	  			d.planetType = "Supperterran"
	  			d.planetColor = "#0185b5"
	  		}
				if(mass >= 10 && mass < 50){
	  			d.planetType = "Neptunian"
	  			d.planetColor = "#4d4798"
	  		}
				if(mass >= 50){
	  			d.planetType = "Jovian"
	  			d.planetColor = "#252e4b"
	  		}


  	});
  	globalData = data;
  	solarSystemData.push({"planetType":"Mercurian","planetColor":"#85c555","pl_bmasse": 0.0553, "pl_rade":.3825, "pl_name":"Mercury","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"0.3871",  "st_rad":"1",  "st_mass":"1"});
	    solarSystemData.push({"planetType":"Terran","planetColor":"#0185b5","pl_bmasse": 0.815, "pl_rade":.9489, "pl_name":"Venus","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"0.7233",  "st_rad":"1",  "st_mass":"1"});
	    solarSystemData.push({"planetType":"Terran","planetColor":"#0185b5","pl_bmasse": 1, "pl_rade":1, "pl_name":"Earth","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"1",  "st_rad":"1",  "st_mass":"1"});
	    solarSystemData.push({"planetType":"Subterran","planetColor":"#51b7c5","pl_bmasse": .1075, "pl_rade":.5325, "pl_name":"Mars","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"1.5273",  "st_rad":"1",  "st_mass":"1"});
	    solarSystemData.push({"planetType":"Jovian","planetColor":"#252e4b","pl_bmasse": 317.8, "pl_rade":11.2092, "pl_name":"Jupiter","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"5.2028",  "st_rad":"1",  "st_mass":"1"});
	    solarSystemData.push({"planetType":"Jovian","planetColor":"#252e4b","pl_bmasse": 95.2, "pl_rade":9.4494, "pl_name":"Saturn","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"9.53881",  "st_rad":"1",  "st_mass":"1"});
	    solarSystemData.push({"planetType":"Neptunian","planetColor":"#4d4798","pl_bmasse": 14.6, "pl_rade":4.0074, "pl_name":"Uranus","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"19.1914",  "st_rad":"1",  "st_mass":"1"});
	    solarSystemData.push({"planetType":"Neptunian","planetColor":"#4d4798","pl_bmasse": 17.2, "pl_rade":3.8827, "pl_name":"Neptune","starType":"SUN","starColor":"#89CFF0", "hostname":"Sun", "sys_name":"The Solar System", "pl_orbsmax":"30.0611",  "st_rad":"1",  "st_mass":"1"});

  	
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
					d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
				} else if (filterData == "reset") {
					d3.selectAll('#ExoplanetExplorer').style("display",'none');
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
					d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
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
				d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
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
				d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
				
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
				d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
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
				d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
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
		//populateExoplanetSystemBrowser("GJ 667 C b");
		//populateExoplanetSystemBrowser("Kepler-444 b");
		d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
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
  	//console.log(data)
  	//lets compute costs per year for the line chart
    let minYear = d3.min( data, d => d.disc_year);
    let maxYear = d3.max( data, d=> d.disc_year );

    let costsPerYear = []; //this will be our data for the line chart
    for(let i = minYear; i <= maxYear; i++){

      let justThisYear = data.filter( d => d.disc_year == i ); //only include the selected year
      let cost = d3.count(justThisYear, d => d.sy_snum); //sum over the filtered array, for the cost field

      costsPerYear.push( {"year": i, "cost":cost});

    }
    //console.log(costsPerYear)
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
  	//console.log("drawing Table")
  		let tableid = "#dataTable"
	  	let tableWidth = dataTable.offsetWidth;
			let tableHeight = dataTable.offsetHeight;
			let nameFunc = function(data) { return data.pl_name; }
			let sysNameFunc = function(data) { return data.sys_name; }
			let discYearFunc = function(data) { return data.disc_year; }
			let starFunc = function(data) { return data.starType; }
			let distFunc = function(data) { return data.sy_dist; }
			let columns = ["Planet Name", "System Name", "Discovery Year", "Star Type", "Distance From Earth (parsecs)"];
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
		      return { column: column, name: nameFunc(d), sysName: sysNameFunc(d), discYear:discYearFunc(d), starType: starFunc(d), dist:distFunc(d)};
		    });
		  })
		  .enter()
		  .append("td")
			.text(function (d) {
				if (d.column === columns[0]) return d.name;
				else if (d.column === columns[1]) return d.sysName;
				else if (d.column === columns[2]) return d.discYear;
				else if (d.column === columns[3]) return d.starType;
				else if (d.column === columns[4]) return d.dist;
			});

			cells.on("click", function(event, d) {
				populateExoplanetSystemBrowser(d.name)
        });
		}

		function updateFromLine(date1,date2){
			//console.log("line")
			  let min = Math.trunc(Math.round(parseFloat(date1)* 10)/10)
			  let max = Math.trunc(Math.round(parseFloat(date2) * 10)/10)
			  lineData = data;
  			lineData = lineData.filter(d => d.disc_year >= min)
  			lineData = lineData.filter(d => d.disc_year <= max)
				planetByPlanetChart.data = getPlanetData(lineData);
				planetByStar.data = getStarData(lineData);
				starType.data = getStarTypeData(lineData);
				discoveryMethod.data = getMethodData(lineData);
				habitableChart.data = getHabData(lineData);
				histogram.data = getHistData(lineData);
				timelineCircle.data = getScatterData(lineData,"ALL");
				planetByStar.updateVis();
				planetByPlanetChart.updateVis();
				starType.updateVis();
				discoveryMethod.updateVis();
				habitableChart.updateVis();
				histogram.updateVis();
				timelineCircle.updateVis();
				drawTable(lineData);
				d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
  }
  function updateFromHist(dist1,dist2){
			  let min = parseFloat(dist1)
			  let max = parseFloat(dist2)
			  histData = data;
  			histData = histData.filter(d => parseFloat(d.sy_dist) >= min)
  			histData = histData.filter(d => parseFloat(d.sy_dist) <= max)
				planetByPlanetChart.data = getPlanetData(histData);
				planetByStar.data = getStarData(histData);
				starType.data = getStarTypeData(histData);
				discoveryMethod.data = getMethodData(histData);
				lineChart.data = getLineData(histData);
				habitableChart.data = getHabData(histData);
				timelineCircle.data = getScatterData(histData,"ALL");
				planetByStar.updateVis();
				planetByPlanetChart.updateVis();
				starType.updateVis();
				discoveryMethod.updateVis();
				habitableChart.updateVis();
				timelineCircle.updateVis();
				lineChart.updateVis();
				drawTable(histData);

    d3.selectAll("#A").attr("class","legend-btn")
    d3.selectAll("#F").attr("class","legend-btn")
    d3.selectAll("#G").attr("class","legend-btn")
    d3.selectAll("#K").attr("class","legend-btn")
    d3.selectAll("#M").attr("class","legend-btn")
    d3.selectAll("#NA").attr("class","legend-btn")
    d3.selectAll("#SUN").attr("class","legend-btn")
  }
  function updateFromScat(m1,m2,r1,r2){
			  let minM = parseFloat(m1)
			  let maxM = parseFloat(m2)
			  let minR = parseFloat(r1)
			  let maxR = parseFloat(r2)
			  let aInactive = d3.selectAll("#A").classed("legend-btn inactive")
			  let fInactive = d3.selectAll("#F").classed("legend-btn inactive")
			  let gInactive = d3.selectAll("#G").classed("legend-btn inactive")
			  let kInactive = d3.selectAll("#K").classed("legend-btn inactive")
			  let mInactive = d3.selectAll("#M").classed("legend-btn inactive")
			  let naInactive = d3.selectAll("#NA").classed("legend-btn inactive")
			  scatData = data;
  			scatData = scatData.filter(d => parseFloat(d.pl_bmasse) >= minM)
  			scatData = scatData.filter(d => parseFloat(d.pl_bmasse) <= maxM)
  			scatData = scatData.filter(d => parseFloat(d.pl_rade) >= minR)
  			scatData = scatData.filter(d => parseFloat(d.pl_rade) <= maxR)
  			if(aInactive){
  				scatData = scatData.filter(d => d.starType != "A")
  			}
  			if(fInactive){
  				scatData = scatData.filter(d => d.starType != "F")
  			}
  			if(gInactive){
  				scatData = scatData.filter(d => d.starType != "G")
  			}
  			if(kInactive){
  				scatData = scatData.filter(d => d.starType != "K")
  			}
  			if(mInactive){
  				scatData = scatData.filter(d => d.starType != "M")
  			}
  			if(naInactive){
  				scatData = scatData.filter(d => d.starType != "N/A")
  			}
				planetByPlanetChart.data = getPlanetData(scatData);
				planetByStar.data = getStarData(scatData);
				starType.data = getStarTypeData(scatData);
				discoveryMethod.data = getMethodData(scatData);
				lineChart.data = getLineData(scatData);
				habitableChart.data = getHabData(scatData);
				histogram.data = getHistData(scatData);
				planetByStar.updateVis();
				planetByPlanetChart.updateVis();
				starType.updateVis();
				discoveryMethod.updateVis();
				habitableChart.updateVis();
				lineChart.updateVis();
				histogram.updateVis();
				drawTable(scatData);
  }

  function hideBox() {
    d3.selectAll('#ExoplanetExplorer').style("display",'none');
  }

   function populateExoplanetSystemBrowser(planet) {
    let explorer = d3.selectAll('#ExoplanetExplorer').style("display",'block');
		document.getElementById("ExoplanetExplorerData").style.width = window.innerWidth/4.5 + "px";
		let width = window.innerWidth/4.5
    let explorerData = d3.selectAll('#ExoplanetExplorerData');
    explorerData.selectAll('.text').remove();
    let thisData = globalData;
    let thisTableData = globalData;
    thisData = thisData.filter((d)=>d.pl_name == planet)
    if(thisData.length == 0){
    	thisData = solarSystemData;
    	thisTableData = solarSystemData;
    	thisData = thisData.filter((d)=>d.pl_name == planet)
    }
    let system = thisData[0].sys_name;
    let host = thisData[0].hostname;
    explorerData.append("text")
          .attr("font-size", "20px")
          .attr("class", "text")
				   .text("Selected Planet: ")
				   .style("font-family", "system-ui")
				   .style("color", "black")
				   .style("font-size", "20px")
				   .style("display", "block")
				   .style("text-align", "left")
				   .style("margin-bottom", "10px")
				   .style("margin-right", "0px")
				   .append("span")
		       .text(planet)
		       .style("text-decoration", "underline");
		let hosttext = explorerData.append("text")
          .attr("font-size", "20px")
          .attr("class", "text")
				   .text("Selected Host: ")
				   .style("font-family", "system-ui")
				   .style("color", "black")
				   .style("font-size", "20px")
				   .style("display", "block")
				   .style("text-align", "left")
				   .style("margin-bottom", "10px")
				   .style("margin-right", "0px")
				  hosttext.append("span")
		       .text(host)
		       .style("text-decoration", "underline")
		      hosttext.append("text").text(" --->")
		       .style("text-decoration", "none")
		explorerData.append("text")
          .attr("font-size", "20px")
          .attr("class", "text")
				   .text("Selected System: ")
				   .style("font-family", "system-ui")
				   .style("color", "black")
				   .style("font-size", "20px")
				   .style("display", "block")
				   .style("text-align", "left")
				   .style("margin-bottom", "30px")
				   .style("margin-right", "0px")
				   .append("span")
		       .text(system)
		       .style("text-decoration", "underline");

		let starData = thisData
		starData = starData.filter((d)=>d.hostname == host)
		//starData = starData[0]
		if(starData[0].st_rad != ""){
		var max =  d3.max(globalData, d => parseFloat(d.st_rad)) 
			var min = d3.min(globalData, d => parseFloat(d.st_rad)) 
			console.log(min,max,starData)
			let ryScale = d3.scaleLinear()
	    .domain([min , max]) 
	    .range([30, 55]) 
	    .nice();

	    let starHolder = d3.selectAll('#star');
	    starHolder.selectAll("circle").remove();
	    starHolder.selectAll("text").remove();
	    let circles = starHolder
	    .selectAll('circle')
	    .data(starData)
	    .join('circle')
	    .attr('class','thisCircle')
	    .attr('fill', (d) => d.starColor)
	    .attr('opacity', 1)
	    .attr('stroke', "gray")
	    .attr('stroke-width', 2)
	    .attr('r', (d) => ryScale(parseFloat(d.st_rad)) ) 
	    .attr('cy', 50) 
	    .attr('cx', 75);

	  circles
	    .on('mouseover', (event,d) => {
	    	let rad = d.st_rad + " Solar Radius"
	    	let mas = d.st_mass + " Solar Mass"
	    	if(d.st_rad == ""){
	    		rad = "Unknown"
	    	}
	    	if(d.st_mass == ""){
	    		mas = "Unknown"
	    	}
	      d3.select('#tooltip')
	      .style('display', 'block')
	      .style('left', (event.pageX) + 'px')   
	      .style('top', (event.pageY + 20) + 'px')
	      .html(`
	              <div class="tooltip-title">${d.hostname}</div>
	              <div><i>Star Type: ${d.starType}</i></div>
	              <ul>
	                <li>Stellar Radius: ${rad}</li>
	                <li>Stellar Mass: ${mas}</li>
	              </ul>
	            `);
	      })
	      .on('mouseleave', () => {
	        d3.select('#tooltip').style('display', 'none');
	      });
	  }
	  else{
	  	let starHolder = d3.selectAll('#star');
	    starHolder.selectAll("circle").remove();
	    starHolder.selectAll("text").remove();

	    starHolder.append("text")
	    .attr('transform', `translate(0,60)`)
          .attr("font-size", "20px")
          .attr("class", "text")
				   .text("Host Size: Unknown")
				   .style("font-family", "system-ui")
				   .style("color", "black")
				   .style("font-size", "20px")
				   .style("display", "block")
				   .style("text-align", "left")
				   .style("margin-bottom", "30px")
				   .style("margin-right", "0px")
	  }
    

    let dataTable2 = document.getElementById("dataTable2")
		document.getElementById("dataTable2").style.width = window.innerWidth/4.2 + "px";
		document.getElementById("dataTable2").style.height = window.innerHeight/3.85 + "px";
		
		thisTableData = thisTableData.filter((d)=>d.sys_name == system)
		drawTable2(thisTableData);

		var svg = d3.selectAll("#ExoplanetExplorerChart");
		svg.selectAll("svg").remove();
		svg.append("svg").attr("id","starChart")
		systemBrowser = new SystemBrowser({
			'parentElement': '#starChart',
			'containerHeight': window.innerHeight/2.6,
			'containerWidth': window.innerWidth/4.2
		},  thisTableData);
  }

  function drawTable2(thisData) {
  	//console.log("drawing Table")
  		let tableid = "#dataTable2"
	  	let tableWidth = dataTable2.offsetWidth;
			let tableHeight = dataTable2.offsetHeight;
			let nameFunc = function(data) { return data.pl_name; }
			let hostNameFunc = function(data) { return data.hostname; }
			let sysNameFunc = function(data) { return data.sys_name; }
			let distFunc = function(data) { 
				if(!data.pl_orbsmax){
					return "Unknown"
				}
				return data.pl_orbsmax; }
			let columns = ["Planet Name", "Host Name", "System Name", "Distance From Host (parsecs)"];
	    var sortNameDescending = function (a, b) { return nameFunc(b) - nameFunc(a) }
	    var width = tableWidth + "px";
	    var height = tableHeight - 60 + "px";
	    var twidth = (tableWidth - 25) + "px";
	    var divHeight = (tableHeight - 60) + "px";
	    d3.selectAll("table2").remove();
	    var outerTable = d3.select(tableid)
		    .append("table2")
		    .attr("width", width);
	    outerTable.append("tr")
	      .append("td")
	      .append("table2")
	      .attr("class", "headerTable")
	      .attr("width", width)
	      .append("tr").selectAll("th").data(columns)
	      .enter().append("th")
	      .attr("width", twidth)
	      .style("font-family", "system-ui")
	      .text(function (column) { return column; })
			var inner = outerTable.append("tr").append("td")
				.append("div")
				.attr("class", "scroll")
				.attr("width", width)
				.attr("style", "height:" + divHeight + ";")
				.append("table")
				.attr("class", "bodyTable")
				.attr("border", 1)
				.attr("width", twidth)
				.attr("height", height)
				.attr("style", "table-layout:fixed");

	    var tbody = inner.append("tbody");
  	  // Create a row for each object in the data and perform an intial sort.
    	var rows = tbody.selectAll("tr").data(thisData).enter().append("tr").sort(sortNameDescending).style("text-align","center");

    	// Create a cell in each row for each column
    	var cells = rows.selectAll("td")
		  .data(function (d) {
		    return columns.map(function (column) {
		      return { column: column, name: nameFunc(d), hostname: hostNameFunc(d), sysname:sysNameFunc(d), dist:distFunc(d)};
		    });
		  })
		  .enter()
		  .append("td")
			.text(function (d) {
				if (d.column === columns[0]) return d.name;
				else if (d.column === columns[1]) return d.hostname;
				else if (d.column === columns[2]) return d.sysname;
				else if (d.column === columns[3]) return d.dist;
			});
			cells.on("mouseover", function(event, d) {

				let cellData = globalData
				if(d.hostname == "Sun"){
					cellData = solarSystemData
					d.hostname = "Sun"
				}
				cellData = cellData.filter((data)=>data.pl_name == d.name)
				var dist = d.dist + " parsecs"
				if(d.dist == "Unknown"){
					dist = d.dist
				}
		    d3.select('#tooltip')
            .style('display', 'block')
            .style('left', function(d){
                let xVal = event.pageX + 10 + 'px';
                return xVal})   
            .style('top', event.pageY + 'px')
            .html(`
              <div class="tooltip-title"> ${d.name}</div>
              <div><i>Host: ${d.hostname}</i></div>
              <div><i>System: ${d.sysname}</i></div>
              <div><i>Distance: ${dist}</i></div>
              <div><i>Planet Type: ${cellData[0].planetType}</i></div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
          d3.selectAll("rect")
            .style("filter", "brightness(100%)");
        });
		}