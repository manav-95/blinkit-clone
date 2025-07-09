import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    prodId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
    },
    unit: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    minStock: {
        type: Number,
        required: true
    },
    mainImageUrl: {
        type: String,
        required: true
    },
    galleryUrls: [{
        type: String,
    }],
    description: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;