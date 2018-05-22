FlowRouter.route('/login', {
   name: 'login',
   action() {
       BlazeLayout.render('login')
   }
});

FlowRouter.route('/logout', {
    name: 'logout',
    action() {
        BlazeLayout.render('login')
    }
});

FlowRouter.route('/adminLayout', {
    name: 'adminLayout',
    action() {
        BlazeLayout.render('adminLayout')
    }
});

FlowRouter.route('/', {
    name: '/',
    action() {
        BlazeLayout.render('mainLayout')
    }
});

FlowRouter.route('/overViewUser', {
    name: 'overViewUser',
    action() {
        BlazeLayout.render('overViewUser')
    }
});

FlowRouter.route('/toDoList', {
    name: 'toDoList',
    action() {
        BlazeLayout.render('toDoList')
    }
});

FlowRouter.route('/admin', {
    name: 'admin',
    action() {
        BlazeLayout.render('admin')
    }
});

FlowRouter.route('/adminNewUser', {
    name: 'adminNewUser',
    action() {
        BlazeLayout.render('adminNewUser')
    }
});

FlowRouter.route('/adminViewUser', {
    name: 'adminViewUser',
    action() {
        BlazeLayout.render('adminViewUser')
    }
});

FlowRouter.route('/commission', {
    name: 'commission',
    action() {
        BlazeLayout.render('commission')
    }
});

FlowRouter.route('/carts', {
    name: 'carts',
    action() {
        BlazeLayout.render('carts')
    }
});

FlowRouter.route('/commissionOverView', {
    name: 'commissionOverView',
    action() {
        BlazeLayout.render('commissionOverView')
    }
});

FlowRouter.route('/tabletStart', {
    name: 'tabletStart',
    action() {
        BlazeLayout.render('tabletStart')
    }
});

FlowRouter.route('/commissionStatistics', {
    name: 'commissionStatistics',
    action() {
        BlazeLayout.render('commissionStatistics')
    }
});




