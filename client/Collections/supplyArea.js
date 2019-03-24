Meteor.subscribe('supplyAreaArray');

Template.supplyAreaShow.helpers({

    supplyAreaListed: () => {
        result = supplyAreaArray.find( {active: true}).fetch();
        const resultMap = result.sort((a, b) => (a.supplyPosition > b.supplyPosition) ? 1: -1 );

        return result;
    },

    deactivatedSupplyAreaListed: () => {
        result = supplyAreaArray.find( {active: false}).fetch();
        const resultMap = result.sort((a, b) => (a.supplyPosition > b.supplyPosition) ? 1: -1 );
        console.log(resultMap);
        return result;
    }


});


Template.supplyAreaShow.events({

    'submit .newSupplyArea': () => {
        event.preventDefault();
        let newArea = event.target.supplyName.value;
        let newPosition = event.target.supplyPosition.value;
        Meteor.call('addSupplyArea', newArea, newPosition);
        event.target.supplyPosition.value = '';
        event.target.supplyName.value = '';
    },

    'submit .updateButton': () => {
        event.preventDefault();
        const newUpPosition = [];
        const deactivate = [];
        const activate = [];
        let updatePosition = event.target.updatePosition.value;
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
                                        activateSupply
        );
        event.target.updatePosition.value = '';
        document.getElementById('upPos').checked = false;
    }


});

