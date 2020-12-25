function outerSearchFood() {
  let food = document.querySelector("#outer-search-food-text").value;
  
  if (localStorage.getItem("food")) {
    window.localStorage.removeItem("food");
  }

  if (food.length !== 0) {  
    window.localStorage.setItem("food", food);
  }

  window.location.href="/main.html";
}