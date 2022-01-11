import { calcTime } from '../../lib/99_functionCollector.js';
Meteor.subscribe('assemblyLineBay');
Meteor.subscribe('scheduleConfig')


Template.assemblyLineOverView.helpers({


})

Template.assemblyLineOverView.events({

    'click .assemblyLine': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLine')
    },


    'click .jumpBack': (e) => {
        e.preventDefault();
        FlowRouter.go('/admin')
    }

})

//********************  Time Calc function  ***************************

//*****************************************************************************

Template.timeStudies.helpers({

    // loading machines with activeAssemblyLineList = false (Machine left reservoir)

    timeMachineMoved: () => {
        let result, firstStage, comingIn, goingOut, machineResult, machineNr,
            minutes, bayId, position;
        let machineArray = [];
        result = machineCommTable.find({activeAssemblyLineList : false, inLineDate : {$gt: "2021-10-04"}}).fetch()
        result.forEach((element) => {
            firstStage = element.bayReady;
            firstStage.forEach((element_2) => {
                if (element_2.bayStatus === 1) {
                    comingIn = (element_2.bayDateLanding)
                    goingOut = (element_2.bayDateLeaving)
                    machineNr = (element.machineId)
                    bayId = (element_2.bayName);
                    position = element_2.bayPosition

                    //Check to make sure there is a value in our Unix
                    // dates, then call the function to calculate our time
                    if(element_2.bayDateLeavingUnix > 0 && element_2.bayDateLandingUnix > 0) {
                        minutes = calcTime(element_2.bayDateLeavingUnix, element_2.bayDateLandingUnix);
                    }
                    if (minutes < 0) {
                       // console.log(machineNr, bayId)
                    }
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
        return resultArray.reverse();
    }

});
