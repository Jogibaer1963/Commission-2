
Template.commTablet_2.helpers ({

    machineCommList_2: () => {
        return machineCommTable.find({commissionStatus: {$lt: 26}},
            {sort: {inLineDate: 1}});
    },

    supplySet: () => {
        const picker = Meteor.user().username;
        let result = pickersAtWork.findOne({_id: picker});
        if (typeof result === 'undefined') {
        } else {
            Session.set('inActiveState',result.inActive);
            return result.supplySet;
        }
    },

    'selectedArea': function() {
        const selectedSupplyArea = this._id;
        const selectedArea = Session.get('selectedArea');
        if (selectedArea === selectedSupplyArea) {
            return "selectedArea";
        }
    },

    selectedMultiMachines: () => {
        let machinesId = Session.get('multiMachinesId');
        if (machinesId === '' ) {
            const picker = Meteor.user().username;
            let result = pickersAtWork.findOne({_id: picker, multi: true});
            if (typeof result === 'undefined') {
                // nothing to share
            } else {
                let machines = result.machines;
                Session.set('supplyChosen', 9);
                Session.set('multiMachinesId', machines);
                return machines;
            }
        } else {
            return machinesId;
        }
    },

    supplyStart: () => {
        let supplyId =  Session.get('selectedArea');
        if (supplyId === '') {
            const picker = Meteor.user().username;
            let result = pickersAtWork.findOne({_id: picker, multi: true});
            if (typeof result === 'undefined') {
                // nothing to share
            } else {
                let supply = result.supplySet[0]._id;
                Session.set('supplyChosen', 9);
                Session.set('selectedArea', supply);
                return supply;
                }
        } else {
            Session.set('supplyChosen', 9);
            return supplyId;
        }
    },


});


Session.set('multiMachinesId', '');
Session.set('selectedArea', '');

Template.commTablet_2.events ({

    'click .supplyAreas': function(e) {
        e.preventDefault();
        const pickedSupplyArea = this._id;
        Session.set('selectedArea', pickedSupplyArea);
    },

    'click .multiMachines': (e) => {
        e.preventDefault();
        const loggedUser = Meteor.user();
        const machineIds = [];
        $('input[name=machine]:checked').each(function () {
            machineIds.push($(this).val());
        });
        Session.set('multiMachinesId', machineIds);
        Meteor.call('multipleMachines', machineIds, loggedUser);
    },

    'click .multi-start': (e) => {
        e.preventDefault();
        const userStart = Meteor.user().username;
        let status = 2;
        let pickedMachines = Session.get('multiMachinesId');
        let pickedSupplyAreaId = Session.get('selectedArea');
        let pickingStart = Date.now();
        Session.set('inActiveState', 1);
        let dateStartNow = moment().format('MMMM Do YYYY, h:mm:ss a' );
        Meteor.call('startPickingMultiMachines', pickedMachines,
            pickedSupplyAreaId, status, userStart,
            pickingStart, dateStartNow);
    },

    'click .multi-finished': (e) => {
        e.preventDefault();
        const userFinished = Meteor.user().username;
        let status = 1;
        let pickedMachines = Session.get('multiMachinesId');
        let pickedSupplyAreaId = Session.get('selectedArea');
        let pickingEnd = Date.now();
        let dateEndNow = moment().format('MMMM Do YYYY, h:mm:ss a' );
        Session.set('inActiveState', 4);
        Session.set('selectedArea', '');
        Session.set('supplyChosen', 0);
        Session.set('multiMachinesId', '');
        Session.set('selectedArea', '');

        Meteor.call('multi-finished', pickedMachines, pickedSupplyAreaId,
            status, userFinished, dateEndNow, pickingEnd);
    },



    'click .multi-pause': (e) => {
        e.preventDefault();
        const user = Meteor.user().username;
        let pickedMachines = Session.get('multiMachinesId');
        let pickedSupplyAreaId = Session.get('selectedArea');
        let pickingPauseStart = Date.now();
        let pickingStatus = 3;
        Session.set('inActiveState', 2);

        Meteor.call('multi-pause', pickedMachines, pickedSupplyAreaId,
            pickingStatus, pickingPauseStart, user);
    },

    'click .multi-resume': (e) => {
        e.preventDefault();
        const user = Meteor.user().username;
        let pickedMachines = Session.get('multiMachinesId');
        let pickedSupplyAreaId = Session.get('selectedArea');
        let pickingPauseEnd = Date.now();
        let pickingStatus = 2;
        Session.set('inActiveState',3);

        Meteor.call('multi-resume', pickedMachines, pickedSupplyAreaId,
            pickingStatus, pickingPauseEnd, user);
    },

    'submit .cancelForm': function(e) {
        e.preventDefault();
        const userCanceled = Meteor.user().username;
        let pickedMachineId = Session.get('multiMachinesId');
        let pickedSupplyAreaId = Session.get('selectedArea');
        const cancellationReason = e.target.cancelRequest.value;
        let status = 0;

        /*
        Meteor.call('canceledPicking', pickedMachineId, pickedSupplyAreaId,
            status, userCanceled, cancellationReason);

         */

    },


});


Handlebars.registerHelper('inActive_0', () => {
    let inActiveState = Session.get('inActiveState');
    if (typeof inActiveState === 'undefined') {
        inActiveState = 0;
    }
    //   console.log('inActive 0 ', inActiveState);
    if(inActiveState === 0) {
        return 'in-active-button'
    }
});

// Commission start inActiveSate = 1

Handlebars.registerHelper('inActive_1', () => {
    let inActiveState = Session.get('inActiveState');
    if (typeof inActiveState === 'undefined') {
        inActiveState = 0;
    }
    //   console.log('inActive 1 ', inActiveState);
    if(inActiveState === 1) {
        return 'in-active-button'
    }
});

// Push Pause button InActiveState = 2

Handlebars.registerHelper('inActive_2', () => {
    let inActiveState = Session.get('inActiveState');
    if (typeof inActiveState === 'undefined') {
        inActiveState = 0;
    }
    //   console.log('inActive 2 ', inActiveState);
    if(inActiveState === 2) {
        return 'in-active-button'
    }
});

// Back to work, Resume button inActiveState = 3

Handlebars.registerHelper('inActive_3', () => {
    let inActiveState = Session.get('inActiveState');
    if (typeof inActiveState === 'undefined') {
        inActiveState = 0;
    }
    //   console.log('inActive 3 ', inActiveState);
    if(inActiveState === 3) {
        return 'in-active-button'
    }
});

// Push finished button inActiveState = 4, now able to choose new supply or new Machine

Handlebars.registerHelper('inActive_4', () => {
    let inActiveState = Session.get('inActiveState');
    if (typeof inActiveState === 'undefined') {
        inActiveState = 0;
    }
    //   console.log('inActive 4 ', inActiveState);
    if(inActiveState === 4) {
        return 'in-active-button'
    }
});

// choose Supply Area inActiveState = 9

Handlebars.registerHelper('inActive_9', () => {
    let inActiveState = Session.get('supplyChosen');
    if (typeof inActiveState === 'undefined') {
        inActiveState = 0;
    }
    //   console.log('inActive 9 ', inActiveState);
    if(inActiveState !== 9) {
        return 'in-active-button'
    }
});