import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')


import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';


import { unitCounter } from "../../lib/99_functionCollector.js";
import { updateTime } from "../../lib/99_functionCollector.js";
import { timeCounter } from "../../lib/99_functionCollector.js";

Session.set('twoMachines', false)

Template.team_test_bay_screen_view.helpers({

    draw_bay10: () => {
        let canvasId = "machine_field_bay_10";
        invokeDrawMachineInBay(canvasId)
    },

    draw_front_test_bay: () => {
        let canvasId = "machine_field_front_test_bay";
        invokeDrawMachineInBay(canvasId)
    },

    time_test_bay_1: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterTestBay1, 1000);
    },

    units_test_bay_1: () => {
        let unitCount = unitCounter("machine_field_test_bay_1", ["testBay1", "testBay_1_time"])
        Session.set('unitCountTestBay1', unitCount)
        return unitCount;
    },

    draw_test_bay_1: () => {
        let canvasId = "machine_field_test_bay_1";
        invokeDrawMachineInBay(canvasId)
    },

    time_test_bay_2: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
        setInterval(timeCounterTestBay2, 1000);
    },

    units_test_bay_2: () => {
        let unitCount = unitCounter("machine_field_test_bay_2", ["testBay2", "testBay_2_time"])
        Session.set('unitCountTestBay2', unitCount)
        return unitCount;
    },

    draw_test_bay_2: () => {
        let canvasId = "machine_field_test_bay_2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_3: () => {
        let canvasId = "machine_field_test_bay_3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_4: () => {
        let canvasId = "machine_field_test_bay_4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_14: () => {
        let canvasId = "machine_field_bay_14";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_15: () => {
        let canvasId = "machine_field_bay_15";
        invokeDrawMachineInBay(canvasId)
    },

    date:() => {
        setInterval(updateTime, 1000);
    }


})

function timeCounterTestBay1() {
    let unitCount = Session.get('unitCountTestBay1')
    timeCounter( "machine_field_test_bay_1", ['testBay1', 'testBay_1_time', unitCount],
        'realTimerTestBay1')
}

function timeCounterTestBay2() {
    let unitCount = Session.get('unitCountTestBay2')
    timeCounter( "machine_field_test_bay_2", ['testBay2', 'testBay_2_time', unitCount],
        'realTimerTestBay2')
}