const { generateToken } = require('../config/jwtToken');

const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')

const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoose');
const { generateRefreshToken } = require('../config/refreshtoken');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./emailController');
const { validate } = require('../models/orderModel');

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
        res.cookie("refreshToken", refreshToken, {
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

//admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if the user exists or not 
    const findAdmin = await User.findOne({ email: email });
    if (findAdmin.role !== 'admin') {
        throw new Error("User Not Authorized");
    }
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken
            }, {
            new: true,
        }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),

        });
    } else {
        throw new Error("Invalid Credentials");
    }
})

//handle refresh token request
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if (!cookie.refreshToken) {
        throw new Error("No refresh token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken })
    if (!user) {
        throw new Error("No refresh token present in Database or not matched");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        // console.log(decoded);
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const accessToken = generateToken(user?._id)
        res.json({ accessToken })

    })
    // res.json(user);
})


//logout functionallity
const logout = asyncHandler(async (req, res) => {

    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No refresh token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204);   //forbidden
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: " ",
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    return res.sendStatus(204);
})

//update a user
const updateaUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    // console.log(req.user)
    validateMongoDbId(id)
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

//save user Address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)

    try {
        const updateauser = await User.findByIdAndUpdate(_id, {
            address: req?.body.address,
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

//blocking a user
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

//unblocking a user
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

//update password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const password = req.body.password;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {

        // console.log(typeof(password),typeof(user.password));
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    }
    else {
        res.json(user);
    }
});


const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found with this Email");
    }
    else {
        try {
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetURL = `Hi, Please follow this LINK to reset your password. This link is valid for 10 Minutes form now. <a href='http://localhost:4000/api/user/reset-password/${token}'>Click Me</a>`;
            const data = {
                to: email,
                subject: "Forgot Password Link",
                htm: resetURL
            };
            sendEmail(data);
            res.json(token);
        } catch (err) {
            throw new Error(err)
        }
    }
});


const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(token, hashedToken);
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
        throw new Error("Token Expired, Please try again later.");
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user)

});

//getting the wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { id } = req.user;
    try {
        const findUser = await User.findById(id).populate('wishlist');
        res.json(findUser);
    } catch (err) {
        throw new Error(err);
    }
});

//user cart functionality 
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        let products = [];
        const user = await User.findById(_id);
        //check if the user has already have product cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object);
        }
        // console.log(products)
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }
        console.log(products, cartTotal);
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);
    } catch (err) {
        throw new Error(err);
    }
});

//get user cart details
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product")
        res.json(cart);
    } catch (err) {
        throw new Error(err);
    }
});

//empty cart functionality
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);
    } catch (err) {
        throw new Error(err);
    }
})

//apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const validCoupon = await Coupon.findOne({ name: coupon });
        // console.log(validCoupon)
        if (validCoupon === null) {
            throw new Error("Invalid coupon");
        }
        const user = await User.findOne({ _id });
        let { products, cartTotal } = await Cart.findOne({ orderby: user._id }).populate(("products.product"))
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
        await Cart.findOneAndUpdate(
            { orderby: user._id },
            { totalAfterDiscount },
            { new: true }
        );
        res.json(totalAfterDiscount)
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
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon
}