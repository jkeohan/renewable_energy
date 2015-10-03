
 window.onresize = function(event) { redraw() }
 //d3.select(window).on('resize',resize)

 	function canvasSize(targetElement) {
    var newHeight = parseFloat(d3.select(targetElement).node().clientHeight);
    var newWidth = parseFloat(d3.select(targetElement).node().clientWidth);
    return [newWidth,newHeight];
  }

	function dashboard(data) { 
			createLineChart(data,".lineChart")
			redraw()
	};

	function createLineChart(data,targetDiv) {

  	svg = d3.select(".lineChart")//.append("svg").attr("class","svg")
		groups = svg.selectAll("g.line").data(data)
		groups.enter().append("g").classed("line",true)
		groups.exit().remove()
		//DATA JOIN
		paths = groups.selectAll("path").data(function(d) { return [d] })
		//ENTER
		paths.enter().append("path")	
			.style("stroke-width", 0).style("opacity",.4)
			.style("stroke", function(d,i) {  return d.color})
			.attr("id",function(d) { return d.region})
			.append("title").text(function(d) {return d.location})
	  //UPDATE
	  //[Array[1],Array[1]]
	  //Array[1]...0: path#Oceana..__data__: Object..color,location,region,years[]
		paths.transition().duration(1000)
		.select("title").text(function(d) {return d.location})	
		if(d3.select(".x.axis")[0][0] === null ) {  xgScale = svg.append("g").attr("class", "x axis")   }
		if(d3.select(".y.axis")[0][0] === null ) {  ygScale = svg.append("g").attr("class", "y axis")   }
		
		var exit = paths.exit().remove()
		//Set up scales
		xScale = d3.time.scale().domain(d3.extent(years, function(d) { return dateFormat.parse(d)}))
		yScale = d3.scale.linear().domain([ d3.max(data, function(d) { return d3.max(d.years, function(d) {return +d.amount; });}),0 ]);

		xAxis = d3.svg.axis().orient("bottom").ticks(15).tickFormat(function(d) { return dateFormat(d); });
		yAxis = d3.svg.axis().orient("left").tickFormat(function(d) { return d + "%" } ); 

		line = d3.svg.line()
			.x(function(d) { return xScale(dateFormat.parse(d.year));})
			.y(function(d) {return yScale(+d.amount);
		});
	}

	function redraw() {
			//console.log("inside redraw")
			var linechart = canvasSize(".lineChart")
			var margin = {top:20,right:0,bottom:30,left:50}
			var w = linechart[0] - margin.left - margin.right;
			var h = linechart[1] - margin.top - margin.bottom;	
			//Create main SVG
			svg.attr("width", w + margin.left + margin.right).attr("height", h + margin.top + margin.bottom)
			//Update Scales
			xScale.range([margin.left, w])
			yScale.range([ margin.top, h ])	
			//Update Axis's
			xAxis.scale(xScale)//.orient("bottom").ticks(15).tickFormat(function(d) { return dateFormat(d); });
			yAxis.scale(yScale)//.orient("left").tickFormat(function(d) { return d + "%" } );   
			//below demo's both ways to use translate, one that includes anonymous function
			d3.select('.x.axis').attr("transform", function() {  return "translate(0," + (h) + ")"  } ).call(xAxis);
			d3.select('.y.axis').attr("transform", "translate(" + margin.left + ",0)")//.call(yAxis)
			svg.select(".y.axis").transition().duration(1500).call(yAxis).ease("sin-in-out");
			//Transitions filtered lines after filter used and when cleared
			paths.style("stroke", function(d,i) {  return d.color})
			.transition().duration(1500).attr("d", function(d) { return line(d.years)} )
			.style("stroke-width", 2)
				//.select("title").text(function(d) {return d.location})
	}

				//svg.select(".x.axis").transition().duration(2000).ease("sin-in-out").call(yAxis);
			//data is an array that contains the objects as follows: 
			//location: "Australia"
			//region: "Oceana"
			//years [[{amount:"6.2", year:"2002"},{amount:"6.1", year:"2003"}]]

					// .attr("class", function(d) {
				// 		switch (d.region) {
				// 			case "Oceana": return "line Oceana"
				// 			case "Europe": return "line Europe"
				// 			case "North America": return "line NA"
				// 			case "Asia": return "line Asia"
				// 			case "Middle East": return "line ME"
				// 			case "Latin America": return "line LA"
				// 			default: return "line"
				// 		}							
				// })
				//paths.exit().transition().duration(500).attr("fill-opacity",0).remove()
				// svg.append("g").attr("class", "x axis")
				// svg.append("g").attr("class", "y axis")

								//Axes

				// svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (h - padding[2]) + ")").call(xAxis);
				// svg.append("g").attr("class", "y axis").attr("transform", "translate(" + (padding[3]) + ",0)").call(yAxis)
    //             // Add rotated "Number of years" unit of measure text to x-axis
    //           .append("text")
    //           .attr("class", "label")
    //           .attr("transform", "rotate(-90)")
    //           .attr("x", -20)
    //           .attr("y", 5)
    //           .attr("dy", ".91em")
    //           .style("text-anchor", "end")
    //           .text("Percent of Engery Generation ");
