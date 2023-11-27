const Highcharts = require('highcharts');


Template.orderAnalysis.helpers({

    loadingOrderList:() => {
        Meteor.call('orderList', function(err, response) {
            if (response) {
                Session.set('orderResult', response)
            } else {
            }
        })
    },

        orderList:() => {
            let result = Session.get('orderResult')
            let team_order = Session.get('team-order')
            // console.log(team_order)
            if (team_order === 'all_teams') {
                Session.set('team_table', 'All Teams')
                try {
                    result[11].sort((a,b) => a.pickingEndTime > b.pickingEndTime ? 1 : -1)
                } catch (e) {}
               // console.log(result[11])
                Session.set("team_miss_picks", result[11].length)
                return result[11]
            }
            else if (team_order === 'team-1-order') {
                Session.set('team_table', 'Team 1')
                Session.set('diagram-1', result[5])
                Session.set('diagram-2', result[10])
                result[0].sort((a,b) => a.pickingEndTime - b.pickingEndTime )
                result[0].reverse()
                Session.set("team_miss_picks", result[0].length)
                return result[0]
            } else if (team_order === 'team-2-order') {
                Session.set('team_table', 'Team 2')
                Session.set('diagram-1', result[6])
                result[1].sort((a,b) => a.pickingEndTime > b.pickingEndTime ? 1 : -1)
                Session.set("team_miss_picks", result[1].length)
                return result[1]
            }  else if (team_order === 'team-3-order') {
                Session.set('team_table', 'Team 3')
                Session.set('diagram-1', result[7])
                result[2].sort((a,b) => a.pickingEndTime - b.pickingEndTime)
                result[2].reverse()
                Session.set("team_miss_picks", result[2].length)
                return result[2]
            } else if (team_order === 'team-4-order') {
                Session.set('team_table', 'Team 4')
                Session.set('diagram-1', result[8])
                result[3].sort((a,b) => a.pickingEndTime > b.pickingEndTime ? 1 : -1)
                Session.set("team_miss_picks", result[3].length)
                return result[3]
            } else if (team_order === 'team-5-order') {
                Session.set('team_table', 'Team 5')
                Session.set('diagram-1', result[9])
                result[4].sort((a,b) => a.pickingEndTime > b.pickingEndTime ? 1 : -1)
                Session.set("team_miss_picks", result[4].length)
                return result[4]
            }

        },

    team_miss_picks: () => {
           return Session.get('team_miss_picks')
    },

    team_order: () => {
           return Session.get('team_table')
    },

//  ********************************************   Charts   *************************************


    partNumbers: function () {
        // Gather data:
        try {
            let resultArray = [];
            let resultAmount = []
            let result = Session.get('diagram-1')
            resultArray = Object.keys(result)
            resultAmount = Object.values(result)
            // Use Meteor.defer() to create chart after DOM is ready:
            Meteor.defer(function() {
                // Create standard Highcharts chart with options:
                Highcharts.chart('part_numbers', {
                    title: {
                        text: 'Order per Part Number'
                    },
                    tooltip: {
                        shared: true
                    },
                    chart: {
                        style: {
                            fontFamily: '\'Unica One\', sans-serif'
                        },
                        plotBorderColor: '#606063',
                        height: 400,
                        width: 700,
                        zoomType: 'xy'
                    },
                    yAxis: {
                        categories: [],
                        title: {enabled: true,
                            text: 'Amount of equal Part Numbers',
                            style: {
                                fontWeight: 'normal'
                            }
                        }
                    },
                    xAxis: {
                        categories: resultArray,
                        title: {
                            enabled: true,
                            text: 'Part Numbers',
                            style: {
                                fontWeight: 'normal'
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Amount of equal Part Numbers',
                            type: 'column',
                            data: resultAmount
                        }
                    ]
                });
            });
        } catch (e) {

        }

    },

    orderPerReason: function () {
        // Gather data:
        let resultArray = [];
        let resultAmount = []
        try {
            let result = Session.get('diagram-2')
            resultArray = Object.keys(result)
            resultAmount = Object.values(result)
            // Use Meteor.defer() to create chart after DOM is ready:
            Meteor.defer(function() {
                // Create standard Highcharts chart with options:
                Highcharts.chart('order_reason', {
                    title: {
                        text: '5 Teams combined Orders per Reason '
                    },
                    tooltip: {
                        shared: true
                    },
                    chart: {
                        style: {
                            fontFamily: '\'Unica One\', sans-serif'
                        },
                        plotBorderColor: '#606063',
                        height: 400,
                        width: 700,
                        zoomType: 'xy'
                    },
                    yAxis: {
                        categories: resultAmount,
                        title: {enabled: true,
                            text: 'Amount per Reason',
                            style: {
                                fontWeight: 'normal'
                            }
                        }
                    },
                    xAxis: {
                        categories: ['Quality', 'Missing on Cart', 'Miss Count', 'Repair / Reconfig'],
                        title: {
                            enabled: true,
                            text: 'Reason for additional Orders',
                            style: {
                                fontWeight: 'normal'
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Amount per Reason',
                            type: 'column',
                            data: resultAmount
                        }
                    ]
                });
            });
        } catch (e) {

        }

    },

    reasonPerStorageBin: function () {
        // Gather data:

        // Use Meteor.defer() to create chart after DOM is ready:
        Meteor.defer(function() {
            // Create standard Highcharts chart with options:
            Highcharts.chart('reason_bin', {
                title: {
                    text: 'Reason per Storage Bin'
                },
                tooltip: {
                    shared: true
                },
                chart: {
                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063',
                    height: 400,
                    width: 700,
                    zoomType: 'xy'
                },
                yAxis: {
                    categories: [],
                    title: {enabled: true,
                        text: 'Amount per Reason',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                xAxis: {
                    categories: ['CB2-06(B-1)', 'CB2-07(F-3)', 'CB2-04(E-2)'],
                    title: {
                        enabled: true,
                        text: 'Storage Bins',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                series: [
                    {
                        name: 'Amount per Quality',
                        type: 'column',
                        data: [4,3,2,]
                    },
                    {
                        name: 'Amount per not on Cart',
                        type: 'spline',
                        data: [2,3,2,]
                    },
                    {
                        name: 'Amount per wrong count',
                        type: 'spline',
                        data: [0,0,2,]
                    }
                ]
            });
        });
    },




})


Template.orderAnalysis.events({

    'click #team_1': (e) => {
        e.preventDefault();
        Session.set('team-order', 'team-1-order')
    },

    'click #team_2': (e) => {
        e.preventDefault();
        Session.set('team-order', 'team-2-order')
    },

    'click #team_3': (e) => {
        e.preventDefault();
        Session.set('team-order', 'team-3-order')
    },

    'click #team_4': (e) => {
        e.preventDefault();
        Session.set('team-order', 'team-4-order')
    },

    'click #team_5': (e) => {
        e.preventDefault();
        Session.set('team-order', 'team-5-order')
    },

    'click #all_teams': (e) => {
        e.preventDefault();
        Session.set('team-order', 'all_teams')
    },

})