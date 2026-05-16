let btnlogin = document.getElementById('btnlogin')
btnlogin.addEventListener("click", () =>{
	let txtusername = document.getElementById('txtusername').value
	let txtpass = document.getElementById('txtpass').value
	btnlogin.innerHTML = "Please wait ..."
	if (txtusername == "" || txtpass == ""){
		Swal.fire('Error', 'Please fill all details.', 'error')
	}else{
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		.then(() =>{
			return firebase.auth().signInWithEmailAndPassword(txtusername,txtpass)
		})
		.then((userCredential) => {
			let emailid = txtusername.replace(/\./g, "_dot_").replace(/@/g, "_at_")
			return firebase.database().ref("userDetails/" + emailid).once("value")
		})
		.then((snapshot) =>{
			const userDetails = snapshot.val()
			if (!userDetails) {
				Swal.fire('Error', 'User details not found', 'error')
				btnlogin.innerHTML = "Log in"
				return
			}
			const role = (userDetails.Role || '').toString().trim().toLowerCase()
			const status = (userDetails.Status || '').toString().trim().toLowerCase()
			if (status === "active"){
				if(role === "admin"){
					sessionStorage.setItem('adminEmail', txtusername)
					sessionStorage.setItem('adminPassword', txtpass)
					localStorage.setItem('adminEmail', txtusername)
					localStorage.setItem('adminPassword', txtpass)
					btnlogin.innerHTML = "Log in"
					window.location.href = "dashboard.html"
				}else{
					sessionStorage.removeItem('adminEmail')
					sessionStorage.removeItem('adminPassword')
					localStorage.removeItem('adminEmail')
					localStorage.removeItem('adminPassword')
					if(role === "student"){
						btnlogin.innerHTML = "Log in"
						window.location.href = "student-dashboard.html"
					}else if(role === "lecturer"){
						btnlogin.innerHTML = "Log in"
						window.location.href = "lecturer-dashboard.html"
					}else{
						Swal.fire('Warning', 'No role added. Connect with admin', 'warning')
						btnlogin.innerHTML = "Log in"
					}
				}

			}else{
				Swal.fire('Error', 'Account blocked. Connect with admin', 'error')
				btnlogin.innerHTML = "Log in"
			}
		})
		.catch((error) =>{
			Swal.fire('Error', 'Wrong Password', 'error')
			//console.log(error)
			btnlogin.innerHTML = "Log in"
		})
	}
})
function ShowAlert(){
	Swal.fire({
  title: 'Success!',
  text: 'Data saved successfully',
  icon: 'success',
  confirmButtonText: 'OK'
})
}
