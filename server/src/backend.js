/**
 * This file is far too long and really needs to be broken up. It's also not very readable
 * TODO: Break this up (probably after rest off app is done)
 */

// Required imports
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path')
const setupDatabase = require('./database/db');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

/***
 * Setup Express
 */
const app = express();
module.exports = app;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


/***
 * Setup the session management and storage
 */
const store = new MongoDBStore(
    {
      uri: process.env.MONGODB_URI,
      databaseName: 'ecommerce',
      collection: 'sessions'
    });

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 *60 * 24, secure: true, sameSite: "none" },
      resave: false,
      saveUninitialized: false,
      store
    })
  );

// Connect to the Mongo DB
const database = setupDatabase();


/***
 * Express middleware and helper functions
 */

// Access control middleware for non-public routes
const isAuthorised = (req, res, next) => {
    if (req.session.authenticated) {
        res.next();
    } else {
        res.status(403).send('You are not authorised to access this route');
    }
}

// Access control middleware for admin-only routes
const isAdmin = (req, res, next) => {
    if (req.session.authenticated && req.session.admin) {
        res.next();
    } else {
        res.status(403).send('You are not authorised to access this route');
    }
}

/**
 * Setup routes (user routes)
 */

// Handle GET requests to /users (will need to be secured)
app.get('/users', async (req, res) => {
    try {
        const users = await database.User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle GET requests to /users/:username
app.get('/users/:username', async (req, res) => {
    try {
        const user = await database.User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
        res.json(user);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle DELETE requests to /users/:username (will be secured)
app.delete('/users/:username', async (req, res) => {
    const user = await database.User.findOne({username:req.params.username})
    if(!user) {
        res.status(404).json({error: 'User does not exist'});
    } else {
        try {
            const user = await database.User.findOneAndDelete({username: req.params.username});
            res.status(200);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("User deleted successfully");
});

// Handle PUT requests to /users (will be secured)
app.put('/users/:username', async (req, res) => {
    const user = await database.User.findOne({username:req.params.username})
    if(!user) {
        res.status(404).json({error: 'User does not exist'});
    } else {
        try {
            const salt = crypto.randomBytes(128).toString('base64');
            const iterations = 10000;
            const hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, 64, 'sha512').toString('base64');
            await database.User.findOneAndUpdate({username: req.params.username}, {
                username: req.body.username,
                password: {
                    hash,
                    salt,
                    iterations
                },
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            });
            res.status(200);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("User updated successfully");
});

// Handle POST request to /login
app.post('/login', async (req, res) => {
    const user = await database.User.findOne({username: req.body.username});
    if (!user) {
        res.status(404).json({error: 'User does not exist'});
    } else {
        const hash = crypto.pbkdf2Sync(req.body.password, user.password.salt, user.password.iterations, 64, 'sha512').toString('base64');
        if (hash === user.password.hash) {
            req.session.authenticated = true;
            req.session.user = user;
            if (user.admin && req.body.admin) req.session.admin = true;
            res.status(200).json({message: 'Login successful'});
        } else {
            res.status(401).json({error: 'Incorrect password'});
        }
    }
    console.log("Login successful");
});

// Handle POST requests to /signup
app.post('/signup', async (req, res) => {
    user = await database.User.findOne({username:req.body.username})
    if (!user) {
        const salt = crypto.randomBytes(128).toString('base64');
        const iterations = 10000;
        const hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, 64, 'sha512').toString('base64');

        const newUser = new database.User({
            username: req.body.username,
            password: {
                hash,
                salt,
                iterations
            },
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            admin: false,
        });
        try {
            await newUser.save();
            res.status(201);
        } catch (err) {
            res.status(500).json(err.message);
        }
    } else {
        res.status(400).json({error: 'User already exists'});
    }
    console.log("User created successfully");
});

/**
 * Setup routes (product endpoints)
 */

// Handle GET requests to /products
app.get('/products', async (req, res) => {
    try {
        const users = await database.User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle GET requests to /products/:productId
app.get('/products/:productId', async (req, res) => {
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


// Handle POST requests to /products
app.post('/products', async (req, res) => {
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
app.put('/products/:productId', async (req, res) => {
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
app.delete('/products/:productId', async (req, res) => {
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

/**
 * Setup routes (order endpoints)
 */

// Handle GET requests to /orders
// If user is not an admin, only return orders for the user 
app.get('/orders', async (req, res) => {
    try {
        const orders = await database.Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle GET requests to /orders/:orderId
// If user is not admin, only return the order if it belongs to them
app.get('/orders/:orderId', async (req, res) => {
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

// Handle POST requests to /orders
app.post('/orders', async (req, res) => {
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
app.put('/orders/:orderId', async (req, res) => {
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
app.delete('/orders/:orderId', async (req, res) => {
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

// Runs if all other handling fails
app.use((req, res, next) => {
    res.status(404).send("Oh no, that URL is not valid!")
})

// Start express server
app.listen(process.env.port, () => console.log(`App listening on port ${process.env.port}!`))