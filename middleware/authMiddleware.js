const jwt = require('jsonwebtoken');
const User = require("../models/user");

///////////////////////////////////////////////// Check jwt Exists and Verified ////////////////////////////////
const requireAuth = (req, res, next)=> {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET, (err, decodedToken)=> {
            if(err){
                return false;
            } else{
                return true;
            }
        });
    } else{
        return false;
    }
}

///////////////////////////////////////////////// Check Current User //////////////////////////////////////////
const checkUser = (req, res, next)=> {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET, async (err, decodedToken)=> {
            if(err){
                res.locals.user = null;
                res.send(err.message);
                next();
            } else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else{
        res.locals.user = null;
        next();
    }
}

///////////////////////////////////////////////// Check User Type ///////////////////////////////////////////
const isCustomer = async (userID)=> {
    const user = await User.find({ _id:userID });
    if(user.role === "Customer"){
        return true;
    }
    return false;
}

const isTechnician = async (userID)=> {
    const user = await User.find({ _id:userID });
    if(user.role === "Technician"){
        return true;
    }
    return false;
}

const isManager = async (userID)=> {
    const user = await User.find({ _id:userID });
    if(user.role === "Manager"){
        return true;
    }
    return false;
}

module.exports = { requireAuth, checkUser, isCustomer, isTechnician, isManager };