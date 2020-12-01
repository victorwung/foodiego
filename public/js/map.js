function initMap() {
  var uluru = {lat: 25.033, lng: 121.543};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: {lat: 25.031624, lng: 121.544567},
    map: map,
    draggable: false
  });
}