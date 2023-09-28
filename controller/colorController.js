const Color = require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoose');

//creating a new color
const createColor = asyncHandler(async (req,res) => {
    try{
        const newcolor = await Color.create(req.body);
        res.json(newcolor);
    }catch(err){
        throw new Error(err);
    }
});

//update the color
const updateColor = asyncHandler(async (req, res)=> {
    const  {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedcolor = await Color.findByIdAndUpdate(id,req.body,{
            new: true,
        });
        res.json(updatedcolor);
    }catch(err){ 
        throw new Error(err);
    }
})

//delete color
const deleteColor = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletecolor = await Color.findByIdAndDelete(id);
        res.json(deletecolor)
    }catch(err){
        throw new Error(err);
    }
});

//fetch a color
const getaColor = asyncHandler(async(req,res) => {
    const {id}= req.params;
    validateMongoDbId(id);
    try{
        const getacolor = await Color.findById(id);
        res.json(getacolor);
    }catch(err){
        throw new Error(err);
    }
})

//Fetching all color
const getAllColor = asyncHandler(async (req,res) => {
    try{
        const colors = await Color.find();
        res.json(colors);
    }catch(err){
        throw new Error(err);
    }
})

module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getaColor,
    getAllColor
}