Meteor.subscribe('pickers');


Template.database.helpers({

    pickers: () => {
        let result = pickers.find({}, {fields: {_id: 1}}).fetch();
        Session.set('pickersResult', result);
        return result
    },

    chosenPicker: () => {
      return Session.get('picker');

    },

    pickersResult: () => {
        let picker = Session.get('picker');
        if (typeof picker === 'undefined') {

        } else {
            let result = pickers.findOne({_id: picker});
            console.log(result);
            return result;
        }

    }


});

Template.database.events({

    'click .pickersName': function (e) {
        e.preventDefault();
        let chosenPicker = this._id;
        Session.set('picker', chosenPicker);
    }

});