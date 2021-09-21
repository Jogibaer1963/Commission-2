Meteor.subscribe('activeAssembly')

import { invokeMachineTest } from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

Template.team_1_OverView.helpers({

    machineReservoir: () => {
        let today = moment().add( -16, 'days').format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate : {$gt: today}, activeAssemblyLineList : true},
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


    //  ------------------  Assembly Line starts here --------------------------------
    //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_fcb_threshing: () => {
        let canvasId = "machine-field-fcb-threshing";
        let result = activeAssembly.findOne({_id : canvasId},{});
            console.log(result)
            if (result.bayArray.length === 0) {
                // draw empty field in Bay
                invokeEmptyBay(canvasId)
            } else if (result.bayArray.length === 1) {
                let locator = 'helper draw_fcb...'
                // draw 1 machine in Bay
                let machineNrInBay = result.bayArray[0].machineNr;
                invokeDrawOneMachine(machineNrInBay, canvasId, locator);
            }

    },

    draw_bay3: () => {
        let canvasId = "machine-field-bay3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay4: () => {
        let canvasId = "machine-field-bay4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay5: () => {
        let canvasId = "machine-field-bay5";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay6: () => {
        let canvasId = "machine-field-bay6";
        invokeDrawMachineInBay(canvasId)

    },

})

Template.team_1_OverView.events({


    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "machine-field-fcb-threshing"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
        //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine, machineNr, canvasId);
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Machines in Bay 2 are not allowed')
        }
    },

    'click .bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-fcb-threshing'
        let newCanvasId = "machine-field-bay3";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay3'
        let newCanvasId = "machine-field-bay4";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay4'
        let newCanvasId = "machine-field-bay5";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    }

})





