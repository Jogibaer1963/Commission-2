import {Session} from "meteor/session";


Template.pdiRepairList.helpers({

    openRepairList:() => {
        /*
        Meteor.call('give_me_team', 'Team 1', function(err, response) {
            if (response) {
                console.log(response)
                Session.set('t1-result', response)
            } else if (err) {
                console.log(err)
            }
        })
        return Session.get('t1-result')

         */
        let team = 'Team 1';
        let returnArray = []
        let returnObject = {}
        let result = machineReadyToGo.find({$and: [{pdiStatus : 1, repairStatus: 0}]},
            {fields: {machineId: 1, newIssues: 1}}).fetch();

        result.forEach((element) => {
            element.newIssues.forEach((element2) => {
                if (element2.responsible === team && element2.repairStatus === 0) {
                    //  console.log(element.machineId, element2.responsible, element2.errorDescription)
                    returnObject = {
                        id : element2._id,
                        machine : element.machineId,
                        error : element2.errorDescription,
                        image : element2.pictureLocation,
                        repairComment : element2.repairComment,
                        repairTech : element2.repairTech,
                        repairDateTime : element2.repairDateTime
                    }
                    returnArray.push(returnObject)
                }
            })
        })
        return returnArray;
    },

    'selected': function() {
        let selected = this.id;
        let clickedId = Session.get('team_lead_issue')
        if(selected === clickedId) {
            return 'selected'
        }
    },

})

Template.pdiRepairList.events({

    'click .selectedTeam_1_List': function (e) {
        e.preventDefault()
        let id = this.id;
        let machine = this.machine
        console.log(id, machine)
        Session.set('team_lead_issue', id);
        Session.set('team_lead_machine', machine)
    },

    'submit .team-lead-input-comments': function (e) {
        e.preventDefault()
        let comment = e.target.repair_comment.value;
        let tech = e.target.repair_tech.value;
        let id = Session.get('team_lead_issue')
        let machine = Session.get('team_lead_machine')
        console.log(comment, tech, id, machine)
        Meteor.call('team_leads_repairs', 'Team_1', comment, tech, id, machine)
    },

    'click .team-lead-toggle':(e) => {
        e.preventDefault();

    }


})