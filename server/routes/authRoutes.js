const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const passport = require('passport');
const { isNotAuthenticated, isAuthenticated } = require('../middlewares/checkAccess');

router.post('/signup', isNotAuthenticated, async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        var usernameLength;
        var passwordLength;
        var emailLength;
        var phoneLength;
        if (username.length < 4 || username.length > 12) {
            usernameLength = 0;
        }
        if (password.length < 8) {
            passwordLength = 0;
        }
        if (!email) {
            emailLength = 0;
        }
        const validatePhoneNumber = (phone) => {
            const pattern = /^(\d{10}|\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4})$/; 
            return pattern.test(phone);
        }
        if (!phone || !validatePhoneNumber(phone)) {
            phoneLength = 0;
        } 
        const isUsername = await User.exists({ username });
        const isEmail = await User.exists({ email });
        const isPhone = await User.exists({ phone });
        if (usernameLength === 0 || passwordLength === 0 || phoneLength === 0 || email === 0 || phone === 0 || isUsername || isEmail || isPhone) {
            return res.status(409).json({ usernameLength, passwordLength, emailLength, phoneLength, isUsername, isEmail, isPhone });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ username: username, password: hashedPassword, email: email, phone: phone });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', isNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json({ message: 'Login successful', user: req.user });
        })
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error during logout' });
        }
        req.session.destroy();
        res.clearCookie("connect.sid");
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

router.get('/user', isAuthenticated, (req, res) => {
    try {
        const userId = req.user;
        res.status(200).json(userId);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router; 