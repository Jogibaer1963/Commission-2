




Template.messageBoard.helpers({

    'selectedComponent': function () {
        let component = this._id;
        console.log(component)
        let selected = Session.get('selectedComponent');
        if (component === selected) {
            Session.set('componentChosen', 1);
            return 'selected'
        }
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

})

Template.messageBoard.events({

    'click .comp': function () {
        let textMainComp = this._id;
        Session.set('selectedComponent', textMainComp);
        Session.set('issueComp', textMainComp);
    },

    'submit .order-parts':function(e) {
        e.preventDefault();
        let user_order, partNumber_order, quantityNeeded_order, storageLocation_order, point_of_use_order,
            reason_order, urgency_order;
        user_order = Meteor.user().username;
        partNumber_order = e.target.partNumber.value;
        quantityNeeded_order = e.target.quantityNeeded.value;
        storageLocation_order = e.target.storageLocation.value;
        point_of_use_order = e.target.location.value;
        reason_order = e.target.reason.value;
        urgency_order = 11;
      //  console.log(user_order, partNumber_order, storageLocation_order, point_of_use_order,
      //      reason_order, urgency_order)
        Meteor.call('parts_on_order', user_order, partNumber_order, quantityNeeded_order, storageLocation_order, point_of_use_order,
           reason_order, urgency_order, function (err, respond) {
            if (err) {
                   Meteor.call('success', err, user_order, 'order failed')
            } else {
                   Meteor.call('success', respond, user_order, 'order succeed')
                Session.set('selectedComponent', '')
                Session.set('issueComp', '')
                   window.close();
            }
        })

    }

})

