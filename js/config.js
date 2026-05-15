const firebaseConfig = {
 apiKey: "AIzaSyAz1ZegMisJy731FuiPs-Y2XwkQGeP7XBU",
  authDomain: "attendance-b5676.firebaseapp.com",
  databaseURL: "https://attendance-b5676-default-rtdb.firebaseio.com",
  projectId: "attendance-b5676",
  storageBucket: "attendance-b5676.firebasestorage.app",
  messagingSenderId: "624814038751",
  appId: "1:624814038751:web:f9dc3de7a51a1aec06936a",
  measurementId: "G-JJXJP3DE73"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()

console.log ('connected to firebase')

function  logout() {
  // body...
  firebase.auth().signOut().then(function (){
    window.location.href = "index.html"
  }).catch((error) =>{
    alert("Error while you try to logout")
  })
}

function LoadingAnimation(){
  let loadingDiv = document.getElementById('loading')
  loadingDiv.style.display = "block"
}

function HideLoadingAnimation(){
  let loadingDiv = document.getElementById('loading')
  loadingDiv.style.display = "none"
}

function printReports() {
  const reports = document.getElementById('Reports');
  if (!reports) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Reports</title>
        <link rel="stylesheet" href="css/dashboard.css">
      </head>
      <body>
        ${reports.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}