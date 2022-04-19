Meteor.subscribe('activeAssembly')

import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

Template.team_3_over_view.helpers({

    //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_bay8: () => {
        let canvasId = "machine_field_bay_8";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay9: () => {
        let canvasId = "machine_field_bay_9";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay10: () => {
        let canvasId = "machine_field_bay_10";
        invokeDrawMachineInBay(canvasId)
    },


})

Template.team_3_move_buttons.events({

    'click .bay-8-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_8'
        let newCanvasId = "machine_field_bay_9";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-9-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_9'
        let newCanvasId = "machine_field_bay_10";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-10-move-button': (e) => {
        e.preventDefault();
        // check if test bay 1 is empty, if not then move to front of test bay
        let result = activeAssembly.findOne({_id: 'machine_field_test_bay_1'},
            {fields: {bayArray : 1}})
        if (result.bayArray.length > 0) {
            // console.log('test bay 1 is engaged move in front of test bay')
            let oldCanvasId = 'machine_field_bay_10'
            let newCanvasId = "machine_field_front_test_bay";
            invokeMoveMachine(oldCanvasId, newCanvasId, false)
        } else if (result.bayArray.length === 0 ) {
            // console.log('test bay 1 is empty, move into test bay')
            let oldCanvasId = 'machine_field_bay_10'
            let newCanvasId = "machine_field_test_bay_1";
            invokeMoveMachine(oldCanvasId, newCanvasId, false)
        }
    },

})

