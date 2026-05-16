let btnreset = document.getElementById('btnreset')
let emailInput = document.getElementById('txtemail')

btnreset.addEventListener("click", () =>{
	let txtemail = emailInput.value.trim()
	
	if (txtemail === '') {
		Swal.fire('Error', 'Please enter your email address', 'error')
		return
	}
	
	if (!validateEmail(txtemail)) {
		Swal.fire('Error', 'Please enter a valid email address', 'error')
		return
	}
	
	btnreset.disabled = true
	btnreset.textContent = 'Sending...'
	
	auth.sendPasswordResetEmail(txtemail)
	.then(() =>{
		Swal.fire('Success', 'Reset link has been sent (Check your email if it exists in our database)', 'success')
		emailInput.value = ""
		btnreset.disabled = false
		btnreset.textContent = 'Send reset link'
	})
	.catch((error) =>{
		Swal.fire('Error', error.message || 'Error sending reset link', 'error')
		console.log(error)
		btnreset.disabled = false
		btnreset.textContent = 'Send reset link'
	})
})

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
