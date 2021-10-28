import { calcTime } from '../../lib/99_functionCollector.js';
import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');




Template.average_time_in_bay.helpers({

    average_time: function () {
        let result, comingIn, goingOut, machineResult, minutes, bayId, position;
        let machineArray = [];
        result = machineCommTable.find({inLineDate: {$gt: "2021-08-31"}},
            {fields: {bayReady: 1}}).fetch()
        result.forEach((element) => {
            if (element.bayReady === undefined) {

            } else {
                element.bayReady.forEach(function (element_2) {
                    if (element_2.bayStatus === 1) {
                        comingIn = element_2.bayDateLandingUnix
                        goingOut = element_2.bayDateLeavingUnix
                        bayId = element_2.bayName;
                        position = element_2.bayPosition
                        //Call function to calculate time / eliminate time difference overnight, weekends
                        minutes = calcTime(goingOut, comingIn);
                        machineResult = {
                            bay: bayId,
                            timeSpent: minutes,
                            bayPosition: position
                        }
                        machineArray.push(machineResult)
                    }
                })
            }

        });
        machineArray.sort((a, b) => (a.bayPosition > b.bayPosition) ? 1 : ((b.bayPosition > a.bayPosition) ? -1 : 0))
        Session.set('resultArray', machineArray)
        let retentionTime = [];
        let durationGraph = [];
        machineArray.forEach((element) => {
            retentionTime.push(element.bay)
        })
        let uniqueBays = Array.from(new Set(retentionTime));
        uniqueBays.forEach((element) => {
            let i = 1;
            let duration = 0;
            machineArray.forEach((element2) => {
                if (element === element2.bay) {
                    if (element2.timeSpent === undefined || element2.timeSpent <= 160) {
                        // values below 160 minutes are being ignored because too short of time in bay
                    } else {
                        let minutes = parseInt(element2.timeSpent);
                        duration = duration + minutes;
                        i++
                    }
                }
            });
            durationGraph.push(parseInt((duration / i).toFixed()));
        });
        // console.log(uniqueBays)
        Session.set('uniqueBays', uniqueBays)
        Session.set('durationGraph', durationGraph)
        // Gather data:
        let averagePerBay = Session.get('durationGraph')
        //  let tasksData = Session.get('dayResult');
        let categories = Session.get('uniqueBays');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_1', {
                title: {
                    text: 'Average Time in min spent per Bay (Machines below 160 min are ignored)'
                },
                tooltip: {
                    shared: true
                },
                chart: {
                    style: {
                        fontFamily: '\'Utica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 400,
                    width: 1000,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {
                        enabled: true,
                        text: 'Average Time per Bay',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: categories,
                    title: {
                        enabled: false,
                        text: '',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: 'Average time in min',
                        type: 'column',
                        data: averagePerBay
                    },
                ]
            });
        })

    },
/*
    unreliable_chart: () => {
        let uniqueBays = Session.get('uniqueBays')
        let workArray = Session.get('resultArray')
        console.log(uniqueBays)
        console.log(workArray)
        let timeCount = []
        let countArray = []
        let countLength;
        uniqueBays.forEach((element) => {
            workArray.forEach((element_2) => {
                if (element === element_2.bay) {
                    if (element_2.timeSpent <= 160) {
                        // values below 160 minutes are being ignored because too short of time in bay
                        timeCount.push(element_2.timeSpent)
                    } else {
                        //  console.log(element, element2.timeSpent)
                    }
                }
                countLength = timeCount.length;
                console.log(countLength)
                countArray.push(countLength)
                countLength = []
            });
           // console.log(countArray)
        })

      // console.log(countArray)
        // Gather data:
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_2', {
                title: {
                    text: 'Unreliable Numbers per Bay in counts (how often they failed pushing buttons)'
                },
                tooltip: {
                    shared: true
                },
                chart: {
                    style: {
                        fontFamily: '\'Utica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 400,
                    width: 1000,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {
                        enabled: true,
                        text: 'Average Time per Bay',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: [],
                    title: {
                        enabled: false,
                        text: '',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: 'Average time in min',
                        type: 'column',
                        data: []
                    },
                ]
            });

        })
    }

 */
})