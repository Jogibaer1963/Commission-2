
Session.set('twoMachines', false)

Template.moveMachines.helpers({

    machineReservoir: () => {
        let today = moment().add( -16, 'days').format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate : {$gt: today}, activeAssemblyLineList : true},
                                                       {fields: {machineId: 1,
                                                                         timeLine: 1,
                                                                         inLineDate: 1,
                                                                         bayReady: 1
                                                                         }}).fetch();

        result.sort((a, b) => (a.inLineDate > b.inLineDate) ? 1 :
            ((b.inLineDate > a.inLineDate) ? -1 : 0));
       // console.log(result)
        return result;
    },


    draw_ST1: () => {
        extractBayDates()
        let id = "machine-field-st1";
        let machineNr = "C8900573"
        invokeAfterLoad(machineNr, id);
    },

    draw_ST2: () => {
        let id = "machine-field-st2";
        let machineNr = "C8900572"
        invokeAfterLoad(machineNr, id);
    },

    draw_ST3: () => {
        let id = "machine-field-st3";
        let machineNr = "C8900571"
        invokeAfterLoad(machineNr, id);
    },

    draw_ST4: () => {
        let id = "machine-field-st4";
        let machineNr = "C8900570"
        invokeAfterLoad(machineNr, id);
    },

    draw_ST_merge: () => {
        let id = "machine-field-st-merge";
        let machineNr = "C8900569"
        invokeAfterLoad(machineNr, id);
    },

    draw_cooling1: () => {
        let id = "machine-field-cooling-1";
        let machineNr = "C8900571"
        invokeAfterLoad(machineNr, id);
    },
    draw_cooling2: () => {
        let id = "machine-field-cooling-2";
        let machineNr = "C8900570"
        invokeAfterLoad(machineNr, id);
    },

    //  ------------------  Assembly Line starts here --------------------------------
        //  ***************    Move Machine from List to the FCB merging Station  *************
    draw_fcb_threshing: () => {
        let machineNr = "";
        let today = moment().add( -16, 'days').format('YYYY-MM-DD')
        let id = "machine-field-fcb-threshing";
            let result = machineCommTable.find({inLineDate : {$gt: today}},
                {fields: {bayReady: 1, machineId: 1}}).fetch();
            try {
                result.forEach(function(element) {
                    element.bayReady.forEach(function(element_2) {
                        if (element_2.bayActive === true) {
                            machineNr = element.machineId;
                        }
                    })
                })
            } catch(e) {
               // console.log(e)
            }
            Session.set('machine-field-fcb-threshing', true)  // if true then machine in Bay
        invokeAfterLoad(machineNr, id);
    },

    draw_bay3: () => {
        let id = "machine-field-bay3";
        let bayId = 'bay3';
        let machineNr = "";
        let machineNrPresent = "C8900582";
        let newMachine = "C8900583";
        bayStatusPresent(id, bayId) // result is empty Array Bay is empty
    },

    draw_bay4: () => {
        let id = "machine-field-bay4";
        let bayId = 'bay4';
        let machineNr = "";
        let machineNrPresent = "";
        let newMachine = "";
        bayStatusPresent(id, bayId) // result is empty Array Bay is empty
    },

    draw_bay5: () => {
        let id = "machine-field-bay5";
        let machineNr = ""
        let machineNrPresent = "";
        let newMachine = "";
        let bayId = 'bay5';
        bayStatusPresent(id, bayId) // result is empty Array Bay is empty
    },

    draw_bay6: () => {
        let id = "machine-field-bay6";
        let machineNr = ""
        let machineNrPresent = "";
        let newMachine = "";
        let bayId = 'bay6';
        bayStatusPresent(id, bayId)// result is empty Array Bay is empty

    },

    draw_bay7: () => {
        let id = "machine-field-bay7";
        let machineNr = ""
        let machineNrPresent = "";
        let newMachine = "";
        let bayId = 'bay7';
      bayStatusPresent(id, bayId)// result is empty Array Bay is empty
    },

    draw_bay8: () => {
        let id = "machine-field-bay8";
        let machineNr = ""
        let machineNrPresent = "";
        let newMachine = "";
        let bayId = 'bay8';
       bayStatusPresent(id, bayId)// result is empty Array Bay is empty
    },

    draw_bay9: () => {
        let id = "machine-field-bay9";
        let machineNr = ""
        let machineNrPresent = "";
        let newMachine = "";
        let bayId = 'bay9';
       bayStatusPresent(id, bayId)// result is empty Array Bay is empty
    },

    draw_bay10: () => {
        let id = "machine-field-bay10";
        let machineNr = ""
        let machineNrPresent = "";
        let newMachine = "";
        let bayId = 'bay10';
         bayStatusPresent(id, bayId) // result is empty Array Bay is empty
    },


});


Template.moveMachines.events({

    'click .btn-back': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLineOverView')
    },

    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let bayId = "inLine"  // *************   Bay 2 in Data Base is inLine
        let bayStatus = await invokeMachineTest(bayId)  //  ********    Submit bayId to function
        if (bayStatus.length === 0) {
            Session.set('selectedAssemblyMachine', selectedAssemblyMachine);
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine);
            } else {
                window.alert('2 Machines in Bay 2 are not allowed')
               }
    },

    'click .bay-2-move-button': (e) => {
        e.preventDefault();
        let bayId = 'bay3'
        let bayBefore = 'inLine';



    }

});
// ***************   check status of the field if empty or engaged   **********************
function invokeMachineTest(bayId) {
    let bayStatus = [];
    let presentBay = bayId;
    let fieldId = '';
    let result = machineCommTable.find({activeInBay : true},
                {fields: {bayReady: 1,
                        machineId: 1}}).fetch()

        try {
            result[0].bayReady.forEach((element) => {
                if (element._id === presentBay &&  element.bayActive === true) {  //  checking if there is a
                    fieldId = element._id;   //  Machine already in Bay
                    let machineId = result[0].machineId;
                    bayStatus.push(machineId, fieldId)
                }
            })
        } catch(e) {
        }
    return bayStatus;
}

function moveMachine(inBay, bayInFront) {

}

function invokeEmptyBay(id) {
    Meteor.defer(function() {
        //  console.log('inside first function', machineNr, id)
        let canvas = document.getElementById(id);
        let ctx = canvas.getContext("2d");

        ctx.strokeStyle = "#ee0e0e";
        ctx.lineWidth = "2"
        ctx.strokeRect(0, 15, 90, 30)
    })
}

function invokeAfterLoad(machineNr, id) {
    Meteor.defer(function() {
        //  console.log('inside first function', machineNr, id)
        let canvas = document.getElementById(id);
        let ctx = canvas.getContext("2d");
        if (machineNr && id) {
            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#3ee021";
            ctx.lineWidth = "2"
            ctx.strokeRect(0, 0, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(machineNr, 7, 20)
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    })
}

function twoMachinesInBay(machineNrPresent, newMachine, id) {
    Meteor.defer(function() {
        // ******************   Delete previous drawn Canvas  ***************
        let canVas = document.getElementById(id);
        let context = canVas.getContext("2d");
        context.clearRect(0, 0, canVas.width, canVas.height);

        // ****************  Draw new Canvas  *********************************

        let canvas = document.getElementById(id);
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");

            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#ee0e0e";

            ctx.lineWidth = "2"
            ctx.strokeRect(10, 0, 90, 30);
            ctx.font = "bold 15px Arial";
            ctx.fillText(machineNrPresent, 20, 20);

            ctx.lineWidth = "2"
            ctx.strokeRect(10, 40, 90, 30);
            ctx.font = "bold 15px Arial"
            ctx.fillText(newMachine, 20, 60)
        }
    })
}


function bayStatusPresent(id, bayId) {
    let bayStatus = [];
    let presentBay = bayId;
    let fieldId = '';
    let result = machineCommTable.find({activeInBay : true},
        {fields: {bayReady: 1,
                machineId: 1}}).fetch()
    try {
        result[0].bayReady.forEach((element) => {
            if (element._id === presentBay &&  element.bayActive === true) {  //  checking if there is a
                fieldId = element._id;
                let machineId = result[0].machineId;                          //  Machine already in Bay
                bayStatus.push(machineId, fieldId)
            }
        })
    } catch(e) {
    }
    console.log(bayStatus)
    if (bayStatus.length === 0) {
        // draw empty Field with red rect
        invokeEmptyBay(id)
    } else if (bayStatus.length === 1) {
        // draw Machine
        invokeAfterLoad(bayStatus[0], bayStatus[1])
    } else if (bayStatus.length === 2) {
        // draw double Machine
        twoMachinesInBay(machineNrPresent, newMachine, id)
    }

}
