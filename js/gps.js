let btnAdd = document.getElementById("btnaddcourse");

  // event
  btnAdd.addEventListener("click", () => {

    // inputs
    let venueName = document.getElementById("txtvenuename").value.trim();
    let venueCode = document.getElementById("txtvenuecode").value.trim();
    let longitude = document.getElementById("txtlongitude").value.trim();
    let latitude = document.getElementById("txtlatitude").value.trim();
    // select status for html dropdown 
    let status = document.querySelector("select").value;
    // get create by 
      let user = firebase.auth().currentUser;
      let createdby = user.email;
      let timenow = Date.now(); 

    // validation
    if (venueName == "") {
      Swal.fire('Error', 'Enter venue name', 'error');
      return;
    }
    // check if venue code is empty the return code stops here
    if (venueCode == "") {
      Swal.fire('Error', 'Enter venue code', 'error');
      return;
    }
    // check if longitude is empty the return code stops here
    if (longitude == "") {
      Swal.fire('Error', 'Enter longitude', 'error');
      return;
    }
    // check if latitude is empty the return code stops here
    if (latitude == "") {
      Swal.fire('Error', 'Enter latitude', 'error');
      return;
    }

    // firebase insert
    firebase.database().ref("GpsVenus/" + venueCode).set({
      VenueName: venueName,
      VenueCode: venueCode,
      Status: status,
      Longitude: longitude,
      Latitude: latitude,
      CreatedAt: timenow,
      CreatedBy: createdby
    })

    .then(() => {
      Swal.fire('Success', 'GPS added successfully', 'success');

      // clear inputs
      document.getElementById("txtvenuename").value = "";
      document.getElementById("txtvenuecode").value = "";
      document.getElementById("txtlongitude").value = "";
      document.getElementById("txtlatitude").value = "";
      loaddata();
      document.getElementById("txtvenuecode").disabled = false;
      document.getElementById("btnaddcourse").innerText = "Add new GPS";
    })

    .catch((error) => {
      Swal.fire('Error', error.message, 'error');
    });
  });

function loaddataActive(){
  // Load venue to the table
   // table body
  let tableBody = document.getElementById("tablebody");
  // load data
  firebase.database().ref("GpsVenus").on("value", (snapshot) => {
    // clear table first
    tableBody.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      let data = childSnapshot.val();
      let key = childSnapshot.key; // venueCode key help in modification
      // only active venues
      if(data.Status == "active"){
        tableBody.innerHTML += `
          <tr>
            <td>${data.VenueCode}</td>
            <td>${data.VenueName}</td>
            <td>${data.Latitude}</td>
            <td>${data.Longitude}</td>

            <td>
              <button class="btn btnred" onclick="closeVenue('${key}')">
                Close GPS Venue
              </button>

              <button class="btn btnblue" onclick="editVenue('${key}')">
                Edit GPS
              </button>
            </td>

          </tr>

        `;
      }

    });

  });
}

loaddataActive();

// function to load inactive venues to the table
function loaddataInactive(){
  // Table body
  let tableBody = document.getElementById("tablebody1");
  // load data
  firebase.database().ref("GpsVenus").on("value", (snapshot) => {
    // clear table first
    tableBody.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      let data = childSnapshot.val();
      let key = childSnapshot.key; // venueCode key help in modification
      // only inactive venues
      if(data.Status == "inactive"){
        tableBody.innerHTML += `
          <tr>
            <td>${data.VenueCode}</td>
            <td>${data.VenueName}</td>
            <td>${data.Latitude}</td>
            <td>${data.Longitude}</td>

            <td>
              <button class="btn btngreen" onclick="openVenue('${key}')">
                Open GPS Venue
              </button>

              <button class="btn btnblue" onclick="editVenue('${key}')">
                Edit GPS
              </button>
            </td>

          </tr>

        `;
      }

    });

  });
}

loaddataInactive();

 // function to close venue (set inactive)
  function closeVenue(venueCode) {

    let confirmClose = confirm("Are you sure you want to close this GPS venue?");

    if (!confirmClose) return;

    firebase.database().ref("GpsVenus/" + venueCode).update({
      Status: "inactive"
    })
    .then(() => {
      Swal.fire('Success', 'GPS Venue closed successfully', 'success');
    })
    .catch((error) => {
      Swal.fire('Error', error.message, 'error');
    });

  }
  function openVenue(venueCode) {

    let confirmOpen = confirm("Are you sure you want to open this GPS venue?");

    if (!confirmOpen) return;

    firebase.database().ref("GpsVenus/" + venueCode).update({
      Status: "active"
    })
    .then(() => {
      Swal.fire('Success', 'GPS Venue opened successfully', 'success');
    })
    .catch((error) => {
      Swal.fire('Error', error.message, 'error');
    });

  }


  // function to prepare edit 


function editVenue(venueCode){
  firebase.database().ref("GpsVenus/" + venueCode).once("value")
    .then((snapshot) => {

      let data = snapshot.val();

      // fill form
      document.getElementById("txtvenuename").value = data.VenueName;
      document.getElementById("txtvenuecode").value = data.VenueCode;
      document.getElementById("txtlongitude").value = data.Longitude;
      document.getElementById("txtlatitude").value = data.Latitude;

      document.querySelector("select").value = data.Status;

      // lock venue code
      document.getElementById("txtvenuecode").disabled = true;

      // enable edit mode
      editMode = true;
      editKey = venueCode;

      // change button text
      document.getElementById("btnaddcourse").innerText = "Update GPS";

    });

}
let lbtoTotalActiveGPS = document.getElementById('lbtoTotalActiveGPS')

firebase.database().ref('GpsVenus').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Status == "active"){
            total++
        }
    });
   lbtoTotalActiveGPS.innerHTML = total 
})
//counter for total courses
let lbtoTotalPastGPS = document.getElementById('lbtoTotalPastGPS')

firebase.database().ref('GpsVenus').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Status == "inactive"){
            total++
        }
    });
   lbtoTotalPastGPS.innerHTML = total 
})
