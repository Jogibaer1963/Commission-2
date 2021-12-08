import {invokeDrawMachineInBay} from "../../lib/99_functionCollector";


Template.team_4_merge_station.onRendered(function() {


})

Template.team_4_merge_station.helpers({

    logged_user_team_4: () => {
        return Meteor.user().username;
    },


    disableButtonMergeOne: () => {
        let status = Session.get('timerStartStop-1');
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

    disableButtonMergeTwo: () => {
        let status = Session.get('timerStartStop-2');
        if (status === 1) {
            return 'disabled';
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

})





Template.team_4_merge_station.events({

    'click .merge-1-start-button': (e) => {
        e.preventDefault();
        let timerStartStop = Session.get('timerStartStop-1')
        let userId = Meteor.user().username;
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
    }


})