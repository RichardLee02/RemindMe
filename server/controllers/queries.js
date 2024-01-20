const Event = require('../models/eventModel');

const createEvent = async (userId, title, description, status, recurrence, reminders) => {
    try {
        const event = new Event({ 
            userId, 
            title, 
            description, 
            status, 
            recurrence, 
            reminders 
        });
        const newEvent = await event.save();
        return newEvent;
    } catch (err) {
        throw err;
    }
}

const getEvents = async (userId) => {
    try {
        const events = await Event.find({ 
            userId,
        });
        return events;
    } catch (err) {
        throw err;
    }
}

const getEventsToDo = async (userId) => {
    try {
        const eventsToDo = await Event.find({
            userId,
            status: { $in: ["backlog", "active"] }
        });
        return eventsToDo;
    } catch (err) {
        throw err;
    }
}

const getEventsOverview = async (userId) => {
    try {
        const numBacklogEvents = await Event.countDocuments({ 
            userId, 
            status: 'backlog' 
        });
        const numActiveEvents = await Event.countDocuments({
            userId, 
            status: 'active' 
        });
        const numDoneEvents = await Event.countDocuments({ 
            userId, 
            status: 'done' 
        });
        const overview = { 
            numBacklogEvents, 
            numActiveEvents, 
            numDoneEvents 
        }
        return overview;
    } catch (err) {
        throw err;
    }
}

const getEventsUpcoming = async (userId) => {
    try {
        const upcomingEvents = await Event.find({ 
            userId, 
            'recurrence.endsOn': { $gt: new Date() },
            status: { $in: ["backlog", "active"] }
        }).sort({ 'recurrence.endsOn': 1 });
        return upcomingEvents;
    } catch (err) {
        throw err;
    }
}

const getEventsToday = async (userId) => {
    try {
        const todayEvents = await Event.find({
            userId,
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$recurrence.endsOn" } },
                    { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                ]
            },
            'recurrence.endsOn': { $gt: new Date() },
            status: { $in: ["backlog", "active"] }
        }).sort({ 'recurrence.endsOn': 1 });
        return todayEvents;
    } catch (err) {
        throw err;
    }
}

const getEventsOverdue = async (userId) => {
    try {
        const overdueEvents = await Event.find({ 
            userId, 
            'recurrence.endsOn': { $lt: new Date() },
            status: { $in: ["backlog", "active"] }
        }).sort({ 'recurrence.endsOn': 1 });
        return overdueEvents
    } catch (err) {
        throw err;
    }
}

const getEventsBacklog = async (userId) => {
    try {
        const backlogEvents = await Event.find({
            userId,
            status: 'backlog'
        });
        return backlogEvents;
    } catch (err) {
        throw err;
    }
}

const getEventsActive = async (userId) => {
    try {
        const activeEvents = await Event.find({
            userId,
            status: 'active'
        });
        return activeEvents;
    } catch (err) {
        throw err;
    }
}

const getEventsDone = async (userId) => {
    try {
        const doneEvents = await Event.find({
            userId,
            status: 'done'
        });
        return doneEvents;
    } catch (err) {
        throw err; 
    }
}

const getEvent = async (_id) => {
    try {
        const getEvent = await Event.findOne({ 
            _id
        });
        return getEvent;
    } catch (err) {
        throw err;
    }
}

const getSearchEvents = async (title) => {
    try {
        const getSearchEvents = await Event.find({
            title
        });
        return getSearchEvents;
    } catch (err) {
        throw err;
    }
} 

const updateEvent = async (_id, updateData) => {
    try {
        const updateEvent = await Event.updateOne({ 
            _id 
        }, updateData );
        return updateEvent;
    } catch (err) {
        throw err;
    }
}

const deleteEvent = async (_id) => {
    try {
        const deleteEvent = await Event.deleteOne({ 
            _id 
        });
        return deleteEvent;
    } catch (err) {
        throw err;
    }
}

const deleteEvents = async (userId) => {
    try {
        const deleteEvents = await Event.deleteMany({ 
            userId 
        });
        return deleteEvents;
    } catch (err) {
        throw err;
    }
}

module.exports = { 
    createEvent, 
    getEvents,
    getEventsToDo,
    getEventsOverview,
    getEventsUpcoming,
    getEventsToday,
    getEventsOverdue,
    getEventsBacklog,
    getEventsActive,
    getEventsDone,
    getEvent,
    getSearchEvents,
    updateEvent,
    deleteEvent,
    deleteEvents
}