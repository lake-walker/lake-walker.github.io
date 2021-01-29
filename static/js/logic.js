// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// get request to the qury URL
d3.json(queryUrl, function(data) {
    createFeatures(data);
    // console.log(data.features);
});

function createFeatures(earthquakeData) {
    // console.log(earthquakeData);
    // define a function we want to run once for each feature in the features array
    // give each feature a popup describing the place and time of the earthquake 
    function onEachFeature(feature, layer) {
        console.log(feature.geometry.coordinates);
        // layer.bindPopup('<h3>' + feature.properties.place + 
        //     '</h3><hr><p>' + new Date(feature.properties.time) + '</p');
        L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            color:'white',
            fillColor:'black',
            radius: 100000
        }).bindPopup('<h3>' + feature.properties.place + 
        '</h3><hr><p>' + new Date(feature.properties.time) + '</p>');
        
    }

    // L.circle(earthquakes, {
    //         fillOpacity: 0.75, 

    //         color: 'white',
    //         fillColor: 'red',
    //         radius: earthquakes.mag * 1000
    // }).bindPopup('<h1>' + earthquakes.place + '</h1> <hr> <h3> Magnitude: ' + earthquakes.mag + '</h3>').addTo(myMap);

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    // console.log(earthquakes);

    // send earthquake layer to createMap function
    createMap(earthquakes);
}

// CreateMap function
function createMap(earthquakes) {
    // console.log(earthquakes);
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

//   var circles = L.circle(earthquakes, {
//     fillOpacity: 0.75,
//     color: 'white',
//     fillColor: 'red',
//     radius: earthquakes.properties.mag * 1000
//     }).bindPopup('<h1>' + earthquakes.properties.place + '</h1> <hr> <h3> Magnitude: ' + earthquakes.properites.mag + '</h3>');

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
      'Street Map': streetmap,
      'Dark Map': darkmap
  };

  var overlayMaps = {
      Earthquakes: earthquakes
  };

  // create our map, giving it the streetmap and earhquakes layers to display on load
  var myMap = L.map('map', {
      center: [
          37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
  });

//   for(var i = 0; i < earthquakes.length; i++) {
//     L.circle(earthquakes, {
//         fillOpacity: 0.75,
//         color: 'white',
//         fillColor: 'red',
//         radius: earthquakes[i].mag * 1000
//     }).bindPopup('<h1>' + earthquakes[i].place + '</h1> <hr> <h3> Magnitude: ' + earthquakes[i].mag + '</h3>').addTo(myMap); 
//   }

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

//   L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).addTo(myMap);
}

