Meteor.subscribe('pickers');

Template.analysisOverView.helpers({

    pickers: () => {
        return pickers.find({}, {fields: {_id: 1}}).fetch();
    },

    chosenPicker: () => {
        return Session.get('chosenPicker');
    },

    pickersResult: () => {
        let chosenPicker = Session.get('chosenPicker');
        if (chosenPicker) {
            let result = pickers.findOne({_id: chosenPicker});
            console.log(result);
        }
    }


});



Template.analysisOverView.events({

    'click .pickersName': function(e) {
        e.preventDefault();
        let pickersName = this._id;
        Session.set('chosenPicker', pickersName);
    }


});

Template.analysisOverView.onDestroyed(() => {

    Session.set('chosenPicker', null);

});