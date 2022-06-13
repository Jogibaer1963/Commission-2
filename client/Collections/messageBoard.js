




Template.messageBoard.helpers({



})

Template.messageBoard.events({

    'submit .order-parts':function(e) {
        e.preventDefault();
        let user_order, partNumber_order, storageLocation_order, point_of_use_order,
            reason_order, urgency_order;
        user_order = Meteor.user().username;
        partNumber_order = e.target.partNumber.value;
        storageLocation_order = e.target.storageLocation.value;
        point_of_use_order = e.target.location.value;
        reason_order = e.target.reason.value;
        urgency_order = e.target.urgency.value;
    //    console.log(user_order, partNumber_order, storageLocation_order, point_of_use_order,
     //       reason_order, urgency_order)
        Meteor.call('parts_on_order', user_order, partNumber_order, storageLocation_order, point_of_use_order,
           reason_order, urgency_order)
        window.close();
    }

})