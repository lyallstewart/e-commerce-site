const express = require('express');
const orderRouter = express.Router();
const database = require('../database/db');

// Routes requiring sessions are currently broken until Passport is fixed

// Handle GET requests to /orders/all
// If user is not an admin, only return orders for the user 
orderRouter.get('/all', async (req, res) => {
    try {
        const orders = await database.Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle GET requests to /orders/:orderId
// If user is not admin, only return the order if it belongs to them, else return an error
orderRouter.get('/:orderId', async (req, res) => {
    try {
        const targetUser = await database.User.findOne({userId: session.user.userId})
        if(req.session.admin) {
            const order = await database.Order.findOne({orderId: req.params.orderId});
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } else {
            const order = await database.Order.findOne({orderId: req.params.orderId, user: targetUser})
            if (!order) {
                return res.status(404).json({ message: 'Order not found, either it doesn\'t exist, or you don\'t have access to it' });
            }
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle POST requests to /orders/new
orderRouter.post('/new', async (req, res) => {
    console.log(req.body)
    const newOrder = new database.Order({
        user: req.body.user,
        items: req.body.items,
        price: req.body.price,
        imageCode: req.body.imageCode
    });
    try {
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json(err.message);
    }
    console.log("Order created successfully");   
});

// Handle PUT requests to /orders/:orderId
orderRouter.put('/:orderId', async (req, res) => {
    const order = await database.Order.findOne({orderId: req.params.orderId});
    if(!order) {
        res.status(404).json({error: 'Order does not exist'});
    } else {
        try {
            await database.Order.findOneAndUpdate({orderId: req.params.orderId}, {new: true}, {
                user: req.body.user,
                items: req.body.items,
                price: req.body.price,
                imageCode: req.body.imageCode
            });
            res.status(200).json(order);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("Order updated successfully");
});

// Handle DELETE request to /orders/:orderId
orderRouter.delete('/:orderId', async (req, res) => {
    const order = await database.Order.findOne({orderId: req.params.orderId});
    if(!order) {
        res.status(404).json({error: 'Order does not exist'});
    } else {
        try {
            const order = await database.Order.findOneAndDelete({orderId: req.params.orderId});
            res.status(200);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("Order deleted successfully");
});


module.exports = orderRouter