Meteor.subscribe('lineOrders');



Template.partsOnOrder.helpers({

    orderProcessor: function () {
        try {
            return Meteor.user().username;
        } catch (e) {
        }
    },

    lineOrders: () => {
        let count = 0;
        // status : 0 = unseen, 1 = picking in progress, 2 = delivered
        return lineOrders.find({status: 0}).fetch();
    },

})

Template.partsOnOrder.events({

    'click .selectedOrder': function(e) {
        // start picking process
        e.preventDefault()
        let pickOrder = this._id;
        const picker = Meteor.user().username;
       // console.log(pickOrder)
        Meteor.call('pickOrder', pickOrder, picker);
        FlowRouter.go('orderPick')
    },

    'click .pickOrder':(e) => {
       e.preventDefault() ;
        FlowRouter.go('orderPick')
    }

})

Template.orderPick.helpers({

    pickedOrder: () => {
        const picker = Meteor.user().username;
        return lineOrders.find({picked_by: picker, status: 1}).fetch();
    },

    'picked_order': function() {
        let openOrder = this._id;
        let selectedOrder = Session.get('picked-order');
        if (openOrder === selectedOrder) {
            return 'selectedMachine';
        }
    }

})

Template.orderPick.events({

    'click .picked-Order': function (e) {
        // select order to pick from List
        e.preventDefault();
        let selectedOrder = this._id;
        Session.set('picked-order', selectedOrder)
    },

    'click .orderDelivered': function(e) {
        // Team lead complete order.
        e.preventDefault();
        let pickOrder = Session.get('picked-order');
        Meteor.call('orderDelivered', pickOrder)
         window.close()
    }


})