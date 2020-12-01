function searchFood() {
  // console.log('click');
  let food = document.querySelector("#search-food-text").value;
  console.log('food:', food);
  axios
    .post(
      "/api/1.0/map/review",
      {
        food: food
      },
      {
        // headers: {
        //     'Content-Type': 'application/json'
        // }
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
    var oneReviewText = document.createTextNode(`餐廳: ${data[i].place_name}, match數: ${data[i].review_count}`);
    oneReview.appendChild(oneReviewText);
    reviewContainer.appendChild(oneReview);
  }  
}