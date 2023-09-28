const Enquiry = require('../models/enqModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoose');

//creating a new Enquiry
const createEnquiry = asyncHandler(async (req,res) => {
    try{
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    }catch(err){
        throw new Error(err);
    }
});

//update the Enquiry
const updateEnquiry = asyncHandler(async (req, res)=> {
    const  {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id,req.body,{
            new: true,
        });
        res.json(updatedEnquiry);
    }catch(err){ 
        throw new Error(err);
    }
})

//delete Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json(deleteEnquiry)
    }catch(err){
        throw new Error(err);
    }
});

//fetch a Enquiry
const getaEnquiry = asyncHandler(async(req,res) => {
    const {id}= req.params;
    validateMongoDbId(id);
    try{
        const getaEnquiry = await Enquiry.findById(id);
        res.json(getaEnquiry);
    }catch(err){
        throw new Error(err);
    }
})

//Fetching all Enquiry
const getAllEnquiry = asyncHandler(async (req,res) => {
    try{
        const Enquirys = await Enquiry.find();
        res.json(Enquirys);
    }catch(err){
        throw new Error(err);
    }
})

module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getaEnquiry,
    getAllEnquiry
}