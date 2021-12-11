const Event = require('../../models/events');
const Users = require("../../models/user");
const {dateToString} = require("../../helpers/date")

const transformEvent = event =>{
    return {
        ...event._doc, 
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

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
            return transformEvent(event);
        })
    }).catch(err => {
        throw err;
    })
}

const singleEvent = async eventId =>{
    try{
        const event = await Event.findById(eventId);
        return transformEvent(event);

    } catch (err){
        throw err;
    }

}
const transformBooking = booking => {  
    return {
        ...booking._doc, 
        _id:booking.id ,
        user:user.bind(this,booking._doc.user),
        event:singleEvent.bind(this,booking._doc.event), 
        createdAt: dateToString(booking._doc.createdAt), 
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;