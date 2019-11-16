import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');
Meteor.subscribe('pickers');

Template.dailyResult.helpers({

    resultToday: () => {
        let dayCount = 0;
        let k = 0;
        let pickingResult = [];
        let resultOfTheDay = [];
        let result = pickers.find({}).fetch();
        let pickingString = pickingToDay();
        result.forEach((element) => {
            try {
           dayCount = dayCount + element[pickingString].length;
                } catch {

                }
            if (typeof  element[pickingString] !== 'undefined') {
            pickingResult[k] = element[pickingString];
            k ++;
            }
            for (let i = 0; i <= k; i++) {
                pickingResult[0].concat(pickingResult[i+1]);
            }
        });
        pickingResult.forEach((element) => {
            element.forEach((element2) => {
                resultOfTheDay.push(element2);
            });
        });
        let supplyPerDay = [];
        resultOfTheDay.forEach((element) => {
            supplyPerDay.push(element.supplyArea);
        });
        let dayResult = [];
        let durationPerDay = [];
        let uniqueAreas = supplyPerDay.filter((x, i, a) => a.indexOf(x) === i);
        for (let k = 0; k <= uniqueAreas.length - 1; k++) {
            let counter = 1;
                resultOfTheDay.forEach((element) => {
                    if (uniqueAreas[k] === element.supplyArea) {
                        durationPerDay.push(element.duration);
                        counter++;
                    }
                });
            dayResult.push(counter);
        }
        Session.set('dayResult', dayResult);
        Session.set('uniqueAreas', uniqueAreas);
       let durationAverage = ((durationPerDay.reduce((a,b) => a + b, 0) / durationPerDay.length) / 60000).toFixed(0);




       return {
           dayCount:dayCount,
           averageDuration:durationAverage
       };


    },

    dayChart: function () {
        // Gather data:
        let  tasksData = Session.get('dayResult');
        let categories = Session.get('uniqueAreas');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_1', {
                chart: {
                    height: 300,
                    width: 900,
                    type: 'line'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Picked Today',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: categories,
                    title: {
                        enabled: true,
                        text: 'Picked today',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                title: {
                    text: 'Picked carts today per Supply Area'
                },
                series: [{
                    type: 'line',
                    data: tasksData
                }]
            });
        });
    },



});

function pickingToDay () {
    let today = Date.now();
    let timeResult = new Date(today);
    let pickingMonth = timeResult.getMonth();
    let pickingDate = timeResult.getDate();
    if (pickingDate < 10) {
        pickingDate = "0" + timeResult.getDate()
    }
    let pickingDay = "0" + timeResult.getDay() ;
    let pickingYear = timeResult.getFullYear();
    return (pickingDate + pickingDay + pickingMonth + pickingYear);
}

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

    areasCount: () => {
        // server returns data from method 'day'
        return Session.get('resultCount');

    },

    average: () => {
        // server returns data from method 'day'
        return Session.get('average');
    },

    dayChart: function () {
        // Gather data:
        let  tasksData = Session.get('dayResult');
        let categories = Session.get('uniqueAreas');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_1', {
                chart: {
                    height: 300,
                    width: 900,
                    type: 'line'
                },
                yAxis: {
                    categories: [],
                        title: {enabled: true,
                            text: 'Picked Today',
                            style: {
                                fontWeight: 'normal'
                            }
                        }
                },
                xAxis: {
                    categories: categories,
                    title: {
                        enabled: true,
                        text: 'Picked today',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                title: {
                    text: 'Per Day   Supply Area'
                     },
                series: [{
                    type: 'line',
                    data: tasksData
                }]
            });
        });
    },


    weekChart: function () {
        // Gather data:
        let  tasksData = Session.get('graphData');
        let categories = Session.get('categories');
        let supplyArea = Session.get('analyzeArea');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_2', {
                chart: {
                    height: 300,
                    width: 900,
                    type: 'line'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
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
                    text: 'Per Week   Supply Area : ' + supplyArea,
                },
                series: [{
                    type: 'line',
                    data: tasksData
                }]
            });
        });
    },


    monthChart: function () {
        // Gather data:
        let  tasksData = Session.get('graphData');
        let categories = Session.get('categories');
        let supplyArea = Session.get('analyzeArea');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_3', {
                chart: {
                    height: 300,
                    width: 900,
                    type: 'line'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
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
                    text: 'Per Month   Supply Area : ' + supplyArea,
                },
                series: [{
                    type: 'line',
                    data: tasksData
                }]
            });
        });
    },


   yearChart: function () {
        // Gather data:
        let  tasksData = Session.get('graphData');
        let categories = Session.get('categories');
        let supplyArea = Session.get('analyzeArea');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_4', {
                chart: {
                    height: 300,
                    width: 900,
                    type: 'line'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Picking Time in Minutes',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep' ],
                    title: {
                        enabled: true,
                        text: 'Picking per date',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                title: {
                    text: 'Per Year   Supply Area : ' + supplyArea,
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
        if (typeof selectedPicker === 'undefined') {
            console.log('undefined');
        } else {
            Meteor.call('pickerReturn', selectedPicker, (error, result) => {
                if(error) {
                    console.log('Error', error);
                } else {
                    console.log(result);
                    Session.set('data', result);
                }
            });
        }

    },

    'click .analyzeArea': function(e) {
        e.preventDefault();
        let durationResult = [];
        const selectedArea = this._id;
        let picker = Session.get('selectedPicker');
        Session.set('analyzeArea', selectedArea);
        Meteor.call('getData', selectedArea, picker, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                let i = 0;
                Session.set('resultCount', result[0]);
                result[1].forEach((element) => {
                    durationResult.push(parseInt(element));
                    i =  i + parseInt(element);
                });
                let average = i /result[1].length;
                console.log('average: ', i);
                Session.set('average', average);
                console.log('data return : ', durationResult);
                Session.set('graphData', durationResult);
                Session.set('categories', result[2]);
            }
        })
    },

});

