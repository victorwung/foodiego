let map;
let markers = [];
let circles = [];
let beaches = [];
// let beaches = [
//   ['上海灘茶餐廳', 25.0404831, 121.5503003, 2],
//   ['波記茶餐廳', 25.0404831, 121.5503003, 1]
// ];

function initMap() {
  var uluru = {lat: 25.033, lng: 121.543};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });

  // setMarkers(beaches);
}

function searchFood() {
  // console.log('click');
  let food = document.querySelector("#search-food-text").value;
  console.log('food:', food);
  axios.post("/api/1.0/map/review",{food: food})
    .then(res=> {
      // console.log(res.data);
      // console.log(res.data.data);
      addMarkersToMap(res.data.data);
      showReviewsList(res.data.data);
      drawPlaceNumber(res.data.data.length);
      // reloadMarkers();
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

// function showReviews(data) {
//   console.log('In show review');
//   console.log(data);

//   let reviewContainer = document.querySelector("#review-container");
//   // remove all childs
//   reviewContainer.innerHTML = '';

//   for (let i = 0; i < data.length; i ++) {
//     var oneReview = document.createElement("div");
//     oneReview.setAttribute("class","review-list");
//     // var oneReviewText = document.createTextNode(`ID: ${data[i].place_id}, 餐廳: ${data[i].place_name}, 經緯度: (${data[i].place_lat}, ${data[i].place_lng}),  match數: ${data[i].review_count}`);
//     var oneReviewText = document.createTextNode(`餐廳: ${data[i].place_name}, match數: ${data[i].review_count}`);
//     oneReview.appendChild(oneReviewText);
//     reviewContainer.appendChild(oneReview);
//   }  
// }

function addMarkersToMap(data) {
  // let locations = [];
  for (let i = 0; i < data.length; i ++) {
    var curLoc = [];
    curLoc.push(data[i].place_name);
    curLoc.push(data[i].place_lat);
    curLoc.push(data[i].place_lng);
    curLoc.push(data[i].match_count);
    // curLoc.push(data[i].review_count);
    curLoc.push(data[i].total_count);
    curLoc.push(i+1); // marker order
    // locations.push(curLoc);
    beaches.push(curLoc);
  }
  // beaches = locations;
  console.log('beaches')
  console.log(beaches);

  console.log('To reload');
  reloadMarkers();

  // beaches=[]; // clear

  console.log('Try add circle');
  // addCircle();
  // reloadCircles();
}

function setMarkers(locations) {
  var infowindow = new google.maps.InfoWindow();

  for (var i = 0; i < beaches.length; i++) {
      // beach = locations[i];
      var loc = locations[i]; // get each location
      var myLatLng = new google.maps.LatLng(loc[1], loc[2]);
      var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          animation: google.maps.Animation.DROP,
          title: loc[0],
          zIndex: loc[4]
      });
      // var marker = new google.maps.Circle({
      //   center: myLatLng,
      //   fillColor: "red",
      //   fillOpacity: 0.4,
      //   radius: 500,
      //   // scale: Math.pow(2, magnitude) / 2,
      //   strokeColor: "white",
      //   strokeWeight: 0.5
      // });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(`${locations[i][0]} (${locations[i][3]})`);
          infowindow.setOptions({maxWidth: 200});
          infowindow.open(map, marker);
        }
      }) (marker, i));

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

function addCircle() {
  // var myCity = new google.maps.Circle({
  //   center:{lat: 25.033, lng: 121.543},
  //   radius:1000,
  //   strokeColor:"#0000FF",
  //   strokeOpacity:0.8,
  //   strokeWeight:2,
  //   fillColor:"#0000FF",
  //   fillOpacity:0.4
  // });
  
  var place = new google.maps.Circle({
    center:{lat: 25.033, lng: 121.543},
    fillColor: "red",
    fillOpacity: 0.4,
    radius: 500,
    // scale: Math.pow(2, magnitude) / 2,
    strokeColor: "white",
    strokeWeight: 0.5
  });

  // google.maps.event.addListener(place, 'click', (function(place, i) {
  //   return function() {
  //     infowindow.setContent('餐廳');
  //     infowindow.setOptions({maxWidth: 200});
  //     infowindow.open(map,place);
  //   }
  // }) (place, i));
  
  place.setMap(map);
  console.log('set map with circle');
}

function showReviewsList(data) {
  // console.log('In show review');
  // console.log(data);

  let reviewContainer = document.querySelector("#review-container");
  let placeList = document.querySelector("#place-list-group");
  // remove all childs
  placeList.innerHTML = '';

  for (let i = 0; i < data.length; i ++) {
    var placeA = document.createElement("div");
    // placeA.setAttribute("href", "#");
    // placeA.setAttribute("href", `./bmap.html?place=${data[i].place_id}`);
    placeA.setAttribute("class","list-group-item list-group-item-action");
    placeA.addEventListener("click", () => {
      getRatingDistribution(data[i].place_id);
    });

    // section 1
    var placeSection1 = document.createElement("div");
    placeSection1.setAttribute("class","d-flex w-100 justify-content-between");
    var placeName = document.createElement("h6");
    placeName.setAttribute("class","mb-1 place-name");
    placeName.innerHTML = data[i].place_name;
    placeSection1.append(placeName);
    var matchCount = document.createElement("h6");
    matchCount.setAttribute("class","match-count");
    matchCount.innerHTML = data[i].match_count;
    // matchCount.innerHTML = data[i].review_count;
    placeSection1.append(matchCount);
    placeA.append(placeSection1);

    // section 2
    var placeSection2 = document.createElement("div");
    placeSection2.setAttribute("class","d-flex w-100");
    var placeRating = document.createElement("h6");
    placeRating.setAttribute("class","mb-1 place-rating");
    placeRating.innerHTML = data[i].place_rating;
    placeSection2.append(placeRating);
    var totalReviewCount = document.createElement("h6");
    totalReviewCount.setAttribute("class","total-review-count");
    totalReviewCount.innerHTML = `(${data[i].total_count})`; // test
    placeSection2.append(totalReviewCount);
    placeA.append(placeSection2);

    // section 3
    var placeSection3 = document.createElement("div");
    placeSection3.setAttribute("class","mb-1 place-addr");
    var placeAddr = document.createElement("p");
    placeAddr.innerHTML = data[i].place_addr;
    placeSection3.append(placeAddr);
    placeA.append(placeSection3);
    // placeA.append(placeAddr);

    // section 4
    var placeSection4 = document.createElement("div");
    placeSection4.setAttribute("class","mb-1 place-tags");
    var placeTags = document.createElement("p");
    placeTags.innerHTML = "#TAG1(65) #TAG2(50) #TAG3(20)";
    placeSection4.append(placeTags);
    placeA.append(placeSection4);
    // placeA.append(placeTags);

    // one place
    placeList.append(placeA);
    // total place list
    reviewContainer.append(placeList);
  }
}

function drawPlaceNumber(data_length) {
  let placeNumber = document.getElementById("place-number");
  placeNumber.textContent = `餐廳數: ${data_length}`;
}

function getRatingDistribution(place_id) {
  let food = document.querySelector("#search-food-text").value;

  axios.post("/api/1.0/map/review/analysis_rating",{place: place_id, food: food})
    .then(res=> {
      console.log(res.data);
      // console.log(res.data.data[0]);
      drawRatingDistribution(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function drawRatingDistribution(data) {
  var colorList = ['#2A9D8F', '#E9C46A', '#F4A261'];
  var ratingData = [{
    values: [data.positvie_cnt, data.neutral_cnt, data.negative_cnt],
    labels: ['好評', '普通', '負評'],
    marker: {
      colors: colorList
    },
    type: 'pie'
  }];
  
  var layout = {
    title: data.place_name,
    height: 400,
    width: 450
  };
  
  Plotly.newPlot('pie', ratingData, layout);
}