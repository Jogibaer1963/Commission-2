
CommissionToDoMesssage = new Mongo.Collection('10_CommissionToDoMessage');
commission = new Mongo.Collection('commission');
supplyAreaList = new Mongo.Collection('supplyAreaList');
machineCommTable = new Mongo.Collection('machineCommTable');
pickersAtWork = new Mongo.Collection('pickersAtWork');
supplyAreas = new Mongo.Collection('01_supplyAreas');
userActions = new Mongo.Collection('09_userActions');
pickers = new Mongo.Collection('02_pickers');
fiscalYear = new Mongo.Collection('99_fiscalYear');
usersProfile = new Mongo.Collection('usersProfile');
updateTime = new Mongo.Collection('14_timeUpdate')
activeAssembly = new Mongo.Collection('12_activeAssembly');
assemblySchedule = new Mongo.Collection('20_assemblySchedule');
scheduleConfig = new Mongo.Collection('21_scheduleConfiguration');
assemblyLineBay = new Mongo.Collection('10_assemblyLineBay');
assemblyTech = new Mongo.Collection('03_assemblyTech');  // new
pickingNewHead = new Mongo.Collection('HeadReadyToGo');
machineReadyToGo = new Mongo.Collection('machineReadyToGo');

if (Meteor.isClient) {

    Meteor.startup(function () {
        Session.set('selectedPdiMachine', '');
        Session.set('pdiMachineNumber', '');
        Session.set('selectedErrorId', '');
        Session.set('selectedNewErrorId', '');
        Session.set('findMachine', '');
        Session.set('selectedProfiId', '');
        Session.set('selectedArea', '');
        Session.set('selectedMachine', '');
        Session.set('commMachine', '');
        Session.set('inActiveState', 0);
    });
}

if (Meteor.isServer) {

    Meteor.startup(function () {

    })

}