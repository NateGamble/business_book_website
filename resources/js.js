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

  // $("#userpage").click(function () {
  //   $("#info-container").load("resources/users.html");
  // });

  $("#adminpage").click(function () {
    $("#info-container").load("resources/adminpage.html");
  });

  $("#ownerpage").click(function () {
    $("#info-container").load("resources/ownerpage.html");
  });

  // $("#businessbyidpage").click(function () {
  //   $("#info-container").load("resources/businessbyid.html");
  // });

  $("#logout").click(function () {
    if (!localStorage.getItem("usrp")) {
      alert("You are not logged in");
    } else {
      localStorage.removeItem("usrp");
      alert("You have been logged off");
      $("#info-container").load("resources/home.html");
    }
  });

  let favoriteButton = document.querySelector("#favoritesoption");
  favoriteButton.addEventListener("click", () => {
    let ppc = localStorage.getItem("usrp");

    if (!ppc) {
      alert("You cannot access favorites since you are not logged in.");
      return;
    }

    fillHomeWithFavorites(JSON.parse(ppc));
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
  //addMarker();
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
          //createLocationMarker(position.coords.latitude, position.coords.longitude,);
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

function moveMarker(map, marker) {

  //delayed so you can see it move
  setTimeout(function () {

    marker.setPosition(new google.maps.LatLng(43.4578, -88.8373));
    map.panTo(new google.maps.LatLng(43.4578, -88.8373));

  }, 1500);

};

function centerMap() {

  const personimage = {
    url: "resources/images/personicon.png",
    size: new google.maps.Size(30, 50),// This marker is 20 pixels wide by 20 pixels high.
    origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
    anchor: new google.maps.Point(0, 50)// The anchor for this image is the base.
  };

  const personshape = {// Shapes define the clickable region of the icon. The type defines an HTML
    coords: [1, 1, 1, 30, 30, 50, 50, 1],//[top-left(x,y),top-right(x,y),bottom-right(x,y),bottom-left(x,y)]
    type: "poly"
  };
  //let iw_currentLocation = new google.maps.InfoWindow();
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        //iw_currentLocation.setPosition(pos);
        //iw_currentLocation.setContent("You Are Here.");
        //iw_currentLocation.open(map);
        map.setCenter(pos);
        new google.maps.Marker({
          position: pos,
          map,
          icon: personimage,
          shape: personshape,
          title: "You Are Here :)",
          zIndex: 1
        });
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


function getImage(businessType) {
  switch (businessType) {
    case "library":
      image = {
        url: "resources/images/bookIcon.png",
        size: new google.maps.Size(20, 20),// This marker is 20 pixels wide by 20 pixels high.
        origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
        anchor: new google.maps.Point(0, 20)// The anchor for this image is the base.
      };
      return image;
    case "restaurant":
      image = {
        url: "resources/images/burgerIcon.png",
        size: new google.maps.Size(20, 20),// This marker is 20 pixels wide by 20 pixels high.
        origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
        anchor: new google.maps.Point(0, 20)// The anchor for this image is the base.
      };
      return image;
    case "bar":
      image = {
        url: "resources/images/beerIcon.png",
        size: new google.maps.Size(20, 20),// This marker is 20 pixels wide by 20 pixels high.
        origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
        anchor: new google.maps.Point(0, 20)// The anchor for this image is the base.
      };
      return image;
    case "grocery":
      image = {
        url: "resources/images/cartIcon2.png",
        size: new google.maps.Size(30, 30),// This marker is 20 pixels wide by 20 pixels high.
        origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
        anchor: new google.maps.Point(0, 20)// The anchor for this image is the base.
      };
      return image;
    case "new":
      image = {
        url: "resources/images/exclamation.png",
        size: new google.maps.Size(35, 35),// This marker is 20 pixels wide by 20 pixels high.
        origin: new google.maps.Point(0, 0),// The origin for this image is (0, 0).-- top-left   
        anchor: new google.maps.Point(0, 20)// The anchor for this image is the base.
      };
      return image;
    default:
      break;

  }





}



function populateMap(businesses) {
  var count = 0;

  //need to get our business listings
  for (let business of businesses) {
    //console.log(business.location);
    // let address = business.location;
    let name = business.businessName;
    //let address = "1201 Broadway Ave S Ste 100, Rochester, MN 55904";
    //let name = "chickenfilet";
    let businessStatus =
      '<h1 id="firstHeading" class="firstHeading" style="text-align:center">BusinessName</h1>' +
      '<div id="bodyContent">' +
      '<p style="text-align:left" class="businessPopup">content</p>' +
      '</div>';
    businessStatus = businessStatus.replace("BusinessName", name);
    //console.log(business.businessType);
    //console.log(business);
    if (business.posts.length === 0) {
      businessStatus = businessStatus.replace("content", "No status to display :)");
    } else {
      businessStatus = businessStatus.replace("content", business.posts[business.posts.length - 1].body);
    }

    if (count >= 10) {
      setTimeout(() => {
        console.log(business);
        callGeocoder(business, businessStatus);
      }, 10000);
    } else {
      setTimeout(() => {
        //console.log(business);
        callGeocoder(business, businessStatus);
      }, 0);
    }
    count++;




  }
}

function callGeocoder(business, businessStatus) {
  geocoder.geocode({ address: business.location }, (results, status) => {
    const shape = {// Shapes define the clickable region of the icon. The type defines an HTML
      coords: [1, 1, 1, 30, 30, 30, 30, 1],//[top-left(x,y),top-right(x,y),bottom-right(x,y),bottom-left(x,y)]
      type: "poly"
    };
    let name = business.businessName;
    if (status === "OK") {
      //map.setCenter(results[0].geometry.location);
      const infowindow = new google.maps.InfoWindow({
        content: businessStatus
          + `<div>
                  <button type="button" id="addFavs" onclick="addFavorite(${business.id})">
                    Add ${business.businessName} to favorites
                  </button>
                 </div>`
      });
      //if check to do a call to specific type based on time**
      var imageType = business.businessType;
      if (business.posts.length != 0) {
        var bizPostDateTimeParts = business.posts[business.posts.length - 1].createdTime.split('T');
        var bizPostDateParts = bizPostDateTimeParts[0].split('-');
        var postYear = bizPostDateParts[0];
        var postMonth = bizPostDateParts[1];
        var postDay = bizPostDateParts[2];
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        if (postYear == yyyy && postMonth == mm && postDay == dd) {
            imageType = "new";
        }
      } 
      let marker = new google.maps.Marker({
        title: name,
        map: map,
        icon: getImage(imageType),
        shape: shape,
        position: results[0].geometry.location
      });
      marker.addListener("click", () => {
        infowindow.open(map, marker);
        fillHomeInfo(business);

        let homeButton = document.querySelector("#homeoption");
        homeButton.addEventListener("click", () => {
          fillHomeInfo(business);
        });

        let postButton = document.querySelector("#postoption");
        postButton.addEventListener("click", () => {
          fillHomeWithPosts(business);
        });

        let reviewButton = document.querySelector("#reviewsoption");
        reviewButton.addEventListener("click", () => {
          fillHomeWithReviews(business);
        });
      });
    } else {
      // Request not OK, because over query limit
      if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        // setTimeout(50)
        console.log("We hit the query limit!");
      }
    }
  });
}

function addFavorite(businessId) {
  let principleStr = localStorage.getItem("usrp");
  let principle;

  if (!principleStr) {
    alert("You cannot add a favorite since you are not logged in.");
    return;
  }

  principle = JSON.parse(principleStr);

  let addFavoritesUrl = "https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/users/favorites/businessId/"
    + businessId + "/user/" + principle.id;
  console.log(addFavoritesUrl);

  fetch(addFavoritesUrl, {
    method: "POST"
  })
    .then(resp => {
      if (resp.status >= 400) {
        alert("Something went wrong while adding your favorite!");
        throw new Error("Something went wrong while adding your favorite!");
      }

      alert("Your favorite has been added!");
      getUserFavorites(principle);
    })
    .catch(err => console.log(err));
};

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
    //console.log("displaying post");
    //console.log(post);

    let postInfoRow = document.createElement("tr");
    let typeCell = document.createElement("td");
    typeCell.textContent = post.postType;
    let postCell = document.createElement("td");
    postCell.textContent = post.body;
    let timeCell = document.createElement("td");

    if (post.createdTime) {
      var postDateParts = post.createdTime.split('T');
      var postDate = postDateParts[0];
      var postTime = postDateParts[1];
      postTime = postTime.split('+')[0];
      postTime = postTime.substring(0, 5);
  
      timeCell.textContent = postDate + ' ' + convert(postTime);
    } else {
      //timeCell.textContent = postDate + ' ' + convert(postTime);
    }

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
  //console.log(owner, email, location, hourList, reviewList);

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

  //hoursHeaderRow.appendChild(beginEndHeader);
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


  let hoursDataRow = document.createElement("tr");

  let mondayCell = document.createElement("td");
  let tuesdayCell = document.createElement("td");
  let wednesdayCell = document.createElement("td");
  let thursdayCell = document.createElement("td");
  let fridayCell = document.createElement("td");
  let saturdayCell = document.createElement("td");
  let sundayCell = document.createElement("td");

  for (let day of hourList) {
    //looking at single post object now
    // console.log("displaying day");
    // console.log(day);

    var closedDateParts = day.closed.split('T');
    var closedTime = closedDateParts[1];
    closedTime = closedTime.split('+')[0];
    closedTime = closedTime.substring(0, 5);
    // console.log(closedDate);
    // console.log('closed time: ' + convert(closedTime));

    var openDateParts = day.open.split('T');
    var openTime = openDateParts[1];
    openTime = openTime.split('+')[0];
    openTime = openTime.substring(0, 5);
    // console.log('open time: ' + convert(openTime));
    // console.log('day - ' + day.day);
    if (day.day == 1) {
      mondayCell.textContent = 'Hours: ' + convert(openTime) + ' - ' + convert(closedTime);
    }
    if (day.day == 2) {
      tuesdayCell.textContent = 'Hours: ' + convert(openTime) + ' - ' + convert(closedTime);
    }
    if (day.day == 3) {
      wednesdayCell.textContent = 'Hours: ' + convert(openTime) + ' - ' + convert(closedTime);
    }
    if (day.day == 4) {
      thursdayCell.textContent = 'Hours: ' + convert(openTime) + ' - ' + convert(closedTime);
    }
    if (day.day == 5) {
      fridayCell.textContent = 'Hours: ' + convert(openTime) + ' - ' + convert(closedTime);
    }
    if (day.day == 6) {
      saturdayCell.textContent = 'Hours: ' + convert(openTime) + ' - ' + convert(closedTime);
    }
    if (day.day == 7) {
      sundayCell.textContent = 'Hours: ' + convert(openTime) + ' - ' + convert(closedTime);
    }

  }
  isEmpty(mondayCell);
  isEmpty(tuesdayCell);
  isEmpty(wednesdayCell);
  isEmpty(thursdayCell);
  isEmpty(fridayCell);
  isEmpty(saturdayCell);
  isEmpty(sundayCell);
  hoursDataRow.appendChild(mondayCell);
  hoursDataRow.appendChild(tuesdayCell);
  hoursDataRow.appendChild(wednesdayCell);
  hoursDataRow.appendChild(thursdayCell);
  hoursDataRow.appendChild(fridayCell);
  hoursDataRow.appendChild(saturdayCell);
  hoursDataRow.appendChild(sundayCell);
  hoursTable.appendChild(hoursDataRow);

}

function fillHomeWithFavorites(principle) {
  getUserFavorites(principle);
}

function getUserFavorites(principle) {
  fetch("https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/users/favorites/user/" + principle.id)
    .then(resp => {
      if (resp.status >= 400) {
        alert("Something went wrong while grabbing your favorites!");
        return;
      }

      return resp.json();
    })
    .then(resp => {
      buildFavoritesView(principle, resp);
    });
}

function buildFavoritesView(principle, favorites) {
  let infoDiv = document.querySelector("#info-container");
  infoDiv.innerHTML = "";

  if (favorites.length === 0) {
    let h1 = document.createElement("h1");
    h1.textContent = "You have no favorites; click on the pins on the map to add a business as a favorite.";
    infoDiv.appendChild(h1);
  }
  else {
    let table = document.createElement("table");
    let tableHeaderRow = document.createElement("tr");

    let headerCell1 = document.createElement("th");
    headerCell1.textContent = "Business Name";
    let headerCell2 = document.createElement("th");
    headerCell2.setAttribute("scope", "col");
    headerCell2.textContent = "Owner Email";

    let headerCell3 = document.createElement("th");
    headerCell3.setAttribute("scope", "col");
    headerCell3.textContent = "Location";

    let headerCell4 = document.createElement("th");
    headerCell4.setAttribute("scope", "col");
    headerCell4.textContent = "Business Type";

    let headerCell5 = document.createElement("th");
    headerCell5.setAttribute("scope", "col");
    headerCell5.textContent = "Delete Business";

    tableHeaderRow.appendChild(headerCell1);
    tableHeaderRow.appendChild(headerCell2);
    tableHeaderRow.appendChild(headerCell3);
    tableHeaderRow.appendChild(headerCell4);
    tableHeaderRow.appendChild(headerCell5);

    table.appendChild(tableHeaderRow);

    favorites.forEach(biz => {
      let tableBizRow = document.createElement("tr");

      let businessnameCell = document.createElement("th");
      businessnameCell.setAttribute("scope", "row");
      businessnameCell.textContent = biz.businessName;

      let emailCell = document.createElement("td");
      emailCell.textContent = biz.email;

      let locationCell = document.createElement("td");
      locationCell.textContent = biz.location;

      let businesstypeCell = document.createElement("td");
      businesstypeCell.textContent = biz.businessType;

      let deleteCell = document.createElement("td");
      let deleteBtn = document.createElement("button");
      deleteBtn.addEventListener("click", () => deleteFavorite(biz.id, principle.id));
      deleteBtn.textContent = "Delete";
      deleteCell.appendChild(deleteBtn);

      tableBizRow.appendChild(businessnameCell);
      tableBizRow.appendChild(emailCell);
      tableBizRow.appendChild(locationCell);
      tableBizRow.appendChild(businesstypeCell);
      tableBizRow.appendChild(deleteCell);

      table.appendChild(tableBizRow);
    });

    infoDiv.appendChild(table);
  }
}

function deleteFavorite(bizId, userId) {
  let deleteFavoriteUrl = "https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/users/favorites/businessId/"
    + bizId + "/user/" + userId;
  console.log(deleteFavoriteUrl);

  fetch(deleteFavoriteUrl, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(resp => {
      if (resp.status >= 400) {
        alert("Something went wrong while deleting your favorite!");
        throw new Error("delete failed");
      }

      alert("Your favorite has been deleted.");
      getUserFavorites(JSON.parse(localStorage.getItem("usrp")));
    })
}

function isEmpty(node) {
  //console.log(node);
  if (node.innerHTML === "") {
    return node.textContent = "CLOSED";
  }

}


function convert(input) {
  return moment(input, 'HH:mm').format('h:mm A');
}


async function getBusinesses() {
  //GET BUSINESSES

  let myUrl = "https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses";
  await fetch(myUrl)
    .then(response => response.json())
    .then(data => populateMap(data));
  // //GET BUSINESSES
  // let xhr = new XMLHttpRequest(); // Creating a XHR object
  // let url = "http://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com//businesses";

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
  //       alert("Something went wrong getting businesses!");
  //     }
  // };
  // // Sending data with the request
  // xhr.send(null);
}
