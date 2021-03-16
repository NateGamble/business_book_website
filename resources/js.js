$(document).ready(function () {

  $("#home").click(function () {
    $("#info-container").load("resources/home.html");
  });

  $("#loginform").click(function () {
    $("#info-container").load("resources/loginform.html");
  });

  $("#registerform").click(function () {
    $("#info-container").load("resources/registerform.html");
  });

  $("#userpage").click(function () {
    $("#info-container").load("resources/users.html");
  });

  $("#businessbyidpage").click(function () {
    $("#info-container").load("resources/businessbyid.html");
  });

});

let geocoder;
let map;

/* 
  Overview:
  1) Generate the map
  2) Create relevent map control buttons
  3) Center map on user location
  4) Populate map with business info
*/
function initMap() {
  //generating map
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: { lat: 43.4578, lng: -88.8373 },
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.SATELLITE //roadmap - satellite - hybrid - terrain
  });
  geocoder = new google.maps.Geocoder();

  //create map control buttons
  createButtons(); 
  
  // centers map on the users location
  centerMap(); 

  //Pulls businesses and then populates the map with them
  getBusinesses();
  //setTimeout(addNewMarker(), 1000);
  //populateMap();
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function createButtons() {
  createButtonCurrentLocation();
  addMarker();
  addInfo();
}


function createButtonCurrentLocation() {
  let iw_currentLocation = new google.maps.InfoWindow();
  const locationButton = document.getElementById("btn-current-location");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          iw_currentLocation.setPosition(pos);
          iw_currentLocation.setContent("You Are Here.");
          iw_currentLocation.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, iw_currentLocation, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, iw_currentLocation, map.getCenter());
    }
  });
}

function addInfo() {
  const myLatlng = { lat: -25.363, lng: 131.044 };
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",
    position: myLatlng,
  });
  //infoWindow.open(map);
  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {

    infoWindow.close();// Close the current InfoWindow.
    infoWindow = new google.maps.InfoWindow({// Create a new InfoWindow.
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infoWindow.open(map);
  });

}

function addMarker() {

  const image1 = {
    //url:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    url: "resources/images/shirtIcon.png",
    size: new google.maps.Size(20, 20),// This marker is 20 pixels wide by 20 pixels high.
    origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
    anchor: new google.maps.Point(0, 20)// The anchor for this image is the base.
  };
  const image0 = {
    //url:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    url: "resources/images/burgerIcon.png",
    size: new google.maps.Size(20, 20),// This marker is 20 pixels wide by 20 pixels high.
    origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
    anchor: new google.maps.Point(0, 20)// The anchor for this image is the base.
  };

  const business = [
    ["Willie's House of Debauchery", 43.455678, -88.84455373, 1, image0],
    ["Piggly Wiggly", 43.4542445738, -88.83662373, 1, image0],
    ["Drowned Rat: Pest Control", 43.459878, -88.8485085373, 1, image1],
    ["Daily Thrift", 43.4578, -88.83, 2, image1],
    ["Berries Baked Goods", 43.458, -88.8373, 1, image0]
  ];

  const shape = {// Shapes define the clickable region of the icon. The type defines an HTML
    coords: [1, 1, 1, 20, 20, 20, 20, 1],//[top-left(x,y),top-right(x,y),bottom-right(x,y),bottom-left(x,y)]
    type: "poly"
  };

  for (let i = 0; i < business.length; i++) {
    new google.maps.Marker({
      position: { lat: business[i][1], lng: business[i][2] },
      map,
      icon: business[i][4],
      shape: shape,
      title: business[i][0],
      zIndex: business[i][3]
    });
  }
}

function moveMarker(map, marker) {

  //delayed so you can see it move
  setTimeout(function () {

    marker.setPosition(new google.maps.LatLng(43.4578, -88.8373));
    map.panTo(new google.maps.LatLng(43.4578, -88.8373));

  }, 1500);

};

function centerMap(){
	let iw_currentLocation = new google.maps.InfoWindow();
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				iw_currentLocation.setPosition(pos);
				iw_currentLocation.setContent("You Are Here.");
				iw_currentLocation.open(map);
				map.setCenter(pos);
        },
        () => {
          handleLocationError(true, iw_currentLocation, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, iw_currentLocation, map.getCenter());
    }
}

//takes in string address and returns lat/long mapsapi location object
function codeAddress(address) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      return results[0].geometry.location;
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function populateMap(businesses) {
  //need to get our business listings
  for (let business of businesses) {
      console.log(business.location);
      let address = business.location;
      let name = business.businessName;
      //let address = "1201 Broadway Ave S Ste 100, Rochester, MN 55904";
      //let name = "chickenfilet";
      let businessStatus =
      '<h1 id="firstHeading" class="firstHeading" style="text-align:center">BusinessName</h1>' +
      '<div id="bodyContent">' +
      '<p style="text-align:left">content</p>' +
      '</div>';
      businessStatus = businessStatus.replace("BusinessName", name);
      //console.log(...business.posts);
      if (business.posts.length === 0) {
        businessStatus = businessStatus.replace("content", "No status to display :)");
      } else {
        businessStatus = businessStatus.replace("content", business.posts[business.posts.length - 1].body);
      }

      geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK") {
              map.setCenter(results[0].geometry.location);
              const infowindow = new google.maps.InfoWindow({
                  content: businessStatus
              });
              let marker = new google.maps.Marker({
                  title: name,
                  map: map,
                  position: results[0].geometry.location
              });
              marker.addListener("click", () => {
                  infowindow.open(map, marker);
              });
          } else {
              alert("Geocode was not successful for the following reason: " + status);
          }
      });
  }
}

async function getBusinesses() {
  //GET BUSINESSES
  let xhr = new XMLHttpRequest(); // Creating a XHR object
  let url = "http://localhost:5000/businesses";

  xhr.open("GET", url, true); // open a connection

  // Set the request header i.e. which type of content you are sending
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () { // Create a state change callback
      if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(this.responseText); // Print received data from server
          populateMap(JSON.parse(this.responseText));
          //return this.responseText;
          //alert("Got business data");
      } else if (xhr.readyState === 4 && xhr.status >= 400) {
        alert("Something went wrong while registering your account!");
      }
  };
  // Sending data with the request
  xhr.send(null);
}
