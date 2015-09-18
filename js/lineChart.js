
 window.onresize = function(event) { redraw() }
 //d3.select(window).on('resize',resize)

 function canvasSize(targetElement) {
    var newHeight = parseFloat(d3.select(targetElement).node().clientHeight);
    var newWidth = parseFloat(d3.select(targetElement).node().clientWidth);
    return [newWidth,newHeight];
  }
	
	d3.csv("data/data_regions.csv", function(data) { dashboard(data) } );

	function dashboard(data) { 
			//if(Array.isArray(data) ) { console.log("yes")} else { console.log("no")}
			//console.log(data)
			createLineChart(data,".lineChart")
			redraw()
		};

	function createLineChart(data,targetDiv) {
			if(Array.isArray(data) ) { console.log("yes")} else { console.log("no")}
			console.log(data)
			var tooltipcolor;
			var colorScale = d3.scale.category10();
			//Set up date formatting and years
			dateFormat = d3.time.format("%Y");   
	
			years = d3.keys(data[0]).filter( function(key) { return key != "Location" && key != "Region" } ) 

			regions = d3.nest().key(function(d) { return d["Region"]}).sortKeys(d3.ascending).entries(data)
      regions = regions.filter(function(d) { return !(d.key == "World")})
      //[{color:"#12b3ae",key:"Africa",values:[{Location:"South Africa",2002:"12.1",2003:"13.1"}]}]

      //array containing only keys
  	 	var region = d3.set(data.map(function(d) {return d.Region } ) )
			.values().filter(function(d) { return !(d == "World")}).sort(d3.acscending) 

			function colorize (regions) {
				regions.forEach( function(d,i) {
					d.color = colorScale(d.key);
				})
			}
			colorScale.domain(region)
			colorize(regions) 

				//Create a new, empty array to hold our restructured dataset
			dataset = [];
			//Loop once for each row in data
			for (var i = 0; i < data.length; i++) {
				//Create new object with Location name and empty array
				dataset[i] = { location: data[i].Location, region: data[i].Region, headlines: [] };
				//Loop through all the years
				for (var j = 0; j < years.length; j++) {
					// If value is not empty then placeholder is created
					if (data[i][years[j]]) { dataset[i].headlines.push({ year: years[j], amount: data[i][years[j]] }); }
				}
			} 

      	svg = d3.select(".lineChart")//.append("svg").attr("class","svg")

      	//Make a group for each country
				groups = svg.selectAll("g").data(dataset)

				groups.enter().append("g")

				groups.exit().remove()


			//Within each group, create a new line/path,
			//binding just the headlines data to each one.
			// //using this format .data(dataset) will warp the line color and append World as the 
			//title for every line
			paths = groups.selectAll("path").data(function(d) { return [d] })

			paths.enter().append("path")	
				.style("stroke", 
					function(d,i) { 
    				var val;
						regions.forEach(function(obj) {
							if(d.region === obj.key) { 
								val = obj.color } 
						})
						d.color = val
						return val
      		}).style("stroke-width", 3).style("opacity",.4)
				.attr("id",function(d) { return d.region})
				.attr("class", function(d) {
						switch (d.region) {
							case "Oceana": return "line Oceana"
							case "Europe": return "line Europe"
							case "North America": return "line NA"
							case "Asia": return "line Asia"
							case "Middle East": return "line ME"
							case "Latin America": return "line LA"
							default: return "line"
						}							
				})

				paths.exit().remove()

				xgScale = svg.append("g").attr("class", "x axis")
				ygScale = svg.append("g").attr("class", "y axis")

				//Set up scales
				xScale = d3.time.scale().domain(d3.extent(years, function(d) { return dateFormat.parse(d)}))
				yScale = d3.scale.linear().domain([ d3.max(dataset, function(d) { return d3.max(d.headlines, function(d) {return +d.amount; });}),0 ]);

				xAxis = d3.svg.axis().orient("bottom").ticks(15).tickFormat(function(d) { return dateFormat(d); });
				yAxis = d3.svg.axis().orient("left").tickFormat(function(d) { return d + "%" } ); 

				line = d3.svg.line()
					.x(function(d) { return xScale(dateFormat.parse(d.year));})
					.y(function(d) {return yScale(+d.amount);
				});
	}

	function redraw() {
			console.log("inside redraw")
			var linechart = canvasSize(".lineChart")

			var margin = {top:20,right:0,bottom:30,left:50}
			var w = linechart[0] - margin.left - margin.right;
			var h = linechart[1] - margin.top - margin.bottom;	

			//Create main SVG
			svg.attr("width", w + margin.left + margin.right).attr("height", h + margin.top + margin.bottom)
	
			//Set up scales
			xScale.range([margin.left, w])
			yScale.range([ margin.top, h ])
	
			//Configure axis generators
			xAxis.scale(xScale)//.orient("bottom").ticks(15).tickFormat(function(d) { return dateFormat(d); });
			yAxis.scale(yScale)//.orient("left").tickFormat(function(d) { return d + "%" } );   

			// d3.select(".x.axis").transition().duration(2000).call(xAxis);
			// d3.select(".y.axis").transition().duration(2000).call(yAxis);  
			//xgScale.attr("transform", "translate(0," + (h) + ")").call(xAxis);
			//below demo's both ways to use translate
			xgScale.attr("transform", function() {  return "translate(0," + (h) + ")"  } ).call(xAxis);
			ygScale.attr("transform", "translate(" + margin.left + ",0)")
			//ygScale.transition().duration(2000).call(yAxis)

			//svg.select(".x.Axis").transition().duration(2000).call(xAxis);
			svg.select(".y.axis").transition().duration(2000).call(yAxis);


			paths.attr("d", function(d) { return line(d.headlines)} )
				.append("title").text(function(d) {return d.location})

				//Axes

				// svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (h - padding[2]) + ")").call(xAxis);
				// svg.append("g").attr("class", "y axis").attr("transform", "translate(" + (padding[3]) + ",0)").call(yAxis)
    //             // Add rotated "Number of Headlines" unit of measure text to x-axis
    //           .append("text")
    //           .attr("class", "label")
    //           .attr("transform", "rotate(-90)")
    //           .attr("x", -20)
    //           .attr("y", 5)
    //           .attr("dy", ".91em")
    //           .style("text-anchor", "end")
    //           .text("Percent of Engery Generation ");

	}
