const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const initializePassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'User not found'});
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }   
    });
};

module.exports = initializePassport;