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

// --------------  html file 01_pickingOverview.html  -------------------------

FlowRouter.route('/overview', {
    name: 'overview',
    action() {
        BlazeLayout.render('overview')
    }
});

//  ---------------                                     ------------------------------

FlowRouter.route('/adminLayout', {
    name: 'adminLayout',
    action() {
        BlazeLayout.render('adminLayout')
    }
});

FlowRouter.route('/', {
    name: '/',
    action() {
        BlazeLayout.render('overview')
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
       // Session.keys = {};
        BlazeLayout.render('commission')
    }
});

FlowRouter.route('/commissionStatistics', {
    name: 'commissionStatistics',
    action() {
        BlazeLayout.render('commissionStatistics')
    }
});

FlowRouter.route('/commissionAnalysis.html', {
    name: 'commissionAnalysis',
    action() {
        BlazeLayout.render('commissionAnalysis')
    }
});

FlowRouter.route('/multiMachines', {
    name: 'multiMachines',
    action() {
        BlazeLayout.render('multiMachines')
    }
});


//  ********************************  Assembly Line  **********************

FlowRouter.route('/lineAdministration', {
    name: 'lineAdministration',
    action() {
        BlazeLayout.render('lineAdministration')
    }
});


FlowRouter.route('/assemblyLineOverView', {
    name: 'assemblyLineOverView',
    action() {
        BlazeLayout.render('assemblyLineOverView')
    }
});

FlowRouter.route('/assemblyLine', {
    name: 'assemblyLine',
    action() {
        BlazeLayout.render('assemblyLine')
    }
});

FlowRouter.route('/timeUpdater', {
    name: 'timeUpdater',
    action() {
        BlazeLayout.render('timeUpdater')
    }
});







