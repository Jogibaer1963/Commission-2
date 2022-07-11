Meteor.subscribe('lineOrders');


Template.orderAnalysis.helpers({

        orderList:() => {
            let orderArray = []
            let result, orderObject, openOrder, duration, overAllDuration;
            result = lineOrders.find().fetch();
            result.forEach((element) => {
                if (element.status !== 2) {
                    openOrder = 0;
                    duration = 0;
                    overAllDuration = 0;
                } else {
                    openOrder =  transformDate(parseInt(element.order_completed)),
                    duration = ((parseInt(element.order_completed) -
                        parseInt(element.picking_start)) / 60000).toFixed(0)  ;
                    overAllDuration = ((parseInt(element.order_completed) -
                        parseInt(element.time_ordered)) / 60000).toFixed(0)
                }
                orderObject = {
                    team : element.team_user,
                    orderStart : transformDate(parseInt(element.time_ordered)),
                    quantity : element.quantity_needed,
                    storage : element.storage_bin,
                    pou : element.point_of_use,
                    reason : element.reason,
                    urgency : element.urgency,
                    status : element.status,
                    pickingStart : transformDate(parseInt(element.picking_start)),
                    pickingFinished : openOrder,
                    duration : duration,
                    overAllDuration :  overAllDuration,
                    picker : element.picked_by
                }
                orderArray.push(orderObject)
            })
            return orderArray;
        }

})

function transformDate(unixTime) {
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let orderStart, year, month, date, hours, minutes, seconds;
    orderStart = new Date(parseInt(unixTime))
    year = orderStart.getFullYear();
    month = months[orderStart.getMonth()];
    date = orderStart.getDate();
    hours = orderStart.getHours();
    minutes = orderStart.getMinutes();
    seconds = orderStart.getSeconds();
   // console.log(orderStart, date + '-' + month + '-' + year + ' '+ hours + ':' + minutes + ':' + seconds)
    return (date + '-' + month + '-' + year + ' '+ hours + ':' + minutes + ':' + seconds)
}

Template.orderAnalysis.events({


})