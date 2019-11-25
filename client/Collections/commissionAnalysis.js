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

    pickersMonthChartResult: function () {
        // Gather data:
        let averagePerSupply = Session.get('monthDuration');
        let cartsCounter = Session.get('monthCart');
        let categories = Session.get('monthSupply');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_4', {

                title: {
                    text: ' Overview of picked carts and average picking time for Month'
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
        Session.set('fromRange', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
        Session.set('monthSupply',  false);
        Session.set('monthDuration',  false);
        Session.set('monthCart',  false);
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

    'submit .choseRange': (e) => {
        e.preventDefault();
        let rangeFrom = e.target.fromDate.value;
        let rangeTo = e.target.toDate.value;
        console.log(rangeFrom, rangeTo)

    },

    'submit .choseDate': (e) => {
        e.preventDefault();
        let day = e.target.specificDate.value;
        console.log(day);

    },

    'submit .choseMonth': function (e) {
        e.preventDefault();
        let picker = Session.get('chosenPicker');
        let month = e.target.specificMonth.value;
        let chosenMonth = month.slice(5, 8);
        let chosenYear = month.slice(0, 4);
        let trueMonth = ('0' + (parseInt(chosenMonth) -1)).slice(-2) ; // month start with 0 ** January = 00
        // build range for specific month dd-week day--month-year
        let monthStart = trueMonth + chosenYear;
        Meteor.call('chosenMonth',monthStart, picker, function(err, response) {
            if (response) {
                Session.set('monthSupply', response[0]);
                Session.set('monthDuration', response[1]);
                Session.set('monthCart', response[2]);
            } else {
            }
        })
    }



});

Template.analysisOverView.onDestroyed(() => {
    Session.set('fromRange', false);
    Session.set('specificDate', false);
    Session.set('specificMonth', false);
    Session.set('pickersAnnualResult', false);
    Session.set('chosenPicker', false);
    Session.set('monthSupply',  false);
    Session.set('monthDuration',  false);
    Session.set('monthCart',  false);

});