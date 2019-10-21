
if(Meteor.isServer){

    Meteor.startup( function() {

        Meteor.publish("usersProfil", function() {
            return usersProfil.find();
        });

        Meteor.publish("CommissionToDoMessage", function() {
            return CommissionToDoMesssage.find();
        });

        Meteor.publish("supplyAreas", function() {
            return supplyAreas.find();
        });

        Meteor.publish("machineCommTable", function() {
            return machineCommTable.find();
        });

        Meteor.publish("pickersAtWork", function() {
            return pickersAtWork.find();
        });

        Meteor.publish("pickers", function() {
            return pickers.find();
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
                                    supplyStatus: supplyStatus
            });

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

            let supplyAreaArray = supplyAreas.find().fetch();
            let collectedSupplyPos = supplyAreaArray.map(findArea => findArea.supplyPosition);
            let foundOne = collectedSupplyPos.find((e) => e === newPos);
            let arrayLength = supplyAreaArray.length;

         // Nummer nicht existent, speichern der neuen Area

            if(typeof foundOne === 'undefined') {

                supplyAreas.upsert({_id: newArea}, {$set: {supplyPosition: newPos}});

                // re-nummerierung der oberen Nummern
                let arrayDiff = arrayLength - newPos;
                if (arrayDiff > 0) {
                    supplyAreaArray.sort((a,b) => a.supplyPosition - b.supplyPosition);
                    let newIndex = supplyAreaArray.map((e) => {return e.supplyPosition}).indexOf(newPos-1);
                    let counter = 0;
                    for (let i = newIndex + 2; i <= arrayLength - 1; i++) {
                        supplyAreaArray[newIndex + counter].supplyPosition = newPos + counter;
                        let updateArea = supplyAreaArray[newIndex + counter + 1]._id;
                        let updatePos = newPos + counter;
                        supplyAreas.upsert({_id: updateArea}, {$set: {supplyPosition: updatePos}});
                        counter++;
                    }
                }



            } else {

         // Nummer existiert, prüfen ob nach oben oder nach unten verschoben wird

                supplyAreaArray.sort((a,b) => a.supplyPosition - b.supplyPosition);
                let oldIndex = supplyAreaArray.map((e) => {return e._id}).indexOf(newArea);
                let newIndex = supplyAreaArray.map((e) => {return e.supplyPosition}).indexOf(newPos);
                let oldPos = supplyAreaArray[oldIndex].supplyPosition;
                let indexDiff = newIndex - oldIndex;


                if (indexDiff > 0 ) {  // nach oben
                 // neue Position wird an die Area vergeben
                supplyAreaArray[oldIndex].supplyPosition = newPos;
                let counter = 1;
                for (let i = 0; i <= indexDiff - 1; i++ ){
                    supplyAreaArray[newIndex - i].supplyPosition = newPos + counter;
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

        'removeSupply': function (removeSupplyArea) {
            supplyAreas.remove({_id: removeSupplyArea});
        },

        'supplyArea': function (supplyArea) {
            supplyAreas.insert({supplyArea: supplyArea, supplyStatus: 0});
        },

//----------------------------------------------- Commissioning Zone --------------------------------------------------------------

        'startPicking': function (pickedMachineId, pickedSupplyAreaId, status, user, pickingStart, dateStartNow) {
            pickersAtWork.upsert({_id: user}, {$set: {machineNr: pickedMachineId,
                                                                      pickerSupplyArea: pickedSupplyAreaId, inActive: 1}});
            machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreas.$.supplyStatus": status,
                                            "supplyAreas.$.pickerStart": user,
                                            "supplyAreas.$.pickingStart": pickingStart,
                                            "supplyAreas.$.pickingDateAndTime": dateStartNow}});
            let findPicker = pickers.find().fetch();
            let result = findPicker.find(picker => picker._id === user);
            if(typeof result === 'undefined') {
                pickers.insert({_id: user});
            }
        },

        'finishedPicking': function (pickedMachineId, pickedSupplyAreaId, status, user, dateEndNow, pickingEnd) {
            pickersAtWork.remove({_id: user});
            machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreas.$.supplyStatus": status,
                                            "supplyAreas.$.pickerFinished": user,
                                            "supplyAreas.$.pickingEnd": pickingEnd,
                                            "supplyAreas.$.pickingEndDateAndTime": dateEndNow}},
                                    );
            machineCommTable.update({_id: pickedMachineId}, {$inc: {commissionStatus: 1}});

            const result = machineCommTable.findOne({_id: pickedMachineId});
            let machineId = result.machineId;
            let pickersArea = result.supplyAreas,
            pickersResult =  pickersArea.find((e) => {
                return e._id === pickedSupplyAreaId;
               });
            let pickingPauseStart = pickersResult.pickingPauseStart;
            let pickingPauseEnd = pickersResult.pickingPauseEnd;
            if(!pickingPauseEnd) {
                pickingPauseStart = 1;
                pickingPauseEnd = 1;
            }
            let pickingDuration = ((pickersResult.pickingEnd - pickersResult.pickingStart -
                (pickingPauseEnd - pickingPauseStart)) / 60000).toFixed(0);
            let pickingDateAndTime = pickersResult.pickingEndDateAndTime;
            pickers.update({_id: user},
                          {$push: {[machineId]: {supplyArea: pickedSupplyAreaId,
                                                          duration: pickingDuration,
                                                          date: pickingDateAndTime}}} );



        },

        'canceledPicking': function (pickedMachineId, pickedSupplyAreaId, status, user,cancellationReason) {
            machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreas.$.supplyStatus": status,
                                            "supplyAreas.$.pickerCanceled": user,
                                            "supplyAreas.$.pickerCanceledReason": cancellationReason,
                                            "supplyAreas.$.pickingStart": '',
                                            "supplyAreas.$.pickerStart": '',
                                            "supplyAreas.$.pickerFinished": '',
                                            "supplyAreas.$.pickingDateAndTime": '',
                                            "supplyAreas.$.pickingEnd": '',
                                            "supplyAreas.$.pickingTime": '',
                                            "supplyAreas.$.pickingEndDateAndTime": '',
                                            "supplyAreas.$.pickingPauseStart": '',
                                            "supplyAreas.$.pickingPauseEnd": ''}} )
        },

        'pausePickingStart': function (pickedMachineId, pickedSupplyAreaId, status, pickingPauseStart, user) {
             pickersAtWork.upsert({_id: user}, {$set: {inActive: 2}});
             machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreas.$.supplyStatus": status,
                                        "supplyAreas.$.pickingPauseStart": pickingPauseStart }})

        },

        'pausePickingEnd': function (pickedMachineId, pickedSupplyAreaId, status, pickingPauseEnd, user) {
            pickersAtWork.upsert({_id: user}, {$set: {inActive: 3}});
            machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreas.$.supplyStatus": status,
                                            "supplyAreas.$.pickingPauseEnd": pickingPauseEnd}})

        },

        // ----------------------------------  Multi machines one supply Area

        'multipleMachines': (machineIds, loggedUser) => {
            let supplyArray0 = [];
            let supplyArray1 = [];
            let supplyArray2 = [];
            let supplyArray3 = [];
            let supplyArray4 = [];
            let supplyArray5 = [];
            let supplyArray6 = [];
            let newSet = [];
            let newObjectSet = [];
            /*
            let supplyArray7 = [];
            let supplyArray8 = [];
            let supplyArray9 = [];

             */


            // building arrays of available supply areas for max 6 machines.
            let k = 0;
            machineIds.forEach((machine) => {
             let result =   machineCommTable.findOne({machineId: machine});
             let resultArray = result.supplyAreas;
                resultArray.forEach((supplyActive) => {
                    if(supplyActive.supplyStatus === 0) {
                        eval('supplyArray' + k).push(supplyActive._id);
                    }
                });
                k++;
            });

            // compare first array with 2nd, 3rd, 4th.. and eliminate single array values not matching other arrays
            let finalArray = [];
            for (let i = 1; i <= k; i++) {
                supplyArray0.forEach((e1) => {
                    eval('supplyArray' + (i)).forEach((e2) => {
                        if(e1 === e2) {
                          finalArray.push(e1);
                        }
                    })
                });
               supplyArray0 = finalArray;
            }

            // identify supply area with highest number (areas available for all selected machines

            let sortedArray = supplyArray0.slice().sort();
            let countedNames = sortedArray.reduce(function (allNames, name) {
                if (name in allNames) {
                    allNames[name]++;
                }
                else {
                    allNames[name] = 1;
                }
                return allNames;
            }, {});

            let arr = Object.values(countedNames);
            let key = Object.keys(countedNames);
            let max = Math.max(...arr);
            let i = 0;

            // create array with available areas and store it in pickersATWork

            arr.forEach((element) => {
                 if (element >= max) {
                     let identifiedSupply = key[i];
                     newSet.push(identifiedSupply);
                 }
                 i++;
            });
            newSet.forEach((element) => {
                let newObject = {_id: element, supplyStatus: 0};
                newObjectSet.push(newObject)
            });
            pickersAtWork.upsert({_id: loggedUser.username },
                                 {$set: {machines: machineIds, supplySet: newObjectSet}})
        },



        'startPickingMultiMachines': (pickedMachines,  pickedSupplyAreaId, status, user,
                                      pickingStart, dateStartNow ) => {

            pickedMachines.forEach((element) => {
                machineCommTable.update({machineId: element, "supplyAreas._id": pickedSupplyAreaId},
                    {$set: {"supplyAreas.$.supplyStatus": status,
                            "supplyAreas.$.pickerStart": user,
                            "supplyAreas.$.pickingStart": pickingStart,
                            "supplyAreas.$.pickingDateAndTime": dateStartNow}});
            });

            let findPicker = pickers.find().fetch();
            let result = findPicker.find(picker => picker._id === user);
            if(typeof result === 'undefined') {
                pickers.insert({_id: user});
            }
        },

//------------------------------------------------  Data Analyzing ----------------------------------------------------------------------

        'addNewPicker': (newPicker) => {

        },



        'analyze': () => {
          let result = machineCommTable.find().fetch();
          let counter = 0;
          let pickingEnd = '';
          const listResult = [];
          result.forEach((element)  => {
               listResult[counter] =  element.supplyAreas;
               counter++;
            });
            listResult[0].forEach((element) => {
                if(typeof element.pickingEnd !== 'undefined') {
                    let area = element._id;
                    let picker = element.pickerStart;
                    let pickingStart = element.pickingStart;
                    let pickingEnd;
                    let pickingDuration = ((pickingEnd - pickingStart) / 60000).toFixed(0);
                    console.log(picker, ' need for Area ', area, pickingDuration, ' minutes')
                }
            });
        },



//------------------------------------------------------ Admin section --------------------------------------------------------------------
        'submitToDo': function(toDoText, dateNow, needDate, toDoUser) {
            const toDoStatus = 0;
            const clearDate = 0;
            CommissionToDoMesssage.insert({toDoText, dateNow, needDate, clearDate, toDoUser, toDoStatus});
        },

        'setToDo': (inProcessItem, status) => {
            if(status === 0) {
                CommissionToDoMesssage.update({_id: inProcessItem}, {$set: {toDoStatus: status}});
            } else if(status === 1) {
                CommissionToDoMesssage.update({_id: inProcessItem}, {$set: {toDoStatus: status}});
            } else if(status === 2) {
                let dateNow = moment().format('L');
                CommissionToDoMesssage.update({_id: inProcessItem}, {$set: {toDoStatus: status, clearDate: dateNow}});
            } else if(status === 3) {
                CommissionToDoMesssage.update({_id: inProcessItem}, {$set: {toDoStatus: 1, clearDate: 're-opened'}});
            }
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

    function pickerInfo(supply, Areas) {
        console.log(Areas);
        let result = supply._id === 'L4MSB20';
        console.log('result : ', result);
        return result
    }


    /*

function serverPickingResult(machineId, pickingArea, arrayIndex) {
    const result = machineCommTable.findOne({_id: machineId},
        {"supplyAreas.supplyArea" : pickingArea});
    const pickersChoice = result.supplyAreas[arrayIndex];
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





