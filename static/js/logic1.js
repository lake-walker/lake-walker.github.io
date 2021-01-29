var myMap = L.map('map', {
    center: [
        37.09, -95.71
    ],
    zoom: 5
});

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var geojson;

d3.json(queryUrl, function(data) {
    // geojson = L.choropleth(data, {
    //     valueProperty: 'coordinates',
    //     scale: ["#ffffb2", "#b10026"],
    //     steps: 10,
    //     mode: 'q',
    //     style: {
    //         color: '#fff',
    //         weight: 1,
    //         fillOpacity: 0.8
    //     },

    //     onEachFeature: function(feature, layer) {
            
    //         layer.bindPopup('<h3>' + feature.properties.place + 
    //             '</h3><hr><p>' + new Date(feature.properties.time) + '</p>');
    //     }
    // }).addTo(myMap);
})

function getColor(d) {
    return d > 10 ? '#800026' :
           d > 6  ? '#BD0026' :
           d > 5  ? '#E31A1C' :
           d > 4  ? '#FC4E2A' :
           d > 3   ? '#FD8D3C' :
           d > 2   ? '#FEB24C' :
           d > 1   ? '#FED976' :
                      '#FFEDA0';
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
                radius: feature.properties.mag * 10,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: ["green", "red"],
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup('<h3> Location: ' + feature.properties.place + " Magnitude: " + feature.properties.mag + ' Depth: ' + feature.geometry.coordinates[2] +
            '</h3><hr><p>' + new Date(feature.properties.time) + '</p>');
        }
    }).addTo(myMap);
    console.log(geojson);

    // Set up legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var limits = [0,1,2,3,4,5,6,10];
        var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
        var labels = [];
        
        // add min and max
        var legendInfo = '<h1>Earquake Depth</h1>' + 
            "<div class=\"labels\">" +
                "<div class=\"min\">" + limits[0] + "</div>" +
                "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
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


