import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')


import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';


import { unitCounter } from "../../lib/99_functionCollector.js";
import { updateTime } from "../../lib/99_functionCollector.js";
import { timeCounter } from "../../lib/99_functionCollector.js";

Session.set('twoMachines', false)


Template.team_5_screen_view.helpers({


    time_bay_14: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay14, 1000);
    },

    units_bay_14: () => {
        return unitCounter("machine_field_bay_14", ["bay14", "bay_14_time"])
    },

    draw_bay14: () => {
        let canvasId = "machine_field_bay_8";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_15: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay15, 1000);
    },

    units_bay_15: () => {
        return unitCounter("machine_field_bay_15", ["bay15", "bay_15_time"])
    },

    draw_bay15: () => {
        let canvasId = "machine_field_bay_15";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_16: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay16, 1000);
    },

    units_bay_16: () => {
        return unitCounter("machine_field_bay_16", ["bay16", "bay_16_time"])
    },

    draw_bay16: () => {
        let canvasId = "machine_field_bay_16";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_17: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay17, 1000);
    },

    units_bay_17: () => {
        return unitCounter("machine_field_bay_17", ["bay17", "bay_17_time"])
    },

    draw_bay17: () => {
        let canvasId = "machine_field_bay_17";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_18: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay18, 1000);
    },

    units_bay_18: () => {
        return unitCounter("machine_field_bay_18", ["bay18", "bay_18_time"])
    },

    draw_bay18: () => {
        let canvasId = "machine_field_bay_18";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_19: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterBay19, 1000);
    },

    units_bay_19: () => {
        return unitCounter("machine_field_bay_19", ["bay19", "bay_19_time"])
    },

    draw_bay19: () => {
        let canvasId = "machine_field_bay_19";
        invokeDrawMachineInBay(canvasId)
    },



    date:() => {
        setInterval(updateTime, 1000);
    }



});

function timeCounterBay14() {
    timeCounter( "realTimerBay14")
}


function timeCounterBay15() {
    timeCounter( "realTimerBay15")
}

function timeCounterBay16() {
    timeCounter(  "realTimerBay16")
}

function timeCounterBay17() {
    timeCounter(  "realTimerBay17")
}


function timeCounterBay18() {
    timeCounter(  "realTimerBay18")
}


function timeCounterBay19() {
    timeCounter(  "realTimerBay19")
}

