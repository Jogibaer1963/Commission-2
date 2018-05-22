Meteor.subscribe("usersProfil");

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});


Template.adminViewUser.helpers({

    userResult: function () {
        return usersProfil.find();
    },

    usersTotal: function () {
        let totalUsers = usersProfil.find().fetch();
        return totalUsers.length;
    }

});


Template.adminViewUser.events({

    "click .submitAdmin": function () {
        event.preventDefault();
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
    },


});

Template.adminNewUser.events({
    'submit .adminRegisterNewUser': function (event) {
        event.preventDefault();
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
        }else if (role === 'Commission') {
            roleConst = 'commission'
        }

        event.target.registerUser.value = '';
        event.target.registerPassword.value = '';
        const createdAt =  moment().format('MMMM Do YYYY, h:mm:ss a');
        const loggedUser = Meteor.user();
        Meteor.call('newUser', userConst, passwordConst, roleConst, createdAt, loggedUser, function(err) {
            if (err === undefined) {
                const messageSend = 'Attention: User ' + userConst + ' successfull created';
                Session.set('message', messageSend);
            } else {
                let message = 'Attention: ' + userConst + ' ' + err.message;
                Session.set('message', message);
            }
        });
    }
});

Template.adminNewUser.helpers({

    result: function () {
        return Session.get('message');
    }
});