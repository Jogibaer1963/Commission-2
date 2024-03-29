


    Template.login.events({

        'submit form': function (event) {
            event.preventDefault();
            const userVar = event.target.loginUser.value;
            const passwordVar = event.target.loginPassword.value;
            Session.set('loginId', userVar);
            Session.set('selectedMachine', '');
            Meteor.loginWithPassword(userVar, passwordVar, function(){
                 if (userVar === 'Team 4' || userVar === 'Team 2' ||
                     userVar === 'Team 3' || userVar === 'Team 1' ||
                     userVar === 'Team 5' || userVar === 'Test Bay')   {
                     FlowRouter.go('/assemblyLine');
                 } else if (Meteor.userId()) {
                         FlowRouter.go('/overview');
                     } else {
                         Bert.alert('User or Password wrong', 'danger', 'growl-top-left');
                     }
            })
            Meteor.call('loginStatus', userVar, 1)
        }

    });


    Template.commissionNav.events({
        'click .logout': function (event) {
            event.preventDefault();
            Session.key = {};
            Meteor.logout();
            FlowRouter.go('/login');
        }
    });

    Template.adminLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            Session.key = {};
            Meteor.logout();
            FlowRouter.go('/login');
        }
    });
