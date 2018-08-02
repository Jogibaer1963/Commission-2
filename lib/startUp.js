unsuccessLogin = new Mongo.Collection('unsuccessLogin');
successfullLogin = new Mongo.Collection('successfullLogin');
successfullLogout = new Mongo.Collection('successfullLogout');
usersProfil = new Mongo.Collection('usersProfil');
toDoMesssage = new Mongo.Collection('toDoMessage');
commission = new Mongo.Collection('commission');
supplyAreaList = new Mongo.Collection('supplyAreaList');
machineCommTable = new Mongo.Collection('machineCommTable');
pickersAtWork = new Mongo.Collection('pickersAtWork');
supplyAreaArray = new Mongo.Collection('01_supplyAreaArray');

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
