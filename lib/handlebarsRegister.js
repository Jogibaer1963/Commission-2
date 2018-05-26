if (Meteor.isClient) {

    Handlebars.registerHelper('getToDoStatus', (toDoStatus) => {
        switch (toDoStatus) {
            case 0: {
                return 'red';
            }
            case 1: {
                return 'inProcess';
            }
            case 2: {
                return 'green';
            }
        }
    });

    UI.registerHelper('getStatusColor', (supplyStatus) => {
        switch (supplyStatus) {
            case 0 : {
                return 'orangered';
            }
            case 1 : {
                return '#138b11';
            }
            case 2 : {
                return 'inProcess';
            }
        }
    });

   UI.registerHelper('getCommStatus', (e) => {
        switch (e) {
            case 0 : {                 // 0 = not touched
                return 'orangered';
            }
            case 1 : {
                return 'in-active-button';      // 1 = done
            }
            case 2 : {
                return 'comm-in-process' ;    // 2 = in process
            }
            case 3 : {
                return '#a914da';    // 3 = pause
            }
        }
    });

    Handlebars.registerHelper('getStatusLogin', (loginStatus) => {
        switch (loginStatus) {
            case 0: {
                return 'red';
            }
            case 1: {
                return 'green';
            }
        }
    });


}