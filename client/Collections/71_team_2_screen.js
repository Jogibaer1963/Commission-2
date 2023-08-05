import {Session} from "meteor/session";

Meteor.subscribe('activeAssembly')


import { invokeDrawMachineInBay, drawMachineInBay } from '../../lib/99_functionCollector.js';

import { updateTime } from "../../lib/99_functionCollector.js";


Session.set('twoMachines', false)


Template.team_2_screen_view.helpers({


    draw_bay5: () => {
        let canvasId = "machine_field_bay_5";
        drawMachineInBay(canvasId)
    },

    draw_bay6: () => {
        let canvasId = "machine_field_bay_6";
        drawMachineInBay(canvasId)
    },

    draw_bay7: () => {
        let canvasId = "machine_field_bay_7";
        drawMachineInBay(canvasId)
    },

    date:() => {
        setInterval(updateTime, 1000);
    }

});


