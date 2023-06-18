const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    name: {
        type : String,
        required : [true,'Question not added']
    },
    answers: {
        type : [String],
        required : [true,'Answers not added']
    }
});

module.exports = mongoose.model("Questions", questionSchema); 