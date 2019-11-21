Meteor.subscribe('pickers');


Template.database.helpers({

    pickers: () => {
        return pickers.find({}, {fields: {_id: 1}}).fetch();
    },

});