import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')

import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

import { unitCounter } from "../../lib/99_functionCollector.js";
import { updateTime } from "../../lib/99_functionCollector.js";
import { timeCounter } from "../../lib/99_functionCollector.js";

Session.set('twoMachines', false)


Template.team_2_screen_view.helpers({


    time_bay_5: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay5, 1000);
    },

    units_bay_5: () => {
        return unitCounter("machine_field_bay_5")
    },

    draw_bay5: () => {
        let canvasId = "machine_field_bay_5";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_6: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay6, 1000);
    },

    units_bay_6: () => {
        return unitCounter("machine_field_bay_5")
    },

    draw_bay6: () => {
        let canvasId = "machine_field_bay_6";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_7: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay7, 1000);
    },

    units_bay_7: () => {
        return unitCounter("machine_field_bay_5")
    },

    draw_bay7: () => {
        let canvasId = "machine_field_bay_7";
        invokeDrawMachineInBay(canvasId)
    },

    date:() => {
        setInterval(updateTime, 1000);
    }



});

function timeCounterBay5() {
    timeCounter("machine_field_fcb_threshing", "realTimerBay2")
}


function timeCounterBay6() {
    timeCounter("machine_field_bay_3", "realTimerBay3")
}

function timeCounterBay7() {
    timeCounter("machine_field_bay_4", "realTimerBay4")
}
