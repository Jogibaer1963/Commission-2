Meteor.subscribe('activeAssembly')

import { invokeMachineTest } from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

Template.team_1_over_view.helpers({

    machineReservoir: () => {
        let today = moment().add( -16, 'days').format('YYYY-MM-DD')
        let result = machineCommTable.find({activeAssemblyLineList : true},
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

    draw_fcb_threshing_team_1: () => {
        let canvasId = "machine_field_fcb_threshing";
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

    draw_bay3: () => {
        let canvasId = "machine_field_bay_3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay4: () => {
        let canvasId = "machine_field_bay_4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay5: () => {
        let canvasId = "machine_field_bay_5";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay6: () => {
        let canvasId = "machine_field_bay_6";
        invokeDrawMachineInBay(canvasId)
    },

})

Template.team_1_move_buttons.events({

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

})

Template.team_1_over_view.events({

    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "machine_field_fcb_threshing"
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

Template.list_of_points.events({
    'click .lop': (e) => {
        e.preventDefault();
        FlowRouter.go('/lop')
    },
})

Template.log_out_button.events({
    'click .log_out': (e) => {
        e.preventDefault();
        Meteor.logout();
        //Meteor.call('logOut', userName)
    },
})

