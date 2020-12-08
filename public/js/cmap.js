// let map;

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 2,
//     center: { lat: -33.865427, lng: 151.196123 },
//     mapTypeId: "terrain",
//   });
//   // Create a <script> tag and set the USGS URL as the source.
//   const script = document.createElement("script");
//   // This example uses a local copy of the GeoJSON stored at
//   // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
//   script.src =
//     "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
//   document.getElementsByTagName("head")[0].appendChild(script);
//   map.data.setStyle((feature) => {
//     const magnitude = feature.getProperty("mag");
//     return {
//       icon: getCircle(magnitude),
//     };
//   });
// }

// function getCircle(magnitude) {
//   return {
//     path: google.maps.SymbolPath.CIRCLE,
//     fillColor: "red",
//     fillOpacity: 0.2,
//     scale: Math.pow(2, magnitude) / 2,
//     strokeColor: "white",
//     strokeWeight: 0.5,
//   };
// }

// function eqfeed_callback(results) {
//   map.data.addGeoJson(results);
// }

const citymap = {
  chicago: {
    center: { lat: 41.878, lng: -87.629 },
    population: 2714856,
  },
  newyork: {
    center: { lat: 40.714, lng: -74.005 },
    population: 8405837,
  },
  losangeles: {
    center: { lat: 34.052, lng: -118.243 },
    population: 3857799,
  },
  vancouver: {
    center: { lat: 49.25, lng: -123.1 },
    population: 603502,
  },
};

function initMap() {
  // Create the map.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 37.09, lng: -95.712 },
    mapTypeId: "terrain",
  });

  const infowindow = new google.maps.InfoWindow({
    content: 'place',
  });

  // // Construct the circle for each value in citymap.
  // // Note: We scale the area of the circle based on the population.
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
      radius: Math.sqrt(citymap[city].population) * 100,
    });

    google.maps.event.addListener(cityCircle, 'click', function(ev){
      infowindow.setPosition(cityCircle.getCenter());
      infowindow.setContent(city);
      infowindow.open(map);
    });
  }
}