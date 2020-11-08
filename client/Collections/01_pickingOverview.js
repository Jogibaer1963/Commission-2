Meteor.subscribe('supplyAreas');
Meteor.subscribe('machineCommTable');


Template.machine_picking_list.helpers({

    supplyList: () => {
      let result = supplyAreas.find({active: true}).fetch();
       let returnResult = result.sort((a, b) => {
           return a.supplyPosition - b.supplyPosition;
       });
       Session.set('returnResult', returnResult);
       return returnResult;
    },

    machineList: () => {
        let machineResult = [];
        let pickingTime = "";
        let result = machineCommTable.find({commissionStatus: {$lt: 26}, active: true}).fetch();
        result.forEach((element) => {
           for (let i = 0; i <= element.supplyAreas.length - 1; ++i ) {
               if (element.supplyAreas[i].active === false) {
                   try {
                   element.supplyAreas.splice(element.supplyAreas.indexOf(element.supplyAreas[i]), 1);
                   i-- ;
                   } catch {
                   }
               } else {
                       let pullDate = element.supplyAreas;
                       pullDate.forEach((element2) => {
                           try {
                               let date = new Date(element2.pickerEnd);
                               let month = date.getMonth();
                               let day = date.getDay();
                               pickingTime = month + "-" + day;
                           } catch (e) {
                           }
                       })
               }
           }

           machineResult.push(element);
         });
        return machineResult;
    },

    inactiveMachineList: () => {
        // toDo make inLineDate as Variable
        return machineCommTable.find({active: false, inLineDate: {$gt: "2020-09-01"}},
            {sort: {inLineDate: -1}}).fetch();
    },

    'selectedMachine': function(){
        const commMachine = this.machineId;
        const selectedMachine = Session.get('selectedMachine');
        if (selectedMachine === commMachine) {
            Session.set('commMachine', selectedMachine);
            return "selectedMachine";
        }
    },

});

Template.machine_picking_list.events({

    'click .commissionMachine': function (e) {
            e.preventDefault();
            let selectedMachine = this.machineId;
            Session.set('selectedMachine', selectedMachine);
    },

    'click .buttonComplete': (e) => {
        e.preventDefault();
        let machineCompleted = Session.get('selectedMachine');
     //   console.log(machineCompleted);
        Meteor.call('deactivateMachine', machineCompleted);
    },


});


Template.tabletEntry.events({

        'click .buttonToTablet': (e) => {
            e.preventDefault();
            sessionStorage.clear();
            Session.set('inActiveState', 0);
            Session.set('commMachine', '');
            Session.set('selectedArea', '');
            FlowRouter.go('commission');
            Session.set('supplyChosen', 0);
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
        // console.log(newMachine, dateOfCreation);
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
    }
});

