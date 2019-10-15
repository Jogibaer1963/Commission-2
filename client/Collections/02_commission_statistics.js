import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');
Meteor.subscribe('pickers');

Template.graphs.helpers({
    createChart: function () {
        // Gather data:
        let  tasksData = [{
            y: 5,
            name: "Incomplete"
        }, {
            y: 3,
            name: "Complete"
        }, {
            y: 3,
            name: "unknown"
        }];
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart', {
                series: [{
                    type: 'line',
                    data: tasksData
                }]
            });
        });
    }
});




Template.statistics.helpers({

    pickersTable: () => {
        return pickers.find().fetch();
    }

});


Template.statistics.events({

    'submit .inputNewPicker': (e) => {
        (e).preventDefault();
        let newPicker = e.target.newPicker.value;
        console.log(newPicker);
        Meteor.call('addPicker', newPicker);
        e.target.newPicker.value = '';
    },




    'click .startAnalyze': (e) => {
        e.preventDefault();
        Meteor.call('analyze');
    }

});

