Meteor.subscribe('activeAssembly')

import { invokeMachineTest } from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)


Template.test_bay_move_buttons.events({

    'click .front-test-bay-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_front_test_bay'
        let newCanvasId = "machine_field_test_bay_1";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_2";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-1-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-1-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_bay_14";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-2-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-2-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_test_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_3'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_4'
        let newCanvasId = "machine_field_bay_14";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

})




Template.test_bay_over_view.helpers({

    //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_bay9: () => {
        let canvasId = "machine_field_bay_9";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay10: () => {
        let canvasId = "machine_field_bay_10";
        invokeDrawMachineInBay(canvasId)
    },

    draw_front_test_bay: () => {
        let canvasId = "machine_field_front_test_bay";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_1: () => {
        let canvasId = "machine_field_test_bay_1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_2: () => {
        let canvasId = "machine_field_test_bay_2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_3: () => {
        let canvasId = "machine_field_test_bay_3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_4: () => {
        let canvasId = "machine_field_test_bay_4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_14: () => {
        let canvasId = "machine_field_bay_14";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_15: () => {
        let canvasId = "machine_field_bay_15";
        invokeDrawMachineInBay(canvasId)
    },

})

Template.test_bay_over_view.events({

    'click .front-test-bay-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_front_test_bay'
        let newCanvasId = "machine_field_test_bay_1";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_2";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-1-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-1-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_bay_14";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-2-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-2-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_test_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_3'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_4'
        let newCanvasId = "machine_field_bay_14";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

})

