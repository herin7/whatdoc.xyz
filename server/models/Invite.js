const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'used'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Invite', inviteSchema);
