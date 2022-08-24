




Template.messageBoard.helpers({


})

Template.messageBoard.events({

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
        urgency_order = e.target.urgency.value;
      //  console.log(user_order, partNumber_order, storageLocation_order, point_of_use_order,
      //      reason_order, urgency_order)
        Meteor.call('parts_on_order', user_order, partNumber_order, quantityNeeded_order, storageLocation_order, point_of_use_order,
           reason_order, urgency_order, function (err, respond) {
            if (err) {
                   Meteor.call('success', err, user_order, 'order failed')
            } else {
                   Meteor.call('success', respond, user_order, 'order succeed')
                   window.close();
            }
        })

    }

})

