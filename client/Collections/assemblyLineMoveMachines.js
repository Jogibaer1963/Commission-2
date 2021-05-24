Meteor.subscribe('activeAssembly')


Session.set('twoMachines', false)

Template.burstSunTimerTeam_1.onRendered(function() {
    let current_theme = 0;
    let counter = 0;
    Session.set('percent', 0)
    set_theme(current_theme);
    update_clock(counter);
    setInterval(function () {
        return update_clock();
    }, 1000);
    build_sun_spots(10);
    set_sun_size();
});


Template.burstSunTimer.onRendered(function() {
    let   current_theme = 0;
    let counter = 0;
    Session.set('percent', 0)

    set_theme(current_theme);

    update_clock(counter);

    setInterval(function () {
        return update_clock();
        }, 1000);

    build_sun_spots(10);

    set_sun_size();

});

// Sun Timer functions

function set_theme(current_theme) {
   let  themes = ['sunset'];
   this.$('.body').removeClass(themes[current_theme]);
   return $('.body').addClass(themes[current_theme]);
}



function  update_clock() {
    let time_output = this.$('.clock .time span');
    let pTime, percent;
    percent =  percent_time(2);
    pTime = percent + "%";
    if (pTime !== time_output.text()) {
        time_output.text(pTime);
        return update_sun_color_and_position(percent);
    }
}

function percent_time(fixed) {
    /*
   let h, m, s, seconds, time;
    time = new Date();
  //  h = time.getHours();
   // m = time.getMinutes();
    s = time.getSeconds();
    seconds = s  * 60 // + (h * 3600);
    console.log(((seconds / 60) * 100).toFixed(fixed))
     */
    let percent = Session.get('percent')
    if (percent === 100) {
        Session.set('percent', 0)
    } else {
        percent ++;
        Session.set('percent', percent);
    }
    return percent;
}

function update_sun_color_and_position(percent) {
    let blue, clockTop, decimalPercent, hColor, red,
        reverseDecimalPercent, shadowColor, spotColor, tColor,
        timeDecimalPercent, timeLeftOffset;
    decimalPercent = percent * 0.01;
    reverseDecimalPercent = 1 - decimalPercent;
    red = Math.round(255 * decimalPercent);
    blue = Math.round(255 * reverseDecimalPercent);
    timeDecimalPercent = decimalPercent + (0.13 * (1300 / 1500)); // 1500 was window width
    if (timeDecimalPercent > 1) {
        timeDecimalPercent = 1;
        }
    timeLeftOffset = (300) * timeDecimalPercent;  // 1500 was window width
    hColor = `rgba(${red} ,0 ,${blue}, 0.7)`;
    tColor = `rgba(${red}, 0, ${blue}, 1)`;
    /*
    if (decimalPercent > 0.6) {
        clockTop = -70 * decimalPercent;
        $('.clock').css({
            top: clockTop
        });
    }
     */
    $('.time').css({
        color: tColor,
        left: (timeLeftOffset + 580)
    });

    $('.sun-container').css({
        left: (timeLeftOffset - 100)
    });

    spotColor = `rgba(${red},0,${blue}, 0.3)`;
    shadowColor = `rgba(${red},0,${blue}, 0.3) 0 0 27px 18px`;
    return $('.sun-spot').css({
            backgroundColor: spotColor,
            boxShadow: shadowColor
        });
}

function build_sun_spots (count) {
   let accounted, i, j, ref, results, sun;
    sun = $('.sun');
    accounted = 0;
    results = [];
    for (i = j = 1, ref = count; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
        results.push(setTimeout(function () {
            let div_class, left_offset, relative_size, size;
            accounted++;
            if (accounted === count) {
                div_class = "sun-spot last";
            } else {
                div_class = "sun-spot number" + accounted;
            }
            relative_size = Math.floor(Math.random() * 51);
            relative_size = relative_size - Math.floor(Math.random() * relative_size);
            left_offset = Math.floor(Math.random() * 30);
            size = relative_size + '%';
            sun.append(`<div class=\"${div_class}\" 
                                               style=\"width:${relative_size + 30}%; 
                                               height:${size}; 
                                               top:${(100 - relative_size) / 2}%;
                                               left:${((100 - relative_size) / 2) + (10 - left_offset)}%;
                                                \"></div>`);
            if (accounted === count) {
               this.$('.sun-spot.last').hide();
                    $('.sun-spot.last').fadeIn(2000, function () {
                    return $('.sun-spot.last').addClass('pulse');
                });
            }
            return update_sun_color_and_position(percent_time(2));
        }, i * (4000 / count)));
    }
    return results;
}

function set_sun_size () {
    let sunHeight, sunWidth, wH, wW;
   // wH = $(window).height();
   // wW = $(window).width();
    sunWidth =  150;                  //wW / 6;
    sunHeight = sunWidth / 3;
    return $('.sun').css({
        top: -1 * (sunHeight / 2),
        left: -1 * (sunWidth / 2),
        width: sunWidth,
        height: sunHeight
    });
}


Template.moveMachines.helpers({

    machineReservoir: () => {
        let today = moment().add( -16, 'days').format('YYYY-MM-DD')
        let result = machineCommTable.find({inLineDate : {$gt: today}, activeAssemblyLineList : true},
                                                       {fields: {
                                                                         counter: 1,
                                                                         machineId: 1,
                                                                         timeLine: 1,
                                                                         inLineDate: 1,
                                                                         bayReady: 1
                                                                         }}).fetch();

        result.sort((a, b) => (a.counter > b.counter) ? 1 :
            ((b.counter > a.counter) ? -1 : 0));
       // console.log(result)
        return result;
    },

/*
    draw_ST1: () => {
        let id = "machine-field-st1";
        let machineNr = "C8900573"
        invokeDrawNewMachine(machineNr, id);
    },

    draw_ST2: () => {
        let id = "machine-field-st2";
        let machineNr = "C8900572"
        invokeDrawNewMachine(machineNr, id);
    },

    draw_ST3: () => {
        let id = "machine-field-st3";
        let machineNr = "C8900571"
        invokeDrawNewMachine(machineNr, id);
    },

    draw_ST4: () => {
        let id = "machine-field-st4";
        let machineNr = "C8900570"
        invokeDrawNewMachine(machineNr, id);
    },

    draw_ST_merge: () => {
        let id = "machine-field-st-merge";
        let machineNr = "C8900569"
        invokeDrawNewMachine(machineNr, id);
    },

    draw_cooling1: () => {
        let id = "machine-field-cooling-1";
        let machineNr = "C8900571"
        invokeDrawNewMachine(machineNr, id);
    },
    draw_cooling2: () => {
        let id = "machine-field-cooling-2";
        let machineNr = "C8900570"
        invokeDrawNewMachine(machineNr, id);
    },

 */

    //  ------------------  Assembly Line starts here --------------------------------
        //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_fcb_threshing: () => {
        let canvasId = "machine-field-fcb-threshing";
        let result = activeAssembly.findOne({_id : canvasId},{});
        try {
            if (result.bayArray.length === 0) {
                // draw empty field in Bay
                invokeEmptyBay(canvasId)
            } else if (result.bayArray.length === 1) {
                let locator = 'helper draw_fcb...'
                // draw 1 machine in Bay
                let machineNrInBay = result.bayArray[0].machineNr;
                invokeDrawOneMachine(machineNrInBay, canvasId, locator);
            }
        } catch(e) {

        }
    },

    draw_bay3: () => {
        let canvasId = "machine-field-bay3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay4: () => {
        let canvasId = "machine-field-bay4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay5: () => {
        let canvasId = "machine-field-bay5";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay6: () => {
        let canvasId = "machine-field-bay6";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay7: () => {
        let canvasId = "machine-field-bay7";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay8: () => {
        let canvasId = "machine-field-bay8";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay9: () => {
        let canvasId = "machine-field-bay9";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay10: () => {
        let canvasId = "machine-field-bay10";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_1: () => {
        let canvasId = "machine-field-test-bay-1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_2: () => {
        let canvasId = "machine-field-test-bay-2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_3: () => {
        let canvasId = "machine-field-test-bay-3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_4: () => {
        let canvasId = "machine-field-test-bay-4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_14: () => {
        let canvasId = "machine-field-bay-14";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_15: () => {
        let canvasId = "machine-field-bay-15";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_16: () => {
        let canvasId = "machine-field-bay-16";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_17: () => {
        let canvasId = "machine-field-bay-17";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_18: () => {
        let canvasId = "machine-field-bay-18";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_19: () => {
        let canvasId = "machine-field-bay-19";
        invokeDrawMachineInBay(canvasId)
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
        let machineNr = this.machineId;
        let canvasId = "machine-field-fcb-threshing"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
      //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine, machineNr, canvasId);
            invokeDrawNewMachine(machineNr, canvasId)
            } else {
                window.alert('2 Machines in Bay 2 are not allowed')
               }
    },

    'click .bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-fcb-threshing'
        let newCanvasId = "machine-field-bay3";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay3'
        let newCanvasId = "machine-field-bay4";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay4'
        let newCanvasId = "machine-field-bay5";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-5-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay5'
        let newCanvasId = "machine-field-bay6";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-6-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay6'
        let newCanvasId = "machine-field-bay7";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-7-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay7'
        let newCanvasId = "machine-field-bay8";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-8-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay8'
        let newCanvasId = "machine-field-bay9";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-9-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay9'
        let newCanvasId = "machine-field-bay10";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-10-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay10'
        let newCanvasId = "machine-field-test-bay-1";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-test-bay-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-test-bay-1'
        let newCanvasId = "machine-field-test-bay-2";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-test-bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-test-bay-2'
        let newCanvasId = "machine-field-bay-14";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },
/*
    'click .bay-test-bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-test-bay-2'
        let newCanvasId = "machine-field-bay11";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-test-bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay10'
        let newCanvasId = "machine-field-bay11";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

 */

    'click .bay-14-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay-14'
        let newCanvasId = "machine-field-bay-15";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-15-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay-15'
        let newCanvasId = "machine-field-bay-16";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-16-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay-16'
        let newCanvasId = "machine-field-bay-17";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-17-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay-17'
        let newCanvasId = "machine-field-bay-18";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-18-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay-18'
        let newCanvasId = "machine-field-bay-19";
        invokeMoveMachine(oldCanvasId, newCanvasId)
    },

    'click .bay-19-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine-field-bay-19' // Last Bay
        invokeMoveFromLastBay(oldCanvasId)
    }


});


// ***************   check status of the field if empty or engaged   **********************
function invokeMachineTest(canvasId) {
    let result = activeAssembly.findOne({_id: canvasId}, {})   // looking up in bay if and how many machines
    if (result.bayArray.length === 0) {
        // found empty bay
  //      console.log('function bay status 0', canvasId, result)
        return [0];
        } else if (result.bayArray.length === 1) {
        // found 1  Machines in Bay
     //   console.log('function bay status 1', canvasId, result)
            return [1, result.bayArray]
        } else if (result.bayArray.length === 2) {
    //    console.log('function bay status 2', canvasId, result)
            return [2, result.bayArray];
        }
}

function invokeEmptyBay(canvasId) {
    Meteor.defer(function() {
        //  console.log('inside first function', machineNr, id)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear any canvas in Bay

        ctx.strokeStyle = "#ee0e0e";
        ctx.lineWidth = "2"
        ctx.strokeRect(0, 15, 90, 30)
    })
}

function  invokeDrawMachineInBay(canvasId) {
    let result = activeAssembly.findOne({_id : canvasId},{});
    try {
        if (result.bayArray.length === 0) {
            // draw empty field in Bay
            invokeEmptyBay(canvasId)
        } else if (result.bayArray.length === 1) {
            // draw 1 machine in Bay
            let machineNrInBay = result.bayArray[0].machineNr;
            invokeDrawOneMachine(machineNrInBay, canvasId);
        } else if (result.bayArray.length === 2) {
            // draw 2 Machines in Bay
            let machineOne = result.bayArray[0].machineNr;
            let machineTwo =  result.bayArray[1].machineNr;
            // console.log(machineOne, machineTwo)
            invokeDrawTwoMachines(machineOne, machineTwo, canvasId)
        }
    } catch(e) {
    }
}

function invokeMoveMachine(oldCanvasId, newCanvasId) {
    let spaceResult = activeAssembly.findOne({_id: newCanvasId}, {fields: {baySpace: 1}});
    let space_in_Bay = spaceResult.baySpace;
    let user = Meteor.user().username;
    let machineToMove = invokeMachineTest(oldCanvasId) // checking which machine is in Bay now
    let result = invokeMachineTest(newCanvasId);  // checking if a machine is in front
  //  console.log(machineToMove, result)
    if (result[0] === 0) {  // no machine in front
        let machineCount = machineToMove[0];
    //      console.log('machineToMove ', oldCanvasId, machineCount, newCanvasId, machineToMove)
        if (machineCount === 1) {
            // move 1 Machine
            let jsonObject = machineToMove[1][0];
            let machineId = jsonObject.machineId;
            let machineNr = jsonObject.machineNr;
     //       console.log('Object ',machineId, machineNr, user, oldCanvasId, newCanvasId)
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false)
        } else if (machineCount === 2) {
    //        console.log('2 Machines')
            // 2 Machines in present Bay, but nothing in front, Move first machine
            let machineId = machineToMove[1][0].machineId;
            let machineNr = machineToMove[1][0].machineNr;
     //       console.log(machineToMove[1][0].machineNr)
            Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, true)
        }

    } else if (result[0] === 1 && space_in_Bay === 2) {  // already 1 machine in front and Space for 2
                                                         //     console.log('found 1 Machine in Bay', result[1][0])
        // find Machine Number already in Bay
        let presentMachineNr = result[1][0].machineNr;
        let jsonObject = machineToMove[1][0];
        let machineId = jsonObject.machineId;
        let machineNr = jsonObject.machineNr;
        Meteor.call('moveMachineToNextBay', machineId, machineNr, user, oldCanvasId, newCanvasId, false)
        invokeDrawTwoMachines(presentMachineNr, machineNr, newCanvasId)
        } else if (result[0] === 1 && space_in_Bay === 1) {
            // found 1 Machine up front but only space for 1 dont move, send alert
            window.alert('Only 1 Machine in Bay up front allowed')
        } else if (result[0] === 2) {
            // console.log('found 2 Machine in Bay in front', result)
            // dont move machine, send alert
            window.alert('3 Machines in one Bay are not possible')
        }


}

function invokeDrawOneMachine(machineNr, canvasId, locator) {
    Meteor.defer(function() {
      //  console.log('Draw Machine in Bay', machineNr, canvasId, locator)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear leftovers

            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#3ee021";
            ctx.lineWidth = "2"
            ctx.strokeRect(0, 15, 90, 30)
            ctx.font = "bold 15px Arial"
            ctx.fillText(machineNr, 7, 35)
    })
}

// ****  draw 1 machine  **********************
function invokeDrawNewMachine(machineNr, canvasId) {
    Meteor.defer(function() {
     //   console.log('Draw Machine in next Bay', machineNr, canvasId)
        let canvas = document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (machineNr && canvasId) {
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

function invokeDrawTwoMachines(presentMachine, newMachine, newCanvasId) {
    Meteor.defer(function() {
        // ******************   Delete previous drawn Canvas  ***************
        let canVas = document.getElementById(newCanvasId);
        let context = canVas.getContext("2d");
        context.clearRect(0, 0, canVas.width, canVas.height);

        // ****************  Draw new Canvas  *********************************

        let canvas = document.getElementById(newCanvasId);
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");

            ctx.fillStyle = '#37db1a'
            ctx.strokeStyle = "#ee0e0e";

            ctx.lineWidth = "2"
            ctx.strokeRect(0, 15, 90, 30);
            ctx.font = "bold 15px Arial";
            ctx.fillText(presentMachine, 10, 35);

            ctx.lineWidth = "2"
            ctx.strokeRect(0, 55, 90, 30);
            ctx.font = "bold 15px Arial"
            ctx.fillText(newMachine, 10, 75)
        }
    })
}

function invokeMoveFromLastBay(canvasId) {
    // call server active Assembly set time date machine is leaving
    let user = Meteor.user().username;
    let result = invokeMachineTest(canvasId)
    let machineId = result[1][0].machineId;
    Meteor.call('leaveLine', machineId, canvasId, user);
    // draw empty canvas in Bay 19
    invokeEmptyBay(canvasId)
}





Template.tact_time_team.events({

    'submit .tact-time': function(e) {
        e.preventDefault();
        let tactTime = e.target.inputTactTime.value;
        console.log(tactTime)
    },

    'submit .work-start': function(e) {
        e.preventDefault();
        let workStart = e.target.workingHourFrom.value;
        console.log(workStart)
    },

    'submit .work-hours': function(e) {
        e.preventDefault();
        let workHours = e.target.workingHourTotal.value;
        console.log(workHours)
    },

});



