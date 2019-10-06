


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

        Meteor.publish("supplyAreas", function() {
            return supplyAreas.find();
        });

    });


    Meteor.methods({

//----------------------------------------------- New and updating Supply Area -----------------------------------------------------------------------
        'addSupplyArea': (area, loggedUser) => {
            const supplyStatus = 0;
     //     check if supply Area already exists, if so send error back to client
            if (area) {
                let supplyArea = supplyAreas.findOne({_id: area});
                if (supplyArea) {
                    if (supplyArea._id === area) {
                        return supplyArea;
                    }
                }
            }
     //     insert new unique supply Area with position number
            supplyAreas.insert({_id: area,
                                    supplyPosition: 0,
                                    active: true,
                                   supplyStatus: supplyStatus});

            let action = 'added supply area ' + area;
            userUpdate(loggedUser, action);
        },

        // ****     physical database for supplyAreaArray is 01_supplyAreaArray     ****
        'updatePositionSupplyArea': (newUpArea, updatePosition, loggedUser) => {
            let newPos = parseInt(updatePosition);
            let newArea = newUpArea.toString();

            // build object for the updated Area
            let newObject = {"_id": newUpArea[0], "supplyPosition": newPos};
         // Fallunterscheidung existiert nummer oder nicht
            let supplyAreaArray = supplyAreas.find({active: true}).fetch();
            let collectedSupplyPos = supplyAreaArray.map(findArea => findArea.supplyPosition);
            let foundOne = collectedSupplyPos.find((e) => e === newPos);

         // Nummer nicht existent, speichern der neuen Area
            if(typeof foundOne === 'undefined') {

                supplyAreas.upsert({_id: newArea}, {$set: {supplyPosition: newPos}});

            } else {

         // Nummer existiert, neue nummer einfügen und array neu nummerieren
                supplyAreaArray.sort((a,b) => a.supplyPosition - b.supplyPosition);
                let oldIndex = supplyAreaArray.map((e) => {return e._id}).indexOf(newArea);
                let newIndex = supplyAreaArray.map((e) => {return e.supplyPosition}).indexOf(newPos);
                let oldPos = supplyAreaArray[oldIndex].supplyPosition;
                let indexDiff = newIndex - oldIndex;

         // Fallunterscheidung ob Position von oben nach unten oder unten nach oben geschoben wird

                if (indexDiff > 0 ) {  // nach oben
                 // neue Position wird an die Area vergeben
                supplyAreaArray[oldIndex].supplyPosition = newPos;
                let counter = 1;
                for (let i = 0; i <= indexDiff - 1; i++ ){
                    supplyAreaArray[newIndex - i].supplyPosition = newPos - counter;
                //    console.log(i, newIndex, supplyAreaArray[newIndex - i]);
                    counter++;
                }
                supplyAreaArray.sort((a,b) => a.supplyPosition - b.supplyPosition);

                } else if (indexDiff < 0) {   // nach unten
                    let posIndexDiff = Math.abs(indexDiff);

                    // neue Position wird an die Area vergeben
                    supplyAreaArray[oldIndex].supplyPosition = newPos;

                    let counter = 1;
                    for (let i = 0; i <= posIndexDiff - 1; i++ ){
                        supplyAreaArray[newIndex + i].supplyPosition = newPos + counter;
                        counter++;
                    }
                    supplyAreaArray.sort((a,b) => a.supplyPosition - b.supplyPosition);

                }
                // write new order to database
                supplyAreaArray.forEach((e) => {
                    supplyAreas.update({_id: e._id}, {$set: {supplyPosition: e.supplyPosition}});
                });

            }

        },



        'activateSupply': (deactivateSupply, activeSupply, loggedUser) => {
            if (deactivateSupply) {
                supplyAreas.upsert({_id: deactivateSupply},
                    {$set: {active: false, supplyPosition: 0}});
                let action = 'Deactivated area ' + deactivateSupply;
                // updating machine table machineCommTable

                // user action recorder
                userUpdate(loggedUser, action);
            }
            if (activeSupply) {
                supplyAreas.upsert({_id:activeSupply},
                    {$set: {active: true}});
                let action = 'Re-activated area ' + activeSupply;
                // updating machine table machineCommTable

                // user action recorder
                userUpdate(loggedUser, action);
            }
        },

// Adding and removing Machine, filling the database machineCommTable with pre sets

        'doubleMachine': (newMachine, inLineDate, dateOfCreation) => {
            if(typeof machineCommTable.findOne({machineId: newMachine}) === 'undefined') {
                machineCommTable.insert({machineId: newMachine,
                    inLineDate: inLineDate,
                    dateOfCreation: dateOfCreation,
                    commissionStatus: 0});
                supplyAreas.find({active: true}, {sort: {supplyPosition: 1}}).forEach(function(copy) {
                    machineCommTable.update({machineId: newMachine}, {$addToSet: {supplyAreas: (copy)}})
                });
            } else {
                return newMachine;
            }
        },

        'removeCommMachine': function (removeMachine) {
            machineCommTable.remove({_id: removeMachine});
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
            for ( let i = 0; i < logOutUser.length; i++) {
                const userName = usersProfil.findOne({_id: logOutUser[i]}).username;
                Meteor.users.update({username: userName}, {$set: {'services.resume.loginTokens': []}});
                usersProfil.upsert({username: userName}, {$set: {loginStatus: 0}});
            }
        },

        'userManualDelete': function (deleteUser) {
            for (let i = 0; i < deleteUser.length; i++) {
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
    // physical database is 09_userAction
     function userUpdate (loggedUser, action)  {
        let timeStamp = Date.now();
        userActions.insert({user: loggedUser, action: action, timeStamp: timeStamp});
    }

}





