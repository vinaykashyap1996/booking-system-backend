const Event = require("../../models/events");
const Users = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const DataLoader = require("dataloader");

const EventDataLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const UserDataLoader = new DataLoader((userIds) => {
  return Users.find({ _id: { $in: userIds } });
});

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const user = (userId) => {
  return UserDataLoader.load(userId.toString())
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: EventDataLoader.loadMany(user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

const events = (eventsId) => {
  return Event.find({ _id: { $in: eventsId } })
    .then((events) => {
      return events.map((event) => {
        return transformEvent(event);
      });
    })
    .catch((err) => {
      throw err;
    });
};

const singleEvent = async (eventId) => {
  try {
    const event = await EventDataLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};
const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
