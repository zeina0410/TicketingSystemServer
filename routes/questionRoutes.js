const express =  require('express');
const route = express.Router();
const questionController = require('../controllers/questionController');
const { checkUser } = require('../middleware/authMiddleware');

///////////////////////////////////////////////// All Questions /////////////////////////////////////////////
route.route("/questions")
    .get(questionController.questions_get)
    .post(checkUser, questionController.questions_post)
    .delete(checkUser, questionController.questions_delete)
;

///////////////////////////////////////////////// Specific Question /////////////////////////////////////////
route.route("/question/:questionID")
    .get(questionController.question_get)
    .patch(checkUser, questionController.question_patch)
    .delete(checkUser, questionController.question_delete)
;

module.exports = route;