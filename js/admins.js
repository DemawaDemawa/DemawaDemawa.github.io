let btnaddadmin = document.getElementById('btnaddadmin')
const statusSelect = document.getElementById('slstatus')

btnaddadmin.addEventListener('click', () => {
  let txtfname = document.getElementById('txtfname').value.trim()
  let txtlname = document.getElementById('txtlname').value.trim()
  let txtemail = document.getElementById('txtemail').value.trim()


if (txtfname === '' || txtemail === '') {
    Swal.fire('Error', 'First name and email must be filled', 'error')
    return
  }

  if (!validateEmail(txtemail)) {
    Swal.fire('Error', 'Please enter a valid email address', 'error')
    return
  }

  btnaddadmin.disabled = true
  btnaddadmin.textContent = 'Saving...'

  let emailid = txtemail.replace(/\./g, '_dot_').replace(/@/g, '_at_')
  let status = statusSelect.value
  let timenow = Date.now()
  let role = 'admin'
  let autopassword = '12345678'
  let user = firebase.auth().currentUser
  let createdby = user ? user.email : ''

  const adminEmail = sessionStorage.getItem('adminEmail')
  const adminPassword = sessionStorage.getItem('adminPassword')
  const shouldRestoreAdmin = adminEmail && adminPassword

  firebase.auth().createUserWithEmailAndPassword(txtemail, autopassword)
    .then(() => {
      return firebase.database().ref('userDetails/' + emailid).set({
        FirstName: txtfname,
        LastName: txtlname,
        Email: txtemail,
        Status: status,
        CreatedBy: createdby,
        Role: role,
        CreatedOn: timenow
      })
    })
    .then(() => {
      if (shouldRestoreAdmin) {
        return firebase.auth().signInWithEmailAndPassword(adminEmail, adminPassword)
      }
      return firebase.auth().signOut()
    })
    .then(() => {
      if (shouldRestoreAdmin) {
        Swal.fire('Success', 'New admin added. Password is 12345678 and username is the email.', 'success')
      } else {
        Swal.fire('Warning', 'New admin added. Please log in again as admin to continue.', 'warning')
      }
      document.getElementById('txtfname').value = ''
      document.getElementById('txtlname').value = ''
      document.getElementById('txtemail').value = ''
      statusSelect.value = 'active'
    })
    .catch((error) => {
      console.error(error)
      Swal.fire('Error', error.message, 'error')
    })
    .finally(() => {
      btnaddadmin.disabled = false
      btnaddadmin.textContent = 'Add Admin'
    })

})

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}


function loaddata(){
    let tablebody = document.getElementById('tablebody')

    firebase.database().ref("userDetails").on("value",(snapshot) =>{
        tablebody.innerHTML = "" 

        snapshot.forEach((childSnapshot) =>{
            let data = childSnapshot.val()
            let key = childSnapshot.key

            if(data.Status == "active" && data.Role == "admin"){
                tablebody.innerHTML += `
                    <tr>
                     <td>${data.Email}</td>
                     <td>${data.FirstName}</td>
                     <td>${data.LastName}</td>
                     <td>
                      <button class="btn btnred" onclick="suspendadmin('${key}')" > Suspend</button>
                      </td>
                    </tr>
                `
            }
        })

    })
}

loaddata();


function suspendadmin(adminid){
    let confirmSuspend = confirm("Are you sure you want to suspend this admin ?")
    if(!confirmSuspend) return;
    firebase.database().ref("userDetails/" + adminid).update({
        Status:"inactive"
    })
    .then(() =>{
        Swal.fire('Success', 'Admin suspended', 'success')
    })
    .catch((error) =>{
        console.error(error)
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

            if(data.Status == "inactive" && data.Role == "admin"){
                tablebody.innerHTML += `
                    <tr>
                     <td>${data.Email}</td>
                     <td>${data.FirstName}</td>
                     <td>${data.LastName}</td>
                     <td>
                      <button class="btn btngreen" onclick="activateadmin('${key}')" > Activate</button>
                      </td>
                    </tr>
                `
            }
        })

    })
}

loaddatainactive();


function activateadmin(adminid){
    let confirmSuspend = confirm("Are you sure you want to activate this admin ?")
    if(!confirmSuspend) return;
    firebase.database().ref("userDetails/" + adminid).update({
        Status:"active",
    })
    .then(() =>{
        Swal.fire('Success', 'Admin activated', 'success')
    })
    .catch((error) =>{
        console.error(error)
        Swal.fire('Error', 'Error while activating', 'error')
    })

}
// counters for active admins
let lbactiveadmins = document.getElementById('lbactiveadmins')

firebase.database().ref('userDetails').once("value", function(snapshot){

    let total = 0

    snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().Status == "active" && childSnapshot.val().Role == "admin"){
        total += 1
        }
    });

    // Replaces spinner with actual number
    lbactiveadmins.innerHTML = total

})
//count inactive admins
let lbinactiveadmins = document.getElementById('lbinactiveadmins')

firebase.database().ref('userDetails').once("value", function(snapshot){
    let total = 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if(data.Status == "inactive" && data.Role == "admin"){
            total+=1
        }
    });
   lbinactiveadmins.innerHTML = total 
})
