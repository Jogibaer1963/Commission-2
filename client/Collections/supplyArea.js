Meteor.subscribe('supplyAreaArray');

Template.supplyAreaShow.helpers({

    supplyAreaListed: () => {
        let result = supplyAreaArray.find( {active: true}).fetch();
        result.sort((a, b) => (a.supplyPosition > b.supplyPosition) ? 1: -1 );
        return result;
    },

    deactivatedSupplyAreaListed: () => {
        let result = supplyAreaArray.find( {active: false}).fetch();
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
        let newPosition = e.target.supplyPosition.value;
        const loggedUser = Meteor.user();
        Meteor.call('addSupplyArea', newArea, newPosition, loggedUser, (err, result) => {
            if (result) {
               Session.set('processResult', result);
            } else if (err) {
                console.log('error = ', err)
            }
        });
        e.target.supplyPosition.value = '';
        e.target.supplyName.value = '';

    },

    'submit .update-button': (e) => {
        e.preventDefault();
        const newUpPosition = [];
        const deactivate = [];
        const activate = [];
        const loggedUser = Meteor.user();
        let updatePosition = e.target.updatePosition.value;
        $('input[name=updatePosition]:checked').each(function () {
           newUpPosition.push($(this).val());
        });
        $('input[name=deactivateSupply]:checked').each(function () {
            deactivate.push($(this).val());
        });
        $('input[name=activatePosition]:checked').each(function () {
            activate.push($(this).val());
        });
        const newPosition = newUpPosition[0];
        const deactivateSupply = deactivate[0];
        const activateSupply = activate[0];

        Meteor.call('updatePositionSupplyArea',
                                        newPosition,
                                        updatePosition,
                                        deactivateSupply,
                                        activateSupply,
                                        loggedUser
        );
        e.target.updatePosition.value = '';
        Session.set('processResult', '');
        document.getElementById('upPos').checked = false;
    }


});

