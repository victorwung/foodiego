function initMap() {
  var uluru = {lat: 25.033, lng: 121.543};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: {lat: 25.031624, lng: 121.544567},
    map: map,
    draggable: false
  });
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
      addMarkersByReviews(res.data.data);
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
  for (let i = 0; i < data.length; i ++) {
    var curLoc = [];
    curLoc.push(data[i].place_name);
    curLoc.push(data[i].place_lat);
    curLoc.push(data[i].place_lng);
    curLoc.push(data[i].review_count);
    locations.push(curLoc);
  }
  console.log(locations);

  // var locations = [
  //   ['Bondi Beach', -33.890542, 151.274856, 4],
  //   ['Coogee Beach', -33.923036, 151.259052, 5],
  //   ['Cronulla Beach', -34.028249, 151.157507, 3],
  //   ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
  //   ['Maroubra Beach', -33.950198, 151.259302, 1]
  // ];

  var uluru = {lat: 25.033, lng: 121.543};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  });

  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  for (i = 0; i < locations.length; i++) { 
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(`${locations[i][0]}(${locations[i][3]})`);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
}

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