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
            Session.set('loggedUserResult', result);
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
        let arraySummery = [];
        let newArray = [];
        try {
            let result = pickers.findOne({_id: loggedUser});
            delete result._id;
            delete result.active;
            Session.set('loggedUserResult', result);
            let resultObj = Object.entries(result);
            /* find dates after fiscal year change */
            if (resultObj.length > 1) {
                for (let k = 0; k <= resultObj.length - 1; k++) {
                    if (resultObj[k] >= lastFiscalYear && resultObj[k] <= newFiscalYear) {
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
        console.log(counter)
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



    /*
    pickersAnnualResult: () => {
        let arraySummery = [];
        let newArray = [];
        let sessionResult = Session.get('pickersAnnualResult');
        try {
            let result = sessionResult[0];
            let resultObj = Object.keys(result);
            for (let i = 0; i < resultObj.length; i++) {
                if (resultObj[i] === "_id") {
                    resultObj.splice(i, 1);
                    i--;
                }
            }
            // console.log(resultObj);
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
        let uniqueSupplyAreas = newArray.filter((x, i,a) => a.indexOf(x) === i);
        uniqueSupplyAreas.forEach((element) => {
            //     console.log(element);
            let i = 0;
            annualSummary.forEach((element2) => {
                try {
                    if (element === element2.supplyArea) {
                        //    console.log(element, element2.duration);
                        totalDuration.push(element2.duration);
                        i++;
                        //     console.log(totalDuration);
                    } else {
                        //    console.log('else')
                    }
                } catch {
                }
            });
            let averageDuration = ((totalDuration.reduce((a,b) => a + b, 0) / totalDuration.length) / 60000).toFixed(0);
            //    console.log('duration: ', averageDuration);
            counter.push(i);
            durationGraph.push(parseInt(averageDuration));
            totalDuration = [];
            i = 0;
        });
        // console.log(uniqueSupplyAreas);
        Session.set('pickersAnnualCart', counter);
        Session.set('pickersAnnualSupplyAreas', uniqueSupplyAreas);
        Session.set('pickersAnnualDuration', durationGraph);

    },


     */

});
/*
Template.singleResults.helpers({

    pickersChartResult: function () {
        // Gather data:
        let averagePerSupply = Session.get('Duration');
        let cartsCounter = Session.get('Cart');
        let categories = Session.get('Supply');
        console.log(averagePerSupply, cartsCounter, categories);
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_5', {

                title: {
                    text: 'Carts and Average Time per Day per Supply Area'
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

    areaResult: function () {
        // Gather data:
        let areaResult = Session.get('response');

        // machines & minutes
        let machines = [];
        let minutes = [];
        areaResult.forEach((element) => {
            machines.push( element.machine);
            minutes.push(parseFloat(element.duration));
        });

        let titleText = '';

        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_4', {
                title: {
                    text: titleText
                },
                tooltip: {
                    shared: false
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
                    title: {enabled: true,
                        text: 'Picking Time in min',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },

                xAxis: {
                    categories: machines,
                    title: {
                        enabled: true,
                        text: 'Machines',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [
                    {
                        name: 'Picking time in min',
                        data: minutes
                    },
                    {
                        name: 'Machines',
                        data: machines
                    }
                ]
            });
        });
    },

    singleSupplyHead: function() {
        return Session.get('chosenArea');
    },

    singleSupply: function() {
        return Session.get('response');
    },

    'selectedTime': function () {
        let areaId = this.machine;
        let machine = Session.get('01-supplyMachine');
        if (areaId === machine) {
            return 'selected-time';
        }

    },

    errorPickingDate: function () {
        Session.set('Supply', '');
        Session.set('Duration', '');
        Session.set('Cart', '');
        return Session.get('errorPickingDate');
    },

    diagramDate: function () {
        return Session.get('diagramDate');
    },

    diagramMonth: function () {
        return Session.get('diagramMonth');
    },

    diagramArea: function () {
        return Session.get('diagramArea');
    },

    diagramError: function () {
        return Session.get('errorResponse')
    },

    supplyArea: () => {
        return supplyAreas.find({active: true}).fetch();
    },

    specificDate: () => {
        return Session.get('specificDate')
    },

    specificMonth: () => {
        return Session.get('specificMonth')
    },

    specificArea: () => {
        return Session.get('specificArea')
    },

});

Template.singleResults.events({

    'change #specificDate': (e) => {
        e.preventDefault();
        Session.set('specificArea', false);
        Session.set('specificDate', true);
        Session.set('specificMonth', false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificMonth").checked = false;
        document.getElementById("specificWorkArea").checked = false;
    },

    'change #specificMonth': (e) => {
        e.preventDefault();
        Session.set('specificArea', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', true);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificWorkArea").checked = false;
        document.getElementById("specificDate").checked = false;
    },

    'change #specificWorkArea': (e) => {
        e.preventDefault();
        Session.set('specificArea', true);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificMonth").checked = false;
        document.getElementById("specificDate").checked = false;
    },

    'submit .choseDate': (e) => {
        e.preventDefault();
        const loggedUser = Meteor.user();
        let day = e.target.specificDate.value;
        let dayMonth = day.slice(8, 10);
        let month = day.slice(5, 7) - 1;
        let year = day.slice(0, 4);
        let dayOfWeek = new Date(day).getDay() + 1;
        if(dayOfWeek === 7) {
            dayOfWeek = 0;
        }
        let dateString = dayMonth + "0" + dayOfWeek + month + year;
        Meteor.call('chosenDate', dateString, loggedUser.username, function(err, response) {
            if (response) {
             //   console.log(response);
                if (response === 'Nothing picked at this Date') {
                    Session.set('errorResponse', 'Nothing picked at this Date');
                } else {
                    Session.set('Supply', response[0]);
                    Session.set('Duration', response[1]);
                    Session.set('Cart', response[2]);
                    Session.set('errorPickingDate', '');
                    Session.set('diagramDate', true);
                    Session.set('diagramMonth', false);
                    Session.set('diagramArea', false);
                }
            } else {

            }
        })
    },

    'submit .choseMonth': function (e) {
        e.preventDefault();
        let picker = Session.get('chosenPicker');
        let month = e.target.specificMonth.value;
        Meteor.call('chosenMonth', month, picker, function (err, response) {
            if (response) {
                Session.set('monthMachine', response[0]);
                Session.set('monthSupplyArea', response[1]);
                Session.set('monthPickingTime', response[2]);
                Session.set('monthDuration', response[3]);
                Session.set('monthDate', response[4]);
                Session.set('diagramDate', false);
                Session.set('diagramMonth', true);
                Session.set('diagramArea', false);
            } else {
            }
        })
    },


    'click .area': function (e) {
        e.preventDefault();
        const loggedUser = Meteor.user();
        Session.set('chosenPicker', loggedUser.username);
        let area = this._id;
        Session.set('chosenArea', area);
        let picker = Session.get('chosenPicker');
        getArea(area, picker);
    },

});


function getArea (area, picker) {
    Meteor.call('selectedAreaAnalysis', area, picker, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            Session.set('response', response);
            Session.set('diagramDate', false);
            Session.set('diagramMonth', false);
            Session.set('diagramArea', true);
        }
    });
}

Template.singleResults.onDestroyed(() => {
    Session.set('01-supplyMachine', false);
    Session.set('specificArea', false);
    Session.set('specificDate', false);
    Session.set('specificMonth', false);
    Session.set('pickersAnnualResult', false);
    Session.set('chosenPicker', false);
    Session.set('Supply',  false);
    Session.set('Duration',  false);
    Session.set('Cart',  false);
    Session.set('errorPickingDate', false);
    Session.set('diagram', 1);
    Session.set('diagramDate', false);
    Session.set('diagramMonth', false);
    Session.set('diagramArea', false);
    Session.set('errorResponse', false);
});
*/
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






