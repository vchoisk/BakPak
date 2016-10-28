angular.module('restaurantsModule', [])

.controller('restaurantsCtrl', function($scope, $http, $window, information){
	 var restaurantMarker = (results) => {
    for (var i = 0; i < results.length; i++) {
      var coords = results[i].location.coordinate;
      var latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
      var marker = new google.maps.Marker({
      	position: latLng,
      	map:$window.map,
      	url: results[i].url,
      	name: results[i].name,
      	rating: results[i].rating,
      	review_count: results[i].review_count
      })

      var infowindow = new google.maps.InfoWindow();
	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent('<a href="' + marker.url + '">' + marker.name + '</a><br/> <i class="material-icons stars">star star star star</i>  <br> Review Count: ' + marker.review_count );
          infowindow.open(map, marker);
        }
      information.markers.push(marker);
      })(marker, i));
    }
  }
	$scope.yelpApi = function() {
    if ("geolocation" in navigator) {
    	console.log('geolocation invoked')
      navigator.geolocation.getCurrentPosition(function (position) {
	      $scope.lat = position.coords.latitude;
	      $scope.lon = position.coords.longitude;
	      var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en';

	      $.getJSON(GEOCODING).done(function(location) {
	      	console.log('geoloc working')
	        $scope.location = location.results[0].address_components[3].long_name;
	        var reqData = {location: $scope.location,
	                       lat: $scope.lat, 
	                       long: $scope.long, 
	                       category:'food'};
	        $http.post('/yelp',reqData).then(function(data) {
	        	console.log('yelp working')
	          $scope.restaurants = data.data.businesses;
	          restaurantMarker(data.data.businesses);
	          console.log('here is the restaurants ', $scope.restaurants);
	        })
	      })
      });
    } else {
      console.log("not available");
    }
  }
  $scope.yelpApi();
})