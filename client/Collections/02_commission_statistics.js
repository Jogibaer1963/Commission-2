import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');
Meteor.subscribe('pickers');



Template.statistics.helpers({

    pickersTable: () => {
        return pickers.find().fetch();
    },

    'selectedPicker': function() {
        const selectedPickers = this._id;
        const selectedPicker = Session.get('selectedPicker');
        if (selectedPicker === selectedPickers) {
            Session.set('chosenPicker', selectedPicker);
            return "selectedArea";
        }
    },

    analyzePicker: () => {
        return Session.get('chosenPicker')
    },

    createChart: function () {

        let honolulu =  [{y: 5, name: "Incomplete"},
                         {y: 3, name: "Complete" },
                         {y: 4, name: "unknown"}];

            Session.set('honolulu', honolulu);

            let result = Session.get('honolulu');

        // Gather data:
        let  tasksData = result;
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


Template.statistics.events({

    'click .pickersArea': function(e) {
        e.preventDefault();
        const selectedPicker = this._id;
        Session.set('selectedPicker', selectedPicker);
    },

    'click .analyzeDay': (e) => {
        e.preventDefault();
        let _id = Session.get('chosenPicker');
        Meteor.call('day', _id);

    },

    'click .analyzeWeek': (e) => {
        e.preventDefault();
        let _id = Session.get('chosenPicker');
        Meteor.call('week', _id);

    },

    'click .analyzeMonth': (e) => {
        e.preventDefault();
        let _id = Session.get('chosenPicker');
        Meteor.call('month', _id);

    },

    'click .analyzeYear': (e) => {
        e.preventDefault();
        let _id = Session.get('chosenPicker');
        Meteor.call('year', _id);

    },



});

