
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
        Meteor.call('clearCanvas', oldCanvas, function (err, response) {
            if (err) {
                console.log(err)
            }
        })
       } else {
        // Merge Bay is not empty and Machines are not matching
     //   Meteor.call('success', oldCanvas, newCanvas, 'move failed', function (err, response) {
     //       if (err) {
     //           console.log(err)
      //      }
     //   })
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

export function drawMachineInBay(canvasId) {
    try {
        let result = activeAssembly.findOne({_id: canvasId});
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        if (result.bayArray.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height) // clear leftovers
            // draw empty field in Bay
            ctx.strokeStyle = "#ee0e0e";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30);
        } else if (result.bayArray.length === 1) {
            // draw 1 machine in Bay
            let machineNrInBay = result.bayArray[0].machineNr
            let ecnCheck = result.bayArray[0].ecnMachine;
            if (ecnCheck === undefined) {ecnCheck = ''}
         // console.log(canvasId, machineNrInBay, ecnCheck)
            invokeDrawOneMachine(machineNrInBay, canvasId, ecnCheck);
        } else if (result.bayArray.length === 2) {
            // draw 2 Machines
            let firstMachine = result.bayArray[0].machineNr
            let secondMachine = result.bayArray[1].machineNr
            let ecnCheckOne = result.bayArray[0].ecnMachine;
            let ecnCheckTwo = result.bayArray[1].ecnMachine;
            if (ecnCheckOne === undefined) {ecnCheckOne = ''};
            if (ecnCheckTwo === undefined) {ecnCheckTwo = ''};
            invokeDrawTwoMachines(firstMachine, secondMachine, canvasId, ecnCheckOne, ecnCheckTwo)
        }
    } catch (e) {

    }
}

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

export function invokeMoveMachine(oldCanvasId, newCanvasId) {
    let machineId, machineNr, machineToMove, nextBay, oldBay, result, machineCount, jsonObject, spaceInNewBay, user,
        newMachineCount, oldMachineCount, ecnMachine, ecnSecondMachine, boolean
    user = Meteor.user().username;
    try {
        // gather information
        oldBay = activeAssembly.findOne({_id: oldCanvasId});
        nextBay = activeAssembly.findOne({_id: newCanvasId});
        // load space in new Bay and how many machines are there already
        spaceInNewBay = nextBay.baySpace;
        newMachineCount = nextBay.bayArray.length;  // count machines in new Bay
        machineId = oldBay.bayArray[0].machineId;
        machineNr = oldBay.bayArray[0].machineNr;
        ecnMachine = oldBay.bayArray[0].ecnMachine;
        oldMachineCount = oldBay.bayArray.length;
        if (oldMachineCount === 0 || oldMachineCount === 1) {
            boolean = false
        } else if (oldMachineCount === 2) {
            boolean = true
        }
     //   console.log('space in new bay', spaceInNewBay, newMachineCount)
        if (spaceInNewBay === 1 && newMachineCount === 0) {
            // move Machine
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, boolean, ecnMachine)
        } else if (spaceInNewBay === 1 && newMachineCount === 1) {
            alert('2 Machines are not allowed')
        } else if (spaceInNewBay === 2 && newMachineCount === 0) {
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, boolean, ecnMachine)
        } else if (spaceInNewBay === 2 && newMachineCount === 1) {
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, boolean, ecnMachine)
        } else if (spaceInNewBay === 2 && newMachineCount === 2) {
            alert('Bay is full, no movements allowed')
        } else {
            alert('undefined move detected')
        }
        // check how many Machines in old Bay, don't need ?
      //
       // ; needed ?
      //  ecnSecondMachine = oldPlace.bayArray[1].ecnMachine; needed ?

     }
    catch (e) {
    }
/*
    if (newMachineCount === 0) {  // no machine in front, just move
        Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false, ecnFirstMachine)
        machineCount = machineToMove[0];
        if (machineCount === 1) {
            // move 1 Machine
            jsonObject = machineToMove[1][0];
            machineId = jsonObject.machineId;
            machineNr = jsonObject.machineNr;
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false, ecnFirstMachine)
        } else if (machineCount === 2) {
                // 2 Machines in present Bay, but nothing in front, Move first machine forward
                machineId = machineToMove[1][0].machineId;
                machineNr = machineToMove[1][0].machineNr;
                Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, true, )
            }


    } else if (newMachineCount === 1 && spaceInNewBay === 2) {  // already 1 machine in front and Space for 2
        // find Machine Number already in Bay
        let presentMachineNr = result[1][0].machineNr;
        let jsonObject = machineToMove[1][0];
        let machineId = jsonObject.machineId;
        let machineNr = jsonObject.machineNr;
        Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false)
        invokeDrawTwoMachines(presentMachineNr, machineNr, newCanvasId, ecnFirstMachine, ecnSecondMachine, function (err, response) {
            if (err) {
                console.log(err)
            }
        })
    } else if (newMachineCount === 1 && space_in_Bay === 1) {
        // found 1 Machine up front but only space for 1 dont move, send alert
        Bert.alert('Only 1 Machine in Bay up front allowed', 'danger', 'growl-top-left')
    } else if (newMachineCount === 2) {
        // console.log('found 2 Machine in Bay in front', result)
        // dont move machine, send alert
        Bert.alert('3 Machines in one Bay is not possible', 'danger', 'growl-top-left')
    }

 */

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

export function invokeDrawTwoMachines( firstMachine, secondMachine, canvasId, ecnCheckOne, ecnCheckTwo) {
    Meteor.defer(function() {
        // ******************   Delete previous drawn Canvas  ***************
        let canVas = document.getElementById(canvasId);
        let context = canVas.getContext("2d");
       // console.log('254 ', canVas, context)
        context.clearRect(0, 0, canVas.width, canVas.height);
        // ****************  Draw new Canvas  *********************************
        let canvas = document.getElementById(canvasId);
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");
            ctx.strokeStyle = "#ee0e0e";
            //Draw machine 1 of 2 in the bay **********************************************************
            if(ecnCheckOne !== "") {
             //   console.log('ecnCheck ', ecnCheckOne)
                //If status has something in it, change machine # text to yellow
                ctx.fillStyle = '#DEB511FF'
            }
            else if (ecnCheckOne === undefined || ecnCheckOne === '') {
                ctx.fillStyle = '#61db1a'
            }
            ctx.fillStyle = '#61db1a'
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30);
            ctx.font = "bold 15px Arial";
            ctx.fillText(firstMachine, 55, 35);

            //Draw machine 2 of 2 in the bay **********************************************************
            if(ecnCheckTwo !== "") {
                //If status has something in it, change machine # text to yellow
                ctx.fillStyle = '#DEB511FF'
            }
            else  if (ecnCheckOne === undefined || ecnCheckOne === '') {
                ctx.fillStyle = '#61db1a'
            }
            ctx.fillStyle = '#61db1a'
            ctx.lineWidth = "2"
            ctx.strokeRect(0, 55, 90, 30);
            ctx.font = "bold 15px Arial"
            //ctx.fillText(newMachine, 10, 75);
            ctx.fillText(secondMachine, 10, 75);
        }
    })
}

 export function invokeDrawOneMachine(presentMachine, canvasId, ecnCheck) {
    Meteor.defer(function() {
        // console.log('Draw 1 Machine in Bay', presentMachine, canvasId, ecnCheck)
        let fillingColor, canvas, ctx, ecnColor
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear leftovers
        if (canvasId === 'machine_field_front_test_bay' ||
            canvasId === 'machine_field_test_bay_3' ||
            canvasId === 'machine_field_test_bay_4')
            {
                fillingColor = "#de1136";
            } else {
                fillingColor = "#3ee021"
            }
            if(ecnCheck !== ""){  //Check for ecn, re-config, or special message, change color to yellow
                ecnColor = '#DEB511FF'
            }
            else  if (ecnCheck === undefined || ecnCheck === '') {
                ecnColor = '#37db1a'
            }
            ctx.fillStyle = ecnColor
            ctx.strokeStyle = fillingColor;
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(presentMachine, 55, 35)
    })
}

// Only related to Team 5 Bay 19

export function invokeMoveFromLastBay(canvasId) {
   // console.log(canvasId)
    // call server active Assembly set time date machine is leaving
    let user = Meteor.user().username;
    let result = invokeMachineTest(canvasId)
    let machineId = result[1][0].machineId;
    Meteor.call('leaveLine', machineId, canvasId, user, function (err, response) {
        if (err) {
            console.log(err)
        }
    });
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

export function unitCounter(bayId, bayIdTime) {
    let newDate, newDateLeaving, unitCount, dateToDay, machineFinder,
        machineId, counterId, counterInBay, bayLeaving, diffTime, finalCounter, moveDate, moveTime,
        newMoveTime, newMoveDate, returnValue;
    unitCount = 0;
    dateToDay = Date.now();
    Session.set('dateToDay', dateToDay)
    try {
        machineFinder = activeAssembly.findOne({_id: bayId}) // Machine present in bay
        machineId = machineFinder.bayArray[0].machineId
        counterInBay = machineCommTable.findOne({_id: machineId}, {fields: {counter: 1, timeLine: 1}})
        counterId = counterInBay.counter
        moveDate = counterInBay.timeLine[bayIdTime[0]];
        moveTime = counterInBay.timeLine[bayIdTime[1]];
    } catch (e) {}
    bayLeaving = new Date(moveDate + ' ' + moveTime).getTime()
    Session.set('bayLeaving', bayLeaving)
    diffTime = bayLeaving - dateToDay
      // todo : check counting of Machines & update Production schedule for Machines already picked
    while (diffTime < 0) {
        counterId ++
        unitCount ++
        newDate = machineCommTable.findOne({counter: counterId}, {fields: {timeLine: 1}})
        newMoveDate = newDate.timeLine[bayIdTime[0]];
        newMoveTime = newDate.timeLine[bayIdTime[1]];
        newDateLeaving = new Date(newMoveDate + ' ' + newMoveTime).getTime()
        diffTime = newDateLeaving - dateToDay
        if (unitCount <= 1) {
            return ((unitCount -1) + ' Units')
        }
    }
    return ('-' + ' ' + (unitCount -1) + ' Units')
}

export function updateTime() {
    document.getElementById('time').innerHTML = moment(new Date()).format("hh:mm:ss a");
    document.getElementById('date').innerHTML = moment(new Date()).format('MMMM Do YYYY')
}

export function timeCounter(bayId, bayIdTime, timerId) {
  // console.log('bay ID time and Date ', bayId, bayIdTime, timerId)
    if (timerId !== 'In Time') {
        // Date - Time Machine should have moved minus Date and Time from Today.
        let  moveTime, result, machineId, bayLeaving, dateToday, trueMovingTime, unitCounter,
            h, m, s, counterInBay, moveDate, firstSlice, secondSlice, diffTime, newDiffTime;
        // console.log('time counter', bayId, bayIdTime, timerId)
        try {
            result = activeAssembly.findOne({_id: bayId});
            machineId= result.bayArray[0].machineNr;
            counterInBay = machineCommTable.findOne({machineId: machineId}, {fields: {timeLine: 1}})
            moveDate = counterInBay.timeLine[bayIdTime[0]];
            moveTime = counterInBay.timeLine[bayIdTime[1]];
            unitCounter = bayIdTime[2];
            if (unitCounter === undefined) {

            } else {
                newDiffTime = parseInt(unitCounter.slice(0,2));// takes 2 digits in case line is more than 9 units behind
              //  secondSlice = parseInt(unitCounter.slice(1, 2))
               // newDiffTime = parseInt(firstSlice + (secondSlice * 177 * 60))
            }

            bayLeaving = new Date(moveDate + ' ' + moveTime).getTime()
            dateToday =  Date.now();
            moveTime =  ((bayLeaving - dateToday) / 1000).toFixed(0)
         //   console.log('Move Time ', moveTime)
            if (moveTime >= 0) {
                /*
                  h = Math.floor(diffTime / 3600);
                  m = Math.floor(diffTime % 3600 / 60);
                  s = Math.floor(diffTime % 3600 % 60);
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
                 */
              //  console.log('inside Positive')

            }
            if (moveTime < 0) {
                let negativeMoveTime = Math.abs(newDiffTime)
                h = Math.floor(negativeMoveTime / 3600);
                m = Math.floor(negativeMoveTime % 3600 / 60);
                s = Math.floor(negativeMoveTime % 3600 % 60);
              //  console.log('hours ', h, m, s, newDiffTime, firstSlice, secondSlice, unitCounter)
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
               //     console.log('true Moving Time', trueMovingTime, moveTime, h, m, a)
                    document.getElementById(timerId).innerHTML = trueMovingTime;
            }
        } catch(err) {}

    } else {

    }

}



