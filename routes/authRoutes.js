const express = require('express');
const {
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
    applyCoupon,
    createOrder,
    getOrder,
    updateOrderStatus,
    getAllOrder
} = require('../controller/userController');
const {
    authMiddleware,
    isAdmin
} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)

router.put('/password', authMiddleware, updatePassword)
router.post('/login', loginUserController)
router.post('/admin-login', loginAdmin)
router.post('/cart', authMiddleware,userCart)
router.post('/cart/applycoupon', authMiddleware,applyCoupon)
router.post('/cart/cash-order', authMiddleware,createOrder)
router.get('/all-users', getAllUsers)
router.get('/get-orders',authMiddleware, getOrder)
router.get('/getallorders',authMiddleware, isAdmin, getAllOrder)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/wishlist', authMiddleware, getWishlist)
router.get('/cart', authMiddleware, getUserCart)


router.get('/:id', authMiddleware, isAdmin, getaUser)
router.delete('/empty-cart',authMiddleware, emptyCart)
router.delete('/:id', deleteaUser)

router.put('/edit-user', authMiddleware, updateaUser)
router.put('/save-address', authMiddleware, saveAddress)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)



module.exports = router;
