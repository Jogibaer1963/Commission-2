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
        Session.set('result', result);
        let pickingString = pickingToDay();
       // console.log('Picking String ', pickingString);
        result.forEach((element) => {
       //    console.log('element: ', element[pickingString]);
            try {
           dayCount = dayCount + element[pickingString].length;
       //    console.log('day count: ', dayCount);
                } catch {
       //         console.log('error')
                }
            if (typeof  element[pickingString] !== 'undefined') {
            pickingResult[k] = element[pickingString];
       //     console.log(element[pickingString]);
            k ++;
            }
            try {
            for (let i = 0; i <= k; i++) {
                pickingResult[0].concat(pickingResult[i+1]);
       //         console.log('inside loop: ', i, pickingResult[i]);
            }
            } catch {
            //    console.log('error')
            }
        });
     //   console.log(pickingResult);
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
        let averagePerSupply = [];
        let loopArray = [];
        let uniqueAreas = supplyPerDay.filter((x, i, a) => a.indexOf(x) === i);
        for (let k = 0; k <= uniqueAreas.length - 1; k++) {
            let counter = 0;
                resultOfTheDay.forEach((element) => {
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
        let durationAverage = (averagePerSupply.reduce((a,b) => a + b, 0) / averagePerSupply.length).toFixed(0);
        Session.set('averagePerSupply', averagePerSupply);
        Session.set('dayResult', dayResult);
        Session.set('uniqueAreas', uniqueAreas);
      //  console.log(dayCount, durationAverage, uniqueAreas);
           return {
               dayCount: dayCount,
               averageDuration: durationAverage,
               uniqueAreas: uniqueAreas.length
           }
    },

    runningResult: () => {
        let objectCount = [];
        let arraySummery = [];
        let newArray = [];
        let machineResult = [];
        let result = Session.get('result');
        /*
        console.log(result);
        result.forEach((element) => {
            for (let i = 0; i <= element.supplyAreas.length - 1; ++i ) {
                if (element.supplyAreas[i].active === false) {
                    try {
                        element.supplyAreas.splice(element.supplyAreas.indexOf(element.supplyAreas[i]), 1);
                        i-- ;
                    } catch {

                    }
                }
            }
            machineResult.push(element);
        });
        console.log(machineResult);

         */
        let resultObj = Object.keys(result);
        if (resultObj.length > 1) {
            for (let k = 0; k <= resultObj.length -1; k++) {
              let objectArray = result[k];
              objectCount[k] = Object.keys(objectArray);
              objectCount[k].pop();
            }
        } else {
          //  console.log('else')
        }
        let combinedArray = objectCount.flat(1);
        // eliminate _id
        for (let i = 0; i < combinedArray.length; i++) {
            if (combinedArray[i] === "_id") {
                combinedArray.splice(i, 1);
                i--;
            }
        }
       // console.log(combinedArray);
        let uniqueTime = combinedArray.filter((x, i, a) => a.indexOf(x) === i);
        uniqueTime.forEach((element) => {
            let timeObject = element;
            result.forEach((element2) => {
                arraySummery.push(element2[timeObject])
            });
        });
        let annualSummary = arraySummery.flat(1);
      //  console.log(annualSummary);
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
     //   console.log(uniqueSupplyAreas);
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
        Session.set('carts', counter);
        Session.set('totalResultSupply', uniqueSupplyAreas);
        Session.set('totalResultDuration', durationGraph);
    },




    dayChart: function () {
        // Gather data:
        let averagePerSupply = Session.get('averagePerSupply');
        let  tasksData = Session.get('dayResult');
        let categories = Session.get('uniqueAreas');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_1', {
                title: {
                text: 'Picked carts today per Supply Area'
            },
                tooltip: {
                    shared: true
                },
                chart: {
                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 300,
                    width: 900,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
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
        });
    },

    runningAnnualResult: function () {
        // Gather data:
        let averagePerSupply = Session.get('totalResultDuration');
        let cartsCounter = Session.get('carts');
        let categories = Session.get('totalResultSupply');
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_2', {

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



