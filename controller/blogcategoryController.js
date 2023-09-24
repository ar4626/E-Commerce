const PCategory = require('../models/blogcategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoose');

//creating a new category
const createCategory = asyncHandler(async (req,res) => {
    try{
        const newcategory = await PCategory.create(req.body);
        res.json(newcategory);
    }catch(err){
        throw new Error(err);
    }
});

//update the category
const updateCategory = asyncHandler(async (req, res)=> {
    const  {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedcategory = await PCategory.findByIdAndUpdate(id,req.body,{
            new: true,
        });
        res.json(updatedcategory);
    }catch(err){ 
        throw new Error(err);
    }
})

//delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const daetecategory = await PCategory.findByIdAndDelete(id);
        res.json(daetecategory)
    }catch(err){
        throw new Error(err);
    }
});

//fetch a category
const getaCategory = asyncHandler(async(req,res) => {
    const {id}= req.params;
    validateMongoDbId(id);
    try{
        const getacategory = await PCategory.findById(id);
        res.json(getacategory);
    }catch(err){
        throw new Error(err);
    }
})

//Fetching all category
const getAllCategory = asyncHandler(async (req,res) => {
    try{
        const categories = await PCategory.find();
        res.json(categories);
    }catch(err){
        throw new Error(err);
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getaCategory,
    getAllCategory
}