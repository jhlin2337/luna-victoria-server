const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    description: String,
    deadline: {type: Date, required: true},
    completed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Goal', goalSchema);