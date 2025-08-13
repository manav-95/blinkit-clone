import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    razorpayPaymentId: {
        type: String,
        required: true,
    },
    currency: String,
    amount: {
        type: Number,
        required: true
    },
    cart: [
        {
            id: Number,
            quantity: Number,
            name: String,
            image: String,
            price: Number,
            mrp: Number,
            unit: String,
        }
    ],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    }

}, { timestamps: true })

const Order = mongoose.model("Order", OrderSchema);

export default Order;