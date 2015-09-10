myApp.controller('ChartController', function($scope, $http) {

	d3.csv('data/data_regions.csv', function(data) {
		//$scope.data = data;

		var colorScale = d3.scale.category10()

    var region = d3.set(data.map(function(d) { return d.Region } ) )
				.values().filter(function(d) { return !(d == "World")}).sort(d3.acscending) 

    colorScale.domain(region)

		$scope.ssdata = data.map(function(d) { 
			return {
				Location: d.Location,
				Region: d.Region,
				2002: d[2002],
				2012: d[2012],
				color: colorScale(d.Region)
			}
		})

		$scope.ssdata.sort
		console.log($scope.ssdata)
		$scope.lgdata = data
		$scope.$apply();
		//console.log(ssData)
		//console.log($scope.ssdata)

			// var $scope.stringify = JSON.stringify($scope.ssdata)

	 })
	// $http.get('data/data_regions.csv').then(function(response) {
	// 	$scope.data = response.data
	// }, function(err) { 
	// 	throw err; 
	// })

	$scope.choice = function(index) { 
		$scope.query=$scope.ssdata[index].Location
	}


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
