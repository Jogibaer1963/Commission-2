
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

    });






    Meteor.methods({

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


        'doubleMachine': (newMachine,inLineDate) => {
                if(typeof machineCommTable.findOne({machineId: newMachine}) === 'undefined') {
                    machineCommTable.insert({machineId: newMachine, inLineDate: inLineDate, commissionStatus: 0});
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
            clientIp = this.connection.clientAddress;
            unsuccessLogin.insert({userId: userVar, password: passwordVar, dateLogin: dateLogin, clientIp: clientIp});
        },

        'successfullLogin': function (userVar, dateLogin) {
            clientIp = this.connection.clientAddress;
            successfullLogin.insert({userId: userVar, dateLogin: dateLogin, clientIp: clientIp});
            usersProfil.update({username: userVar}, {$set: {loginStatus: 1, lastLogin: dateLogin, clientIp: clientIp}});
        },

        'successfullLogout': function(logoutId, logoutDate) {
            successfullLogout.insert({logoutId: logoutId, dateLogout: logoutDate});
            usersProfil.update({username: logoutId}, {$set: {loginStatus: 0}});
        },

        'userManualDelete': function (deleteUser) {
            for (i = 0; i < deleteUser.length; i++) {
                const userName = usersProfil.findOne({_id: deleteUser[i]}).username;
                Meteor.users.remove({username: userName});
                usersProfil.remove({username: userName});
            }
        },

        'userManualLogout': function (logOutUser) {
            for (i = 0; i < logOutUser.length; i++) {
                const userName = usersProfil.findOne({_id: logOutUser[i]}).username;
                Meteor.users.update({username: userName}, {$set: {'services.resume.loginTokens': []}});
                usersProfil.upsert({username: userName}, {$set: {loginStatus: 0}});
            }
        },
//--------------------------------------------------------  Variants -----------------------------------------------------------------------

        'pickingResultL4msb020': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 0;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4msb030': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 1;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4msb040': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 2;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4msb045': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 3;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4msb050': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 4;
                return serverPickingResult(machineId, pickingArea, arrayIndex);

            }
        },

        'pickingResultL4msb060': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 5;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4msb070': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 6;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4msb090': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 7;
                return  serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4paxl10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 8;
                return  serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4pcab10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 9;
                return  serverPickingResult(machineId, pickingArea, arrayIndex);
               }
        },

        'pickingResultL4pcab20': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 10;
                return  serverPickingResult(machineId, pickingArea, arrayIndex);
              }
        },

        'pickingResultL4pchp10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 11;
                return  serverPickingResult(machineId, pickingArea, arrayIndex);
                }
        },

        'pickingResultL4pcln20': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 12;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4pcol05': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 13;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4pcol10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 14;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4pcol20': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 15;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4peng10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 16;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4peng20': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 17;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4peng30': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 18;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4peng40': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 19;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4pfdr10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 20;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4pgrt10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 21;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4phyd10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 22;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4prtr10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 23;
                return serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4prtr20': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 24;
                return   serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        },

        'pickingResultL4pthr10': function (machineId, pickingArea) {
            if(machineId) {
                const arrayIndex = 25;
                return  serverPickingResult(machineId, pickingArea, arrayIndex);
            }
        }




    });

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
}





