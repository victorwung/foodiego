let map;
let circles = [];
let citymap = {};

const token = localStorage.getItem('token'); // user token

function checkToken() {
  if (token) {
    // has token
    getUserInfoName();
  }
  else {
    // no token
  }
}

function getUserInfoName(){
  axios.get('/api/1.0/user/profile',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
      }
    }
  )
  .then(res=> {
    setUserName(res.data.data.userinfo.name);
  })
  .catch(err => {
    console.log(err, err.response);
  });
}

function setUserName(name){
  let welcome = document.querySelector('#welcome-user-slogan');
  welcome.innerHTML = `Welcome, ${name}!`;
  changeMenuItem();
}

function changeMenuItem(){
  let itemHref = document.querySelector('#sign-in-menu-item');
  let itemTitle = document.querySelector('#sign-in-menu-title');
  itemHref.href = './index.html';
  itemTitle.innerHTML = 'Logout ';
  // if logout, remove token from local storage
  window.localStorage.removeItem('token');
}

checkToken();

function initMap() {
  var uluru = {lat: 25.041, lng: 121.550}; // Zhongxiao Dunhua Station
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: uluru
  });
}

const outerFood = localStorage.getItem('food');
document.addEventListener('DOMContentLoaded', function(){
  // DOM ready
  checkOuterSearchFood();
});

function checkOuterSearchFood() {
  if (outerFood) {
    let foodbox = document.querySelector('#search-food-text');
    foodbox.value = outerFood;
    searchFood();
  } else {
    // pass
  }
}

function searchFood() {
  let food = document.querySelector('#search-food-text').value.replace(/\s+/g, ''); // remove blank space
  if (food === '') {
    Swal.fire('Please try again!', 'Type anything food name in the search box.');
  } else {
    axios.post('/api/1.0/map/places',{food: food})
      .then(res=> {
        if(res.data.total === 0) {
          Swal.fire('Please try again!', 'Sorry. No related reviews about this food.').then((result) => {
            if (result.isConfirmed) {
              document.querySelector('#search-food-text').value = '';
            }
          });
        } else {
          addCirclesToMap(res.data.total, res.data.data);
          showReviewsList(food, res.data.data);
          setSearchResult(food, res.data.data.length, res.data.total);
          // set food to local storage
          window.localStorage.setItem('food', food);
        }
      })
      .catch(err => {
        console.log(err, err.response);
      });
  }
}

function addCirclesToMap(total_match_count, data) {
  // clear circles with reload map
  citymap = {};
  circles = [];
  initMap();

  // draw circles
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

  const infowindow = new google.maps.InfoWindow();
  for (const city in citymap) {
    // add the circle for this city to the map
    const cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map,
      center: citymap[city].center,
      radius:  Math.sqrt(citymap[city].match_count/total_match_count ) * 300
    });

    google.maps.event.addListener(cityCircle, 'click', function(ev){
      infowindow.setPosition(cityCircle.getCenter());
      infowindow.setContent(`${citymap[city].name} (${citymap[city].match_count})`);
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
}

function showReviewsList(food, data) {
  let reviewContainer = document.querySelector('#review-container');
  let placeList = document.querySelector('#place-list-group');
  // remove all childs
  placeList.innerHTML = '';

  for (let i = 0; i < data.length; i ++) {
    var placeA = document.createElement('div');
    placeA.setAttribute('class','list-group-item list-group-item-action list-group-item-place');
    placeA.addEventListener('click', () => {
      getPlaceInfo(data[i].place_id); // place info
      getPlacePeopleBar(data[i].place_id); // bar chart
      getRatingDistribution(data[i].place_id); // pie chart
      getReviewContents(data[i].place_id); // review content
      getPlaceTags(data[i].place_id); // place tags
      getReviewFeatureBar(data[i].place_id); // review feature bar
      google.maps.event.trigger(circles[i], 'click'); // click circle on map
    });

    // section 1
    var placeSection1 = document.createElement('div');
    placeSection1.setAttribute('class','d-flex w-100 justify-content-between');
    var placeName = document.createElement('h6');
    placeName.setAttribute('class','mb-1 place-name');
    placeName.innerHTML = data[i].place_name;
    placeSection1.append(placeName);
    var matchCount = document.createElement('h6');
    matchCount.setAttribute('class','match-count');
    matchCount.innerHTML = data[i].match_count;
    placeSection1.append(matchCount);
    placeA.append(placeSection1);

    // section 2
    // star figure
    var cur_rating = data[i].place_rating;
    var star_figure;
    if (cur_rating === 5) {
      star_figure = '★★★★★';
    } else if (cur_rating >= 4) {
      star_figure = '★★★★☆';
    } else if (cur_rating >= 3) {
      star_figure = '★★★☆☆';
    } else if (cur_rating >= 2) {
      star_figure = '★★☆☆☆';
    } else {
      star_figure = '★☆☆☆☆';
    }

    var placeSection2 = document.createElement('div');
    placeSection2.setAttribute('class','d-flex w-100');
    var placeRating = document.createElement('h6');
    placeRating.setAttribute('class','mb-1 place-rating');
    placeRating.innerHTML = `${data[i].place_rating} ${star_figure}`;
    placeSection2.append(placeRating);
    var totalReviewCount = document.createElement('h6');
    totalReviewCount.setAttribute('class','total-review-count');
    totalReviewCount.innerHTML = `(${data[i].total_count})`; // test
    placeSection2.append(totalReviewCount);
    placeA.append(placeSection2);

    // section 25
    var placeSection25 = document.createElement('div');
    placeSection25.setAttribute('class','d-flex w-100');
    var bothCount = document.createElement('small');
    bothCount.setAttribute('class','mb-1 new-both-count');
    bothCount.innerHTML = `${data[i].total_count} reviews, ${data[i].match_count} reviews mention ${food}`;
    placeSection25.append(bothCount);
    placeA.append(placeSection25);

    // section 3
    var placeSection3 = document.createElement('div');
    placeSection3.setAttribute('class','mb-1 place-addr');
    var placeAddr = document.createElement('small');
    placeAddr.innerHTML = data[i].place_addr;
    placeSection3.append(placeAddr);
    placeA.append(placeSection3);

    // section 4
    var placeSection4 = document.createElement('div');
    placeSection4.setAttribute('class','mb-1 place-tags');
    var placeTags = document.createElement('small');
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
    placeSection4.append(placeTags);
    placeA.append(placeSection4);

    // one place
    placeList.append(placeA);
    // total place list
    reviewContainer.append(placeList);
  }
  // default click the top mathch place
  let topPlace = document.getElementsByClassName('list-group-item-place')[0];
  topPlace.click();
}

function setSearchResult(food, place_cnt, review_cnt){
  let mapCardTitle = document.getElementById('card-map-title');
  mapCardTitle.textContent = `Foodie Map ( ${place_cnt} restaurants / ${review_cnt} reviews mention ${food})`;
}

function drawPlaceNumber(data_length) {
  let placeNumber = document.getElementById('place-number');
  placeNumber.textContent = `餐廳數: ${data_length}`;
}

function getRatingDistribution(place_id) {
  let food = document.querySelector('#search-food-text').value.replace(/\s+/g, '');

  axios.post('/api/1.0/review/rating',{place: place_id, food: food})
    .then(res=> {
      drawRatingDistribution(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function drawRatingDistribution(data) { 
  let feelingHeader = document.querySelector('#card-feeling-title');
  let food = document.querySelector('#search-food-text').value.replace(/\s+/g, ''); // get searchbox food
  feelingHeader.innerHTML = `Feeling About the Food ${food}`;

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
    font: {
      family: 'sans-serif',
      size: 13
    },
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
  axios.post('/api/1.0/review/contents',{place: place_id})
    .then(res=> {
      showReviewContentList(res.data.data);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showReviewContentList(data) {
  let reviewContainer = document.querySelector('#review-content-container');
  let reviewList = document.querySelector('#place-review-content-list-group');
  // remove all childs
  reviewList.innerHTML = '';

  for (let i = 0; i < data.length; i ++) {
    var placeA = document.createElement('div');
    placeA.setAttribute('class','list-group-item list-group-item-action list-group-item-review');

    // section 1
    var placeSection1 = document.createElement('div');
    placeSection1.setAttribute('class','d-flex w-100 justify-content-between');
    var placeName = document.createElement('h6');
    placeName.setAttribute('class','mb-1 user-name');
    placeName.innerHTML = data[i].user_name;
    placeSection1.append(placeName);
    var matchCount = document.createElement('h6');
    matchCount.setAttribute('class','rel-date');
    matchCount.innerHTML = data[i].rel_date;
    placeSection1.append(matchCount);
    placeA.append(placeSection1);

    // section 2
    // star figure
    var cur_rating = data[i].rating;
    var star_figure;
    if (cur_rating === 5) {
      star_figure = '★★★★★';
    } else if (cur_rating >= 4) {
      star_figure = '★★★★☆';
    } else if (cur_rating >= 3) {
      star_figure = '★★★☆☆';
    } else if (cur_rating >= 2) {
      star_figure = '★★☆☆☆';
    } else {
      star_figure = '★☆☆☆☆';
    }

    var placeSection2 = document.createElement('div');
    placeSection2.setAttribute('class','d-flex w-100');
    var placeRating = document.createElement('h6');
    placeRating.setAttribute('class','mb-1 content-rating');
    placeRating.innerHTML = `${star_figure}`;
    placeSection2.append(placeRating);
    placeA.append(placeSection2);

    // section 3
    var placeSection3 = document.createElement('div');
    placeSection3.setAttribute('class','mb-1 review-content');
    var placeAddr = document.createElement('p');
    placeAddr.innerHTML = data[i].review_content;
    placeSection3.append(placeAddr);
    placeA.append(placeSection3);

    // one place
    reviewList.append(placeA);
    // total place list
    reviewContainer.append(reviewList);
  }
}

function getPlaceTags(place_id) {
  axios.post('/api/1.0/review/tags',{place: place_id})
    .then(res=> {
      showPlaceTagsBtn(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showPlaceTagsBtn(data) {
  let tagContainer = document.querySelector('#place-tags-container');
  // remove all childs
  tagContainer.innerHTML = '';

  let tag_keys = data.token_key.split(',');
  let tag_values = data.token_value.split(',');

  // show first 8 tags
  for (let i = 0; i < 8; i ++) {
    // if no more tags, break
    if (!tag_keys[i]) {
      break;
    } else {
      var tag = document.createElement('button');
      tag.setAttribute('class','btn btn-secondary btn-rounded btn-tag');
      tag.innerHTML = `${tag_keys[i]} ${tag_values[i]}`;
      tagContainer.append(tag);
    }
  }
}

function getPlacePeopleBar(place_id) {
  axios.post('/api/1.0/review/people',{place: place_id})
    .then(res=> {
      showPlacePeopleBarPoltly(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showPlacePeopleBarPoltly(data) { 
  var xValue = [data.pet_cnt, data.child_cnt, data.mate_cnt, data.friend_cnt, data.family_cnt];
  var yValue = ['寵物  ','兒童  ','情侶  ', '朋友  ', '家人  '];

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
      opacity: 0.7
    },
    orientation: 'h'
  };

  var data = [trace1];

  var layout = {
    title: {
      text:'Paticipants Mentioned',
      font: {
        family: 'Roboto',
        size: 18
      }
    },
    font: {
      family: 'sans-serif',
      size: 13
    },
    xaxis: {
      range: [0, 25]
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
  axios.post('/api/1.0/review/feature/stars',{place: place_id})
    .then(res=> {
      showReviewFeatureBar(res.data.data[0]);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showReviewFeatureBar(data) { 
  var xValue = [Math.round(data.price_star*10)/10, Math.round(data.cpvalue_star*10)/10, Math.round(data.environment_star*10)/10, Math.round(data.service_star*10)/10, Math.round(data.meal_star*10)/10];
  var yValue = ['價格  ','CP值  ','環境  ', '服務  ', '餐點  '];

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
    hoverinfo: 'none',
    marker: {
      color: 'rgb(231,113,27)',
      opacity: 0.86
    },
    orientation: 'h',
  };

  var data = [trace1];
  var layout = {
    title: {
      text:'Rating of Each Items',
      font: {
        family: 'Roboto',
        size: 18
      }
    },
    font: {
      family: 'sans-serif',
      size: 13
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
  let food = document.querySelector('#search-food-text').value.replace(/\s+/g, ''); // get searchbox food

  axios.post('/api/1.0/review/placeinfo',{food: food, place: place_id})
    .then(res=> {
      showPlaceInfo(res.data.data[0], food);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function showPlaceInfo(data, food) {
  // save place_id
  window.localStorage.setItem('place', data.place_id);

  // star figure
  var cur_rating = data.place_rating;
  var star_figure;
  if (cur_rating === 5) {
    star_figure = '★★★★★';
  } else if (cur_rating >= 4) {
    star_figure = '★★★★☆';
  } else if (cur_rating >= 3) {
    star_figure = '★★★☆☆';
  } else if (cur_rating >= 2) {
    star_figure = '★★☆☆☆';
  } else {
    star_figure = '★☆☆☆☆';
  }

  let infoContainer = document.querySelector('#place-info-container');
  let title = document.querySelector('#card-info-title');
  let rating = document.querySelector('#card-info-rating');
  let cnt = document.querySelector('#card-info-both-cnt');
  let detail = document.querySelector('#card-info-detail');
  title.innerHTML = data.place_name;
  rating.innerHTML = `${data.place_rating} ${star_figure}`;
  cnt.innerHTML = `${data.total_count} reviews, ${data.match_count} reviews mention ${food}`;
  detail.innerHTML = `${data.place_addr}<br/> ${data.place_phone}<br/>`;

  // let likebtn = document.querySelector('#btn-like');
  // likebtn.style.display = 'block';
}

function getUserInfoId(){
  axios.get('/api/1.0/user/profile',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
      }
    }
  )
  .then(res=> {
    // console.log('userid:', res.data.data.userinfo.id);
  })
  .catch(err => {
    console.log(err, err.response);
  });
}

function likePlace() {
  let place = localStorage.getItem('place');
  let likeBtn = document.querySelector('#btn-like');

  if (token) {
    // get user id
    axios.get('/api/1.0/user/profile',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
        }
      }
    )
    .then(res=> {
      updateLikePlace(res.data.data.userinfo.id, place);
      // alter css
      likeBtn.innerHTML = 'Unlike';
    })
    .catch(err => {
      console.log(err, err.response);
    });
  } else {
      // no token
      Swal.fire('Please login!').then((result) => {
        if (result.isConfirmed) {
          window.location.href='/signin.html';
        }
      });
  }
}

function updateLikePlace(user, place) {
  axios.post('/api/1.0/user/like', {user: user, place: place})
  .then(res=> {
    addLikeMarkerToMap(res.data.data.place_id, res.data.data.place_name, res.data.data.place_lat, res.data.data.place_lng);
  })
  .catch(err => {
    console.log(err, err.response);
  });
}

function addLikeMarkerToMap(place_id, place_name, place_lat, place_lng) {
  var myLatlng = new google.maps.LatLng(place_lat, place_lng);
  var marker = new google.maps.Marker({
      position: myLatlng,
      icon: {
        url: '../images/flag.png',
        scaledSize: new google.maps.Size(25, 25)
      },
      title: place_name
  });
  
  // add the marker to the map, call setMap();
  marker.setMap(map);
}