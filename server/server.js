
import { Random } from 'meteor/random';



if(Meteor.isServer){

    Meteor.startup( function() {

        Meteor.publish("usersProfil", function() {
            return usersProfil.find();
        });

        Meteor.publish("toDoMessage", function() {
            return toDoMesssage.find();
        });

        Meteor.publish("supplyAreaList", function() {
            return supplyAreaList.find();
        });

        Meteor.publish("machineCommTable", function() {
            return machineCommTable.find();
        });

        Meteor.publish("pickersAtWork", function() {
            return pickersAtWork.find();
        });

        Meteor.publish("supplyAreaArray", function() {
            return supplyAreaArray.find();
        });

    });






    Meteor.methods({

//----------------------------------------------- New Style -----------------------------------------------------------------------
        'addSupplyArea': (area, supplyPosition) => {
            let newId = new Mongo.ObjectID().toString();
            console.log(newId);
            supplyAreaArray.update({},
               {$push: {supplyAreaList: {_id: newId,  supplyArea: area, supplyPosition: supplyPosition, active: true}}});
        },


//----------------------------------------------- Commissioning Zone --------------------------------------------------------------

        'startPicking': function (pickedMachineId, pickedSupplyAreaId, status, user, pickingStart, dateStartNow) {
            pickersAtWork.upsert({_id: user}, {$set: {machineNr: pickedMachineId, pickerSupplyArea: pickedSupplyAreaId, inActive: 1}});
            machineCommTable.update({_id: pickedMachineId, "supplyAreaList._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreaList.$.supplyStatus": status,
                                            "supplyAreaList.$.pickerStart": user,
                                            "supplyAreaList.$.pickingStart": pickingStart,
                                            "supplyAreaList.$.pickingDateAndTime": dateStartNow}} )

        },

        'finishedPicking': function (pickedMachineId, pickedSupplyAreaId, status, user, pickingTime, dateEndNow, pickingEnd) {
            pickersAtWork.remove({_id: user});
            machineCommTable.update({_id: pickedMachineId, "supplyAreaList._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreaList.$.supplyStatus": status,
                                            "supplyAreaList.$.pickerFinished": user,
                                            "supplyAreaList.$.pickingTime": pickingTime,
                                            "supplyAreaList.$.pickingEnd": pickingEnd,
                                            "supplyAreaList.$.pickingEndDateAndTime": dateEndNow}},
                                    );
            machineCommTable.update({_id: pickedMachineId}, {$inc: {commissionStatus: 1}});
        },

        'canceledPicking': function (pickedMachineId, pickedSupplyAreaId, status, user,cancellationReason) {
            machineCommTable.update({_id: pickedMachineId, "supplyAreaList._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreaList.$.supplyStatus": status,
                                            "supplyAreaList.$.pickerCanceled": user,
                                            "supplyAreaList.$.pickerCanceledReason": cancellationReason,
                                            "supplyAreaList.$.pickingStart": '',
                                            "supplyAreaList.$.pickerStart": '',
                                            "supplyAreaList.$.pickerFinished": '',
                                            "supplyAreaList.$.pickingDateAndTime": '',
                                            "supplyAreaList.$.pickingEnd": '',
                                            "supplyAreaList.$.pickingTime": '',
                                            "supplyAreaList.$.pickingEndDateAndTime": '',
                                            "supplyAreaList.$.pickingPauseStart": '',
                                            "supplyAreaList.$.pickingPauseEnd": ''}} )
        },

        'pausePickingStart': function (pickedMachineId, pickedSupplyAreaId, status, pickingPauseStart, user) {
             pickersAtWork.upsert({_id: user}, {$set: {inActive: 2}});
             machineCommTable.update({_id: pickedMachineId, "supplyAreaList._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreaList.$.supplyStatus": status,
                                        "supplyAreaList.$.pickingPauseStart": pickingPauseStart }})

        },

        'pausePickingEnd': function (pickedMachineId, pickedSupplyAreaId, status, pickingPauseEnd, user) {
            pickersAtWork.upsert({_id: user}, {$set: {inActive: 3}});
            machineCommTable.update({_id: pickedMachineId, "supplyAreaList._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreaList.$.supplyStatus": status,
                                            "supplyAreaList.$.pickingPauseEnd": pickingPauseEnd}})

        },

        'removeCommMachine': function (removeMachine) {
            machineCommTable.remove({_id: removeMachine});
        },


        'doubleMachine': (newMachine,inLineDate, dateOfCreation) => {
                if(typeof machineCommTable.findOne({machineId: newMachine}) === 'undefined') {
                    machineCommTable.insert({machineId: newMachine,
                                            inLineDate: inLineDate,
                                            dateOfCreation: dateOfCreation,
                                            commissionStatus: 0});
                    supplyAreaList.find({}, {sort: {supplyPosition: 1}}).forEach(function(copy) {
                        machineCommTable.update({machineId: newMachine}, {$addToSet: {supplyAreaList: (copy)}})
                    });
                } else {
                    return newMachine;

                  }
        },

        'removeSupply': function (removeSupplyArea) {
          supplyAreaList.remove({_id: removeSupplyArea});
        },

        'supplyArea': function (supplyArea) {
          supplyAreaList.insert({supplyArea: supplyArea, supplyStatus: 0});
        },
//------------------------------------------------------ Admin section --------------------------------------------------------------------
        'submitToDo': function(toDoText, dateNow, needDate, toDoUser) {
            const toDoStatus = 0;
            const clearDate = 0;
            toDoMesssage.insert({toDoText, dateNow, needDate, clearDate, toDoUser, toDoStatus});
        },

        'unsuccessLogin': function (userVar, passwordVar, dateLogin) {
           let clientIp = this.connection.clientAddress;
            unsuccessLogin.insert({userId: userVar, password: passwordVar, dateLogin: dateLogin, clientIp: clientIp});
        },

        'successfullLogin': function (userVar, dateLogin) {
           let clientIp = this.connection.clientAddress;
            successfullLogin.insert({userId: userVar, dateLogin: dateLogin, clientIp: clientIp});
            usersProfil.update({username: userVar}, {$set: {loginStatus: 1, lastLogin: dateLogin, clientIp: clientIp}});
        },

        'successfullLogout': function(logoutId, logoutDate) {
            successfullLogout.insert({logoutId: logoutId, dateLogout: logoutDate});
            usersProfil.update({username: logoutId}, {$set: {loginStatus: 0}});
        },

        'userManualLogout': function (logOutUser) {
            for (i = 0; i < logOutUser.length; i++) {
                const userName = usersProfil.findOne({_id: logOutUser[i]}).username;
                Meteor.users.update({username: userName}, {$set: {'services.resume.loginTokens': []}});
                usersProfil.upsert({username: userName}, {$set: {loginStatus: 0}});
            }
        },

        'userManualDelete': function (deleteUser) {
            for (i = 0; i < deleteUser.length; i++) {
                const userName = usersProfil.findOne({_id: deleteUser[i]}).username;
                Meteor.users.remove({username: userName});
                usersProfil.remove({username: userName});
            }
        },

        'newUser' : function (userConst, passwordConst, role,  createdAt, loggedUser) {
            Accounts.createUser({username: userConst, password: passwordConst});
            setTimeout(function () {
            }, 1000);
            Meteor.users.upsert({username:userConst}, {$addToSet: {roles: role}});
            usersProfil.insert({username: userConst, role: role, createdAt: createdAt,
                createdBy: loggedUser, loginStatus: 0});
        },
//-------------------------------------------------------- Supply Areas -----------------------------------------------------------------------




    });

    /*

function serverPickingResult(machineId, pickingArea, arrayIndex) {
    const result = machineCommTable.findOne({_id: machineId},
        {"supplyAreaList.supplyArea" : pickingArea});
    const pickersChoice = result.supplyAreaList[arrayIndex];
    let pickerStart = pickersChoice.pickerStart;
    let pickingPauseStart = pickersChoice.pickingPauseStart;
    let pickingPauseEnd = pickersChoice.pickingPauseEnd;
    if(!pickingPauseEnd) {
        pickingPauseStart = 1;
        pickingPauseEnd = 1;
    }
    let pickingDuration = ((pickersChoice.pickingEnd - pickersChoice.pickingStart -
        (pickingPauseEnd - pickingPauseStart)) / 60000).toFixed(0);
    let pickingDateAndTime = pickersChoice.pickingDateAndTime;
    return {pickerStart, pickingDuration, pickingDateAndTime};
    }

    */
}





