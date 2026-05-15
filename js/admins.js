let btnaddadmin = document.getElementById('btnaddadmin')
const statusSelect = document.getElementById('slstatus')

btnaddadmin.addEventListener('click', () => {
  let txtfname = document.getElementById('txtfname').value.trim()
  let txtlname = document.getElementById('txtlname').value.trim()
  let txtemail = document.getElementById('txtemail').value.trim()


if (txtfname === '' || txtemail === '') {
    alert('First name and email must be filled')
    return
  }

  if (!validateEmail(txtemail)) {
    alert('Please enter a valid email address')
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
      alert('New admin added. Password is 12345678 and username is the email.')
      document.getElementById('txtfname').value = ''
      document.getElementById('txtlname').value = ''
      document.getElementById('txtemail').value = ''
      statusSelect.value = 'active'
    })
    .catch((error) => {
      console.error(error)
      alert(error.message)
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
        alert("Admin suspended")
    })
    .catch((error) =>{
        console.error(error)
        alert("Error while suspending")
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
        Status:"active"
    })
    .then(() =>{
        alert("Admin activated")
    })
    .catch((error) =>{
        console.error(error)
        alert("Error while activating")
    })

}
// counters for active admins
let lbactiveadmins = document.getElementById('lbactiveadmins')

firebase.database().ref('userDetails').once("value", function(snapshot){

    let total = 0

    snapshot.forEach(function(childSnapshot){
        total += 1
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
