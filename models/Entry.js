const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DiaryEntry = new Schema({
    title:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('entries', DiaryEntry);