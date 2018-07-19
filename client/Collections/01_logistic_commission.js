Meteor.subscribe('supplyAreaList');
Meteor.subscribe('machineCommTable');

Template.commissionOverView.helpers ({

    machineCommList: function () {
        let toggleComm = Session.get('toggleComm');
        if(toggleComm === 1) {
            return machineCommTable.find({commissionStatus: {$gt: 25}}, {sort: {dateOfCreation: 1, }});
        } else {
            return machineCommTable.find({commissionStatus: {$lt: 26}}, {sort: {dateOfCreation: 1, }});
        }
    },

    machineNr: () => {
        let id = Session.get('selectedMachine');
        if(id) {
            return machineCommTable.findOne({_id: id}).machineId;
          }
    },



    L4MSB020: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb020';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {machineId, pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4MSB030: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb030';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {machineId, pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4MSB040: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb040';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4MSB045: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb045';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4MSB050: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb050';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4MSB060: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb060';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4MSB070: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb070';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4MSB090: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4msb090';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PAXL10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4paxl10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PCAB10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pcab10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PCAB20: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pcab20';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PCHP10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pchp10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PCLN20: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pcln20';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PCOL05: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pcol05';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PCOL10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pcol10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PCOL20: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pcol20';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PENG10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4peng10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PENG20: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4peng20';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PENG30: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4peng30';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PENG40: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4peng40';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PFDR10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pfdr10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PGRT10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pgrt10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PHYD10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4phyd10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PRTR10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4prtr10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PRTR20: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4prtr20';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },

    L4PTHR10: () => {
        let machineId = Session.get('selectedMachine');
        let pickingArea = 'L4pthr10';
        if(machineId) {
            pickingResult(machineId, pickingArea);
            let pickerStart = Session.get('pickerStart' + pickingArea);
            let pickingDuration = Session.get('pickingDuration' + pickingArea);
            let pickingDateAndTime = Session.get('pickingDateAndTime' + pickingArea);
            return {pickingDateAndTime, pickingDuration, pickerStart};
        }
    },


    'selectedMachine': function(){
        const commMachine = this._id;
        const selectedMachine = Session.get('selectedMachine');
        if (selectedMachine === commMachine) {
            return "selected"
        }
    }


});


function pickingResult(machineId, pickingArea) {
    Meteor.call('pickingResult' + pickingArea, machineId, pickingArea, function (err, response) {
        if (err) {
            console.log(err);
        }
        Session.set('pickerStart' + pickingArea, response.pickerStart);
        Session.set('pickingDuration' + pickingArea, response.pickingDuration);
        Session.set('pickingDateAndTime' + pickingArea, response.pickingDateAndTime);
    });

}


Session.set('toggleComm', 1);

Template.commissionOverView.events ({

    'click .supplyAreaList': function(e) {
        e.preventDefault();
        const pickedSupplyArea = this._id;
        Session.set('selectedArea', pickedSupplyArea);
    },

    'click .commissionMachine': function(e) {
        e.preventDefault();
        const pickedMachineId = this._id;
        Session.set('selectedMachine', pickedMachineId);
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

    'click .toggleButton': (e) => {
        e.preventDefault();
        let k = Session.get('toggleComm');
        if(k === 1) {
            Session.set('toggleComm', 0);
        } else {
            Session.set('toggleComm', 1);
        }
     }

});


//-------------------------------------------- Admin Section ---------------------------------------

Template.adminButton.helpers ({

    alarmMachine: () => {
        return Session.get('alarm');
    },

});


Template.adminButton.events ({

    'submit .newCommMachine': (e) => {
        e.preventDefault();
        Session.set('alarm', '');
        const newMachine = e.target.newMachine.value;
        const inLineDate = e.target.newDate.value;
        let dateOfCreation = Date.now();
        if(newMachine) {
            Meteor.call('doubleMachine', newMachine,  inLineDate, dateOfCreation, function (err, response) {
                if (response) {
                    Session.set('alarm', 'Attention, Machine already exists');
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

