Meteor.subscribe('assemblyLineBay');


Template.assemblyLineOverView.helpers({

    bayList: () => {
        return assemblyLineBay.find();
    },

    machineList: () => {
        let toDay = moment().subtract(14, 'd').format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate: {$gt: toDay}}).fetch();
        return result;
    },

})