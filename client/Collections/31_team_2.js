Meteor.subscribe('activeAssembly')


import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';


Session.set('twoMachines', false)

Template.team_2_over_view.helpers({

    //  ***************    Move Machine from List to the FCB merging Station  *************


    draw_bay5: () => {
        let canvasId = "machine_field_bay_5";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay6: () => {
        let canvasId = "machine_field_bay_6";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay7: () => {
        let canvasId = "machine_field_bay_7";
        invokeDrawMachineInBay(canvasId)
    },


})

Template.team_2_move_buttons.events({

    'click .bay-5-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_5'
        let newCanvasId = "machine_field_bay_6";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-6-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_6'
        let newCanvasId = "machine_field_bay_7";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-7-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_7'
        let newCanvasId = "machine_field_bay_8";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

})
