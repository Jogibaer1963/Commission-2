Meteor.subscribe('pickers');
const Highcharts = require('highcharts');

Template.analysisOverView.helpers({

    pickers: () => {
        return pickers.find({}, {fields: {_id: 1}}).fetch();
    },

    chosenPicker: () => {
        return Session.get('chosenPicker');
    },

    pickersResult: () => {
        let chosenPicker = Session.get('chosenPicker');
            if (chosenPicker) {
              let result = pickers.find({_id: chosenPicker}).fetch();
                Session.set('pickersAnnualResult', result);
            }
    },

    fromRange: () => {
        return Session.get('fromRange')
    },

    specificDate: () => {
        return Session.get('specificDate')
    },

    specificMonth: () => {
        return Session.get('specificMonth')
    },

    pickersAnnualResult: () => {
        let arraySummery = [];
        let newArray = [];
        let sessionResult = Session.get('pickersAnnualResult');
        try {
        let result = sessionResult[0];
        let resultObj = Object.keys(result);
        resultObj.pop();
        resultObj.forEach((element) => {
           arraySummery.push(result[element]);
        });
        } catch {}
        let annualSummary = arraySummery.flat(1);
        annualSummary.forEach((element) => {
           try {
               newArray.push(element.supplyArea);
           } catch {
           }
        });
        let totalDuration = [];
           let durationGraph = [];
           let counter = [];
           let uniqueSupplyAreas = newArray.filter((x, i, a) => a.indexOf(x) === i);
           uniqueSupplyAreas.forEach((element) => {
           //  console.log(element);
           let i = 1;
           annualSummary.forEach((element2) => {
               try {
                   if (element === element2.supplyArea) {
                       //  console.log(element, element2.duration);
                       totalDuration.push(element2.duration);
                       i++
                       //  console.log(totalDuration);
                   } else {
                       //       console.log('else')
                   }
               } catch {
               }
           });
           let averageDuration = ((totalDuration.reduce((a,b) => a + b, 0) / totalDuration.length) / 60000).toFixed(0);
           counter.push(i);
           durationGraph.push(parseInt(averageDuration));
           totalDuration = [];
           i = 1;
       });

       Session.set('pickersAnnualCart', counter);
       Session.set('pickersAnnualSupplyAreas', uniqueSupplyAreas);
       Session.set('pickersAnnualDuration', durationGraph);

    },

    pickersAnnualChartResult: function () {
        // Gather data:
        let averagePerSupply = Session.get('pickersAnnualDuration');
        let cartsCounter = Session.get('pickersAnnualCart');
        let categories = Session.get('pickersAnnualSupplyAreas');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_3', {

                title: {
                    text: 'Annual Overview of picked carts and average picking time'
                },

                tooltip: {
                    shared: true
                },

                chart: {

                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',


                    height: 500,
                    width: 900,
                    zoomType: 'xy'
                },

                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Picking Time in min',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },

                xAxis: {
                    categories: categories,
                    title: {
                        enabled: true,
                        text: 'Areas Picked',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },

                series: [
                    {
                        name: 'Average picking time in min',
                        type: 'column',
                        data: averagePerSupply
                    },
                    {
                        name: 'Carts picked',
                        type: 'spline',
                        data: cartsCounter
                    }
                ]
            });
        });
    },

});


Template.analysisOverView.events({

    'click .pickersName': function(e) {
        e.preventDefault();
        let pickersName = this._id;
        Session.set('chosenPicker', pickersName);
    },

    'change #fromRange': (e) => {
        e.preventDefault();
        Session.set('fromRange', true);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
    },

    'change #specificDate': (e) => {
        e.preventDefault();
        Session.set('fromRange', false);
        Session.set('specificDate', true);
        Session.set('specificMonth', false);
    },

    'change #specificMonth': (e) => {
        e.preventDefault();
        Session.set('fromRange', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', true);
    },




});

Template.analysisOverView.onDestroyed(() => {
    Session.set('fromRange', false);
    Session.set('specificDate', false);
    Session.set('specificMonth', false);
    Session.set('pickersAnnualResult', false);
    Session.set('chosenPicker', false);

});