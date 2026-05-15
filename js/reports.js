let totalAdmins = 0
let totalStudents = 0

firebase.database().ref('userDetails').once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        let role = (data.Role || "").toString().trim().toLowerCase()
        if(role === "admin"){
            totalAdmins++
        }
        else if(role === "student"){
            totalStudents++
        }
    });
    drawbargraph()
})

function drawbargraph(){
    const canvasforbargraph = document.getElementById('mybargraph')
    new Chart(canvasforbargraph,{
        type: 'polarArea',
        data: {
            labels: ['Admins', 'Students'],
            datasets : [{
                label: 'System Users',
                data: [totalAdmins, totalStudents],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales : {
                y:{
                    beginZero: true
            }   }
        }
   })
}

let lbtoInSession = 0
let lbtoTotalPast = 0
firebase.database().ref('courses').once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        let status = (data.Status || "").toString().trim().toLowerCase()
        if(status === "active"){
            lbtoInSession++
        }
        else {
           lbtoTotalPast++ 
        }
    });
    //show data
    mycourseschart()
})

function mycourseschart(){

    const canvasforcourses = document.getElementById('mycourseschart')

    new Chart(canvasforcourses, {

        type: 'pie',

        data: {

            labels: ['Active', 'Inactive'],

            datasets: [{
                data: [lbtoInSession, lbtoTotalPast],
                 borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales : {
                y:{
                    beginZero: true
            }   }
        }
   })
}

//lecturer status counts
let lblactiveadmins = 0
let lblinactiveadmins = 0

firebase.database().ref('userDetails').once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        let role = (data.Role || "").toString().trim().toLowerCase()
        let status = (data.Status || "").toString().trim().toLowerCase()
        if(role === "admin"){
            if(status === "active"){
                lblactiveadmins++
            }
            else{
               lblinactiveadmins++ 
            }
        }
    });
    //show data
    mylecturerchart()
})

function mylecturerchart(){

    const canvasforlecturers = document.getElementById('mylecturerchart')

    new Chart(canvasforlecturers, {

        type: 'doughnut',

        data: {

            labels: ['Active', 'Inactive'],

            datasets: [{
                data: [lblactiveadmins, lblinactiveadmins],
                 borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales : {
                y:{
                    beginZero: true
            }   }
        }
   })
}
let lbtoTotalActive = 0
let lbtoTotalInactive = 0
firebase.database().ref('userDetails').once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        let role = (data.Role || "").toString().trim().toLowerCase()
        let status = (data.Status || "").toString().trim().toLowerCase()
        if(role === "student"){
            if(status === "active"){
                lbtoTotalActive++
            }
            else{
               lbtoTotalInactive++ 
            }
        }
    });
    //show data
    mystudentschart()
})

function mystudentschart(){

    const canvasforstudents = document.getElementById('mystudentschart')

    new Chart(canvasforstudents, {

        type: 'pie',

        data: {

            labels: ['Active', 'Inactive'],

            datasets: [{
                data: [lbtoTotalActive, lbtoTotalInactive],
                 borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales : {
                y:{
                    beginZero: true
            }   }
        }
   })
}