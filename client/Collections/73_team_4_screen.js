import {Session} from "meteor/session";

// Meteor.subscribe('activeAssembly')

import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

import { unitCounter } from "../../lib/99_functionCollector.js";
import { updateTime } from "../../lib/99_functionCollector.js";
import { timeCounter } from "../../lib/99_functionCollector.js";

Session.set('twoMachines', false)


Template.over_view_all_teams.helpers({

    totalMachines: () => {
        try {
            let result = userActions.findOne({_id: "total_machines"}).totalMachines;
            Session.set('total-machines', result)
            return result;
        } catch (e) {

        }


    },

    buildToDate: () => {
        let machinesBuild, machinesToBuild, resultFinished, totalMachines;
        Tracker.autorun(() => {
            Meteor.subscribe('bay_19_count')
            resultFinished = machineCommTable.find({counter: {$gt: 1358}, activeInBay: false}, {fields: {machineId: 1, counter: 1}}).fetch();
            totalMachines = Session.get('total-machines');
             machinesBuild = resultFinished.length
             machinesToBuild = totalMachines - machinesBuild
           // console.log(machinesToBuild, machinesBuild)
            Session.set('machinesToBuild', machinesToBuild);
            Session.set('machinesBuild', machinesBuild)
        })
    },

    machinesToBuild: () => {
        return Session.get('machinesToBuild')
    },

    machinesBuild: () => {
      return Session.get('machinesBuild')
    },

    shippedMachines:() => {
       let result;
       Tracker.autorun(() => {
           Meteor.subscribe('machinesShipped') // server line200
           result = machineReadyToGo.find().fetch();
           // console.log(result)
           Session.set('shipped-machines', result.length)
       })
    },

    machinesShipped: () => {
        return Session.get('shipped-machines')
    }

})


Template.team_4_screen_view.helpers({

    draw_engine_1: () => {
        let canvasId = "engine-station-1";
        invokeDrawMachineInBay(canvasId)
    },

    time_engine_1: () => {
      //  setInterval(timeCounterEngine1, 1000);
    },

    units_engine_1: () => {
     //   let unitCount = unitCounter("engine-station-1", ["station1", "station_1_time"])
     //   Session.set('unitCountEngine1', unitCount);
      //  return unitCount
    },

    //  **********************************  Engine 2 ***********************************

    draw_engine_2: () => {
        let canvasId = "engine-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    time_engine_2: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
      //  setInterval(timeCounterEngine2, 1000);
    },

    units_engine_2: () => {
     //   let unitCount = unitCounter("engine-station-2", ["station2", "station_2_time"])
      //  Session.set('unitCountEngine2', unitCount);
      //  return unitCount
    },

    // ***************************************  Engine 3 *****************************

    draw_engine_3: () => {
        let canvasId = "engine-station-3";
        invokeDrawMachineInBay(canvasId)
    },

    time_engine_3: () => {
      //  setInterval(timeCounterEngine3, 1000);
    },

    units_engine_3: () => {
      //  let unitCount = unitCounter("engine-station-3", ["station3", "station_3_time"])
      //  Session.set('unitCountEngine3', unitCount);
       // return unitCount
    },

    // ***************************************  Engine 4 ****************************************

    draw_engine_4: () => {
        let canvasId = "engine-station-4";
        invokeDrawMachineInBay(canvasId)
    },

    time_engine_4: () => {
       // setInterval(timeCounterEngine4, 1000);
    },

    units_engine_4: () => {
     //   let unitCount = unitCounter("engine-station-4", ["station4", "station_4_time"])
      //  Session.set('unitCountEngine4', unitCount);
      //  return unitCount
    },

    // ************************************* Cooling Box 1 ****************************************

    draw_cooling_1: () => {
        let canvasId = "cooling-station-1";
        invokeDrawMachineInBay(canvasId)
    },

    time_cooling_1: () => {
      //  setInterval(timeCounterCooling1, 1000);
    },

    units_cooling_1: () => {
      //  let unitCount = unitCounter("cooling-station-1", ["station3", "station_3_time"])
      //  Session.set('unitCountCooling1', unitCount);
      //  return unitCount
    },

    draw_cooling_2: () => {
        let canvasId = "cooling-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    time_cooling_2: () => {
       // setInterval(timeCounterCooling2, 1000);
    },

    units_cooling_2: () => {
      //  let unitCount = unitCounter("cooling-station-2", ["station4", "station_4_time"])
      //  Session.set('unitCountCooling2', unitCount);
      //  return unitCount
    },


    // *****************************************  Merge 1 ******************************************
    draw_merge_1: () => {
        let canvasId = "merge-station-1";
        invokeDrawMachineInBay(canvasId)
    },

    time_merge_1: () => {
      //  setInterval(timeCounterMerge1, 1000);
    },

    units_merge_1: () => {
      //  let unitCount = unitCounter("merge-station-1", ["mergeEngine", "mergeEngine_time"])
      //  Session.set('unitCountMerge1', unitCount);
      //  return unitCount
    },

    draw_cooling_merge_1: () => {
      let canvasId = "cooling-merge-1";
      invokeDrawMachineInBay(canvasId)
    },

// **************************************  Merge 2 *******************************************************

    draw_merge_2: () => {
        let canvasId = "merge-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    time_merge_2: () => {
      //  setInterval(timeCounterMerge2, 1000);
    },

    units_merge_2: () => {
       // let unitCount = unitCounter("merge-station-2", ["mergeEngine", "mergeEngine_time"])
       /// Session.set('unitCountMerge2', unitCount);
       // return unitCount
    },

    draw_cooling_merge_2: () => {
        let canvasId = "cooling-merge-2";
        invokeDrawMachineInBay(canvasId)
    },

// ******************************************** Merge 3 *****************************************************
    draw_merge_3: () => {
        let canvasId = "merge-station-3";
        invokeDrawMachineInBay(canvasId)
    },

    time_merge_3: () => {
       // setInterval(timeCounterMerge3, 1000);
    },

    units_merge_3: () => {
       /// let unitCount = unitCounter("merge-station-3", ["mergeEngine", "mergeEngine_time"])
      //  Session.set('unitCountMerge3', unitCount);
      //  return unitCount
    },

    draw_cooling_merge_3: () => {
        let canvasId = "cooling-merge-3";
        invokeDrawMachineInBay(canvasId)
    },

    date:() => {
        setInterval(updateTime, 1000);
    }

})

/*
function timeCounterEngine1() {
    let unitCount = Session.get('unitCountEngine1')
    timeCounter( 'engine-station-1', ['station1', 'station_1_time', unitCount], "realTimerEngine1")
}

function timeCounterEngine2() {
    let unitCount = Session.get('unitCountEngine2')
    timeCounter( 'engine-station-2', ['station2', 'station_2_time', unitCount], "realTimerEngine2")
}

function timeCounterEngine3() {
    let unitCount = Session.get('unitCountEngine3')
    timeCounter( 'engine-station-3', ['station3', 'station_3_time', unitCount], "realTimerEngine3")
}

function timeCounterEngine4() {
    let unitCount = Session.get('unitCountEngine4')
    timeCounter( 'engine-station-4', ['station4', 'station_4_time', unitCount], "realTimerEngine4")
}

function timeCounterCooling1() {
    let unitCount = Session.get('unitCountCooling1')
    timeCounter( 'engine-station-3', ['station3', 'station_3_time', unitCount], "realTimerCooling1")
}

function timeCounterCooling2() {
    let unitCount = Session.get('unitCountCooling2')
    timeCounter( 'engine-station-4', ['station4', 'station_4_time', unitCount], "realTimerCooling2")
}

function timeCounterMerge1() {
    let unitCount = Session.get('unitCountMerge1')
    timeCounter( 'merge-station-1', ['mergeEngine', 'mergeEngine_time', unitCount], "realTimerMerge1")
}

function timeCounterMerge2() {
    let unitCount = Session.get('unitCountMerge2')
    timeCounter( 'merge-station-2', ['mergeEngine', 'mergeEngine_time', unitCount], "realTimerMerge2")
}

function timeCounterMerge3() {
    let unitCount = Session.get('unitCountMerge3')
    timeCounter( 'merge-station-3', ['mergeEngine', 'mergeEngine_time', unitCount], "realTimerMerge3")
}

 */

