const express = require("express");
const {ToyModel,validateToy} = require('../models/toysModal');
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async(req,res) => {
  try{
    const perPage = req.query.perPage || 10;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;
    const category = req.query.category;
    const search = req.query.s;
    const user_id = req.query.user_id;
    let filterFind = {}
    if(category){
      filterFind = {category_url:category}
    }
    if(search){
      const searchExp = new RegExp(search,"i");
      filterFind = {$or:[{name:searchExp},{info:searchExp}]}
    }
    if(user_id){
      filterFind = {user_id}
    }
    const data = await ToyModel.find(filterFind)
    .limit(perPage)
    .skip(page * perPage)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/single/:id", async(req,res) => {
  try {
    const id = req.params.id;
    const toy = await ToyModel.findById(id);
    res.json(toy);
  } catch (error) {
    console.log(error);
    res.status(502).json({error});
  }
})


router.get("/count", async(req,res) => {
  try{
    const perPage = req.query.perPage || 10;
    const category = req.query.category;
    const search = req.query.s;
    const user_id = req.query.user_id;
    let filterFind = {}
    if(category){
      filterFind = {category_url:category}
    }
    if(search){
      const searchExp = new RegExp(search,"i");
      filterFind = {$or:[{name:searchExp},{info:searchExp}]}
    }
    if(user_id){
      filterFind = {user_id}
    }
    const count = await ToyModel.countDocuments(filterFind);
    res.json({count,pages:Math.ceil(count/perPage)})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



router.post("/", auth, async(req,res) => {
  const validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.json(toy);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put("/:id", auth, async(req,res) => {
  const validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const id = req.params.id;
    let data;
    if(req.tokenData.role != "user"){
      data =  await ToyModel.updateOne({_id:id},req.body)
    }
    else{
      data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body)

    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/groupIds", async(req,res) => {
  try{
    if(!Array.isArray(req.body.favs_ar)){
      return res.status(400).json({msg:"You need to send favs_ar as array"});
     }
    const data = await ToyModel.find({_id:{$in:req.body.favs_ar}}).limit(20)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.delete("/:id", auth, async(req,res) => {
  try{
    const id = req.params.id;
    let data;
    if(req.tokenData.role != "user"){
      data = await ToyModel.deleteOne({_id:id})
    }
    else{
      data = await ToyModel.deleteOne({_id:id,user_id:req.tokenData._id})
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



module.exports = router;