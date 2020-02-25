Meteor.subscribe('pickers');
const Highcharts = require('highcharts');

Session.set('errorPickingDate', false);
Session.set('01-supplyMachine', false);

Template.analysisOverView.helpers({

    pickers: () => {
        return pickers.find({}, {fields: {_id: 1}}).fetch();
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
              let result = pickers.find({_id: chosenPicker}).fetch();
                Session.set('pickersAnnualResult', result);
            }
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
        } catch {
        }
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
        let uniqueSupplyAreas = newArray.filter((x, i, a) => a.indexOf(x) === i);
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
            let averageDuration = ((totalDuration.reduce((a, b) => a + b, 0) / totalDuration.length) / 60000).toFixed(0);
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
        console.log("counter: ", counter, " ", "pickersAnnualAreas: ", uniqueSupplyAreas, " ", "pickersAnnualDuration: ", durationGraph);
        let annualCartCounter = counter.reduce((a, b) => a + b, 0);
        let annualSupplyAreas = uniqueSupplyAreas.length;
        let annualDurationCounter = (durationGraph.reduce((a,b) => a + b, 0)/ durationGraph.length).toFixed(0);
        Session.set('annualCartCounter', annualCartCounter);
        Session.set('annualSupplyAreas', annualSupplyAreas);
        Session.set('annualDurationCounter', annualDurationCounter);
    },



    pickersAnnualChartResult: function () {
        // Gather data:
        let supplyArea = Session.get('pickersAnnualSupplyAreas');
        let timePerCart = Session.get('pickersAnnualDuration');
        let cartsTotal = Session.get('pickersAnnualCart');
        //   console.log(averagePerSupply, cartsCounter, categories);
        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_3', {

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
    }

});


Template.analysisOverView.events({

    'click .area': function (e) {
        e.preventDefault();
        let area = this._id;
        Session.set('chosenArea', area);
        let picker = Session.get('chosenPicker');
        getArea(area, picker);
    },

    'click .supplyMachine': function (e) {
        e.preventDefault();
        Session.set('keyObject',this.objectKey);
        Session.set('01-supplyMachine', this.machine);
    },

    'submit .editTime': function(e) {
        e.preventDefault();
        let inputResult = e.target.editTime.value;
        let machine = Session.get('01-supplyMachine');
        let area = Session.get('chosenArea');
        let objectKey = Session.get('keyObject');
        let picker = Session.get('chosenPicker');
        Meteor.call('changeTime', picker, machine, area,
                       inputResult, objectKey, function (err, response) {
                if (err)
                {
                    console.log(err);
                } else {
                    console.log('success', response);
                getArea(area, picker)
                }
        });
        e.target.editTime.value = '';
        Session.set('01-supplyMachine', '');
        console.log(Session.get('response'));

    },

    'click .pickersName': function(e) {
        e.preventDefault();
        let pickersName = this._id;
        Session.set('chosenPicker', pickersName);
        Session.set('specificArea', false);
        Session.set('specificDate', false);
        Session.set('specificMonth', false);
        Session.set('monthSupply',  false);
        Session.set('monthDuration',  false);
        Session.set('monthCart',  false);
        Session.set('diagramDate', false);
        Session.set('diagramMonth', false);
        Session.set('diagramArea', false);
        Session.set('errorResponse', false);
        document.getElementById("specificMonth").checked = false;
        document.getElementById("specificWorkArea").checked = false;
        document.getElementById("specificDate").checked = false;

    },

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
        let picker = Session.get('chosenPicker');
        let day = e.target.specificDate.value;
        let dayMonth = day.slice(8, 10);
        let month = day.slice(5, 7) - 1;
        let year = day.slice(0, 4);
        let dayOfWeek = new Date(day).getDay() + 1;
        if(dayOfWeek === 7) {
            dayOfWeek = 0;
        }
        let dateString = dayMonth + "0" + dayOfWeek + month + year;
       Meteor.call('chosenDate', dateString, picker, function(err, response) {
           if (response) {
               console.log(response);
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
        let monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
        let picker = Session.get('chosenPicker');
        let month = e.target.specificMonth.value;
      //  console.log(month);
        let chosenMonth = month.slice(5, 8);
        let chosenYear = month.slice(0, 4);
        let trueMonth = ('0' + (parseInt(chosenMonth) -1)).slice(-2) ; // month start with 0 ** January = 00
    //    console.log(trueMonth, monthName[chosenMonth - 1]);
        Session.set('monthName', monthName[chosenMonth - 1]);
        // build range for specific month dd-week day--month-year
        let monthStart = trueMonth + chosenYear;
        Meteor.call('chosenMonth',monthStart, picker, function(err, response) {
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
    }



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

Template.analysisOverView.onDestroyed(() => {
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