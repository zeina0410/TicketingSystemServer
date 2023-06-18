const Region = require("../models/region");
const { isManager } = require('../middleware/authMiddleware');

///////////////////////////////////////////////// Get All Regions //////////////////////////////////////////
module.exports.regions_get =  async (req, res)=> {
      try{
        const regions = await Region.find({});
        res.send(regions);
      } catch(err){
        res.send(err.message);
      }
  };

///////////////////////////////////////////////// Post A Region ///////////////////////////////////////////
module.exports.regions_post = async (req, res)=> {
    if(isManager(res.locals.user._id)){
        const { name } = req.body;
        try{
          const region = await Region.create({ name });
          res.send("Successfully added new region!");
        } catch(err){
        res.send(err.message);
        }
    }
    else{
      console.log('No access!');
    }
};

///////////////////////////////////////////////// Delete All Regions ////////////////////////////////////
module.exports.regions_delete =  async (req, res)=> {
    if(isManager(res.locals.user._id)){
      try{
        await Region.deleteMany();
        res.send("Successfully deleted all regions!");
      } catch(err){
          res.send(err.message);
      }
    }
    else{
      console.log('No access!');
    }
};

///////////////////////////////////////////////// Get One Region /////////////////////////////////////////
module.exports.region_get =  async (req, res)=> {
    try{
      const region = await Region.findById(req.params.regionID);
      res.send(region);
    } catch(err) {
      res.send(err.message);
    }
};

///////////////////////////////////////////////// Update One Region  ////////////////////////////////////
module.exports.region_patch = async (req, res)=> {
    if(isManager(res.locals.user._id)){
      const { name } = req.body;
      try{
        await Region.findByIdAndUpdate(req.params.regionID, {$set: { name }});
        res.send("Successfully updated the region!");
      } catch(err){
        res.send(err.message);
      }
    } 
    else{
      console.log('No access!');
    }
};

///////////////////////////////////////////////// Delete One Region //////////////////////////////////////
module.exports.region_delete =  async (req, res)=> {
    if(isManager(res.locals.user._id)){
      try{
        await Region.findByIdAndDelete(req.params.regionID);
        res.send("Successfully deleted the region!");
      } catch(err) {
        res.send(err.message);
      }
    }
    else{
      console.log('No access!');
    }
};