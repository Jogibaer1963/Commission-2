import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')


import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';


import { unitCounter } from "../../lib/99_functionCollector.js";
import { updateTime } from "../../lib/99_functionCollector.js";
import { timeCounter } from "../../lib/99_functionCollector.js";

Session.set('twoMachines', false)


Template.team_3_screen_view.helpers({


    time_bay_8: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
      //  setInterval(timeCounterBay8, 1000);
    },

    units_bay_8: () => {
      //  let unitCount = unitCounter("machine_field_bay_8", ["bay10", "bay_8_time"])
      //  Session.set('unitCountBay8', unitCount)
      //  return unitCount;
    },

    draw_bay8: () => {
        let canvasId = "machine_field_bay_8";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_9: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
       // setInterval(timeCounterBay9, 1000);
    },

    units_bay_9: () => {
      //  let unitCount = unitCounter("machine_field_bay_9", ["bay9", "bay_9_time"])
      //  Session.set('unitCountBay9', unitCount)
      //  return unitCount;
    },

    draw_bay9: () => {
        let canvasId = "machine_field_bay_9";
        invokeDrawMachineInBay(canvasId)
    },

    time_bay_10: () => {
        // Tact time = 330 min per Machine.
        // cycle time = true time from start to finish / move machine until move machine again.
       // setInterval(timeCounterBay10, 1000);
    },

    units_bay_10: () => {
      //  let unitCount = unitCounter("machine_field_bay_10", ["bay10", "bay_10_time"])
      //  Session.set('unitCountBay10', unitCount)
      //  return unitCount;
    },

    draw_bay10: () => {
        let canvasId = "machine_field_bay_10";
        invokeDrawMachineInBay(canvasId)
    },

    date:() => {
        setInterval(updateTime, 1000);
    }

});

function timeCounterBay8() {
    let unitCount = Session.get('unitCountBay8')
    timeCounter( "machine_field_bay_8", ['bay8', 'bay_8_time', unitCount], 'realTimerBay8')
}

function timeCounterBay9() {
    let unitCount = Session.get('unitCountBay9')
    timeCounter( "machine_field_bay_9", ['bay9', 'bay_9_time', unitCount], 'realTimerBay9')
}

function timeCounterBay10() {
    let unitCount = Session.get('unitCountBay10')
    timeCounter( "machine_field_bay_10", ['bay10', 'bay_10_time', unitCount], 'realTimerBay10')
}
