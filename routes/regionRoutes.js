const express =  require('express');
const route = express.Router();
const regionController = require('../controllers/regionController');
const { checkUser } = require('../middleware/authMiddleware');

///////////////////////////////////////////////// All Regions /////////////////////////////////////////////
route.route("/regions")
    .get(regionController.regions_get)
    .post(checkUser, regionController.regions_post)
    .delete(checkUser, regionController.regions_delete)
;

///////////////////////////////////////////////// Specific Region /////////////////////////////////////////
route.route("/region/:regionID")
    .get(regionController.region_get)
    .patch(checkUser, regionController.region_patch)
    .delete(checkUser, regionController.region_delete)
;

module.exports = route;