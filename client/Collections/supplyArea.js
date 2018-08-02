Meteor.subscribe('supplyAreaArray');

Template.supplyAreaShow.helpers({

    supplyAreaListed: () => {
        result = supplyAreaArray.find({supplyAreaList: {$elemMatch: {active: 1}}}).fetch();
        console.log(result);


    }

});


Template.supplyAreaShow.events({

    'submit .newSupplyArea': () => {
        event.preventDefault();
        let newArea = event.target.supplyName.value;
        let newPosition = event.target.supplyPosition.value;
        Meteor.call('addSupplyArea', newArea, newPosition);
        event.target.supplyPosition.value = '';
    }


});

