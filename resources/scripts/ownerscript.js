function getOwnerBusinesses() {
    let usrp = localStorage.getItem("usrp");

    if (!usrp) {
        alert("You are not logged it. Log in as an ADMIN or OWNER to see this page.");
        $("#info-container").load("resources/home.html");
        return;
    }

    usrp = JSON.parse(usrp);

    console.log(usrp);

    if (!(usrp.role === "ADMIN" || usrp.role === "OWNER")) {
        alert("You are not authorized to view this page");
        $("#info-container").load("resources/home.html");
        return;
    }

    fetch("https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses")
    .then(resp => {
          if (resp.status >= 400) {
              alert("Something went wrong while attempting to grab the businesses!");
              return;
          }

          return resp.json();
    })
    .then(businesses => {
        let usrp = JSON.parse(localStorage.getItem("usrp"));
        printBusinesses(businesses.filter(business => business.active && business.owner.userId === usrp.id));
    });
}

getOwnerBusinesses();

function printBusinesses(businesses) {
    let businessdata = document.querySelector("#businessdata");
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
    headerCell5.textContent = "Update Business";

    let headerCell6 = document.createElement("th");
    headerCell6.setAttribute("scope", "col");
    headerCell6.textContent = "Reset fields";

    tableHeaderRow.appendChild(headerCell1);
    tableHeaderRow.appendChild(headerCell2);
    tableHeaderRow.appendChild(headerCell3);
    tableHeaderRow.appendChild(headerCell4);
    tableHeaderRow.appendChild(headerCell5);
    tableHeaderRow.appendChild(headerCell6);

    table.appendChild(tableHeaderRow);

    let selectElem = document.createElement("select");

    businesses.forEach((biz, idx) => {
        console.log(biz);
        let tableBizRow = document.createElement("tr");
        let name = "changeBiz" + idx;

        let businessnameCell = document.createElement("th");
        businessnameCell.setAttribute("scope", "row");
        let bizNameInput = document.createElement("input");
        bizNameInput.setAttribute("type", "text");
        bizNameInput.setAttribute("name", name);
        bizNameInput.setAttribute("value", biz.businessName);
        businessnameCell.appendChild(bizNameInput);

        let emailCell = document.createElement("td");
        let emailInput = document.createElement("input");
        emailInput.setAttribute("type", "email");
        emailInput.setAttribute("name", name);
        emailInput.setAttribute("value", biz.email);
        emailCell.appendChild(emailInput);

        let locationCell = document.createElement("td");
        let locationInput = document.createElement("input");
        locationInput.setAttribute("type", "text");
        locationInput.setAttribute("name", name);
        locationInput.setAttribute("value", biz.location);
        locationCell.appendChild(locationInput);

        let businesstypeCell = document.createElement("td");
        let bizTypeInput = document.createElement("input");
        bizTypeInput.setAttribute("type", "text");
        bizTypeInput.setAttribute("name", name);
        bizTypeInput.setAttribute("value", biz.businessType);
        businesstypeCell.appendChild(bizTypeInput);

        let updateCell = document.createElement("td");
        let updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => updateBusiness(biz, name));
        updateCell.appendChild(updateButton);

        let resetCell = document.createElement("td");
        let resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        resetButton.addEventListener("click", () => resetBusiness(biz, name));
        resetCell.appendChild(resetButton);

        tableBizRow.appendChild(businessnameCell);
        tableBizRow.appendChild(emailCell);
        tableBizRow.appendChild(locationCell);
        tableBizRow.appendChild(businesstypeCell);
        tableBizRow.appendChild(updateCell);
        tableBizRow.appendChild(resetCell);

        // add dropdown items
        let option = document.createElement("option");
        option.setAttribute("value", biz.id);
        option.textContent = biz.businessName;
        selectElem.appendChild(option);

        table.appendChild(tableBizRow);
    });

    if (businesses.length > 0) {
        businessdata.appendChild(table);
        let bizdd = document.querySelector("#bizDropdownSpan");
        let label = document.createElement("label");

        label.setAttribute("for", "bizDropdown");
        label.textContent = "Select Business";
        selectElem.setAttribute("id", "bizDropdown");
        bizdd.appendChild(label);
        bizdd.appendChild(selectElem);
    } else {
        let noBusinesses = document.createElement("h1");
        noBusinesses.textContent = "You have no businesses.";
        businessdata.appendChild(noBusinesses);
    }
}

function saveBusiness() {
    let newBizInputs = document.querySelectorAll('input[name="newBiz"]');
    
    let inputVals = Array.from(newBizInputs).map(biz => biz.value);

    let newBiz = {};

    newBiz.businessName = inputVals[0];
    newBiz.businessType = inputVals[1];
    newBiz.location = inputVals[2];
    newBiz.email = inputVals[3];
    newBiz.posts = [];
    newBiz.active = true;
    newBiz.hours = [];
    newBiz.registerDatetime = null;
    newBiz.id = null;
    newBiz.reviews = [];
    newBiz.owner = {};

    let usrp = JSON.parse(localStorage.getItem("usrp"));
    newBiz.owner.username = usrp.username;

    console.log(newBiz);

    fetch("https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBiz)
    })
    .then(resp => {
        if (resp.status >= 400) {
            alert("Something went wrong while adding your business!");
        } else {
            alert("Success!");
        }
    })
    .catch(err => {
        alert("Some error happened!"); 
        console.log(err);
    });
}

function savePost() {
    let newPostBody = document.querySelector('#postbody');
    let newPostType = document.querySelector('#posttype');
    let bizDropdown = document.querySelector("#bizDropdown");
    let selectedBiz = bizDropdown.options[bizDropdown.selectedIndex];
    console.log(selectedBiz);

    let newPost = {};
    newPost.body = newPostBody.value;
    newPost.postType = newPostType.value;

    let postUrl = "https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses/id/" + selectedBiz.value + "/posts"; 

    console.log(newPost);
    console.log(postUrl);

    fetch(postUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(resp => {
        if (resp.status >= 400) {
            alert("Something went wrong while adding your post!");
        } else {
            alert("Success!");
        }
    })
    .catch(err => {
        alert("Some error happened!"); 
        console.log(err);
    });
}

function updateBusiness(biz, name) {
    let updateRow = document.querySelectorAll('input[name="' + name + '"]');

    biz.businessName = updateRow[0].value;
    biz.email = updateRow[1].value;
    biz.location = updateRow[2].value;
    biz.businessType = updateRow[3].value;

    console.log(biz);

    fetch("https://testingstuff-env.eba-jjai2atc.us-east-1.elasticbeanstalk.com/businesses", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(biz)
    })
    .then(resp => {
        if (resp.status >= 400) {
            alert("Something went wrong while updating your business!");
        } else {
            alert("Success!");
        }
    })
    .catch(err => {
        alert("Some error happened!"); 
        console.log(err);
    });
}

function resetBusiness(biz, name) {
    let updateRow = document.querySelectorAll('input[name="' + name + '"]');

    updateRow[0].value = biz.businessName;
    updateRow[1].value = biz.email;
    updateRow[2].value = biz.location;
    updateRow[3].value = biz.businessType;
}