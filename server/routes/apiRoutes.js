const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/checkAccess');
const checkEventExist = require('../middlewares/checkEventExist');
const queries = require('../controllers/queries');

router.post('/events', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, description, status, recurrence, reminders } = req.body;
        const createEvent = await queries.createEvent(userId, title, description, status, recurrence, reminders);
        res.status(201).json(createEvent);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/events', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEvents = await queries.getEvents(userId);
        res.status(200).json(getEvents);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/todo', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsToDo = await queries.getEventsToDo(userId);
        res.status(200).json(getEventsToDo);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/overview', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsOverview = await queries.getEventsOverview(userId);
        res.status(200).json(getEventsOverview);
    } catch (err) {
        res.status(500).json(err);
    }     
});

router.get('/events/upcoming', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsUpcoming = await queries.getEventsUpcoming(userId);
        res.status(200).json(getEventsUpcoming);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/today', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsToday = await queries.getEventsToday(userId);
        res.status(200).json(getEventsToday);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/overdue', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsOverdue = await queries.getEventsOverdue(userId);
        res.status(200).json(getEventsOverdue);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/backlog', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsBacklog = await queries.getEventsBacklog(userId);
        res.status(200).json(getEventsBacklog);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/active', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsActive = await queries.getEventsActive(userId);
        res.status(200).json(getEventsActive);
    } catch (err) {
        res.status(500).json(err);
    }
});
         
router.get('/events/done', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const getEventsDone = await queries.getEventsDone(userId);
        res.status(200).json(getEventsDone);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/:eventId', isAuthenticated, checkEventExist, async (req, res) => {
    try {
        const _id = req.eventId;
        const getEvent = await queries.getEvent(_id);
        res.status(200).json(getEvent);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/events/search/:title', isAuthenticated, async (req, res) => {
    try {
        const { title } = req.params;
        const getSearchEvents = await queries.getSearchEvents(title);
        res.status(200).json(getSearchEvents);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/events/:eventId', isAuthenticated, checkEventExist, async (req, res) => {
    try {
        const _id = req.eventId;
        const updateData = req.body;
        const updateEvent = await queries.updateEvent(_id, updateData);
        res.status(200).json(updateEvent);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/events/:eventId', isAuthenticated, checkEventExist, async (req, res) => {
    try {
        const _id = req.eventId;
        const deleteEvent = await queries.deleteEvent(_id);
        res.status(200).json(deleteEvent);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/events', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const deleteEvents = await queries.deleteEvent(userId);
        res.status(200).json(deleteEvents);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;