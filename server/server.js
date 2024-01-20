require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const port = process.env.PORT || 8080;
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION,
    collection: 'sessions'
});
const initializePassport = require('./utils/passportConfiguration');
initializePassport(passport);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false,
        httpOnly: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Index page'
    });
});

mongoose.connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`App started on port ${port}`);
    });
}).catch((error) => {
    console.log(error);
});