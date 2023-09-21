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
    const { id } = req.params;
    console.log(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        // console.log(req.body)
        const updateproduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        });
        // console.log(updateproduct)
        res.json(updateproduct);

    } catch (err) {
        throw new Error(err);
    }
})

//For deleting a product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const deleteproduct = await Product.findByIdAndDelete(id);
        res.json(deleteproduct);

    } catch (err) {
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
    // console.log(req.query)

    try {

        //fitering 
        const queryObj = { ...req.query };                                    //this is the modified query 
        const excludeFields = ["page", "sort", "limit", "fields"];            //which exclude the following fields
        excludeFields.forEach((element) => delete queryObj[element]);         //from the original req.query
        // console.log(queryObj,req.query);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);               //performing the filter operation 
        // console.log(JSON.parse(queryStr));

        
        //sorting
        
        let query = Product.find(JSON.parse(queryStr));
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort('createdAt');
        }

        //limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        //pagination

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Set a default limit if not provided
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
        if (req.query.page){
            const priductCount = await Product.countDocuments();
            if(skip > priductCount){
                throw new Error("This page doesnot exist")
            }
        }
        console.log.apply(page,limit,skip);;


        const products = await query;
        if (products.length === 0) {                              // Check if products are empty and log the result
            console.log("No products found for the given query.");
        }
        res.json(products);

    } catch (err) {
        throw new Error(err);
    }
})


module.exports = {
    createProduct,
    getaProduct,
    getallProduct,
    updateProduct,
    deleteProduct
}