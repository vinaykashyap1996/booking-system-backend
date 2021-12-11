const {dateToString} = require("../../helpers/date")
const Event = require('../../models/events')
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
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: "61b226700bdc068facf4a291"
        })
        let createdEvent;
        return event.save().then(result => {
            createdEvent = transformEvent(result);;
            return Users.findById("61b226700bdc068facf4a291")
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