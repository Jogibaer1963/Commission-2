unsuccessLogin = new Mongo.Collection('unsuccessLogin');
successfullLogin = new Mongo.Collection('successfullLogin');
successfullLogout = new Mongo.Collection('successfullLogout');
usersProfile = new Mongo.Collection('usersProfile');
CommissionToDoMesssage = new Mongo.Collection('10_CommissionToDoMessage');
commission = new Mongo.Collection('commission');
supplyAreaList = new Mongo.Collection('supplyAreaList');
machineCommTable = new Mongo.Collection('machineCommTable');
pickersAtWork = new Mongo.Collection('pickersAtWork');
supplyAreas = new Mongo.Collection('01_supplyAreas');
userActions = new Mongo.Collection('09_userActions');
pickers = new Mongo.Collection('02_pickers');

if (Meteor.isClient) {

    Meteor.startup( function() {

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
