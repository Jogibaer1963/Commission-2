

Template.moveMachines.helpers({

    machineReservoir: () => {
        let today = moment().format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate : {$gt: today}},
                                                       {fields: {machineId: 1,
                                                                         timeLine: 1,
                                                                         inLineDate: 1
                                                                         }}).fetch();

        result.sort((a, b) => (a.inLineDate > b.inLineDate) ? 1 :
            ((b.inLineDate > a.inLineDate) ? -1 : 0));
        return result;
    },


});

Template.moveMachines.events({

    'click .btn-back': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLineOverView')
    }

});