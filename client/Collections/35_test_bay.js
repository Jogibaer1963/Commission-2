Meteor.subscribe('activeAssembly')

import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine, invokeDrawTwoMachines } from '../../lib/99_functionCollector.js';

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



    draw_front_test_bay: () => {
        let canvasId = "machine_field_front_test_bay";
        drawMachineInBay(canvasId)
    },

    draw_test_bay_1: () => {
        let canvasId = "machine_field_test_bay_1";
        drawMachineInBay(canvasId)
    },

    draw_test_bay_2: () => {
        let canvasId = "machine_field_test_bay_2";
        drawMachineInBay(canvasId)
    },

    draw_test_bay_3: () => {
        let canvasId = "machine_field_test_bay_3";
        drawMachineInBay(canvasId)
    },

    draw_test_bay_4: () => {
        let canvasId = "machine_field_test_bay_4";
        drawMachineInBay(canvasId)
    },

})

function drawMachineInBay(canvasId) {
    try {
        let result = activeAssembly.findOne({_id : canvasId});
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        if (result.bayArray.length === 0) {
            // draw empty field in Bay
            //  ctx.clearRect(0, 0, canvas.width, canvas.height) // clear any canvas in Bay
            ctx.strokeStyle = "#ee0e0e";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30);
        } else if (result.bayArray.length === 1) {
            // draw 1 machine in Bay
            let machineNrInBay = result.bayArray[0].machineNr
            let ecnCheck= result.bayArray[0].ecnMachine;
        //    console.log('machine detected ', ecnCheck, result, result.bayArray[0])
            invokeDrawOneMachine(machineNrInBay, canvasId, ecnCheck);
        } else if (result.bayArray.length === 2) {
            let firstMachine = result.bayArray[0].machineNr
            let secondMachine = result.bayArray[1].machineNr
            let ecnCheckOne = result.bayArray[0].ecnMachine;
            let ecnCheckTwo = result.bayArray[1].ecnMachine;
            invokeDrawTwoMachines(firstMachine, secondMachine, ecnCheckOne, ecnCheckTwo, canvasId)
        }
    } catch (e) {}

}

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

Template.bay_9_10_to_14_15.helpers({

    draw_bay9: () => {
        let canvasId = "machine_field_bay_9";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay10: () => {
        let canvasId = "machine_field_bay_10";
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