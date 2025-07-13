import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";


const uploadToCloudinary = async (buffer, folder = "products") => {
    return await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            resolve({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }).end(buffer); // ✅ very important!
    });
};


export const addProductService = async (productData) => {
    try {
        const {
            name, brand, category, subCategory, type,
            unit, price, mrp, stockQuantity, minStock,
            description, mainImage, galleryImages,
        } = productData;


        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            const error = new Error("Product already exists");
            error.statusCode = 409;
            throw error;
        }

        const productId = Math.floor(100000 + Math.random() * 900000);
        const discount = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : 0;

        if (!mainImage?.buffer) {
            const error = new Error("Main image is required");
            error.statusCode = 400;
            throw error;
        }
        
        const uploadedMainImage = await uploadToCloudinary(mainImage.buffer);

        const uploadedGallery = await Promise.all(
            galleryImages.map(async (item) => {
                if (!item?.buffer) throw new Error("Gallery image missing");
                return await uploadToCloudinary(item.buffer);
            })
        );



        const newProduct = await Product.create({
            prodId: productId,
            name,
            brand,
            category,
            subCategory,
            type,
            unit,
            price,
            mrp,
            discount,
            stockQuantity,
            minStock,
            description,
            mainImageUrl: uploadedMainImage,
            galleryUrls: uploadedGallery,
        });

        return newProduct;
    } catch (err) {
        console.error("❌ Service Error:", err.message);
        throw err;
    }
};


export const updateProductService = async (prodId, updatedData) => {
    const product = await Product.findOne({ prodId });

    if (!product) {
        throw new Error("Product Not Found");
    }

    // Clear old Data
    product.mainImageUrl = ''
    product.galleryUrls = []

    product.name = updatedData.prodName,
        product.brand = updatedData.prodBrand,
        product.category = updatedData.category,
        product.subCategory = updatedData.subCategory,
        product.price = updatedData.price,
        product.mrp = updatedData.mrp,
        product.discount = updatedData.discount,
        product.unit = updatedData.unit,
        product.type = updatedData.type,
        product.stockQuantity = updatedData.stockQuantity,
        product.minStock = updatedData.minStock,
        product.mainImageUrl = updatedData.mainImageUrl,
        product.galleryUrls = updatedData.galleryUrls,
        product.description = updatedData.description,

        await product.save();
    return product;
}

export const getAllProductService = async () => {
    const products = await Product.find().limit(10);
    return products;
}