


Template.commTablet_2.helpers ({

    machineCommList_2: () => {
        return machineCommTable.find({commissionStatus: {$lt: 26}},
            {sort: {inLineDate: 1}});
    },

});


Template.commTablet_2.events ({

    'click .multiMachines': (e) => {
        e.preventDefault();
        const loggedUser = Meteor.user();
        const machineIds = [];
        $('input[name=machine]:checked').each(function () {
            machineIds.push($(this).val());
        });
        Meteor.call('multipleMachines', machineIds, loggedUser);
    }




});
