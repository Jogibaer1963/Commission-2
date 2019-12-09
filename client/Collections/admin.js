Meteor.subscribe("usersProfile");



Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Template.adminNewUser.helpers({

    result: function () {
        return Session.get('message');
    },

    userResult: function () {
        return usersProfile.find().fetch();

    },

    usersTotal: function () {
        let totalUsers = usersProfile.find().fetch();
        return totalUsers.length;
    },

    'selectedClass': function () {
        const checkPoint = this._id;
        const selectedCheckPoint = Session.get('selectedMachine');
        if (selectedCheckPoint === checkPoint) {
            return "selected"
        }
    }
});

Template.adminNewUser.events({

    'submit .adminRegisterNewUser': function (event) {
        event.preventDefault();
        let roleConst = '';
        const userConst = event.target.registerUser.value;
        const passwordConst = event.target.registerPassword.value;
        const role = event.target.userRole.value;
        if (role === 'Admin') {
            roleConst = 'admin'
        } else if (role === 'Logistics') {
            roleConst = 'shipping'
        } else if (role === 'Quality PDI') {
            roleConst = 'pdi'
        } else if (role === 'Repair Team') {
            roleConst = 'repair'
        } else if (role === 'Wash Bay') {
            roleConst = 'washBay'
        } else if (role === 'Loading') {
            roleConst = 'outBound'
        }  else if (role === 'Operation Supervisor') {
            roleConst = 'Ops_admin'
        }   else if (role === 'Team Lead') {
            roleConst = 'teamLead'
        }else if (role === 'Picker') {
            roleConst = 'Picker'
        }

        event.target.registerUser.value = '';
        event.target.registerPassword.value = '';
        const createdAt =  moment().format('MMMM Do YYYY, h:mm:ss a');
        const loggedUser = Meteor.user();
        Meteor.call('newUser', userConst, passwordConst,
                            roleConst, createdAt, loggedUser, function(err) {
            if (err === undefined) {
                const messageSend = 'Attention: User ' + userConst + ' successfull created';
                Session.set('message', messageSend);
            } else {
                let message = 'Attention: ' + userConst + ' ' + err.message;
                Session.set('message', message);
            }
        });
    },

    "click .submit-admin": function (e) {
        e.preventDefault();
        const logOutUser = [];
        const deleteUser = [];
        $('input[name=logOut]:checked').each(function () {
            logOutUser.push($(this).val());
        });
        Meteor.call('userManualLogout', logOutUser);

        $('input[name=deleteMe]:checked').each(function () {
            deleteUser.push($(this).val());
        });
        Meteor.call('userManualDelete', deleteUser);
        document.getElementById('logOut').checked=false;
    }

});

Template.adminView.helpers({

    supplyArea: () => {
      return supplyAreas.find({active: true}).fetch();
    },

    inActive: () => {
        return supplyAreas.find({active: false}).fetch();
    },

    'selectedArea': function () {
        let areaId = this._id;
        let deactivate = Session.get('deactivateSupplyArea');
        if (areaId === deactivate) {
            return 'selectedArea';
        }
    },

    'selectedInactiveArea': function () {
        let areaId = this._id;
        let deactivate = Session.get('reactivateSupplyArea');
        if (areaId === deactivate) {
            return 'selectedArea';
        }
    }

});

Template.adminView.events({

   'click .area': function (e) {
       e.preventDefault();
       let area = this._id;
       Session.set('deactivateSupplyArea', area);
   },

    'click .inactiveArea': function (e) {
        e.preventDefault();
        let area = this._id;
        Session.set('reactivateSupplyArea', area);
    },

    'click .setInactive': (e) => {
       e.preventDefault();
       let area = Session.get('deactivateSupplyArea');
       Meteor.call('deactivateArea', area);
       Session.set('deactivateSupplyArea', false);
    },

    'click .reActivate': (e) => {
       e.preventDefault();
        let area = Session.get('reactivateSupplyArea');
        Meteor.call('reactivateArea', area);
        Session.set('reactivateSupplyArea', false);
    },

    'submit .addingArea': (e) => {
       e.preventDefault();
       let newArea = e.target.addNewArea.value;
       Meteor.call('addSupplyArea', newArea);
       target.addNewArea.value = '';
    }



});