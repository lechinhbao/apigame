const express = require('express');
const router = express.Router();
const productController = require('../../compunents/product/Controller');
const categoryController = require('../../compunents/category/Controller');
// http://localhost:3000/cpanel/product/

// http://localhost:3000/cpanel/product/
// hiển thị danh sách người chơi
router.get('/', async (req, res, next) => {
    try {
        const products = await productController.getAllProducts();
        return res.render('product/list', { products });
    } catch (error) {
        next(error);
    }
});


// http://localhost:3000/cpanel/product/1/edit
router.get('/:id/edit', async (req, res, next) => {
    try {
        let { id } = req.params;
        const product = await productController.getProductById(id);
        const categories = await categoryController.getAllCategories();
        console.log('produc error', product);
        console.log('category error', categories);
        return res.render('product/update', { product, categories });

    } catch (error) {
        next(error);
    }
});

router.post('/:id/edit', async (req, res, next) => {
    try {
        let { id } = req.params;
        let { body } = req;
        const { name, man, diem, coin } = body;
        const result = await productController.addProduct(name, man, diem, coin)
        if (result) {
            return res.redirect('/cpanel/product/');
        }
    } catch (error) {
        next(error);
    }
});




module.exports = router;