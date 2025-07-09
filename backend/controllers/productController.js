import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
    try {
        const {
            prodId,
            prodName,
            prodBrand,
            category,
            subCategory,
            price,
            mrp,
            discount,
            unit,
            type,
            stockQuantity,
            minStock,
            mainImageUrl,
            galleryUrls,
            description,
        } = req.body;

        const existingProduct = await Product.findOne({ name: prodName })

        if (existingProduct) {
            return res.status(400).json({ message: "Product Name Already Exists" });
        } else {
            const newProduct = new Product({
                prodId: prodId,
                name: prodName,
                brand: prodBrand,
                category,
                subCategory,
                price,
                mrp,
                discount,
                unit,
                type,
                stockQuantity,
                minStock,
                mainImageUrl,
                galleryUrls,
                description,
                role: 'user',
            });

            await newProduct.save();

            return res.status(201).json({ message: "Product Added Successfully" })
        }

    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Server Error" })
    }
}