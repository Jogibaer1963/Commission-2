import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');
Meteor.subscribe('pickers');



Template.statistics.helpers({

    pickersTable: () => {
        return pickers.find().fetch();
    },

    analyzePicker: () => {
        return Session.get('chosenPicker')
    },

    detectedSupplyAreas: () => {
        // server returns data from method 'day'
       return Session.get('data');
    },

    createChart: function () {

        // Gather data:
        let  tasksData = Session.get('graphData');
        let categories = Session.get('categories');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart', {
                chart: {
                    height: 300,
                    type: 'line'
                },
                yAxis: {
                    categories: [],
                    title: {
                        enabled: true,
                        text: 'Picking Time in Minutes',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: categories,
                    title: {
                        enabled: true,
                        text: 'Picking per date',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                title: {
                    text: 'L4MSB020'
                     },
                series: [{
                    type: 'line',
                    data: tasksData
                }]
            });
        });
    },

    'selectedPicker': function() {
        const selectedPickers = this._id;
        const selectedPicker = Session.get('selectedPicker');
        if (selectedPicker === selectedPickers) {
            Session.set('chosenPicker', selectedPicker);
            return "selectedArea";
        }
    },

    'selectedSupplyArea': function() {
        const selectedPickers = this._id;
        const selectedPicker = Session.get('analyzeArea');
        if (selectedPicker === selectedPickers) {
         //   Session.set('chosenPicker', selectedPicker);
            return "selectedArea";
        }
    },
});


Template.statistics.events({

    'click .pickersArea': function(e) {
        e.preventDefault();
        Session.set('data', '');
        const selectedPicker = this._id;
        Session.set('selectedPicker', selectedPicker);
    },

    'click .analyzeArea': function(e) {
        e.preventDefault();
        const selectedArea = this._id;
        let picker = Session.get('selectedPicker');
        Session.set('analyzeArea', selectedArea);
        Meteor.call('getData', selectedArea, picker, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                Session.set('graphData', result[0]);
                Session.set('categories', result[1]);
            }
        })
    },

    'click .analyzeDay': (e) => {
        e.preventDefault();
        let _id = Session.get('chosenPicker');
        if (typeof _id === 'undefined') {
            console.log('undefined');
        } else {
            Meteor.call('day', _id, (error, result) => {
                if(error) {
                    console.log('Error', error);
                } else {
                    Session.set('data', result);
                }
            });
        }
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

