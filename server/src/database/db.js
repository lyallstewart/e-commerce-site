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
        id: {type: Number, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
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
        updatedAt: {type: Date, required: true}
    });
    const productSchema = new Schema({
        productCode: {type: String, required: true},
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
        updatedAt: {type: Date, required: true}
    });
    const orderSchema = new Schema({
        id: {type: Number, required: true},
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
    productSchema.plugin(AutoIncrement, {inc_field: 'productCode'});
    userSchema.plugin(AutoIncrement, {inc_field: 'id'});
    orderSchema.plugin(AutoIncrement, {inc_field: 'id'});

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