

    Template.lineAdministration.events({

        'submit .bay-2-hours': function (e) {
            e.preventDefault();
            let result = e.target.bay_2_work_hour.value;
            console.log(result)

        }

    })