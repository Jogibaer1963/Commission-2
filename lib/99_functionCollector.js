export function checkMergeBay(oldCanvas, newCanvas, mergeCanvas) {
    let resultNewCanvas = activeAssembly.findOne({_id: newCanvas}, {fields: {bayArray: 1}})
    let resultOldCanvas = activeAssembly.findOne({_id: oldCanvas}, {fields: {bayArray: 1}})
    let resultMergeCanvas = activeAssembly.findOne({_id: mergeCanvas}, {fields: {bayArray: 1}})
    // check if a Machine is already in merge Canvas
    if (resultNewCanvas.bayArray.length === 0) {
        // merge Bay is empty
        invokeMoveMachine(oldCanvas, newCanvas);
       } else if  (resultMergeCanvas.bayArray[0].machineNr === resultOldCanvas.bayArray[0].machineNr) {
        // Machine Numbers are a Match, store merge data in machineCommTable in Merge Canvas
       // invokeMoveMachine(oldCanvas, newCanvas);
        Meteor.call('clearCanvas', oldCanvas)
       } else {
        // Merge Bay is not empty and Machines are not matching
    }

}


export function pickingToDay () {
    let today = Date.now();
    let timeResult = new Date(today);
    let pickingMonth = timeResult.getMonth();
    if (pickingMonth === 0) {
        pickingMonth = '00';
    }
    if (pickingMonth < 10 ) {
        pickingMonth = ("0" + timeResult.getMonth()).toString();
    }
    if (pickingMonth >= 10) {
        pickingMonth = (timeResult.getMonth()).toString();
    }
    let pickingDate = (timeResult.getDate()).toString();
    if (pickingDate < 10) {
        pickingDate = ("0" + timeResult.getDate()).toString()
    }
    let pickingDay = ("0" + timeResult.getDay()).toString() ;
    let pickingYear = (timeResult.getFullYear()).toString();

    // return (pickingYear + pickingMonth + pickingDate + pickingDay);
    return (pickingYear + pickingMonth + pickingDate + pickingDay)
}



// function to calculate times and charts

// calcTime is used in 10_col_assemblyLine_overview.js and 50_average_time_in_bay
export function calcTime(bayDateLeavingUnix, bayDateLandingUnix) {
    //This function will be used to calculate time between bay leaving and bay landing
    //Needs to remove time between 2:30PM and 6:00AM
    //Needs to remove time of weekends and holidays

    //totalJunkMinutes will store how many minutes we are going to remove from actualMinutes
    let totalJunkMinutes = 0;

    //Create land and leave dates
    //This creates an entire date+time, but we'll only be using the "day" part of it
    let leave = moment(new Date(bayDateLeavingUnix * 1));
    let land = moment(new Date(bayDateLandingUnix * 1));

    //Calculate the difference in days between leave and land
    let difference = leave.format("D") - land.format("D");


    //Difference will be negative after we hit the end of the month, need to account for that
    if(difference < 0){
        //Subtract from the actual leave date itself by the day that we landed
        //ex) Land 10-29-21, Leave 11-1-21, this is a difference of 3 days
        //11-1-21 - 10-29-21 = 10-3-21
        //We then just grab that day to get our difference
        leave.subtract(land.format("D"), "days");
        difference = leave.format("D");
    }
    //If difference is greater than 0, we have to remove some time
    if(difference > 0){
        //We subtract a day, then multiply difference by the number of minutes in a day
        //This is done because if the difference is 1, we only remove 930 minutes
        totalJunkMinutes = 1440 * (difference - 1);
        totalJunkMinutes += 930;
    }

    // Calculate how long we were in the bay, convert Unix milliseconds into minutes (60)
    let actualMinutes = ((bayDateLeavingUnix - bayDateLandingUnix) / 60000).toFixed(0);

    //Subtract our junkMinutes
    actualMinutes = actualMinutes - totalJunkMinutes;

    //Send our minutes back to timeMachineMoved() for it to display
    return actualMinutes;
}



// collection of functions for drawing Machines in Canvas.


// ***************   check status of the field if empty or engaged   **********************


export function  invokeDrawMachineInBay(canvasId) {
    let result = activeAssembly.findOne({_id : canvasId},{});
   // console.log(result, canvasId)
    try {
        if (result.bayArray.length === 0) {
            // draw empty field in Bay
            invokeEmptyBay(canvasId)
        } else if (result.bayArray.length === 1) {
            // draw 1 machine in Bay
            let machineNrInBay = result.bayArray[0].machineNr;
            invokeDrawOneMachine(machineNrInBay, canvasId);
        }  //If we have 2 machines in our bay, draw the bay with two machines in it ***************************
        else if (result.bayArray.length === 2) {
            // draw 2 Machines in Bay
            let machineOne = result.bayArray[0].machineNr;
            let machineTwo =  result.bayArray[1].machineNr;

            //Grab status for each machine
            let machine1 = machineCommTable.findOne({machineId : machineOne}, {});
            let machine2 = machineCommTable.findOne({machineId : machineTwo}, {});
            let machine1Status = "";
            let machine2Status = "";
            machine1Status += machine1.timeLine.ecnMachine;
            machine2Status += machine2.timeLine.ecnMachine;

            //Calls function to draw two machines
            invokeDrawTwoMachines(machineOne, machineTwo, canvasId, machine1Status, machine2Status)
        }
    } catch(e) {
    }
}

export function invokeEmptyBay(canvasId) {
    Meteor.defer(function() {
        //console.log('inside first function', canvasId)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear any canvas in Bay
        // inverse front of test bay in empty green engaged red
        if (canvasId === 'machine_field_front_test_bay' ||
            canvasId === 'machine_field_test_bay_3' ||
            canvasId === 'machine_field_test_bay_4') {
            ctx.strokeStyle = "#2cee0e";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30)
        } else {
            ctx.strokeStyle = "#ee0e0e";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30);
        }
    })
}

export function invokeMoveMachine(oldCanvasId, newCanvasId, moveBack) {
    let machineId, machineNr, machineToMove, result, machineCount, jsonObject, spaceResult, space_in_Bay, user;
    spaceResult = activeAssembly.findOne({_id: newCanvasId}, {fields: {baySpace: 1}});
 //   console.log(newCanvasId)
    space_in_Bay = spaceResult.baySpace;
    user = Meteor.user().username; // console.log('test 1 ', oldCanvasId, newCanvasId, spaceResult)
     machineToMove = invokeMachineTest(oldCanvasId) // checking which machine is in Bay now
     result = invokeMachineTest(newCanvasId);  // checking if a machine is in front
  //  console.log('inside function')
    if (result[0] === 0) {  // no machine in front
        machineCount = machineToMove[0];
        if (machineCount === 1) {
            // move 1 Machine
            jsonObject = machineToMove[1][0];
            machineId = jsonObject.machineId;
            machineNr = jsonObject.machineNr;
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false)
        } else if (machineCount === 2) {
            if(moveBack === true) {
                // 2 Machines in present Bay, Move second machine backward
                machineId = machineToMove[1][1].machineId;
                machineNr = machineToMove[1][1].machineNr;
            } else {
                // 2 Machines in present Bay, but nothing in front, Move first machine forward
                machineId = machineToMove[1][0].machineId;
                machineNr = machineToMove[1][0].machineNr;
            }
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, true)
        }
    } else if (result[0] === 1 && space_in_Bay === 2) {  // already 1 machine in front and Space for 2
        // find Machine Number already in Bay
        let presentMachineNr = result[1][0].machineNr;
        let jsonObject = machineToMove[1][0];
        let machineId = jsonObject.machineId;
        let machineNr = jsonObject.machineNr;
        Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false)
        invokeDrawTwoMachines(presentMachineNr, machineNr, newCanvasId)
    } else if (result[0] === 1 && space_in_Bay === 1) {
        // found 1 Machine up front but only space for 1 dont move, send alert
        Bert.alert('Only 1 Machine in Bay up front allowed', 'danger', 'growl-top-left')
    } else if (result[0] === 2) {
        // console.log('found 2 Machine in Bay in front', result)
        // dont move machine, send alert
        Bert.alert('3 Machines in one Bay is not possible', 'danger', 'growl-top-left')
    }
}

// ****  draw 1 machine  **********************
export function invokeDrawNewMachine(machineNr, canvasId) {
    Meteor.defer(function() {
        //  console.log('Draw Machine in next Bay', machineNr, canvasId)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (machineNr && canvasId) {
            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#3ee021";
            ctx.lineWidth = "2"
            ctx.strokeRect(0, 15, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(machineNr, 55, 35)
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    })
}

// used for Functions inside this template. No export

function invokeDrawTwoMachines(presentMachine, newMachine, newCanvasId, presentMachineStatus, newMachineStatus) {
    Meteor.defer(function() {
        // ******************   Delete previous drawn Canvas  ***************
        let canVas = document.getElementById(newCanvasId);
        let context = canVas.getContext("2d");
        context.clearRect(0, 0, canVas.width, canVas.height);

        // ****************  Draw new Canvas  *********************************

        let canvas = document.getElementById(newCanvasId);
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");
            //ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#ee0e0e";

            //Draw machine 1 of 2 in the bay **********************************************************
            //Check for ECN, reconfigure, or a special message

            if(presentMachineStatus !== "") {
                //If status has something in it, change machine # text to yellow
                ctx.fillStyle = '#DEB511FF'
            }
            else{
                ctx.fillStyle = '#61db1a'
            }

            ctx.fillStyle = '#61db1a'
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30);
            ctx.font = "bold 15px Arial";
            ctx.fillText(presentMachine, 55, 35);

            //Draw machine 2 of 2 in the bay **********************************************************
            //Check for ecn, reconfigure, or special message

            if(newMachineStatus !== "") {
                //If status has something in it, change machine # text to yellow
                ctx.fillStyle = '#DEB511FF'
            }
            else{
                ctx.fillStyle = '#61db1a'
            }

            ctx.fillStyle = '#61db1a'
            ctx.lineWidth = "2"
            ctx.strokeRect(0, 55, 90, 30);
            ctx.font = "bold 15px Arial"
            //ctx.fillText(newMachine, 10, 75);
            ctx.fillText(newMachine, 10, 75);
        }
    })
}

 export function invokeDrawOneMachine(presentMachine, canvasId ){//, status) {
    Meteor.defer(function() {
        // console.log('Draw Machine in Bay', presentMachine, canvasId, status)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear leftovers
        if (canvasId === 'machine_field_front_test_bay' ||
            canvasId === 'machine_field_test_bay_3' ||
            canvasId === 'machine_field_test_bay_4')  {

            //Check for ecn, reconfig, or special message
            if(status !== ""){
                //If status has something in it, change machine # text to yellow
                ctx.fillStyle = '#DEB511FF'
            }
            else {
                ctx.fillStyle = '#37db1a'
            }
            ctx.strokeStyle = "#de1136";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(presentMachine, 55, 35)

        } else {

            //Check for ecn, reconfigure, or special message
            if(status !== ""){
                //If status has something in it, change machine # text to yellow
                ctx.fillStyle = '#DEB511FF'
            }
            else {
                ctx.fillStyle = '#37db1a'
            }

            ctx.strokeStyle = "#3ee021";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(presentMachine, 55, 35)
        }

    })
}

// Only related to Team 5 Bay 19

export function invokeMoveFromLastBay(canvasId) {
    // call server active Assembly set time date machine is leaving
    let user = Meteor.user().username;
    let result = invokeMachineTest(canvasId)
    let machineId = result[1][0].machineId;
    Meteor.call('leaveLine', machineId, canvasId, user);
    // draw empty canvas in Bay 19
    invokeEmptyBay(canvasId)
}

export function invokeMachineTest(canvasId) {
    let result = activeAssembly.findOne({_id: canvasId}, {})   // looking up in bay if and how many machines
    if (result.bayArray.length === 0) {
        // found empty bay
        //     console.log('function bay status 0', canvasId, result)
        return [0];
    } else if (result.bayArray.length === 1) {
        // found 1  Machines in Bay
      //    console.log('function bay status 1', canvasId, result)
        return [1, result.bayArray]
    } else if (result.bayArray.length === 2) {
      //   console.log('function bay status 2', canvasId, result)
        return [2, result.bayArray];
    }
}

export function unitCounter(bayId) {
    let newDate, newDateLeaving, unitCount, dateToDay, machineFinder,
        machineId, counterId, counterInBay, bayLeaving, diffTime, finalCounter ;
    dateToDay = Date.now();
    try {
        machineFinder = activeAssembly.findOne({_id: bayId})
        machineId = machineFinder.bayArray[0].machineId
        counterInBay = machineCommTable.findOne({_id: machineId}, {fields: {counter: 1, timeLine: 1}})
        counterId = counterInBay.counter
        bayLeaving = Date.parse(counterInBay.timeLine.inLine + ' ' + counterInBay.timeLine.inLine_time)
    } catch (e) {}
    diffTime = bayLeaving - dateToDay
    //console.log(diffTime)
    unitCount = -1;  // todo : check counting of Machines & update Production schedule for Machines already picked
    while (diffTime < 0) {
        counterId ++
        unitCount ++
        newDate = machineCommTable.findOne({counter: counterId}, {fields: {timeLine: 1}})
        newDateLeaving = Date.parse(newDate.timeLine.inLine + ' ' + newDate.timeLine.inLine_time)
        diffTime = newDateLeaving - dateToDay
        finalCounter = '-' + ' ' + unitCount + ' Units'
    }
    return finalCounter
}

export function updateTime() {
    document.getElementById('time').innerHTML = moment(new Date()).format("hh:mm:ss a");
    document.getElementById('date').innerHTML = moment(new Date()).format('MMMM Do YYYY')
}

export function timeCounter(bayId, timerId) {
    let result, machineNr, timeLine, leavingTime, leavingDateTime, moveTime,
        h, m, s, trueMovingTime;
    try {
        result = activeAssembly.findOne({_id: bayId});
        machineNr = result.bayArray[0].machineNr;
        timeLine = machineCommTable.findOne({machineId: machineNr},{fields: {timeLine: 1}})
        leavingTime = timeLine.timeLine.bay_4_time;
        leavingDateTime = timeLine.timeLine.bay4 + ' ' + leavingTime;
        moveTime =  ((parseInt(((new Date(leavingDateTime).getTime()) / 1000).toFixed(0)) -
            (Date.now() / 1000).toFixed(0)) ).toFixed(0);
        if (moveTime >= 0) {
            h = Math.floor(moveTime / 3600);
            m = Math.floor(moveTime % 3600 / 60);
            s = Math.floor(moveTime % 3600 % 60);
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s
            }
            trueMovingTime = h + ':' + m + ':' + s
            document.getElementById(timerId).innerHTML =
                trueMovingTime;
        }
        if (moveTime < 0) {
            let negativeMoveTime = Math.abs(moveTime)
            h = Math.floor(negativeMoveTime / 3600);
            m = Math.floor(negativeMoveTime % 3600 / 60);
            s = Math.floor(negativeMoveTime % 3600 % 60);
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s
            }
            trueMovingTime = '-' + h + ':' + m + ':' + s
            document.getElementById(timerId).innerHTML =
                trueMovingTime;
        }
    } catch(err) {}
}



