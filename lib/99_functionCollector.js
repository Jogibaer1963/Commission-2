// collection of functions for drawing Machines in Canvas.


// ***************   check status of the field if empty or engaged   **********************

export function invokeMachineTest(canvasId) {
    let result = activeAssembly.findOne({_id: canvasId}, {})   // looking up in bay if and how many machines
    if (result.bayArray.length === 0) {
        // found empty bay
        //      console.log('function bay status 0', canvasId, result)
        return [0];
    } else if (result.bayArray.length === 1) {
        // found 1  Machines in Bay
        //   console.log('function bay status 1', canvasId, result)
        return [1, result.bayArray]
    } else if (result.bayArray.length === 2) {
        //    console.log('function bay status 2', canvasId, result)
        return [2, result.bayArray];
    }
}

export function invokeEmptyBay(canvasId) {
    Meteor.defer(function() {
        //  console.log('inside first function', machineNr, id)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear any canvas in Bay

        ctx.strokeStyle = "#ee0e0e";
        ctx.lineWidth = "2"
        ctx.strokeRect(0, 15, 90, 30)
    })
}

export function  invokeDrawMachineInBay(canvasId) {
    let result = activeAssembly.findOne({_id : canvasId},{});
    try {
        if (result.bayArray.length === 0) {
            // draw empty field in Bay
            invokeEmptyBay(canvasId)
        } else if (result.bayArray.length === 1) {
            // draw 1 machine in Bay
            let machineNrInBay = result.bayArray[0].machineNr;
            invokeDrawOneMachine(machineNrInBay, canvasId);
        } else if (result.bayArray.length === 2) {
            // draw 2 Machines in Bay
            let machineOne = result.bayArray[0].machineNr;
            let machineTwo =  result.bayArray[1].machineNr;
            // console.log(machineOne, machineTwo)
            invokeDrawTwoMachines(machineOne, machineTwo, canvasId)
        }
    } catch(e) {
    }
}

export function invokeMoveMachine(oldCanvasId, newCanvasId) {
    let spaceResult = activeAssembly.findOne({_id: newCanvasId}, {fields: {baySpace: 1}});
    let space_in_Bay = spaceResult.baySpace;
    let user = Meteor.user().username;
    let machineToMove = invokeMachineTest(oldCanvasId) // checking which machine is in Bay now
    let result = invokeMachineTest(newCanvasId);  // checking if a machine is in front
    //  console.log(machineToMove, result)
    if (result[0] === 0) {  // no machine in front
        let machineCount = machineToMove[0];
        //      console.log('machineToMove ', oldCanvasId, machineCount, newCanvasId, machineToMove)
        if (machineCount === 1) {
            // move 1 Machine
            let jsonObject = machineToMove[1][0];
            let machineId = jsonObject.machineId;
            let machineNr = jsonObject.machineNr;
            //       console.log('Object ',machineId, machineNr, user, oldCanvasId, newCanvasId)
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false)
        } else if (machineCount === 2) {
            //        console.log('2 Machines')
            // 2 Machines in present Bay, but nothing in front, Move first machine
            let machineId = machineToMove[1][0].machineId;
            let machineNr = machineToMove[1][0].machineNr;
            //       console.log(machineToMove[1][0].machineNr)
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, true)
        }

    } else if (result[0] === 1 && space_in_Bay === 2) {  // already 1 machine in front and Space for 2
        //     console.log('found 1 Machine in Bay', result[1][0])
        // find Machine Number already in Bay
        let presentMachineNr = result[1][0].machineNr;
        let jsonObject = machineToMove[1][0];
        let machineId = jsonObject.machineId;
        let machineNr = jsonObject.machineNr;
        Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false)
        invokeDrawTwoMachines(presentMachineNr, machineNr, newCanvasId)
    } else if (result[0] === 1 && space_in_Bay === 1) {
        // found 1 Machine up front but only space for 1 dont move, send alert
        window.alert('Only 1 Machine in Bay up front allowed')
    } else if (result[0] === 2) {
        // console.log('found 2 Machine in Bay in front', result)
        // dont move machine, send alert
        window.alert('3 Machines in one Bay are not possible')
    }


}

// ****  draw 1 machine  **********************
export function invokeDrawNewMachine(machineNr, canvasId) {
    Meteor.defer(function() {
        //   console.log('Draw Machine in next Bay', machineNr, canvasId)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (machineNr && canvasId) {
            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#3ee021";
            ctx.lineWidth = "2"
            ctx.strokeRect(0, 0, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(machineNr, 7, 20)
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    })
}

// used for Functions inside this template. No export

function invokeDrawTwoMachines(presentMachine, newMachine, newCanvasId) {
    Meteor.defer(function() {
        // ******************   Delete previous drawn Canvas  ***************
        let canVas = document.getElementById(newCanvasId);
        let context = canVas.getContext("2d");
        context.clearRect(0, 0, canVas.width, canVas.height);

        // ****************  Draw new Canvas  *********************************

        let canvas = document.getElementById(newCanvasId);
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");

            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#ee0e0e";

            ctx.lineWidth = "2"
            ctx.strokeRect(0, 15, 90, 30);
            ctx.font = "bold 15px Arial";
            ctx.fillText(presentMachine, 10, 35);

            ctx.lineWidth = "2"
            ctx.strokeRect(0, 55, 90, 30);
            ctx.font = "bold 15px Arial"
            ctx.fillText(newMachine, 10, 75)
        }
    })
}

 export function invokeDrawOneMachine(machineNr, canvasId, locator) {
    Meteor.defer(function() {
        //  console.log('Draw Machine in Bay', machineNr, canvasId, locator)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear leftovers

        ctx.fillStyle = '#37db1a'
        ctx.strokeStyle = "#3ee021";
        ctx.lineWidth = "2"
        ctx.strokeRect(0, 15, 90, 30)
        ctx.font = "bold 15px Arial"
        ctx.fillText(machineNr, 7, 35)
    })
}

// Only related to Team 5 Bay 19

function invokeMoveFromLastBay(canvasId) {
    // call server active Assembly set time date machine is leaving
    let user = Meteor.user().username;
    let result = invokeMachineTest(canvasId)
    let machineId = result[1][0].machineId;
    Meteor.call('leaveLine', machineId, canvasId, user);
    // draw empty canvas in Bay 19
    invokeEmptyBay(canvasId)
}

