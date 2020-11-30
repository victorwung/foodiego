function initMap() {
  var uluru = {lat: 25.041, lng: 121.543};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map,
    draggable: false
  });
}