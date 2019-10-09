Meteor.subscribe('CommissionToDoMessage');

Template.lop.helpers({

    toDoMessage: () => {
        return CommissionToDoMesssage.find({}, {sort: {toDoStatus: 1}}).fetch();
    },

    'selectedMessage': function(){
        const openToDo = this._id;
        const selectedToDoItem = Session.get('selectedToDoItem');
        if (selectedToDoItem === openToDo) {
            return "selected";
        }
    }


});

Template.lop.events({

    'submit .toDoMessanger': (e) => {
        e.preventDefault();
        let toDoUser = Meteor.user().username;
        let toDoText = e.target.messageId.value;
        let needDate = e.target.newDate.value;
        let dateNow = moment().format('L');
        Meteor.call('submitToDo', toDoText, dateNow, needDate, toDoUser);
    },

    'click .textMessage': function () {
        const selectedToDo = this._id;
        Session.set('selectedToDoItem', selectedToDo);
    }


});

Template.adminLop.events({

    'click .inProcessToDo': (e) => {
        e.preventDefault();
        let status = 1;
        let inProcessItem = Session.get('selectedToDoItem');
        Meteor.call('setToDo', inProcessItem, status);
    },

    'click .cancelToDo': (e) => {
        e.preventDefault();
        let status = 0;
        let inProcessItem = Session.get('selectedToDoItem');
        Meteor.call('setToDo', inProcessItem, status);
    },

    'click .finishedToDo': (e) => {
        e.preventDefault();
        let status = 2;
        let inProcessItem = Session.get('selectedToDoItem');
        Meteor.call('setToDo', inProcessItem, status);
    },

    'click .reOpenToDo': (e) => {
        e.preventDefault();
        let status = 3;
        let inProcessItem = Session.get('selectedToDoItem');
        Meteor.call('setToDo', inProcessItem, status);
    }



});