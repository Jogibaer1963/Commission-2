import {Meteor} from "meteor/meteor";
/*
import {unix} from "moment";

 */

if(Meteor.isServer){

    Meteor.startup( () => {

        Meteor.publish("usersProfile", () => {
            return usersProfile.find();
        });

        Meteor.publish("CommissionToDoMessage", () => {
            return CommissionToDoMesssage.find();
        });

        Meteor.publish("supplyAreas", () => {
            return supplyAreas.find();
        });

        Meteor.publish("machineCommTable", () => {
            return machineCommTable.find();
        });

        Meteor.publish("pickersAtWork", () => {
            return pickersAtWork.find();
        });

        Meteor.publish("pickers", () => {
            return pickers.find();
        });

        Meteor.publish("fiscalYear", () => {
            return fiscalYear.find();
        });

        Meteor.publish("activeAssembly", () => {
            return activeAssembly.find();
        });

        Meteor.publish("userActions", () => {
            return userActions.find();
        });

        Meteor.publish('assemblySchedule', () => {
            return assemblySchedule.find();
        })

        Meteor.publish('scheduleConfig', () => {
            return scheduleConfig.find();
        })

        Meteor.publish('assemblyTech', () => {
            return assemblyTech.find();
        })

        Meteor.publish('pickingNewHead', () => {
            return pickingNewHead.find();
        })
/*
        Meteor.publish('machineReadyToGo', () => {
            return machineReadyToGo.find();
        })

 */

        Meteor.publish('lineOrders', () => {
            return (lineOrders.find());
        })

    });


    Meteor.methods({
/*
        'specialFunction': () => {
         console.log('function started');
            let closedOrders = lineOrders.find({status: 0})
            closedOrders.forEach((element) => {
                console.log(element)
                lineOrders.update({_id: 'open_orders'}, {$set: {element}})
            })

           console.log('Function finished');
        },

 */

        'team_leads_repairs':(team ,comment, tech, id, machine) => {
            // id = _id from repaired Issue, machine = Machine Number, team = Team
            let serverDateTime = new Date().toLocaleString();
            machineReadyToGo.update({machineId: machine, 'newIssues._id': id},
                {$set: {
                        'newIssues.$.repairTech': tech,
                        'newIssues.$.repairComment': comment,
                        'newIssues.$.repairDateTime': serverDateTime,
                        'newIssues.$.repairStatus' : 1
                    }})
        },

        'give_me_team': (team) => {
            let returnArray = []
            let returnObject = {}
          let result = machineReadyToGo.find({$and: [{pdiStatus : 1, repairStatus: 0}]},
              {fields: {machineId: 1, newIssues: 1}}).fetch();
          result.forEach((element) => {
              element.newIssues.forEach((element2) => {
                  if (element2.responsible === team && element2.repairStatus === 0) {
                    //  console.log(element.machineId, element2.responsible, element2.errorDescription)
                      returnObject = {
                         id : element2._id,
                         machine : element.machineId,
                         error : element2.errorDescription,
                         image : element2.pictureLocation,
                          repairComment : element2.repairComment,
                          repairTech : element2.repairTech,
                          repairDateTime : element2.repairDateTime
                      }
                      returnArray.push(returnObject)
                  }
              })
          })
            return returnArray
        },

        'orderList': () => {
            let [orderArray_team_1, orderArray_team_2, orderArray_team_3,
                orderArray_team_4, orderArray_team_5] = [[], [], [], [], []]  ;
            let [t1_dia1, t2_dia1, t3_dia1, t4_dia1, t5_dia1, t1_dia2]= [[], [], [], [], [], []];
            let count_t1_dia1 = {};
            let count_t2_dia1 = {}
            let count_t3_dia1 = {};
            let count_t4_dia1 = {};
            let count_t5_dia1 = {};
            let count_t1_dia2 = {}
            let result, orderObject, openOrder, overAllDuration, pickingStart, reason;
            result = lineOrders.find().fetch();
            result.forEach((element) => {
                if (element.reason === 1) {
                    reason = 'Quality'
                } else if (element.reason === 2) {
                    reason = 'Not on Cart'
                } else if (element.reason === 3) {
                    reason = 'Miss-counting'
                }
                 if (element.status === 0) {
                    pickingStart = 0;
                    openOrder = 0;
                    overAllDuration = 0;
                } else if (element.status === 2) {
                    overAllDuration = ((parseInt(element.unixTimeOrderCompleted) -
                        parseInt(element.unixTimeOrderStart)) / 60000).toFixed(0);
                }
                orderObject = {
                    team : element.team_user,
                    orderStart : element.time_ordered,
                    quantity : element.quantity_needed,
                    partNumber : element.part_number,
                    storage : element.storage_bin,
                    pou : element.point_of_use,
                    reason : reason,
                    urgency : element.urgency,
                    status : element.status,
                    pickingFinished : element.order_completed,
                    overAllDuration :  overAllDuration,
                    picker : element.picked_by
                }
                 if (element.team_user === 'Team 1') {
                     orderArray_team_1.push(orderObject)
                     t1_dia1.push(element.part_number)
                     t1_dia2.push(element.reason)
                 } else if (element.team_user === 'Team 2') {
                     orderArray_team_2.push(orderObject)
                     t2_dia1.push(element.part_number)
                 } else if (element.team_user === 'Team 3') {
                     orderArray_team_3.push(orderObject)
                     t3_dia1.push(element.part_number)
                 } else if (element.team_user === 'Team 4') {
                     orderArray_team_4.push(orderObject)
                     t4_dia1.push(element.part_number)
                 } else if (element.team_user === 'Team 5') {
                     orderArray_team_5.push(orderObject)
                     t5_dia1.push(element.part_number)
                 }
            })
   //  ************************    diagram 1 Array   ********************************
            t1_dia1.forEach(function(i) {count_t1_dia1[i] = (count_t1_dia1[i]||0) + 1;});
            t2_dia1.forEach(function(i) {count_t2_dia1[i] = (count_t2_dia1[i]||0) + 1;});
            t3_dia1.forEach(function(i) {count_t3_dia1[i] = (count_t3_dia1[i]||0) + 1;});
            t4_dia1.forEach(function(i) {count_t4_dia1[i] = (count_t4_dia1[i]||0) + 1;});
            t5_dia1.forEach(function(i) {count_t5_dia1[i] = (count_t5_dia1[i]||0) + 1;});

   //  *************************   diagram 2 Array   ********************************
            t1_dia2.forEach(function(i) {count_t1_dia2[i] = (count_t1_dia2[i] || 0) + 1;});




   //  ********************************  Return Array  ******************************

            return [orderArray_team_1, orderArray_team_2, orderArray_team_3,
                orderArray_team_4, orderArray_team_5, count_t1_dia1, count_t2_dia1,
                count_t3_dia1, count_t4_dia1, count_t5_dia1, count_t1_dia2];


        },

        'success':(result, user, alert) => {
         //   let success = result.slice(0, 7);
        //    console.log('result' , result)
          serverWorker.insert({result: result, user : user, alert: alert})
        },

        'parts_on_order': (user_order, partNumber_order, quantityNeeded_order, storageLocation_order,
                           point_of_use_order, reason_order, urgency_order) => {
            // status : 0 = unseen, 1 = picking in progress, 2 = delivered
            // urgency level : 10 = high urgency, 11 = medium urgency, 12 low urgency
            let reason = parseInt(reason_order);
            let urgency = parseInt(urgency_order)
            let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let order_date, orderStart, year, month, date, hours, minutes, seconds, success, unixOrder;
            unixOrder = Date.now()
            orderStart = new Date()
            year = orderStart.getFullYear();
            month = months[orderStart.getMonth()];
            date = orderStart.getDate();
            hours = orderStart.getHours();
            if (hours < 10) {
                hours = '0' + hours
            }
            minutes = orderStart.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            seconds = orderStart.getSeconds();
            if (seconds < 10) {
                seconds = '0' + seconds
            }
         //   console.log(orderStart, date + '-' + month + '-' + year + ' '+ hours + ':' + minutes + ':' + seconds)
            order_date = (date + '-' + month + '-' + year + ' '+ hours + ':' + minutes + ':' + seconds)
            lineOrders.insert({ team_user : user_order,
                time_ordered  : order_date,
                unixTimeOrderStart : unixOrder,
                part_number : partNumber_order,
                quantity_needed : quantityNeeded_order,
                storage_bin : storageLocation_order,
                point_of_use : point_of_use_order,
                reason : reason,
                urgency : urgency,
                status: 0,
                order_completed : ''})
            success = 'success ' + order_date;
            return success

        },

        'findOpenOrder': (team) => {
            console.log(team)
           let result = lineOrders.find({status: 0, team_user: team}).fetch()
            console.log(result)
            return result
        },

        'pickOrder': (pickOrder, picker) => {
            // start picking process / status 3  from supply Status HandlebarsRegister.js
            let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let order_date, orderStart, orderFinished, year, month, date, hours, minutes, seconds, unixOrderFinished;
            orderFinished = new Date()
            unixOrderFinished = Date.now()
            year = orderFinished.getFullYear();
            month = months[orderFinished.getMonth()];
            date = orderFinished.getDate();
            hours = orderFinished.getHours();
            minutes = orderFinished.getMinutes();
            seconds = orderFinished.getSeconds();
            if (hours < 10) {
                hours = '0' + hours
            }
            minutes = orderFinished.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            seconds = orderFinished.getSeconds();
            if (seconds < 10) {
                seconds = '0' + seconds
            }
            // console.log(orderStart, date + '-' + month + '-' + year + ' '+ hours + ':' + minutes + ':' + seconds)
            order_date = (date + '-' + month + '-' + year + ' '+ hours + ':' + minutes + ':' + seconds)
            lineOrders.update({_id: pickOrder}, {$set: {status: 2,
                                                                         picked_by: picker,
                                                                         order_completed  : order_date,
                                                                   unixTimeOrderCompleted : unixOrderFinished
                                                                        }})
        },

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        'skipSupplyAreas': (selectedMachine, supplyArea) => {
            if (supplyArea === 0) {
                // No supply Area skip complete Machine
                let result =  machineCommTable.findOne({machineId: selectedMachine}, {fields: {supplyAreas: 1}})
                result.supplyAreas.forEach((element) => {
                    if (element.supplyStatus === 4) {
                        // Machine is already blocked, unblock it
                        let supplyArea = element._id
                        machineCommTable.update({machineId: selectedMachine, 'supplyAreas._id': supplyArea},
                            {$set: {'supplyAreas.$.supplyStatus': 0}})
                    } else if (element.supplyStatus === 0) {
                        // Machine is not blocked, block it now
                        let supplyArea = element._id
                        machineCommTable.update({machineId: selectedMachine, 'supplyAreas._id': supplyArea},
                            {$set: {'supplyAreas.$.supplyStatus': 4}})
                    }
                })
            } else {
                let result =  machineCommTable.findOne({machineId: selectedMachine}, {fields: {supplyAreas: 1}})
                // check if single supply Area is already blocked, if so unblock it
                result.supplyAreas.forEach((element) => {
                    if (element._id === supplyArea && element.supplyStatus === 4) {
                        machineCommTable.update({machineId: selectedMachine, 'supplyAreas._id': supplyArea},
                            {$set: {'supplyAreas.$.supplyStatus': 0}})
                    } else if (element._id === supplyArea && element.supplyStatus === 0) {
                        // supply Area is not blocked, block it now
                        machineCommTable.update({machineId: selectedMachine, 'supplyAreas._id': supplyArea},
                            {$set: {'supplyAreas.$.supplyStatus': 4}})
                    }
                })
            }
        },

        'reDo_picking':(selectedMachine, supplyArea) => {
            machineCommTable.update({machineId: selectedMachine, 'supplyAreas._id': supplyArea},
                {$set: {'supplyAreas.$.supplyStatus': 0,
                                    'supplyAreas.$.pickingTime': '',
                                    'supplyAreas.$.pickerStart': '',
                                    'supplyAreas.$.pickingDateAndTime': '',
                                    'supplyAreas.$.pickingStart': '',
                                    'supplyAreas.$.pickerEnd' : '',
                                    'supplyAreas.$.pickerFinished': '',
                                    'supplyAreas.$.pickingEndDateAndTime': ''}})
        },

        'insertNewCostCenter': (newCostCenter, supplyPosition, team, orderNumber) => {
            let intSupplyPos = parseInt(supplyPosition);
            let numberOfOrder = parseInt(orderNumber)
            let costCenter = {
                _id: newCostCenter,
                "supplyPosition" : intSupplyPos,
                "active" : true,
                "supplyStatus" : 0,
                "team" : team,
                "orderNumber" : numberOfOrder
               }
            supplyAreas.insert({ _id: newCostCenter,
                "supplyPosition" : intSupplyPos, "active" : true, "supplyStatus" : 0,
                "team" : team, "orderNumber" : numberOfOrder})
            let counterPosition = [];
            let newSupplyAreas = [];
            let result = machineCommTable.find({active: true}, 
                {fields: {supplyAreas: 1, counter: 1}}).fetch()
            result.forEach((element) => {
                if (element.counter === undefined) {

                } else {
                    counterPosition.push(element.counter)
                }
            })
            counterPosition.forEach((element) => {
               let newResultSet = machineCommTable.findOne({counter: element},
                   {fields: {supplyAreas: 1}});
                let newSet = newResultSet.supplyAreas;
                newSet.push(costCenter)
                machineCommTable.update({counter: element}, {$set: {supplyAreas: newSet}});
            })
        },


        'desiredMachinesList': (dateStart, dateEnd, unixStartDate, unixEndDate, otherStartDate, otherEndDate,  machines) => {
         //   console.log(dateStart, dateEnd, unixStartDate, unixEndDate, otherStartDate, otherEndDate, machines)
            let currentDate = new Date();
            let firstDay = new Date(otherStartDate.setDate(otherStartDate.getDate() - otherStartDate.getDay())).toUTCString();
            let lastDay = new Date(otherStartDate.setDate(otherStartDate.getDate() - otherStartDate.getDay() + 7)).toUTCString();
        //    console.log(firstDay, lastDay, otherStartDate)
           // console.log(new Date(unixStartDate).getDate())
        },

        'serverTime': () => {
            // Month starts at 0 and ends at 11 (January = 0, December = 11)
            // Day starts at 0 and ends at 6 (Sunday = 0, Saturday = 6)
            // unixTime in milliseconds stored as a string
            let  serverDateTime, serverMin, serverTime, unixServerTime, serverMonth, serverDate, serverHours;
            serverDateTime = new Date();
            unixServerTime = Date.now().toString();
            serverHours = serverTimer(serverDateTime.getHours())
            serverMin = serverTimer(serverDateTime.getMinutes())
            serverMonth = serverTimer(serverDateTime.getMonth())
            serverDate = serverTimer(serverDateTime.getDate())
            serverTime = serverDateTime.getFullYear() + '-' + serverMonth + '-' + serverDate + ' ' + serverHours + ':' +  serverMin + ' ' + serverDateTime.getDay();

            activeAssembly.update({"_id" : "assemblyLineTimeStamp"},
                {$set: {"serverTime" : serverTime, unixTime: unixServerTime}})
            return serverTime;
    },

        'updateTactTime': (percent) => {
          //  let timeLeft =
            activeAssembly.update({_id: 'team-1'}, {$set: {'tactTimeLeft' : percent }})
        },

        'shift_team_1':(bay_2_start, bay_3_start, bay_4_start, bay_2_end, bay_3_end, bay_4_end) => {

        },

        'tactTime': (tact_time) => {
          //  console.log(tact_time)
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
           userActions.update({_id: "bay_19_last_machine"}, {$set: {lastMachine: machineId}})
            
        },
        
        'clearMergeCanvas': () => {
          activeAssembly.update({_id: 'rear_axle_machine_merge'}, {$set: {bayArray : []}})
          activeAssembly.update({_id: 'front_threshing_machine_merge'}, {$set: {bayArray : []}})
        },

        'clearCanvas': (oldCanvas) => {
            activeAssembly.update({_id: oldCanvas}, {$set: {bayArray : []}})

        },

        'timerStart': function(canvasId, timerStartStop, userId) {
            let startStopTime = (Date.now()).toFixed(0);
            let result = activeAssembly.findOne({_id: canvasId},
                {fields: {bayArray: 1}});
            if (result.bayArray.length > 1) {
                // 2 Machines in Bay
            } else if (result.bayArray.length === 1) {
                // 1 Machine in Bay
                let machine = result.bayArray[0].machineNr;
                if (timerStartStop === 0) {
                    // start merging process
                    machineCommTable.update({machineId: machine, 'bayReady._id': canvasId},
                        {$set: {
                                'bayReady.$.bayStart': startStopTime,
                                'bayReady.$.assemblyTech': userId
                            }})
                    activeAssembly.update({_id: canvasId},
                        {$set: {bayAssemblyStatus: 2}}, {upsert: true})
           //         assemblyTech.update({_id: userId}, {$set: {}} )
                } else if (timerStartStop === 2) {
                    // merging is finished
                    machineCommTable.update({machineId: machine, 'bayReady._id': canvasId},
                        {$set: {
                                'bayReady.$.bayStop': startStopTime,
                                'bayReady.$.assemblyTech': userId
                            }})
                    activeAssembly.update({_id: canvasId},
                        {$set: {bayAssemblyStatus: 1, machineReady: true}}, {upsert: true})
                }

            } else if (result.bayArray.length === 0){
                // Bay is empty
            }
        },

        'moveMachineToNextBay': (machineId, machineNr, user, thisBay, nextBayId, boolean) => {
        //    console.log(machineId, machineNr, user, thisBay, nextBayId, boolean)
            let machineInfo;
            let movingTime = moment().format('YYYY-MM-DD HH:mm:ss');
            let todayUnix = (Date.now()).toFixed(0);

           // ******************  move machine to next Bay ************************************************************
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
            // ****** check if Bay contains 2 Machines = true
            if (boolean === true) {

   //   ******************************  2 Machines in Bay, move first machine   ************************

                let result = activeAssembly.findOne({_id: thisBay});
                let pullMachineId = result.bayArray[0].machineId  // Id to be pulled out of array
                activeAssembly.update({_id : thisBay},
                    {$pull: {bayArray: {machineId: pullMachineId}}})  // remove Machine

   // write machine info into next bay
                if (nextBayId === 'machine_field_bay_4') {
                    // only for bay 4 engine mount
                    machineInfo = {
                        machineId: machineId,
                        machineNr: machineNr,
                        bayDateLanding: movingTime,
                        bayDateLandingUnix: todayUnix,
                        engineMounted: false
                    }
                } else {
                    // all others Bay
                        machineInfo = {
                        machineId : machineId,
                        machineNr : machineNr,
                        bayDateLanding : movingTime,
                        bayDateLandingUnix : todayUnix,
                        }
                }
            //    bayArray.push(machineInfo)
                activeAssembly.update({_id : nextBayId},
                                      {$push: {bayArray: machineInfo}})


            } else if (boolean === false) {   // only 1 Machine in present Bay
                if (nextBayId === 'machine_field_bay_4') {
                    machineInfo = {
                        machineId: machineId,
                        machineNr: machineNr,
                        bayDateLanding: movingTime,
                        bayDateLandingUnix: todayUnix,
                        engineMounted: false
                    }
                } else {
                    machineInfo = {
                        machineId : machineId,
                        machineNr : machineNr,
                        bayDateLanding : movingTime,
                        bayDateLandingUnix : todayUnix,
                    }
                }
                let result = activeAssembly.findOne({_id: thisBay});
                let pullMachineId = result.bayArray[0].machineId  // Id to be pulled out of array
                activeAssembly.update({_id : thisBay},
                    {$pull: {bayArray: {machineId: pullMachineId}}})  // remove Machine
                activeAssembly.update({_id : nextBayId},  {$push: {bayArray: machineInfo}})
            }

        },

        'engineReady': (canvasId, canvasId_2) => {
            // set merge stations to new status for machineReady and bayAssemblyStatus
            // after engine is moved
            activeAssembly.update({_id: canvasId},
                {$set: {bayAssemblyStatus: 1, machineReady: true}}, {upsert: true})
            activeAssembly.update({_id: canvasId_2},
                {$set: {bayAssemblyStatus: 1, machineReady: true}}, {upsert: true})
    },

        'engineMountBay4':(canvasId, target_machine, canvasId_2) => {
            activeAssembly.update({_id: canvasId},
                {$set: {machineReady: false, bayAssemblyStatus: 0}});
            activeAssembly.update({_id: canvasId_2},
                {$set: {machineReady: false, bayAssemblyStatus: 0}});
            activeAssembly.update({_id: "machine_field_bay_4", "bayArray.machineNr": target_machine},
                {$set: {'bayArray.$.engineMounted' : true}})
        },

        'resetEngineMounted': () => {
            activeAssembly.update({_id: "machine_field_bay_4"},
                {$set: {engineMounted: false}})
        },



        // ****************** move from list to FCB Bay ********************

        'moveFromListToFCB_Bay': (selectedMachine, machineNr, canvasId, activeList) => {
         //   toDo: change name, implement cooling box if its first inLine
           // console.log(selectedMachine, machineNr, canvasId, activeList)
            // *********   prepare this machines database for bayReady data / copy Bays and necessary data fields  ******
            let result, today, todayUnix;
            today = moment().format('YYYY-MM-DD HH:mm:ss ');
            todayUnix = (Date.now()).toFixed(0); // milliseconds
            let bayArray = [];
            let listObjects = [];
            result = assemblyLineBay.find({}).fetch();
            // ************  prepare bay ready list for insert into machines list
            result.forEach((element) => {
                listObjects.push(element)
            })

            let bayReadyCheck = machineCommTable.findOne({_id: selectedMachine},
                {fields: {bayReady: 1}});
            if (bayReadyCheck.bayReady === undefined) {
              //  console.log('undefined detected')
                machineCommTable.upsert({_id: selectedMachine},
                    {$set: {bayReady: listObjects}})
                }

            machineCommTable.update({_id: selectedMachine, 'bayReady._id': canvasId},
                {$set: {
                        [activeList]: false,
                        'activeInBay' : true,
                        'bayReady.$.bayDateLanding': today,
                        'bayReady.$.bayDateLandingUnix': todayUnix,
                        'bayReady.$.bayStatus' : 2
                    }});

         //  *****************  Update html canvas box with the new location  ***********************
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
//  ************************************************************************************************************************

        //  **************************    Corn Heads start here    **********************************

        'addSingleCornHead': (cornHead, dateInLine) => {
            let newHeadId = cornHead;
            let inLine = dateInLine;
            let pickingStatus = 0;
            console.log(newHeadId, inLine, pickingStatus)
            pickingNewHead.insert({newHeadId: newHeadId,
                                        inLineDate: inLine,
                                        pickingStatus: pickingStatus})



        },

        //--------------  Update Machine List with in Line and off Line Date  --------------

        'updateMachineInLine': (contents) => {
            let timeLine = {};
            let lastSortedKey = [];
            let today, firstMachine,  arr, i, newElement, inLineDate, inLineTime;
            let newMachine = 0;
            let updateMachine = 0;
            today = moment().format('YYYY-MM-DD');
            let supplyResult = supplyAreas.find({active: true},
                {sort: {supplyPosition: 1}}).fetch();
            //  ******************************  Update Machine List **************************************

            // find Machine with active Engine List : true (not touched bt Engines)
            // then cut the CSV File above this Machine and cut machines without sequence number
            let findBay19Machine = userActions.findOne({_id: "bay_19_last_machine"});
            firstMachine = machineCommTable.findOne({_id: findBay19Machine.lastMachine},
                {fields: {_id : 1, machineId: 1, counter: 1, activeInBay: 1}})
            let machineFound = firstMachine.machineId;
            let counterStart = firstMachine.counter;
           // console.log('last machine', machineFound, counterStart)
 // *****************************************************************************************************************
            // processing CSV File starts here.

            arr = contents.split(/[\n\r]/g);
            i = 0;
            arr.forEach((element) => {
                    if (element === '') {
                        arr.splice(i, 1);
                    }
                    i++
            })
            let copyOfNewElement = []
            newElement = [];
            arr.forEach((element) => {
                   // *********************  important Step  *********************************
                   // Regex search for Machine number pattern like C8900425
                   // add String into a new Array
                   let validStringTest = element.search(/^(C8[7-9][0-9]{5})/g);
                   // *********************  important step end ********************************
                   if (validStringTest === 0) {
                       newElement.push(element)
                       copyOfNewElement.push(element)
                   }
            })
            let newCopy = copyOfNewElement.slice();
             // console.log(newElement.length)
             // console.log(newElement)
             //  cutting machine list from top to machine which has left line (userActions.find machineId)
            for (let k = 0; k < newElement.length; k++) {
                 let machineList = newElement[k].substring(0,8);
                 let returnValue = machineFound.localeCompare(machineList);
                    if (returnValue === 0) {
                        break;
                        } else {
                            copyOfNewElement.shift()
                        }
            }
            // No Machines matched the new List probably new Fiscal Year
            let maxCount = [];
            if (copyOfNewElement.length === 0 ){
                copyOfNewElement = newCopy
                let maxMachineCount = machineCommTable.find({counter: {$gt: counterStart}}, {fields: {counter: 1}}).fetch()
                maxMachineCount.forEach((element) => {
                    maxCount.push(element.counter)
                })
                newMachine = Math.max(...maxCount)
                counterStart = newMachine
            }

            let sequencedMachines = [];
           // only machines with a sequence number should be left
            newCopy = [] // free unused memory / array
            copyOfNewElement.forEach((element) => {
                let sequence = element.split(',');
                if (sequence[31] > '0') {
                    sequencedMachines.push(element)
                }
            });
            // console.log(sequencedMachines)
            // build timeline for new machines to insert and existing machines to update

           sequencedMachines.forEach((element) => {
                let sequence = element.split(',');
                inLineDate = moment(new Date(sequence[6])).format('YYYY-MM-DD');
                inLineTime = moment(new Date(sequence[6])).format('h:mm A')
                timeLine = {
                    'machineId': sequence[0],
                    'station1': moment(new Date(sequence[1])).format('YYYY-MM-DD'),
                    'station_1_time': moment(new Date(sequence[1])).format('h:mm A'),
                    'station2': moment(new Date(sequence[2])).format('YYYY-MM-DD'),
                    'station_2_time': moment(new Date(sequence[2])).format('h:mm A'),
                    'station3': moment(new Date(sequence[3])).format('YYYY-MM-DD'),
                    'station_3_time': moment(new Date(sequence[3])).format('h:mm A'),
                    'station4': moment(new Date(sequence[4])).format('YYYY-MM-DD'),
                    'station_4_time': moment(new Date(sequence[4])).format('h:mm A'),
                    'mergeEngine': moment(new Date(sequence[5])).format('YYYY-MM-DD'),
                    'mergeEngine_time': moment(new Date(sequence[5])).format('h:mm A'),
                    'inLine': moment(new Date(sequence[6])).format('YYYY-MM-DD'),
                    'inLine_time': moment(new Date(sequence[6])).format('h:mm A'),
                    'bay3': moment(new Date(sequence[7])).format('YYYY-MM-DD'),
                    'bay_3_time': moment(new Date(sequence[7])).format('h:mm A'),
                    'bay4': moment(new Date(sequence[8])).format('YYYY-MM-DD'),
                    'bay_4_time': moment(new Date(sequence[8])).format('h:mm A'),
                    'bay5': moment(new Date(sequence[9])).format('YYYY-MM-DD'),
                    'bay_5_time': moment(new Date(sequence[9])).format('h:mm A'),
                    'bay6': moment(new Date(sequence[10])).format('YYYY-MM-DD'),
                    'bay_6_time': moment(new Date(sequence[10])).format('h:mm A'),
                    'bay7': moment(new Date(sequence[11])).format('YYYY-MM-DD'),
                    'bay_7_time': moment(new Date(sequence[11])).format('h:mm A'),
                    'bay8': moment(new Date(sequence[12])).format('YYYY-MM-DD'),
                    'bay_8_time': moment(new Date(sequence[12])).format('h:mm A'),
                    'bay9': moment(new Date(sequence[13])).format('YYYY-MM-DD'),
                    'bay_9_time': moment(new Date(sequence[13])).format('h:mm A'),
                    'bay10': moment(new Date(sequence[14])).format('YYYY-MM-DD'),
                    'bay_10_time': moment(new Date(sequence[14])).format('h:mm A'),
                    'testBay1': moment(new Date(sequence[15])).format('YYYY-MM-DD'),
                    'testBay_1_time': moment(new Date(sequence[15])).format('h:mm A'),
                    'testBay2': moment(new Date(sequence[16])).format('YYYY-MM-DD'),
                    'testBay_2_time': moment(new Date(sequence[16])).format('h:mm A'),
                    'bay14': moment(new Date(sequence[17])).format('YYYY-MM-DD'),
                    'bay_14_time': moment(new Date(sequence[17])).format('h:mm A'),
                    'bay15': moment(new Date(sequence[18])).format('YYYY-MM-DD'),
                    'bay_15_time': moment(new Date(sequence[18])).format('h:mm A'),
                    'bay16': moment(new Date(sequence[19])).format('YYYY-MM-DD'),
                    'bay_16_time': moment(new Date(sequence[19])).format('h:mm A'),
                    'bay17': moment(new Date(sequence[20])).format('YYYY-MM-DD'),
                    'bay_17_time': moment(new Date(sequence[20])).format('h:mm A'),
                    'bay18': moment(new Date(sequence[21])).format('YYYY-MM-DD'),
                    'bay_18_time': moment(new Date(sequence[21])).format('h:mm A'),
                    'bay19Planned': moment(new Date(sequence[22])).format('YYYY-MM-DD'),
                    'bay_19_planned_time': moment(new Date(sequence[22])).format('h:mm A'),
                    'bay19SAP': moment(new Date(sequence[23])).format('YYYY-MM-DD'),
                    'bay_19_sap_time': moment(new Date(sequence[23])).format('h:mm A'),
                    'bay19Actual': moment(new Date(sequence[24])).format('YYYY-MM-DD'),
                    'bay_19_actual_time': moment(new Date(sequence[24])).format('h:mm A'),
                    'terraTRack' : sequence[25],
                    'fourWheel': sequence[26],
                    'EngineMTU': sequence[27],
                    'bekaMax': sequence[28],
                    'salesOrder': sequence[29],
                    'productionOrder': sequence[30],
                    'sequence': sequence[31],
                    'ecnMachine': sequence[32],
                    'reserved': sequence[33]
                    }

                    if (machineCommTable.findOne({machineId: sequence[0]}) === undefined) {
                        // found new Machine, insert timeline supply Areas and some other things
                        newMachine ++;
                        userActions.update({_id: "newMachines"}, // update machine Counter for pickingOverview.html
                            {$set: {machineCount: newMachine}})
                        machineCommTable.update({machineId: sequence[0]},
                            {
                                machineId: sequence[0],
                                commissionStatus: 0,
                                inLineDate: inLineDate,
                                inLineTime: inLineTime,
                                counter: counterStart,
                                dateOfCreation: today,
                                active: true,
                                activeAssemblyLineList: true,
                                activeEngineList: true,
                                activeCoolingBoxList: true,
                                activeRearAxleList: true,
                                activeThreshingList: true,
                                activeFrontAxleList: true,
                                timeLine,
                                supplyAreas : supplyResult
                            }, {upsert: true});
                        counterStart  ++ ;
                    } else {
                        // machine Exists, just update inline date, timeLines and counter
                        updateMachine ++;
                        userActions.update({_id: "updateMachines"}, // update machine Counter
                            {$set: {machineCount: updateMachine}})  // for pickingOverview.html
                        machineCommTable.update({machineId: sequence[0]},
                            {
                                $set: {
                                    counter : counterStart,
                                    inLineDate: inLineDate,
                                    inLineTime: inLineTime,
                                    dateOfCreation: today,
                                    timeLine
                                }
                            }, {upsert: true});
                        counterStart  ++ ;
                            }
            })


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
          //  console.log(e)
        }
    },

        'commission_list_printed':(selectedMachine) => {
          machineCommTable.update({machineId: selectedMachine},
              {$set: {commissionList: 1}})
        },

        'deactivateMachine': (machineCompleted) => {
            machineCommTable.update({machineId: machineCompleted}
                , {$set: {active: false}});
        },

        'removeCommMachine': function (removeMachine) {
            machineCommTable.remove({machineId: removeMachine});
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

//***********************************************************************************************************
//***********************************************************************************************************
//----------------------------------------------- Commissioning Zone --------------------------------------------------------------

        // **  Search for a specific Date without Picker / commissionAnalysis.html  Line 75 to 82 /
        // and _commission_statistics.scss line 250 to 260 / commissionAnalysis.js Line 550

        'searchDate': (date) => {
            let searchResult, newDate, wd, weekDay, yyyy, mm, dd, searchString, result;
            let returnResult = [];
            newDate = new Date(date);
            wd = newDate.getDay() + 1; // find day of the week and add 1, Monday must start with 1
            weekDay = '0' + wd;// because a '0' would make trouble in search functions
            yyyy = date.slice(0, 4)
            mm = (date.slice(5, 7) - 1).toString()
            if (mm.length === 1) {
                mm = '0' + mm;
            }
            dd =  date.slice(8, 10)
            if (dd.length === 1) {
                dd = '0' + dd;
            }
            searchString = yyyy + mm + dd + weekDay;
            // search String must be like 2021100705 (YYYYMMDDWD) WD = Day of the Week (Mo = 0, Sun = 6)
            // first slice is Year, then Month, ten Day and weekday with leading 0.
            result = pickers.find({}, {fields: {[searchString]: 1}}).fetch();
            result.forEach((element) => {
                if (Object.keys(element).length >> 1 ) {
                    searchResult = {
                        pickerId : element._id,
                        supplyResult : element[searchString]
                    }
                    returnResult.push(searchResult)
                }
            })
            return returnResult;
        },


      //******************************************************************************************************


        'startPicking': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            if (pickedSupplyAreaId === 'L2MHDL10') {
                let dateStartNow = moment().format('MMMM Do YYYY, h:mm:ss a' );
                let pickingStart = Date.now();
                pickersAtWork.upsert({_id: user}, {$set: {machineNr: pickedMachineId,
                        pickerSupplyArea: pickedSupplyAreaId, inActive: 1}});
                pickingNewHead.update({newHeadId: pickedMachineId},
                    {$set: {supplyStatus: status,
                                     pickerStart: user,
                                     pickingStart: pickingStart,
                                     pickingDateAndTime: dateStartNow}})

            } else {
                let commStat = machineCommTable.findOne({_id: pickedMachineId},
                    {fields: {commissionStatus : 1}});
                let dateStartNow = moment().format('MMMM Do YYYY, h:mm:ss a' );
                let pickingStart = Date.now();
                pickersAtWork.upsert({_id: user}, {$set: {machineNr: pickedMachineId,
                        pickerSupplyArea: pickedSupplyAreaId, inActive: 1}});
            //    console.log(commStat.commissionStatus)
                if (commStat.commissionStatus !== 0 ) {
                    machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                        {$set: {
                                "supplyAreas.$.supplyStatus": status,
                                "supplyAreas.$.pickerStart": user,
                                "supplyAreas.$.pickingStart": pickingStart,
                                "supplyAreas.$.pickingDateAndTime": dateStartNow}});
                } else {
                    machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                        {$set: {
                                 commissionStatus : 1,
                                "supplyAreas.$.supplyStatus": status,
                                "supplyAreas.$.pickerStart": user,
                                "supplyAreas.$.pickingStart": pickingStart,
                                "supplyAreas.$.pickingDateAndTime": dateStartNow}});
                }

                let findPicker = pickers.find().fetch();
                let result = findPicker.find(picker => picker._id === user);
                if(typeof result === 'undefined') {
                    pickers.insert({_id: user, active: 1});
                }
            }
        },

        'finishedPicking': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            let result, pickingEndTime, dateEndNow, pickingString, pickingTime;
            pickingString = pickingToDay();
            dateEndNow = moment().format('MMMM Do YYYY, h:mm:ss a');
            pickingTime = moment().format('M D')
            pickingEndTime = Date.now();
            pickersAtWork.remove({_id: user});
            if (pickedSupplyAreaId === 'L2MHDL10') {
                result = pickingNewHead.findOne({newHeadId: pickedMachineId})
                let pickingStart = result.pickingStart
                let pauseStart = result.pickingPauseStart;
                let pauseEnd = result.pickingPauseEnd;
                if (!pauseEnd) {
                    pauseStart = 1;
                    pauseEnd = 1;
                }
                let pickingDuration = (pickingEndTime - pickingStart) - (pauseEnd - pauseStart);
                let duration = parseInt(pickingDuration);
                let pickingObj =  {
                    machine: pickedMachineId,
                    supplyArea: 'L2MHDL10',
                    pickingTime: pickingEndTime,  // Unix Time Stamp picking finished
                    duration: duration,
                    date: dateEndNow,
                    multi: false
                };
                pickers.update({_id: user, }, {$addToSet: {[pickingString]: pickingObj}});
                pickingNewHead.update({newHeadId: pickedMachineId}, {$set: {pickingStatus: 1,
                                                                                            pickingTime: pickingEndTime,
                                                                                            duration: duration,
                                                                                            date: dateEndNow,
                    }})
                return 'success';
            } else {
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
            }
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
            if (pickedSupplyAreaId === 'L2MHDL10') {
                pickersAtWork.upsert({_id: user}, {$set: {inActive: 2}});
                pickingNewHead.update({newHeadId: pickedMachineId},
                    {$set: {supplyStatus: status,
                                     pickingPauseStart: pickingPauseStart}})
            } else {
                pickersAtWork.upsert({_id: user}, {$set: {inActive: 2}});
                machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                    {$set: {"supplyAreas.$.supplyStatus": status,
                            "supplyAreas.$.pickingPauseStart": pickingPauseStart }})
            }
        },

        'pausePickingEnd': function (pickedMachineId, pickedSupplyAreaId, status, user) {
            let pickingPauseEnd = Date.now();
            if (pickedSupplyAreaId === 'L2MHDL10') {
                pickersAtWork.upsert({_id: user}, {$set: {inActive: 3}});
                pickingNewHead.update({newHeadId: pickedMachineId},
                    {$set: {supplyStatus: status,
                            pickingPauseEnd: pickingPauseEnd}})
            } else {
                pickersAtWork.upsert({_id: user}, {$set: {inActive: 3}});
                machineCommTable.update({_id: pickedMachineId, "supplyAreas._id": pickedSupplyAreaId},
                    {$set: {"supplyAreas.$.supplyStatus": status,
                            "supplyAreas.$.pickingPauseEnd": pickingPauseEnd}})
            }


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

            let supplyArray = [];
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

            // compare first array with 2nd, 3rd, 4th and eliminate single array values not matching other arrays
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

            // identify supply area with the highest number (areas available for all selected machines

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
          //  console.log('Array 1 ', arr1);
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
                } else if (newFiscalYear === "2022") {
                    newFiscalYear = "2021090401"
                    resultObj.forEach((element) => {
                        if (element >= newFiscalYear) {
                            arraySummary.push(result[element]);
                        }
                    });
                }
            } catch (e) {
            }
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

        'loginStatus': (user) => {
          Meteor.users.update({username: user}, {$set: {loginStatus: 1}})
        },

        'logOut': (userName) => {
            Meteor.users.update({username: userName}, {$set: {'services.resume.loginTokens': []}});
            usersProfile.upsert({username: userName}, {$set: {loginStatus: 0}});
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
            let active;
            if (role === 'Picker') {
                active = 1;
            } else {
                 active = '';
            }
            Accounts.createUser({username: userConst, password: passwordConst});
            setTimeout(function () {
            }, 1000);
            Meteor.users.upsert({username:userConst}, {$addToSet: {roles: role}});
            usersProfile.insert({username: userConst, role: role, createdAt: createdAt,
                createdBy: loggedUser, loginStatus: 0, active: active});
        },

//-------------------------------------------------------- Supply Areas -----------------------------------------------------------------------

    });



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

    function serverTimer(time) {
        if (time < '10') {
            time = '0' + time;
        } else {
           return time;
        }
        return time
    }

}




