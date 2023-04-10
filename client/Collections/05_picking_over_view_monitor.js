Meteor.subscribe('supplyAreas');
Meteor.subscribe('pickingMonitorTable');
const Highcharts = require('highcharts');
import {pickingToDay} from "../../lib/99_functionCollector";



Template.picking_over_view_monitor.helpers({


supplyList: () => {
    let result = supplyAreas.find({active: true}).fetch();
    let returnResult = result.sort((a, b) => {
        return a.supplyPosition - b.supplyPosition;
    });
    Session.set('returnResult', returnResult);
    return returnResult;
},

    machineList: () => {
    let machineResult = [];
    let result = machineCommTable.find({}).fetch()
  //  console.log('Result ', result)

    result.forEach((element) => {
        for (let i = 0; i <= element.supplyAreas.length - 1; ++i ) {
            if (element.supplyAreas[i].active === false) {
                try {
                    element.supplyAreas.splice(element.supplyAreas.indexOf(element.supplyAreas[i]), 1);
                    i-- ;
                } catch {
                }
            } else {
            }
        }
        machineResult.push(element);
    });
    machineResult.forEach((element) => {
        element.supplyAreas.sort(function(a, b) {return a.supplyPosition - b.supplyPosition})
    })
    return _.sortBy(machineResult, 'counter');
},

    teamToday: () => {
        let pickingString = pickingToDay();
        //console.log(pickingString)
        let teamToday = [];
        let supplyResult = []
        let durationResult = [];
        let durationAverage = 0;
        let loopArray = [];
        let dayResult = [];
        let averagePerSupply = [];
        try {
            let result = pickers.find({}, {fields: {[pickingString]: 1}}).fetch();
            result.forEach((element) => {
                if (element[pickingString] !== undefined) {
                    // console.log(element[pickingString]);
                    element[pickingString].forEach((element2) => {
                        teamToday.push(element2)
                    })
                }
            })
            //console.log(teamToday);
            /* Selecting TODAY from all saved picking events */
            /* Counting and building average from today's picking event */
            teamToday.forEach((element) => {
                supplyResult.push(element.supplyArea);
                let duration = (element.duration / 60000).toFixed(0);
                durationResult.push(parseInt(duration));
            })
            /* Counting all supply Areas and build an array with each unique supply Area */
            let uniqueAreas = supplyResult.filter((x, i, a) => a.indexOf(x) === i);
            for (let k = 0; k <= uniqueAreas.length - 1; k++) {
                let counter = 0;
                teamToday.forEach((element) => {
                    if (uniqueAreas[k] === element.supplyArea) {
                        loopArray.push(element.duration);
                        counter++;
                    } else {
                        //   console.log('else');
                    }
                });
                let summary =  (((loopArray.reduce((a,b) => a + b, 0)) / loopArray.length) / 60000).toFixed(0);
                averagePerSupply.push(parseInt(summary));
                loopArray = [];
                dayResult.push(counter);
            }
            // console.log(dayResult)
            let dayCount = dayResult.reduce((a,b) => a + b, 0);
            durationAverage = (durationResult.reduce((a,b) => a + b, 0) / durationResult.length).toFixed(0);
            Session.set('teamDayResult', dayResult);
            Session.set('teamUniqueAreas', uniqueAreas);
            Session.set('teamAveragePerSupply', averagePerSupply)
            //   console.log(dayCount, uniqueAreas)
            return {
                dayCount: dayCount,
                averageDuration: durationAverage,
                uniqueAreas: uniqueAreas.length
            }

        } catch {
        }
    },

    /*  Chart 4 */

    daylieTeamResult: function () {
        // Gather data:
        let cartsCounter = Session.get('teamDayResult');
        let categories = Session.get('teamUniqueAreas');
        let averagePerSupply = Session.get('teamAveragePerSupply');
        //    console.log(averagePerSupply, cartsCounter, categories);
        let average = (averagePerSupply.reduce((a,b) => a + b , 0) / averagePerSupply.length).toFixed(0);
        let annualCarts = cartsCounter.reduce((a,b) => a + b, 0);
        let annualCategories = categories.length;
        let titleText = annualCarts + ' ' + 'Carts picked for ' + annualCategories +
            ' Cost centers with an average of ' + average + ' min';
        console.log(titleText)
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_4', {
                title:
                    {
                        text: titleText,
                        style: {
                            color: '#FF00FF',
                        },
                    },
                tooltip: {
                    shared: true
                },

                chart: {
                    backgroundColor: 'black',
                    style: {
                        fontFamily: '\'Unica One\', sans-serif',

                    },
                    plotBorderColor: '#c7e721',
                    height: 600,
                    width: 1600,
                    zoomType: 'xy'
                },

                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Average Picking Time in min',
                        style: {
                            fontWeight: 'normal',
                            color: '#90ed7d'
                        }
                    }
                },

                xAxis: {
                    categories: categories,
                    title: {
                        enabled: true,
                        text: 'Areas Picked',
                        style: {
                            fontWeight: 'normal',
                            color: '#90ed7d'
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

})