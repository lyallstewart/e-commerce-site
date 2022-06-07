const express = require('express');
const productRouter = express.Router();
const database = require('../index');

// Handle GET requests to /products/all
productRouter.get('/all', async (req, res) => {
    try {
        const users = await database.User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle GET requests to /products/:productId
productRouter.get('/:productId', async (req, res) => {
    try {
        const product = await database.Product.findOne({productId: req.params.productId});
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Handle POST requests to /products/new
productRouter.post('/new', async (req, res) => {
    const product = await database.Product.findOne({name:req.body.name});
    if(!product) {
        const newProduct = new database.Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            image: req.body.image,
        });
        try {
            await newProduct.save();
            res.status(201);
        } catch (err) {
            res.status(500).json(err.message);
        }
    } else {
        res.status(400).json({error: 'Product already exists'});
    }
    console.log("Product created successfully");
});

// Handle PUT requests to /products/:productId
productRouter.put('/:productId', async (req, res) => {
    const product = await database.Product.findOne({productId: req.params.productId});
    if(!product) {
        res.status(404).json({error: 'Product does not exist'});
    } else {
        try {
            await database.Product.findOneAndUpdate({productId: req.params.productId}, {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                category: req.body.category,
                image: req.body.image,
            });
            res.status(200);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("Product updated successfully");
});

// Handle DELETE request to /products/:productId
productRouter.delete('/:productId', async (req, res) => {
    const product = await database.Product.findOne({productId: req.params.productId});
    if(!product) {
        res.status(404).json({error: 'Product does not exist'});
    } else {
        try {
            const product = await database.Product.findOneAndDelete({productId: req.params.productId});
            res.status(200);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("Product deleted successfully");
});


module.exports = productRouter