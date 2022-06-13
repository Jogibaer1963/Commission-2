Meteor.subscribe('supplyAreas');
Meteor.subscribe('machineCommTable');
Meteor.subscribe('userActions');
Meteor.subscribe('lineOrders');


Template.addMachine.helpers ({

    alarmMachine: () => {
        return Session.get('alarm');
    },

    updatedMachines: () => {
        try {
        return userActions.findOne({_id: 'updateMachines'}).machineCount;
        } catch (e) {
          }
    },

    newMachines: () => {
        try {
            return userActions.findOne({_id: 'newMachines'}).machineCount;
        } catch (e) {
        }
    }


});

Session.set('activateSkip', false)

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
        let result = machineCommTable.find({active: true},
                            {fields: {
                                                counter: 1,
                                                machineId: 1,
                                                inLineDate: 1,
                                                supplyAreas: 1,
                                                commissionStatus: 1,
                                                commissionList: 1,
                                                timeLine: 1
                                                }}).fetch();

        result.forEach((element) => {
           for (let i = 0; i <= element.supplyAreas.length - 1; ++i ) {
               if (element.supplyAreas[i].active === false) {
                   try {
                   element.supplyAreas.splice(element.supplyAreas.indexOf(element.supplyAreas[i]), 1);
                   i-- ;
                   } catch {
                   }
               } else {
               }
           }
         //  console.log(element)
           machineResult.push(element);
        });
        machineResult.forEach((element) => {
            element.supplyAreas.sort(function(a, b) {return a.supplyPosition - b.supplyPosition})
        })
        return _.sortBy(machineResult, 'counter');
    },

    inactiveMachineList: () => {
        // toDo make inLineDate as Variable
        return machineCommTable.find({active: false},
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

    skipMode: () => {
        let skipMode = Session.get('skipModeActive')
        if (skipMode === 1) {
            // skip Mode active
            return {part1: '!! Attention !!', part2: 'Skip Mod is Active'}
        }
    }

});

Session.set('skipModeActive',0)

Template.machine_picking_list.events({

    'click .buttonSkip': (e) => {
        e.preventDefault();
        if (Session.get('skipModeActive') === 0) {
            Session.set('skipModeActive', 1)
          //  console.log('skip Mode active')
        } else if (Session.get('skipModeActive') === 1) {
            Session.set('skipModeActive', 0)
           // console.log('skip mode inactive')
        }
    },

    'click .commissionMachine': function (e) {
        e.preventDefault();
        let skipMode = Session.get('skipModeActive')
        let supplyArea = Session.get('supplyArea')
        if (supplyArea === undefined || supplyArea === '') {
            supplyArea = 0;
        }
        let selectedMachine = this.machineId;
        // console.log(selectedMachine, supplyArea, 'SkipMode :', skipMode)
        Session.set('selectedMachine', selectedMachine);
        if (skipMode === 1) {
            // skip Mode Active
            Meteor.call('skipSupplyAreas', selectedMachine, supplyArea, skipMode)
        } else if (skipMode === 0) {
            Meteor.call('reDo_picking', selectedMachine, supplyArea)
        }
        Session.set('supplyArea', '')
    },

    'click .supplyId': function (e) {
        e.preventDefault();
        const supplyArea = this._id;
        // console.log(supplyArea)
        Session.set('supplyArea', supplyArea)
    },

    'click .inactiveMachine': function (e) {
            e.preventDefault();
            let selectedMachine = this.machineId;
            Session.set('finishedMachine', selectedMachine);
    },

    'click .list-print-button': function (e) {
        e.preventDefault();
        let selectedMachine =  Session.get('selectedMachine');
        Meteor.call('commission_list_printed', selectedMachine)
    },

    'click .buttonComplete': (e) => {
        e.preventDefault();
        let machineCompleted = Session.get('selectedMachine');
     //   console.log(machineCompleted);
        Meteor.call('deactivateMachine', machineCompleted);
    },


});

Template.tabletEntry.helpers({

    lineNeedsParts: () => {
        let count = 0;
        let result = lineOrders.find().fetch();
        result.forEach((element) => {
            console.log(element.team_user, element.status, element.urgency)
            if (parseInt(element.status) === 0 ) {
                count++
                console.log(count)
            }
        })
        return {count : count};
    }

})


Template.tabletEntry.events({

        'click .buttonToTablet': (e) => {
            e.preventDefault();
            sessionStorage.clear();
            Session.set('inActiveState', 0);
            Session.set('commMachine', '');
            Session.set('selectedArea', '');
            FlowRouter.go('commission');
            Session.set('supplyChosen', 0);
        },

    'click .buttonToCornHead': (e) => {
            e.preventDefault();
            FlowRouter.go('cornHead');
    }

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
    },

    'change .loadProductionSchedule': (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            Meteor.call('updateMachineInLine', contents);
        };
        reader.readAsText(file);
        document.getElementById('files').value = [];
    },

});

Template.reviewMachine.helpers({

    supplyList: () => {
      return Session.get('returnResult');
    },

    machineReview: () => {
            let review = Session.get('finishedMachine')
            let machineResult = [];
            let result = machineCommTable.findOne({machineId: review});
            machineResult.push(result)
            return machineResult;
    }


});








