d3.models = {};

d3.models.legend = function () {

	var fontSize = 15;
	var width = 650;
	var height = 400;
	var legendValues;
	var position = "vertical";

	var dispatch = d3.dispatch("mouseOver", "mouseOut","onClick");

	function render(selection) {
		//console.log(selection)
		selection.each(function(_data) { 
			console.log(selection)
			if(position === "vertical") { 
	        //D3 Vertical Legend//////////////////////////
	        var legend = selection.selectAll("legend").data(legendValues).enter().append("g")
							.attr("class", "legend")
	            .attr("transform", function (d, i) {
		            { return "translate(0," + i * 20 + ")" }
	        		})
	        
	        legend.append('rect')
	            .attr("x", 0)
	            .attr("y", 0)
	            .attr("width", 10)
	            .attr("height", 10)
	            .style("fill", function(d,i) { return d.color })
	        
	        legend.append('text')
	            .attr("x", 20)
	            .attr("y", 10)
	        //.attr("dy", ".35em")
	       		 .text(function (d, i) {  return d.text;  })
	            .attr("class", "textselected")
	            .style("text-anchor", "start")
	            .style("font-size", 15)

				// var legend = selection.selectAll("legend").data(legendValues).enter().append("g")
				// 	.attr("class", "legend")

				// legend.attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"})
				// 	 legend.append('rect')
				//  		.attr({ x:width+5, y:5, width: 10, height: 10 })
	   //        .style("fill", function (d, i) { return d.color;})

	   //     legend.append('text')
	   //      	.attr({ x: width+25, y: 15})
			 //  		.text(function (d, i) { return d.text})
			 //      .attr("class", "textselected")
			 //      .style("text-anchor", "start")
			 //      .style("font-size", fontSize)
			 //      // .on("mouseover",dispatch.mouseOver)
			 //      // .on("mouseout", dispatch.mouseOut)
			} else {   

				var legend = selection.selectAll("legend").data(legendValues).enter().append('div')
	        .attr("class", "legend")

	      legend
	        .html(function(d,i) {return d.text})
	        .style("color", function(d,i) {return d.color })
	        .style("display","inline-block")
	        .style("padding","0px 5px")
	        .style("margin",".2em")
	        .on("mouseover",dispatch.mouseOver)
	        .on("mouseout", dispatch.mouseOut)
	        .on("click", dispatch.onClick)

	      // legend.append('rect')
	      //   .attr("x", 120)
	      //   .attr("y", height - 150)
	      //   .attr("width", 10)
	      //   .attr("height", 10)
	      //   .attr("class","rect enabled")
	      //   .style("fill", function(d,i) { return d.color} )
	      //   .style("stroke",function(d,i) { return d.color } )

	        // .on("click", function(d) {
	        //   //var legendChoice = d;
	        //   var rect = d3.select(this); 
	        //   var enabled = true;
	        //   if(rect.attr("class") !== "disabled") {
	        //       rect.attr('class','disabled')
	        //     RemoveLegendChoice(d,false)
	        //   } else { rect.attr("class","enabled") 
	        //     AddLegendChoice(d,true)
	        //     }
	        // })

	      // legend.append('text')
	      //   .attr("x", 110)
	      //   .attr("y", height - 145)
	      //   .attr("dy", ".35em")
	      //   .text(function(d,i) { return d.text})
	      //   .attr("class","textselected")
	      //   .style("text-anchor", "end")
	      //   .style("font-size", 13)
			  }//else
		})//_selection.each()
	}//render()

	render.fontSize = function(_x) {
		if (!arguments.length) return fontSize;
		fontSize = _x;
		return this;
	}
	render.width = function(_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	}
	render.height = function(_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	}
	render.inputScale = function(_x) {
     if (!arguments.length) return inputScale;
        scale = _x;
        legendValues = [];
       	scale.domain().forEach(function (el) {
        var cellObject = {color: scale(el), text: el} 
        legendValues.push(cellObject)
        //console.log(legendValues)
    	})
		return this;
  }
  render.position = function(_x) {
  	if(!arguments.length) return position;
  	position = _x;
  	return this;
  }

	d3.rebind(render, dispatch, "on")
	return render
}
