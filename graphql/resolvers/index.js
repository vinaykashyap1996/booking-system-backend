const AuthResolver = require("./auth");
const EventsResolver = require("./events");
const BookingResolver = require("./booking");

const rootResolver = {
    ...AuthResolver,
    ...EventsResolver,
    ...BookingResolver
}

module.exports = rootResolver;