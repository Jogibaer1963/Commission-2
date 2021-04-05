
Session.set('twoMachines', false)

Template.moveMachines.helpers({

    machineReservoir: () => {
        let today = moment().add( -16, 'days').format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate : {$gt: today}},
                                                       {fields: {machineId: 1,
                                                                         timeLine: 1,
                                                                         inLineDate: 1
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

    draw_fcb_threshing: () => {
        let id = "machine-field-fcb-threshing";
       // let machineNr = Session.get('machineNrBay2');
        let machineNr = "C8900570"
        console.log('Machine in Bay 2', machineNr)
        invokeAfterLoad(machineNr, id);
    },

    draw_bay3: () => {
      //  let twoMachines = Session.get('twoMachines')
      //  let newMachine = Session.get('moveMachine');
        let id = "machine-field-bay3";
       // let machineNr = Session.get('machineNrBay3')
        let machineNr = "C8900570"

      //  console.log('newMachine', newMachine);
         /*
            if (newMachine !== '') {
                console.log('inside ', machineNr, newMachine)
                Session.set('twoMachines', true)
                Session.set('machineNrBay2', '')
                twoMachinesInBay(machineNr, newMachine, id)
            } else if (twoMachines === false) {
                */
              //  console.log('2ter Aufruf in else', machineNr, id)
                invokeAfterLoad(machineNr, id);
      //      }
       // Session.set('moveMachine', '');


    },

    draw_bay4: () => {
        let id = "machine-field-bay4";
        let machineNr = "C8900569"
        invokeAfterLoad(machineNr, id);
    },

    draw_bay5: () => {
        let id = "machine-field-bay5";
        let machineNr = "C8900568"
        invokeAfterLoad(machineNr, id);
    },

    draw_bay6: () => {
        let id = "machine-field-bay6";
        let machineNr = "C8900567"
        invokeAfterLoad(machineNr, id);
    },

    draw_bay7: () => {
        let id = "machine-field-bay7";
        let machineNr = "C8900566"
        invokeAfterLoad(machineNr, id);
    },

    draw_bay8: () => {
        let id = "machine-field-bay8";
        let machineNr = "C8900565"
        invokeAfterLoad(machineNr, id);
    },

    draw_bay9: () => {
        let id = "machine-field-bay9";
        let machineNr = "C8900564"
        invokeAfterLoad(machineNr, id);
    },

    draw_bay10: () => {
        let id = "machine-field-bay10";
        let machineNr = "C8900563"
        invokeAfterLoad(machineNr, id);
    },




});

function invokeAfterLoad(machineNr, id) {
        Meteor.defer(function() {
            console.log('inside first function', machineNr, id)
            let canvas = document.getElementById(id);
          //  if (canvas.getContext) {
                let ctx = canvas.getContext("2d");
                /*
                if (machineNr === '' && id) {
                    console.log('clear')
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                } else {
                    ctx.fillText(machineNr, 7, 20)
                }

                 */

                ctx.fillStyle = '#37db1a'
                ctx.strokeStyle = "#3ee021";
                ctx.lineWidth = "2"
                ctx.strokeRect(0, 0, 90, 30)
                ctx.font = "bold 15px Arial"
                ctx.fillText(machineNr, 7, 20)

          //  }
        })
}

function extractBayDates() {

}

function twoMachinesInBay(machineNr, newMachine, id) {
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
            ctx.lineWidth = "5"
            ctx.strokeRect(10, 0, 90, 30);
            ctx.font = "bold 15px Arial";
            ctx.fillText(machineNr, 20, 20);

            ctx.lineWidth = "5"
            ctx.strokeRect(10, 40, 90, 30);
            ctx.font = "bold 15px Arial"
            ctx.fillText(newMachine, 20, 60)
        }
    })
}

Session.set('machineNrBay3', 'C8900570')
Session.set("machineNrBay2", 'C8900571')


Template.moveMachines.events({

    'click .btn-back': (e) => {
        e.preventDefault();
        FlowRouter.go('/assemblyLineOverView')
    },

    'click .bay-2-move-button': (e) => {
        e.preventDefault();
     //   let inBay = Session.get('machineNrBay2')
      //  let bayInFront = Session.get('machineNrBay3');
      //  console.log('besetzt ', inBay, bayInFront)
      //  Session.set('moveMachine', inBay)
    }

});

function moveMachine(inBay, bayInFront) {

}