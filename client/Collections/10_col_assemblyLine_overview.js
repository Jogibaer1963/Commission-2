Meteor.subscribe('assemblyLineBay');


Template.assemblyLineOverView.helpers({




})

Template.assemblyLineOverView.events({

    'click .assemblyLine': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLine')
    }

})