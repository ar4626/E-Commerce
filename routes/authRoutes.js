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
    updatePassword
} = require('../controller/userController');
const {
    authMiddleware,
    isAdmin
} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser)
router.put('/password',authMiddleware,updatePassword)
router.post('/login', loginUserController)
router.get('/all-users', getAllUsers)
router.get('/refresh',handleRefreshToken) 
router.get('/logout',logout)
router.get('/:id', authMiddleware, isAdmin, getaUser)
router.delete('/:id', deleteaUser)
router.put('/edit-user',authMiddleware, updateaUser) 
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser) 
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser) 



module.exports = router;
