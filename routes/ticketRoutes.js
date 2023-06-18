const express =  require('express');
const route = express.Router();
const ticketController = require('../controllers/ticketController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

//route.get('*', requireAuth);

route.route("/ticket")
    .get(ticketController.createTicket_get)
    .post(checkUser, ticketController.createTicket_post)
;
route.post("/ticket2", ticketController.createTicket2_post);

///////////////////////////////////////////////// All Tickets /////////////////////////////////////////////
route.route("/tickets")
    .get(checkUser, ticketController.get_tickets)
    .delete(checkUser, ticketController.delete_tickets)
;

///////////////////////////////////////////////// Specific Tickets /////////////////////////////////////////
route.route("/ticket/:ticketID")
    .get(ticketController.get_ticket)
    .patch(checkUser, ticketController.updateTicket_patch)
    .delete(checkUser, ticketController.delete_ticket)
;
route.get("/ticket/:ticketID/img", ticketController.get_ticket_img);


route.get("/tickets/:TechnicianID", checkUser, ticketController.get_tickets_tech);
route.get("/tickets/:TicketStatus", checkUser, ticketController.get_tickets_stat);
route.get("/tickets/:TicketRegion", checkUser, ticketController.get_tickets_region);

module.exports = route;