const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoose');

//creating a new category
const createBrand = asyncHandler(async (req,res) => {
    try{
        const newcategory = await Brand.create(req.body);
        res.json(newcategory);
    }catch(err){
        throw new Error(err);
    }
});

//update the category
const updateBrand = asyncHandler(async (req, res)=> {
    const  {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedbrand = await Brand.findByIdAndUpdate(id,req.body,{
            new: true,
        });
        res.json(updatedbrand);
    }catch(err){ 
        throw new Error(err);
    }
})

//delete category
const deleteBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const daetebrand = await Brand.findByIdAndDelete(id);
        res.json(daetebrand)
    }catch(err){
        throw new Error(err);
    }
});

//fetch a category
const getaBrand = asyncHandler(async(req,res) => {
    const {id}= req.params;
    validateMongoDbId(id);
    try{
        const getabrand = await Brand.findById(id);
        res.json(getabrand);
    }catch(err){
        throw new Error(err);
    }
})

//Fetching all category
const getAllBrand = asyncHandler(async (req,res) => {
    try{
        const brands = await Brand.find();
        res.json(brands);
    }catch(err){
        throw new Error(err);
    }
})

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getaBrand,
    getAllBrand
}