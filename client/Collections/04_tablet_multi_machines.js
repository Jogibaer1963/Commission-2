


Template.commTablet_2.helpers ({

    machineCommList_2: () => {
        return machineCommTable.find({commissionStatus: {$lt: 26}},
            {sort: {inLineDate: 1}});
    },

});



