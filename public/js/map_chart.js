// get url id parameter
function getParameter(name){
  let result=null, tmp=[];
  window.location.search.substring(1).split("&").forEach(function(item){
    tmp=item.split("=");
    if(tmp[0]===name){
      result=decodeURIComponent(tmp[1]);
    }
  });
  return result;
}

let place = getParameter("place");
console.log('place:', place);

// if no place_id redirect
if (!place) {
  // window.location="./";
  alert("no place_id");
}
else {
  console.log(place);
}

// get a place pie chart 
axios.get(`api/1.0/map/review/analysis_rating?place=${place}`)
.then(res=> {
  console.log(res.data);
})
.catch(err => {
  console.log(err, err.response);
});

// pie chart
function getPieChart() {
  let place = getParameter("place");
  console.log('place:', place);

  // if no place_id redirect
  if (!place) {
    // window.location="./";
    alert("no place_id");
  }
  else {
    console.log(place);
  }

  // get a place pie chart 
  axios.get(`/map/review/analysis_rating?place=${place}`)
  .then(res=> {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err, err.response);
  });
}

function drawPeiChart(place) {
  var colors = [];
  var qtys = [];
  for (var i = 0; i < color_result.length; i++) {
    colors.push(color_result[i].color_name);
    qtys.push(color_result[i].total_qty);
  }
  // plt
  var data = [{
    values: qtys,
    labels: colors,
    type: 'pie'
  }];
  // console.log(data);
  var layout = {
    height: 400,
    width: 500
  };
  let pie = document.getElementById("pie");
  Plotly.newPlot(pie, data, layout);
}
