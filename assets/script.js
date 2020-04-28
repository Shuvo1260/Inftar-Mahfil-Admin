var firebaseConfig = {
    apiKey: "AIzaSyAsn1tsVokdbR9dHZuaLlbSJYnMBwl-ZQA",
    authDomain: "iftar-mahfil.firebaseapp.com",
    databaseURL: "https://iftar-mahfil.firebaseio.com",
    projectId: "iftar-mahfil",
    storageBucket: "iftar-mahfil.appspot.com",
    messagingSenderId: "154325578581",
    appId: "1:154325578581:web:be38097ba1b187dffef5dc",
    measurementId: "G-46SGQGSFHS",
    crossDomain: true,
    crossorigin: true
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

console.log("Result");
var db = firebase.firestore();
var fund;
var donated;
var available;

let tableData = [];

    db.collection('Result').onSnapshot(snapshot => {
        console.log("Result");
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            console.log(change.doc.data());
            if (change.type === 'added') {
                fund = change.doc.data().fund
                donated = change.doc.data().donated
                available = change.doc.data().available
            } else if (change.type === "modified") {
                console.log(change.doc.data());
                fund = change.doc.data().fund
                donated = change.doc.data().donated
                available = change.doc.data().available
            }
        });
    })

document.getElementById("pendingList").onclick = function () {


    console.log(fund)
    tableData = []
    databasePath = 'Pending Donation'
    // Realtime data fetching
    db.collection('Pending Donation').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            console.log(change.doc.data());
            if (databasePath === 'Pending Donation') {
                if (change.type === 'added') { // If data is added
                    renderList(change.doc);
                } else if (change.type === "removed") { // If data is removed
                    console.log(change.doc.data().transactionID);
                    let index = 0;
                    for (let data of tableData) {
                        if (data.transactionID == change.doc.data().transactionID) {
                            console.log("Removed ", index);
                            tableData.splice(index, 1);
                            break;
                        }
                        index++;
                    }
                } else if (change.type === "modified") { // If data is modified
                    console.log(change.doc.data().transactionID);
                    let index = 0;
                    for (let data of tableData) {
                        if (data.transactionID == change.doc.data().transactionID) {
                            console.log("Modified ", index);
                            tableData[index] = change.doc.data();
                            break;
                        }
                        index++;
                    }
                }
            }
        });
        if (databasePath === 'Pending Donation') {
            loadTableData(tableData);
        }
    });
}

document.getElementById("approvedList").onclick = function () {
    console.log("approved")
    tableData = []
    databasePath = 'Donation List'
    // Realtime data fetching
    db.collection('Donation List').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        fund = "0"
        available = "0"
        changes.forEach(change => {
            if (databasePath === 'Donation List') {
                console.log(change.doc.data());
                if (change.type === 'added') { // If data is added
                    renderList(change.doc);
                    // fund = parseInt(fund) + parseInt(change.doc.data().amount);
                    // available = parseInt(available) + parseInt(change.doc.data().amount);
                    // console.log("fund: " + fund);
                    // console.log("Available: " + available);
                    // //Inserted data
                    // db.collection('Result').doc('Result').set({
                    //     fund: fund,
                    //     donated: donated,
                    //     available: available,
                    // });

                } else if (change.type === "removed") { // If data is removed
                    console.log("Id: " + change.doc.data().transactionID);
                    let index = 0;
                    for (let data of tableData) {
                        if (data.transactionID == change.doc.data().transactionID) {
                            console.log("Removed ", index);
                            tableData.splice(index, 1);
                            break;
                        }
                        index++;
                    }
                } else if (change.type === "modified") { // If data is modified
                    console.log(change.doc.data().transactionID);
                    let index = 0;
                    for (let data of tableData) {
                        if (data.transactionID == change.doc.data().transactionID) {
                            console.log("Modified ", index);
                            tableData[index] = change.doc.data();
                            break;
                        }
                        index++;
                    }
                }
            }

        });

        if (databasePath === 'Donation List') {
            loadTableApprovedData(tableData);
        }
    });
}


//create element and render list
function renderList(doc) {

    var values = {
        name: doc.data().name, email: doc.data().email, batch: doc.data().batch, account: doc.data().account,
        amount: doc.data().amount, transactionID: doc.data().transactionID
    };

    tableData.push(values);
    console.log(tableData);
}

var databasePath = 'Pending Donation'




// Adding data into table
function loadTableData(tableData) {
    const tableBody = document.getElementById('donorList');
    let dataHtml = '';
    let index = 0;
    for (let data of tableData) {
        dataHtml += '<tr><td><input class="list-value" value="' + data.name +
            '"></td><td><input class="list-value" value="' + data.email +
            '"></td><td><input class="list-value" value="' + data.batch +
            '"></td><td><input class="list-value" value="' + data.account +
            '"></td><td><input class="list-value" value="' + data.amount +
            '"></td><td><input class="list-value" value="' + data.transactionID +
            '"></td><td><center><img id="approveId' + index + '" style="height: 25px; cursor:pointer;" src="assets/Images/approved.png"' +
            '></center></td></tr>';
        index++;
    }
    tableBody.innerHTML = dataHtml;

    // Setting event listener for each item
    setEventListener();
}


// Adding data into table
function loadTableApprovedData(tableData) {
    const tableBody = document.getElementById('donorList');
    let dataHtml = '';
    let index = 0;
    for (let data of tableData) {
        dataHtml += '<tr><td><input class="list-value" value="' + data.name +
            '"></td><td><input class="list-value" value="' + data.email +
            '"></td><td><input class="list-value" value="' + data.batch +
            '"></td><td><input class="list-value" value="' + data.account +
            '"></td><td><input class="list-value" value="' + data.amount +
            '"></td><td><input class="list-value" value="' + data.transactionID +
            '"></center></td></tr>';
        index++;
    }
    tableBody.innerHTML = dataHtml;

}

// Adding onclick listener to the delete
function setEventListener() {
    let table = document.getElementById('table');
    for (let index = 0; index < table.rows.length; index++) {
        let element = document.getElementById("approveId" + index);
        let value = tableData[index];
        console.log(value);
        element.addEventListener('click', function () {
            approved(index, value)
        }, false);
    }
    console.log(element);
}

function approved(index, value) {


    console.log(value);
    //Inserted data
    db.collection('Donation List').doc(value.transactionID).set({
        name: value.name,
        email: value.email,
        batch: value.batch,
        account: value.account,
        amount: value.amount,
        transactionID: value.transactionID
    }).then(function () {

        // fund = parseInt(fund) + parseInt(value.amount);
        // available = parseInt(available) + parseInt(value.amount);
        // console.log(fund);
        // console.log(available);
        // //Inserted data
        // db.collection('Result').doc('Result').set({
        //     fund: fund,
        //     donated: donated,
        //     available: available,
        // });
        // Deleting from database
        db.collection('Pending Donation').doc(value.transactionID).delete().then(function () {

            //confirmation message
            Swal.fire({
                icon: 'success',
                title: 'Approved',
                showConfirmButton: false,
                timer: 2000
            })
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    });
}
