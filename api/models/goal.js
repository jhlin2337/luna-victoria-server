const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    deadline: {type: Date, required: true}
});

module.exports = mongoose.model('Goal', goalSchema);