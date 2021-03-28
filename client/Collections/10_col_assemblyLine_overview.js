Meteor.subscribe('assemblyLineBay');


Template.assemblyLineOverView.helpers({

    bayList: () => {
        let result = assemblyLineBay.find().fetch();
        console.log(result);
        return result
    },

    machineList: () => {
        let toDay = moment().subtract(14, 'd').format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate: {$gt: toDay}}).fetch();
        result.sort(function(a, b) {
            return a.inLineDate.localeCompare(b.inLineDate) })
        console.log(result);
        return result;
    },

})