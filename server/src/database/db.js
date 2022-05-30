const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');

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
            iterations: {type: Number, required: true}
        },
        email: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
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
        image: {type: String, required: false},
        createdAt: {
            type: Date,
            required: true,
            default: () => new Date(),
            immutable: true
        },
    });
    const orderSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {type: Number, required: true},
        orderTime: {
            type: Date,
            required: true,
            immutable: true
        },
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

module.exports = setupDatabase;