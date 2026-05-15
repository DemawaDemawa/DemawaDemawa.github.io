let lecturerselect = document.getElementById('lecturerselect');
firebase.database().ref("userDetails").once("value",function(snapshot) {
    lecturerselect.innerHTML = "<option value=''>select lecturer</option>";
    snapshot.forEach(function(childSnapshot) {
        let data = childSnapshot.val()
        if(data.Role == "admin" && data.Status == "active"){
            let option = document.createElement("option")
            option.value = data.Email
            option.textContent = data.FirstName
            lecturerselect.appendChild(option)
        }

    })
})
let venueselect = document.getElementById('venueselect');
firebase.database().ref("GpsVenus").once("value",function(snapshot) {
    venueselect.innerHTML = "<option value=''>select venue</option>";
    snapshot.forEach(function(childSnapshot) {
        let data = childSnapshot.val()
        if(data.Status == "active"){
            let option = document.createElement("option")
            option.value = data.VenueCode
            option.textContent = data.VenueName
            venueselect.appendChild(option)
        }

    })
})

//ADD NEW COURSE
let btnbtnaddcourse = document.getElementById("btnaddcourse");
btnbtnaddcourse.addEventListener("click", function() {

    // inputs
    let txtcoursename = document.getElementById("txtcoursename").value.trim();
    let txtcoursecode = document.getElementById("txtcoursecode").value.trim();
    let lecturerselect = document.getElementById("lecturerselect").value.trim();
    let venueselect = document.getElementById("venueselect").value.trim();
    let statusselect = document.getElementById("statusselect").value.trim();
    // select status for html dropdown 
    let status = document.querySelector("select").value;
    // get create by 
      let user = firebase.auth().currentUser;
      let createdby = user.email;
      let timenow = Date.now(); 

    // validation
    if (txtcoursename == "") {
      alert("Enter course name");
      return;
    }
    // check if course code is empty the return code stops here
    if (txtcoursecode == "") {
      alert("Enter course code");
      return;
    }
    // check if lecturer is empty the return code stops here
    if (lecturerselect == "") {
      alert("Select lecturer");
      return;
    }
    // check if venue is empty the return code stops here
    if (venueselect == "") {
      alert("Select venue");
      return;
    }

    // firebase insert
    firebase.database().ref("courses/" + txtcoursecode).set({
      CourseName: txtcoursename,
      CourseCode: txtcoursecode,
      Status: statusselect,
      Lecturer: lecturerselect,
      Venue: venueselect,
      CreatedAt: timenow,
      CreatedBy: createdby
    })

    .then(() => {
      alert("Course added successfully");

      // clear inputs
      document.getElementById("txtcoursename").value = "";
      document.getElementById("txtcoursecode").value = "";
      document.getElementById("lecturerselect").value = "";
      document.getElementById("venueselect").value = "";
      loaddata();
      document.getElementById("txtcoursecode").disabled = false;
      document.getElementById("btnaddcourse").innerText = "Add new Course";
    })

    .catch((error) => {
      alert(error.message);
    });
  });
//active and inactive courses
function toggleCourseStatus(courseCode, currentStatus) {
  let newStatus = currentStatus === "active" ? "inactive" : "active";
    firebase.database().ref("courses/" + courseCode).update({Status: newStatus })
    .then(() => {
      alert("Course status updated to " + newStatus);
      loaddata();
    })
    .catch((error) => {
      alert(error.message);
    });
}

function loaddata(){
  // Load venue to the table
   // table body
  let tableBody = document.getElementById("tablebody");
  // load data
  firebase.database().ref("courses").on("value", (snapshot) => {
    // clear table first
    tableBody.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      let data = childSnapshot.val();
      let key = childSnapshot.key; // venueCode key help in modification
      // only active venues
      if(data.Status == "active"){
        tableBody.innerHTML += `
          <tr>
            <td>${data.CourseCode}</td>
            <td>${data.CourseName}</td>
            <td>${data.Venue}</td>
            <td>${data.Lecturer}</td>

            
            <td>
            <button class="btn btngreen " onclick="openSession('${key}')">Open Session</button>
            <button class="btn btnred" onclick="closeCourse('${key}')">Close course</button>
            <button class="btn btnblue" onclick="viewAttendance('${key}')">View attendance</button>
          </td>

          </tr>

        `;
      }

    });

  });
}

loaddata();
let lbtoTotalCourses = document.getElementById('lbtoTotalCourses')

firebase.database().ref('courses').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        total+=1
    });
   lbtoTotalCourses.innerHTML = total 
})

//counter for total courses
let lbtoInSession = document.getElementById('lbtoInSession')

firebase.database().ref('courses').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Status == "active"){
            total++
        }
    });
   lbtoInSession.innerHTML = total 
})
let lbtoTotalPast = document.getElementById('lbtoTotalPast')

firebase.database().ref('courses').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Status == "inactive"){
            total++
        }
    });
   lbtoTotalPast.innerHTML = total 
})

// function to close course (set inactive)
  function closeCourse(courseCode) {
    let confirmClose = confirm("Are you sure you want to close this course?");
    if (!confirmClose) return;
    firebase.database().ref("courses/" + courseCode).update({
      Status: "inactive"
    })
    .then(() => {
      alert("Course closed successfully");
      loaddata();
    })
    .catch((error) => {
      alert(error.message);
    });
  }

  // function to open session (set active)
  function openSession(courseCode) {
    let confirmOpen = confirm("Are you sure you want to open session for this course?");
    if (!confirmOpen) return;
    firebase.database().ref("courses/" + courseCode).update({
      Status: "active"
    })
    .then(() => {
      alert("Course session opened successfully");
      loaddata();
    })
    .catch((error) => {
      alert(error.message);
    });
  }

  // function to view attendance
  function viewAttendance(courseCode) {
    // store course code in local storage and redirect to attendance page
    localStorage.setItem("selectedCourseCode", courseCode);
    window.location.href = "attendance.html";
  }
