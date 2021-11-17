Meteor.subscribe('activeAssembly')

import { invokeMachineTest } from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';
import { invokeMoveFromLastBay } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

Template.team_1_over_view.helpers({

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

    frontThreshingReservoir: () => {
        let result = machineCommTable.find({activeFrontThreshingList: true},
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
    }

})


Template.team_1_over_view.events({

    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "fcb_station_1"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine, machineNr, canvasId);
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
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine, machineNr, canvasId);
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
    },

})

Template.team_1_move_buttons.helpers({

    disableBay_4_MoveButton_1: () => {
        try {
            let result = activeAssembly.findOne({_id: 'merge-station-1'},
                {fields: {machineReady: 1}});
            Session.set('machineState', result.machineReady);
            let machineState= Session.get('machineState');
            if (machineState === false) {
                document.getElementById('engine-1-move-button').setAttribute("disabled","disabled");
                Session.set('machineState', false)
                //  console.log('Machine not ready yet')
            } else {
                document.getElementById('engine-1-move-button').removeAttribute("disabled");
                Session.set('machineState', true)
                //    console.log('Bay is not empty button is enabled')
            }
        } catch (e) {}

    },

    disableBay_4_MoveButton_2: () => {
        try {
            let result = activeAssembly.findOne({_id: 'merge-station-2'},
                {fields: {machineReady: 1}});
            Session.set('machineState_2', result.machineReady);
            let machineState= Session.get('machineState_2');
            if (machineState === false) {
                document.getElementById('engine-2-move-button').setAttribute("disabled","disabled");
                Session.set('machineState', false)
                //  console.log('Machine not ready yet')
            } else {
                document.getElementById('engine-2-move-button').removeAttribute("disabled");
                Session.set('machineState', true)
                //    console.log('Bay is not empty button is enabled')
            }
        } catch (e) {}
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
    },

    'click .bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_3'
        let newCanvasId = "machine_field_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_4'
        let newCanvasId = "machine_field_bay_5";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-4-engine-1-move-button': (e) => {
        e.preventDefault();
        let result = activeAssembly.findOne({_id: 'machine_field_bay_4'}, {fields: {bayArray: 1}});
        let result_2 = activeAssembly.findOne({_id: 'merge-station-1'}, {fields: {bayArray: 1}});
        try {
            if (result.bayArray[0].machineNr === result_2.bayArray[0].machineNr) {
                let oldCanvasId = 'merge-station-1' // Last Bay
                invokeMoveFromLastBay(oldCanvasId)
                Meteor.call('engineReady', 3)  // set machineReady in activeAssembly Docu to false
            } else if (result.bayArray[1].machineNr === result_2.bayArray[0].machineNr) {
                let oldCanvasId = 'merge-station-1' // Last Bay
                invokeMoveFromLastBay(oldCanvasId)
                Meteor.call('engineReady', 3)  // set machineReady in activeAssembly Docu to false
            } else {
                alert('Machine in Bay 4 does not match Machine in Merge Station 1')
            }
        } catch (e) {}
    },

    'click .bay-4-engine-2-move-button': (e) => {
        e.preventDefault();
        let result = activeAssembly.findOne({_id: 'machine_field_bay_4'}, {fields: {bayArray: 1}});
        let result_2 = activeAssembly.findOne({_id: 'merge-station-2'}, {fields: {bayArray: 1}});
        try {
            if (result.bayArray[0].machineNr === result_2.bayArray[0].machineNr) {
                let oldCanvasId = 'merge-station-2' // Last Bay
                invokeMoveFromLastBay(oldCanvasId)
                Meteor.call('engineReady', 4)  // set machineReady in activeAssembly Docu to false
            } else if (result.bayArray[1].machineNr === result_2.bayArray[0].machineNr) {
                let oldCanvasId = 'merge-station-2' // Last Bay
                invokeMoveFromLastBay(oldCanvasId)
                Meteor.call('engineReady', 4)  // set machineReady in activeAssembly Docu to false
            } else {
                alert('Machine in Bay 4 does not match Machine in Merge Station 1')
            }
        } catch (e) {}
    },

    'click .rear-axle-move-button': (e => {
        e.preventDefault();
    })

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


