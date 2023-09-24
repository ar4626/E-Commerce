const Category = require('../models/prodcategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoose');
const { response } = require('express');

//creating a new category
const createCategory = asyncHandler(async (req,res) => {
    try{
        const newcategory = await Category.create(req.body);
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
        const updatedcategory = await Category.findByIdAndUpdate(id,req.body,{
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
        const daetecategory = await Category.findByIdAndDelete(id);
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
        const getacategory = await Category.findById(id);
        res.json(getacategory);
    }catch(err){
        throw new Error(err);
    }
})

//Fetching all category
const getAllCategory = asyncHandler(async (req,res) => {
    try{
        const categories = await Category.find();
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