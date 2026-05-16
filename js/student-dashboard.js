auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'index.html'
    return
  }

  let emailid = user.email.replace(/\./g, '_dot_').replace(/@/g, '_at_')
  firebase.database().ref('userDetails/' + emailid).once('value')
    .then((snapshot) => {
      const data = snapshot.val()
      if (!data || (data.Role || '').toString().toLowerCase() !== 'student') {
        window.location.href = 'index.html'
        return
      }

      document.getElementById('lbusername').innerText = user.email
      document.getElementById('lbStudentName').innerText = `${data.FirstName || ''} ${data.LastName || ''}`.trim()
      document.getElementById('lbStudentStatus').innerText = data.Status || 'Unknown'

      firebase.database().ref('courses').once('value', (coursesSnapshot) => {
        let totalCourses = 0
        coursesSnapshot.forEach(() => totalCourses++)
        document.getElementById('lbStudentCourses').innerText = totalCourses
      })

      firebase.database().ref('userDetails').once('value', (usersSnapshot) => {
        let activeStudents = 0
        usersSnapshot.forEach((childSnapshot) => {
          const student = childSnapshot.val()
          if ((student.Role || '').toString().toLowerCase() === 'student' && (student.Status || '').toString().toLowerCase() === 'active') {
            activeStudents++
          }
        })
        document.getElementById('lbStudentActive').innerText = activeStudents
      })
    })
})
