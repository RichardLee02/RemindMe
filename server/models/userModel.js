const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        minlength: 4,
        maxlength: 12 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    phone: { 
        type: String, 
        required: true 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;