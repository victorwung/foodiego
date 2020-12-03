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
      showReviews(res.data.data);
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
    var oneReviewText = document.createTextNode(`ID: ${data[i].place_id}, 餐廳: ${data[i].place_name}, match數: ${data[i].review_count}`);
    oneReview.appendChild(oneReviewText);
    reviewContainer.appendChild(oneReview);
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