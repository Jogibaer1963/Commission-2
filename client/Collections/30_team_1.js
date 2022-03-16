import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')

import { invokeMachineTest } from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';
import { invokeMoveFromLastBay } from '../../lib/99_functionCollector.js';
import { checkMergeBay } from '../../lib/99_functionCollector.js';

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

    draw_fcb_station_1: () => {
        let canvasId = "fcb_station_1";
        let result = activeAssembly.findOne({_id : canvasId});
        try {
            if (result.bayArray.length === 0) {
                // draw empty field in Bay
                invokeEmptyBay(canvasId)
            } else if (result.bayArray.length === 1) {
                // draw 1 machine in Bay
                let machineNrInBay = result.bayArray[0].machineNr;

                //Code to check ECN Status
                let machine1 = machineCommTable.findOne({machineId : machineNrInBay}, {});
                let machine1Status = "";
                machine1Status += machine1.timeLine.ecnMachine;
                invokeDrawOneMachine(machineNrInBay, canvasId, machine1Status);
            }
        } catch(e) {

        }
    },

    draw_rear_axle: () => {
        let canvasId = "rear_axle_canvas"
        invokeDrawMachineInBay(canvasId)
      },

    draw_front_axle: () => {
        let canvasId = "front_axle"
        invokeDrawMachineInBay(canvasId)
    },

    draw_threshing_house: () => {
        let canvasId = "threshing_house"
        invokeDrawMachineInBay(canvasId)
    },

    draw_front_threshing_merge: () => {
        let canvasId = "front_threshing_merge"
        invokeDrawMachineInBay(canvasId)
    },

    draw_rear_axle_machine_merge: () => {
        let canvasId = "rear_axle_machine_merge"
        invokeDrawMachineInBay(canvasId)
    },

    draw_front_threshing_machine_merge: () => {
        let canvasId = "front_threshing_machine_merge"
        invokeDrawMachineInBay(canvasId)
    },


    draw_fcb_station_2: () => {
        let canvasId = "fcb_station_2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_fcb_threshing_team_1: () => {
        let canvasId = "machine_field_fcb_threshing";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay3: () => {
        let canvasId = "machine_field_bay_3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay4: () => {
        let canvasId = "machine_field_bay_4";
        invokeDrawMachineInBay(canvasId)
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

    goal_bay_2: () => {
       return  setInterval(myTimerBay2, 1000)
    },

    goal_bay_3: () => {
        return  setInterval(myTimerBay3, 1000)
    },

    goal_bay_4: () => {
        return  setInterval(myTimerBay4, 1000)
    },

})


function myTimerBay2() {
    let result, machineNr, timeLine, leavingTime, leavingDateTime, moveTime,
        h, m, s, hDisplay, mDisplay, sDisplay;
    try {
        result = activeAssembly.findOne({_id: "machine_field_fcb_threshing"});
        machineNr = result.bayArray[0].machineNr;
        timeLine = machineCommTable.findOne({machineId: machineNr},{fields: {timeLine: 1}})
        leavingTime = timeLine.timeLine.inLine_time;
        leavingDateTime = timeLine.timeLine.inLine + ' ' + leavingTime;
        moveTime =  ((parseInt(((new Date(leavingDateTime).getTime()) / 1000).toFixed(0)) -
            (Date.now() / 1000).toFixed(0)) ).toFixed(0);
        h = Math.floor(moveTime / 3600);
        m = Math.floor(moveTime % 3600 / 60);
        s = Math.floor(moveTime % 3600 % 60);
        if (h > 0 ) {
            hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
            sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        } else if (h < 0) {
            m = Math.abs(m);
            s = Math.abs(s);
            hDisplay = h < 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
            sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        }
        if (h > 0 ) {
            document.getElementById('realTimerBay2').innerHTML =
                'Bay 2 should move in : ' + hDisplay + mDisplay + sDisplay;
        } else if (h < 0) {
            document.getElementById('realTimerBay2').innerHTML =
                'Bay 2 is behind : ' + hDisplay + mDisplay + sDisplay;
        }

    } catch(err) {}
}

function myTimerBay3() {
    let result, machineNr, timeLine, leavingTime, leavingDateTime, moveTime,
        h, m, s, hDisplay, mDisplay, sDisplay;
    try {
        result = activeAssembly.findOne({_id: "machine_field_bay_3"});
        machineNr = result.bayArray[0].machineNr;
        timeLine = machineCommTable.findOne({machineId: machineNr},{fields: {timeLine: 1}})
        leavingTime = timeLine.timeLine.inLine_time;
        leavingDateTime = timeLine.timeLine.inLine + ' ' + leavingTime;
        moveTime =  ((parseInt(((new Date(leavingDateTime).getTime()) / 1000).toFixed(0)) -
            (Date.now() / 1000).toFixed(0)) ).toFixed(0);
        h = Math.floor(moveTime / 3600);
        m = Math.floor(moveTime % 3600 / 60);
        s = Math.floor(moveTime % 3600 % 60);
        if (h > 0 ) {
            hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
            sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        } else if (h < 0) {
            m = Math.abs(m);
            s = Math.abs(s);
            hDisplay = h < 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
            sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        }
        if (h > 0 ) {
            document.getElementById('realTimerBay3').innerHTML =
                'Bay 3 should move in : ' + hDisplay + mDisplay + sDisplay;
        } else if (h < 0) {
            document.getElementById('realTimerBay3').innerHTML =
                'Bay 3 is behind : ' + hDisplay + mDisplay + sDisplay;
        }
    } catch(err) {}
}

function myTimerBay4() {
    let result, machineNr, timeLine, leavingTime, leavingDateTime, moveTime,
        h, m, s, hDisplay, mDisplay, sDisplay;
    try {
        result = activeAssembly.findOne({_id: "machine_field_bay_4"});
        machineNr = result.bayArray[0].machineNr;
        timeLine = machineCommTable.findOne({machineId: machineNr},{fields: {timeLine: 1}})
        leavingTime = timeLine.timeLine.inLine_time;
        leavingDateTime = timeLine.timeLine.inLine + ' ' + leavingTime;
        moveTime =  ((parseInt(((new Date(leavingDateTime).getTime()) / 1000).toFixed(0)) -
            (Date.now() / 1000).toFixed(0)) ).toFixed(0);
        h = Math.floor(moveTime / 3600);
        m = Math.floor(moveTime % 3600 / 60);
        s = Math.floor(moveTime % 3600 % 60);
        if (h > 0 ) {
            hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
            sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        } else if (h < 0) {
            m = Math.abs(m);
            s = Math.abs(s);
            hDisplay = h < 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
            sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        }
        if (h > 0 ) {
            document.getElementById('realTimerBay4').innerHTML =
                'Bay 4 should move in : ' + hDisplay + mDisplay + sDisplay;
        } else if (h < 0) {
            document.getElementById('realTimerBay4').innerHTML =
                'Bay 4 is behind : ' + hDisplay + mDisplay + sDisplay;
        }
    } catch(err) {}
}

Template.team_1_over_view.events({

    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "fcb_station_1"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeAssemblyLineList');
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
    },

    'click .selectedRearAxle': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "rear_axle_canvas"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
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
            let result_1, result_2, result_3, result_target;
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

Template.team_1_move_buttons.events({

    'click .fcb-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'fcb_station_1'
        let newCanvasId = "fcb_station_2";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .fcb-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'fcb_station_2'
        let newCanvasId = "machine_field_fcb_threshing";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_fcb_threshing'
        let newCanvasId = "machine_field_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId)
        // clear rear Axle merge and FCB-threshing merge canvas
        Meteor.call('clearMergeCanvas')
        /*
        let result = activeAssembly.findOne({_id: "machine_field_fcb_threshing"}, {fields: {bayArray:1}});
        Session.set('machine-bay-2-nr', result.bayArray[0].machineNr) ;

         */
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
                    let oldCanvasId = 'merge-station-1' // Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineReady', "merge-station-1", target_machine_1)
                } else if (target_machine_1 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2' // Last Bay
                    //     console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-2", target_machine_1)
                } else if (target_machine_1 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3' // Last Bay
                    //       console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-3", target_machine_1)
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
                    let oldCanvasId = 'merge-station-1' // Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineReady', "merge-station-1", target_machine_1)
                } else if (target_machine_1 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2' // Last Bay
                    //     console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-2", target_machine_1)
                } else if (target_machine_1 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3' // Last Bay
                    //       console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-3", target_machine_1)
                } else if (target_machine_2 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1' // Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineReady', "merge-station-1", target_machine_2)
                } else if (target_machine_2 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2' // Last Bay
                    //     console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-2", target_machine_2)
                } else if (target_machine_2 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3' // Last Bay
                    //       console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-3", target_machine_2)
                } else {
                    Bert.alert('Machine in Bay 4 does not match Machine in Merge Station', 'danger', 'growl-top-left')
                }
            } else if (engine_mounted_2 === false && engine_mounted_1 === true) {
                if (target_machine_2 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1' // Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineReady', "merge-station-1", target_machine_2)
                } else if (target_machine_2 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2' // Last Bay
                    //     console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-2", target_machine_2)
                } else if (target_machine_2 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3' // Last Bay
                    //       console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-3", target_machine_2)
                } else {
                    Bert.alert('Machine in Bay 4 does not match Machine in Merge Station', 'danger', 'growl-top-left')
                }
            } else if (engine_mounted_1 === false && engine_mounted_2 === true) {
                if (target_machine_1 === machine_merge_1) {
                    let oldCanvasId = 'merge-station-1' // Last Bay
                    invokeMoveFromLastBay(oldCanvasId)
                    //   console.log(oldCanvasId, target_machine_1, machine_merge_1)
                    Meteor.call('engineReady', "merge-station-1", target_machine_1)
                } else if (target_machine_1 === machine_merge_2) {
                    let oldCanvasId = 'merge-station-2' // Last Bay
                    //     console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-2", target_machine_1)
                } else if (target_machine_1 === machine_merge_3) {
                    let oldCanvasId = 'merge-station-3' // Last Bay
                    //       console.log(oldCanvasId)
                    invokeMoveFromLastBay(oldCanvasId)
                    Meteor.call('engineReady', "merge-station-3", target_machine_1)
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
        // invokeMoveMachine(oldCanvasId, newCanvasId);
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