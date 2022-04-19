Meteor.subscribe('activeAssembly')

import {invokeMoveFromLastBay} from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';


Session.set('twoMachines', false)

Template.team_5_over_view.helpers({

    //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_bay_14: () => {
        let canvasId = "machine_field_bay_14";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_15: () => {
        let canvasId = "machine_field_bay_15";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_16: () => {
        let canvasId = "machine_field_bay_16";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_17: () => {
        let canvasId = "machine_field_bay_17";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay_18: () => {
        let canvasId = "machine_field_bay_18";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_19: () => {
        let canvasId = "machine_field_bay_19";
        invokeDrawMachineInBay(canvasId)
    }

})

Template.team_5_move_buttons.events({

    'click .bay-14-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_14'
        let newCanvasId = "machine_field_bay_15";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-15-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_15'
        let newCanvasId = "machine_field_bay_16";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-16-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_16'
        let newCanvasId = "machine_field_bay_17";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-17-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_17'
        let newCanvasId = "machine_field_bay_18";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-18-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_18'
        let newCanvasId = "machine_field_bay_19";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-19-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_19' // Last Bay
        invokeMoveFromLastBay(oldCanvasId)
    }

})
