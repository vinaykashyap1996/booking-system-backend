const Booking = require("../../models/booking")
const Event = require('../../models/events')
const {transformEvent, transformBooking} = require("./global_resolvers");

module.exports = {
    bookings: async (req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated")
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
               return transformBooking(booking);
            })
        } catch (error) {
            throw error
        }
    },
    createBooking: async (args,req)=>{
        if(!req.isAuth){
            throw new Error("Unauthenticated")
        }
       const fetchedEvent = await Event.findOne({_id:args.eventId})
       const booking = new Booking({
           user:req.userId,
           event:fetchedEvent
       })
       const result = await booking.save();
       return transformBooking(result);
    },
    cancelBooking: async (args,req)=>{
        if(!req.isAuth){
            throw new Error("Unauthenticated")
        }
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event =  transformEvent(booking.event);
        await Booking.deleteOne({_id:args.bookingId});
        return event;
    }
}