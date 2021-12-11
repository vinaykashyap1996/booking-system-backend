const bcrypt = require("bcryptjs");
const Event = require('../../models/events')
const Users = require("../../models/user");
const Booking = require("../../models/booking")
const user = userId => {
    return Users.findById(userId).then(user => {
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
    }).catch(err => {
        throw err;
    })
}

const events = eventsId => {
    return Event.find({ _id: { $in: eventsId } }).then(events => {
        return events.map(event => {
            return { ...event._doc, _id: event.id, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event.creator) }
        })
    }).catch(err => {
        throw err;
    })
}

const singleEvent = async eventId =>{
    try{
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id:event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (err){
        throw err;
    }

}
module.exports = {
    events: () => {
        return Event.find().then(results => {
            return results.map(result => {
                return {
                    ...result._doc, _id: result.id, date: new Date(result._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
                }
            })
        }).catch(err => {
            throw err;
        })
    },
    booking: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { ...booking._doc, _id: booking.id, user:user.bind(this,booking._doc.user),event:singleEvent.bind(this,booking._doc.event),createdAt: new Date(booking._doc.createdAt).toISOString(), updatedAt: new Date(booking._doc.updatedAt).toISOString() }
            })
        } catch (error) {
            throw error
        }
    },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "61b226700bdc068facf4a291"
        })
        let createdEvent;
        return event.save().then(result => {
            createdEvent = { ...result._doc, _id: result.id, date: new Date(result._doc.date).toISOString() };
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
    createUser: (args) => {
        return Users.findOne({ email: args.userInput.email }).then(user => {
            if (user) {
                throw new Error("User already exists")
            }
            return bcrypt.hash(args.userInput.password, 12)

        }).then(hasedPassword => {

            const user = new Users({
                email: args.userInput.email,
                password: hasedPassword,

            })
            return user.save().then(result => {
                return { ...result._doc, _id: result.id ,password:null}
            }).catch(err => {
                throw err;
            })

        }).catch(err => {
            throw err;
        })
    },
    createBooking: async (args)=>{
       const fetchedEvent = await Event.findOne({_id:args.eventId})
       const booking = new Booking({
           user:"61b226700bdc068facf4a291",
           event:fetchedEvent
       })
       const result = await booking.save();
       return { ...result._doc, _id:result.id ,user:user.bind(this,result._doc.user),event:singleEvent.bind(this,result._doc.event), createdAt: new Date(result._doc.createdAt).toISOString(), updatedAt: new Date(result._doc.updatedAt).toISOString() }
    },
    cancelBooking: async (args)=>{
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event = {
            ...booking.event._doc,
            _id:booking.event.id,
            creator:user.bind(this,booking.event._doc.creator)
        }
        await Booking.deleteOne({_id:args.bookingId});
        return event;
    }
}