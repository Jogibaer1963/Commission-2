import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')

import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

import { unitCounter } from "../../lib/99_functionCollector.js";

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
        invokeDrawMachineInBay(canvasId)
    },

    draw_fcb_threshing_team_1: () => {
        let canvasId = "machine_field_fcb_threshing";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay3: () => {
        let canvasId = "machine_field_bay_3";
        invokeDrawMachineInBay(canvasId)
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
        invokeDrawMachineInBay(canvasId)
    },


    time_bay_2: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay2, 1000);
    },

    units_bay_2: () => {
        return unitCounter("machine_field_fcb_threshing")
    },

    time_bay_3: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay3, 1000);
    },

    units_bay_3: () => {
        return unitCounter("machine_field_bay_3")
    },

    time_bay_4: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay4, 1000);
    },

    units_bay_4: () => {
        return unitCounter("machine_field_bay_4")
    },


    date:() => {
        setInterval(updateTime, 1000);
    }

})

function timeCounterBay2() {
    timeCounter("machine_field_fcb_threshing", "realTimerBay2")
}


function timeCounterBay3() {
    timeCounter("machine_field_bay_3", "realTimerBay3")
}

function timeCounterBay4() {
    timeCounter("machine_field_bay_4", "realTimerBay4")
}


function timeCounter(bayId, timerId) {
    let result, machineNr, timeLine, leavingTime, leavingDateTime, moveTime,
        h, m, s, trueMovingTime;
    try {
        result = activeAssembly.findOne({_id: bayId});
        machineNr = result.bayArray[0].machineNr;
        timeLine = machineCommTable.findOne({machineId: machineNr},{fields: {timeLine: 1}})
        leavingTime = timeLine.timeLine.bay_4_time;
        leavingDateTime = timeLine.timeLine.bay4 + ' ' + leavingTime;
        moveTime =  ((parseInt(((new Date(leavingDateTime).getTime()) / 1000).toFixed(0)) -
            (Date.now() / 1000).toFixed(0)) ).toFixed(0);
        if (moveTime >= 0) {
            h = Math.floor(moveTime / 3600);
            m = Math.floor(moveTime % 3600 / 60);
            s = Math.floor(moveTime % 3600 % 60);
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s
            }
            trueMovingTime = h + ':' + m + ':' + s
            document.getElementById(timerId).innerHTML =
                trueMovingTime;
        }
        if (moveTime < 0) {
            let negativeMoveTime = Math.abs(moveTime)
            h = Math.floor(negativeMoveTime / 3600);
            m = Math.floor(negativeMoveTime % 3600 / 60);
            s = Math.floor(negativeMoveTime % 3600 % 60);
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s
            }
            trueMovingTime = '-' + h + ':' + m + ':' + s
            document.getElementById(timerId).innerHTML =
                trueMovingTime;
        }
    } catch(err) {}
}


function zeroPadding(num, digit) {   let zero = '';
    for(let i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

function updateTime() {
    let week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let cd = new Date();
    document.getElementById('time').innerHTML = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2)
        + ':' + zeroPadding(cd.getSeconds(), 2);
    document.getElementById('date').innerHTML = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2)
        + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
}