import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')

import {invokeDrawTwoMachines, invokeMachineTest} from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';
import { invokeMoveFromLastBay } from '../../lib/99_functionCollector.js';
import { checkMergeBay } from '../../lib/99_functionCollector.js';
invokeDrawTwoMachines



Session.set('twoMachines', false)


Template.team_1_over_view.helpers({

    // **********************************   inLineDate = Bay 2 Landing date / time

    machineReservoir: () => {
        let result = machineCommTable.find({activeAssemblyLineList : true},
            {fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    inLineTime: 1,
                    bayReady: 1
                }}).fetch();
        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0));
      //  console.log(result)
        return result;
    },

    rearAxleReservoir: () => {
        let result = machineCommTable.find({activeRearAxleList : true},
            {fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    inLineTime: 1,
                    bayReady: 1
                }}).fetch();
        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0));
        return result;
    },

    threshingReservoir: () => {
        let result = machineCommTable.find({activeThreshingList: true},
            {
                fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    inLineTime: 1,
                    bayReady: 1
                }
            }).fetch();
        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0));
        return result;
    },

    frontAxleReservoir: () => {
        let result = machineCommTable.find({activeFrontAxleList: true},
            {
                fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    inLineTime: 1,
                    bayReady: 1
                }
            }).fetch();
        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0));
        return result;
    },

    //  ***************    Move Machine from List to the FCB merging Station  *************



    draw_rear_axle: () => {
        let canvasId = "rear_axle_canvas"
        drawMachineInBay(canvasId) // function is inside client, only 1 unit possible
      },

    draw_front_axle: () => {
        let canvasId = "front_axle"
        drawMachineInBay(canvasId) // function is inside client, only 1 unit possible
    },

    draw_threshing_house: () => {
        let canvasId = "threshing_house"
        drawMachineInBay(canvasId) // function is inside client, only 1 unit possible
    },

    draw_front_threshing_merge: () => {
        let canvasId = "front_threshing_merge"
        drawMachineInBay(canvasId)
    },

    draw_rear_axle_machine_merge: () => {
        let canvasId = "rear_axle_machine_merge"
        drawMachineInBay(canvasId) // function is inside client, only 1 unit possible
    },

    draw_front_threshing_machine_merge: () => {
        let canvasId = "front_threshing_machine_merge"
        drawMachineInBay(canvasId) // function is inside client, only 1 unit possible
    },

    draw_fcb_station_1: () => {
        let canvasId = "fcb_station_1";
        drawMachineInBay(canvasId) // function is inside client, only 1 unit possible
    },

    draw_fcb_station_2: () => {
        let canvasId = "fcb_station_2";
        drawMachineInBay(canvasId) // function inside client, only 1 unit possible
    },

    draw_fcb_threshing_team_1: () => {
        let canvasId = "machine_field_fcb_threshing";
        drawMachineInBay(canvasId) // function inside client, only 1 unit possible
    },

    draw_bay3: () => {
        let canvasId = "machine_field_bay_3";
        drawMachineInBay(canvasId)
    },

    draw_bay4: () => {
        let canvasId = "machine_field_bay_4";
        drawMachineInBay(canvasId)
    },

    bay_4_engine_mount: () => {
            let result = activeAssembly.findOne({_id: 'machine_field_bay_4'})
            try {
                if (result.bayArray[0] === undefined) {
                    document.getElementById('bay-4-text-area').style.display = 'none'
                } else {
                    let bayState = result.bayArray[0].engineMounted;
                  //  console.log('inside function', bayState, result)
                    if (bayState === false || bayState === undefined) {
                //        console.log('no engine')
                        document.getElementById('bay-4-text-area').style.display = 'none'
                    } else if (bayState === true ) {
                 //       console.log('Engine Mounted')
                        document.getElementById('bay-4-text-area').style.display = 'block'
                    }
                }
            } catch (e) {
            }
    },

    first_engine: () => {
        try {
            let result = activeAssembly.findOne({_id: "merge-station-1"},
                {fields: {bayArray: 1, bayAssemblyStatus: 1}})
            if (result.bayAssemblyStatus === 1) {
                Session.set("merge_1", result.bayArray[0].machineNr)
                return result.bayArray[0].machineNr
            }
        } catch(err) {}
    },

    second_engine: () => {
        try {
            let result = activeAssembly.findOne({_id: "merge-station-2"},
                {fields: {bayArray: 1, bayAssemblyStatus: 1}})
            if (result.bayAssemblyStatus === 1) {
                Session.set("merge_2", result.bayArray[0].machineNr)
                return result.bayArray[0].machineNr
            }
        } catch(err) {}
    },

    third_engine: () => {
        try {
            let result = activeAssembly.findOne({_id: "merge-station-3"},
                {fields: {bayArray: 1, bayAssemblyStatus: 1}})
            if (result.bayAssemblyStatus === 1) {
                Session.set("merge_3", result.bayArray[0].machineNr)
                return result.bayArray[0].machineNr
            }
        } catch(err) {}
    },


})


function drawMachineInBay(canvasId) {
    try {
        let result = activeAssembly.findOne({_id : canvasId});
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
            let ecnCheck= result.bayArray[0].ecnMachine;
          //  console.log('machine detected ', ecnCheck, result, result.bayArray[0])
            invokeDrawOneMachine(machineNrInBay, canvasId, ecnCheck);
        } else if (result.bayArray.length === 2) {
            let firstMachine = result.bayArray[0].machineNr
            let secondMachine = result.bayArray[1].machineNr
            let ecnCheckOne = result.bayArray[0].ecnMachine;
            let ecnCheckTwo = result.bayArray[1].ecnMachine;
            console.log('2 machine detected', )
            invokeDrawTwoMachines(firstMachine, secondMachine, ecnCheckOne, ecnCheckTwo, canvasId)
        }
    } catch (e) {}
}


function checkMachinesInBay(canvasId) {
    let result = activeAssembly.findOne({_id: canvasId}, {})   // looking up in bay if and how many machines
    if (result.bayArray.length === 0) {
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        // found empty bay
        //     console.log('function bay status 0', canvasId, result)
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear leftovers
        // draw empty field in Bay
        ctx.strokeStyle = "#ee0e0e";
        ctx.lineWidth = "2"
        ctx.strokeRect(45, 15, 90, 30);
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

Template.team_1_over_view.events({

    //  **************   From List to FCB 1, include Front Axle and threshing move from list to Bays
    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine, machineNr, canvasId, bayStatus;
        selectedAssemblyMachine = this._id;
        machineNr = this.machineId;
        canvasId = "fcb_station_1";
        Session.set('machine_id', selectedAssemblyMachine);
        Session.set('machineInFCB_1', machineNr);
        bayStatus = checkMachinesInBay(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeAssemblyLineList');
            drawMachineInBay(canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
        canvasId = "front_axle"
        bayStatus = checkMachinesInBay(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeFrontAxleList');
            drawMachineInBay(canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
        canvasId = "threshing_house"
        bayStatus = checkMachinesInBay(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeThreshingList');
            drawMachineInBay(canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
    },

    'click .selectedRearAxle': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine, machineNr, canvasId, bayStatus;
        selectedAssemblyMachine = this._id;
        machineNr = this.machineId;
        canvasId = "rear_axle_canvas"
        bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeRearAxleList');
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
    },

    'click .selectedFrontAxle': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "front_axle"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeFrontAxleList');
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
    },

    'click .selectedThreshing': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "threshing_house"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeThreshingList');
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
    },

})

Template.team_1_move_buttons.helpers({

    disable_Bay_4_MoveButton: () => {
        try {
            let result_1, result_2, result_3;
            result_1 = activeAssembly.findOne({_id: 'merge-station-1'},
                {fields: {machineReady: 1, bayAssemblyStatus: 1}})
            result_2 = activeAssembly.findOne({_id: 'merge-station-2'},
                {fields: {machineReady: 1, bayAssemblyStatus: 1}})
            result_3 = activeAssembly.findOne({_id: 'merge-station-3'},
                {fields: {machineReady: 1, bayAssemblyStatus: 1}})
            if (result_1.machineReady === true || result_2.machineReady === true || result_3.machineReady === true) {
                return document.getElementById(
                    'engine-1-move-button').removeAttribute(
                    "disabled");
            } else  {
                return  document.getElementById(
                    'engine-1-move-button').setAttribute(
                    "disabled","disabled");
            }
        } catch(err) {}
    },

})

Template.message_board.helpers({

    lineOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user: "Team 1",
                                              status: {$in: [0, 1]}}).fetch();
        return result.sort((a, b) => a.status - b.status)
    },

    historyOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
       let result = lineOrders.find({team_user : "Team 1", status: 2}, {limit: 10}).fetch();
       return  result.sort((a, b) => b.unixTimeOrderCompleted - a.unixTimeOrderCompleted)
    },

    markedSelectedOrder: function(e) {
        const order = this._id;
        const selectedOrder = Session.get('orderCanceled');
        if (order === selectedOrder) {
            return "markedSelectedOrder";
        }
    }

})


Template.message_board.events({

    'click .selectedOrder': function (e) {
      e.preventDefault()
      let order = this._id
      Session.set('orderCanceled', order)
    },

    'click .t1-rep-bt':(e) => {
        e.preventDefault()
        FlowRouter.go('pdiRepairList')
    },

    'click .messageButton':(e) => {
        e.preventDefault()
        let newUrl = Session.get('ipAndPort') + 'messageBoard'
        window.open(newUrl,
            '_blank', 'toolbar=0, location=0,menubar=0, width=1000, height=500')
    },

    'click .cancelButton':(e) => {
        e.preventDefault()
        let orderCancel = Session.get('orderCanceled', )
        Meteor.call('cancelOrder', orderCancel)
    },


})


Template.team_1_move_buttons.events({

    'click .fcb-1-move-button': async function(e) {
        e.preventDefault();
        let oldCanvasId, newCanvasId, mergeCanvas, machineNr, canvasId, selectedAssemblyMachine
        machineNr = Session.get('machineInFCB_1')
        selectedAssemblyMachine = Session.get('machine_id');
        oldCanvasId = 'fcb_station_1'
        newCanvasId = "fcb_station_2";
        invokeMoveMachine(oldCanvasId, newCanvasId)
        oldCanvasId = 'threshing_house';
        newCanvasId = 'front_threshing_merge';
        mergeCanvas = 'front_threshing_merge';
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
        oldCanvasId = 'front_axle';
        newCanvasId = 'front_threshing_merge';
        mergeCanvas = 'front_threshing_merge';
        // check if front-threshing merge bay is empty or if the same machine number is already in
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
        canvasId = "rear_axle_canvas"
      //  bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
        let result = activeAssembly.findOne({_id: canvasId}, {})   // looking up in bay if and how many machines
        if (result.bayArray.length === 0) {
            Meteor.call('moveFromRearAxleList', machineNr, function (err, response) {
                if (err) {
                    console.log(err)
                } else {
                    invokeDrawNewMachine(machineNr, canvasId)
                }
            });
        }
    },

    'click .fcb-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId, newCanvasId, mergeCanvas;
        oldCanvasId = 'fcb_station_2'
        newCanvasId = "machine_field_fcb_threshing";
        invokeMoveMachine(oldCanvasId, newCanvasId)
        oldCanvasId = 'front_threshing_merge';
        newCanvasId = 'front_threshing_machine_merge';
        mergeCanvas = 'machine_field_fcb_threshing';
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
        oldCanvasId = 'rear_axle_canvas'
        newCanvasId = "rear_axle_machine_merge";
        mergeCanvas = 'machine_field_fcb_threshing'
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
    },

    'click .bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_fcb_threshing'
        let newCanvasId = "machine_field_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId)
        Meteor.call('clearMergeCanvas', function (err, response) {
            // wait until server operations are performed
        })
        // clear rear Axle merge and FCB-threshing merge canvas
        let canvasId = "rear_axle_machine_merge";
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.strokeStyle = "#ee0e0e";
        ctx.lineWidth = "2"
        ctx.strokeRect(45, 15, 90, 30);
        canvasId = 'machine_field_fcb_threshing'
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.strokeStyle = "#ee0e0e";
        ctx.lineWidth = "2"
        ctx.strokeRect(45, 15, 90, 30);
    },

    'click .bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_3'
        let newCanvasId = "machine_field_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId)
       // console.log('outside of function')
    },

    'click .bay-4-move-button': (e) => {
        e.preventDefault();
        let engine_mounted_1;
        let oldCanvasId = 'machine_field_bay_4'
        let newCanvasId = "machine_field_bay_5";
        let result = activeAssembly.findOne({_id: "machine_field_bay_4"})
        if (result.bayArray.length === 2) {
            if (result.bayArray[0].engineMounted === true) {
                invokeMoveMachine(oldCanvasId, newCanvasId)
            } else if (result.bayArray[0].engineMounted === false) {
                Bert.alert('Do not move Machine without Engine is mounted ! ', 'danger', 'growl-top-left')
            }
        } else if (result.bayArray.length === 1) {
            engine_mounted_1 = result.bayArray[0].engineMounted;
            if (engine_mounted_1 === false ) {
                Bert.alert('Do not move Machine without Engine is mounted ! ', 'danger', 'growl-top-left')
                } else {
                    invokeMoveMachine(oldCanvasId, newCanvasId)
                   }
        }

    },

    'click .bay-4-engine-1-move-button': (e) => {
        e.preventDefault();
        let target_machine_1, target_machine_2, machine_merge_1, machine_merge_2, 
            machine_merge_3, result, engine_mounted_1, engine_mounted_2;
        machine_merge_1 = Session.get("merge_1");
        machine_merge_2 = Session.get("merge_2");
        machine_merge_3 = Session.get("merge_3");
        result = activeAssembly.findOne({_id: 'machine_field_bay_4'},
            {fields: {bayArray: 1}});
        //console.log( result)
        if (result.bayArray.length === 1) {
            target_machine_1 = result.bayArray[0].machineNr; // 1 Machine in Bay 4 = target_machine_1
            engine_mounted_1 = result.bayArray[0].engineMounted;
           // console.log(engine_mounted_1, target_machine_1)
            if (engine_mounted_1 === false) {
                if (target_machine_1 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1'
                    let oldCanvasId_2 = 'cooling-merge-1'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineMountBay4', "merge-station-1", target_machine_1, "cooling-merge-1")
                } else if (target_machine_1 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2'
                    let oldCanvasId_2 = 'cooling-merge-2'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-2", target_machine_1, "cooling-merge-2")
                } else if (target_machine_1 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3'
                    let oldCanvasId_2 = 'cooling-merge-3'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-3", target_machine_1, "cooling-merge-3")
                } else {
                    Bert.alert('Machine in Bay 4 does not match with any ready engines', 'danger', 'growl-top-left')
                }
            } else {
                Bert.alert('Engine already mounted !!', 'danger', 'growl-top-left')
            }
        } else if (result.bayArray.length === 2) {
         //   console.log('2 machines detected')
         //   console.log(result)
            target_machine_1 = result.bayArray[0].machineNr;
            engine_mounted_1 = result.bayArray[0].engineMounted;
            target_machine_2 = result.bayArray[1].machineNr;
            engine_mounted_2 = result.bayArray[1].engineMounted;
          //  console.log(target_machine_1, target_machine_2, engine_mounted_1, engine_mounted_2)
            if (engine_mounted_1 === false && engine_mounted_2 === false) {
                if (target_machine_1 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1'
                    let oldCanvasId_2 = 'cooling-merge-1'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineMountBay4', "merge-station-1", target_machine_1, "cooling-merge-1")
                } else if (target_machine_1 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2'
                    let oldCanvasId_2 = 'cooling-merge-2'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-2", target_machine_1, "cooling-merge-2")
                } else if (target_machine_1 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3'
                    let oldCanvasId_2 = 'cooling-merge-3'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-3", target_machine_1, "cooling-merge-3")
                } else if (target_machine_2 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1'
                    let oldCanvasId_2 = 'cooling-merge-1'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineMountBay4', "merge-station-1", target_machine_2, "cooling-merge-1")
                } else if (target_machine_2 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2'
                    let oldCanvasId_2 = 'cooling-merge-2'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-2", target_machine_2, "cooling-merge-2")
                } else if (target_machine_2 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3'
                    let oldCanvasId_2 = 'cooling-merge-3'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-3", target_machine_2, "cooling-merge-3")
                } else {
                    Bert.alert('Machine in Bay 4 does not match Machine in Merge Station', 'danger', 'growl-top-left')
                }
            } else if (engine_mounted_2 === false && engine_mounted_1 === true) {
                if (target_machine_2 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1'
                    let oldCanvasId_2 = 'cooling-merge-1'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineMountBay4', "merge-station-1", target_machine_2, "cooling-merge-1")
                } else if (target_machine_2 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2'
                    let oldCanvasId_2 = 'cooling-merge-2'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-2", target_machine_2, "cooling-merge-2")
                } else if (target_machine_2 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3'
                    let oldCanvasId_2 = 'cooling-merge-3'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-3", target_machine_2, "cooling-merge-3")
                } else {
                    Bert.alert('Machine in Bay 4 does not match Machine in Merge Station', 'danger', 'growl-top-left')
                }
            } else if (engine_mounted_1 === false && engine_mounted_2 === true) {
                if (target_machine_1 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1'
                    let oldCanvasId_2 = 'cooling-merge-1'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineMountBay4', "merge-station-1", target_machine_1, "cooling-merge-1")
                } else if (target_machine_1 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2'
                    let oldCanvasId_2 = 'cooling-merge-2'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-2", target_machine_1, "cooling-merge-2")
                } else if (target_machine_1 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3'
                    let oldCanvasId_2 = 'cooling-merge-3'// Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId_2)
                    Meteor.call('engineMountBay4', "merge-station-3", target_machine_1, "cooling-merge-3")
                } else {
                    Bert.alert('Machine in Bay 4 does not match Machine in Merge Station', 'danger', 'growl-top-left')
                }
            }
        }



    },

     // Threshing & Front Axle List to assembly Bay

    'click .threshing-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'threshing_house';
        let newCanvasId = 'front_threshing_merge';
        let mergeCanvas = 'front_threshing_merge';
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
      //  invokeMoveMachine(oldCanvasId, newCanvasId);
    },

    'click .front-axle-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'front_axle';
        let newCanvasId = 'front_threshing_merge';
        let mergeCanvas = 'front_threshing_merge';
        // check if front-threshing merge bay is empty or if the same machine number is already in
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
    },

    // *****************  Merge Canvas  Bay 2  *****************************************

    'click .front-threshing-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'front_threshing_merge';
        let newCanvasId = 'front_threshing_machine_merge';
        let mergeCanvas = 'machine_field_fcb_threshing';
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
         //   invokeMoveMachine(oldCanvasId, newCanvasId);
    },

    'click .rear-axle-move-button': (e => {
        e.preventDefault();
        let oldCanvasId = 'rear_axle_canvas'
        let newCanvasId = "rear_axle_machine_merge";
        let mergeCanvas = 'machine_field_fcb_threshing'
        checkMergeBay(oldCanvasId, newCanvasId, mergeCanvas)
        // invokeMoveMachine(oldCanvasId, newCanvasId)
    }),


})


Template.team_1_move_buttons.onRendered(function() {
    try {
        let result = Session.get('machineState')
        if (result === false) {
            //  console.log('first', result)
            document.getElementById('engine-1-move-button').setAttribute("disabled","disabled"); // no machine in Bay button is disabled
        } else {
            //  console.log('second', result)
            document.getElementById('engine-1-move-button').removeAttribute("disabled");
        }
    } catch (e) {}

    try {
        let result = Session.get('machineState_2')
        if (result === false) {
            //  console.log('first', result)
            document.getElementById('engine-2-move-button').setAttribute("disabled","disabled"); // no machine in Bay button is disabled
        } else {
            //  console.log('second', result)
            document.getElementById('engine-2-move-button').removeAttribute("disabled");
        }
    } catch (e) {}

})

function invokeDrawNewMachine(machineNr, canvasId) {
    Meteor.defer(function() {
        //  console.log('Draw Machine in next Bay', machineNr, canvasId)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (machineNr && canvasId) {
            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#3ee021";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(machineNr, 55, 35)
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    })
}