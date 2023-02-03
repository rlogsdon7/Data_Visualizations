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
  	
  	let stars = ["A","F","G","K","M"]
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
  					return (d.st_rad > 8.5  && d.st_rad < 12.5)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "F"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.st_rad > 1.5  && d.st_rad < 2.2)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "G"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.st_rad > .95  && d.st_rad < 1.4)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "K"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.st_rad > .38  && d.st_rad < .56)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		if(stars2[star2] == "M"){
  				let justThisStar3 = justThisStar2.filter( function(d) { 
  					return (d.st_rad > .08  && d.st_rad < .12)
  				});
  				holder = d3.count(justThisStar3, d => d.sy_snum);
  				habitable += holder;
  				uninhabitable += total - holder;
  		}
  		
  	}
  	habitableData.push( {"habType": "Habitable", "index": 1, "count":habitable});
  	habitableData.push( {"habType": "Uninhabitable", "index": 2, "count":uninhabitable});
  	/*// Create an instance (for example in main.js)
		let timelineCircles = new TimelineCircles({
			'parentElement': '#timeline',
			'containerHeight': 1100,
			'containerWidth': 1000
		}, data);
		*/
		console.log(habitableData)
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
console.log("Here1?")
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