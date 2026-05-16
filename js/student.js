let btnaddstudent = document.getElementById('btnaddstudent')

btnaddstudent.addEventListener('click', () =>{
 let txtfname = document.getElementById("txtfname").value
 let txtlname = document.getElementById("txtlname").value
 let txtemail = document.getElementById("txtemail").value


  if(txtfname == "" || txtemail == ""){
  	Swal.fire('Error', 'Name and email must be filled', 'error')
  }else{
  	
  		let emailid = txtemail.replace(/\./g, "_dot_").replace(/@/g, "_at_")
  		let status = document.querySelector("select").value;
  		let timenow = Date.now(); 
  		let role = "Student"
        let autopassword = "12345678"
        let user = firebase.auth().currentUser;
        let createdby = user.email
  		firebase.auth().createUserWithEmailAndPassword(txtemail,autopassword)
  		.then((userCredential) =>{
			return firebase.database().ref('userDetails/' + emailid).set({
				FirstName:txtfname,
				LastName:txtlname,
				Email: txtemail,
				Status: status,
				CreatedBy: createdby,
				Role: role,
				CreatedOn: timenow
			})
		})
		.then(() => {
			const adminEmail = sessionStorage.getItem('adminEmail') || localStorage.getItem('adminEmail')
			const adminPassword = sessionStorage.getItem('adminPassword') || localStorage.getItem('adminPassword')
			if (adminEmail && adminPassword) {
				return firebase.auth().signInWithEmailAndPassword(adminEmail, adminPassword)
			}
			return firebase.auth().signOut()
		})
		.then(() => {
			const adminEmail = sessionStorage.getItem('adminEmail')
			if (adminEmail) {
				Swal.fire('Success', 'New student added. Password is 12345678 and username is the email.', 'success')
			} else {
				Swal.fire('Warning', 'New student added. Please log in again as admin to continue.', 'warning')
			}
			document.getElementById('txtfname').value = ''
			document.getElementById('txtlname').value = ''
			document.getElementById('txtemail').value = ''
  		})
  		.catch((error) => {
  			console.log(error)
  			Swal.fire('Error', error.message, 'error')
  		})
  	
  }

}) 


function loaddata(){
    let tablebody = document.getElementById('tablebody')

    firebase.database().ref("userDetails").on("value",(snapshot) =>{
        tablebody.innerHTML = "" 

        snapshot.forEach((childSnapshot) =>{
            let data = childSnapshot.val()
            let key = childSnapshot.key

            if(data.Status == "active" && data.Role == "Student"){
                tablebody.innerHTML += `
                    <tr>
                     <td>${data.Email}</td>
                     <td>${data.FirstName}</td>
                     <td>${data.LastName}</td>
                     <td>
                      <button class="btn btnred" onclick="suspendstudent('${key}')" > Suspend</button>
                      </td>
                    </tr>
                `
            }
        })

    })
}

loaddata();


function suspendstudent(studentid){
    let confirmSuspend = confirm("Are you sure you want to suspend this student ?")
    if(!confirmSuspend) return;
    firebase.database().ref("userDetails/" + studentid).update({
        Status:"inactive"
    })
    .then(() =>{
        Swal.fire('Success', 'Student suspended', 'success')
    })
    .catch((error) =>{
        Swal.fire('Error', 'Error while suspending', 'error')
    })

}




// activation 


function loaddatainactive(){
    let tablebody = document.getElementById('tablebodyinactive')

    firebase.database().ref("userDetails").on("value",(snapshot) =>{
        tablebody.innerHTML = "" 

        snapshot.forEach((childSnapshot) =>{
            let data = childSnapshot.val()
            let key = childSnapshot.key

            if(data.Status == "inactive" && data.Role == "Student"){
                tablebody.innerHTML += `
                    <tr>
                     <td>${data.Email}</td>
                     <td>${data.FirstName}</td>
                     <td>${data.LastName}</td>
                     <td>
                      <button class="btn btngreen" onclick="activatestudent('${key}')" > Activate</button>
                      </td>
                    </tr>
                `
            }
        })

    })
}

loaddatainactive();


function activatestudent(studentid){
    let confirmSuspend = confirm("Are you sure you want to activate this student ?")
    if(!confirmSuspend) return;
    firebase.database().ref("userDetails/" + studentid).update({
        Status:"active"
    })
    .then(() =>{
        Swal.fire('Success', 'Student activated', 'success')
    })
    .catch((error) =>{
        Swal.fire('Error', 'Error while activating', 'error')
    })

}
let lbtoStudents = document.getElementById('lbtoStudents')

firebase.database().ref('userDetails').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Role == "Student"){
            total+=1
        }
       
    });
   lbtoStudents.innerHTML = total 
})

//counter for total active students
let lbtoTotalActive = document.getElementById('lbtoTotalActive')

firebase.database().ref('userDetails').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Role == "Student" && data.Status == "active"){
            total+=1
        }
       
    });
   lbtoTotalActive.innerHTML = total 
})

//counter for pending approvals
let lbtoPending = document.getElementById('lbtoPending')

firebase.database().ref('userDetails').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Role == "Student" && data.Status == "inactive"){
            total+=1
        }
       
    });
   lbtoPending.innerHTML = total 
})