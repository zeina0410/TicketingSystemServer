const express =  require('express');
const route = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

route.route("/signup")
    .get(authController.signup_get)
    .post(authController.signup_post)
;

route.route("/login")
    .get(authController.login_get)
    .post(authController.login_post)
;

route.get("/logout", authController.logout_get);

///////////////////////////////////////////////// All Users /////////////////////////////////////////////
route.route("/users")
    .get(checkUser, authController.get_users)
    .delete(checkUser, authController.delete_users)
;

///////////////////////////////////////////////// Specific User /////////////////////////////////////////
route.route("/user/:userID")
    .get(authController.get_user)
    .patch(authController.patch_user)
    .delete(checkUser, authController.delete_user)
;

module.exports = route;