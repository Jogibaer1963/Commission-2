Meteor.subscribe('assemblySchedule');
Meteor.subscribe('scheduleConfig')

Template.shiftConfig.helpers({

    shiftConfig: function() {
        let result;
        try {
       return scheduleConfig.findOne({_id : "shiftConfig"}).shift;
        } catch (e) {}
      //  console.log(result.shift)
    }

})



Template.monthlyView.helpers({

    assemblyScheduleTable: function() {
        let resultId, dayResult, resultObj;
        let dayArray = [];
        let result = assemblySchedule.find().fetch();
        try {
            resultId = result[0]._id;
            delete result[0]._id;
            dayResult = result[0]
            resultObj = Object.keys(result[0]);
            resultObj.forEach((element) => {
                dayResult[element].forEach((element2) => {
                    dayArray.push(element2)
                })
            });
        } catch (error) {}
    return dayArray
    }

});

Template.lineBasicCondition.events({


    "submit .defineWorkDays": function(e) {
        e.preventDefault();
        let workDaysArray = [];
        $('input[name = weekDay]:checked').each(function() {
            workDaysArray.push($(this).val())
        });
        let beginWorkMonth = e.target.beginWorkMonth.value;
        let endWorkMonth = e.target.endWorkMonth.value;
    }

});

Template.desiredMachines.helpers({

    weeklyMachinesTable: () => {
        let weeklyResult = [];
       let result = scheduleConfig.findOne({_id : "desiredMachines"});
       try {
           result.weeklyMachines.forEach((element) => {
               weeklyResult.push(element);
           })
       } catch (error) {}
       // console.log(weeklyResult)
        return weeklyResult
    }

})

Template.desiredMachines.events({




    'submit .desired-machines': function(e) {
        e.preventDefault();
        let d = new Date();
        let dateStart, dateEnd, machines, startDateString, endDateString, unixStartDate,
             unixEndDate, otherStartDate, otherEndDate;
        try {
        machines = e.target.desiredMachines.value;
        dateStart =(new Date(e.target.startDate.value).toISOString()).slice(0,10);
        dateEnd = (new Date(e.target.endDate.value).toISOString()).slice(0,10);
        unixStartDate = new Date(dateStart).getTime()/1000;
        unixEndDate = new Date(dateEnd).getTime()/1000;
        otherStartDate = new Date(dateStart);
        otherEndDate = new Date(dateEnd);
            console.log(otherStartDate, otherEndDate)
        } catch(error) {}
        // check entries for plausibility like date 1 is lower than date 2,
        checkStatement: if (dateStart >= dateEnd) {
            // alert window date start too big
            alert("Start Date is higher than End Date");
            break checkStatement;
        } else if (unixEndDate - unixStartDate <= 518399) {
            // dateStart and dateEnd not more than 1 week apart
            alert("Start Date and End Date must be at least 1 Week apart");
            break checkStatement;
        } else if (dateStart === undefined || dateEnd === undefined) {
            dateStart = 0;
            dateEnd = 0;
            Meteor.call('desiredMachinesList', dateStart, dateEnd, unixStartDate, unixEndDate, otherStartDate, otherEndDate, machines)
        } else {
            Meteor.call('desiredMachinesList', dateStart, dateEnd, unixStartDate, unixEndDate, otherStartDate, otherEndDate, machines)
        }
    }

})