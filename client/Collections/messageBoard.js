import {Session} from "meteor/session";



Template.messageBoard.helpers({



    'selectedComponent': function () {
        let component = this._id;
        let selected = Session.get('selectedComponent');
        if (component === selected) {
            Session.set('componentChosen', 1);
            return 'selected'
        }
    },

    team: function () {
        try {
            Session.set('team-order', Meteor.user().username)
        } catch (e) {

        }
        return Session.get('team-order')
    },

    mainComponent: function () {
        return supplyAreas.find({active: true}).fetch();
    },

    issueComponent: () => {
        try {
            return Session.get('issueComp');
        } catch (e) {

        }
    },

    different_team: () => {
        let result = Session.get('different-team')
        if (result) {
            return  result
        }

    }

})

Meteor.subscribe('machineNumberConfirmation')

Template.messageBoard.events({


    'click .comp': function () {
        let textMainComp = this._id;
        // console.log('clicked', textMainComp)
        Session.set('selectedComponent', textMainComp);
        Session.set('issueComp', textMainComp);
    },

    'submit .order-parts':function(e) {
        e.preventDefault();
        const loggedUser = Meteor.user().username;
        let user_order, partNumber_order, quantityNeeded_order, storageLocation_order, point_of_use_order,
            reason_order, urgency_order, machineNr, machine;
        if (Session.get('different-team')) {
            user_order = Session.get('different-team')
        } else {
            user_order = Session.get('team-order')
        }
        // user_order = Meteor.user().username;
        machineNr = e.target.machineNr.value;
        partNumber_order = e.target.partNumber.value;
        quantityNeeded_order = e.target.quantityNeeded.value;
        storageLocation_order = e.target.storageLocation.value;
        point_of_use_order = e.target.location.value;
        reason_order = e.target.reason.value;
        urgency_order = 11;

        Meteor.call('machineConfirmation', machineNr, function (err, respond) {
                // respond is true if machine is still in the assembly Line, false if machine o=is offline or doesn't exist
             if (respond === true) {  // Machine Nr is Valid and inside Assembly Line, reason is 1, 2 or 3 but not 4
               // console.log("server respond " + respond)
                 if (point_of_use_order) {
                     Meteor.call('parts_on_order',loggedUser,  user_order, machine, partNumber_order,
                         quantityNeeded_order, storageLocation_order, point_of_use_order, reason_order, urgency_order,
                         function (err, respond) {
                             if (err) {
                                 Meteor.call('success', err, user_order, 'order failed')
                             } else if (respond) {
                                 window.close();
                             }
                         })
                 } else {
                     window.alert('Point of use / Delivery Location must be defined ')
                 }

            } else if (respond === false) { // Machine Number is invalid but its repair
                 console.log('inside ' + reason_order)
                 if (reason_order === '4') {
                     console.log("server respond " + respond + ' reason ' + reason_order)
                     Meteor.call('parts_on_order', loggedUser, user_order, machine, partNumber_order,
                         quantityNeeded_order, storageLocation_order, point_of_use_order, reason_order, urgency_order,
                         function (err, respond) {
                             if (err) {
                                 Meteor.call('success', err, user_order, 'order failed')
                             } else if (respond) {
                                 window.close();
                             }
                         })
                 } else {
                     console.log("third server respond " + respond + ' reason ' + reason_order)
                     window.alert('Machine Number is Invalid, too long, too short or not in Line ')
                 }
            }
        })
    },

    'click .team-1-button': (e) => {
        e.preventDefault()
        Session.set('different-team', 'Team 1')
        let result = Session.get('team-order')
    },

    'click .team-2-button': (e) => {
        e.preventDefault()
        Session.set('different-team', 'Team 2')
        let result = Session.get('team-order')
    },

    'click .team-3-button': (e) => {
        e.preventDefault()
        Session.set('different-team', 'Team 3')
        let result = Session.get('team-order')
    },

    'click .team-4-button': (e) => {
        e.preventDefault()
        Session.set('different-team', 'Team 4')
        let result = Session.get('team-order')
    },

    'click .team-5-button': (e) => {
        e.preventDefault()
        Session.set('different-team', 'Team 5')
        let result = Session.get('team-order')
    },

    'click .team-repair': (e) => {
        e.preventDefault()
        Session.set('different-team', 'Repair / Recon')
        let result = Session.get('team-order')
    },

})

Template.message_board_team_4.helpers({

    lineOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user: "Team 4",
            status: {$in: [0, 1]}}).fetch();
        return result.sort((a, b) => a.status - b.status)
    },

    historyOrders: () => {
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        let result = lineOrders.find({team_user : "Team 4", status: 2}, {}).fetch();
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

Template.message_board_team_4.events({

    'click .selectedOrder': function (e) {
        e.preventDefault()
        let order = this._id
        Session.set('orderCanceled', order)
    },


    'click .messageButton_team_4':(e) => {
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

