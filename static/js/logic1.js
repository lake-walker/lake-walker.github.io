var myMap = L.map('map', {
    center: [
        37.09, -95.71
    ],
    zoom: 5
});

// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var queryUrl =  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var geojson;

// d3.json(queryUrl, function(data) {
//     geojson = L.choropleth(data, {
//         valueProperty: 'coordinates',
//         scale: ["#ffffb2", "#b10026"],
//         steps: 10,
//         mode: 'q',
//         style: {
//             color: '#fff',
//             weight: 1,
//             fillOpacity: 0.8
//         },

//         onEachFeature: function(feature, layer) {
            
//             layer.bindPopup('<h3>' + feature.properties.place + 
//                 '</h3><hr><p>' + new Date(feature.properties.time) + '</p>');
//         }
//     }).addTo(myMap);
// })

function getColor(d) {
    return d > 90 ? '#FF0000' :
           d > 70  ? '#FF3300' :
           d > 50  ? '#ff9900' :
           d > 30   ? '#FFFF00' :
           d > 10   ? '#99ff00' :
           d > -10   ? '#66ff00' :
                      '#00FF00';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}



d3.json(queryUrl, function(response) {
    // var data = response.features;
    // L.geoJson(data, {style: style}).addTo(myMap);
    geojson = L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: ["green", "red"],
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup('<h3> Location: ' + feature.properties.place + " Magnitude: " + feature.properties.mag + ' Depth: ' + feature.geometry.coordinates[2] +
            '</h3><hr><p>' + new Date(feature.properties.time) + '</p>');
        }
    }).addTo(myMap);
    // console.log(geojson);

    // Set up legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var limits = [-10,10,30,50,70,90];
        var colors = ['#00FF00', '#66ff00', '#99ff00', '#FFFF00', '#ff9900', '#FF3300', '#FF0000'];
        var labels = [];
        // add min and max
        var legendInfo = '<h1>Earthquake Depth (Km) </h1>' + 
            "<div class=\"labels\">" +
                "<div class=\"min\">" + limits[0] + '-' + limits[1] + ' ' + limits[1] + '-' + limits[2] + ' ' + limits[2] + '-' + limits[3] + ' ' + limits[3] + '-' + limits[4] + ' ' + limits[4] + '-' + limits[5] + 
                ' ' + limits[limits.length - 1] + '+' + "</div>" +
            "</div>";
        
        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push('<li style=\'background-color: ' + colors[index] + '\'></li>');
        });

        div.innerHTML += '<ul>'  + labels.join('') + '</ul>';
        return div;
    };

    legend.addTo(myMap);
});

// L.geoJson(data, {style: style}).addTo(myMap);


