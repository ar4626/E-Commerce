const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoose');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken')

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
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken
            }, {
            new: true,
            }
        );
        res.cookie("refreshToken",refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),

        });
    } else {
        throw new Error("Invalid Credentials");
    }
})


//handle refresh token request
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie.refreshToken){
        throw new Error("No refresh token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken})
    if(!user){
        throw new Error("No refresh token present in Database or not matched");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET,(err,decoded) => {
        // console.log(decoded);
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with refresh token")
        }
        const accessToken = generateToken(user?._id)
        res.json({accessToken})

    })
    // res.json(user);
})


//logout functionallity
const logout = asyncHandler(async(req,res) => {

    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("No refresh token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie("refreshToken" , {
            httpOnly:true,
            secure:true
        })
        return res.sendStatus(204);   //forbidden
    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken: " ",
    })
    res.clearCookie("refreshToken" , {
        httpOnly:true,
        secure:true
    })
    return res.sendStatus(204);
})

//update a user
const updateaUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    // console.log(req.user)
    validateMongoDbId(_id)
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
    validateMongoDbId(id)
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
    validateMongoDbId(id)
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
    validateMongoDbId(id)
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
    validateMongoDbId(id)
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
    unblockUser,
    handleRefreshToken,
    logout,
}