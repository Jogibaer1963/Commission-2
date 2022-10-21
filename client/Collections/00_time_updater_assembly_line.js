/*
Meteor.subscribe('activeAssembly')

Template.timeUpdater.helpers({

    serverTimeActivator: () => {
        let timeRespond = '';
        setInterval(function () {
            Meteor.call('serverTime', function(err, respond) {
                if (err) {
              //      console.log('error', err)
                } else {
                  //  console.log('server Respond ', respond)
                }
            })
        }, 60*200)
    }

})

Template.assemblyTimer.helpers({

    printServerTime: () => {
        let serverTime = activeAssembly.findOne({_id: "assemblyLineTimeStamp"});
      //  console.log('Server Time ', serverTime)
        return serverTime
    }

})

 */