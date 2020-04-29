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

var db = firebase.firestore();
var fund;
var donated;
var available;

let pendingTableData = [];
let donationTableData = [];
let isPendingListClicked = true;

db.collection('Pending Donation').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') { // If data is added
            renderPendingList(change.doc);
        } else if (change.type === "removed") { // If data is removed
            let index = 0;
            for (let data of pendingTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    console.log("Removed ", index);
                    pendingTableData.splice(index, 1);
                    break;
                }
                index++;
            }
        } else if (change.type === "modified") { // If data is modified
            let index = 0;
            for (let data of pendingTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    pendingTableData[index] = change.doc.data();
                    break;
                }
                index++;
            }
        }
    });
    if (isPendingListClicked) {
        loadPendingTableData(pendingTableData);
    }

});


// Realtime data fetching of donation list
db.collection('Donation List').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    fund = "0"
    available = "0"
    changes.forEach(change => {
        if (change.type === 'added') { // If data is added
            renderDonationList(change.doc);
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
            let index = 0;
            for (let data of donationTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    console.log("Removed ", index);
                    donationTableData.splice(index, 1);
                    break;
                }
                index++;
            }
        } else if (change.type === "modified") { // If data is modified
            let index = 0;
            for (let data of donationTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    donationTableData[index] = change.doc.data();
                    break;
                }
                index++;
            }
        }

    });

    if (isPendingListClicked == false) {
        loadDonationTableData(donationTableData);
        console.log(isPendingListClicked);
    }
});

document.getElementById("pendingList").onclick = function () {
    isPendingListClicked = true;
    loadPendingTableData(pendingTableData);

}

document.getElementById("approvedList").onclick = function () {
    isPendingListClicked = false;
    loadDonationTableData(donationTableData);
}


//create element and render list
function renderPendingList(doc) {

    var values = {
        name: doc.data().name, email: doc.data().email, batch: doc.data().batch, account: doc.data().account,
        amount: doc.data().amount, transactionID: doc.data().transactionID
    };
    pendingTableData.push(values);
}

//create element and render list
function renderDonationList(doc) {

    var values = {
        name: doc.data().name, email: doc.data().email, batch: doc.data().batch, account: doc.data().account,
        amount: doc.data().amount, transactionID: doc.data().transactionID
    };
    donationTableData.push(values);
}





// Adding data into table
function loadPendingTableData(pendingTableData) {
    const tableBody = document.getElementById('donorList');
    let dataHtml = '';
    let index = 0;
    if (pendingTableData != null) {
        for (let data of pendingTableData) {
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
}


// Adding data into table
function loadDonationTableData(donationTableData) {
    const tableBody = document.getElementById('donorList');
    let dataHtml = '';
    let index = 0;
    if (donationTableData != null) {
        for (let data of donationTableData) {
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

}

// Adding onclick listener to the delete
function setEventListener() {
    let table = document.getElementById('table');
    for (let index = 0; index < table.rows.length; index++) {
        let element = document.getElementById("approveId" + index);
        let value = pendingTableData[index];
        // console.log(value);
        element.addEventListener('click', function () {
            approved(index, value)
        }, false);
    }
}

function approved(index, value) {

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