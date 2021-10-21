Meteor.subscribe('activeAssembly')

import { invokeMachineTest } from '../../lib/99_functionCollector.js';
import { invokeEmptyBay } from '../../lib/99_functionCollector.js';
import { invokeDrawMachineInBay } from '../../lib/99_functionCollector.js';
import { invokeMoveMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawNewMachine } from '../../lib/99_functionCollector.js';
import { invokeDrawOneMachine } from '../../lib/99_functionCollector.js';
import { invokeMoveFromLastBay } from  '../../lib/99_functionCollector.js'

Session.set('twoMachines', false)
//-----------------  Global Sun set theme function -----------------------------------

function set_theme(current_theme) {
    let  themes = ['sunset'];
    this.$('.body').removeClass(themes[current_theme]);
    return $('.body').addClass(themes[current_theme]);
}

Template.assemblyLine.helpers({
  test: () => {

  }

})

//-------------------------------------------------------------------------------------
Template.burstSunTimerTeam_1.helpers({

    tactTimeLeft: () => {
      let init2 = activeAssembly.findOne({_id: 'team-1'}, {fields: {tactTimeLeft: 1}});
      //console.log('init 2: ', init2)
    },
})

Template.burstSunTimerTeam_1.onRendered(function() {
    let init;
    let current_theme = 0;
    Session.set('percent-team-1', 0)
    set_theme(current_theme);
    update_clock_team_1();
    setInterval(function () {
        init = activeAssembly.findOne({_id: 'machine-field-bay3'});
       // console.log(init)
        return  update_clock_team_1();
    }, 30000);  // 10 sec = 10000 ms
    build_sun_spots_team_1(10);
    set_sun_size_team_1();
});

//-------------------- Function's Team 1 Sun Set -------------------------------------

function  update_clock_team_1() {
    let time_output = this.$('.clock-team-1 .time-team-1 span');
  //  console.log(time_output.text()) // time in % showing in Browser
    let pTime, percent;
    percent =  percent_time_team_1(2);
    pTime = percent + "%";
    if (pTime !== time_output.text()) {
        time_output.text(pTime);
        return update_sun_color_and_position_team_1(percent);
    }
}

function percent_time_team_1(fixed) {
    let percent = Session.get('percent-team-1')
    if (percent === 100) {
        Session.set('percent-team-1', 0)
    } else {
       percent ++;
       Session.set('percent-team-1', percent);
      Meteor.call('updateTactTime', percent)
    }
    return percent;
}

function update_sun_color_and_position_team_1(percent) {
    let blue, decimalPercent, red,
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
    tColor = `rgba(${red}, 0, ${blue}, 1)`;
    $('.time-team-1').css({
        color: tColor,
        left: (timeLeftOffset + 580)
    });
    $('.sun-container-team-1').css({
        left: (timeLeftOffset - 100)
    });
    spotColor = `rgba(${red},0,${blue}, 0.3)`;
    shadowColor = `rgba(${red},0,${blue}, 0.3) 0 0 27px 18px`;
    return $('.sun-spot-team-1').css({
        backgroundColor: spotColor,
        boxShadow: shadowColor
    });
}

function set_sun_size_team_1 () {
    let sunHeight, sunWidth;
    sunWidth =  150;
    sunHeight = sunWidth / 3;
    return $('.sun-team-1').css({
        top: -1 * (sunHeight / 2),
        left: -1 * (sunWidth / 2),
        width: sunWidth,
        height: sunHeight
    });
}

function build_sun_spots_team_1 (count) {
    let accounted, i, j, ref, results, sun;
    sun = $('.sun-team-1');
    accounted = 0;
    results = [];
    for (i = j = 1, ref = count; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
        results.push(setTimeout(function () {
            let div_class, left_offset, relative_size, size;
            accounted++;
            if (accounted === count) {
                div_class = "sun-spot-team-1 last";
            } else {
                div_class = "sun-spot-team-1 number" + accounted;
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
                this.$('.sun-spot-team-1.last').hide();
                $('.sun-spot-team-1.last').fadeIn(2000, function () {
                    return $('.sun-spot-team-1.last').addClass('pulse');
                });
            }
            return update_sun_color_and_position_team_1(percent_time_team_1(2));
        }, i * (4000 / count)));
    }
    return results;
}
//------------------------------------------------------------------------------------------

Template.burstSunTimerTeam_2.onRendered(function() {
    let current_theme = 0;
    Session.set('percent', 0)
    set_theme(current_theme);
    update_clock_team_2();
    setInterval(function () {
        return update_clock_team_2();
    }, 1000);
    build_sun_spots_team_2(10);
    set_sun_size_team_2();
});

//-------------------- Function's Team 2 Sun Set -------------------------------------

function  update_clock_team_2() {
    let time_output = this.$('.clock-team-2 .time-team-2 span');
    //  console.log(time_output.text()) // time in % showing in Browser
    let pTime, percent;
    setTimeout(function(){
        //do what you need here
    }, 2000);
    percent =  percent_time_team_2(2);
    pTime = percent + "%";
    if (pTime !== time_output.text()) {
        time_output.text(pTime);
        return update_sun_color_and_position_team_2(percent);
    }
}

function percent_time_team_2(fixed) {
    let percent = Session.get('percent')
    if (percent === 100) {
        Session.set('percent', 0)
    } else {

        percent ++;
        Session.set('percent', percent);
    }
    return percent;
}

function update_sun_color_and_position_team_2(percent) {
    let blue, decimalPercent, red,
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
    tColor = `rgba(${red}, 0, ${blue}, 1)`;
    $('.time-team-2').css({
        color: tColor,
        left: (timeLeftOffset + 580)
    });
    $('.sun-container-team-2').css({
        left: (timeLeftOffset - 100)
    });
    spotColor = `rgba(${red},0,${blue}, 0.3)`;
    shadowColor = `rgba(${red},0,${blue}, 0.3) 0 0 27px 18px`;
    return $('.sun-spot-team-2').css({
        backgroundColor: spotColor,
        boxShadow: shadowColor
    });
}

function set_sun_size_team_2 () {
    let sunHeight, sunWidth;
    sunWidth =  150;
    sunHeight = sunWidth / 3;
    return $('.sun-team-2').css({
        top: -1 * (sunHeight / 2),
        left: -1 * (sunWidth / 2),
        width: sunWidth,
        height: sunHeight
    });
}

function build_sun_spots_team_2 (count) {
    let accounted, i, j, ref, results, sun;
    sun = $('.sun-team-2');
    accounted = 0;
    results = [];
    for (i = j = 1, ref = count; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
        results.push(setTimeout(function () {
            let div_class, left_offset, relative_size, size;
            accounted++;
            if (accounted === count) {
                div_class = "sun-spot-team-2 last";
            } else {
                div_class = "sun-spot-team-2 number" + accounted;
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
                this.$('.sun-spot-team-2.last').hide();
                $('.sun-spot-team-2.last').fadeIn(2000, function () {
                    return $('.sun-spot-team-2.last').addClass('pulse');
                });
            }
            return update_sun_color_and_position_team_2(percent_time_team_2(2));
        }, i * (4000 / count)));
    }
    return results;
}
//-----------------------------------------------------------------------------------------


Template.moveMachines.helpers({

    machineReservoir: () => {
        let today = moment().add( -16, 'days').format('YYYY-MM-DD')
        let result = machineCommTable.find({activeAssemblyLineList : true},
                                                       {fields: {
                                                           activeAssemblyLineList: 1,
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


    //  ------------------  Assembly Line starts here --------------------------------
        //  ***************    Move Machine from List to the FCB merging Station  *************

    draw_fcb_threshing: () => {
        let canvasId = "machine_field_fcb_threshing";
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

    draw_merge_Engine: () => {
        let canvasId = "engine_merge";
       // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_cooling_box_1: () => {
        let canvasId = "engine_cooling_box_1";
        // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_cooling_box_2: () => {
        let canvasId = "engine_cooling_box_2";
        // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_station_1: () => {
        let canvasId = "engine_station_1";
        // invokeDrawMachineInBay(canvasId)
    },
    draw_engine_station_2: () => {
        let canvasId = "engine_station_2";
        // invokeDrawMachineInBay(canvasId)
    },
    draw_engine_station_3: () => {
        let canvasId = "engine_station_3";
        // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_station_4: () => {
        let canvasId = "engine_station_4";
        // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_storage_1: () => {
        let canvasId = "engine_storage_1";
        // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_storage_2: () => {
        let canvasId = "engine_storage_2";
        // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_storage_3: () => {
        let canvasId = "engine_storage_3";
        // invokeDrawMachineInBay(canvasId)
    },

    draw_engine_storage_4: () => {
        let canvasId = "engine_storage_4";
        // invokeDrawMachineInBay(canvasId)
    },
/*
    draw_fcb_threshing: () => {
        let canvasId = "machine_field_fcb_threshing";
        invokeDrawMachineInBay(canvasId)
    },

 */

    draw_bay3: () => {
        let canvasId = "machine_field_bay_3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay4: () => {
        let canvasId = "machine_field_bay_4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay5: () => {
        let canvasId = "machine_field_bay_5";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay6: () => {
        let canvasId = "machine_field_bay_6";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay7: () => {
        let canvasId = "machine_field_bay_7";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay8: () => {
        let canvasId = "machine_field_bay_8";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay9: () => {
        let canvasId = "machine_field_bay_9";
        invokeDrawMachineInBay(canvasId)

    },

    draw_bay10: () => {
        let canvasId = "machine_field_bay_10";
        invokeDrawMachineInBay(canvasId)
    },

    draw_front_test_bay: () => {
        let canvasId = "machine_field_front_test_bay";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_1: () => {
        let canvasId = "machine_field_test_bay_1";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_2: () => {
        let canvasId = "machine_field_test_bay_2";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_3: () => {
        let canvasId = "machine_field_test_bay_3";
        invokeDrawMachineInBay(canvasId)
    },

    draw_test_bay_4: () => {
        let canvasId = "machine_field_test_bay_4";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_14: () => {
        let canvasId = "machine_field_bay_14";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_15: () => {
        let canvasId = "machine_field_bay_15";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_16: () => {
        let canvasId = "machine_field_bay_16";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_17: () => {
        let canvasId = "machine_field_bay_17";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_18: () => {
        let canvasId = "machine_field_bay_18";
        invokeDrawMachineInBay(canvasId)
    },

    draw_bay_19: () => {
        let canvasId = "machine_field_bay_19";
        invokeDrawMachineInBay(canvasId)
    },


});


Template.moveMachines.events({

    'click .selectedAssemblyMachine': async function(e) {
        e.preventDefault();
        let selectedAssemblyMachine = this._id;
        let machineNr = this.machineId;
        let canvasId = "machine_field_fcb_threshing"
        let bayStatus = await invokeMachineTest(canvasId)  //  ********    Submit canvasId to function
      //  console.log('Bay Status ', bayStatus[0]) // returns 0 if bay is empty, ready to move machine into bay
        if (bayStatus[0] === 0) {
            Meteor.call('moveFromListToFCB_Bay', selectedAssemblyMachine, machineNr, canvasId);
            invokeDrawNewMachine(machineNr, canvasId)
            } else {
                window.alert('2 Machines in Bay 2 are not allowed')
               }
    },

    //****************  Test Bay Move Buttons  *******************************

    'click .front-test-bay-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_front_test_bay'
        let newCanvasId = "machine_field_test_bay_1";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-1-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_2";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-1-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-1-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_1'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_bay_14";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-2-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .test-bay-2-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_2'
        let newCanvasId = "machine_field_test_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_3'
        let newCanvasId = "machine_field_test_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-test-bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_test_bay_4'
        let newCanvasId = "machine_field_bay_14";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },




});


Template.overViewButtons.events({

    'click .bay-2-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_fcb_threshing'
        let newCanvasId = "machine_field_bay_3";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-3-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_3'
        let newCanvasId = "machine_field_bay_4";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-4-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_4'
        let newCanvasId = "machine_field_bay_5";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-5-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_5'
        let newCanvasId = "machine_field_bay_6";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-6-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_6'
        let newCanvasId = "machine_field_bay_7";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-7-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_7'
        let newCanvasId = "machine_field_bay_8";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-8-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_8'
        let newCanvasId = "machine_field_bay_9";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-9-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_9'
        let newCanvasId = "machine_field_bay_10";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-10-move-button': (e) => {
        e.preventDefault();
        // check if test bay 1 is empty, if not then move to front of test bay
        let result = activeAssembly.findOne({_id: 'machine_field_test_bay_1'},
            {fields: {bayArray : 1}})
        if (result.bayArray.length > 0) {
           // console.log('test bay 1 is engaged move in front of test bay')
            let oldCanvasId = 'machine_field_bay_10'
            let newCanvasId = "machine_field_front_test_bay";
            invokeMoveMachine(oldCanvasId, newCanvasId, false)
        } else if (result.bayArray.length === 0 ) {
          // console.log('test bay 1 is empty, move into test bay')
            let oldCanvasId = 'machine_field_bay_10'
            let newCanvasId = "machine_field_test_bay_1";
            invokeMoveMachine(oldCanvasId, newCanvasId, false)
        }
    },




    'click .bay-14-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_14'
        let newCanvasId = "machine_field_bay_15";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-15-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_15'
        let newCanvasId = "machine_field_bay_16";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-16-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_16'
        let newCanvasId = "machine_field_bay_17";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-17-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_17'
        let newCanvasId = "machine_field_bay_18";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-18-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_18'
        let newCanvasId = "machine_field_bay_19";
        invokeMoveMachine(oldCanvasId, newCanvasId, false)
    },

    'click .bay-19-move-button': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_19' // Last Bay
        invokeMoveFromLastBay(oldCanvasId)
    },

    'click .move-back': (e) => {
        e.preventDefault();
        let oldCanvasId = 'machine_field_bay_19'
        let newCanvasId = "machine_field_bay_18";
        invokeMoveMachine(oldCanvasId, newCanvasId, true)
    }

})



