import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');

Template.statisticsChoice.helpers({

    createChart: function () {
        // Gather data:


          let  tasksData = [{
                y: 5,
                name: "Incomplete"
            }, {
                y: 3,
                name: "Complete"
            }];
        // Use Meteor.defer() to craete chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart', {
                series: [{
                    type: 'pie',
                    data: tasksData
                }]
            });
        });
    }


});


Template.statisticsChoice.events({

    'click .startAnalyze': (e) => {
        e.preventDefault();
        Meteor.call('analyze');
    }

});

