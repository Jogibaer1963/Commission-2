import {Meteor} from "meteor/meteor";


Template.lineAdministration.events({

        'submit .team-1-hours': function (e) {
            e.preventDefault();
            let bay_2_start, bay_3_start, bay_4_start, bay_2_end, bay_3_end, bay_4_end;
            bay_2_start = e.target.bay_2_work_start.value;
            bay_3_start = e.target.bay_3_work_start.value;
            bay_4_start = e.target.bay_4_work_start.value;
            bay_2_end = e.target.bay_2_work_end.value;
            bay_3_end = e.target.bay_3_work_end.value;
            bay_4_end = e.target.bay_4_work_end.value;
            console.log(bay_2_start, bay_3_start, bay_4_start, bay_2_end, bay_3_end, bay_4_end)
            Meteor.call('shift_team_1', bay_2_start, bay_3_start, bay_4_start, bay_2_end, bay_3_end, bay_4_end)
        }

    })