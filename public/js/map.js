let map;
let markers = [];
let beaches = [];
// let beaches = [
//   ['上海灘茶餐廳', 25.0404831, 121.5503003, 2],
//   ['波記茶餐廳', 25.0404831, 121.5503003, 1]
// ];

// var beaches = [
//   ['Bondi Beach', 10, 10, 4],
//   ['Coogee Beach', 10, 11, 5],
//   ['Cronulla Beach', 10, 12, 3],
//   ['Manly Beach', 10, 13, 2],
//   ['Maroubra Beach', 10, 14, 1]
// ];

function initMap() {
  var uluru = {lat: 25.033, lng: 121.543};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });

  // setMarkers(beaches);
}

// function addMarker() {
//   var myLatlng = new google.maps.LatLng(25.032802,121.549780);
//   var mapOptions = {
//     zoom: 14,
//     center: myLatlng
//   }
//   var map = new google.maps.Map(document.getElementById("map"), mapOptions);

//   var marker = new google.maps.Marker({
//       position: myLatlng,
//       title:"Hello World!"
//   });

//   // To add the marker to the map, call setMap();
//   marker.setMap(map);
// }

function searchFood() {
  // console.log('click');
  let food = document.querySelector("#search-food-text").value;
  console.log('food:', food);
  axios
    .post(
      "/api/1.0/map/review",
      {
        food: food
      }
    )
    .then(res=> {
      // console.log(res.data);
      // console.log(res.data.data);
      // showReviews(res.data.data);
      // addMarkersByReviews(res.data.data);
      addMarkersToMap(res.data.data);
      // reloadMarkers();
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showReviews(data) {
  console.log('In show review');
  console.log(data);

  let reviewContainer = document.querySelector("#review-container");

  for (let i = 0; i < data.length; i ++) {
    var oneReview = document.createElement("div");
    oneReview.setAttribute("class","review-list");
    var oneReviewText = document.createTextNode(`ID: ${data[i].place_id}, 餐廳: ${data[i].place_name}, 經緯度: (${data[i].place_lat}, ${data[i].place_lng}),  match數: ${data[i].review_count}`);
    oneReview.appendChild(oneReviewText);
    reviewContainer.appendChild(oneReview);
  }  
}

function addMarkersByReviews(data){
  let locations = [];
  let locationsLatSum = 0.0;
  let locationsLngSum = 0.0;
  let locationsLatAvg = 0.0;
  let locationsLngAvg = 0.0;
  
  for (let i = 0; i < data.length; i ++) {
    var curLoc = [];
    curLoc.push(data[i].place_name);
    curLoc.push(data[i].place_lat);
    locationsLatSum += Number(data[i].place_lat);
    curLoc.push(data[i].place_lng);
    locationsLngSum += Number(data[i].place_lng);
    curLoc.push(data[i].review_count);
    locations.push(curLoc);
  }
  console.log(locationsLatSum, locationsLngSum);
  
  // map center {lat, lng}
  locationsLatAvg = locationsLatSum / data.length;
  locationsLngAvg = locationsLngSum / data.length;
  console.log(locationsLatAvg, locationsLngAvg);

  // var locations = [
  //   ['Bondi Beach', -33.890542, 151.274856, 4],
  //   ['Coogee Beach', -33.923036, 151.259052, 5],
  //   ['Cronulla Beach', -34.028249, 151.157507, 3],
  //   ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
  //   ['Maroubra Beach', -33.950198, 151.259302, 1]
  // ];

  // var uluru = {lat: 25.033, lng: 121.543};
  // var map = new google.maps.Map(document.getElementById('map'), {
  //   zoom: 13,
  //   center: uluru
  // });

  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  for (i = 0; i < locations.length; i++) { 
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
      zIndex: locations[3]
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        // infowindow.setContent(`${locations[i][0]}(${locations[i][3]})`);
        // infowindow.open(map, marker);
      }
    })(marker, i));
    // marker.setMap(map);
  }

  // move map center
  // map.center = `{lat:${locationsLatAvg}, lng:${locationsLngAvg}}`;
  // map.center = google.maps.LatLng(locationsLatAvg, locationsLngAvg);
}

function addMarkersToMap(data) {
  // let locations = [];
  for (let i = 0; i < data.length; i ++) {
    var curLoc = [];
    curLoc.push(data[i].place_name);
    curLoc.push(data[i].place_lat);
    curLoc.push(data[i].place_lng);
    curLoc.push(data[i].review_count);
    // locations.push(curLoc);
    beaches.push(curLoc);
  }
  // beaches = locations;
  // console.log('locations:');
  // console.log(locations);
  console.log('beaches:')
  console.log(beaches);

  console.log('To reload');
  reloadMarkers();
  console.log('To set markers');
}

function setMarkers(locations) {

  for (var i = 0; i < locations.length; i++) {
      // beach = locations[i];
      var beach = locations[i];
      var myLatLng = new google.maps.LatLng(beach[1], beach[2]);
      var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          animation: google.maps.Animation.DROP,
          title: beach[0],
          zIndex: beach[3]
      });

      // Push marker to markers array
      markers.push(marker);
  }
}

function reloadMarkers() {

  // Loop through markers and set map to null for each
  for (var i=0; i<markers.length; i++) {

      markers[i].setMap(null);
  }

  // Reset the markers array
  markers = [];

  // Call set markers to re-add markers
  setMarkers(beaches);
}

//////////////////////////////////////////////////////////////////////////////
// to complete
function searchFoodContents() {
  // console.log('click');
  let food = document.querySelector("#search-food-text").value;
  console.log('food:', food);
  axios
    .post(
      "/api/1.0/map/review_content",
      {
        food: food
      }
    )
    .then(res=> {
      // console.log(res.data);
      // console.log(res.data.data);
      showReviews(res.data.data);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}