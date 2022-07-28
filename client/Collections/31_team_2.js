Meteor.subscribe('activeAssembly')


import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';


Session.set('twoMachines', false)

Template.message_board_team_2.helpers({

    lineOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user: "Team 2",
            status: {$in: [0, 1]}}).fetch();
        return result.sort((a, b) => a.status - b.status)
    },

    historyOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        return lineOrders.find({team_user : "Team 2", status: 2}).fetch();
    },

})

Template.message_board_team_2.events({

    'click .t2-rep-bt':(e) => {
        e.preventDefault()
       // window.open('http://localhost:3000/pdiRepairList',
             window.open('http://10.40.1.47:3000/pdiRepairList',
            '_blank', 'toolbar=0, location=0,menubar=0, width=1500, height=1500')
    },

    'click .messageButton_team_2':(e) => {
        e.preventDefault()
        // window.open('http://localhost:3100/messageBoard',
         window.open('http://10.40.1.47:3100/messageBoard',
            '_blank', 'toolbar=0, location=0,menubar=0, width=1000, height=500')
    },

})



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
