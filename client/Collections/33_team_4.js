Meteor.subscribe('activeAssembly')

import {invokeMachineTest, invokeMoveFromLastBay} from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

// *********************  Header Buttons  ***********************************

Template.team_4_move_buttons.onRendered(function() {
    try {
        let result = Session.get('machineStatus')
        if (result === false) {
          //  console.log('first', result)
            document.getElementById('engine-ready-1').setAttribute("disabled","disabled"); // no machine in Bay button is disabled
        } else {
          //  console.log('second', result)
            document.getElementById('engine-ready-1').removeAttribute("disabled");
        }
    } catch (e) {}

    let result_2 = Session.get('machineStatus_2')
    try {
        if (result_2 === false) {
            document.getElementById('engine-ready-2').setAttribute("disabled","disabled");
         //   console.log('No array, Bay is empty button is disabled')
        } else {
            document.getElementById('engine-ready-2').removeAttribute("disabled");
         //   console.log('Bay is not empty button is enabled')
        }
    } catch (e) {}
})


//  ************************** Header Buttons end  ********************************
Template.team_4_move_buttons.helpers({

    disableEngineReady_1: () => {
        try {
            let result = activeAssembly.findOne({_id: 'merge-station-1'},
                               {fields: {bayArray: 1}});
            if (result.bayArray.length === 0) {
                document.getElementById('engine-ready-1').setAttribute("disabled","disabled");
                Session.set('machineStatus', false)
              //  console.log('No array, Bay is empty button is disabled')
            } else {
                document.getElementById('engine-ready-1').removeAttribute("disabled");
                Session.set('machineStatus', true)
            //    console.log('Bay is not empty button is enabled')
            }
        } catch (e) {}


    },

    disableEngineReady_2: () => {
        try {
            let result = activeAssembly.findOne({_id: 'merge-station-2'},
                                                 {fields: {bayArray: 1}});
            if (result.bayArray.length === 0) {
                document.getElementById('engine-ready-2').setAttribute("disabled","disabled");
                Session.set('machineStatus_2', false)
            //    console.log('No array, Bay is empty button is disabled')
            } else {
                document.getElementById('engine-ready-2').removeAttribute("disabled");
                Session.set('machineStatus_2', true)
            //    console.log('Bay is not empty button is enabled')
            }
        } catch (e) {}
   }

})


Template.team_4_move_buttons.events({

    'click .cooling-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'cooling-station-1';
        let newCanvasId = 'cooling-station-2';
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .cooling-2-move-button': (e) => {
         e.preventDefault();
         let oldCanvasId = 'cooling-station-2';
        invokeMoveFromLastBay(oldCanvasId)
    },


    'click .engine-1-move': (e) => {
        e.preventDefault();
        let oldCanvasId = 'engine-station-1'
        let newCanvasId = "engine-station-2";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .engine-2-move': (e) => {
        e.preventDefault();
        let oldCanvasId = 'engine-station-2'
        let newCanvasId = "engine-station-3";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .engine-3-move': (e) => {
        e.preventDefault();
        let oldCanvasId = 'engine-station-3'
        let newCanvasId = "engine-station-4";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .engine-4-move': (e) => {
        e.preventDefault();
        let oldCanvasId, newCanvasId, result_1, result_2
        oldCanvasId = 'engine-station-4'
        // checking which merging station is open
        result_1 = activeAssembly.findOne({_id: "merge-station-1"}, {fields: {bayArray: 1}});
        result_2 = activeAssembly.findOne({_id: "merge-station-2"}, {fields: {bayArray: 1}});
     //   console.log(result_1.bayArray.length, result_2.bayArray.length)
        if (result_1.bayArray.length === 1 && result_2.bayArray.length === 1) {
            // Machine is Station 1 and 2 detected triggers windows alert

        } else if (result_1.bayArray.length === 0) {
            // No Machine in Station 1 detected
            newCanvasId = 'merge-station-1'
        } else if (result_2.bayArray.length === 0) {
            // No Machine in Station 2
            newCanvasId = 'merge-station-2'
        }
     //   console.log(oldCanvasId, newCanvasId)
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .engine-1-ready-button': (e) => {
        e.preventDefault();
        Meteor.call('engineReady', 1)
    },

    'click .engine-2-ready-button': (e) => {
        e.preventDefault();
        Meteor.call('engineReady', 2)
    }

})


Template.team_4_over_view.helpers({

    engineReady_1: () => {
        try {
           let result = activeAssembly.findOne({_id: 'merge-station-1'}, {fields: {machineReady: 1}})
           // console.log(result.machineReady)
            return result.machineReady
        } catch(e) {}
    },

    engineReady_2: () => {
        try {
            let result = activeAssembly.findOne({_id: 'merge-station-2'}, {fields: {machineReady: 1}})
            // console.log(result.machineReady)
            return result.machineReady
        } catch(e) {}
    },

    coolingBoxReservoir: () => {
        let result = machineCommTable.find({activeCoolingBoxList: true},
            {fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    bayReady: 1
                }}).fetch();
      //  console.log(result)
        result.sort((a, b) => (a.counter > b.counter) ? 1 : ((b.counter > a.counter) ? -1 : 0))
        return result;
    },

    machineReservoir: () => {
        let result = machineCommTable.find({activeEngineList : true},
            {fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    bayReady: 1
                                   }}).fetch();

        result.sort((a, b) => (a.counter > b.counter) ? 1 : ((b.counter > a.counter) ? -1 : 0));
        // console.log(result)
        return result;
    },

    //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_engine_1: () => {
        let canvasId = "engine-station-1";
        let result = activeAssembly.findOne({_id : canvasId});
        try {
            if (result.bayArray.length === 0) {
                // draw empty field in Bay
                invokeEmptyBay(canvasId)
            } else if (result.bayArray.length === 1) {
                let locator = 'helper draw_fcb...'
                // draw 1 machine in Bay
                let machineNrInBay = result.bayArray[0].machineNr;
                invokeDrawOneMachine(machineNrInBay, canvasId, locator);
            }
        } catch(e) {

        }
    },

    draw_engine_2: () => {
        let canvasId = "engine-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_engine_3: () => {
        let canvasId = "engine-station-3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_engine_4: () => {
        let canvasId = "engine-station-4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_cooling_1: () => {
        let canvasId = "cooling-station-1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_cooling_2: () => {
        let canvasId = "cooling-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_merge_1: () => {
        let canvasId = "merge-station-1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_merge_2: () => {
        let canvasId = "merge-station-2";
        invokeDrawMachineInBay(canvasId)
    },

})

Template.team_4_over_view.events({

    'click .selectedCoolingBox': async function (e) {
        e.preventDefault();
        let selectedCoolingBox = this._id;
        let machineNr = this.machineId;
        let canvasId = "cooling-station-1"
      //  console.log(selectedCoolingBox, machineNr, canvasId)
        let bayStatus = await invokeMachineTest(canvasId)
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedCoolingBox, machineNr, canvasId);
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Cooling Boxes not allowed in Station 1')
        }
    },


    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "engine-station-1"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
    //    console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine, machineNr, canvasId);
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Engines in Station 1 are not allowed')
        }
    },


})
