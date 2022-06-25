const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })



const setupDatabase = () => {
    mongoose.connect(
        process.env.MONGODB_URI, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
    const Schema = mongoose.Schema;
    const userSchema = new Schema({
        username: {type: String, required: true},
        password: {
            hash: {type: String, required: true},
            salt: {type: String, required: true},
        },
        email: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        cart: {type: Object, required: false},
        admin: {type: Boolean, required: true},
        createdAt: {
            type: Date,
            required: true,
            default: () => new Date(),
            immutable: true
        },
    });
    const productSchema = new Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true},
        category: {type: String, required: true},
        createdAt: {
            type: Date,
            required: true,
            default: () => new Date(),
            immutable: true
        },
        imageCode: {type: String, required: true},
    });
    const orderSchema = new Schema({
        user: {type: String, required: true},
        items: {
            type: Array,
            required: true
        },
        orderTime: {
            type: Date,
            required: true,
            immutable: true,
            default: () => new Date()
        },
        price: {type: Number, required: true},
    });

    const AutoIncrement = AutoIncrementFactory(mongoose.connection);
    productSchema.plugin(AutoIncrement, {inc_field: 'productId'});
    userSchema.plugin(AutoIncrement, {inc_field: 'userId'});
    orderSchema.plugin(AutoIncrement, {inc_field: 'orderId'});

    const User = mongoose.model('User', userSchema);
    const Product = mongoose.model('Product', productSchema);
    const Order = mongoose.model('Order', orderSchema);

    return {
        userSchema,
        productSchema,
        orderSchema,
        User,
        Product,
        Order,
        db: mongoose.connection
    }
}

const database = setupDatabase();

module.exports = database;