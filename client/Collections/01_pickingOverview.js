Meteor.subscribe('supplyAreas');
Meteor.subscribe('machineCommTable');


Template.machine_picking_list.helpers({

    supplyList: () => {
      let result = supplyAreas.find().fetch();
       let returnResult = result.sort((a, b) => {
           return a.supplyPosition - b.supplyPosition;
       });
       console.log(result);
       Session.set('returnResult', returnResult);
       return returnResult;
    },

    machineList: () => {
        let result = machineCommTable.find({commissionStatus: 0}).fetch();
        for (let i = 0; i <= result.length - 1; i++) {
            for (let j = 0; j <= result[i].supplyAreas.length - 1; j++) {
                let supplyActive = result[i].supplyAreas[j];
                if (supplyActive.active === false) {
                    result.supplyAreas.splice(result[i].supplyAreas[j], 1);
                }
            }
            let supplyResult = result[i].supplyAreas;
            let listResult = supplyResult.filter(val => val);
            console.log('listResult: ', listResult);
        }
        console.log(result);
        return result;
    }


});



Template.addMachine.helpers ({

    alarmMachine: () => {
        return Session.get('alarm');
    },

});

Template.addMachine.events ({

    'submit .newCommMachine': (e) => {
        e.preventDefault();
        Session.set('alarm', '');
        const newMachine = e.target.newMachine.value;
        const inLineDate = e.target.newDate.value;
        let dateOfCreation = Date.now();
        if(newMachine) {
            Meteor.call('doubleMachine', newMachine,  inLineDate, dateOfCreation, function (err, response) {
                if (response) {
                    Session.set('alarm', 'Attention, Machine ' + newMachine + ' already exists');
                } else {
                }
            });
        }
        e.target.newMachine.value = '';
        e.target.newDate.value = '';
    },

    'click .removeMachine': function (e) {
        e.preventDefault();
        const removableMachine = Session.get('selectedMachine');
        Meteor.call('removeCommMachine', removableMachine);
    },

    'click .comm-statistics': (e) => {
        e.preventDefault();
        FlowRouter.go('commissionStatistics');
    },

    'click .buttonToTablet': (e) => {
        e.preventDefault();
        sessionStorage.clear();
        Session.set('inActiveState', 0);
        Session.set('commMachine', '');
        Session.set('selectedArea', '');
        FlowRouter.go('commission');
        Session.set('supplyChosen', 0);
    },
});

