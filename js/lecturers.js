auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'index.html'
    return
  }

  let emailid = user.email.replace(/\./g, '_dot_').replace(/@/g, '_at_')
  firebase.database().ref('userDetails/' + emailid).once('value').then((snapshot) => {
    const data = snapshot.val()
    if (!data || (data.Role || '').toString().toLowerCase() !== 'admin') {
      window.location.href = 'index.html'
      return
    }
    loadLecturers()
  })
})

let btnaddlecturer = document.getElementById('btnaddlecturer')
const statusSelect = document.getElementById('slstatus')

btnaddlecturer.addEventListener('click', () => {
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

  btnaddlecturer.disabled = true
  btnaddlecturer.textContent = 'Saving...'

  let emailid = txtemail.replace(/\./g, '_dot_').replace(/@/g, '_at_')
  let status = statusSelect.value
  let timenow = Date.now()
  let role = 'lecturer'
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
        Swal.fire('Success', 'New lecturer added. Password is 12345678 and username is the email.', 'success')
      } else {
        Swal.fire('Warning', 'Lecturer added. Please log in again as admin to continue.', 'warning')
      }
      document.getElementById('txtfname').value = ''
      document.getElementById('txtlname').value = ''
      document.getElementById('txtemail').value = ''
      statusSelect.value = 'active'
      loadLecturers()
    })
    .catch((error) => {
      console.error(error)
      Swal.fire('Error', error.message, 'error')
    })
    .finally(() => {
      btnaddlecturer.disabled = false
      btnaddlecturer.textContent = 'Add Lecturer'
    })
})

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function loadLecturers() {
  let tablebody = document.getElementById('tablebody')
  let tablebodyinactive = document.getElementById('tablebodyinactive')
  let lbactivelecturers = document.getElementById('lbactivelecturers')
  let lbinactivelecturers = document.getElementById('lbinactivelecturers')

  let activeTotal = 0
  let inactiveTotal = 0
  tablebody.innerHTML = ''
  tablebodyinactive.innerHTML = ''

  firebase.database().ref('userDetails').on('value', (snapshot) => {
    activeTotal = 0
    inactiveTotal = 0
    tablebody.innerHTML = ''
    tablebodyinactive.innerHTML = ''

    snapshot.forEach((childSnapshot) => {
      let data = childSnapshot.val()
      let key = childSnapshot.key
      if (data.Role === 'lecturer' && data.Status === 'active') {
        activeTotal++
        tablebody.innerHTML += `
          <tr>
            <td>${data.Email}</td>
            <td>${data.FirstName}</td>
            <td>${data.LastName}</td>
            <td>
              <button class="btn btnred" onclick="suspendLecturer('${key}')">Suspend</button>
            </td>
          </tr>
        `
      }
      if (data.Role === 'lecturer' && data.Status === 'inactive') {
        inactiveTotal++
        tablebodyinactive.innerHTML += `
          <tr>
            <td>${data.Email}</td>
            <td>${data.FirstName}</td>
            <td>${data.LastName}</td>
            <td>
              <button class="btn btngreen" onclick="activateLecturer('${key}')">Activate</button>
            </td>
          </tr>
        `
      }
    })

    lbactivelecturers.innerText = activeTotal
    lbinactivelecturers.innerText = inactiveTotal
  })
}

function suspendLecturer(lecturerid) {
  let confirmSuspend = confirm('Are you sure you want to suspend this lecturer ?')
  if (!confirmSuspend) return;
  firebase.database().ref('userDetails/' + lecturerid).update({Status:'inactive'})
    .then(() => {
      Swal.fire('Success', 'Lecturer suspended', 'success')
    })
    .catch((error) => {
      console.error(error)
      Swal.fire('Error', 'Error while suspending', 'error')
    })
}

function activateLecturer(lecturerid) {
  let confirmActivate = confirm('Are you sure you want to activate this lecturer ?')
  if (!confirmActivate) return;
  firebase.database().ref('userDetails/' + lecturerid).update({Status:'active'})
    .then(() => {
      Swal.fire('Success', 'Lecturer activated', 'success')
    })
    .catch((error) => {
      console.error(error)
      Swal.fire('Error', 'Error while activating', 'error')
    })
}
