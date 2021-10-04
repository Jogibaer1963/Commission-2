Meteor.subscribe('assemblyLineBay');


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

Template.timeStudies.helpers({

    // loading machines with activeAssemblyLineList = false (Machine left reservoir)

    timeMachineMoved: () => {
        let result, firstStage, timeSpent, calculatedTime, comingIn, goingOut, machineResult, machineNr,
            minutes, bayId, position;
        let machineArray = [];
        result = machineCommTable.find({activeAssemblyLineList : false, inLineDate : {$gt: "2021-08-31"}}).fetch()
        result.forEach((element) => {
            firstStage = element.bayReady;
            firstStage.forEach((element_2) => {
                if (element_2.bayStatus === 1) {
                    // convert Unix milliseconds into minutes (60)
                    minutes = ((element_2.bayDateLeavingUnix - element_2.bayDateLandingUnix) / 60000).toFixed(0);

                    comingIn = (element_2.bayDateLanding)
                    goingOut = (element_2.bayDateLeaving)
                    machineNr = (element.machineId)
                    bayId = element_2.bayName;
                    position = element_2.bayPosition
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
        console.log(resultArray)
        return resultArray.reverse();
    }

});


