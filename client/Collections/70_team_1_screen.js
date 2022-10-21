import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')

import {invokeDrawTwoMachines, invokeEmptyBay} from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

import { unitCounter } from "../../lib/99_functionCollector.js";
import { updateTime } from "../../lib/99_functionCollector.js";
import { timeCounter } from "../../lib/99_functionCollector.js";

Session.set('twoMachines', false)

Template.team_1_screen_view.helpers({

// **********************************   inLineDate = Bay 2 Landing date / time

    draw_fcb_station_1: () => {
        let canvasId = "fcb_station_1";
        let result = activeAssembly.findOne({_id : canvasId});
        try {
            if (result.bayArray.length === 0) {
                // draw empty field in Bay
                invokeEmptyBay(canvasId)
            } else if (result.bayArray.length === 1) {
                // draw 1 machine in Bay
                let machineNrInBay = result.bayArray[0].machineNr;

                //Code to check ECN Status
                let machine1 = machineCommTable.findOne({machineId : machineNrInBay}, {});
                let machine1Status = "";
                machine1Status += machine1.timeLine.ecnMachine;
                invokeDrawOneMachine(machineNrInBay, canvasId, machine1Status);
            }
        } catch(e) {

        }
    },

    draw_fcb_station_2: () => {
        let canvasId = "fcb_station_2";
        drawMachineInBay(canvasId)
    },

    draw_fcb_threshing_team_1: () => {
        let canvasId = "machine_field_fcb_threshing";
        drawMachineInBay(canvasId)
    },

    draw_bay3: () => {
        let canvasId = "machine_field_bay_3";
        drawMachineInBay(canvasId)
    },

    first_engine: () => {
        try {
            let result = activeAssembly.findOne({_id: "merge-station-1"},
                {fields: {bayArray: 1, bayAssemblyStatus: 1}})
            if (result.bayAssemblyStatus === 1) {
                Session.set("merge_1", result.bayArray[0].machineNr)
                return result.bayArray[0].machineNr
            }
        } catch(err) {}
    },

    second_engine: () => {
        try {
            let result = activeAssembly.findOne({_id: "merge-station-2"},
                {fields: {bayArray: 1, bayAssemblyStatus: 1}})
            if (result.bayAssemblyStatus === 1) {
                Session.set("merge_2", result.bayArray[0].machineNr)
                return result.bayArray[0].machineNr
            }
        } catch(err) {}
    },

    third_engine: () => {
        try {
            let result = activeAssembly.findOne({_id: "merge-station-3"},
                {fields: {bayArray: 1, bayAssemblyStatus: 1}})
            if (result.bayAssemblyStatus === 1) {
                Session.set("merge_3", result.bayArray[0].machineNr)
                return result.bayArray[0].machineNr
            }
        } catch(err) {}
    },

    draw_bay4: () => {
        let canvasId = "machine_field_bay_4";
        drawMachineInBay(canvasId)
    },

    bay_4_engine_mount: () => {
        let result = activeAssembly.findOne({_id: 'machine_field_bay_4'})
        try {
            if (result.bayArray[0] === undefined) {
                document.getElementById('bay-4-text-area').style.display = 'none'
            } else {
                let bayState = result.bayArray[0].engineMounted;
            //    console.log('inside function', bayState, result)
                if (bayState === false || bayState === undefined) {
                //    console.log('no engine')
                    document.getElementById('bay-4-text-area').style.display = 'none'
                } else if (bayState === true ) {
               //     console.log('Engine Mounted')
                    document.getElementById('bay-4-text-area').style.display = 'block'
                }
            }
        } catch (e) {
        }
    },


    time_bay_2: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
      //  setInterval(timeCounterBay2, 1000);
    },

    units_bay_2: () => {
     //   let unitCount = unitCounter("machine_field_fcb_threshing", ["inLine", "inLine_time"]);
     //   Session.set('unitCountBay2', unitCount);
      //  return unitCount;
    },

    time_bay_3: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
      //  setInterval(timeCounterBay3, 1000);
    },

    units_bay_3: () => {
     //   let unitCount = unitCounter("machine_field_bay_3", ["bay3", "bay_3_time"])
     //   Session.set('unitCountBay3', unitCount);
      //  return unitCount
    },

    time_bay_4: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        //setInterval(timeCounterBay4, 1000);
    },

    units_bay_4: () => {
      //  let unitCount = unitCounter("machine_field_bay_4", ["bay4", "bay_4_time"])
      //  Session.set('unitCountBay4', unitCount);
      //  return unitCount
    },


    date:() => {
        setInterval(updateTime, 1000);
    }

})

function timeCounterBay2() {
    let unitCount = Session.get('unitCountBay2')
    timeCounter( 'machine_field_fcb_threshing', ['inLine', 'inLine_time', unitCount], "realTimerBay2")
}


function timeCounterBay3() {
    let unitCount = Session.get('unitCountBay3')
    timeCounter( "machine_field_bay_3", ['bay3', 'bay_3_time', unitCount], 'realTimerBay3')
}

function timeCounterBay4() {
    let unitCount = Session.get('unitCountBay4')
    timeCounter( "machine_field_bay_4", ['bay4', 'bay_4_time', unitCount], "realTimerBay4")
}

function drawMachineInBay(canvasId) {
    try {
        let result = activeAssembly.findOne({_id : canvasId});
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        if (result.bayArray.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height) // clear leftovers
            // draw empty field in Bay
            ctx.strokeStyle = "#ee0e0e";
            ctx.lineWidth = "2"
            ctx.strokeRect(45, 15, 90, 30);
        } else if (result.bayArray.length === 1) {
            // draw 1 machine in Bay
            let machineNrInBay = result.bayArray[0].machineNr
            let ecnCheck= result.bayArray[0].ecnMachine;
            //  console.log('machine detected ', ecnCheck, result, result.bayArray[0])
            invokeDrawOneMachine(machineNrInBay, canvasId, ecnCheck);
        } else if (result.bayArray.length === 2) {
            let firstMachine = result.bayArray[0].machineNr
            let secondMachine = result.bayArray[1].machineNr
            let ecnCheckOne = result.bayArray[0].ecnMachine;
            let ecnCheckTwo = result.bayArray[1].ecnMachine;
            console.log('2 machine detected', )
            invokeDrawTwoMachines(firstMachine, secondMachine, ecnCheckOne, ecnCheckTwo, canvasId)
        }
    } catch (e) {}
}




