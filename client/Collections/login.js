


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
                 } else if (userVar === 'Team-4-Merge') {
                     FlowRouter.go('team_4_merge_station')
                 } else {
                     if(Meteor.userId()){
                         FlowRouter.go('/');
                     } else {
                         Bert.alert('User or Password wrong', 'danger', 'growl-top-left');
                     }
                 }
            });
        }
    });


    Template.commissionNav.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
            FlowRouter.go('/login');
        }
    });

    Template.adminLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            const logoutId = Session.get('loginId');
            const logoutDate = new Date();
            Meteor.call('successfullLogout', logoutId, logoutDate);
            Session.key = {};
            Meteor.logout();
            FlowRouter.go('/login');
        }
    });
