Meteor.subscribe('assemblyLineBay');


Template.assemblyLineOverView.helpers({

    bayList: () => {
       return assemblyLineBay.find().fetch();
    },

    machineList: () => {
        let toDay = moment().subtract(14, 'd').format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate: {$gt: toDay}}).fetch();
        result.sort(function(a, b) {
            return a.inLineDate.localeCompare(b.inLineDate) })
        return result;
    },

})

Template.assemblyLineOverView.events({

    'click .assemblyLine': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLine')
    }

})