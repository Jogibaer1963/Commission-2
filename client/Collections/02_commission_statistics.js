import { Template } from 'meteor/templating';
import {duration} from "moment";
const Highcharts = require('highcharts');
Meteor.subscribe('pickers');

Session.set('errorPickingDate', false);
Session.set('01-supplyMachine', false);

Template.dailyResult.helpers({

    loggedInUser: () => {
        const loggedUser = Meteor.user();
        Session.set('loggedUser', loggedUser.username);
        return loggedUser;
    },

    /* ------------------------------------------------ Result per Day -----------------------*/

    resultToday: () => {
        let loggedUser = Session.get('loggedUser');
        let pickingString = pickingToDay();
        let supplyResult = []
        let durationResult = [];
        let resultOfTheDay = [];
        let durationAverage = 0;
        let loopArray = [];
        let dayResult = [];
        let averagePerSupply = [];
        try {
            let result = pickers.findOne({_id: loggedUser}); /* Find user */
            Session.set('personalResult', result);
            let pickingResult = Object.entries(result);

            /* Selecting TODAY from all saved picking events */
            pickingResult.forEach((element) => {
                if (element[0] === pickingString) {
                    resultOfTheDay = element[1]
                }
            })

            /* Counting and building average from todays picking event */
            resultOfTheDay.forEach((element) => {
                supplyResult.push(element.supplyArea);
                let duration = (element.duration / 60000).toFixed(0);
                durationResult.push(parseInt(duration));
            })
            durationResult.forEach((element) => {
                durationAverage = durationAverage + element;
            })

            /* Counting all supply Areas and build an array with each unique supply Area */
            let uniqueAreas = supplyResult.filter((x, i, a) => a.indexOf(x) === i);
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
            let dayCount = dayResult.reduce((a,b) => a + b, 0);
            durationAverage = (durationResult.reduce((a,b) => a + b, 0) / durationResult.length).toFixed(0);
            Session.set('dayResult', dayResult);
            Session.set('uniqueAreas', uniqueAreas);
            Session.set('averagePerSupply', averagePerSupply)
            return {
                dayCount: dayCount,
                averageDuration: durationAverage,
                uniqueAreas: uniqueAreas.length
            }
        } catch {
        }
    },

    /* ----------------------------------  Chart for result per Day ------------------------------- */

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

    /*  ---------------------------------Personal Result Summary of the Year ------------------------------ */


    personalYearResult: () => {
        let loggedUser = Session.get('loggedUser');
        let fiscalYear = '2020090401' //ToDo : fiscalYear als Variable
        let arraySummery = [];
        let newArray = [];
        try {
            let result = pickers.findOne({_id: loggedUser});
            delete result._id;
            delete result.active;
            let resultObj = Object.entries(result);
            /* find dates after fiscal year change */
            if (resultObj.length > 1) {
                for (let k = 0; k <= resultObj.length - 1; k++) {
                    if (resultObj[k] >= fiscalYear) {
                        resultObj[k].shift();
                        let cleanArray = resultObj[k];
                        cleanArray.forEach((element2) => {
                            for (let j = 0; j <= element2.length - 1; j++)
                                arraySummery.push(element2[j])
                        })
                    }
                }
            } else {
                //console.log('else')
            }
            arraySummery.forEach((element) => {
                newArray.push(element.supplyArea)
            })
        } catch (e) {
            // console.log(e)
        }

        /* zusammenfassen der supply areas mit carts zählung und gesamtzeit */

        let durationGraph = [];
        let counter = [];
        let uniqueSupplyAreas = newArray.filter((x, i, a) => a.indexOf(x) === i);
        try {
            uniqueSupplyAreas.forEach((element) => {
                let i = 1;
                let duration = 0;
                arraySummery.forEach((element2) => {
                    if (element === element2.supplyArea) {
                        let minutes = parseInt(((element2.duration) / 60000).toFixed(0));
                        duration = duration + minutes;
                        i++
                    }
                });
                counter.push(i);
                durationGraph.push(parseInt((duration / i).toFixed()));
            });
        } catch (e) {
            // console.log(e)
        }
        Session.set('carts', counter);
        Session.set('totalResultSupply', uniqueSupplyAreas);
        Session.set('totalResultDuration', durationGraph);
    },

    personalYearResultGraph: function () {
        // Gather data:
        let averagePerSupply = Session.get('totalResultDuration');
        let cartsCounter = Session.get('carts');
        let categories = Session.get('totalResultSupply');
    //    console.log(averagePerSupply, cartsCounter, categories);
        let average = (averagePerSupply.reduce((a,b) => a + b , 0) / averagePerSupply.length).toFixed(0);
        let annualCarts = cartsCounter.reduce((a,b) => a + b, 0);
        let annualCategories = categories.length;
        let titleText = annualCarts + ' ' + 'Carts picked for ' + annualCategories + ' Cost centers with an average of ' + average + ' min';
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_2', {

                title: {
                    text: titleText
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
                    title: {enabled: true,
                        text: 'Average Picking Time in min',
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

/*  Compare to last Fiscal Year same time frame */


    personalLastYearResult: () => {
        let loggedUser = Session.get('loggedUser');
        let newFiscalYear = '2020090401' //ToDo : newFiscalYear from table
        let lastFiscalYear = '2019090401' //ToDo : lastFiscalYear from table
        let arraySummary = [];
        let newArray = [];
        try {
            let result = pickers.findOne({_id: loggedUser});
            delete result._id;
            delete result.active;
            let resultObj = Object.entries(result);
            /* find dates after fiscal year change */
            if (resultObj.length > 1) {
                for (let k = 0; k <= resultObj.length - 1; k++) {
                    if (resultObj[k] >= lastFiscalYear && resultObj[k] <= newFiscalYear) {
                        resultObj[k].shift();
                        let cleanArray = resultObj[k];
                        cleanArray.forEach((element2) => {
                            for (let j = 0; j <= element2.length - 1; j++)
                                arraySummary.push(element2[j])
                        })
                    }
                }
            } else {
                //console.log('else')
            }
            arraySummary.forEach((element) => {
                newArray.push(element.supplyArea)
            })
        } catch (e) {
            // console.log(e)
        }

        /* zusammenfassen der supply areas mit carts zählung und gesamtzeit */

        let durationGraph = [];
        let counter = [];
        let uniqueSupplyAreas = newArray.filter((x, i, a) => a.indexOf(x) === i);
        for (let i = 0; i < uniqueSupplyAreas.length; i++) {
            if (uniqueSupplyAreas[i] === 'L4ELV10' ||
                uniqueSupplyAreas[i] === 'L4PCOL05' ||
                uniqueSupplyAreas[i] === 'L4PRTR20' ||
                uniqueSupplyAreas[i] === 'L4PCLN20' ||
                uniqueSupplyAreas[i] === 'L4CLN20'
            ) {
                uniqueSupplyAreas.splice(i, 1); i--;
            }
        }
        try {
            uniqueSupplyAreas.forEach((element) => {
                let i = 1;
                let duration = 0;
                    arraySummary.forEach((element2) => {
                        if (element === element2.supplyArea) {
                            let minutes = parseInt(((element2.duration) / 60000).toFixed(0));
                            duration = duration + minutes;
                            i++
                        }
                    });
                counter.push(i);
                durationGraph.push(parseInt((duration / i).toFixed()));
            });
        } catch (e) {
            // console.log(e)
        }
      //  console.log(counter, uniqueSupplyAreas)
        Session.set('historyCarts', counter);
        Session.set('historyTotalResultSupply', uniqueSupplyAreas);
        Session.set('historyTotalResultDuration', durationGraph);
    },

    personalYearResultHistory: function () {
        // Gather data:
        let averagePerSupply = Session.get('historyTotalResultDuration');
        let cartsCounter = Session.get('historyCarts');
        let categories = Session.get('historyTotalResultSupply');
        //    console.log(averagePerSupply, cartsCounter, categories);
        let average = (averagePerSupply.reduce((a,b) => a + b , 0) / averagePerSupply.length).toFixed(0);
        let annualCarts = cartsCounter.reduce((a,b) => a + b, 0);
        let annualCategories = categories.length;
        let titleText = annualCarts + ' ' + 'Carts picked for ' + annualCategories + ' Cost centers with an average of ' + average + ' min';
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_3', {

                title: {
                    text: titleText
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
                    title: {enabled: true,
                        text: 'Average Picking Time in min',
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
    if (pickingMonth === 0) {
        pickingMonth = '00';
    }
    if (pickingMonth < 10 ) {
        pickingMonth = "0" + timeResult.getMonth();
    }
    let pickingDate = timeResult.getDate();
    if (pickingDate < 10) {
        pickingDate = "0" + timeResult.getDate()
    }
    let pickingDay = "0" + timeResult.getDay() ;
    let pickingYear = timeResult.getFullYear();
   // return (pickingYear+ pickingMonth + pickingDate + pickingDay);
    return (pickingYear + pickingMonth + pickingDate + pickingDay)
}






