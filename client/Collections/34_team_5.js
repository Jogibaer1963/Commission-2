Meteor.subscribe('activeAssembly')

import {invokeMoveFromLastBay} from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';


Session.set('twoMachines', false)

Template.message_board_team_5.helpers({

    lineOrders_team_5: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user: "Team 5",
            status: {$in: [0, 1]}}).fetch();
        return result.sort((a, b) => a.status - b.status)
    },

    historyOrders_team_5: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user : "Team 5", status: 2}, {limit: 10}).fetch();
        return  result.sort((a, b) => b.unixTimeOrderCompleted - a.unixTimeOrderCompleted)
    },


})

Template.message_board_team_5.events({
/*
    'click .t5-rep-bt':(e) => {
        e.preventDefault()
        let ipAndPort =
        let newUrl = Session.get('shippingApp') + 'pdiRepairList'
       window.open(newUrl,
            '_blank', 'toolbar=0, location=0,menubar=0, width=1500, height=1500')
    },

 */

    'click .messageButton_team_5':(e) => {
        e.preventDefault()
        let newUrl = Session.get('ipAndPort') + 'messageBoard'
         window.open(newUrl,
            '_blank', 'toolbar=0, location=0,menubar=0, width=1000, height=500')
    },

})




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
