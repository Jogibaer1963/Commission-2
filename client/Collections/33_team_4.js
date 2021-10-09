Meteor.subscribe('activeAssembly')

import {invokeMachineTest, invokeMoveFromLastBay} from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

// *********************  Header Buttons  ***********************************

Template.back_to_assembly_line.events({
    'click .btn-back': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLine')
    },
})


Template.team_1_buttons.events({
    'click .btn-team_1': (e) => {
        e.preventDefault();
        FlowRouter.go('/team_1')
    },
})

Template.team_2_buttons.events({
    'click .btn-team_2': (e) => {
        e.preventDefault();
        FlowRouter.go('/team_2')
    },
})

Template.team_3_buttons.events({
    'click .btn-team_3': (e) => {
        e.preventDefault();
        FlowRouter.go('/team_3')
    },
})

Template.team_4_buttons.events({
    'click .btn-team_4': (e) => {
        e.preventDefault();
        FlowRouter.go('/team_4')
    },
})

Template.team_test_bay_buttons.events({
    'click .btn-team_test_bay': (e) => {
        e.preventDefault();
        FlowRouter.go('/test_bay')
    },
})

Template.team_5_buttons.events({
    'click .btn-team_5': (e) => {
        e.preventDefault();
        FlowRouter.go('/team_5')
    },
})

//  ************************** Header Buttons end  ********************************

Template.team_4_move_buttons.events({

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
        let oldCanvasId, newCanvasId, result_1, result_2, machine_1, machine_2;
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

    'click .merge-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'merge-station-1' // Last Bay
        invokeMoveFromLastBay(oldCanvasId)
    },

    'click .merge-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'merge-station-2' // Last Bay
        invokeMoveFromLastBay(oldCanvasId)
    }

})




Template.team_4_over_view.helpers({

    machineReservoir: () => {
        let result = machineCommTable.find({activeEngineList : true},
            {fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    bayReady: 1
                                   }}).fetch();

        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0));
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
