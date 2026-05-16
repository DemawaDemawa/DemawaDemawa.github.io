let btncreate = document.getElementById('btncreate')

btncreate.addEventListener('click', () =>{
 let txtfname = document.getElementById("txtfname").value
 let txtlname = document.getElementById("txtlname").value
 let txtemail = document.getElementById("txtemail").value
 let txtpass = document.getElementById("txtpass").value
 let txtconpass = document.getElementById("txtconpass").value

  if(txtfname == "" || txtemail == "" || txtpass == ""){
  	Swal.fire('Error', 'Name and email must be filled', 'error')
  }else{
  	if (txtconpass == txtpass) {
  		let emailid = txtemail.replace(/\./g, "_dot_").replace(/@/g, "_at_")
  		let status = "inactive"
  		let timenow = Date.now(); 
  		let role = "admin"
  		firebase.auth().createUserWithEmailAndPassword(txtemail,txtpass)
  		.then((userCredential) =>{
  			firebase.database().ref('userDetails/' + emailid).set({
  				FirstName:txtfname,
  				LastName:txtlname,
  				Email: txtemail,
  				Status: status,
  				CreatedBy: txtemail,
  				Role: role,
  				CreatedOn: timenow
  			})
				Swal.fire('Success', 'Account Created Successfully', 'success')
  		})
  		.catch((error) => {
  			console.log(error)
  			Swal.fire('Error', error.message, 'error')
  		})
  	}else{
  		Swal.fire('Error', 'Passwords do not match', 'error')
  	}
  }

}) 