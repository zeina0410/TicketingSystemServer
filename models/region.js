const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,'Region'],
        unique: true
    }
});

module.exports = mongoose.model("Region", regionSchema);