// function escapeRegExp(string){
//     return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
// 	}

 myApp.filter('myfilter', function() {
   function strStartsWith(str, prefix) {
   	//console.log((str+"").indexOf(prefix))
    return (str+"").indexOf(prefix) === 0;
   }
   return function( items, query) {
   	//console.log(items)
   	if(!query) { return items }
    var filtered = [];
    angular.forEach(items, function(item) {
    	//console.log(item.Location)
      if(strStartsWith(item.location.toLowerCase(), query.toLowerCase())){
        filtered.push(item);
      }
    });
    //console.log(filtered)
    return filtered;
  };
});

myApp.controller('ChartController', function($scope, $http) {

	$scope.updown = 0;//WHAT DOES THIS DO?
	$scope.percentage = function(value) {
		if(value != null) {
		var year2002 = d3.format('.2f')(value.years[0].amount )
		var year2012 = d3.format('.2f')( value.years[10].amount ) 
		var change = d3.format('.0f')((year2012 - year2002)/year2002 * 100)
		if(change < 0) { 
			$scope.updown = "down"
			return change}
		else { 
			$scope.updown = "up"
			return change }
		console.log(change)
		return "up"
		}
	}

	//$scope.percentage = (($scope.filtered/ $scope.totalQuestions) * 100).toFixed(2);

	d3.csv('data/data_regions.csv', function(data) {
		//$scope.data = data;
    // var region = d3.set(data.map(function(d) { return d.Region } ) )
				// .values().filter(function(d) { return !(d == "World")}).sort(d3.acscending) 
	
    //colorScale.domain(region)
   
    dateFormat = d3.time.format("%Y");   
			//console.log(data)
			//years are filtered out to be used later when creating new dataset
			years = d3.keys(data[0]).filter( function(key) { return key != "Location" && key != "Region" } ) 
			regions = d3.nest().key(function(d) { return d["Region"]}).sortKeys(d3.ascending).entries(data)
      regions = regions.filter(function(d) { return !(d.key == "World")})
      //[{color:"#12b3ae",key:"Africa",values:[{Location:"South Africa",2002:"12.1",2003:"13.1"}]}]
      //array containing only region names
  	 	var region = d3.set(data.map(function(d) {return d.Region } ) )
			.values().filter(function(d) { return !(d == "World")}).sort(d3.acscending) 
			colorScale = d3.scale.category10().domain(region);
			// function colorize (regions) {
			// 	regions.forEach( function(d,i) {
			// 		d.color = colorScale(d.key);
			// 	})
			// }
			colorScale.domain(region)
			//colorize(regions) 
			//Create a new, empty array to hold our restructured dataset
			dataset = [];
				//data is an array that contains the objects as follows: 
				//location: "Australia"
				//region: "Oceana"
				//years [[{amount:"6.2", year:"2002"},{amount:"6.1", year:"2003"}]]
			//Loop once for each row in data
			for (var i = 0; i < data.length; i++) {
				//Create new object with Location name and empty array
				dataset[i] = { location: data[i].Location, region: data[i].Region, years: [], color: colorScale(data[i].Region) };
				//Loop through all the years
				for (var j = 0; j < years.length; j++) {
					// If value is not empty then placeholder is created
					if (data[i][years[j]]) { dataset[i].years.push({ year: years[j], amount: data[i][years[j]] }); }
				}
			} 
		//because d3.csv is being used to retrieve the data $scope.$apply is needed
		$scope.data_regions = dataset
		$scope.$apply();
			// var $scope.stringify = JSON.stringify($scope.ssdata)
	 })//d3.csv
	// $http.get('data/data_regions.csv').then(function(response) {
	// 	$scope.data = response.data
	// }, function(err) { 
	// 	throw err; 
	// })
	
	$scope.$watch('filtered', function(newValue, oldValue) {
			if (newValue !== oldValue) {dashboard(newValue) }
		$scope.filtered = newValue
	console.log($scope.filtered)
	  },true)

	$scope.elmStyle;

	$scope.choice = function(country) { 
		// if($scope.filtered.length == 1 && index == 0) { return }
		// $scope.query=$scope.ssdata[index].Location
		$scope.query = country.location
		dashboard([country])
	}
	$scope.amount2002 = function(country) {
		//console.log(country)
		if( country.years[0]["year"] === "2002" ) { return country.years[0]["amount"] }
	}
	$scope.amount2012 = function(country) {
		if( country.years[10]["year"] === "2012" ) { return country.years[10]["amount"] }
	}
	$scope.color = function(country) {
		function convertHex(hex,opacity){
	    hex = hex.replace('#','');
	    r = parseInt(hex.substring(0,2), 16);g = parseInt(hex.substring(2,4), 16);b = parseInt(hex.substring(4,6), 16);
	    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
	    return result;
		}
	$scope.elmStyle = { 'background': convertHex(country.color,40) } 
	}

	// $scope.filterBySearch = function(country) {
	// 	console.log($scope.query)
 //    if (!$scope.query) return true;
 //    var regex = new RegExp('\\b' + escapeRegExp($scope.query), 'i');
 //    return regex.test(country);
	// };


});

myApp.controller('MainCtrl', function($scope, $http, $interval){
	// d3.json("donut-data-api.json", function(d) { console.log(d)})
  $interval(function(){
    $http.get('donut-data-api.json').then(function(response){
      // your API would presumably be sending new data, not the same
      // data each time!
      var data = response.data.map(function(d){ return d * ( 1 - Math.random() / 10) });
      $scope.donutData = data;
    }, function(err){
      throw err;
    });
  }, 1000);
});
