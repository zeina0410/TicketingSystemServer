const Question = require("../models/question");
const { isManager } = require('../middleware/authMiddleware');

///////////////////////////////////////////////// Get All Questions //////////////////////////////////////////
module.exports.questions_get =  async (req, res)=> {
      try{
        const questions = await Question.find({});
        res.send(questions);
      } catch(err){
        res.send(err.message);
      }
  };

///////////////////////////////////////////////// Post A Question ///////////////////////////////////////////
module.exports.questions_post = async (req, res)=> {
    if(isManager(res.locals.user._id)){
        const { name, answers } = req.body;
        try{
          const question = await Question.create({ name, answers });
          res.send("Successfully added new question!");
        } catch(err){
        res.send(err.message);
        }
    }
    else{
      console.log('No access!');
    }
};

///////////////////////////////////////////////// Delete All Questions ////////////////////////////////////
module.exports.questions_delete =  async (req, res)=> {
    if(isManager(res.locals.user._id)){
      try{
        await Question.deleteMany();
        res.send("Successfully deleted all questions!");
      } catch(err){
          res.send(err.message);
      }
    }
    else{
      console.log('No access!');
    }
};

///////////////////////////////////////////////// Get One Question /////////////////////////////////////////
module.exports.question_get =  async (req, res)=> {
    try{
      const question = await Question.findById(req.params.questionID);
      res.send(question);
    } catch(err) {
      res.send(err.message);
    }
};

///////////////////////////////////////////////// Update One Question  ////////////////////////////////////
module.exports.question_patch = async (req, res)=> {
    if(isManager(res.locals.user._id)){
      const { name, answers } = req.body;
      try{
        await Question.findByIdAndUpdate(req.params.questionID, {$set: { name, answers } });
        res.send("Successfully updated the question!");
      } catch(err){
        res.send(err.message);
      }
    } 
    else{
      console.log('No access!');
    }
};

///////////////////////////////////////////////// Delete One Question //////////////////////////////////////
module.exports.question_delete =  async (req, res)=> {
    if(isManager(res.locals.user._id)){
      try{
        await Question.findByIdAndDelete(req.params.questionID);
        res.send("Successfully deleted the question!");
      } catch(err) {
        res.send(err.message);
      }
    }
    else{
      console.log('No access!');
    }
};