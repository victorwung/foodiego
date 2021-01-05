function searchFoodContents() {
  let food = document.querySelector('#search-food-text').value;
  console.log('food:', food);
  axios
    .post(
      '/api/1.0/map/review_content',
      {
        food: food
      }
    )
    .then(res=> {
      showReviews(res.data.data);
    })
    .catch(err => {
      console.log(err, err.response);
    });
}