import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')

import {drawMachineInBay} from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

Template.message_board_team_3.helpers({

    lineOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user: "Team 3",
            status: {$in: [0, 1]}}).fetch();
        return result.sort((a, b) => a.status - b.status)
    },

    historyOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user : "Team 3", status: 2}, {}).fetch();
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

Template.message_board_team_3.events({


    'click .selectedOrder': function (e) {
        e.preventDefault()
        let order = this._id
        Session.set('orderCanceled', order)
    },


    'click .messageButton_team_3':(e) => {
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


Template.team_3_over_view.helpers({

    //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_bay8: () => {
        let canvasId = "machine_field_bay_8";
        drawMachineInBay(canvasId)
    },

    draw_bay9: () => {
        let canvasId = "machine_field_bay_9";
        drawMachineInBay(canvasId)

    },

    draw_bay10: () => {
        let canvasId = "machine_field_bay_10";
        drawMachineInBay(canvasId)
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

