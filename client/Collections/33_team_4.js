Meteor.subscribe('activeAssembly')

import {invokeMachineTest, invokeMoveFromLastBay} from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';

Session.set('twoMachines', false)

// *********************  Header Buttons  ***********************************

Template.team_4_move_buttons.onRendered(function() {
    try {
        let result = Session.get('machineStatus')
        if (result === false) {
          //  console.log('first', result)
            document.getElementById('engine-ready-1').setAttribute("disabled","disabled"); // no machine in Bay button is disabled
        } else {
          //  console.log('second', result)
            document.getElementById('engine-ready-1').removeAttribute("disabled");
        }
    } catch (e) {}

    let result_2 = Session.get('machineStatus_2')
    try {
        if (result_2 === false) {
            document.getElementById('engine-ready-2').setAttribute("disabled","disabled");
         //   console.log('No array, Bay is empty button is disabled')
        } else {
            document.getElementById('engine-ready-2').removeAttribute("disabled");
         //   console.log('Bay is not empty button is enabled')
        }
    } catch (e) {}
})


//  ************************** Header Buttons end  ********************************

Template.team_4_move_buttons.events({

    'click .cooling-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'cooling-station-1';
        let newCanvasId = 'cooling-station-2';
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .cooling-2-move-button': (e) => {
         e.preventDefault();
         let  engineNr, coolingBox, coolingNr, engine_1, engine_2, engine_3, cooling_1, cooling_2, cooling_3;
         let oldCanvasId = 'cooling-station-2';
        // todo.. if Engine is not there choose first station 1, if already engaged station 2 if already engaged station 3
         coolingBox = activeAssembly.findOne({_id: "cooling-station-2"}, {fields: {bayArray: 1}})
         coolingNr = coolingBox.bayArray[0].machineNr
         engine_1 = activeAssembly.findOne({_id: "merge-station-1"}, {fields: {bayArray: 1}})
         engine_2 = activeAssembly.findOne({_id: "merge-station-2"}, {fields: {bayArray: 1}})
         engine_3 = activeAssembly.findOne({_id: "merge-station-3"}, {fields: {bayArray: 1}})
         cooling_1 = activeAssembly.findOne({_id: "cooling-merge-1"}, {fields: {bayArray: 1}})
         cooling_2 = activeAssembly.findOne({_id: "cooling-merge-2"}, {fields: {bayArray: 1}})
         cooling_3 = activeAssembly.findOne({_id: "cooling-merge-3"}, {fields: {bayArray: 1}})
        // check if engine is available
        if (engine_1.bayArray.length === 1 && coolingNr === engine_1.bayArray[0].machineNr) {
            invokeMoveMachine(oldCanvasId, 'cooling-merge-1')
        } else if (engine_2.bayArray.length === 1 && coolingNr === engine_2.bayArray[0].machineNr) {
            invokeMoveMachine(oldCanvasId, 'cooling-merge-2')
        } else if (engine_3.bayArray.length === 1 && coolingNr === engine_3.bayArray[0].machineNr) {
            invokeMoveMachine(oldCanvasId, 'cooling-merge-3')
        } else  {
            // engine in merge bays are not matching or empty. Checking for free space
            if (cooling_1.bayArray.length === 0 && engine_1.bayArray.length === 0) {
                invokeMoveMachine(oldCanvasId, 'cooling-merge-1')
            } else if (cooling_2.bayArray.length === 0 && engine_2.bayArray.length === 0) {
                invokeMoveMachine(oldCanvasId, 'cooling-merge-2')
            } else if (cooling_3.bayArray.length === 0 && engine_3.bayArray.length === 0) {
                invokeMoveMachine(oldCanvasId, 'cooling-merge-3')
            } else {
                // all available bays for prepared cooling box are engaged
                Bert.alert('All  Bays are occupied', 'danger', 'growl-top-left')
            }
        }
    },


    'click .engine-1-move': (e) => {
        e.preventDefault();
        let oldCanvasId = 'engine-station-1'
        let newCanvasId = "engine-station-2";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .engine-2-move': (e) => {
        e.preventDefault();
        let oldCanvasId = 'engine-station-2'
        let newCanvasId = "engine-station-3";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .engine-3-move': (e) => {
        e.preventDefault();
        let oldCanvasId = 'engine-station-3'
        let newCanvasId = "engine-station-4";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .engine-4-move': (e) => {
        e.preventDefault();
        let oldCanvasId, machine_station_4, engine, engine_1, engine_2, engine_3, cooling_1, cooling_2, cooling_3
        oldCanvasId = 'engine-station-4'
        // checking which merging station is open
        machine_station_4 = activeAssembly.findOne({_id: 'engine-station-4'}, {fields: {bayArray: 1}})
        engine = machine_station_4.bayArray[0].machineNr;
        engine_1 = activeAssembly.findOne({_id: "merge-station-1"}, {fields: {bayArray: 1}})
        engine_2 = activeAssembly.findOne({_id: "merge-station-2"}, {fields: {bayArray: 1}})
        engine_3 = activeAssembly.findOne({_id: "merge-station-3"}, {fields: {bayArray: 1}})
        cooling_1 = activeAssembly.findOne({_id: "cooling-merge-1"}, {fields: {bayArray: 1}})
        cooling_2 = activeAssembly.findOne({_id: "cooling-merge-2"}, {fields: {bayArray: 1}})
        cooling_3 = activeAssembly.findOne({_id: "cooling-merge-3"}, {fields: {bayArray: 1}})
        // check if cooling Box is already in any merge station
        if (cooling_1.bayArray.length === 1 && engine === cooling_1.bayArray[0].machineNr) {
            invokeMoveMachine(oldCanvasId, 'merge-station-1')
        } else if (cooling_2.bayArray.length === 1 && engine === cooling_2.bayArray[0].machineNr) {
            invokeMoveMachine(oldCanvasId, 'merge-station-2')
        } else if (cooling_3.bayArray.length === 1 && engine === cooling_3.bayArray[0].machineNr) {
            invokeMoveMachine(oldCanvasId, 'merge-station-3')
        } else  {
            // cooling box in merge bays are not matching or empty. Checking for free space
            if (engine_1.bayArray.length === 0 && cooling_1.bayArray.length === 0) {
                invokeMoveMachine(oldCanvasId, 'merge-station-1')
            } else if (engine_2.bayArray.length === 0 && cooling_2.bayArray.length === 0) {
                invokeMoveMachine(oldCanvasId, 'merge-station-2')
            } else if (engine_3.bayArray.length === 0 && cooling_3.bayArray.length === 0) {
                invokeMoveMachine(oldCanvasId, 'merge-station-3')
            } else {
                // all available bays for prepared cooling box are engaged
                Bert.alert('All  Bays are occupied', 'danger', 'growl-top-left')
            }
        }
    },

    // Engine Ready enables Team 1 Button to move Engine-cooling to Bay 4

    'click .engine-1-ready-button': (e) => {
        e.preventDefault();
        // arg = 1 engine 1 is ready
        let engine_1, cooling_1
        engine_1 = activeAssembly.findOne({_id: "merge-station-1"}, {fields: {bayArray: 1}})
        cooling_1 = activeAssembly.findOne({_id: "cooling-merge-1"}, {fields: {bayArray: 1}})
        if (engine_1.bayArray.length === 1 && cooling_1.bayArray.length === 1) {
            Meteor.call('engineReady', "merge-station-1", "cooling-merge-1")
        } else {
            Bert.alert('Cooling Box or Engine missing in merge Bay', 'danger', 'growl-top-left')
        }

    },

    'click .engine-2-ready-button': (e) => {
        e.preventDefault();
        let engine_2, cooling_2
        engine_2 = activeAssembly.findOne({_id: "merge-station-2"}, {fields: {bayArray: 1}})
        cooling_2 = activeAssembly.findOne({_id: "cooling-merge-2"}, {fields: {bayArray: 1}})
        if (engine_2.bayArray.length === 1 && cooling_2.bayArray.length === 1) {
            Meteor.call('engineReady', "merge-station-2", "cooling-merge-2")
        } else {
            Bert.alert('Cooling Box or Engine missing in merge Bay', 'danger', 'growl-top-left')
        }
    },

    'click .engine-3-ready-button': (e) => {
        e.preventDefault();
        let engine_3, cooling_3
        engine_3 = activeAssembly.findOne({_id: "merge-station-3"}, {fields: {bayArray: 1}})
        cooling_3 = activeAssembly.findOne({_id: "cooling-merge-3"}, {fields: {bayArray: 1}})
        if (engine_3.bayArray.length === 1 && cooling_3.bayArray.length === 1) {
            Meteor.call('engineReady', "merge-station-3", "cooling-merge-3")
        } else {
            Bert.alert('Cooling Box or Engine missing in merge Bay', 'danger', 'growl-top-left')
        }
    }

})

Template.team_4_over_view.helpers({

    merge_1_result: () => {
        let engine_1, cooling_1;
        try {
            engine_1 = activeAssembly.findOne({_id: "merge-station-1"}, {fields: {machineReady: 1}})
            cooling_1 = activeAssembly.findOne({_id: "cooling-merge-1"}, {fields: {machineReady: 1}})
           //    console.log('merge 1 ', engine_1.machineReady, cooling_1.machineReady)
            if (engine_1.machineReady !== true || cooling_1.machineReady !== true) {
                document.getElementById('merge-1-field').style.display = 'none'
            } else if (engine_1.machineReady === true && cooling_1.machineReady === true) {
                document.getElementById('merge-1-field').style.display = 'block'
            }else {
                document.getElementById('merge-1-field').style.display = 'none'
            }
        } catch (e) { }
    },

    merge_2_result: () => {
        let engine_2, cooling_2;
        try {
            engine_2 = activeAssembly.findOne({_id: "merge-station-2"}, {fields: {machineReady: 1}})
            cooling_2 = activeAssembly.findOne({_id: "cooling-merge-2"}, {fields: {machineReady: 1}})
          //  console.log('merge 2 ', engine_2.machineReady, cooling_2.machineReady)
            if (engine_2.machineReady !== true || cooling_2.machineReady !== true) {
                document.getElementById('merge-2-field').style.display = 'none'
            } else if (engine_2.machineReady === true && cooling_2.machineReady === true) {
                document.getElementById('merge-2-field').style.display = 'block'
            } else {
                document.getElementById('merge-2-field').style.display = 'none'
            }
        } catch (e) { }
    },

    merge_3_result: () => {
            document.addEventListener('DOMContentLoaded', function(event) {
                document.getElementById('merge-3-field').style.display = 'none'
            })
            let engine_3, cooling_3;
            try {
                engine_3 = activeAssembly.findOne({_id: "merge-station-3"}, {fields: {machineReady: 1}})
                cooling_3 = activeAssembly.findOne({_id: "cooling-merge-3"}, {fields: {machineReady: 1}})
               // console.log('merge 3 ', engine_3.machineReady, cooling_3.machineReady)
                if ( engine_3.machineReady === false || cooling_3.machineReady === false) {
                    document.getElementById('merge-3-field').style.display = 'none'
                } else if (engine_3.machineReady === true && cooling_3.machineReady === true) {
                    document.getElementById('merge-3-field').style.display = 'block'
                }else {
                    document.getElementById('merge-3-field').style.display = 'none'
                }
            } catch (e) { }
    },

    coolingBoxReservoir: () => {
        let result = machineCommTable.find({activeCoolingBoxList: true},
            {fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1
                                 }}).fetch();
        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0))
        return result;
    },

    machineReservoir: () => {
        let result = machineCommTable.find({activeEngineList : true},
            {fields: {
                    counter: 1,
                    machineId: 1,
                    timeLine: 1,
                    inLineDate: 1,
                    bayReady: 1
                                   }}).fetch();
        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0));
        return result;
    },

    //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_engine_1: () => {
        let canvasId = "engine-station-1";
        let result = activeAssembly.findOne({_id : canvasId});
        try {
            if (result.bayArray.length === 0) {
                // draw empty field in Bay
                invokeEmptyBay(canvasId)
            } else if (result.bayArray.length === 1) {
                let locator = 'helper draw_fcb...'
                // draw 1 machine in Bay
                let machineNrInBay = result.bayArray[0].machineNr;
                invokeDrawOneMachine(machineNrInBay, canvasId, locator);
            }
        } catch(e) {

        }
    },

    draw_engine_2: () => {
        let canvasId = "engine-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_engine_3: () => {
        let canvasId = "engine-station-3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_engine_4: () => {
        let canvasId = "engine-station-4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_cooling_1: () => {
        let canvasId = "cooling-station-1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_cooling_2: () => {
        let canvasId = "cooling-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_merge_1: () => {
        let canvasId = "merge-station-1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_cooling_merge_1: () => {
        let canvasId = "cooling-merge-1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_merge_2: () => {
        let canvasId = "merge-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_cooling_merge_2: () => {
        let canvasId = "cooling-merge-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_merge_3: () => {
        let canvasId = "merge-station-3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_cooling_merge_3: () => {
        let canvasId = "cooling-merge-3";
        invokeDrawMachineInBay(canvasId)
    },


})

Template.team_4_over_view.events({

    'click .selectedCoolingBox': async function (e) {
        e.preventDefault();
        let selectedCoolingBox = this._id;
        let machineNr = this.machineId;
        let canvasId = "cooling-station-1"
      //  console.log(selectedCoolingBox, machineNr, canvasId)
        let bayStatus = await invokeMachineTest(canvasId)
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedCoolingBox,
                machineNr, canvasId, 'activeCoolingBoxList');
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Cooling Boxes not allowed in Station 1')
        }
    },


    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "engine-station-1"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
    //    console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine,
                machineNr, canvasId, 'activeEngineList');
            invokeDrawNewMachine(machineNr, canvasId)
        } else {
            window.alert('2 Engines in Station 1 are not allowed')
        }
    },


})
