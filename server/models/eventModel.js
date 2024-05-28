const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        auto: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    index: {
        type: Number,
        unique: true,
        auto: true
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    created: { 
        type: Date, 
        default: function() {
            return new Date();
        }
    },
    status: { 
        type: String, 
        enum: ['backlog', 'active', 'done'], 
        required: true 
    },
    recurrence: { 
        type: { 
            type: String, 
            enum: ['none', 'daily', 'weekly', 'bi-weekly', 'monthly'], 
            required: true 
        },
        daysOfWeek: { 
            type: [Number],
            enum: [0, 1, 2, 3, 4, 5, 6],
            required: true 
        }, 
        endsOn: { 
            type: Date, 
            required: true 
        }
    },
    reminders: { 
        email: { 
            type: Boolean, 
            required: true 
        }, 
        sms: { 
            type: Boolean, 
            required: true 
        },
        inApp: { 
            type: Boolean, 
            required: true 
        }
    }
});

eventSchema.pre('save', async function(next) {
    const condition = { status: this.status };
    this.index = await this.constructor.countDocuments(condition);
    next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
