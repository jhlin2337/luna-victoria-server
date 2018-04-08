const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    deadline: {type: Date, required: true}
});

module.exports = mongoose.model('User', userSchema);