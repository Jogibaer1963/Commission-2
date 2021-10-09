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
    //   console.log(resultArray)
        return resultArray.reverse();
    }

});


Template.adminDashboard.helpers({

    shiftStart: function () {
        let result = scheduleConfig.findOne({_id: 'shiftConfig'});
        try {
        let specificShift = result.currentShift;
        let shiftField = result.shift;
            shiftField.forEach(function (element) {
                if (element._id === specificShift) {
                    Session.set('shiftStart', element.shiftStart);
                    Session.set('shiftEnd', element.shiftEnd);
                    Session.set('firstBreak', element.firstBreak);
                    Session.set('firstBreakDuration', element.firstBreakDuration)
                }
            })
        } catch (err) {

        }

        return Session.get('shiftStart');
    },

    shiftEnd: function () {
        return Session.get('shiftEnd');
    },

    firstBreak: function () {
        return Session.get('firstBreak')
    },

    firstBreakDuration: function () {
        return Session.get('firstBreakDuration')
    },

    secondBreak: function () {
        return Session.get('secondBreak')
    },

    thirdBreak: function () {
        return Session.get('thirdBreak')
    },

    fourthBreak: function () {
        return Session.get('fourthBreak')
    },

    machinesPerDay: function () {
        return Session.get('machinesPerDay')
    },

    cycleTime: function () {
        return Session.get('cycleTime')
    },


})


Template.adminDashboard.events({

    'submit .setShiftTime': function(e) {
        e.preventDefault();
        let shiftStart, shiftEnd, breakOne, durationOne, breakTwo, durationTwo, breakThree, durationThree,
            breakFour, durationFour
        shiftStart = e.target.shiftStart.value;
        shiftEnd = e.target.shiftEnd.value;
        breakOne = e.target.break_1.value;
        durationOne = e.target.break_1_duration.value;
        breakTwo = e.target.break_2.value;
        durationTwo = e.target.break_2_duration.value;
        breakThree = e.target.break_3.value;
        durationThree = e.target.break_3_duration.value;
        breakFour = e.target.break_4.value;
        durationFour = e.target.break_4_duration.value;
        Session.set()
     //   console.log(shiftStart, shiftEnd, breakOne, durationOne, breakTwo,
     //       durationTwo, breakThree, durationThree, breakFour, durationFour)
        let firstShift = shiftStart.split(':');
        let secondShift = shiftEnd.split(':');
        let firstSeconds = (firstShift[0] * 3600 + firstShift[1] * 60)
        let secondSeconds = (secondShift[0] * 3600 + secondShift[1] * 60)
        let workingShift = secondSeconds - firstSeconds;
    //    console.log('result', workingShift)
    }


})