// function escapeRegExp(string){
//     return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
// 	}

 myApp.filter('myfilter', function() {

   function strStartsWith(str, prefix) {
   	//console.log((str+"").indexOf(prefix))
    return (str+"").indexOf(prefix) === 0;
   }
   return function( items, query) {

   	if(!query) { return items }

    var filtered = [];

    angular.forEach(items, function(item) {
    	//console.log(item.Location)
      if(strStartsWith(item.Location.toLowerCase(), query.toLowerCase())){
        filtered.push(item);
      }
    });
    //console.log(filtered)
    return filtered;
  };
});

myApp.controller('ChartController', function($scope, $http) {

	d3.csv('data/data_regions.csv', function(data) {
		//$scope.data = data;

		var colorScale = d3.scale.category10();

    var region = d3.set(data.map(function(d) { return d.Region } ) )
				.values().filter(function(d) { return !(d == "World")}).sort(d3.acscending) 

    colorScale.domain(region)
    console.log(data)

    $scope.newdata = data

		$scope.ssdata = data.map(function(d) { 
			var c = colorScale(d.Region)
			return {
				Location: d.Location,
				Region: d.Region,
				2002: d[2002],
				2012: d[2012],
				color: colorScale(d.Region)
			}
		})//$scope.ssdata

		$scope.ssdata.sort
		//console.log($scope.ssdata)
		$scope.lgdata = data
		//because d3.csv is being used to retrieve the data $scope.$apply is needed
		$scope.$apply();
		//console.log(ssData)
		//console.log($scope.ssdata)

			// var $scope.stringify = JSON.stringify($scope.ssdata)

	 })//d3.csv
	// $http.get('data/data_regions.csv').then(function(response) {
	// 	$scope.data = response.data
	// }, function(err) { 
	// 	throw err; 
	// })

	$scope.choice = function(country) { 
		console.log(country)
		// if($scope.filtered.length == 1 && index == 0) { return }
		// $scope.query=$scope.ssdata[index].Location
		$scope.query = country.Location
		dashboard(country)
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
