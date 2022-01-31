import { calcTime } from '../../lib/99_functionCollector.js';
import {Session} from "meteor/session";
import Highcharts from "highcharts";

Meteor.subscribe('assemblyTech')

Template.singleAssemblyTech.events({
    'click .assemblyLine': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLine')
    },

    'click .jumpBack': (e) => {
        e.preventDefault();
        FlowRouter.go('/admin')
    },

    'click .btn-back': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLineOverView')
    }

})




Template.techResults.helpers({

    techTable: () => {
        let result;
        result = assemblyTech.find({}, {fields: {_id: 1}}).fetch();
        return result;
    },

    resultTable: () => {
        let result, pickedTech, date, hours, minutes, unixLandingTime, resultObject,
             dateIncoming, dateOutgoing, timeSpent, workSpent, dateWorkStart, dateWorkEnd;
        let output = [];
        pickedTech  = Session.get('pickedTech')
        result = assemblyTech.findOne({_id: pickedTech });
            try {
                Session.set('workDone', result.workDone.length)
                result.workDone.forEach((element) => {
                    workSpent = calcTime(parseInt(element.bayStop), parseInt(element.bayStart));
                    timeSpent = calcTime(parseInt(element.bayLeaving), parseInt(element.bayLandingUnix))
                    dateIncoming = moment(parseInt(element.bayLandingUnix)).format('YYYY-MM-DD hh:mm:ss')
                    dateOutgoing = moment(parseInt(element.bayLeaving)).format('YYYY-MM-DD hh:mm:ss')
                    dateWorkStart = moment(parseInt(element.bayStart)).format('YYYY-MM-DD hh:mm:ss')
                    dateWorkEnd = moment(parseInt(element.bayStop)).format('YYYY-MM-DD hh:mm:ss')
                    resultObject = {
                        station: element.station,
                        machineId: element.machineId,
                        bayLandingDate: dateIncoming,
                        timeSpent: timeSpent,
                        bayLeavingDate: dateOutgoing,
                        bayStart: dateWorkStart,
                        workTime: workSpent,
                        bayStop: dateWorkEnd
                    }
                    output.push(resultObject)
                })
            } catch(err) {
                         }
        Session.set('output', output)
        return output;
    },

    workDone: () => {
        let assemblyTech, unitsDone;
        let returnResult = {}
        assemblyTech = Session.get('pickedTech')
        unitsDone = Session.get('workDone')
        returnResult = {
            assemblyTech : assemblyTech,
            unitsDone : unitsDone
        }
        return returnResult;
    },

    selected: function () {

    },

    techChart: function () {
      // Gather data:
      let machineIdArray = [];
      let minutesWork = [];
      let outputResult = Session.get('output')
        outputResult.forEach((element) => {
            machineIdArray.push(element.machineId)
            minutesWork.push(element.workTime)
        })

        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chart_tech', {
                title: {
                    text: 'Work Minutes spent per Unit'
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
                    width: 1500,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Minutes spent per Unit',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: machineIdArray,
                    title: {
                        enabled: true,
                        text: 'Machines',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: 'Minutes per Unit',
                        type: 'column',
                        data: minutesWork
                    }
                ]
            });
        });
    },


});

Template.techResults.events({

    'click .pickedTech': function(e) {
        e.preventDefault();
        let pickedTech = this._id;
        Session.set('pickedTech', pickedTech );
    },

});