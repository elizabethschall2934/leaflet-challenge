//Earthquake website and link to chosen data set
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
//Past Day, All Earthquakes
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson

//Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and 
//latitude.
//Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earth 
//quake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth 
//should appear darker in color.
//HINT the depth of the earth can be found as the third coordinate for each earthquake.
//Include popups that provide additional information about the earthquake when a marker is clicked.
//Create a legend that will provide context for your map data.

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Initialize an array to hold earthquake markers
var eqMarkers = [];
var eqInfo = [];

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features, eqMarkers);
});

  // Marker size function
function eqSize(magnitude) {
    return magnitude * 25000;
  }

// Marker color function
function eqColor(magnitude) {
    var circleColor = "#4B0082";

    if (magnitude > 4){
        circleColor = "#8B008B";
    } else if (magnitude > 3){
        circleColor = "	#9932CC";
    } else if (magnitude > 2){
        circleColor = "#C71585";
    } else if (magnitude > 1){
        circleColor = "#FF00FF";
    } else {
        circleColor = "#DDA0DD";
    }
    return circleColor;
  }
  
function createFeatures(earthquakeData, eqMarkers) {
  
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Where: "  + feature.properties.place + "</h3><hr><p>When: " + new Date(feature.properties.time) + 
    "<hr><p>Magnitude: " + feature.properties.mag +"</p>");

    eqMarkers.push(
    L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        stroke: true,
        fillOpacity: 0.8,
        color: "#4B0082",
        weight: 1,
        fillColor: eqColor(feature.properties.mag),
        radius: eqSize(feature.properties.mag)
    })
    );
  }
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {

    onEachFeature: onEachFeature
  });

  // Create layer group for earthquake markers
  eqInfo = L.layerGroup(eqMarkers);

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  
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
  
  // Define a baseMaps object to hold our base layers
  var baseMap = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": eqInfo,
    "Earthquake Info": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, eqInfo]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMap, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}