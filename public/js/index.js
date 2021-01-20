function outerSearchFood() {
  let food = document.querySelector('#outer-search-food-text').value;  
  if (localStorage.getItem('food')) {
    window.localStorage.removeItem('food');
  }
  // if (food.length !== 0) {  
  //   window.localStorage.setItem('food', food);
  // }
  if (food.length !== 0) {
    window.localStorage.setItem('food', food);
    // redirect
    window.location.href='/main.html';
  } else {
    Swal.fire('Please try again!', 'Type any food name in the search box.');
  }
  // window.location.href='/main.html';
}