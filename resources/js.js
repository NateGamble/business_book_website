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

  $("#adminpage").click(function() {
    $("#info-container").load("resources/adminpage.html");
  });

  $("#ownerpage").click(function() {
    $("#info-container").load("resources/ownerpage.html");
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

  //Pulls businesses and then populates the map with them
  getBusinesses();
  //setTimeout(addNewMarker(), 1000);
  //populateMap();

  // centers map on the users location
  centerMap(); 
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
  //addInfo();
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

// function addInfo() {
//   const myLatlng = { lat: -25.363, lng: 131.044 };
//   let infoWindow = new google.maps.InfoWindow({
//     content: "Click the map to get Lat/Lng!",
//     position: myLatlng,
//   });
//   //infoWindow.open(map);
//   // Configure the click listener.
//   map.addListener("click", (mapsMouseEvent) => {

//     infoWindow.close();// Close the current InfoWindow.
//     infoWindow = new google.maps.InfoWindow({// Create a new InfoWindow.
//       position: mapsMouseEvent.latLng,
//     });
//     infoWindow.setContent(
//       JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
//     );
//     infoWindow.open(map);
//   });

// }

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
  console.log(businesses);
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
              //map.setCenter(results[0].geometry.location);
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
                  fillHomeInfo(business);
                  let homeButton = document.querySelector("#homeoption");
                  homeButton.addEventListener("click", () => {
                    fillHomeInfo(business);
                  })
                  let postButton = document.querySelector("#postoption");
                  postButton.addEventListener("click", () => {
                    fillHomeWithPosts(business);
                  })
                  let reviewButton = document.querySelector("#reviewsoption");
                  reviewButton.addEventListener("click", () => {
                    fillHomeWithReviews(business);
                  })
              });
          } else {
              alert("Geocode was not successful for the following reason: " + status);
          }
      });
  }
  
}

async function getBusinessInfo() {
  //GET BUSINESSES
  let myUrl = "https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses";
  await fetch(myUrl)
  .then(response => response.json())
  .then(data => populateMap(data));
}

function fillHomeWithPosts(business) {
  let infoDiv = document.querySelector("#info-container");
  infoDiv.innerHTML = "";
  let postList = business.posts;

  let displayTable = document.createElement("table");

  let displayHeaderRow = document.createElement("tr");
  let headerType = document.createElement("th");
  let headerBody = document.createElement("th");
  let headerTime = document.createElement("th");
  headerType.textContent = "Category";
  headerBody.textContent = "Post";
  headerTime.textContent = "Time";
  displayHeaderRow.appendChild(headerType);
  displayHeaderRow.appendChild(headerBody);
  displayHeaderRow.appendChild(headerTime);
  displayTable.appendChild(displayHeaderRow);
  infoDiv.appendChild(displayTable);

  for (let post of postList) {
    //looking at single post object now
    console.log("displaying post");
    console.log(post);

    let postInfoRow = document.createElement("tr");
    let typeCell = document.createElement("td");
    typeCell.textContent = post.postType;
    let postCell = document.createElement("td");
    postCell.textContent = post.body;
    let timeCell = document.createElement("td");
    timeCell.textContent = post.createdTime;
    postInfoRow.appendChild(typeCell);
    postInfoRow.appendChild(postCell);
    postInfoRow.appendChild(timeCell);
    displayTable.appendChild(postInfoRow);
  }

}

function fillHomeWithReviews(business) {
  let infoDiv = document.querySelector("#info-container");
  infoDiv.innerHTML = "";
  let reviewList = business.reviews;

  let displayTable = document.createElement("table");

  let displayHeaderRow = document.createElement("tr");
  let headerRating = document.createElement("th");
  let headerReview = document.createElement("th");
  headerRating.textContent = "Rating";
  headerReview.textContent = "Review";
  displayHeaderRow.appendChild(headerRating);
  displayHeaderRow.appendChild(headerReview);
  displayTable.appendChild(displayHeaderRow);
  infoDiv.appendChild(displayTable);

  for (let review of reviewList) {
    //looking at single post object now
    console.log("displaying review");
    console.log(review);

    let reviewInfoRow = document.createElement("tr");
    let ratingCell = document.createElement("td");
    ratingCell.textContent = review.rating;
    let reviewCell = document.createElement("td");
    reviewCell.textContent = review.review;
    reviewInfoRow.appendChild(ratingCell);
    reviewInfoRow.appendChild(reviewCell);
    displayTable.appendChild(reviewInfoRow);
  }
}

function fillHomeInfo(business) {
  console.log("inside filling home");
  let owner = business.owner;
  let email = business.email;
  let location = business.location;
  let reviewList = business.reviews;
  let hourList = business.hours;
  //let postList = business.posts;
  console.log(owner, email, location, hourList, reviewList);

  let infoDiv = document.querySelector("#info-container");
  infoDiv.innerHTML = "";

  let displayTable = document.createElement("table");
  let displayHeaderRow = document.createElement("tr");
  let headerPhone = document.createElement("th");
  let headerEmail = document.createElement("th");
  let headerLocation = document.createElement("th");
  //still need to make hours table

  headerPhone.textContent = "Phone #";
  headerEmail.textContent = "Email";
  headerLocation.textContent = "Location";

  displayHeaderRow.appendChild(headerPhone);
  displayHeaderRow.appendChild(headerEmail);
  displayHeaderRow.appendChild(headerLocation);
  displayTable.appendChild(displayHeaderRow);
  infoDiv.appendChild(displayTable);

  let homeInfoRow = document.createElement("tr");
  let phoneCell = document.createElement("td");
  phoneCell.textContent = owner.phoneNumber;
  let emailCell = document.createElement("td");
  emailCell.textContent = email;
  let locationCell = document.createElement("td");
  locationCell.textContent = location;
  homeInfoRow.appendChild(phoneCell);
  homeInfoRow.appendChild(emailCell);
  homeInfoRow.appendChild(locationCell);
  displayTable.appendChild(homeInfoRow);

  //GENERATING HOURS TABLE

  let hoursTable = document.createElement("table");

  let hoursHeaderRow = document.createElement("tr");
  let beginEndHeader = document.createElement("th");
  let mondayHeader = document.createElement("th");
  let tuesdayHeader = document.createElement("th");
  let wednesdayHeader = document.createElement("th");
  let thursdayHeader = document.createElement("th");
  let fridayHeader = document.createElement("th");
  let saturdayHeader = document.createElement("th");
  let sundayHeader = document.createElement("th");

  mondayHeader.textContent = "Monday";
  tuesdayHeader.textContent = "Tuesday";
  wednesdayHeader.textContent = "Wednesday";
  thursdayHeader.textContent = "Thursday";
  fridayHeader.textContent = "Friday";
  saturdayHeader.textContent = "Saturday";
  sundayHeader.textContent = "Sunday";
  
  hoursHeaderRow.appendChild(beginEndHeader);
  hoursHeaderRow.appendChild(mondayHeader);
  hoursHeaderRow.appendChild(tuesdayHeader);
  hoursHeaderRow.appendChild(wednesdayHeader);
  hoursHeaderRow.appendChild(thursdayHeader);
  hoursHeaderRow.appendChild(fridayHeader);
  hoursHeaderRow.appendChild(saturdayHeader);
  hoursHeaderRow.appendChild(sundayHeader);
  //we have row set up like |  |monday|tuesday|wednesday...


  hoursTable.appendChild(hoursHeaderRow);
  infoDiv.appendChild(hoursTable);

  for (let day of hourList) {
    //looking at single post object now
    console.log("displaying day");
    console.log(day);

    var closedDateParts = day.closed.split('T');
    var closedDate = closedDateParts[0];
    var closedTime = closedDateParts[1];
    closedTime = closedTime.split('+')[0];
    closedTime = closedTime.substring(0,5);
    console.log(closedDate);
    console.log(convert(closedTime));
  
    // let reviewInfoRow = document.createElement("tr");
    // let ratingCell = document.createElement("td");
    // ratingCell.textContent = review.rating;
    // let reviewCell = document.createElement("td");
    // reviewCell.textContent = review.review;
    // reviewInfoRow.appendChild(ratingCell);
    // reviewInfoRow.appendChild(reviewCell);
    // displayTable.appendChild(reviewInfoRow);
  }

}

function convert(input) {
  return moment(input, 'HH:mm').format('h:mm A');
}


// getDateTime(returnDate) {
//   var dateParts = returnDate.split('T');
//   var date = dateParts[0];
//   var time = dateParts[1];
//   time = time.split('+')[0];

// }

async function getBusinesses() {
  //GET BUSINESSES

  let myUrl = "https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses";
  await fetch(myUrl)
  .then(response => response.json())
  .then(data => populateMap(data));

  // let myUrl = "https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses";
  // const initDetails = {
  //   method: 'get',
  //   credentials: 'include',
  //   headers: {
  //       "Content-Type": "application/json; charset=utf-8"
  //   },
  //   mode: "cors"
  // }
  // fetch(myUrl, initDetails)
  // .then(response => {
  //   if (response.status !== 200) {
  //       console.log('Status Code: ' + response.status);
  //       return;
  //   }
  //   console.log(response.headers.get("Content-Type"));
  //   return response.json();
  // })
  // .then(function (data) {

  //   console.log(JSON.stringify(data));

  //   appendData(data);
  // })
  // .catch(err => {
  //     console.log('Fetch Error :-S', err);
  // });

  // let xhr = new XMLHttpRequest(); // Creating a XHR object
  

  // xhr.open("GET", url, true); // open a connection

  // // Set the request header i.e. which type of content you are sending
  // xhr.setRequestHeader("Content-Type", "application/json");

  // xhr.onreadystatechange = function () { // Create a state change callback
  //     if (xhr.readyState === 4 && xhr.status === 200) {
  //         console.log(this.responseText); // Print received data from server
  //         populateMap(JSON.parse(this.responseText));
  //         //return this.responseText;
  //         //alert("Got business data");
  //     } else if (xhr.readyState === 4 && xhr.status >= 400) {
  //       alert("Something went wrong while registering your account!");
  //     }
  // };
  // // Sending data with the request
  // xhr.send(null);
}
