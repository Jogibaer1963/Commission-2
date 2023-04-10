Meteor.subscribe('supplyAreas');
//Meteor.subscribe('machineCommTable');
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
        let result;
       Tracker.autorun(() => {
           Meteor.subscribe('pickingOverView')
               result = machineCommTable.find({active: true}).fetch();
          //  console.log(result)
               result.forEach((element) => {
                   try {
                       for (let i = 0; i <= element.supplyAreas.length - 1; ++i ) {
                           if (element.supplyAreas[i].active === false) {
                               try {
                                   element.supplyAreas.splice(element.supplyAreas.indexOf(element.supplyAreas[i]), 1);
                                   i-- ;
                               } catch (e) {
                               }
                           } else {
                           }
                       }
                   } catch (e) {
                   }
                   machineResult.push(element);
               });
               try {
                   machineResult.forEach((element) => {
                       element.supplyAreas.sort(function(a, b) {return a.supplyPosition - b.supplyPosition})
                   })
               } catch (e) {
               }
               Session.set('pickingTable', _.sortBy(machineResult, 'counter'));
           })
    },

    pickingTable: () => {
      return Session.get('pickingTable')
    },

    inactiveMachineList: () => {
        Meteor.subscribe('inActivePickingList')
        // load just the 50 last machines
        return machineCommTable.find({active: false},{sort: {counter: -1}}).fetch();
    },

    'selectedMachine': function() {
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

    'click .selectedInactive': function (e) {
      e.preventDefault()
        let inactiveMachine = this.machineId
        let inactiveId = this._id
        Meteor.call('restoreMachine', inactiveMachine, inactiveId)
    },

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

Session.set('openOderSession', '')

Template.tabletEntry.helpers({



})

Template.open_order.helpers({

    orderMade: function() {
        return lineOrders.find().count()
    },

    lineNeedsParts: () => {
        let count = 0;
        let result = lineOrders.find().fetch();
        try {
            result.forEach((element) => {
                if (parseInt(element.status) === 0) {
                    count++
                }
            })
            //   console.log('order count ', count)
            Session.set('openOrderSession', result)
            return {count: count};
        } catch (e) {

        }

    },

    idOpenOrders: () => {
        // urgency level : 10 = high urgency, 11 = medium urgency, 12 low urgency
        try {
            let urgencyLevel = [];
            let openOrders = Session.get('openOrderSession');
            openOrders.forEach((element) => {
                if (element.status === 0) {
                    urgencyLevel.push(element.urgency)
                }
            })
            let highestUrgency = Math.min(...urgencyLevel)
            return {urgency: highestUrgency}
        } catch (e) {
        }
    }

})

Template.open_order.events({

    'click .picking-button': (e) => {
        e.preventDefault()
        FlowRouter.go('partsOnOrder')
        /*
      //  window.open('http://localhost:3100/partsOnOrder',
       window.open('http://10.40.1.47:3100/partsOnOrder',
            '_blank', 'toolbar=0, location=0,menubar=0, width=1000, height=500')

         */
    },

    'click .unclosed-button': (e) => {
        e.preventDefault();
        FlowRouter.go('order_analysis')
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
        console.log(removableMachine)
        if (confirm("Are you sure with deleting Machine " + removableMachine + " ?")) {
            // it is confirmed to delete this Machine
            Meteor.call('removeCommMachine', removableMachine);
        } else {
            // close window and do nothing
        }
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
           // console.log(machineResult)
            return machineResult;
    }


});








