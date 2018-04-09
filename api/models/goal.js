const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    deadline: {type: Date, required: true}
});

module.exports = mongoose.model('Goal', goalSchema);