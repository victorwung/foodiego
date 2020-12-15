let map;
let markers = [];
let beaches = [];
let citymap = {
  chicago: {
    center: { lat: 41.878, lng: -87.629 },
    population: 2714856,
  },
};

// const citymap = {
//   chicago: {
//     center: { lat: 41.878, lng: -87.629 },
//     population: 2714856,
//   },
//   newyork: {
//     center: { lat: 40.714, lng: -74.005 },
//     population: 8405837,
//   },
//   losangeles: {
//     center: { lat: 34.052, lng: -118.243 },
//     population: 3857799,
//   },
//   vancouver: {
//     center: { lat: 49.25, lng: -123.1 },
//     population: 603502,
//   },
// };

function initMap() {
  var uluru = {lat: 25.033, lng: 121.543};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: uluru
  });
}

function searchFood() {
  let food = document.querySelector("#search-food-text").value;
  console.log('Search Food:', food);
  axios.post("/api/1.0/map/review",{food: food})
    .then(res=> {
      // addMarkersToMap(res.data.data);
      addCirclesToMap(res.data.total, res.data.data);
      showReviewsList(res.data.data);
      drawPlaceNumber(res.data.data.length);
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

function addCirclesToMap(total_match_count, data) {
  // let citymap = {};
  console.log('Clear circles with reload map!');
  citymap = {};
  initMap();

  console.log('Draw circles!');

  for (let i = 0; i < data.length; i ++) {
    var place = data[i].place_id;
    citymap[place] = {
      'name':data[i].place_name,
      'center':{
        'lat':Number(data[i].place_lat),
        'lng':Number(data[i].place_lng)
      },
      'match_count':data[i].match_count,
      'total_count':data[i].total_count
    };
  }
  console.log(citymap);

  const infowindow = new google.maps.InfoWindow();

  for (const city in citymap) {
    // Add the circle for this city to the map.
    const cityCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: citymap[city].center,
      // radius:  Math.sqrt(citymap[city].match_count) * 20
      radius:  Math.sqrt(citymap[city].match_count/total_match_count ) * 300
      // radius: Math.sqrt(citymap[city].population) * 100,
    });

    google.maps.event.addListener(cityCircle, 'click', function(ev){
      infowindow.setPosition(cityCircle.getCenter());
      infowindow.setContent(`${citymap[city].name} (${citymap[city].match_count})`);
      // infowindow.setContent(city);
      infowindow.setOptions({maxWidth: 200});
      infowindow.open(map);
    });
  }
}

function showReviewsList(data) {
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
      getReviewContents(data[i].place_id);
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
    // var placeTags = document.createElement("p");
    var placeAddr = document.createElement("small");
    placeAddr.innerHTML = data[i].place_addr;
    placeSection3.append(placeAddr);
    placeA.append(placeSection3);
    // placeA.append(placeAddr);

    // section 4
    var placeSection4 = document.createElement("div");
    placeSection4.setAttribute("class","mb-1 place-tags");
    // var placeTags = document.createElement("p");
    var placeTags = document.createElement("small");
    var tags = data[i].place_tags;
    var tagStr = '';
    for (let i = 0; i < 5; i ++) {
      var tag = tags[i];
      if (tag) {
        tagStr = tagStr +`#${tag} `;
      } else {
        break;
      }
    }
    placeTags.innerHTML = tagStr;
    // placeTags.innerHTML = "#TAG1(65) #TAG2(50) #TAG3(20)";
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
    // title: data.place_name,
    height: 300,
    width: 280
  };
  
  Plotly.newPlot('pie', ratingData, layout);
}

function getReviewContents(place_id) {
  axios.post("/api/1.0/review/contents",{place: place_id})
    .then(res=> {
      console.log(res.data.data);
      showReviewContentList(res.data.data);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showReviewContentList(data) {
  let reviewContainer = document.querySelector("#review-content-container");
  let reviewList = document.querySelector("#place-review-content-list-group");
  // remove all childs
  reviewList.innerHTML = '';

  for (let i = 0; i < data.length; i ++) {
    var placeA = document.createElement("div");
    placeA.setAttribute("class","list-group-item list-group-item-action");
    // placeA.addEventListener("click", () => {
    //   getRatingDistribution(data[i].place_id);
    // });

    // section 1
    var placeSection1 = document.createElement("div");
    placeSection1.setAttribute("class","d-flex w-100 justify-content-between");
    var placeName = document.createElement("h6");
    placeName.setAttribute("class","mb-1 user-name");
    placeName.innerHTML = data[i].user_name;
    placeSection1.append(placeName);
    var matchCount = document.createElement("h6");
    matchCount.setAttribute("class","rel-date");
    matchCount.innerHTML = data[i].rel_date;
    // matchCount.innerHTML = data[i].review_count;
    placeSection1.append(matchCount);
    placeA.append(placeSection1);

    // section 2
    var placeSection2 = document.createElement("div");
    placeSection2.setAttribute("class","d-flex w-100");
    var placeRating = document.createElement("h6");
    placeRating.setAttribute("class","mb-1 content-rating");
    placeRating.innerHTML = data[i].rating;
    placeSection2.append(placeRating);
    // var totalReviewCount = document.createElement("h6");
    // totalReviewCount.setAttribute("class","total-review-count");
    // totalReviewCount.innerHTML = `(${data[i].total_count})`; // test
    // placeSection2.append(totalReviewCount);
    placeA.append(placeSection2);

    // section 3
    var placeSection3 = document.createElement("div");
    placeSection3.setAttribute("class","mb-1 review-content");
    var placeAddr = document.createElement("p");
    placeAddr.innerHTML = data[i].review_content;
    placeSection3.append(placeAddr);
    placeA.append(placeSection3);
    // placeA.append(placeAddr);

    // one place
    reviewList.append(placeA);
    // total place list
    reviewContainer.append(reviewList);
  }
}