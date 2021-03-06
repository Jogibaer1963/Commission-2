import {Meteor} from "meteor/meteor";
/*
import {unix} from "moment";

 */

if(Meteor.isServer){

    Meteor.startup( function() {

        Meteor.publish("usersProfile", function() {
            return usersProfile.find();
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

        Meteor.publish("fiscalYear", function () {
            return fiscalYear.find();
        });

        Meteor.publish("assemblyLineBay", function () {
            return assemblyLineBay.find();
        });

        Meteor.publish("activeAssembly", function () {
            return activeAssembly.find();
        });

        Meteor.publish("userActions", function () {
            return userActions.find();
        });

    });


    Meteor.methods({

        'updateTactTime': (percent) => {
          //  let timeLeft =
            activeAssembly.update({_id: 'team-1'}, {$set: {'tactTimeLeft' : percent }})
        },

        'tactTime': (tact_time) => {
            console.log(tact_time)
        },

        'leaveLine': (machineId, canvasId, user) => {
            let movingTime = moment().format('YYYY-MM-DD HH:mm:ss');
            let todayUnix = (Date.now()).toFixed(0);
            machineCommTable.update({_id: machineId, 'bayReady._id': canvasId},
                {$set: {
                        'bayReady.$.bayDateLeavingUnix': todayUnix,
                        'bayReady.$.bayDateLeaving': movingTime,
                        'bayReady.$.completeBy': user,
                        'bayReady.$.bayStatus' : 1,
                        'activeInBay' : false
                    }
                });
            activeAssembly.update({_id : canvasId},
                {$pull: {bayArray: {machineId: machineId}}})
        },

        'moveMachineToNextBay': (machineId, machineNr, user, thisBay, nextBayId, boolean) => {
           // let clearBay = [];
            let bayArray = [];
            let movingTime = moment().format('YYYY-MM-DD HH:mm:ss');
            let todayUnix = (Date.now()).toFixed(0);

            machineCommTable.update({_id: machineId, 'bayReady._id': thisBay},
                {$set: {
                        'bayReady.$.bayDateLeavingUnix': todayUnix,
                        'bayReady.$.bayDateLeaving': movingTime,
                        'bayReady.$.completeBy': user,
                        'bayReady.$.bayStatus' : 1
                    }
                });

            machineCommTable.update({_id: machineId, 'bayReady._id': nextBayId},
               {$set: {
                       'bayReady.$.bayStatus' : 2,
                       'bayReady.$.bayDateLanding': movingTime,
                       'bayReady.$.bayDateLandingUnix': todayUnix,
                   }
               });
            // ****** check if Bay contains 2 Machines
            if (boolean === true) {
         //       console.log(boolean)
                // 2 Machines in Bay, move first machine
                let result = activeAssembly.findOne({_id: thisBay});
                let pullMachineId = result.bayArray[0].machineId  // Id to be pulled out of array
          //      console.log('Pulled Machine ', pullMachineId)

                activeAssembly.update({_id : thisBay},
                    {$pull: {bayArray: {machineId: pullMachineId}}})  // remove Machine

                // write machine info into next bay
          //      console.log('neu in next bay ', machineNr)
                let  machineInfo = {
                    machineId : machineId,
                    machineNr : machineNr,
                    bayDateLanding : movingTime,
                    bayDateLandingUnix : todayUnix,
                }
                bayArray.push(machineInfo)
                activeAssembly.update({_id : nextBayId},
                                      {$push: {bayArray: machineInfo}})

            } else if (boolean === false) {
              //  console.log(boolean)
                let  machineInfo = {
                    machineId : machineId,
                    machineNr : machineNr,
                    bayDateLanding : movingTime,
                    bayDateLandingUnix : todayUnix,
                }
                bayArray.push(machineInfo)
                let result = activeAssembly.findOne({_id: thisBay});
                let pullMachineId = result.bayArray[0].machineId  // Id to be pulled out of array
             //   console.log('Pulled Machine ', pullMachineId)

                activeAssembly.update({_id : thisBay},
                    {$pull: {bayArray: {machineId: pullMachineId}}})  // remove Machine
                activeAssembly.update({_id : nextBayId},  {$push: {bayArray: machineInfo}})
            }

            // **********  count time in Bay spent ****************


        },


        // ****************** move from list to FCB Bay ********************

        'moveFromListToFCB_Bay': (selectedMachine, machineNr, canvasId) => {
            let bayArray = [];
            let today = moment().format('YYYY-MM-DD HH:mm:ss ');
            let todayUnix = (Date.now()).toFixed(0); // milliseconds
            machineCommTable.update({_id: selectedMachine, 'bayReady._id': canvasId},
                                    {$set: {
                                        'activeAssemblyLineList' : false,
                                        'activeInBay' : true,
                                        'bayReady.$.bayDateLanding': today,
                                        'bayReady.$.bayDateLandingUnix': todayUnix,
                                        'bayReady.$.bayStatus' : 2
                                        }});
          let  machineInfo = {
                machineId : selectedMachine,
                machineNr : machineNr,
                bayDateLanding : today,
                bayDateLandingUnix : todayUnix,
            }
            bayArray.push(machineInfo)
            // **************   add machine to active assembly Line  ****************
            activeAssembly.upsert({_id : canvasId}, {$set: {
                          bayArray
                }})
        },

        //--------------  Update Machine List with in Line and off Line Date  --------------

        'updateMachineInLine': (contents) => {
            let supplyResult = supplyAreas.find({active: true},
                {sort: {supplyPosition: 1}}).fetch();
            let timeLine = {};
            let countFind = [];
            let today, countMax, firstMachine, machineStartUpdate, arr, i, newElement, sliceIndex,
                 counter, indexCounter, slicedElement, result, inLineDate,newMachine;
            today = moment().format('YYYY-MM-DD');

            //  ******************************  Update Machine List **************************************

            // find machine closest to the most finished commission Machine, collecting the count number.
            // cut the CSV File above this Machine.

            firstMachine = machineCommTable.find({$and: [{commissionStatus: {$gt: 21}},
                                                                    {active: true},
                                                                    {inLineDate: {$lt: today}}]}).fetch();
                firstMachine.forEach((element) => {
                    if (element.counter === undefined) {
                        countFind.push(1);
                    } else {
                        countFind.push(element.counter);
                    }
                })
            countMax = Math.max(...countFind)
            firstMachine.forEach((element) => {
                if (element.counter === countMax) {
                    machineStartUpdate = element.machineId
                }
            })
            // processing CSV File starts here.
            arr = contents.split(/[\n\r]/g);
            i = 0;
            arr.forEach((element) => {
                    if (element === '') {
                        arr.splice(i, 1);
                    }
                    i++
                })
           newElement = [];
           arr.forEach((element) => {
                   // *********************  important Step  *********************************
                   // Regex search for Machine number pattern like C8900425
                   // add String into a new Array
                   let validStringTest = element.search(/^(C8[7-9][0-9]{5})/g);
                   // *********************  important step end ********************************
                   if (validStringTest === 0) {
                       newElement.push(element)
                   }
               })
           sliceIndex = 0;
           indexCounter = 0;
           counter = countMax;
           // only if the file is updated the following lines are elementary
            newElement.forEach((element) => {
                if (element.indexOf(machineStartUpdate) === 0) {
                    sliceIndex = indexCounter;
                }
                indexCounter++
            })
            // Next step : CSV file is shortened to the remaining Machines. slice Index is the position in the array of the identified Machine
            slicedElement = newElement.slice(sliceIndex)
            // generate machine list
           slicedElement.forEach((element) => {
               result = element.split(',').map(e => e.split(','));
               // eliminate white spaces behind last column in csv file
               result.splice(32, 8);
               inLineDate = moment(new Date(result[6][0])).format('YYYY-MM-DD');
                   newMachine = result[0][0];
                       timeLine = {
                          'machineId': result[0][0],
                          'station1': moment(new Date(result[1][0])).format('YYYY-MM-DD'),
                          'station2': moment(new Date(result[2][0])).format('YYYY-MM-DD'),
                          'station3': moment(new Date(result[3][0])).format('YYYY-MM-DD'),
                          'station4': moment(new Date(result[4][0])).format('YYYY-MM-DD'),
                          'mergeEngine': moment(new Date(result[5][0])).format('YYYY-MM-DD'),
                          'inLine': moment(new Date(result[6][0])).format('YYYY-MM-DD'),
                          'bay3': moment(new Date(result[7][0])).format('YYYY-MM-DD'),
                          'bay4': moment(new Date(result[8][0])).format('YYYY-MM-DD'),
                          'bay5': moment(new Date(result[9][0])).format('YYYY-MM-DD'),
                          'bay6': moment(new Date(result[10][0])).format('YYYY-MM-DD'),
                          'bay7': moment(new Date(result[11][0])).format('YYYY-MM-DD'),
                          'bay8': moment(new Date(result[12][0])).format('YYYY-MM-DD'),
                          'bay9': moment(new Date(result[13][0])).format('YYYY-MM-DD'),
                          'bay10': moment(new Date(result[14][0])).format('YYYY-MM-DD'),
                          'testBay1': moment(new Date(result[15][0])).format('YYYY-MM-DD'),
                          'testBay2': moment(new Date(result[16][0])).format('YYYY-MM-DD'),
                          'bay14': moment(new Date(result[17][0])).format('YYYY-MM-DD'),
                          'bay15': moment(new Date(result[18][0])).format('YYYY-MM-DD'),
                          'bay16': moment(new Date(result[19][0])).format('YYYY-MM-DD'),
                          'bay17': moment(new Date(result[20][0])).format('YYYY-MM-DD'),
                          'bay18': moment(new Date(result[21][0])).format('YYYY-MM-DD'),
                          'bay19Planned': moment(new Date(result[22][0])).format('YYYY-MM-DD'),
                          'bay19SAP': moment(new Date(result[23][0])).format('YYYY-MM-DD'),
                          'bay19Actual': moment(new Date(result[24][0])).format('YYYY-MM-DD'),
                          'terraTRack' : result[25][0],
                          'fourWheel': result[26][0],
                          'EngineMTU': result[27][0],
                          'bekaMax': result[28][0],
                          'salesOrder': result[29][0],
                          'productionOrder': result[30][0],
                          'sequence': result[31][0]
                      }
                      /*
                      bayReady = [
                          {
                              "_id": "station1",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[1][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "station2",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[2][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "station3",  // cooling box entry
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[3][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "station4",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[4][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "mergeEngine",   // merge cooling box and Engine
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[5][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-fcb-threshing",  // merge FCB with Threshing Unit
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[6][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay3",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[7][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay4",   // merge Engine with Chassis
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[8][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay5",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[9][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay6",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[10][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay7",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[11][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay8",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[12][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay9",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[13][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay10",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[14][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-test-bay-1",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[15][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-test-bay-2",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[16][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-test-bay-3",
                              "bayStatus": 0,
                              "bayDatePlanned": "",
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-test-bay-4",
                              "bayStatus": 0,
                              "bayDatePlanned": "",
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay-14",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[17][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay-15",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[18][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay-16",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[19][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay-17",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[20][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay-18",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[21][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                          {
                              "_id": "machine-field-bay-19",
                              "bayStatus": 0,
                              "bayDatePlanned": moment(new Date(result[22][0])).format('YYYY-MM-DD'),
                              "bayDateLanding": "",
                              "bayDateLeaving": "",
                              "completeBy": "",
                              "completedAt": ""
                          },
                      ]

                       */

                      try {

                          // ****************************************  new machine  *******************************

                          if (typeof machineCommTable.findOne({machineId: newMachine}) === 'undefined') {
                              let today = Date.now();
                              machineCommTable.upsert({machineId: newMachine},
                                  {
                                      $set: {
                                          counter : counter,
                                          inLineDate: inLineDate,
                                          commissionStatus: 0,
                                          dateOfCreation: today,
                                          active: true,
                                          activeAssemblyLineList: true,
                                          timeLine,
                                          supplyAreas : supplyResult
                                      }
                                  });
                              counter ++;
                          } else {

                              // *************** machine already exists and just  update timeline and in line dates  *********************

                              machineCommTable.update({machineId: newMachine},
                                  {
                                      $set: {
                                          counter : counter,
                                          inLineDate: inLineDate,
                                          timeLine,
                                      }
                                  });
                          }
                          counter ++;
                          let id = 'serverHelper';
                          userActions.upsert({_id: id}, {machineCount: counter})
                          // ***********************************************************************************************
                      } catch (e) {
                          console.log(e)
                      }
          });
        },

        'updateNewFiscalYear': (content) => {
            let supplyResult = supplyAreas.find({active: true},
                {sort: {supplyPosition: 1}}).fetch();
            let timeLine = {};
            let arr, i, newElement, counter, result, inLineDate,newMachine;
            arr = content.split(/[\n\r]/g);
            i = 0;
            arr.forEach((element) => {
                if (element === '') {
                    arr.splice(i, 1);
                }
                i++
            })
            newElement = [];
            arr.forEach((element) => {
                // *********************  important Step  *********************************
                // Regex search for Machine number pattern like C8900425
                // add String into a new Array
                let validStringTest = element.search(/^(C8[7-9][0-9]{5})/g);
                // *********************  important step end ********************************
                if (validStringTest === 0) {
                    newElement.push(element)
                }
            })
            // *************** Find last Machine from present year for counting  **************************
            counter = 1000;  // new Fiscal Year start with 1000
            // generate machine list
            newElement.forEach((element) => {
                result = element.split(',').map(e => e.split(','));
                // eliminate white spaces behind last column in csv file
                result.splice(32, 8);
                inLineDate = moment(new Date(result[6][0])).format('YYYY-MM-DD');
                newMachine = result[0][0];
                timeLine = {
                    'machineId': result[0][0],
                    'station1': moment(new Date(result[1][0])).format('YYYY-MM-DD'),
                    'station2': moment(new Date(result[2][0])).format('YYYY-MM-DD'),
                    'station3': moment(new Date(result[3][0])).format('YYYY-MM-DD'),
                    'station4': moment(new Date(result[4][0])).format('YYYY-MM-DD'),
                    'mergeEngine': moment(new Date(result[5][0])).format('YYYY-MM-DD'),
                    'inLine': moment(new Date(result[6][0])).format('YYYY-MM-DD'),
                    'bay3': moment(new Date(result[7][0])).format('YYYY-MM-DD'),
                    'bay4': moment(new Date(result[8][0])).format('YYYY-MM-DD'),
                    'bay5': moment(new Date(result[9][0])).format('YYYY-MM-DD'),
                    'bay6': moment(new Date(result[10][0])).format('YYYY-MM-DD'),
                    'bay7': moment(new Date(result[11][0])).format('YYYY-MM-DD'),
                    'bay8': moment(new Date(result[12][0])).format('YYYY-MM-DD'),
                    'bay9': moment(new Date(result[13][0])).format('YYYY-MM-DD'),
                    'bay10': moment(new Date(result[14][0])).format('YYYY-MM-DD'),
                    'testBay1': moment(new Date(result[15][0])).format('YYYY-MM-DD'),
                    'testBay2': moment(new Date(result[16][0])).format('YYYY-MM-DD'),
                    'bay14': moment(new Date(result[17][0])).format('YYYY-MM-DD'),
                    'bay15': moment(new Date(result[18][0])).format('YYYY-MM-DD'),
                    'bay16': moment(new Date(result[19][0])).format('YYYY-MM-DD'),
                    'bay17': moment(new Date(result[20][0])).format('YYYY-MM-DD'),
                    'bay18': moment(new Date(result[21][0])).format('YYYY-MM-DD'),
                    'bay19Planned': moment(new Date(result[22][0])).format('YYYY-MM-DD'),
                    'bay19SAP': moment(new Date(result[23][0])).format('YYYY-MM-DD'),
                    'bay19Actual': moment(new Date(result[24][0])).format('YYYY-MM-DD'),
                    'terraTRack' : result[25][0],
                    'fourWheel': result[26][0],
                    'EngineMTU': result[27][0],
                    'bekaMax': result[28][0],
                    'salesOrder': result[29][0],
                    'productionOrder': result[30][0],
                    'sequence': result[31][0]
                };

                /*

              bayReady = [
                    {
                        "_id": "station1",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[1][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "station2",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[2][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "station3",  // cooling box entry
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[3][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "station4",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[4][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "mergeEngine",   // merge cooling box and Engine
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[5][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-fcb-threshing",  // merge FCB with Threshing Unit
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[6][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay3",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[7][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay4",   // merge Engine with Chassis
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[8][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay5",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[9][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay6",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[10][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay7",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[11][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay8",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[12][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay9",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[13][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay10",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[14][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-test-bay-1",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[15][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-test-bay-2",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[16][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-test-bay-3",
                        "bayStatus": 0,
                        "bayDatePlanned": "",
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-test-bay-4",
                        "bayStatus": 0,
                        "bayDatePlanned": "",
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay-14",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[17][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay-15",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[18][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay-16",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[19][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay-17",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[20][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay-18",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[21][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                    {
                        "_id": "machine-field-bay-19",
                        "bayStatus": 0,
                        "bayDatePlanned": moment(new Date(result[22][0])).format('YYYY-MM-DD'),
                        "bayDateLanding": "",
                        "bayDateLeaving": "",
                        "completeBy": "",
                        "completedAt": ""
                    },
                ]

                 */

                  try {
                      // ****************************************  new machine  *******************************
                      if (typeof machineCommTable.findOne({machineId: newMachine}) === 'undefined') {
                          let today = Date.now();
                          machineCommTable.upsert({machineId: newMachine},
                              {
                                  $set: {
                                      counter : counter,
                                      inLineDate: inLineDate,
                                      commissionStatus: 0,
                                      dateOfCreation: today,
                                      active: true,
                                      activeAssemblyLineList: true,
                                      timeLine,
                                      supplyAreas : supplyResult
                                  }
                              });
                          counter ++;
                      } else {
                          // *************** machine already exists and just  update timeline and in line dates  *********************
                          console.log('Machine ', newMachine, 'counter ', counter)
                          machineCommTable.update({machineId: newMachine},
                              {
                                  $set: {
                                      counter : counter,
                                      inLineDate: inLineDate,
                                      timeLine
                                  }
                              });
                      }
                      counter ++;
                      let id = 'serverHelper';
                      userActions.upsert({_id: id}, {machineCount: counter})
                      // ***********************************************************************************************
                  } catch (e) {
                      console.log(e)
                  }
      });
    },

//---------------------------------------------- New Fiscal Year added -----------------------------

    'fiscalYear': (newYear, newMonth, newDay) => {
        fiscalYear.insert({year: newYear, month: newMonth, day: newDay});
    },

//----------------------------------------------- New and updating Supply Area -----------------------------------------------------------------------
    'addSupplyArea': (area) => {
        let supplyCount = (supplyAreas.find().fetch()).length;
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
                                supplyPosition: supplyCount + 1,
                                active: true,
                                supplyStatus: supplyStatus
        });
        let object = {_id: area,
                      supplyPosition: parseInt(supplyCount + 1),
                      active: true,
                      supplyStatus: 0
                            };
        try {
            machineCommTable.upsert({}, {$push: {'supplyAreas': object}}, {multi: true});
        } catch (e) {
            console.log(e)
        }
    },

    // ****     physical database for supplyAreaArray is 01_supplyAreaArray     ****


// Adding and removing Machine, filling the database machineCommTable with pre sets
/*   ** Adding Machines deactivated for now **
    'doubleMachine': (newMachine, inLineDate, dateOfCreation) => {

        if(typeof machineCommTable.findOne({machineId: newMachine}) === 'undefined') {
         //   console.log("inside", newMachine, dateOfCreation, inLineDate);
            machineCommTable.insert({machineId: newMachine,
                inLineDate: inLineDate,
                dateOfCreation: dateOfCreation,
                commissionStatus: 0,
                active: true});

            supplyAreas.find({active: true},
                               {sort: {supplyPosition: 1}}).
                            forEach(function(copy) {
                                    machineCommTable.update({machineId: newMachine},
                                                            {$addToSet: {supplyAreas: (copy)}})
            });
        } else {
            return newMachine;
        }
    },

*/

        'deactivateMachine': (machineCompleted) => {
            machineCommTable.update({machineId: machineCompleted}, {$set: {active: false}});

        },

        'removeCommMachine': function (removeMachine) {
            machineCommTable.remove({_id: removeMachine});
        },

        'deactivateArea': function (area) {
            supplyAreas.update({_id: area}, {$set: {active: false}});
            machineCommTable.update({"supplyAreas._id": area},
                                {$set: {"supplyAreas.$.active": false}}, {multi: true});
        },

        'reactivateArea': function (area) {
            supplyAreas.update({_id: area}, {$set: {active: true}});
            machineCommTable.update({"supplyAreas._id": area},
                {$set: {'supplyAreas.$.active': true}}, {multi: true});
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
            let pickingString = pickingToDay();
            /*
            let checkDoubleEntry = pickers.find({_id: user});
            */
           // console.log(pickingString);
            let dateEndNow = moment().format('MMMM Do YYYY, h:mm:ss a');
            let pickingTime = moment().format('M D')
            let pickingEndTime = Date.now();
            pickersAtWork.remove({_id: user});
            machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                {
                    $set: {
                        "supplyAreas.$.supplyStatus": status,
                        "supplyAreas.$.pickerFinished": user,
                        "supplyAreas.$.pickerEnd": pickingEndTime,
                        "supplyAreas.$.pickingEndDateAndTime": dateEndNow,
                        "supplyAreas.$.pickingTime": pickingTime
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
            let pauseStart = pickersResult.pickingPauseStart;
            let pauseEnd = pickersResult.pickingPauseEnd;
            if (!pauseEnd) {
                pauseStart = 1;
                pauseEnd = 1;
            }
            let pickingDuration = (pickersResult.pickerEnd - pickersResult.pickingStart) -
                (pauseEnd - pauseStart);
            let pickingDateAndTime = pickersResult.pickingEndDateAndTime;
            let duration = parseInt(pickingDuration);

            let pickingObj =  {
                machine: machineId,
                supplyArea: pickedSupplyAreaId,
                pickingTime: pickingEndTime,
                duration: duration,
                date: pickingDateAndTime,
                multi: false
            };
            pickers.update({_id: user, }, {$addToSet: {[pickingString]: pickingObj}});
            return 'success';
        },

        'canceledPicking': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            pickersAtWork.remove({_id: user});
            machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                {$set: {"supplyAreas.$.supplyStatus": status,
                        "supplyAreas.$.pickerCanceled": user,
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

        //**************************   Multi Machines  ******************************

        'canceledMultiPicking': function (userCanceled, pickedMachineId, pickedSupplyAreaId) {
            let status = 0;
            pickedMachineId.forEach((element) => {
                machineCommTable.update({machineId: element, "supplyAreas._id": pickedSupplyAreaId},
                    {$set: {"supplyAreas.$.supplyStatus": status,
                            "supplyAreas.$.pickerCanceled": userCanceled,
                            "supplyAreas.$.pickingStart": '',
                            "supplyAreas.$.pickerStart": '',
                            "supplyAreas.$.pickerFinished": '',
                            "supplyAreas.$.pickingDateAndTime": '',
                            "supplyAreas.$.pickingEnd": '',
                            "supplyAreas.$.pickingTime": '',
                            "supplyAreas.$.pickingEndDateAndTime": '',
                            "supplyAreas.$.pickingPauseStart": '',
                            "supplyAreas.$.pickingPauseEnd": ''}} )
            });
            pickersAtWork.remove({_id: userCanceled});
        },

        'quickRemove': function (userCanceled) {
            pickersAtWork.remove({_id: userCanceled});
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
            let supplyArray7 = [];
            let supplyArray8 = [];
            let supplyArray9 = [];
            let newSet = [];
            let newObjectSet = [];
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

            let arr1 = Object.values(countedNames);
         //   console.log('Array 1 ', arr1);
            let key = Object.keys(countedNames);
            let max = Math.max(...arr1);
            let i = 0;

            // create array with available areas and store it in pickersATWork

            arr1.forEach((element) => {
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
            let pickingTime = moment().format('M D');

            pickersResult.machines.forEach((element) => {

                machineCommTable.update({machineId: element, "supplyAreas._id": pickedSupplyAreaId},
                    {$set: {"supplyAreas.$.supplyStatus": status,
                            "supplyAreas.$.pickerFinished": user,
                            "supplyAreas.$.pickingEnd": pickingEnd,
                            "supplyAreas.$.pickingEndDateAndTime": dateEndNow,
                            "supplyAreas.$.pickingTime": pickingTime
                        }});

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
            pickersAtWork.remove({_id: user});

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

        /* ---- all carts from 1 specific day  ---- */

        'chosenDate': (dateString, picker) => {
            let result = pickers.find({_id: picker}).fetch();
            let daySupply = [];
            let dayDuration = [];
            let durationGraph = [];
            let counter = [];
            let searchResult = 0;
            let pickersDate = result[0][dateString];
            try {
            pickersDate.forEach((element) => {
               daySupply.push(element.supplyArea);
                searchResult = 1;
            });
            } catch(e) {
               // console.log('error in loop');
                searchResult = 0;
            }
            let uniqueSupply = daySupply.filter((x, i, a) => a.indexOf(x) === i);
            uniqueSupply.forEach((element) => {
                let i = 0;
                pickersDate.forEach((element2) => {
                    if (element === element2.supplyArea) {
                        dayDuration.push(element2.duration);
                        i++
                    } else {
                    }
                });
                let averageDuration = ((dayDuration.reduce((a,b) => a + b, 0) / dayDuration.length) / 60000).toFixed(0);
                counter.push(i);
                durationGraph.push(parseInt(averageDuration));
               dayDuration = [];
                i = 0;
            });
            if(searchResult === 1) {
                return [uniqueSupply, durationGraph, counter];
            } else {
              //  console.log('Nothing picked at this Date');
                return 'Nothing picked at this Date';
            }

        },

        'chosenMonth': (month, picker) => {
           let transferResult = [];
           // Array's for return result
           let pickingTime = [];
           let supplyArea = [];
           let duration = [];
           let counter = [];
           let totalDuration = [];
           let durationGraph = [];
           // building the month string and get days per month
           let chosenYear = month.slice(0, 4);
           let chosenMonth = month.slice(5, 7);
           let dayMax = getDaysInMonth(chosenMonth, chosenYear);
           // order is YYYY-MM-DD
           let minDate = (chosenYear + '-' + chosenMonth + '-' + '01').toString();
           let maxDate =  (chosenYear + '-' + chosenMonth + '-' + dayMax).toString();
           /* ToDo why the Unix Correction  */
           let unixMinDate = new Date(minDate).getTime() + 20000000;
           let unixMaxDate = new Date(maxDate).getTime() + 104300000;
        //   console.log(moment(unixMinDate).format('DD-MM-YYYY HH:mm'));
         //  console.log(moment(unixMaxDate).format('DD-MM-YYYY HH:mm'));
            let dateMin = parseUnixToDate(unixMinDate);
            let dateMax = parseUnixToDate(unixMaxDate);
           let result = pickers.findOne({_id: picker});
            try {
                delete result._id;
                delete result.active;
            }
            catch (e) {
            }
           let objResult = Object.keys(result);

            objResult.forEach((element) => {
                if (element >= dateMin && element <= dateMax) {
                    transferResult.push(result[element])
                }
            });
            let mergedArray = [].concat.apply([], transferResult);
            mergedArray.sort((a,b) => (a.pickingTime > b.pickingTime) ? 1 :
                                                    (b.pickingTime > a.pickingTime) ? -1 : 0);
            mergedArray.forEach((element) => {
                supplyArea.push(element.supplyArea);
                duration.push(element.duration);
            })
            let uniqueSupply = supplyArea.filter((x, i, a) => a.indexOf(x) === i);
            uniqueSupply.forEach((element) => {
                let i = 0;
                mergedArray.forEach((element2) => {
                    if (element === element2.supplyArea) {
                        totalDuration.push(element2.duration);
                        i++;
                    }
                });
                let averageDuration = ((totalDuration.reduce((a, b) => a + b, 0) / totalDuration.length) / 60000).toFixed(0);
                counter.push(i);
                durationGraph.push(parseInt(averageDuration));
                totalDuration = [];
                i = 0;
            })
            let monthSupply = supplyArea.length;
          //  console.log(monthSupply, duration, counter, uniqueSupply, durationGraph)
            return [monthSupply, duration, counter, uniqueSupply, durationGraph];

        },

        /* ----------- select a date range to see the picker results --------------- */

        'chosenRange': function(dateX, dateY, picker) {
            /*  ToDo why do i need a correction to unix time dateX and dateY  */
         dateX = dateX + 20000000;
         //   console.log(moment(dateX).format('DD-MM-YYYY HH:mm'));
         let dateA = parseUnixToDate(dateX);
         dateX = dateY + 17990000;
         //   console.log(moment(dateX).format('DD-MM-YYYY HH:mm'));
         let dateB = parseUnixToDate(dateX);
         let transferResult = [];
            // Arrays for result send to client
            let supplyArea = [];
            let totalDuration = [];
            let counter = [];
            let durationGraph = [];
            // load complete list for specific picker
            let result = pickers.findOne({_id: picker});
            try {
                delete result._id;
                delete result.active;
            }
            catch (e) {
            }
            // find keys (containing the wanted data's) for each single picking day and put them into an Array
          //  let mergedArray = [].concat.apply([], arraySummary);
            let objResult = Object.keys(result);
            objResult.forEach((element) => {
                if (element >= dateA && element <= dateB) {
                    transferResult.push(result[element])
                }
                    });
            let mergedArray = [].concat.apply([], transferResult);
            mergedArray.sort((a,b) => (a.pickingTime > b.pickingTime) ? 1 :
                (b.pickingTime > a.pickingTime) ? -1 : 0);
            mergedArray.forEach((element) => {
                supplyArea.push(element.supplyArea);
            })
            // extract unique supply Areas served during dateX & dateY
            let uniqueSupply = supplyArea.filter((x, i, a) => a.indexOf(x) === i);
            uniqueSupply.forEach((element) => {
                let i = 0;
                mergedArray.forEach((element2) => {
                        if (element === element2.supplyArea) {
                            totalDuration.push(element2.duration);
                            i++;
                        }
                });
                let averageDuration = ((totalDuration.reduce((a, b) => a + b, 0) / totalDuration.length) / 60000).toFixed(0);
                counter.push(i);
                durationGraph.push(parseInt(averageDuration));
                totalDuration = [];
                i = 0;
            })
          //  console.log(counter, uniqueSupply, durationGraph)
            return [counter, uniqueSupply, durationGraph];
        },

        /* -----------------------------   fisacl year result  --------------------- */

        'selectedAreaAnalysis': function (area, picker, newFiscalYear) {
            let arraySummary = [];
            let result = pickers.findOne({_id: picker});
            try {
                delete result._id;
                delete result.active;
            }
            catch (e) {
            }
            try {
                let resultObj = Object.keys(result);
                if (newFiscalYear === "2020") {
                    newFiscalYear = "2020090401"
                    let  oldFiscalYear = "2019090401"
                    resultObj.forEach((element) => {
                        if (element >= oldFiscalYear && element <= newFiscalYear) {
                            arraySummary.push(result[element]);
                        }
                    });
                } else if (newFiscalYear === "2021") {
                    newFiscalYear = "2020090401"
                    resultObj.forEach((element) => {
                        if (element >= newFiscalYear) {
                            arraySummary.push(result[element]);
                        }
                    });
                }
            } catch (e) {
            }
           // console.log(arraySummary);
            let mergedArray = [].concat.apply([], arraySummary);
            let oneArray = [];
            let objectResult = {};
            mergedArray.forEach((element) => {
                   if (area === element.supplyArea) {
                       let duration = (element.duration / 60000).toFixed(0);
                       objectResult = {duration: duration,
                                       machine: element.machine,
                                       pickingTime: element.pickingTime,
                                        supply: element.supplyArea,
                                       };
                       oneArray.push(objectResult);
                   }
            });
            oneArray.sort((a,b) => a.pickingTime - b.pickingTime);

            return oneArray;
        },

        /* -------  change the Time in a specific Supply area to a specific Machine  --------- */

        'changeTime': (picker, machine, area, inputResult, objectKey) => {
            let date = new Date(objectKey);
            let year = (date.getFullYear()).toString();
            let month = (date.getMonth()).toString();
            let day = (date.getDate()).toString();
            let weekDay = (date.getDay()).toString();
            if (month.length === 1) {
                month = '0' + month;
            }
            if (day.length === 1) {
                day = '0' + day;
            }
                weekDay = '0' + weekDay;
            objectKey = year + month + day + weekDay;
            let result = pickers.findOne({_id: picker})[objectKey];
            result.forEach((element) => {
                if (element.supplyArea === area && element.machine === machine) {
                    element.duration = inputResult * 60000;
                }
            });
           pickers.update({_id: picker}, {$set: {[objectKey]: result}});
           return 'updated successfully'
        },
//------------------------------------------------------ Admin section --------------------------------------------------------------------
       'pickerActive': (pickerId, status) => {
           pickers.update({_id: pickerId}, {$set: {active: status}});
       },

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

        'userManualLogout': function (logOutUser) {
            for ( let i = 0; i < logOutUser.length; i++) {
                const userName = usersProfile.findOne({_id: logOutUser[i]}).username;
                Meteor.users.update({username: userName}, {$set: {'services.resume.loginTokens': []}});
                usersProfile.upsert({username: userName}, {$set: {loginStatus: 0}});
            }
        },

        'userManualDelete': function (deleteUser) {
            for (let i = 0; i < deleteUser.length; i++) {
                const userName = usersProfile.findOne({_id: deleteUser[i]}).username;
                Meteor.users.remove({username: userName});
                usersProfile.remove({username: userName});
            }
        },

        'newUser' : function (userConst, passwordConst, role,  createdAt, loggedUser) {
            Accounts.createUser({username: userConst, password: passwordConst});
            setTimeout(function () {
            }, 1000);
            Meteor.users.upsert({username:userConst}, {$addToSet: {roles: role}});
            usersProfile.insert({username: userConst, role: role, createdAt: createdAt,
                createdBy: loggedUser, loginStatus: 0});
        },

 //-----------------------------------------------------  Assembly Line ---------------------------------------------------------

        'addBay' : function (newBay) {
              assemblyLineBay.insert( {bay: newBay})
        },


//-------------------------------------------------------- Supply Areas -----------------------------------------------------------------------

    });

    // physical database is 09_userAction
    /*
     function userUpdate (loggedUser, action)  {
        let timeStamp = Date.now();
        userActions.insert({user: loggedUser, action: action, timeStamp: timeStamp});
      }

     */

    function pickingToDay () {
        let today = Date.now();
        let timeResult = new Date(today);
        let pickingMonth = timeResult.getMonth();
            if (pickingMonth === 0) {
                pickingMonth = '00';
            }
        if (pickingMonth < 10 ) {
            pickingMonth = ("0" + timeResult.getMonth()).toString();
        }
        if (pickingMonth >= 10) {
            pickingMonth = (timeResult.getMonth()).toString();
        }
        let pickingDate = (timeResult.getDate()).toString();
        if (pickingDate < 10) {
            pickingDate = ("0" + timeResult.getDate()).toString()
        }
        let pickingDay = ("0" + timeResult.getDay()).toString() ;
        let pickingYear = (timeResult.getFullYear()).toString();
        // Format YYYY, 00 - 11, 01-31, 00-06,
        return (pickingYear + pickingMonth + pickingDate + pickingDay)
    }

    function getDaysInMonth(month, year) {
        return new Date (year, month, 0).getDate()
    }

    function parseUnixToDate(dateX) {
        let date = new Date(dateX);
        let year = (date.getFullYear()).toString();
        let month = (date.getMonth()).toString();
        let day = (date.getDate()).toString();
        let weekDay = (date.getDay()).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        if (day.length === 1) {
            day = '0' + day;
        }
        weekDay = '0' + weekDay;
        return (year + month + day + weekDay);
    }

}




