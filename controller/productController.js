const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');



//For creating a new product 
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    } catch (err) {
        throw new Error(err);
    }
})


//For updating a product
const updateProduct = asyncHandler(async (req, res) => {
    const {id}= req.params;
    console.log(id);
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        } 
        // console.log(req.body)
        const updateproduct = await Product.findByIdAndUpdate(id,req.body,{
            new:true
        });
        console.log(updateproduct)
        res.json(updateproduct);

    }catch(err){
        throw new Error(err);
    }
})



//For getting a single product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct);
    } catch (err) {
        throw new Error(err);
    }
})


//for getting all the products present 
const getallProduct = asyncHandler(async (req, res) => {
    try {
        const getallproducts = await Product.find();
        res.json(getallproducts);

    } catch (err) {
        throw new Error(err);
    }
})


module.exports = {
    createProduct,
    getaProduct,
    getallProduct,
    updateProduct
}