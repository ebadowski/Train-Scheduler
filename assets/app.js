// Initialize Firebase
var config = {
    apiKey: "AIzaSyAVlI-9XUAiTXSKUcByKLWkBb9e8rS54zo",
    authDomain: "train-scheduler-deb1a.firebaseapp.com",
    databaseURL: "https://train-scheduler-deb1a.firebaseio.com",
    projectId: "train-scheduler-deb1a",
    storageBucket: "train-scheduler-deb1a.appspot.com",
    messagingSenderId: "497035860868"
};
firebase.initializeApp(config);

var database = firebase.database();
var trainArr = [];


$("#submit-button").on("click", function () {
    event.preventDefault();
    var newTrain = {
        name: $('#train-name').val(),
        destination: $('#train-destination').val(),
        time: $('#train-time').val(),
        frequency: $('#train-frequency').val()
    }

    trainArr.push(newTrain);

    database.ref().set({
        trains: JSON.stringify(trainArr)
    });

});

database.ref().on("value", function (snapshot) {
    if (snapshot.val() != null) {
        trainArr = JSON.parse(snapshot.val().trains);
    }

    writeTable();

    //$("#click-value").text(snapshot.val().clickCount);
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function writeTable() {
    $('#train-table').empty();
    for (var i = 0; i < trainArr.length; i++) {
        var tableRow = $('<tr>').appendTo('#train-table');
        $('<th>', {scope: 'row'}).text(trainArr[i].name).appendTo(tableRow);
        $('<td>').text(trainArr[i].destination).appendTo(tableRow);
        $('<td>').text(trainArr[i].frequency).appendTo(tableRow);
        $('<td>').text(calcArrival(trainArr[i].time, trainArr[i].frequency)).appendTo(tableRow); 
        $('<td>').text(minAway(trainArr[i].time, trainArr[i].frequency)).appendTo(tableRow);

    }
}

function minAway(startTime, freq){
    var start = moment(startTime, 'HH:mm');
    var timeDiff = moment().diff(moment(start), "minutes");
    return freq - (timeDiff%freq);
}

function calcArrival(startTime, freq){
    minutes = minAway(startTime, freq);
    
    var arrival = moment().add(minutes,'minutes').format('HH:mm');
    return arrival;
}

