import { Random } from 'meteor/random'



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

        'startPicking': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            let dateStartNow = moment().format('MMMM Do YYYY, h:mm:ss a' );
            let pickingStart = Date.now();
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

        'finishedPicking': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            let dateEndNow = moment().format('MMMM Do YYYY, h:mm:ss a');
            let pickingEndTime = Date.now();
            pickersAtWork.remove({_id: user});
            machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                {
                    $set: {
                        "supplyAreas.$.supplyStatus": status,
                        "supplyAreas.$.pickerFinished": user,
                        "supplyAreas.$.pickerEnd": pickingEndTime,
                        "supplyAreas.$.pickingEndDateAndTime": dateEndNow
                    }
                },
            );
            machineCommTable.update({_id: pickedMachineId}, {$inc: {commissionStatus: 1}});

            const result = machineCommTable.findOne({_id: pickedMachineId});
            let machineId = result.machineId;
            let pickersArea = result.supplyAreas,
                pickersResult = pickersArea.find((e) => {
                    return e._id === pickedSupplyAreaId;
                });
            let pickingPauseStart = pickersResult.pickingPauseStart;
            let pickingPauseEnd = pickersResult.pickingPauseEnd;
            if (!pickingPauseEnd) {
                pickingPauseStart = 1;
                pickingPauseEnd = 1;
            }
            let pickingDuration = (pickersResult.pickerEnd - pickersResult.pickingStart) -
                (pickingPauseEnd - pickingPauseStart);
            let pickingDateAndTime = pickersResult.pickingEndDateAndTime;
            let duration = parseInt(pickingDuration);
            let pickingString = pickingToDay();
            let pickingObj =  {
                machine: machineId,
                supplyArea: pickedSupplyAreaId,
                pickingTime: pickingEndTime,
                duration: duration,
                date: pickingDateAndTime,
                multi: false
            };
            pickers.update({_id: user, }, {$addToSet: {[pickingString]: pickingObj}});
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

        'pausePickingStart': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            let pickingPauseStart = Date.now();
             pickersAtWork.upsert({_id: user}, {$set: {inActive: 2}});
             machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                                    {$set: {"supplyAreas.$.supplyStatus": status,
                                        "supplyAreas.$.pickingPauseStart": pickingPauseStart }})

        },

        'pausePickingEnd': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            let pickingPauseEnd = Date.now();
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
                                 {$set: { multi: true,
                                                 machines: machineIds,
                                                 supplySet: newObjectSet}})
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

            let supplySet = [{_id: pickedSupplyAreaId, supplyStatus: 2}];
            pickersAtWork.upsert({_id: user},
                                {machines: pickedMachines,
                                         inActive: 1,
                                         multi: true,
                                         supplySet: supplySet});

            let findPicker = pickers.find().fetch();
            let result = findPicker.find(picker => picker._id === user);
            if(typeof result === 'undefined') {
                pickers.insert({_id: user});
            }
        },


        'multi-finished': (pickedMachines, pickedSupplyAreaId, status, user, dateEndNow, pickingEnd) => {

            let machineNumbers = pickedMachines.length;
            let pickersResult = pickersAtWork.findOne({_id: user});
            pickersAtWork.remove({_id: user});

            pickersResult.machines.forEach((element) => {

                machineCommTable.update({machineId: element, "supplyAreas._id": pickedSupplyAreaId},
                    {$set: {"supplyAreas.$.supplyStatus": status,
                            "supplyAreas.$.pickerFinished": user,
                            "supplyAreas.$.pickingEnd": pickingEnd,
                            "supplyAreas.$.pickingEndDateAndTime": dateEndNow}});

                machineCommTable.update({machineId: element}, {$inc: {commissionStatus: 1}});

            });

                const result = machineCommTable.findOne({machineId: pickedMachines[0]});

                let pickersArea = result.supplyAreas,
                    pickersStorage =  pickersArea.find((e) => {
                        return e._id === pickedSupplyAreaId;
                    });

                let pickingPauseStart = pickersStorage.pickingPauseStart;
                let pickingPauseEnd = pickersStorage.pickingPauseEnd;
                if(!pickingPauseEnd) {
                    pickingPauseStart = 0;
                    pickingPauseEnd = 0;
                }
                let pickingDuration = (pickingEnd - pickersStorage.pickingStart -
                                        (pickingPauseEnd - pickingPauseStart));
                let pickingDateAndTime = pickersStorage.pickingEndDateAndTime;
                let durationCalc = pickingDuration / machineNumbers;
                let duration = parseInt(durationCalc);
                let timeNow = (Date.now()/1000).toFixed(0);
                let pickingString = pickingToDay();
                pickedMachines.forEach((element) => {
                    let resultObj =  {machine: element,
                        supplyArea: pickedSupplyAreaId,
                        pickingTime: timeNow,
                        duration: duration,
                        date: pickingDateAndTime,
                        multi: true};
                     pickers.update({_id: user}, {$addToSet: {[pickingString]: resultObj}});
                });

        },

        'multi-pause': (pickedMachines, pickedSupplyAreaId, status, pickingPauseStart, user) => {
            
                 pickersAtWork.upsert({_id: user}, {$set: {inActive: 2}});

                 pickedMachines.forEach((element) => {
                     machineCommTable.update({machineId: element, "supplyAreas._id": pickedSupplyAreaId},
                         {$set: {"supplyAreas.$.supplyStatus": status,
                                 "supplyAreas.$.pickingPauseStart": pickingPauseStart }})
                 });
        },

        'multi-resume': (pickedMachines, pickedSupplyAreaId, status, pickingPauseEnd, user) => {
            pickersAtWork.upsert({_id: user}, {$set: {inActive: 3}});

            pickedMachines.forEach((element) => {
                machineCommTable.update({machineId: element, "supplyAreas._id": pickedSupplyAreaId},
                    {
                        $set: {
                            "supplyAreas.$.supplyStatus": status,
                            "supplyAreas.$.pickingPauseEnd": pickingPauseEnd}});
            });
        },

        'multi-cancel': () => {

            /*
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
             */
        },

//------------------------------------------------  Data Analyzing ----------------------------------------------------------------------

        'pickerReturn': (_id) => {

            // -----------------  Today's date  ---------------------
            let pickingString = pickingToDay();

            // -------------------  Return Overview  ----------------------------

            // picked today
            let todaysArray = [];
            let result =  pickers.findOne({_id: _id});
            let objectArray = Object.keys(result);
                objectArray.forEach((element) => {
                    if (element === '_id') {
                    } else {
                            if (element === pickingString) {
                                result[pickingString].forEach((element2) => {
                                todaysArray.push(
                                    element2.supplyArea,
                                );
                                });
                            } else {
                           //     console.log('today not detected');
                            }
                    }
                });
            let uniqueAreas = todaysArray.filter((x, i, a) => a.indexOf(x) === i);
            let newElement = [];
            uniqueAreas.forEach((element) => {
                newElement.push({_id: element});
            });
            return newElement;
        },

        'getData': (selectedArea, picker) => {
            let pickingDate = pickingToDay();
            let areasCount = [];
            let dateArray = [];
            let returnArray = [];
            let timestamp = [];
            let result =  pickers.findOne({_id: picker}, {fields: {[pickingDate]: 1}});

            let objectArray = Object.keys(result);
            objectArray.forEach((element) => {
                if (element === '_id') {
                    //     console.log('_id detected');
                } else {
                    let resultObject = result[element];
                    areasCount.push(resultObject.length);
                    resultObject.forEach((element2) => {
                     //   console.log(element2.supplyArea);
                        if (element2.supplyArea === selectedArea) {
                            // collecting duration
                            dateArray.push(((element2.duration) / 60000).toFixed(0));
                            // collecting picking time
                            let timeCollect = moment.unix((element2.pickingTime)/1000);
                            timestamp.push(timeCollect.format("HH:mm"));
                        }

                    });
                }
            });
            returnArray.push(areasCount, dateArray, timestamp);
            return returnArray;

        },

        'chosenMonth': (trueMonth, picker) => {
            let result = pickers.find({_id: picker}).fetch();
            let monthResult = result[0];
            let objResult = Object.keys(result[0]);
            objResult.pop();
            let monthRange = [];
            let arraySumm = [];
            objResult.forEach((element) => {
                if (element.slice(4) === trueMonth) {
                    monthRange.push(element);
                }
            });
            monthRange.forEach((element) => {
               arraySumm.push(monthResult[element]);
            });
            let objectSumm = [];
            for (let i = 0; i <= arraySumm.length - 1; i++) {
                arraySumm[i].forEach((element) => {
                    objectSumm.push(element);
                })
            }
            let supplySumm = [];
           objectSumm.forEach((element) => {
               supplySumm.push(element.supplyArea)
           });
            let totalDuration = [];
            let durationGraph = [];
            let counter = [];
           let uniqueSupply = supplySumm.filter((x, i, a) => a.indexOf(x) === i);
         //   console.log(uniqueSupply);

            uniqueSupply.forEach((element) => {
                //  console.log(element);
                let i = 1;
                objectSumm.forEach((element2) => {
                    try {
                        if (element === element2.supplyArea) {
                            //  console.log(element, element2.duration);
                            totalDuration.push(element2.duration);
                            i++
                            //  console.log(totalDuration);
                        } else {
                            //       console.log('else')
                        }
                    } catch(e) {
                    }
                });

                let averageDuration = ((totalDuration.reduce((a,b) => a + b, 0) / totalDuration.length) / 60000).toFixed(0);
                counter.push(i);
                durationGraph.push(parseInt(averageDuration));
                totalDuration = [];
                i = 1;
            });
            console.log(uniqueSupply, durationGraph, counter);
            let returnArray = [];
            returnArray.push(uniqueSupply, durationGraph, counter);

            return returnArray;
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

    // physical database is 09_userAction
     function userUpdate (loggedUser, action)  {
        let timeStamp = Date.now();
        userActions.insert({user: loggedUser, action: action, timeStamp: timeStamp});
      }

    function pickingToDay (dateString) {
        let today = Date.now();
        let timeResult = new Date(today);
        let pickingMonth = timeResult.getMonth();
        let pickingDate = timeResult.getDate();
        if (pickingDate < 10) {
            pickingDate = "0" + timeResult.getDate()
        }
        let pickingDay = "0" + timeResult.getDay() ;
        let pickingYear = timeResult.getFullYear();
        return (pickingDate + pickingDay + pickingMonth + pickingYear);
    }

}




