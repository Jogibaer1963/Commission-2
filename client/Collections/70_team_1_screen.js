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

    units_bay_2: () => {
        return unitCounter("machine_field_fcb_threshing")
    },

    units_bay_3: () => {
        return unitCounter("machine_field_bay_3")
    },

    units_bay_4: () => {
        return unitCounter("machine_field_bay_4")
    },

    date:() => {
        setInterval(updateTime, 1000);
    }




})


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