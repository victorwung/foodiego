let map;
let markers = [];
let beaches = [];
let circles = [];
let citymap = {
  chicago: {
    center: { lat: 41.878, lng: -87.629 },
    population: 2714856,
  },
};

// USER SECTION START
const token = localStorage.getItem("token");

function checkToken() {
  if (token) {
    console.log("has token");
    getUserInfoName();
  }
  else {
    console.log("no token");
  }
}

function getUserInfoName(){
  axios.get("/api/1.0/user/profile",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + localStorage.getItem("token")
      }
    }
  )
  .then(res=> {
    // console.log(res.data.data);
    console.log('username:', res.data.data.userinfo.name);
    setUserName(res.data.data.userinfo.name);
  })
  .catch(err => {
    console.log(err, err.response);
  });
}

function setUserName(name){
  let welcome = document.querySelector("#welcome-user-slogan");
  welcome.innerHTML = `Welcome, ${name}!`;
}

checkToken();
// USER SECTION END

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
  var uluru = {lat: 25.041, lng: 121.550}; // 忠孝敦化
  // var uluru = {lat: 25.033, lng: 121.543};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: uluru
  });
}

// const searchBox = document.querySelector("#search-food-text");
// searchBox.addEventListener("keyup", function(event) {
//   if (event.keyCode === 13) {
//    event.preventDefault();
//    document.getElementById("search-food-btn").click();
//   }
// });

const outerFood = localStorage.getItem("food");
document.addEventListener("DOMContentLoaded", function(){
  // DOM Ready!
  checkOuterSearchFood();
});

function checkOuterSearchFood() {
  if (outerFood) {
    let foodbox = document.querySelector("#search-food-text");
    foodbox.value = outerFood;
    searchFood();
  } else {
    // pass
  }
}

function searchFood() {
  let food = document.querySelector("#search-food-text").value.replace(/\s+/g, ''); // remove blank space
  if (food === '') {
    console.log('No search food.');
    Swal.fire('Please try again!', 'Type anything food name in the search box.');
  } else {
    console.log('Search Food:', food);
    axios.post("/api/1.0/map/review",{food: food})
      .then(res=> {
        if(res.data.total === 0) {
          Swal.fire('Please try again!', 'Sorry. No related reviews about this food.').then((result) => {
            if (result.isConfirmed) {
              document.querySelector("#search-food-text").value = '';
            }
          })
        } else {
          addCirclesToMap(res.data.total, res.data.data);
          showReviewsList(food, res.data.data);
          setSearchResult(food, res.data.data.length, res.data.total);
        }
      })
      .catch(err => {
        console.log(err, err.response);
      });
  }
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
  circles = [];
  initMap();

  console.log('Draw circles!');

  for (let i = 0; i < data.length; i ++) {
    var place = data[i].place_id;
    citymap[place] = {
      'id': data[i].place_id,
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
      // add listeners to call all dashboard items
      getPlaceInfo(citymap[city].id); // place info
      getPlacePeopleBar(citymap[city].id); // bar chart
      getRatingDistribution(citymap[city].id); // pie chart
      getPlaceTags(citymap[city].id); // place tags
      getReviewContents(citymap[city].id); // review content
      getReviewFeatureBar(citymap[city].id); // review feature bar
    });
    circles.push(cityCircle);
  }
  // click top circle
  // google.maps.event.trigger(circles[0], 'click');
}

function showReviewsList(food, data) {
  let reviewContainer = document.querySelector("#review-container");
  let placeList = document.querySelector("#place-list-group");
  // remove all childs
  placeList.innerHTML = '';

  for (let i = 0; i < data.length; i ++) {
    var placeA = document.createElement("div");
    // placeA.setAttribute("href", "#");
    // placeA.setAttribute("href", `./bmap.html?place=${data[i].place_id}`);
    placeA.setAttribute("class","list-group-item list-group-item-action list-group-item-place");
    placeA.addEventListener("click", () => {
      getPlaceInfo(data[i].place_id); // place info
      getPlacePeopleBar(data[i].place_id); // bar chart
      getRatingDistribution(data[i].place_id); // pie chart
      getReviewContents(data[i].place_id); // review content
      getPlaceTags(data[i].place_id); // place tags
      getReviewFeatureBar(data[i].place_id); // review feature bar
      google.maps.event.trigger(circles[i], 'click'); // click circle on map
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

    // section 25
    var placeSection25 = document.createElement("div");
    placeSection25.setAttribute("class","d-flex w-100");
    var bothCount = document.createElement("small");
    bothCount.setAttribute("class","mb-1 new-both-count");
    bothCount.innerHTML = `${data[i].total_count} reviews, ${data[i].match_count} reviews mention ${food}`;
    placeSection25.append(bothCount);
    placeA.append(placeSection25);

    // // section 25
    // var placeSection25 = document.createElement("div");
    // placeSection25.setAttribute("class","d-flex w-100");
    // var totalCount = document.createElement("h8");
    // totalCount.setAttribute("class","mb-1 new-total-count");
    // totalCount.innerHTML = `${data[i].total_count} reviews, `;
    // placeSection25.append(totalCount);
    // var matchCount = document.createElement("h8");
    // matchCount.setAttribute("class","new-match-count");
    // matchCount.innerHTML = `${data[i].match_count} reviews mention 牛排`; // test
    // placeSection25.append(matchCount);
    // placeA.append(placeSection25);

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
  // default click the top mathch place
  let topPlace = document.getElementsByClassName("list-group-item-place")[0];
  topPlace.click();
}

function setSearchResult(food, place_cnt, review_cnt){
  let mapCardTitle = document.getElementById("card-map-title");
  mapCardTitle.textContent = `Foodie Map ( ${place_cnt} restaurants / ${review_cnt} reviews mention ${food})`;
  // mapCardTitle.textContent = `Foodie Map ( ${place_cnt} restaurants contain ${food} / ${review_cnt} reviews mentioned )`;

}

function drawPlaceNumber(data_length) {
  let placeNumber = document.getElementById("place-number");
  placeNumber.textContent = `餐廳數: ${data_length}`;
}

function getRatingDistribution(place_id) {
  let food = document.querySelector("#search-food-text").value.replace(/\s+/g, '');

  // axios.post("/api/1.0/map/review/analysis_rating",{place: place_id, food: food})
  axios.post("/api/1.0/review/rating",{place: place_id, food: food})
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
  
  let feelingHeader = document.querySelector("#card-feeling-title");
  let food = document.querySelector("#search-food-text").value.replace(/\s+/g, ''); // get searchbox food
  feelingHeader.innerHTML = `Feeling About the Food ${food}`

  var colorList = ['#2A9D8F', '#E9C46A', '#F4A261'];
  // var colorList = ['#2A9D8F', '#E9C46A', '#d598a3'];
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
    height: 235,
    width: 235,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
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
    placeA.setAttribute("class","list-group-item list-group-item-action list-group-item-review");
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

function getPlaceTags(place_id) {
  axios.post("/api/1.0/review/tags",{place: place_id})
    .then(res=> {
      // console.log(res.data.data[0]);
      // showPlaceTags(res.data.data[0]);
      showPlaceTagsBtn(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

// function showPlaceTags(data) {
//   let tagContainer = document.querySelector("#place-tags-container");
//   let tagList = document.querySelector("#place-tags-list-group");
//   // remove all childs
//   tagList.innerHTML = '';

//   let tag_keys = data.token_key.split(",");
//   let tag_values = data.token_value.split(",");
//   console.log(tag_keys);
//   console.log(tag_values);

//   // show first 8 tags
//   for (let i = 0; i < 8; i ++) {
//     // section 2
//     var placeSection2 = document.createElement("div");
//     placeSection2.setAttribute("class","d-flex w-100");
//     var placeRating = document.createElement("h6");
//     placeRating.setAttribute("class","mb-1 tag-key");
//     placeRating.innerHTML = tag_keys[i];
//     placeSection2.append(placeRating);
//     var totalReviewCount = document.createElement("h6");
//     totalReviewCount.setAttribute("class","tag-value");
//     totalReviewCount.innerHTML = `(${tag_values[i]})`; // test
//     placeSection2.append(totalReviewCount);
//     placeA.append(placeSection2);

//     // one place
//     tagList.append(placeA);
//     // total place list
//     tagContainer.append(tagList);
//   }
// }

function showPlaceTagsBtn(data) {
  let tagContainer = document.querySelector("#place-tags-container");
  // remove all childs
  tagContainer.innerHTML = '';

  let tag_keys = data.token_key.split(",");
  let tag_values = data.token_value.split(",");

  // show first 8 tags
  for (let i = 0; i < 8; i ++) {
    // if no more tags, break
    if (!tag_keys[i]) {
      break;
    } else {
      var tag = document.createElement("button");
      tag.setAttribute("class","btn btn-secondary btn-rounded btn-tag");
      tag.innerHTML = `${tag_keys[i]} ${tag_values[i]}`;
      tagContainer.append(tag);
    }
  }
}

function getPlacePeopleBar(place_id) {
  axios.post("/api/1.0/review/people",{place: place_id})
    .then(res=> {
      console.log('getPlacePeopleBar');
      console.log(res.data.data[0]);
      // showPlacePeopleBar(res.data.data[0]);
      showPlacePeopleBarPoltly(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showPlacePeopleBar(data) {
  let familyBar = document.querySelector("#bar-family");
  let friendBar = document.querySelector("#bar-friend");
  let mateBar = document.querySelector("#bar-mate");
  let childBar = document.querySelector("#bar-child");

  console.log(data);

  let familyCnt = data.family_cnt;
  familyBar.classList.add(`w-${familyCnt}`);
}

function showPlacePeopleBarPoltly(data) { 
  var xValue = [data.pet_cnt, data.child_cnt, data.mate_cnt, data.friend_cnt, data.family_cnt];
  var yValue = ['寵物  ','兒童  ','情侶  ', '朋友  ', '家人  '];
  // var yValue = ['Pets ','Children ','Mates ', 'Friends ', 'Family '];

  var textValue = [`${xValue[0]} `, 
  `${xValue[1]} `, 
  `${xValue[2]} `, 
  `${xValue[3]} `, 
  `${xValue[4]} `];


  var trace1 = {
    x: xValue,
    y: yValue,
    type: 'bar',
    text: textValue.map(String),
    textposition: 'auto',
    hoverinfo: 'none',
    marker: {
      color: 'rgb(89,59,219)',
      opacity: 0.7,
      // line: {
      //   color: 'rgb(8,48,107)',
      //   width: 1.5
      // }
    },
    orientation: 'h'
  };

  var data = [trace1];

  var layout = {
    // title: 'Paticipants',
    title: {
      text:'Paticipants Mentioned',
      font: {
        family: 'Roboto',
        size: 18
      }
    },
    height: 300,
    width: 400,
    margin: {
      // l: 0,
      r: 0,
      b: 0,
      // t: 0,
      pad: 0
    },
  };
  
  Plotly.newPlot('bar-people', data, layout);
}

function getReviewFeatureBar(place_id) {
  axios.post("/api/1.0/review/feature/stars",{place: place_id})
    .then(res=> {
      console.log('getReviewFeatureBar');
      console.log(res.data.data[0]);
      showReviewFeatureBar(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showReviewFeatureBar(data) { 
  var xValue = [Math.round(data.price_star*10)/10, Math.round(data.cpvalue_star*10)/10, Math.round(data.environment_star*10)/10, Math.round(data.service_star*10)/10, Math.round(data.meal_star*10)/10];
  var yValue = ['價格  ','CP值  ','環境  ', '服務  ', '餐點  '];
  // var yValue = ['Price ','CP value ','Environment ', 'Service ', 'Meal '];

  var textValue = [`${xValue[0]} (${data.price_cnt}) `, 
    `${xValue[1]} (${data.cpvalue_cnt}) `, 
    `${xValue[2]} (${data.environment_cnt}) `, 
    `${xValue[3]} (${data.service_cnt}) `, 
    `${xValue[4]} (${data.meal_cnt}) `];

  var trace1 = {
    x: xValue,
    y: yValue,
    type: 'bar',
    text: textValue.map(String),
    textposition: 'auto',
    textfont_size: 30,
    // textposition: 'outside',
    hoverinfo: 'none',
    marker: {
      color: 'rgb(231,113,27)',
      opacity: 0.86,
      // line: {
      //   color: 'rgb(8,48,107)',
      //   width: 1.5
      // }
    },
    orientation: 'h',
  };

  var data = [trace1];
  var layout = {
    // title: 'Rating of Each Items',
    title: {
      text:'Rating of Each Items',
      font: {
        family: 'Roboto',
        size: 18
      }
    },
    barmode: 'bar',
    height: 300,
    width: 400,
    margin: {
      // l: 1,
      r: 0,
      b: 0,
      // t: 0,
      // pad: 1
    },
  };
  
  Plotly.newPlot('bar-feature', data, layout);
}

function getPlaceInfo(place_id) {
  let food = document.querySelector("#search-food-text").value.replace(/\s+/g, ''); // get searchbox food
  // console.log('food:',food,'place',place_id);
  axios.post('/api/1.0/review/placeinfo',{food: food, place: place_id})
    .then(res=> {
      console.log('getPlaceInfo');
      console.log(res.data.data[0], food);
      showPlaceInfo(res.data.data[0], food);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showPlaceInfo(data, food) {
  // save place_id
  window.localStorage.setItem("place", data.place_id);

  let infoContainer = document.querySelector("#place-info-container");
  let title = document.querySelector("#card-info-title");
  let rating = document.querySelector("#card-info-rating");
  let cnt = document.querySelector("#card-info-both-cnt");
  let detail = document.querySelector("#card-info-detail");
  title.innerHTML = data.place_name;
  rating.innerHTML = `${data.place_rating}`;
  // rating.innerHTML = `${data.place_rating} ★`;
  cnt.innerHTML = `${data.total_count} reviews, ${data.match_count} reviews mention ${food}`
  detail.innerHTML = `${data.place_addr}<br/> ${data.place_phone}<br/>`

  let likebtn = document.querySelector("#btn-like");
  likebtn.style.display = "block";
  // likeBtn.innerHTML = 'Like';
}

function getUserInfoId(){
  axios.get("/api/1.0/user/profile",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + localStorage.getItem("token")
      }
    }
  )
  .then(res=> {
    // console.log(res.data.data);
    console.log('userid:', res.data.data.userinfo.id);
  })
  .catch(err => {
    console.log(err, err.response);
  });
}

function likePlace() {
  let place = localStorage.getItem("place");
  let likeBtn = document.querySelector("#btn-like");
  console.log('click like!');

  if (token) {
    console.log("has token");
    // get user id
    axios.get("/api/1.0/user/profile",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + localStorage.getItem("token")
        }
      }
    )
    .then(res=> {
      // console.log(res.data.data);
      console.log('userid:', res.data.data.userinfo.id, 'place:', place);
      updateLikePlace(res.data.data.userinfo.id, place);

      // alter css
      likeBtn.innerHTML = 'Unlike';
    })
    .catch(err => {
      console.log(err, err.response);
    });
  } else {
      console.log("no token");
      alert('Please login');
      window.location.href="/signin.html";
  }
}

function updateLikePlace(user, place) {
  axios.post('/api/1.0/user/like', {user: user, place: place})
  .then(res=> {
    console.log('updateLikePlace');
    console.log(res.data.data);
    // console.log(res.data.data[0], place);
    addLikeMarkerToMap(res.data.data.place_id, res.data.data.place_name, res.data.data.place_lat, res.data.data.place_lng);
  })
  .catch(err => {
    console.log(err, err.response);
  });
}

function addLikeMarkerToMap(place_id, place_name, place_lat, place_lng) {
  console.log('to draw');

  var myLatlng = new google.maps.LatLng(place_lat, place_lng);

  // const goldStar = {
  //   path:
  //     "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
  //   fillColor: "gold",
  //   fillOpacity: 0.8,
  //   scale: 1,
  //   strokeColor: "gold",
  //   strokeWeight: 14,
  // };
  
  var marker = new google.maps.Marker({
      position: myLatlng,
      // icon: goldStar,
      // icon: "../images/flag.png",
      icon: {
        // url: "../images/star.png",
        url: "../images/flag.png",
        scaledSize: new google.maps.Size(25, 25)
      },
      title: place_name
  });
  
  // To add the marker to the map, call setMap();
  marker.setMap(map);
  console.log(`Add marker ${place_id} done.`)
}