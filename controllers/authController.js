const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Region = require("../models/region");
const { isCustomer, isTechnician, isManager } = require('../middleware/authMiddleware');

///////////////////////////////////////////////// Create Token ////////////////////////////////////////////
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=> {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn:maxAge });
}

///////////////////////////////////////////////// Signup Add Customer /////////////////////////////////////
module.exports.signup_get = (req, res)=> {
    res.send('get signup');
};

module.exports.signup_post = async (req, res)=> {
    const { phone, password, name, street, building, floor, flat } = req.body;
    try{
        const role ="Customer";
        const region_id = await Region.findOne({name:req.body.region}).select("_id");
        const user = await User.create({phone, password, name, role, street, building, floor, flat, region:region_id});
        //////////////////////////// Cookie and Token /////////////////////////////
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly:false, maxAge:1000 * maxAge });
        const roles = role;
        res.json({token, roles});
    } catch(err){
        res.send(err.message);
    }
};

///////////////////////////////////////////////// Login ////////////////////////////////////////////////////
module.exports.login_get = (req, res)=> {
    res.send('get login');
};

module.exports.login_post = async (req, res)=> {
    const { phone, password } = req.body;
    try{
        const user = await User.logIn(phone, password);
        //////////////////////////// Cookie and Token /////////////////////////////
        const token = createToken(user._id);
        const roles = user.role;
        res.cookie('jwt', token, { httpOnly:false, maxAge:1000 * maxAge });
        res.json({token, roles});
    } catch(err){
        res.send(err.message);
    }
};

///////////////////////////////////////////////// Logout ///////////////////////////////////////////////////
module.exports.logout_get = (req, res)=> {
  try{
    res.cookie('jwt', '', { maxAge:1 });
    res.send('Logged Out');
  } catch(err){
    res.send(err.message);
  }
};

///////////////////////////////////////////////// Get All Users ////////////////////////////////////////
module.exports.get_users =  async (req, res)=> {
  if(isManager(res.locals.user._id)){
    try{
      const users = await User.find({});
      res.send(users);
    } catch(err){
      res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};

///////////////////////////////////////////////// Delete All Users /////////////////////////////////////
module.exports.delete_users =  async (req, res)=> {
  if(isManager(res.locals.user._id)){
    try{
      await User.deleteMany();
      res.send("Successfully deleted all users!");
    } catch(err){
        res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};

///////////////////////////////////////////////// Get One User //////////////////////////////////////////
module.exports.get_user =  async (req, res)=> {
  try{
    const user = await User.findById(req.params.userID);
    res.send(user);
  } catch(err) {
    res.send(err.message);
  }
};

///////////////////////////////////////////////// Update One User //////////////////////////////////////
module.exports.patch_user =  async (req, res)=> {
  try{
    await User.findByIdAndUpdate(req.params.userID, {$set: req.body});
    res.send("Successfully updated the user!");
  } catch(err) {
      res.send(err.message);
  }
};

///////////////////////////////////////////////// Delete One User //////////////////////////////////////
module.exports.delete_user =  async (req, res)=> {
  if(isManager(res.locals.user._id)){
    try{
      await User.findByIdAndDelete(req.params.userID);
      res.send("Successfully deleted the user!");
    } catch(err) {
        res.send(err.message);
    }
  }
  else{
    console.log('No access!');
  }
};