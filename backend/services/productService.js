import Product from "../models/Product.js";

export const addProductService = async (productData) => {

    const newProduct = new Product({
        prodId: productData.prodId,
        name: productData.prodName,
        brand: productData.prodBrand,
        category: productData.category,
        subCategory: productData.subCategory,
        price: productData.price,
        mrp: productData.mrp,
        discount: productData.discount,
        unit: productData.unit,
        type: productData.type,
        stockQuantity: productData.stockQuantity,
        minStock: productData.minStock,
        mainImageUrl: productData.mainImageUrl,
        galleryUrls: productData.galleryUrls,
        description: productData.description,
        
    });

    await newProduct.save();
    return newProduct;
};


export const getAllProductService = async () => {
    const products = await Product.find().limit(3);
    return products;
}