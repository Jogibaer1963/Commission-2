import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')


import {drawMachineInBay} from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
// import { invokeDrawTwoMachines } from '../../lib/99_functionCollector.js';

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
        let result = lineOrders.find({team_user : "Team 2", status: 2}, {}).fetch();
        return  result.sort((a, b) => b.unixTimeOrderCompleted - a.unixTimeOrderCompleted)
    },

    markedSelectedOrder: function(e) {
        const order = this._id;
        const selectedOrder = Session.get('orderCanceled');
        if (order === selectedOrder) {
            return "markedSelectedOrder";
        }
    }

})

Template.message_board_team_2.events({

    'click .selectedOrder': function (e) {
        e.preventDefault()
        let order = this._id
        Session.set('orderCanceled', order)
    },

    'click .messageButton_team_2':(e) => {
        e.preventDefault()
        let newUrl = Session.get('ipAndPort') + 'messageBoard'
        window.open(newUrl,
            '_blank', 'toolbar=0, location=0,menubar=0, width=1000, height=500')
    },

    'click .cancelButton':(e) => {
        e.preventDefault()
        let orderCancel = Session.get('orderCanceled', )
        Meteor.call('cancelOrder', orderCancel)
    },

})



Template.team_2_over_view.helpers({

    //  ***************    Move Machine from List to the FCB merging Station  *************


    draw_bay5: () => {
        let canvasId = "machine_field_bay_5";
        drawMachineInBay(canvasId)
    },

    draw_bay6: () => {
        let canvasId = "machine_field_bay_6";
        drawMachineInBay(canvasId)

    },

    draw_bay7: () => {
        let canvasId = "machine_field_bay_7";
        drawMachineInBay(canvasId)
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
