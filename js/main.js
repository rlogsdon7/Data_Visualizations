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
  			}

  	});

    //lets compute costs per year for the line chart
  	let minStars = d3.min( data, d => d.sy_snum);
  	let maxStars = d3.max( data, d=> d.sy_snum );
  	let starCountData = []; //this will be our data for the line chart
  	for(let i = minStars; i <= maxStars; i++){

  		let justThisStar = data.filter( d => d.sy_snum == i ); //only include the selected year
  		let starCount = d3.count(justThisStar, d => d.sy_snum); //sum over the filtered array, for the cost field
  		if(i == 1){
  			starCountData.push( {"numStars": 1, "starCount":starCount});
  		}
  		else{
  			starCountData.push( {"numStars": i, "starCount":starCount});
  		}

  	}

  	let minPlanets = d3.min( data, d => d.sy_pnum);
  	let maxPlanets = d3.max( data, d=> d.sy_pnum );

  	let planetCountData = []; //this will be our data for the line chart
  	for(let i = minPlanets; i <= maxPlanets; i++){

  		let justThisPlanet = data.filter( d => d.sy_pnum == i ); //only include the selected year
  		let count = d3.count(justThisPlanet, d => d.sy_snum); //sum over the filtered array, for the cost field
  		if(i == 1){
  			planetCountData.push( {"numPlanets": 1, "count":count});
  		}
  		else{
  			planetCountData.push( {"numPlanets": i, "count":count});
  		}

  	}
  	
  	let stars = ["A","F","G","K","M","N/A"]
  	let starTypeData = []; //this will be our data for the line chart
  	let counter = 1;
  	for(let star in stars){

  		let justThisStar = data.filter( d => d.starType == stars[star] ); //only include the selected year
  		let count = d3.count(justThisStar, d => d.sy_snum); //sum over the filtered array, for the cost field
  		starTypeData.push( {"starType": stars[star], "index": counter, "count":count});
  		counter++
  	}

  	let discMethods = ["Astrometry","Disk Kinematics","Eclipse Timing Variations",
  		"Imaging","Microlensing","Orbital Brightness Modulation","Pulsar Timing","Pulsation Timing Variations","Radial Velocity",
  		"Transit","Transit Timing Variations"]
  	let discMethodData = []; //this will be our data for the line chart
  	let counter2 = 1;
  	for(let method in discMethods){
  		let justThisMethod= data.filter( d => d.discoverymethod == discMethods[method] ); //only include the selected year
  		  		console.log(justThisMethod)
  		let count2 = d3.count(justThisMethod, d => d.sy_snum); //sum over the filtered array, for the cost field
  		discMethodData.push( {"discMethod":discMethods[method].split(" ").map(word => word[0]).join(""),"toolTip": discMethods[method], "index": counter2, "count":count2});
  		counter2++
  	}

		let stars2 = ["A","F","G","K","M"]
  	let habitableData = []; //this will be our data for the line chart
  	let habitable = 0;
  	let uninhabitable = 0;
  	for(let star2 in stars2){
  		let holder = 0;
  		let justThisStar2 = data.filter( d => d.starType == stars2[star2] ); //only include the selected year
  		let total = d3.count(justThisStar2, d => d.sy_snum); //sum over the filtered array, for the cost field
  		if(stars2[star2] == "A"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.pl_orbsmax > 8.5  && d.pl_orbsmax < 12.5)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "F"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.pl_orbsmax > 1.5  && d.pl_orbsmax < 2.2)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "G"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.pl_orbsmax > .95  && d.pl_orbsmax < 1.4)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "K"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.pl_orbsmax > .38  && d.pl_orbsmax < .56)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "M"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.pl_orbsmax > .08  && d.pl_orbsmax < .12)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		
  	}
  	habitableData.push( {"habType": "Habitable", "index": 1, "count":habitable});
  	habitableData.push( {"habType": "Uninhabitable", "index": 2, "count":uninhabitable});
	
	//lets compute costs per year for the line chart
    let minYear = d3.min( data, d => d.disc_year);
    let maxYear = d3.max( data, d=> d.disc_year );

    let costsPerYear = []; //this will be our data for the line chart
    for(let i = minYear; i < maxYear; i++){

      let justThisYear = data.filter( d => d.disc_year == i ); //only include the selected year
      let cost = d3.sum(justThisYear, d => d.sy_snum); //sum over the filtered array, for the cost field

      costsPerYear.push( {"year": i, "cost":cost});

    }
    dataFilter = data.filter( d => d.pl_bmasse != "" )
    dataFilter2 = dataFilter.filter( d => d.pl_rade != "" )

    dataFilter2.push({"pl_bmasse": 0.0553, "pl_rade":.3825, "pl_name":"Mercury","starType":"SUN"});
    dataFilter2.push({"pl_bmasse": 0.815, "pl_rade":.9489, "pl_name":"Venus","starType":"SUN"});
    dataFilter2.push({"pl_bmasse": 1, "pl_rade":1, "pl_name":"Earth","starType":"SUN"});
    dataFilter2.push({"pl_bmasse": .1075, "pl_rade":.5325, "pl_name":"Mars","starType":"SUN"});
    dataFilter2.push({"pl_bmasse": 317.8, "pl_rade":11.2092, "pl_name":"Jupiter","starType":"SUN"});
    dataFilter2.push({"pl_bmasse": 95.2, "pl_rade":9.4494, "pl_name":"Saturn","starType":"SUN"});
    dataFilter2.push({"pl_bmasse": 14.6, "pl_rade":4.0074, "pl_name":"Uranus","starType":"SUN"});
    dataFilter2.push({"pl_bmasse": 17.2, "pl_rade":3.8827, "pl_name":"Neptune","starType":"SUN"});
		dataFilter2.sort((a, b) => a.starType.localeCompare(b.starType));
		d3.selectAll('.legend-btn').on('click', function() {
		  console.log("button! ");
		  // Toggle 'inactive' class
		  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
		  
		  // Check which categories are active
		  let selectedCategory = [];
		  d3.selectAll('.legend-btn:not(.inactive)').each(function() {
		    selectedCategory.push(d3.select(this).attr('category'));
		  });

		  // Filter data accordingly and update vis
		  timelineCircle.data = dataFilter2.filter(d => selectedCategory.includes(d.starType)) ;
		  timelineCircle.updateVis();

		});

		function drawTable(data, tableid, dimensions, nameFunc, hostNameFunc, discYearFunc, starFunc, distFunc, columns) {
	    var sortNameDescending = function (a, b) { return nameFunc(b) - nameFunc(a) }
	    var width = dimensions.width + "px";
	    var height = dimensions.height + "px";
	    var twidth = (dimensions.width - 25) + "px";
	    var divHeight = (dimensions.height - 60) + "px";
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
		let planetByStar = new PlanetByStar({
			'parentElement': '#planetByStar',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, starCountData); 
		let planetByPlanet = new PlanetByPlanet({
			'parentElement': '#planetByPlanet',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, planetCountData); 
		let starType = new StarType({
			'parentElement': '#starType',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, starTypeData); 
		let discoveryMethod = new DiscoveryMethod({
			'parentElement': '#discoveryMethod',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, discMethodData); 
		let habitableChart = new Habitable({
			'parentElement': '#habitable',
			'containerHeight': window.innerHeight/3.5,
			'containerWidth': window.innerWidth/5.1,
			}, habitableData); 
		let histogram = new Histogram({
			'parentElement': '#histogram',
			'containerHeight': window.innerHeight/3.98,
			'containerWidth': window.innerWidth/3.1,
			}, data); 
		let lineChart = new Line({
      'parentElement': '#line',
      'containerHeight': window.innerHeight/3.98,
			'containerWidth': window.innerWidth/3.1,
      }, costsPerYear); 
		console.log(habitableData)
		timelineCircle = new TimelineCircles({
			'parentElement': '#timeline',
			'containerHeight': window.innerHeight/2.35,
			'containerWidth': window.innerWidth/3.1
		}, dataFilter2);
		let dataTable = document.getElementById("dataTable");
		document.getElementById("dataTable").style.width = window.innerWidth/3.2 + "px";
		document.getElementById("dataTable").style.height = window.innerHeight/2.1 + "px";
		let tableWidth = dataTable.offsetWidth;
		let tableHeight = dataTable.offsetHeight;
		let nameFunc = function(data) { return data.pl_name; }
		let hostNameFunc = function(data) { return data.hostname; }
		let discYearFunc = function(data) { return data.disc_year; }
		let starFunc = function(data) { return data.starType; }
		let distFunc = function(data) { return data.sy_dist; }
		let columns = ["Planet Name", "Host Name", "Discovery Year", "Star Type", "Distance From Earth (parsecs)"];
		drawTable(data, "#dataTable", { width: tableWidth, height: tableHeight }, nameFunc, hostNameFunc, discYearFunc, starFunc, distFunc, columns);
		})
		.catch(error => {
		    console.error('Error loading the data');
		});

function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }