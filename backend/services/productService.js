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


export const updateProductService = async (prodId, data) => {
    if (!data) {
        const error = new Error("No update data provided");
        error.statusCode = 400;
        throw error;
    }

    const {
        name, brand, category, subCategory, type,
        unit, price, mrp, stockQuantity, minStock,
        description, oldMainImageId, removedGalleryImages,
    } = data;

    const product = await Product.findOne({ prodId });
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    // Recalculate discount
    const discount = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    // Update main image if a new one is uploaded
    if (data?.mainImage?.buffer) {
        // Delete old main image
        if (oldMainImageId) {
            await cloudinary.uploader.destroy(oldMainImageId);
        }

        const uploadedMainImage = await uploadToCloudinary(data.mainImage.buffer);
        product.mainImageUrl = uploadedMainImage;
    }

    // Remove gallery images
    if (removedGalleryImages && Array.isArray(removedGalleryImages)) {
        for (const public_id of removedGalleryImages) {
            await cloudinary.uploader.destroy(public_id);
        }

        // Filter out removed images from DB
        product.galleryUrls = product.galleryUrls.filter(
            (img) => !removedGalleryImages.includes(img.public_id)
        );
    }

    // Upload new gallery images
    if (data.galleryImages?.length) {
        const uploadedGallery = await Promise.all(
            data.galleryImages.map(async (img) => {
                if (!img?.buffer) throw new Error("Invalid gallery image");
                return await uploadToCloudinary(img.buffer);
            })
        );

        product.galleryUrls = [...product.galleryUrls, ...uploadedGallery];
    }

    // Update remaining product fields
    product.name = name;
    product.brand = brand;
    product.category = category;
    product.subCategory = subCategory;
    product.unit = unit;
    product.type = type;
    product.price = price;
    product.mrp = mrp;
    product.discount = discount;
    product.stockQuantity = stockQuantity;
    product.minStock = minStock;
    product.description = description;

    await product.save();

    return product;
};


export const deleteProductService = async (prodId) => {
    const product = await Product.findOne({ prodId })

    if (!product) return { success: false, message: "Product not found" };

    if (product.mainImageUrl?.public_id) {
        await cloudinary.uploader.destroy(product.mainImageUrl.public_id);
    }

    if (Array.isArray(product.galleryUrls)) {
        for (const img of product.galleryUrls) {
            if (img?.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }
    }

    await Product.deleteOne({ prodId })
    return { success: true };
}


export const getAllProductService = async () => {
    const products = await Product.find().limit(100);
    return products;
}

export const getProductService = async (productId) => {

    const product = await Product.findOne({ prodId: productId })
    return product;
}

export const searchProductService = async (query) => {
    const products = await Product.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            {
                $expr: {
                    $regexMatch: {
                        input: { $toString: '$prodId' },
                        regex: query,
                        options: 'i',
                    }
                }
            }
        ]
    }).limit(10);

    return products;
};
