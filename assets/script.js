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

let pendingTableData = [];
let donationTableData = [];
let distributedTableData = [];
let isPendingListClicked = true;
var amounts = {
    Shuvo: 0,
    Shabab: 0,
    Rahat: 0,
    Monjur: 0,
    Shafin: 0,
    Rafi: 0,
    Ovi: 0,
    Total: 0,
    Person: 0,
};

var fundAmount = {
    fund: 0,
    distributed: 0,
    balance: 0
}



db.collection('Result').onSnapshot(snapshot => {
    console.log("Result");
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type === 'added') {
            fundAmount["fund"] = change.doc.data().fund
            fundAmount["distributed"]  = change.doc.data().donated
            fundAmount["balance"] = change.doc.data().available
        } else if (change.type === "modified") {
            console.log(change.doc.data());
            fundAmount["fund"] = change.doc.data().fund
            fundAmount["distributed"]  = change.doc.data().donated
            fundAmount["balance"] = change.doc.data().available
        }
    });
})

document.getElementById('listName').innerHTML = "Pending List::"
setAmounts(amounts)

function setAmounts(amounts) {
    document.getElementById('shuvo').innerHTML = amounts.Shuvo
    document.getElementById('shabab').innerHTML = amounts.Shabab
    document.getElementById('rahat').innerHTML = amounts.Rahat
    document.getElementById('monjur').innerHTML = amounts.Monjur
    document.getElementById('shafin').innerHTML = amounts.Shafin
    document.getElementById('rafi').innerHTML = amounts.Rafi
    document.getElementById('ovi').innerHTML = amounts.Ovi
    document.getElementById('total').innerHTML = amounts.Total
    document.getElementById('person').innerHTML = amounts.Person
}

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
        if (pendingTableData.length > 0) {
            document.getElementById('noPendingItem').style.display = 'none'
        } else {
            document.getElementById('noPendingItem').style.display = 'block'
        }
        loadPendingTableData(pendingTableData);
    }

});


// Realtime data fetching of donation list
db.collection('Donation List').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') { // If data is added
            renderDonationList(change.doc);

            // Setting individual amounts
            amounts[change.doc.data().account] += parseInt(change.doc.data().amount);
            amounts['Total'] += parseInt(change.doc.data().amount);
            amounts['Person']++;

            setAmounts(amounts)
            // fundAmount.fund = parseInt(fundAmount.fund) + parseInt(change.doc.data().amount);
            // fundAmount.balance = parseInt(fundAmount.balance) + parseInt(change.doc.data().amount);

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

    saveFundAmount(fundAmount)
    if (isPendingListClicked == false) {

        loadDonationTableData(donationTableData);
        console.log(isPendingListClicked);
    }
});


//create element and render list
function renderDistributedList(doc) {

    var values = {
        name: doc.data().name, amount: doc.data().amount, charge: doc.data().charge,
        total: doc.data().total, transactionID: doc.data().transactionID, proof: doc.data().proof
    };
    distributedTableData.push(values);
}

db.collection('Distributed').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') { // If data is added
            renderDistributedList(change.doc);
        } else if (change.type === "removed") { // If data is removed
            let index = 0;
            for (let data of distributedTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    console.log("Removed ", index);
                    distributedTableData.splice(index, 1);
                    break;
                }
                index++;
            }
        } else if (change.type === "modified") { // If data is modified
            let index = 0;
            for (let data of distributedTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    distributedTableData[index] = change.doc.data();
                    break;
                }
                index++;
            }
        }
    });

    loadDistributedTableData(distributedTableData);

});


// Adding data into table
function loadDistributedTableData(distributedTableData) {
    const tableBody = document.getElementById('distributedList');
    let dataHtml = '';
    if (distributedTableData != null) {
        for (let data of distributedTableData) {
            dataHtml += '<tr><td><input class="list-value" value="' + data.name +
                '"></td><td><input class="list-value" value="' + data.amount +
                '"></td><td><input class="list-value" value="' + data.charge +
                '"></td><td><input class="list-value" value="' + data.total +
                '"></td><td><input class="list-value" value="' + data.proof +
                '"></center></td></tr>';
            tableBody.innerHTML = dataHtml;
        }

    }
}

const form = document.querySelector('#distributedForm');
function saveDistributedList() {

    var total = parseInt(form.amount.value) + parseInt(form.charge.value);
    //Inserted data of total funding
    db.collection('Distributed').doc(form.transactionID.value).set({
        name: form.name.value,
        amount: form.amount.value,
        charge: form.charge.value,
        total: total,
        transactionID: form.transactionID.value,
        proof: form.proof.value
    });

    fundAmount['distributed'] += total;
    fundAmount['balance'] -= total;

    saveFundAmount(fundAmount);
    
    form.name.value = ""
    form.amount.value = ""
    form.charge.value = ""
    form.transactionID.value = ""
    form.proof.value = ""
}

function saveFundAmount(fundAmount) {

    var donated;
    db
        .collection('Result')
        .doc('Result')
        .get()
        .then(doc => {
            if (doc.exists) {
                //Inserted data of total funding
                db.collection('Result').doc('Result').set({
                    fund: fundAmount.fund,
                    donated: fundAmount.distributed,
                    available: fundAmount.balance,
                });
            }
        })
        .catch(error => {
            console.log("Resutl error: ", error)
        });
}

document.getElementById("submit").onclick = function () {
    saveDistributedList();
}
document.getElementById("pendingList").onclick = function () {
    isPendingListClicked = true;
    if (pendingTableData.length > 0) {
        document.getElementById('noPendingItem').style.display = 'none'
    } else {
        document.getElementById('noPendingItem').style.display = 'block'
    }
    document.getElementById('listName').innerHTML = "Pending List::"
    loadPendingTableData(pendingTableData);

}

document.getElementById("approvedList").onclick = function () {
    isPendingListClicked = false;
    document.getElementById('noPendingItem').style.display = 'none'
    document.getElementById('listName').innerHTML = "Approved List::"
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