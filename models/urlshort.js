const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true
    },
    clickCount: {
        type: Number,
        default: 0
    }
});

const UrlModel = mongoose.model('urlShort', urlSchema);

module.exports = { UrlModel };