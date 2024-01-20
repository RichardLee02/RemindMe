const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
}

const isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    next();
}

module.exports = { isAuthenticated, isNotAuthenticated };  