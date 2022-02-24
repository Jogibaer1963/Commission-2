Meteor.subscribe('activeAssembly')


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

Template.loginView.events({

    'click .loginView': (e) => {
        e.preventDefault();
        FlowRouter.go('/login')
    }

})


//-------------------------------------------------------------------------------------

Template.burstSunTimerTeam_1.helpers({

    tactTimeLeft: () => {
    //  let init2 = activeAssembly.findOne({_id: 'team-1'}, {fields: {tactTimeLeft: 1}});
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


