Meteor.subscribe('pickers');


Template.database.helpers({

    pickers: () => {
        let result = pickers.find({}, {fields: {_id: 1}}).fetch();
        Session.set('pickersResult', result);
        return result
    },





});