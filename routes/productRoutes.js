const  express = require('express');
const { createProduct, getaProduct, getallProduct, updateProduct } = require('../controller/productController');
const router = express.Router();

router.post('/',createProduct)
router.get('/:id',getaProduct)
router.put('/:id',updateProduct)
router.get('/',getallProduct)





module.exports = router;