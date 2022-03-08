import {invokeDrawMachineInBay, invokeMoveMachine} from "../../lib/99_functionCollector";


Template.team_4_merge_station.onRendered(function() {


})

Template.team_4_merge_station.helpers({

    logged_user_team_4: () => {
        try {
        return Meteor.user().username;
        } catch (e) {
            alert("No User is logged in")
        }
    },

    disableButtonMergeOne: () => {
        let status = Session.get('timerStartStop-1');
        if (status === 1) {
            return 'disabled';
        }
    },

    disableButtonMergeTwo: () => {
        let status = Session.get('timerStartStop-2');
        if (status === 1) {
            return 'disabled';
        }
    },

    disableButtonMergeThree: () => {
        let status = Session.get('timerStartStop-3');
        if (status === 1) {
            return 'disabled';
        }
    },

    callTimerMergeOne: () => {
        let result;
        try {
                 result = activeAssembly.findOne({_id: 'merge-station-1'},
                    {fields: {bayAssemblyStatus: 1}});
            if (result.bayAssemblyStatus === 0) {
                // not touched
                Session.set('timerStartStop-1', 0)
            } else if (result.bayAssemblyStatus === 1) {
                // process finished
                Session.set('timerStartStop-1', 1)
                return 'disabled'
            } else if (result.bayAssemblyStatus === 2) {
                Session.set('timerStartStop-1', 2)
                // in merging process
                return 'background-color: #71f323'
            }
        } catch (err) {
        }
    },





    callTimerMergeTwo: () => {
        let result;
        try {
                result = activeAssembly.findOne({_id: 'merge-station-2'},
                    {fields: {bayAssemblyStatus: 1}});
            if (result.bayAssemblyStatus === 0) {
                // not touched
                Session.set('timerStartStop-2', 0)
            } else if (result.bayAssemblyStatus === 1) {
                // process finished
                Session.set('timerStartStop-2', 1)
                return 'disabled'

            } else if (result.bayAssemblyStatus === 2) {
                Session.set('timerStartStop-2', 2)
                // in merging process
                return 'background-color: #71f323'
            }
        } catch (err) {
           }
    },

    callTimerMergeThree: () => {
        let result;
        try {
            result = activeAssembly.findOne({_id: 'merge-station-3'},
                {fields: {bayAssemblyStatus: 1}});
            if (result.bayAssemblyStatus === 0) {
                // not touched
                Session.set('timerStartStop-3', 0)
            } else if (result.bayAssemblyStatus === 1) {
                // process finished
                Session.set('timerStartStop-3', 1)
                return 'disabled'

            } else if (result.bayAssemblyStatus === 2) {
                Session.set('timerStartStop-3', 2)
                // in merging process
                return 'background-color: #71f323'
            }
        } catch (err) {
        }
    },

    pulsingOne: () => {
        let status = Session.get('timerStartStop-1');
        if (status === 1) {
            return 'hidden';
        } else if (status === 2) {
            return 'display';
        } else if (status === 0) {
            return 'hidden';
        }
    },

    pulsingTwo: () => {
        let status = Session.get('timerStartStop-2');
        if (status === 1) {
            return 'hidden';
        } else if (status === 2) {
            return 'display';
        } else if (status === 0) {
            return 'hidden';
        }
    },

    pulsingThree: () => {
        let status = Session.get('timerStartStop-3');
        if (status === 1) {
            return 'hidden';
        } else if (status === 2) {
            return 'display';
        } else if (status === 0) {
            return 'hidden';
        }
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

    draw_merge_2: () => {
        let canvasId = "merge-station-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_merge_3: () => {
        let canvasId = "merge-station-3";
        invokeDrawMachineInBay(canvasId)
    },


})





Template.team_4_merge_station.events({

    'click .merge-1-start-button': (e) => {
        e.preventDefault();
        let userId;
        let timerStartStop = Session.get('timerStartStop-1')
        try {
            userId = Meteor.user().username;
        } catch (e) {
            alert("No User is logged in")
        }
        if (timerStartStop === 0) {
            // not touched but ready to merge
            Meteor.call('timerStart', 'merge-station-1',timerStartStop, userId)
        } else if (timerStartStop === 1) {
            // components have already been merged
        } else if (timerStartStop === 2) {
            // merging is finished, stop timer
            Meteor.call('timerStart', 'merge-station-1',timerStartStop, userId)
        }
    },

    'click .merge-2-start-button': (e) => {
        e.preventDefault();
        let timerStartStop = Session.get('timerStartStop-2')
        let userId = Meteor.user().username;
        if (timerStartStop === 0) {
            // not touched but ready to merge
            Meteor.call('timerStart', 'merge-station-2',timerStartStop, userId)
        } else if (timerStartStop === 1) {
            // components have already been merged
        } else if (timerStartStop === 2) {
            // merging is finished, stop time
            Meteor.call('timerStart', 'merge-station-2',timerStartStop, userId)
        }
    },

    'click .merge-3-start-button': (e) => {
        e.preventDefault();
        let timerStartStop = Session.get('timerStartStop-3')
        let userId = Meteor.user().username;
        if (timerStartStop === 0) {
            // not touched but ready to merge
            Meteor.call('timerStart', 'merge-station-3',timerStartStop, userId)
        } else if (timerStartStop === 1) {
            // components have already been merged
        } else if (timerStartStop === 2) {
            // merging is finished, stop time
            Meteor.call('timerStart', 'merge-station-3',timerStartStop, userId)
        }
    },

    'click .engine-4-move': (e) => {
        e.preventDefault();
        let oldCanvasId, newCanvasId, result_1, result_2, result_3
        oldCanvasId = 'engine-station-4'
        // checking which merging station is open
        result_1 = activeAssembly.findOne({_id: "merge-station-1"}, {fields: {bayArray: 1}});
        result_2 = activeAssembly.findOne({_id: "merge-station-2"}, {fields: {bayArray: 1}});
        result_3 = activeAssembly.findOne({_id: "merge-station-3"}, {fields: {bayArray: 1}});
        //   console.log(result_1.bayArray.length, result_2.bayArray.length)
        if (result_1.bayArray.length === 1 && result_2.bayArray.length === 1 && result_3.bayArray.length === 1) {
            // Machine is Station 1 and 2 detected triggers windows alert all bays are engaged

        } else if (result_1.bayArray.length === 0) {
            // No Machine in Station 1 detected
            newCanvasId = 'merge-station-1'
        } else if (result_2.bayArray.length === 0) {
            // No Machine in Station 2
            newCanvasId = 'merge-station-2'
        } else if (result_3.bayArray.length === 0) {
            // No Machine in Station 2
            newCanvasId = 'merge-station-3'
        }
        //   console.log(oldCanvasId, newCanvasId)
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },



})