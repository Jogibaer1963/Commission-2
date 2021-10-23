import { calcTime } from '../../lib/99_functionCollector.js';
import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');




Template.average_time_in_bay.helpers({

    average_time: function () {

        let result, firstStage, timeSpent, calculatedTime, comingIn, goingOut, machineResult, machineNr,
            minutes, bayId, position;
        let machineArray = [];
        result = machineCommTable.find({activeAssemblyLineList : false, inLineDate : {$gt: "2021-08-31"}}).fetch()
        result.forEach((element) => {
            firstStage = element.bayReady;
            firstStage.forEach((element_2) => {
                if (element_2.bayStatus === 1) {
                    // convert Unix milliseconds into minutes (60)
                    //  minutes = ((element_2.bayDateLeavingUnix - element_2.bayDateLandingUnix) / 60000).toFixed(0);
                    comingIn = (element_2.bayDateLanding)
                    goingOut = (element_2.bayDateLeaving)
                    machineNr = (element.machineId)
                    bayId = element_2.bayName;
                    position = element_2.bayPosition
                    // convert Unix milliseconds into minutes (60)
                    //minutes = ((element_2.bayDateLeavingUnix - element_2.bayDateLandingUnix) / 60000).toFixed(0);
                    //Call function to calculate our time

                    minutes = calcTime(element_2.bayDateLeavingUnix, element_2.bayDateLandingUnix);

                    machineResult = {
                        bay: bayId,
                        machineId: machineNr,
                        timeSpent: minutes,
                        comingIn: comingIn,
                        goingOut: goingOut,
                        bayPosition: position
                    }
                    machineArray.push(machineResult)
                }
            } )
        })
        let resultArray = _.sortBy(machineArray, 'goingOut')
        //   console.log(resultArray)
       // return resultArray.reverse();

        // Gather data:
        let averagePerSupply = Session.get('averagePerSupply');
        let tasksData = Session.get('dayResult');
        let categories = Session.get('uniqueAreas');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_1', {
                title: {
                    text: 'Average Time in min spent per Bay'
                },
                tooltip: {
                    shared: true
                },
                chart: {
                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 400,
                    width: 700,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {
                        enabled: true,
                        text: 'Average Picking Time per Cart',
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
                series: [
                    {
                        name: 'Average picking time in min',
                        type: 'column',
                        data: averagePerSupply
                    },
                    {
                        name: 'Carts Picked',
                        type: 'spline',
                        data: tasksData
                    }
                ]
            });

        })
    }

})