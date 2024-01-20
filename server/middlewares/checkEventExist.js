const Event = require('../models/eventModel')

const checkEventExist = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const _id = req.params.eventId;
        const filterEvent = await Event.find({ _id, userId });
        if (filterEvent.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        req.eventId = _id;
        next();
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = checkEventExist;