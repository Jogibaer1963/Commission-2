Meteor.subscribe('toDoMessage');

Template.lop.helpers({

    toDoMessage: () => {
        return toDoMesssage.find({}, {sort: {toDoStatus: 1}}).fetch();
    }


});

Template.lop.events({

    'submit .toDoMessanger': () => {
        event.preventDefault();
        let toDoUser = Meteor.user().username;
        let toDoText = event.target.messageId.value;
        let needDate = event.target.newDate.value;
        let dateNow = moment().format('L');
        Meteor.call('submitToDo', toDoText, dateNow, needDate, toDoUser);
    }


});