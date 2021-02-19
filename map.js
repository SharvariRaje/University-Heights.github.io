// TODO: Style zoom control
// TODO: Clear unused fonts
// TODO: Clear unused geojson, including the archive
// TODO: Clear all the console.log
// TODO: Try less margins or larger fonts on the popups
// FIXME: When close popup manually, reset filters

var allData;

fetch("data/allData.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    allData = data;
  });

var year = document.getElementById("year");
var viewAllNamesButton = document.getElementById("viewAllNamesButton");
var viewLinesButton = document.getElementById("viewLinesButton");
var resetButton = document.getElementById("resetFilterButton");
var modal = document.getElementById("introModal");
var modalContent = document.getElementById("modalContent");
var closeModal = document.getElementById("closeModal");
var openModal = document.getElementById("infoButton");
var namesModal = document.getElementById("namesModal");
var closeNamesModal = document.getElementById("closeNamesModal");
var slideModal = document.getElementById("slideModal");
var closeSlideModal = document.getElementById("closeSlideModal");
var overModal = document.getElementById("overModal");
var closeOverModal = document.getElementById("closeOverModal");
var newarkModal = document.getElementById("newarkModal");
var closeNewarkModal = document.getElementById("closeNewarkModal");
var mobileModal = document.getElementById("mobileModal");
var closeMobileModal = document.getElementById("closeMobileModal");
var searchBarButton = document.getElementById("searchBarButton");
var stories = document.getElementById("stories");
var filter = "all";
var linesOn = false;
var slideOn = true;
var overOn = true;
var newarkOn = true;
var popup;
const rangeTransform = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

// Local variables
// TODO: Remove unused colors
var colorGold = "#FFB700";
var colorYellow = "#FFD700";
var colorOrange = "#FF6300";
var colorGray = "#777777";
var colorLightSilver = "#AAAAAA";
var colorLightBlue = "#96CCFF";
var colorBlue = "#357EDD";
var colorLightPink = "#FFA3D7";
var colorPink = "#FF80CC";

// Creating map object
mapboxgl.accessToken =
  "pk.eyJ1IjoiamZzMjExOCIsImEiOiJlMUQzd2YwIn0.WLb3PYDt2z-XttOLFcQlVQ";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/jfs2118/ckaa2fs3o23ns1joz5l78ypj6",
  zoom: 13.5,
  center: [-74.189, 40.74],
  maxZoom: 17,
  minZoom: 11,
  maxBounds: [
    [-74.43, 40.65],
    [-73.97, 40.84],
  ],
});

// Adding the zoom in/out buttons
var nav = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(nav, "bottom-right");

// Adding layers to the map from geojsons
// The order in which they appear here is the order in the stack (first one on top)
map.on("load", function () {
  map.addLayer(
    {
      id: "allLines",
      type: "line",
      source: {
        type: "geojson",
        data: "data/allLines.geojson",
        lineMetrics: true,
      },
      layout: {
        visibility: "none",
      },
      paint: {
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "highlighted"], false],
          1,
          0.25,
        ],
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          colorGold,
          1,
          colorOrange,
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "thickLine"], false],
          2,
          1,
        ],
      },
    },
    "road-label"
  );
  map.addLayer(
    {
      id: "allDestinations",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/allDestinations.geojson",
      },
      paint: {
        "circle-opacity": 0,
        "circle-stroke-color": colorOrange,
        "circle-stroke-opacity": [
          "case",
          ["boolean", ["feature-state", "semiTransparent"], false],
          0.25,
          1,
        ],
        "circle-stroke-width": [
          "case",
          ["boolean", ["feature-state", "highlighted"], false],
          1.5,
          0.5,
        ],
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          3,
          16,
          6,
        ],
      },
    },
    "allLines"
  );
  map.addLayer(
    {
      id: "allDestinationsInner",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/allDestinations.geojson",
      },
      paint: {
        "circle-color": colorOrange,
        "circle-opacity": [
          "case",
          ["boolean", ["feature-state", "semiTransparent"], false],
          0.25,
          1,
        ],
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          2,
          16,
          3,
        ],
      },
    },
    "allDestinations"
  );
  map.addLayer(
    {
      id: "allOrigins",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/allOrigins.geojson",
      },
      paint: {
        "circle-stroke-color": colorGold,
        "circle-opacity": 0,
        "circle-stroke-width": [
          "case",
          ["boolean", ["feature-state", "highlighted"], false],
          1.5,
          0.5,
        ],
        "circle-stroke-opacity": [
          "case",
          ["boolean", ["feature-state", "semiTransparent"], false],
          0.05,
          1,
        ],
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          1,
          14,
          3,
          16,
          6,
        ],
      },
    },
    "allDestinationsInner"
  );
  map.addLayer(
    {
      id: "allOriginsInner",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/allOrigins.geojson",
      },
      paint: {
        "circle-color": colorGold,
        "circle-opacity": [
          "case",
          ["boolean", ["feature-state", "semiTransparent"], false],
          0.05,
          1,
        ],
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          0.5,
          14,
          1,
          16,
          3,
        ],
      },
    },
    "allOrigins"
  );
  map.addLayer(
    {
      id: "slideThroughTimeLocations",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/SlideThroughTimeLocations.geojson",
      },
      paint: {
        "circle-stroke-color": colorBlue,
        "circle-opacity": 0,
        "circle-stroke-width": 0.5,
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          3,
          16,
          6,
        ],
      },
    },
    "allOriginsInner"
  );
  map.addLayer(
    {
      id: "slideThroughTimeLocationsInner",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/SlideThroughTimeLocations.geojson",
      },
      paint: {
        "circle-color": colorBlue,
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          2,
          16,
          3,
        ],
      },
    },
    "slideThroughTimeLocations"
  );
  map.addLayer(
    {
      id: "eppersonCentroid",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/eppersonCentroid.geojson",
      },
      paint: {
        "circle-stroke-color": colorBlue,
        "circle-opacity": 0,
        "circle-stroke-width": 0.5,
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          3,
          16,
          6,
        ],
      },
    },
    "slideThroughTimeLocationsInner"
  );
  map.addLayer(
    {
      id: "eppersonCentroidInner",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/eppersonCentroid.geojson",
      },
      paint: {
        "circle-color": colorBlue,
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          2,
          16,
          3,
        ],
      },
    },
    "eppersonCentroid"
  );
  map.addLayer(
    {
      id: "eppersonHouseOutline",
      type: "line",
      source: {
        type: "geojson",
        data: "data/eppersonHouse.geojson"
      },
      layout: {
        visibility: "none",
      },
      paint: {
        "line-color": "#4D4D4D",
        "line-width": 0.9,
      },
    },
    "eppersonCentroidInner"
  );
  map.addLayer(
    {
      id: "eppersonHouse",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/eppersonHouse.geojson"
      },
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": colorPink,
        "fill-opacity": 0.5,
      },
    },
    "eppersonHouseOutline"
  );
  map.addLayer(
    {
      id: "historicalBuildingsOutline",
      type: "line",
      source: {
        type: "geojson",
        data: "data/historicalBuildings.geojson",
      },
      layout: {
        visibility: "none",
      },
      paint: {
        "line-color": "#4D4D4D",
        "line-width": 0.2,
      },
    },
    "eppersonHouse"
  );
  map.addLayer(
    {
      id: "historicalBuildings",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/historicalBuildings.geojson",
      },
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": colorPink,
        "fill-opacity": 0.1,
      },
    },
    "historicalBuildingsOutline"
  );
  // map.addLayer(
  //   {
  //     id: "historicalBuildingsLabel",
  //     type: "symbol",
  //     source: {
  //       type: "geojson",
  //       data: "data/UniversityHeightsCentroid.geojson",
  //     },
  //     layout: {
  //       visibility: "none",
  //       "text-field": "Buildings Prior to 1955",
  //       "text-font": ["Oswald Regular", "Arial Unicode MS Regular"],
  //     },
  //     paint: {
  //       "text-color": colorGray,
  //     },
  //   },
  //   "historicalBuildingsOutline"
  // );
  map.addLayer(
    {
      id: "universityHeightsArea",
      type: "line",
      source: {
        type: "geojson",
        data: "data/UniversityHeightsArea.geojson",
        attribution:
          'Designed and built by <a href="https://juanfrans.com/" target="_blank">Juan Francisco Saldarriaga</a> | <a href="mailto:info@newestamericans.com" target="_blank">Thoughts/Feedback</a> | <a href="https://juxtapose.knightlab.com/">JuxtaposeJS</a>',
      },
      paint: {
        "line-color": colorOrange,
        "line-width": 1.5,
        "line-dasharray": [2, 2],
      },
    },
    "historicalBuildingsOutline"
  );
  map.addLayer(
    {
      id: "newarkPolygon",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/UniversityHeightsArea.geojson",
      },
      layout: {
        visibility: "none"
      },
      paint: {
        "fill-color": colorOrange,
        "fill-opacity": 0.25      },
    },
    "universityHeightsArea"
  );
  map.addLayer(
    {
      id: "concaveHull64_outline",
      type: "line",
      source: {
        type: "geojson",
        data: "data/ConcaveHull64_Buffered.geojson",
      },
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": colorOrange,
        "line-width": 1,
        "line-dasharray": [2, 2],
      },
    },
    "newarkPolygon"
  );
  map.addLayer(
    {
      id: "concaveHull72_outline",
      type: "line",
      source: {
        type: "geojson",
        data: "data/ConcaveHull72_Buffered.geojson",
      },
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": colorOrange,
        "line-width": 1,
        "line-dasharray": [2, 2],
      },
    },
    "concaveHull64_outline"
  );
  map.addLayer(
    {
      id: "concaveHull64",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/ConcaveHull64_BufferedDifference.geojson",
      },
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": colorOrange,
        "fill-opacity": 0.15,
      },
    },
    "concaveHull72_outline"
  );
  map.addLayer(
    {
      id: "concaveHull72",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/ConcaveHull72_BufferedDifference.geojson",
      },
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": colorOrange,
        "fill-opacity": 0.15,
      },
    },
    "concaveHull64"
  );
  let allNames = [];
  allData.forEach((element) => {
    if (
      (element.displayName != "Vacant") &
      (element.displayName != "Vacant Store")
    ) {
      allNames.push(element);
    }
  });
  createNamesModal(allNames);
  autocomplete(document.getElementById("myInput"), allNames);
  console.log("Loaded all data...");
});

// Clicking on the map functionality
// Resetting selection based on clicks on the map
map.on("click", function () {
  console.log("Clicked on map...");
  clearAllHighlighted();
});
map.on("click", "allOrigins", function (e) {
  e.originalEvent.preventDefault();
  console.log("Clicked on an origin...");
  console.log("Clicked on " + String(e.features.length) + " features...");
  let selectedEntries = [];
  let entriesToHide = [];
  let selectedIDs = [];
  e.features.forEach((feature) => {
    selectedIDs.push(feature.id);
  });
  allData.forEach((element) => {
    if (selectedIDs.includes(parseInt(element.uniqueID))) {
      selectedEntries.push(element);
    } else {
      entriesToHide.push(element.uniqueID);
    }
  });
  highlightAndHide(entriesToHide, selectedIDs);
  // FIXME: See below...
  // the all data has to have, for each person, an origin id, a destination id, and a line id
  // each origin, destination, line, has to have a list of person id's in the properties
  // click on one, get the list of persons ids, run through those and get the origin, destination & line ids, use those to highlight and isolate
  createPopup(selectedEntries, e.lngLat);
});
map.on("click", "allDestinations", function (e) {
  if (!e.originalEvent.defaultPrevented) {
    console.log("Clicked on a destination...");
    console.log("Clicked on " + String(e.features.length) + " features...");
    let selectedEntries = [];
    let entriesToHide = [];
    let selectedIDs = [];
    e.features.forEach((feature) => {
      selectedIDs.push(feature.id);
    });
    allData.forEach((element) => {
      if (selectedIDs.includes(parseInt(element.uniqueID))) {
        selectedEntries.push(element);
      } else {
        entriesToHide.push(element.uniqueID);
      }
    });
    turnLinesOn();
    highlightAndHide(entriesToHide, selectedIDs);
    createPopup(selectedEntries, e.lngLat);
    e.originalEvent.preventDefault();
  }
});
map.on("click", "allLines", function (e) {
  if (!e.originalEvent.defaultPrevented) {
    console.log("Clicked on a line...");
    console.log("Clicked on " + String(e.features.length) + " features...");
    let selectedEntries = [];
    let entriesToHide = [];
    let selectedIDs = [];
    e.features.forEach((feature) => {
      selectedIDs.push(feature.id);
    });
    allData.forEach((element) => {
      if (selectedIDs.includes(parseInt(element.uniqueID))) {
        selectedEntries.push(element);
      } else {
        entriesToHide.push(element.uniqueID);
      }
    });
    highlightAndHide(entriesToHide, selectedIDs);
    createPopup(selectedEntries, e.lngLat);
    e.originalEvent.preventDefault();
  }
});
map.on("click", "slideThroughTimeLocations", function (e) {
  if (!e.originalEvent.defaultPrevented) {
    console.log("Clicked on slide through time location...");
    let image1 = e.features[0].properties.ImgBergURL;
    let image2 = e.features[0].properties.ImgGilberstonURL;
    let description = e.features[0].properties.Description;
    let popuphtml =
      "<div class='mt2 mb2 dark-gray'><h4 class='robotoCondensedBold ttu mb0'>Slide Through Time</h4><p class='robotoCondensed mt2'>" +
      description +
      "</p><div id='imageComparison'></div></div>";
    popup = new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(popuphtml)
      .addTo(map);
    slider = new juxtapose.JXSlider(
      "#imageComparison",
      [
        {
          src: image1,
        },
        {
          src: image2,
        },
      ],
      {
        animate: false,
        showLabels: false,
        showCredits: false,
        startingPosition: "50%",
        makeResponsive: true,
      }
    );
  }
});
map.on("click", "eppersonCentroid", function(e) {
  if (!e.originalEvent.defaultPrevented) {
    console.log("Clicked on over my dead body point...");
    let popuphtml =
      "<div class='mt2 mb2 dark-gray'><h4 class='robotoCondensedBold ttu mb0'>Over My Dead Body</h4>" +
      '<p class="robotoCondensed mt2">"I don’t care how many tanks, how many guns, how many K-9 dogs you get, ' +
      "I don’t care what the situation is. Unless you plan to kill every black woman, man and child in this " +
      'city it will not work. We must have housing".</p>' +
      "<img src='img/overDeadBody/LouiseEppersonHouse.png' class='mt2'>" +
      "<p class='robotoCondensed mt2'>Louise Epperson at her house on 12th Ave.</p>" +
      "<p class='robotoCondensed mt2'>To learn more about Louise Epperson and Newark's 1967 summer of discontent " +
      "click <a href='https://newestamericans.com/over-my-dead-body/' class='underline pointer dark-gray' target='_blank'>here</a>.</p>"
    popup = new mapboxgl.Popup({ className: "deadBody-popup"})
      .setLngLat(e.lngLat)
      .setHTML(popuphtml)
      .addTo(map);
  }
});
map.on("click", "newarkPolygon", function (e) {
  if (!e.originalEvent.defaultPrevented) {
    console.log("Clicked on Newark polygon...");
    let popuphtml =
      "<div class='mt2 mb2 dark-gray'><h4 class='robotoCondensedBold ttu mb0'>Newark 1967</h4>" +
      '<p class="robotoCondensed mt2">"As one anonymous NHA official put it, the authority' +
      " 'own[s] the slums. They can sell any piece of real estate in that area to a redeveloper before it’s" +
      "even acquired. And they don’t have to check with anyone before they do it'." +
      '"</p>' +
      "<p class='robotoCondensed mt2'>For a deeper dive into this story click " +
      "<a href='https://newestamericans.com/newark-1967-juggernaut-movement-resolution/' target='_blank' class='underline dark-gray pointer'>" +
      "here</a>.</p>"
    popup = new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(popuphtml)
      .addTo(map);
  }
});

// Create popup function
function createPopup(entries, lngLat) {
  let popuphtml = "";
  entries.forEach((element) => {
    let displayName = element.displayName;
    let orgAddress = element.originAddress;
    let orgApt = element.originApt;
    let destAddress = element.destinationAddress;
    let destApt = element.destinationApt;
    let destCity = element.destinationCity;
    let destZip = element.destinationZip;
    let destState = element.destinationState;
    let moveYear = element.year;
    if (moveYear == "1955") {
      moveYear = "1955 - 1964";
    } else if (moveYear == "1964") {
      moveYear = "1964 - 1974";
    } else {
      moveYear = "1974";
    }
    popuphtml +=
      '<div class="mt2 mb2 dark-gray"><h4 class="robotoCondensedBold ttu mb0">' +
      displayName +
      "</h4><p class='robotoCondensed mt2'>";
    if (orgAddress != null) {
      popuphtml += "Original address: <b>" + orgAddress + "</b><br>";
    }
    let destinationAddress;
    if (destAddress != null) {
      destinationAddress = destAddress;
    }
    if (destCity != null) {
      destinationAddress += ", " + destCity;
    }
    if (destState != null) {
      destinationAddress += ", " + destState;
    }
    if (destZip != null) {
      destinationAddress += ", " + destZip;
    }
    if (destinationAddress != null) {
      popuphtml += "Moved to: <b>" + destinationAddress + "</b><br>";
    }
    popuphtml += "Moved between <b>" + moveYear + "</b></p></div>";
  });
  popup = new mapboxgl.Popup({ offset: 10 })
    .setLngLat(lngLat)
    .setHTML(popuphtml)
    .addTo(map);
}

// Highlight selected function
function highlightAndHide(entriesToHide, entriesToHighlight) {
  map.setLayoutProperty("slideThroughTimeLocations", "visibility", "none");
  map.setLayoutProperty("slideThroughTimeLocationsInner", "visibility", "none");
  map.setLayoutProperty("eppersonCentroid", "visibility", "none");
  map.setLayoutProperty("eppersonCentroidInner", "visibility", "none");
  entriesToHide.forEach((element) => {
    map.setFeatureState(
      {
        source: "allOriginsInner",
        id: element,
      },
      {
        semiTransparent: true,
      }
    );
    map.setFeatureState(
      {
        source: "allDestinationsInner",
        id: element,
      },
      {
        semiTransparent: true,
      }
    );
    map.setFeatureState(
      {
        source: "allOrigins",
        id: element,
      },
      {
        semiTransparent: true,
      }
    );
    map.setFeatureState(
      {
        source: "allDestinations",
        id: element,
      },
      {
        semiTransparent: true,
      }
    );
  });
  entriesToHighlight.forEach((element) => {
    map.setFeatureState(
      {
        source: "allOrigins",
        id: element,
      },
      {
        highlighted: true,
      }
    );
    map.setFeatureState(
      {
        source: "allDestinations",
        id: element,
      },
      {
        highlighted: true,
      }
    );
    map.setFeatureState(
      {
        source: "allLines",
        id: element,
      },
      {
        highlighted: true,
      }
    );
    map.setFeatureState(
      {
        source: "allLines",
        id: element,
      },
      {
        thickLine: true,
      }
    );
  });
}
function clearAllHighlighted() {
  console.log("Clearing all feature states...");
  if (slideOn) {
    map.setLayoutProperty("slideThroughTimeLocations", "visibility", "visible");
    map.setLayoutProperty(
      "slideThroughTimeLocationsInner",
      "visibility",
      "visible"
    );
  }
  if (overOn) {
    map.setLayoutProperty("eppersonCentroid", "visibility", "visible");
    map.setLayoutProperty("eppersonCentroidInner", "visibility", "visible");
  }
  allData.forEach((element) => {
    map.setFeatureState(
      {
        source: "allOriginsInner",
        id: element.uniqueID,
      },
      {
        semiTransparent: false,
      }
    );
    map.setFeatureState(
      {
        source: "allOrigins",
        id: element.uniqueID,
      },
      {
        semiTransparent: false,
      }
    );
    map.setFeatureState(
      {
        source: "allDestinationsInner",
        id: element.uniqueID,
      },
      {
        semiTransparent: false,
      }
    );
    map.setFeatureState(
      {
        source: "allDestinations",
        id: element.uniqueID,
      },
      {
        semiTransparent: false,
      }
    );
    map.setFeatureState(
      {
        source: "allOrigins",
        id: element.uniqueID,
      },
      {
        highlighted: false,
      }
    );
    map.setFeatureState(
      {
        source: "allDestinations",
        id: element.uniqueID,
      },
      {
        highlighted: false,
      }
    );
    map.setFeatureState(
      {
        source: "allLines",
        id: element.uniqueID,
      },
      {
        highlighted: false,
      }
    );
    map.setFeatureState(
      {
        source: "allLines",
        id: element.uniqueID,
      },
      {
        thickLine: false,
      }
    );
  });
}

// Changing cursor to pointer and back
map.on("mouseenter", "allOrigins", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "allOrigins", function () {
  map.getCanvas().style.cursor = "";
});
map.on("mouseenter", "allDestinations", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "allDestinations", function () {
  map.getCanvas().style.cursor = "";
});
map.on("mouseenter", "allLines", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "allLines", function () {
  map.getCanvas().style.cursor = "";
});
map.on("mouseenter", "slideThroughTimeLocations", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "slideThroughTimeLocations", function () {
  map.getCanvas().style.cursor = "";
});
map.on("mouseenter", "eppersonCentroid", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "eppersonCentroid", function () {
  map.getCanvas().style.cursor = "";
});
map.on("mouseenter", "newarkPolygon", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "newarkPolygon", function () {
  map.getCanvas().style.cursor = "";
});

// Dropdowns functionality
year.onchange = function () {
  filter = this.value;
  setMapFilter(filter);
};
stories.onchange = function () {
  console.log(this.value);
  filter = this.value;
  setMapFilter(filter);
};

// Buttons functionality
viewLinesButton.onclick = function () {
  console.log("Viewing all lines...");
  console.log(filter);
  if (linesOn == true) {
    turnLinesOff();
  } else {
    turnLinesOn();
  }
};
turnLinesOn = function () {
  map.setLayoutProperty("allLines", "visibility", "visible");
  viewLinesButton.className = viewLinesButton.className.replace(
    "bg-transparent",
    "bg-light-gray"
  );
  linesOn = true;
};
turnLinesOff = function () {
  map.setLayoutProperty("allLines", "visibility", "none");
  viewLinesButton.className = viewLinesButton.className.replace(
    "bg-light-gray",
    "bg-transparent"
  );
  linesOn = false;
};
resetButton.onclick = function () {
  console.log("Reset filters...");
  clearFilters();
  year.value = "all";
  stories.value = "all";
  myInput.value = "";
};

// Creating the map filters
function setMapFilter(filter) {
  console.log("Map filter = " + filter);
  removePopup();
  clearAllHighlighted();
  namesModal.style.display = "none";
  if (filter == "all") {
    clearFilters();
  } else if (filter == "1955") {
    slideOn = true;
    overOn = true;
    newarkOn = true;
    console.log("Filtering for 1955 - 1964...");
    slideModal.style.display = "none";
    overModal.style.display = "none";
    newarkModal.style.display = "none";
    stories.value = "all";
    map.flyTo({
      center: [-74.189, 40.73],
      zoom: 12,
      pitch: 0,
      bearing: 0,
      essential: true,
    });
    map.setLayoutProperty("allOrigins", "visibility", "visible");
    map.setLayoutProperty("allOriginsInner", "visibility", "visible");
    map.setLayoutProperty("allDestinations", "visibility", "visible");
    map.setLayoutProperty("allDestinationsInner", "visibility", "visible");
    map.setLayoutProperty("historicalBuildings", "visibility", "none");
    map.setLayoutProperty("historicalBuildingsOutline", "visibility", "none");
    map.setLayoutProperty("newarkPolygon", "visibility", "none");
    // map.setLayoutProperty("historicalBuildingsLabel", "visibility", "none");
    map.setLayoutProperty("concaveHull72", "visibility", "none");
    map.setLayoutProperty("concaveHull72_outline", "visibility", "none");
    map.setLayoutProperty("slideThroughTimeLocations", "visibility", "none");
    map.setLayoutProperty("eppersonCentroid", "visibility", "none");
    map.setLayoutProperty("eppersonCentroidInner", "visibility", "none");
    map.setLayoutProperty("eppersonHouse", "visibility", "none");
    map.setLayoutProperty("eppersonHouseOutline", "visibility", "none");
    map.setLayoutProperty(
      "slideThroughTimeLocationsInner",
      "visibility",
      "none"
    );
    map.setLayoutProperty("concaveHull64", "visibility", "visible");
    map.setLayoutProperty("concaveHull64_outline", "visibility", "visible");
    map.setFilter("allDestinationsInner", [
      "==",
      ["get", "year"],
      ["to-number", filter],
    ]);
    map.setFilter("allDestinations", [
      "==",
      ["get", "year"],
      ["to-number", filter],
    ]);
    map.setFilter("allOriginsInner", [
      "==",
      ["get", "year"],
      ["to-number", filter],
    ]);
    map.setFilter("allOrigins", ["==", ["get", "year"], ["to-number", filter]]);
    map.setFilter("allLines", ["==", ["get", "year"], ["to-number", filter]]);
  } else if (filter == "1964") {
    console.log("Filtering for 1964 - 1972...");
    slideOn = true;
    overOn = true;
    slideModal.style.display = "none";
    overModal.style.display = "none";
    newarkModal.style.display = "none";
    stories.value = "all";
    map.flyTo({
      center: [-74.189, 40.735],
      zoom: 11.5,
      pitch: 0,
      bearing: 0,
      essential: true,
    });
    map.setLayoutProperty("allOrigins", "visibility", "visible");
    map.setLayoutProperty("allOriginsInner", "visibility", "visible");
    map.setLayoutProperty("allDestinations", "visibility", "visible");
    map.setLayoutProperty("allDestinationsInner", "visibility", "visible");
    map.setLayoutProperty("historicalBuildings", "visibility", "none");
    map.setLayoutProperty("historicalBuildingsOutline", "visibility", "none");
    map.setLayoutProperty("newarkPolygon", "visibility", "none");
    // map.setLayoutProperty("historicalBuildingsLabel", "visibility", "none");
    map.setLayoutProperty("concaveHull64", "visibility", "none");
    map.setLayoutProperty("concaveHull64_outline", "visibility", "none");
    map.setLayoutProperty("slideThroughTimeLocations", "visibility", "none");
    map.setLayoutProperty(
      "slideThroughTimeLocationsInner",
      "visibility",
      "none"
    );
    map.setLayoutProperty("concaveHull72", "visibility", "visible");
    map.setLayoutProperty("concaveHull72_outline", "visibility", "visible");
    map.setLayoutProperty("eppersonCentroid", "visibility", "none");
    map.setLayoutProperty("eppersonCentroidInner", "visibility", "none");
    map.setLayoutProperty("eppersonHouse", "visibility", "none");
    map.setLayoutProperty("eppersonHouseOutline", "visibility", "none");
    map.setFilter("allDestinationsInner", [
      "==",
      ["get", "year"],
      ["to-number", filter],
    ]);
    map.setFilter("allDestinations", [
      "==",
      ["get", "year"],
      ["to-number", filter],
    ]);
    map.setFilter("allOriginsInner", [
      "==",
      ["get", "year"],
      ["to-number", filter],
    ]);
    map.setFilter("allOrigins", ["==", ["get", "year"], ["to-number", filter]]);
    map.setFilter("allLines", ["==", ["get", "year"], ["to-number", filter]]);
  } else if (filter == "slide") {
    slideOn = true;
    overOn = false;
    console.log("Filtering for slide through time points...");
    slideModal.style.display = "block";
    overModal.style.display = "none";
    newarkModal.style.display = "none";
    year.value = "all";
    turnLinesOff();
    map.setLayoutProperty("slideThroughTimeLocations", "visibility", "visible");
    map.setLayoutProperty(
      "slideThroughTimeLocationsInner",
      "visibility",
      "visible"
    );
    map.setLayoutProperty("newarkPolygon", "visibility", "none");
    map.setLayoutProperty("concaveHull64", "visibility", "none");
    map.setLayoutProperty("concaveHull64_outline", "visibility", "none");
    map.setLayoutProperty("concaveHull72", "visibility", "none");
    map.setLayoutProperty("concaveHull72_outline", "visibility", "none");
    map.setLayoutProperty("allOrigins", "visibility", "none");
    map.setLayoutProperty("allOriginsInner", "visibility", "none");
    map.setLayoutProperty("allDestinations", "visibility", "none");
    map.setLayoutProperty("allDestinationsInner", "visibility", "none");
    map.setLayoutProperty("allLines", "visibility", "none");
    map.setLayoutProperty("historicalBuildings", "visibility", "visible");
    map.setLayoutProperty(
      "historicalBuildingsOutline",
      "visibility",
      "visible"
    );
    map.setLayoutProperty("eppersonCentroid", "visibility", "none");
    map.setLayoutProperty("eppersonCentroidInner", "visibility", "none");
    map.setLayoutProperty("eppersonHouse", "visibility", "none");
    map.setLayoutProperty("eppersonHouseOutline", "visibility", "none");
    // map.setLayoutProperty("historicalBuildingsLabel", "visibility", "visible");
    map.flyTo({
      center: [-74.189, 40.74],
      zoom: 15.5,
      bearing: 0,
      pitch: 0,
      essential: true,
    });
  } else if (filter == "deadBody") {
    console.log("Filtering for over my dead body points...");
    slideOn = false;
    overOn = true;
    overModal.style.display = "block";
    slideModal.style.display = "none";
    newarkModal.style.display = "none";
    year.value = "all";
    turnLinesOff();
    map.setLayoutProperty("eppersonCentroid", "visibility", "visible");
    map.setLayoutProperty("eppersonCentroidInner", "visibility", "visible");
    map.setLayoutProperty("eppersonHouse", "visibility", "visible");
    map.setLayoutProperty("eppersonHouseOutline", "visibility", "visible");
    map.setLayoutProperty("newarkPolygon", "visibility", "none");
    map.setLayoutProperty("slideThroughTimeLocations", "visibility", "none");
    map.setLayoutProperty(
      "slideThroughTimeLocationsInner",
      "visibility",
      "none"
    );
    map.setLayoutProperty("concaveHull64", "visibility", "none");
    map.setLayoutProperty("concaveHull64_outline", "visibility", "none");
    map.setLayoutProperty("concaveHull72", "visibility", "none");
    map.setLayoutProperty("concaveHull72_outline", "visibility", "none");
    map.setLayoutProperty("allOrigins", "visibility", "none");
    map.setLayoutProperty("allOriginsInner", "visibility", "none");
    map.setLayoutProperty("allDestinations", "visibility", "none");
    map.setLayoutProperty("allDestinationsInner", "visibility", "none");
    map.setLayoutProperty("allLines", "visibility", "none");
    map.setLayoutProperty("historicalBuildings", "visibility", "visible");
    map.setLayoutProperty(
      "historicalBuildingsOutline",
      "visibility",
      "visible"
    );
    map.flyTo({
      center: [-74.1885, 40.74],
      zoom: 16,
      pitch: 0,
      bearing: 0,
      essential: true
    });
  }
  else if (filter == "newark") {
    console.log("Filtering for Newark 1967...");
    slideOn = false;
    overOn = false;
    newarkOn = true;
    overModal.style.display = "none";
    slideModal.style.display = "none";
    newarkModal.style.display = "block";
    year.value = "all";
    turnLinesOff();
    map.setLayoutProperty("newarkPolygon", "visibility", "visible");
    map.setLayoutProperty("eppersonCentroid", "visibility", "none");
    map.setLayoutProperty("eppersonCentroidInner", "visibility", "none");
    map.setLayoutProperty("eppersonHouse", "visibility", "none");
    map.setLayoutProperty("eppersonHouseOutline", "visibility", "none");
    map.setLayoutProperty("slideThroughTimeLocations", "visibility", "none");
    map.setLayoutProperty(
      "slideThroughTimeLocationsInner",
      "visibility",
      "none"
    );
    map.setLayoutProperty("concaveHull64", "visibility", "none");
    map.setLayoutProperty("concaveHull64_outline", "visibility", "none");
    map.setLayoutProperty("concaveHull72", "visibility", "none");
    map.setLayoutProperty("concaveHull72_outline", "visibility", "none");
    map.setLayoutProperty("allOrigins", "visibility", "none");
    map.setLayoutProperty("allOriginsInner", "visibility", "none");
    map.setLayoutProperty("allDestinations", "visibility", "none");
    map.setLayoutProperty("allDestinationsInner", "visibility", "none");
    map.setLayoutProperty("allLines", "visibility", "none");
    map.setLayoutProperty("historicalBuildings", "visibility", "none");
    map.setLayoutProperty(
      "historicalBuildingsOutline",
      "visibility",
      "none"
    );
    map.flyTo({
      center: [-74.189, 40.740],
      zoom: 16,
      pitch: 60,
      bearing: 45,
      essential: true,
    });
  }
}

// Clearing the filters
function clearFilters() {
  console.log("Clearing filters...");
  map.flyTo({
    center: [-74.189, 40.74],
    zoom: 13.5,
    pitch: 0,
    bearing: 0,
    essential: true,
  });
  year.value = "all";
  stories.value = "all";
  filter = "all";
  namesModal.style.display = "none";
  slideModal.style.display = "none";
  overModal.style.display = "none";
  newarkModal.style.display = "none";
  slideOn = true;
  overOn = true;
  newarkOn = true;
  clearAllHighlighted();
  removePopup();
  map.setFilter("allOrigins", null);
  map.setFilter("allDestinations", null);
  map.setFilter("allLines", null);
  map.setFilter("allOriginsInner", null);
  map.setFilter("allDestinationsInner", null);
  map.setFilter("allLines", null);
  map.setLayoutProperty("historicalBuildingsOutline", "visibility", "none");
  map.setLayoutProperty("historicalBuildings", "visibility", "none");
  map.setLayoutProperty("eppersonCentroid", "visibility", "visible");
  map.setLayoutProperty("eppersonCentroidInner", "visibility", "visible");
  map.setLayoutProperty("eppersonHouse", "visibility", "none");
  map.setLayoutProperty("eppersonHouseOutline", "visibility", "none");
  map.setLayoutProperty("concaveHull64", "visibility", "visible");
  map.setLayoutProperty("concaveHull64_outline", "visibility", "visible");
  map.setLayoutProperty("concaveHull72", "visibility", "visible");
  map.setLayoutProperty("concaveHull72_outline", "visibility", "visible");
  map.setLayoutProperty("allOrigins", "visibility", "visible");
  map.setLayoutProperty("allOriginsInner", "visibility", "visible");
  map.setLayoutProperty("allDestinations", "visibility", "visible");
  map.setLayoutProperty("allDestinationsInner", "visibility", "visible");
  map.setLayoutProperty("slideThroughTimeLocations", "visibility", "visible");
  map.setLayoutProperty(
    "slideThroughTimeLocationsInner",
    "visibility",
    "visible"
  );
  map.setLayoutProperty("allLines", "visibility", "none");
  map.setLayoutProperty("newarkPolygon", "visibility", "none");
  // histBuildingsOn = false;
  turnLinesOff();
}

function removePopup() {
  if (typeof popup !== "undefined") {
    console.log("Removing popup...");
    popup.remove();
  }
}

// Modal functionality
closeModal.onclick = function () {
  modal.style.display = "none";
};
openModal.onclick = function () {
  slideModal.style.display = "none";
  newarkModal.style.display = "none";
  overModal.style.display = "none";
  modal.style.display = "block";
};
window.onclick = function (event) {
  if (event.target != modalContent && !modalContent.contains(event.target) && event.target != openModal) {
    modal.style.display = "none";
  }
  if (event.target == namesModal) {
    namesModal.style.display = "none";
  }
};
closeNamesModal.onclick = function () {
  namesModal.style.display = "none";
};
closeSlideModal.onclick = function () {
  slideModal.style.display = "none";
  // clearFilters();
};
closeOverModal.onclick = function () {
  overModal.style.display = "none";
  // clearFilters();
};
closeNewarkModal.onclick = function () {
  newarkModal.style.display = "none";
  // clearFilters();
};
viewAllNamesButton.onclick = function () {
  clearFilters();
  slideModal.style.display = "none";
  newarkModal.style.display = "none";
  overModal.style.display = "none";
  namesModal.style.display = "block";
};
createNamesModal = function (allNames) {
  console.log("Creating the names modal with " + allNames.length + " names...");
  let namesModalContent = document.getElementById("namesModalContent");
  let counter = 0;
  let newRow;
  allNames.forEach((element) => {
    // Create row element and style it
    if (counter % 3 == 0) {
      newRow = document.createElement("div");
      newRow.classList.add("cf");
      newRow.classList.add("ph3");
    }
    // Create text element
    let newName = document.createTextNode(element.displayName);
    // Create "p" element, style it and add the text element
    let newElementP = document.createElement("p");
    // newElementP.classList.add("gray");
    newElementP.classList.add("f6");
    newElementP.classList.add("mv1");
    newElementP.classList.add("hover-gold");
    newElementP.classList.add("animate");
    newElementP.classList.add("pointer");
    newElementP.setAttribute("value", element.uniqueID);
    newElementP.setAttribute("id", element.uniqueID);
    // Add event listener
    document.addEventListener("click", function (e) {
      if (e.target && e.target.id == element.uniqueID) {
        if (typeof popup !== "undefined") {
          console.log("Removing popup...");
          popup.remove();
        }
        let selectedIDs = [];
        let entriesToHide = [];
        allData.forEach((element) => {
          if (element.uniqueID == e.target.id) {
            selectedIDs.push(element.uniqueID);
            let lngLat = [];
            let flyZoom;
            if (element.destinationAddress != null) {
              turnLinesOn();
              lngLat = [element.midPoint[0], element.midPoint[1]];
              flyZoom = rangeTransform(element.length, 0, 0.5, 14, 11);
            } else {
              lngLat = [element.originLon, element.originLat];
              flyZoom = 15;
            }
            namesModal.style.display = "none";
            map.flyTo({
              center: lngLat,
              zoom: flyZoom,
              essential: true,
            });
            selectedEntries = [element];
            createPopup(selectedEntries, lngLat);
          } else {
            entriesToHide.push(element.uniqueID);
          }
        });
        highlightAndHide(entriesToHide, selectedIDs);
      }
    });
    newElementP.appendChild(newName);
    // Create new "div" element, style it and add the "p" element
    let newNameElement = document.createElement("div");
    newNameElement.classList.add("fl");
    newNameElement.classList.add("w-third");
    newNameElement.classList.add("ph1");
    newNameElement.classList.add("pv0");
    newNameElement.appendChild(newElementP);
    newRow.appendChild(newNameElement);
    // Add row element to the modal
    if (counter % 5 == 0) {
      namesModalContent.appendChild(newRow);
    }
    counter += 1;
  });
};
function myFunction(x) {
  if (x.matches) {
    // If media query matches
    mobileModal.className = mobileModal.className.replace("dn", "db");
  } else {
    mobileModal.className = mobileModal.className.replace("db", "dn");
  }
}
var x = window.matchMedia("(max-width: 1200px)");
myFunction(x); // Call listener function at run time
// x.addListener(myFunction) // Attach listener function on state changes
closeMobileModal.onclick = function () {
  mobileModal.className = mobileModal.className.replace("db", "dn");
};

// Autocomplete function
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    a.classList.add("dark-gray");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (
        arr[i].displayName.substr(0, val.length).toUpperCase() ==
        val.toUpperCase()
      ) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        b.classList.add("pointer");
        b.classList.add("hover-bg-light-gray");
        /*make the matching letters bold:*/
        b.innerHTML =
          "<strong>" + arr[i].displayName.substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].displayName.substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML +=
          "<input type='hidden' value='" + arr[i].displayName + "'>";
        b.dataset.uniqueID = arr[i].uniqueID;
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          inp.dataset.uniqueID = this.dataset.uniqueID;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

searchBarButton.onclick = function () {
  clearAllHighlighted();
  removePopup();
  let selectedIDs = [];
  let entriesToHide = [];
  allData.forEach((element) => {
    if (element.uniqueID == myInput.dataset.uniqueID) {
      selectedIDs.push(element.uniqueID);
      let lngLat = [];
      let flyZoom;
      if (element.destinationAddress != null) {
        turnLinesOn();
        lngLat = [element.midPoint[0], element.midPoint[1]];
        flyZoom = rangeTransform(element.length, 0, 0.5, 14, 11);
      } else {
        lngLat = [element.originLon, element.originLat];
        flyZoom = 15;
      }
      namesModal.style.display = "none";
      map.flyTo({
        center: lngLat,
        zoom: flyZoom,
        essential: true,
      });
      let elementArray = [element];
      createPopup(elementArray, lngLat);
    } else {
      entriesToHide.push(element.uniqueID);
    }
  });
  highlightAndHide(entriesToHide, selectedIDs);
};
