import { calcTime } from '../../lib/99_functionCollector.js';
import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');

Template.average_time_in_bay.helpers({

    average_time: () => {
        //Declare some variables and create machineArray
        let result, comingIn, goingOut, machineResult, minutes, bayId, position;
        let machineArray = [];

        //Find all of the machines that have entered the line by a specified date ("2021-08-31")
        //Date can be changed here
        result = machineCommTable.find({activeAssemblyLineList: false, inLineDate: {$gt: "2021-10-04"}},
            {fields: {bayReady: 1}}).fetch()

        //Cycle through the machines to grab data
        result.forEach((element) => {
            //Cycle through each bay a machine has traveled through
            element.bayReady.forEach(function (element_2) {
                //If the machine has been in a bay we need to store data
                if (element_2.bayStatus === 1) {
                    comingIn = element_2.bayDateLandingUnix
                    goingOut = element_2.bayDateLeavingUnix
                    bayId = element_2.bayName;
                    position = element_2.bayPosition

                    //Call function to calculate time / eliminate time difference overnight, weekends
                    minutes = calcTime(goingOut, comingIn);

                    //Add relevant data to machineResult
                    machineResult = {
                        bay: bayId,
                        timeSpent: minutes,
                        bayPosition: position
                    }

                    //Add this instance of machineResult to our machineArray
                    machineArray.push(machineResult)
                }
            })
        });

        //Sort  machineArray by bay
        machineArray.sort((a, b) => (a.bayPosition > b.bayPosition) ? 1 : ((b.bayPosition > a.bayPosition) ? -1 : 0))

        //Session.set('resultArray', machineArray)

        //Create arrays to store values in
        let retentionTime = [];
        let badMovesGraph = [];
        let durationGraph = [];

        //???
        machineArray.forEach((element) => {
            retentionTime.push(element.bay)
        })
        let uniqueBays = Array.from(new Set(retentionTime));

        //We need to gather all of our information for the graphs into arrays
        //Cycle through each bay
        uniqueBays.forEach((element) => {
            let i = 1;
            let badMoves = 0;
            let duration = 0;

            //Cycle through each machine that has been through the current bay we are on
            machineArray.forEach((element2) => {
                if (element === element2.bay) {
                    //Don't add times below 90 to our Average Time spent
                    if (element2.timeSpent === undefined || element2.timeSpent <= 90) {
                        //If time is less than 90, we assume it was a bad move
                        badMoves++;
                    } else {
                        //Add to our duration and i
                        //i will be used to get our average
                        let minutes = parseInt(element2.timeSpent);
                        duration = duration + minutes;
                        i++

                    }
                }
            });
            if (duration < 100000) {
                durationGraph.push(parseInt((duration / i).toFixed()));
            }
            //Add the average duration to our Average Time array


            //Add # of bad moves to our Bad Moves array
            badMovesGraph.push(parseInt((badMoves).toFixed()));
        });

        //Create our session to gather data from
        Session.set('uniqueBays', uniqueBays)
        Session.set('durationGraph', durationGraph)
        Session.set('badMovesGraph', badMovesGraph)

        // Gather data: This data is used to fill our charts
        let AveragePerBay = Session.get('durationGraph') //Contains our Average Time Per Bay (Y axis 1)
        let BadMovesPerBay = Session.get('badMovesGraph') //Contains our Bad Moves Per Bay (Y axis 2)
        let Categories = Session.get('uniqueBays'); //Contains our Unique Bays (X axis 1 & 2)

        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:

            //Average Time Chart ------------------------------------------------------------------------
            Highcharts.chart('chart_1', {
                title: {
                    text: 'Average Time in min spent per Bay (Machines below 90 min are ignored)'
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
                    categories: Categories,
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
                        data: AveragePerBay
                    },
                ]
            })

            //Bad Moves chart ----------------------------------------------------------------------------
            Highcharts.chart('chart_2', {
                title: {
                    text: 'Unreliable Moves per Bay in counts (how often they failed pushing buttons)'
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
                        text: 'Number of Unreliable Moves',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: Categories,
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
                        name: 'Number of bad moves',
                        type: 'column',
                        data: BadMovesPerBay
                    },
                ]
            });
        })
    },
})