const Ticket = require("../models/ticket");
const { isCustomer, isTechnician, isManager } = require('../middleware/authMiddleware');
const Question = require("../models/question");

///////////////////////////////////////////////// Create One Ticket (User) ////////////////////////////////
module.exports.createTicket_get = (req, res)=> {
  res.send("get ticket");
};

let ticketID = "";
module.exports.createTicket_post = async (req, res)=> {
  const { description, answers } = req.body;
  const status = "New";
  try{
    const ticket = await Ticket.create({ customer:res.locals.user, description, status, answers });
    ticketID = ticket._id;
    res.send("Ticket Sent!");
  } catch(err){
    res.send(err.message);
  }
};

module.exports.createTicket2_post = async (req, res)=> {
  try{
    const ticket = await Ticket.findById(ticketID);
    await ticket.uploadImage(req, res, () => {});
    res.send("done!");
  } catch(err){
    res.send(err.message);
  }
};

///////////////////////////////////////////////// Update One Ticket  ////////////////////////////////////
module.exports.updateTicket_patch = async (req, res)=> {
  if(isManager(res.locals.user._id)){
    const { technician, priority, status } = req.body;
    try{
      const ticket = await Ticket.findByIdAndUpdate(req.params.ticketID, {$set: { technician, priority, status }});
      res.send("Successfully updated the ticket!");
    } catch(err){
      res.send(err.message);
    }
  }
  else if (isCustomer(res.locals.user._id)){
    const { rating } = req.body;
    try{
      await Ticket.findByIdAndUpdate(req.params.ticketID, {$set: { rating }});
      res.send("Successfully rated the ticket!");
    } catch(err){
      res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};

///////////////////////////////////////////////// Get One Ticket /////////////////////////////////////////
module.exports.get_ticket =  async (req, res)=> {
  try{
    const ticket1 = await Ticket.findById(req.params.ticketID);
    const questions = await Question.find({});

    const ticket = {
      ticket1,
      entries: {}
    };
    
    questions.forEach((question, index) => {
      ticket.entries[ question.name] = ticket1.answers[index];
    });

    res.send(ticket);
  } catch(err) {
    res.send(err.message);
  }
};
module.exports.get_ticket_img =  async (req, res)=> {
  try{
    const ticket = await Ticket.findById(req.params.ticketID);
    ticket.showImage(res);
  } catch(err) {
    res.send(err.message);
  }
};

///////////////////////////////////////////////// Delete One Ticket //////////////////////////////////////
module.exports.delete_ticket =  async (req, res)=> {
  if(isCustomer(res.locals.user._id)){
    try{
      await Ticket.findByIdAndDelete(req.params.ticketID);
      res.send("Successfully deleted the ticket!");
    } catch(err) {
      res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};

///////////////////////////////////////////////// Get All Tickets ////////////////////////////////////////
module.exports.get_tickets =  async (req, res)=> {
  if(isManager(res.locals.user._id)){
    try{
      const tickets = await Ticket.find({});
      res.send(tickets);
    } catch(err){
      res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};

///////////////////////////////////////////////// Delete All Tickets ////////////////////////////////////
module.exports.delete_tickets =  async (req, res)=> {
  if(isManager(res.locals.user._id)){
    try{
      await Ticket.deleteMany();
      res.send("Successfully deleted all tickets!");
    } catch(err){
        res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};

///////////////////////////////////////////////// Get Technician's Tickets //////////////////////////////
module.exports.get_tickets_tech =  async (req, res)=> {
  if(isTechnician(res.locals.user._id)){
    try{
      const tickets = await Ticket.find({ technician:req.params.TechnicianID });
      res.send(tickets);
    } catch(err) {
      res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};

///////////////////////////////////////////////// Get Tickets of Specific Status //////////////////////////////
module.exports.get_tickets_stat =  async (req, res)=> {
  try{
    const tickets = await Ticket.find({ status:req.params.TicketStatus });
    res.send(tickets);
  } catch(err) {
    res.send(err.message);
  }
};

///////////////////////////////////////////////// Get Tickets of Specific Region //////////////////////////////
module.exports.get_tickets_region =  async (req, res)=> {
  try{
    const tickets = await Ticket.find({ region:req.params.TicketRegion });
    res.send(tickets);
  } catch(err) {
    res.send(err.message);
  }
};