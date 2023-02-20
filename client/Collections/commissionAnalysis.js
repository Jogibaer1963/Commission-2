Meteor.subscribe('pickers');
Meteor.subscribe('fiscalYear')
const Highcharts = require('highcharts');

Session.set('errorPickingDate', false);
Session.set('01-supplyMachine', false);
Session.set('returnResult', false);

Session.set('chosenPicker', false);
Session.set('specificArea', false);
Session.set('specificDate', false);
Session.set('specificMonth', false);
Session.set('range', false);
Session.set('monthSupply',  false);
Session.set('monthDuration',  false);
Session.set('monthCart',  false);
Session.set('diagramDate', false);
Session.set('diagramMonth', false);
Session.set('diagramRange', false);
Session.set('diagramArea', false);
Session.set('errorResponse', false);

// Start with Fiscal Year 2021, later user can choose which Fiscal Year
Session.set('newFiscalYear', "2023")

Template.analysisOverView.helpers({



    pickers: () => {
        let result;
        Tracker.autorun(() => {
            Meteor.subscribe('activePickers')
            result = pickers.find().fetch();
           // console.log(result)
            Session.set('activePickers', result)
        })
        return Session.get('activePickers')
    },

    chosenPicker: () => {
        return Session.get('chosenPicker');
    },

    pickerChosen: () => {
        let picker = Session.get('chosenPicker');
        return picker !== false;
    },

    pickersResult: () => {
        let chosenPicker = Session.get('chosenPicker');
            if (chosenPicker) {
              let result = pickers.findOne({_id: chosenPicker});
              try {
                  delete result._id;
                  delete result.active;
                  Session.set('pickersAnnualResult', result);
              }
               catch (e) {
              }
            }
    },

    fiscalYearShown: () => {
      return Session.get('newFiscalYear')
    },

    availableFiscalYear: () => {
        return fiscalYear.find();
    },

    'selectedArea': function () {
        let areaId = this._id;
        let deactivate = Session.get('deactivateSupplyArea');
        if (areaId === deactivate) {
            return 'selectedArea';
        }
    },

    supplyArea: () => {
        return supplyAreas.find({active: true}).fetch();
    },

    specificArea: () => {
        return Session.get('specificArea')
    },

    specificDate: () => {
        return Session.get('specificDate')
    },

    specificMonth: () => {
        return Session.get('specificMonth')
    },

    range: () => {
        return Session.get('range')
    },
/*  -----------------------------   Annual Result  -----------------------------------  */
    pickersAnnualResult: () => {
        let arraySummery = [];
        let newArray = [];
        let result = Session.get('pickersAnnualResult');
        let newFiscalYear = Session.get('newFiscalYear');
        try {
            let resultObj = Object.keys(result);
            if (newFiscalYear === "2020") {
                newFiscalYear = "2020090401"
                let  oldFiscalYear = "2019090401"
                resultObj.forEach((element) => {
                    if (element >= oldFiscalYear && element <= newFiscalYear) {
                        arraySummery.push(result[element]);
                    }
                });
            } else if (newFiscalYear === "2021") {
                newFiscalYear = "2020090401"
                resultObj.forEach((element) => {
                    if (element >= newFiscalYear) {
                        arraySummery.push(result[element]);
                    }
                });
                newFiscalYear = "2021090401"
                resultObj.forEach((element) => {
                    if (element >= newFiscalYear) {
                        arraySummery.push(result[element]);
                    //    console.log(arraySummery)
                    }
                });
            } else if (newFiscalYear === "2023") {
                newFiscalYear = "2022090401"
                resultObj.forEach((element) => {
                    if (element >= newFiscalYear) {
                        arraySummery.push(result[element]);
                        //    console.log(arraySummery)
                    }
                });
            }
        } catch {}
        let annualSummary = arraySummery.flat(1);
        annualSummary.forEach((element) => {
            try {
                newArray.push(element.supplyArea);
            } catch {}
        });
      //  console.log(newArray)
        let totalDuration = [];
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
       // console.log(uniqueSupplyAreas)
        uniqueSupplyAreas.forEach((element) => {
            let i = 0;
            annualSummary.forEach((element2) => {
                try {
                    if (element === element2.supplyArea) {
                        totalDuration.push(element2.duration);
                        i++;
                    } else {}
                } catch {}
            });
            let averageDuration = ((totalDuration.reduce((a, b) => a + b, 0) / totalDuration.length) / 60000).toFixed(0);
            counter.push(i);
            durationGraph.push(parseInt(averageDuration));
            totalDuration = [];
            i = 0;
        });

        Session.set('pickersAnnualCart', counter);
        Session.set('pickersAnnualSupplyAreas', uniqueSupplyAreas);
        Session.set('pickersAnnualDuration', durationGraph);
    },

    pickersAnnualChartResult: function () {
        // Gather data:
        let supplyArea = Session.get('pickersAnnualSupplyAreas');
        let timePerCart = Session.get('pickersAnnualDuration');
        let cartsTotal = Session.get('pickersAnnualCart');
      //  console.log(timePerCart, cartsTotal);
        let annualSupply = supplyArea.length;
        let annualAverage = (timePerCart.reduce((a,b) => a + b, 0) / timePerCart.length).toFixed(0);
        let annualCarts = cartsTotal.reduce((a,b) => a + b, 0);
        // Use Meteor.defer() to create chart after DOM is ready:
        let titleText = annualCarts + ' Carts picked for ' + annualSupply + ' Supply Areas with an average of ' + annualAverage + ' min';
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
                    categories: supplyArea,
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
                        data: timePerCart
                    },
                    {
                        name: 'Carts picked',
                        type: 'spline',
                        data: cartsTotal
                    }
                ]
            });
        });
    },


    missPickersAnnualResult: function() {
        let pickerResult = []
        let result = []
        let picker = []
        let pickerSummary = []
        let count = {};
        Meteor.call('missPickYear', function(err, response) {
            if (response) {
                Session.set('missPickResponse', response)
                Session.set('yearMissPicks', response.length)

                result = Session.get('missPickResponse')
                result.forEach((element) => {
                    pickerResult.push(element.picker)
                })
                pickerResult.forEach(obj => {
                    count[JSON.stringify(obj)] = (count[JSON.stringify(obj)] || 0) + 1;
                });

                let keys = Object.keys(count);
                let values = keys.map(key => count[key]);

                Session.set('missPickers', keys)
                Session.set('missPickersCount', values)
            } else if (err) {
                console.log(err)
            }
        })
        
    },




    missPickersAnnualChartResult: function () {
        // Gather data:
        let missPickTotal, missPickers, missPickersCount
        missPickers = Session.get('missPickers')
        missPickersCount = Session.get('missPickersCount')
        missPickTotal = Session.get('yearMissPicks')
        // Use Meteor.defer() to create chart after DOM is ready:
        let titleText = missPickTotal + ' times parts were missing on Carts since Jan 2023';
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_6', {
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
                    height: 500,
                    width: 900,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: missPickersCount,
                    title: {enabled: true,
                        text: 'Amount of miss Picks',
                        style: {
                            color: 'red',
                            font: '19px Arial, sans-serif'
                        }
                    }
                },
                xAxis: {
                    categories: missPickers,
                    title: {
                        enabled: true,
                        text: 'Pickers',
                        style: {
                            font: '19px Arial, sans-serif'
                        }
                    }
                },
                series: [
                    {
                        name: 'Miss Picks',
                        type: 'bar',
                        data: missPickersCount,
                        style: {
                            fontWeight: 'bolder'
                        }
                    }
                ]
            });
        });
    },

    /* -----------------------------------  Analysis by date  ------------------------------- */

    //  Day Chart

    pickersDayChartResult: function () {
        // Use Meteor.defer() to create chart after DOM is ready:
        // Gather data:
        let pickingDay = Session.get('pickingDay');
        let timePerCart = Session.get('Duration');
        let cartsCounter = Session.get('Cart');
        let categories = Session.get('Supply');
        //  console.log(cartsCounter, categories);
        // Use Meteor.defer() to create chart after DOM is ready:
        let daylieAverage = (timePerCart.reduce((a,b) => a + b, 0) / timePerCart.length).toFixed(0);
        let daylieCarts = cartsCounter.reduce((a,b) => a + b, 0);
        let titleText = 'At ' + pickingDay + ' were ' + daylieCarts + ' Carts picked for ' +
                                categories.length + ' Supply Areas with an average of ' +
                                daylieAverage + ' min';
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_5', {
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
                        data: timePerCart
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

    /* ------------------------------------------  Analysis by Month  ------------------ */

    // Month Chart

    pickersMonthChartResult: function () {
        // Use Meteor.defer() to create chart after DOM is ready:
        // Gather data:
        let counter = Session.get('monthCounter');
        let categories = Session.get('monthUniqueSupply');
        let monthDurationGraph = Session.get('monthDurationGraph');
        let monthSupplyArea = Session.get('monthSupplyArea');
        let monthDuration = Session.get('monthDuration');
        let monthString = Session.get('monthString')
        let monthDurationAverage = (monthDuration.reduce((a,b) => a + b, 0) / monthDuration.length).toFixed(0);

        let titleText = 'At ' + monthString + ' were ' + monthSupplyArea + ' Carts picked for ' +
            ' with an average of ' + (monthDurationAverage/60000).toFixed(0) + ' min';

        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_5', {
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
                        data: monthDurationGraph
                    },
                    {
                        name: 'Carts Picked',
                        type: 'spline',
                        data: counter
                    }
                ]
            });
        });
    },

    /*  -----------------------------------  Analysis by Date Range  ------------------------ */

    pickersRangeChartResult: function () {
        // Use Meteor.defer() to create chart after DOM is ready:
        // Gather data:
        let counter = Session.get('rangeCounter');
        let categories = Session.get('rangeUniqueSupply');
        let durationGraph = Session.get('rangeDurationGraph');
        let fromDate = Session.get('fromDate');
        let toDate = Session.get('toDate');
        let titleText = "From " + fromDate + " to " + toDate + " were " + (counter.reduce((a,b) => a + b, )) + " Carts picked";

        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_5', {
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
                        data: durationGraph
                    },
                    {
                        name: 'Carts picked',
                        type: 'spline',
                        data: counter
                    }
                ]
            });
        });
    },


/*  --------------------------  Result by Area  ------------------------------- */

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

    diagramRange: function () {
        return Session.get('diagramRange');
    },

    diagramArea: function () {
        return Session.get('diagramArea');
    },

    diagramError: function () {
        return Session.get('errorResponse')
    },

    singleDateSearch: () => {  // query starts at Line 552
        return Session.get('returnResult')
    },


});


Template.analysisOverView.events({
    
    // **  Search for a specific Date without Picker / commissionAnalysis.html  Line 75 to 82 / 
    // and _commission_statistics.scss line 250 to 260 / server.js Line 519
    
    'submit .search-for-date': function(e) {
        e.preventDefault();
        // Set all previous Session to false, clears the Screen
        Session.set('chosenPicker', false);
        Session.set('specificArea', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
        Session.set('range', false);
        Session.set('monthSupply',  false);
        Session.set('monthDuration',  false);
        Session.set('monthCart',  false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramRange', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);


        let readyArray = [];
        let returnArray = []
        let date = e.target.searchForDate.value;
        Meteor.call('searchDate', date, function (error, response) {
            if (error) {

            } else {
              //  console.log(typeof response)
               response.forEach((element) => {
                  let pickerId = element.pickerId
                   returnArray = element.supplyResult
                   returnArray.forEach((element2) => {
                       let supplies = {
                           supply : element2.supplyArea,
                           machine : element2.machine,
                           duration : ((element2.duration) / 60000).toFixed(0),
                           date : element2.date,
                           picker : pickerId
                       }
                       readyArray.push(supplies)
                   })
               })
                Session.set('returnResult', readyArray)
            }
        });
    },
    
    
    //  ****************************************************************************************

    'click .area': function (e) {
        e.preventDefault();
        let area = this._id;
        let newFiscalYear = Session.get('newFiscalYear')
        Session.set('chosenArea', area);
        let picker = Session.get('chosenPicker');
        getArea(area, picker, newFiscalYear);
    },

    'click .supplyMachine': function (e) {
        e.preventDefault();
        Session.set('keyObject',this.pickingTime);
        Session.set('01-supplyMachine', this.machine);
    },

    'submit .editTime': function(e) {
        e.preventDefault();
        let inputResult = e.target.editTime.value;
        let newFiscalYear = Session.get('newFiscalYear')
        let machine = Session.get('01-supplyMachine');
        let area = Session.get('chosenArea');
        let objectKey = Session.get('keyObject');
        let picker = Session.get('chosenPicker');
        Meteor.call('changeTime', picker, machine, area,
                       inputResult, objectKey, function (err, response) {
                if (err)
                {
               //     console.log(err);
                } else {
                //    console.log('success', response);
                    getArea(area, picker, newFiscalYear)
                }
        });
        e.target.editTime.value = '';
        Session.set('01-supplyMachine', '');
        // console.log(Session.get('response'));
    },


    'click .fiscal-year-chosen': function(e) {
        e.preventDefault();
        let fiscalYear = this.year;
       //  console.log(fiscalYear)
        Session.set('newFiscalYear', fiscalYear);
    },

    'click .pickersName': function(e) {
        e.preventDefault();
        let pickersName = this._id;
        Session.set('chosenPicker', pickersName);
        Session.set('specificArea', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
        Session.set('range', false);
        Session.set('monthSupply',  false);
        Session.set('monthDuration',  false);
        Session.set('monthCart',  false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramRange', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        try {
        document.getElementById("specificMonth").checked = false;
        document.getElementById("range").checked = false;
        document.getElementById("specificWorkArea").checked = false;
        document.getElementById("specificDate").checked = false;
        } catch {}
    },

    'change #specificDate': (e) => {
        e.preventDefault();
        Session.set('specificArea', false);
        Session.set('specificDate', true);
        Session.set('specificMonth', false);
        Session.set('range', false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramRange', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificMonth").checked = false;
        document.getElementById("range").checked = false;
        document.getElementById("specificWorkArea").checked = false;
    },

    'change #specificMonth': (e) => {
        e.preventDefault();
        Session.set('specificArea', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', true);
        Session.set('range', false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramRange', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificWorkArea").checked = false;
        document.getElementById("range").checked = false;
        document.getElementById("specificDate").checked = false;
    },

    'change #range': (e) => {
        e.preventDefault();
        Session.set('specificArea', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
        Session.set('range', true);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramRange', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificWorkArea").checked = false;
        document.getElementById("specificDate").checked = false;
        document.getElementById("specificMonth").checked = false;
    },

    'change #specificWorkArea': (e) => {
        e.preventDefault();
        Session.set('specificArea', true);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
        Session.set('range', false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramRange', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificMonth").checked = false;
        document.getElementById("range").checked = false;
        document.getElementById("specificDate").checked = false;
    },


    'submit .choseDate': (e) => {
        e.preventDefault();
        let picker = Session.get('chosenPicker');
        let target = e.target.specificDate.value;  // format yy-mm-dd
        let day = target.slice(8, 10);
        let month = (target.slice(5, 7) - 1).toString();
        let year = target.slice(0, 4);
        let weekDay = new Date(target).getDay() + 1;
        if (month.length === 1) {
            month = '0' + month;
        }
        if (day.length === 1) {
            day = '0' + day;
        }
        weekDay = '0' + weekDay;
       // console.log(year + month + day + weekDay, month.length, day.length, target);

        let dateString = year + month + day + weekDay;
        Session.set('pickingDay', day);
        Meteor.call('chosenDate', dateString, picker, function(err, response) {
           if (response) {
              // console.log(response);
               if (response === 'Nothing picked at this Date') {
                   Session.set('errorResponse', 'Nothing picked at this Date');
               } else {
               Session.set('Supply', response[0]);
               Session.set('Duration', response[1]);
               Session.set('Cart', response[2]);
               Session.set('errorPickingDate', '');
               Session.set('diagramDate', true);
               Session.set('diagramMonth', false);
                   Session.set('diagramRange', false);
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
        let monthChosen = parseInt(month.slice(5)) - 1;
        let months_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        let monthString = months_arr[monthChosen];
        Session.set('monthString', monthString)
        Meteor.call('chosenMonth',month, picker, function(err, response) {
            if (response) {

                Session.set('monthSupplyArea', response[0]);
                Session.set('monthDuration', response[1]);

                Session.set('monthCounter', response[2]);
                Session.set('monthUniqueSupply', response[3]);
                Session.set('monthDurationGraph', response[4]);

                Session.set('diagramDate', false);
                Session.set('diagramMonth', true);
                Session.set('diagramRange', false);
                Session.set('diagramArea', false);
            } else {
            }
        })
    },

    'submit .range': function (e) {
        e.preventDefault();
        let picker = Session.get('chosenPicker');
        let presentDay = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate();
        let dateZ = Date.parse(presentDay)
        let date1 = (e.target.range1.value);
        let dateX = Date.parse(date1);
        let date2 = e.target.range2.value;
        let dateY = Date.parse(date2) + 86400000;
        if (dateY <= dateX || dateX >= dateZ) {
            alert("2nd Date can't be equal or lower than 1st Date or greater than today. Please correct")
        } else {
            Meteor.call('chosenRange', dateX, dateY, picker, function (err, response) {
                if (err) {
                 //   console.log(err)
                } else {
                    Session.set('rangeCounter', response[0]);
                    Session.set('rangeUniqueSupply', response[1]);
                    Session.set('rangeDurationGraph', response[2]);

                    Session.set('fromDate', date1);
                    Session.set('toDate', date2);
                    Session.set('diagramDate', false);
                    Session.set('diagramMonth', false);
                    Session.set('diagramRange', true);
                    Session.set('diagramArea', false);
                }
            })
        }


    }
});

function getArea (area, picker, newFiscalYear) {
    Meteor.call('selectedAreaAnalysis', area, picker, newFiscalYear, function (err, response) {
        if (err) {
         //   console.log(err);
        } else {
            Session.set('response', response);
            Session.set('diagramDate', false);
            Session.set('diagramMonth', false);
            Session.set('diagramRange', false);
            Session.set('diagramArea', true);
        }
    });
}

Template.analysisOverView.onDestroyed(() => {
    Session.set('01-supplyMachine', false);
    Session.set('specificArea', false);
    Session.set('specificDate', false);
    Session.set('specificMonth', false);
    Session.set('range', false);
    Session.set('pickersAnnualResult', false);
    Session.set('chosenPicker', false);
    Session.set('Supply',  false);
    Session.set('Duration',  false);
    Session.set('Cart',  false);
    Session.set('errorPickingDate', false);
    Session.set('diagram', 1);
    Session.set('diagramDate', false);
    Session.set('diagramMonth', false);
    Session.set('diagramRange', false);
    Session.set('diagramArea', false);
    Session.set('errorResponse', false);
});