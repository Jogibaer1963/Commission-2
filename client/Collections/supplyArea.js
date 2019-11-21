Meteor.subscribe('supplyAreas');

Template.supplyAreaShow.helpers({

    supplyAreaListed: () => {
        let result = supplyAreas.find().fetch();
        result.sort((a, b) => (a.supplyPosition > b.supplyPosition) ? 1: -1 );
        console.log(result);
        return result;
    },

    deactivatedSupplyAreaListed: () => {
        let result = supplyAreas.find( {active: false}).fetch();
        result.sort((a, b) => (a.supplyPosition > b.supplyPosition) ? 1: -1 );
        return result;
    },

    doubleSupplyArea: () => {
        let result = Session.get('processResult');
        if (result.active === true) {
            result.active = 'active'
        } else {
            result.active = 'inactive'
        }
        return result;
    }


});

Session.set('processResult', '');


Template.supplyAreaShow.events({

    'submit .new-supply-area': (e) => {
        e.preventDefault();
        let newArea = e.target.supplyName.value;
        const loggedUser = Meteor.user();
        Meteor.call('addSupplyArea', newArea, loggedUser, (err, result) => {
            if (result) {
               Session.set('processResult', result);
            } else if (err) {
                console.log('error = ', err)
            }
        });
        e.target.supplyName.value = '';
    },

    'submit .update-button': (e) => {
        e.preventDefault();
        const newUpPosition = [];
        const loggedUser = Meteor.user();
        let updatePosition = e.target.updatePosition.value;
        $('input[name=updatePosition]:checked').each(function () {
           newUpPosition.push($(this).val());
        });
        Meteor.call('updatePositionSupplyArea',
                                        newUpPosition,
                                        updatePosition,
                                        loggedUser
        );

        e.target.updatePosition.value = '';
        Session.set('processResult', '');
        document.getElementById('upPos').checked = false;
    },

    'submit .activate-button': (e) => {
        e.preventDefault();
        const deactivate = [];
        const activate = [];
        const loggedUser = Meteor.user();
        $('input[name=deactivateSupply]:checked').each(function () {
            deactivate.push($(this).val());
        });
        $('input[name=activateSupply]:checked').each(function () {
            activate.push($(this).val());
        });
        const deactivateSupply = deactivate[0];
        const activateSupply = activate[0];
        Meteor.call('activateSupply',
                                    deactivateSupply,
                                    activateSupply,
                                    loggedUser
        );
    }

});

