Meteor.subscribe('assemblyLineBay');


Template.assemblyLineOverView.helpers({

    bayList: () => {
        return assemblyLineBay.find();
    },

    machineList: () => {
        let toDay = moment().format('YYYY-MM-DD');
        let result = machineCommTable.find({'timeLine.$.bay19Planned': toDay}, {}).fetch();
         console.log(result)

       // return machineResult;
    },

})