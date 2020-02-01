import { Template } from 'meteor/templating';
const Highcharts = require('highcharts');
Meteor.subscribe('pickers');

Session.set('errorPickingDate', false);
Session.set('01-supplyMachine', false);

Template.dailyResult.helpers({

    loggedInUser: () => {
        const loggedUser = Meteor.user();
        Session.set('loggedUser', loggedUser);
       // console.log(loggedUser);
        return loggedUser;
    },

    resultToday: () => {
        let dayCount = 0;
        let k = 0;
        let pickingResult = [];
        let resultOfTheDay = [];
        let result = pickers.find({}).fetch();
        Session.set('result', result);
       // console.log(result);
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
        console.log(resultOfTheDay);
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
       // console.log(averagePerSupply);
        let durationAverage = (averagePerSupply.reduce((a,b) => a + b, 0) / averagePerSupply.length).toFixed(0);
        Session.set('averagePerSupply', averagePerSupply);
        Session.set('dayResult', dayResult);
        Session.set('uniqueAreas', uniqueAreas);
       // console.log(dayCount, durationAverage, uniqueAreas);
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


});

Template.singleResults.helpers({

    pickersChartResult: function () {
        // Gather data:
        let averagePerSupply = Session.get('Duration');
        let cartsCounter = Session.get('Cart');
        let categories = Session.get('Supply');
        //   console.log(averagePerSupply, cartsCounter, categories);
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
        const loggedUser = Meteor.user();
        let monthName = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        let month = e.target.specificMonth.value;
        //  console.log(month);
        let chosenMonth = month.slice(5, 8);
        let chosenYear = month.slice(0, 4);
        let trueMonth = ('0' + (parseInt(chosenMonth) -1)).slice(-2) ; // month start with 0 ** January = 00
        //    console.log(trueMonth, monthName[chosenMonth - 1]);
        Session.set('monthName', monthName[chosenMonth - 1]);
        // build range for specific month dd-week day--month-year
        let monthStart = trueMonth + chosenYear;
        Meteor.call('chosenMonth',monthStart, loggedUser.username, function(err, response) {
            if (response) {
                Session.set('Supply', response[0]);
                Session.set('Duration', response[1]);
                Session.set('Cart', response[2]);
                Session.set('diagramDate', false);
                Session.set('diagramMonth', true);
                Session.set('diagramArea', false);
                Session.set('errorResponse', false);
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

function pickingToDay () {
    let today = Date.now();
    let timeResult = new Date(today);
    let pickingMonth = timeResult.getMonth();
    if (pickingMonth === 0) {
        pickingMonth = '00';
    }
    let pickingDate = timeResult.getDate();
    if (pickingDate < 10) {
        pickingDate = "0" + timeResult.getDate()
    }
    let pickingDay = "0" + timeResult.getDay() ;
    let pickingYear = timeResult.getFullYear();
    return (pickingDate + pickingDay + pickingMonth + pickingYear);
}





