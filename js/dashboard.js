//counter for total students
let lbtoTotalStudents = document.getElementById('lbtoTotalStudents')

firebase.database().ref('userDetails').once("value", function(snapshot){

    let total = 0

    snapshot.forEach(function(childSnapshot){
        total += 1
    });

    // Replaces spinner with actual number
    lbtoTotalStudents.innerHTML = total

})

//counter for total courses
let lbtoTotalCourses = document.getElementById('lbtoTotalCourses')

firebase.database().ref('courses').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        total++
    });
   lbtoTotalCourses.innerHTML = total 
})
//counter for total lecturers
let lbtoTotalLecturers = document.getElementById('lbtoTotalLecturers')

firebase.database().ref('userDetails').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Role == "admin"){
            total+=1
        }
    });
   lbtoTotalLecturers.innerHTML = total 
})
//counter for total approvals
let lbtoTotalApprovals = document.getElementById('lbtoTotalApprovals')

firebase.database().ref('userDetails').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Status == "inactive"){
            total+=1
        }
    });
   lbtoTotalApprovals.innerHTML = total 
})