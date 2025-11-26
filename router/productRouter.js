const express = require('express')
const { productListController, productDetailController, newProductController, deleteProductController } = require('../controllers/productController')
const router = express.Router()

router.get('/list',productListController)
router.get('/detail/:id', productDetailController)
router.post('/create', newProductController)
router.delete('/delete',deleteProductController)
module.exports = router