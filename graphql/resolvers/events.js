const {dateToString} = require("../../helpers/date")
const Event = require('../../models/events')
const Users = require("../../models/user");

const {transformEvent} = require("./global_resolvers");

module.exports = {
    events: () => {
        return Event.find().then(results => {
            return results.map(result => {
                return transformEvent(result);
            })
        }).catch(err => {
            throw err;
        })
    },
    createEvent: (args,req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated")
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: req.userId
        })
        let createdEvent;
        return event.save().then(result => {
            createdEvent = transformEvent(result);;
            return Users.findById(req.userId)
        })
            .then(user => {
                if (!user) {
                    throw new Error("user not found")
                }
                user.createdEvents.push(event)
                user.save()

            }).then(result => {
                return createdEvent
            }).catch(err => {
                throw err;
            })
    },
  
}