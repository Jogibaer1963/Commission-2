Session.set('supplyChosen', 0);


Template.commTablet_2.helpers ({

    machineCommList_2: () => {
        let result = machineCommTable.find({commissionStatus: {$lt: 26}, active: true}).fetch();
        return _.sortBy(result, 'counter');
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
            Session.set('supplyChosen', 9);
            return "selectedArea";
        }
    },

    selectedMultiMachines: () => {
            const picker = Meteor.user().username;
            let result = pickersAtWork.findOne({_id: picker, multi: true});
            if (typeof result === 'undefined') {
                // nothing to share
            } else {
                let machines = result.machines;
                Session.set('multiMachinesId', machines);
                return machines;
            }
    },

    supplyStart: () => {
            const picker = Meteor.user().username;
            let result = pickersAtWork.findOne({_id: picker, multi: true});
            if(typeof result === 'undefined') {
                //nothing to share
            } else {
                let supplySetLength = result.supplySet.length;
                    if (supplySetLength === 1) {
                        let supply = result.supplySet[0]._id;
                        Session.set('selectedArea', supply);
                        return supply;
                    } else {
                       return Session.get('selectedArea');
                        }
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
        if (machineIds.length === 0) {
            // do nothing
        } else {
            Session.set('multiMachinesId', machineIds);
            Meteor.call('multipleMachines', machineIds, loggedUser);
        }
        $('input[type="checkbox"]:checked').prop('checked',false);
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
        Meteor.call('multi-finished', pickedMachines, pickedSupplyAreaId,
            status, userFinished, dateEndNow, pickingEnd);
        Session.set('multiMachinesId', '');
        Session.set('selectedArea', '');
        FlowRouter.go('/');
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

    'click .cancel-multi': function(e) {
      e.preventDefault();
        const userCanceled = Meteor.user().username;
        let pickedMachineId = Session.get('multiMachinesId');
        let pickedSupplyAreaId = Session.get('selectedArea');
        if (typeof pickedSupplyAreaId === 'undefined') {
            Meteor.call('quickRemove', userCanceled);
        }
        if(pickedSupplyAreaId) {
            Meteor.call('canceledMultiPicking', userCanceled,
                               pickedMachineId, pickedSupplyAreaId);
        }
        FlowRouter.go("/");
    },


});


Handlebars.registerHelper('inActive_0', () => {
    let inActiveState = Session.get('inActiveState');
    if (typeof inActiveState === 'undefined') {
        inActiveState = 0;
    }
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
    if(inActiveState !== 9) {
        return 'in-active-button'
    }
});
