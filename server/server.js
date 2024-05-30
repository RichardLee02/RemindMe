require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const Event = require('./models/eventModel');
const User = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const passport = require('passport');
const initializePassport = require('./utils/passportConfiguration');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});
const store = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION,
    collection: 'sessions'
});
initializePassport(passport);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Index page'
    });
});

const port = process.env.PORT || 8080;
mongoose.connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    server.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}).catch((error) => {
    console.log(error);
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});
io.on('connect', async socket => {
    if (socket.request.session.passport && socket.request.session.passport.user) {
        const userId = socket.request.session.passport.user;
        socket.join(`user:${userId}`);
        const upcomingEvents = await Event.find({
            userId: userId,
            $or: [
                { status: 'backlog' },
                { status: 'active' }
            ],
            'recurrence.endsOn': {
                $gte: new Date(),
                $lt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            },
            'reminders.inApp': true
        }).sort({ 'recurrence.endsOn': -1 });
        io.to(`user:${userId}`).emit('In-App', {
            message: upcomingEvents
        });
    }
});

const collection = new Set();
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
const sendEmail = async (mailOptions) => {
    return transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
}
const sendNotifications = async () => {
    const users = {};
    io.of('/').sockets.forEach(socket => {
        if (socket.request.session.passport && socket.request.session.passport.user) {
            const userId = socket.request.session.passport.user;
            const socketId = socket.id;
            users[userId] = socketId;
        }
    });

    for (const userId in users) {
        const socketId = users[userId];
        const upcomingEvents = await Event.find({
            userId: userId,
            $or: [
                { status: 'backlog' },
                { status: 'active' }
            ],
            'recurrence.endsOn': {
                $gte: new Date(),
                $lt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            },
            'reminders.inApp': true
        }).sort('recurrence.endsOn');
        const userInfo = await User.findOne({
            _id: userId
        });
        const userEmail = userInfo.email;

        const mailQueue = [];
        for (const event of upcomingEvents) {
            const eventId = event._id.toHexString();
            if (event.reminders.email && !collection.has(eventId)) {
                let mailOptions = {
                    from: 'remindmenotifies@outlook.com',
                    to: userEmail,
                    subject: `Just a kind reminder that ${event.title} is due shortly. Please make sure you're prepared!`,
                    text: `Title: ${event.title}\nDescription: ${event.description}\nDue: ${event.recurrence.endsOn}`,
                };
                mailQueue.push(mailOptions);
                collection.add(eventId);
            }
        }
        while (mailQueue.length > 0) {
            const batch = mailQueue.splice(0, 1);
            await Promise.all(batch.map(mailOptions => sendEmail(mailOptions)));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        io.to(socketId).emit('In-App', { message: upcomingEvents });
    }
};

const intervalId = setInterval(sendNotifications, 60000);
io.on('disconnect', () => {
    clearInterval(intervalId);
});