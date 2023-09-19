const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

//create a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
        console.log(newUser);
    }
    else {
        //user already exists
        throw new Error("User already exists")
    }
})

//login a user
const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if the user exists or not 
    const findUser = await User.findOne({ email: email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser._id),

        });
    } else {
        throw new Error("Invalid Credentials");
    }
})

//update a user
const updateaUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    console.log(req.user)
    try {
        const updateauser = await User.findByIdAndUpdate(id, {
            firstname: req?.body.firstname,
            lastname: req?.body.lastname,
            email: req?.body.email,
            mobile: req?.body.mobile
        }, {
            new: true,
        }
        );
        res.json(updateauser);
    } catch (err) {
        throw new Error(err);
    }
})

//fetching all user 
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    }
    catch (error) {
        throw new Error(error);
    }
})

//geting a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const getauser = await User.findById(id);
        res.json({ getauser });

    } catch (err) {
        throw new Error(err);
    }
})

//deleting a user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const deleteauser = await User.findByIdAndDelete(id);
        res.json({
            deleteauser
        });

    } catch (err) {
        throw new Error(err);
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {
            new: true
        })
        res.json({
            message: "User Blocked"
        })
    } catch (err) {
        throw new Error(err);
    }

})
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {
            new: true
        })
        res.json({
            message: "User Unblocked"
        })
    } catch (err) {
        throw new Error(err);
    }
})


module.exports = {
    createUser,
    loginUserController,
    getAllUsers,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser
}