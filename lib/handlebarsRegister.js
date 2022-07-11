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

    Handlebars.registerHelper('getPickingStatus', (urgency) => {
        switch (urgency) {
            case 10: {
                return 'open-orders-1'
            }
            case 11: {
                return 'open-orders-2'
            }
            case 12: {
                return 'open-orders-3'
            }
        }
    });

    Handlebars.registerHelper('getOrderStatus', (status) => {
        switch (status) {
            case 1: {
                return '#a914da'; // order in process
            }
            case 2: {
                return '#138b11'; // order Finished
            }
            case 0: {
                return '#d71d2a'; // order open
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
            case 3 : {
                return '#a914da';    // 3 = pause
            }
            case 4 : {
                return 'black';
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
            case 4 : {
                return 'in-active-button';
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

    Handlebars.registerHelper('getListStatus', (commissionList) => {
        switch (commissionList) {
            case 1: {
                return '#bf7cd4';
            }
        }
    });


}