Template.admin_navi_buttons.events({
    'click .btn-back': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLineOverView')
    },

    'click .lop': (e) => {
        e.preventDefault();
        FlowRouter.go('/lop')
    },

    'click .log_out': (e) => {
        e.preventDefault();
        Meteor.logout();
        //Meteor.call('logOut', userName)

    },

    'click .specFunc': (e) => {
        e.preventDefault();
        console.log('working')
        Meteor.call('specialFunction')
    },


})

Template.navigation_buttons.events({

    'click .btn-back': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLineOverView')
    },

    'click .btn-assembly': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLine')
    },

    'click .btn-team': function (e) {
       e.preventDefault();
      let userId = Meteor.user()
      console.log(userId.roles[0])
        if (userId.roles[0] === 'team_1') {
            FlowRouter.go('/team_1')
        } else if (userId.roles[0] === 'team_2') {
            FlowRouter.go('/team_2')
        } else if (userId.roles[0] === 'team_3') {
            FlowRouter.go('/team_3')
        } else if (userId.roles[0] === 'team_4') {
            FlowRouter.go('/team_4')
        } else if (userId.roles[0] === 'team_5') {
            FlowRouter.go('/team_5')
        } else if (userId.roles[0] === 'test_bay') {
            FlowRouter.go('/test_bay')
        }

            },

    'click .lop': (e) => {
        e.preventDefault();
        FlowRouter.go('/lop')
    },

    'click .log_out': (e) => {
        e.preventDefault();
        Meteor.logout();
        //Meteor.call('logOut', userName)
    },

})
