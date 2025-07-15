import Product from "../models/Product.js";
import { addProductService, getAllProductService, updateProductService } from "../services/productService.js";



export const addProduct = async (req, res) => {
    try {
        const newProduct = await addProductService({
            ...req.body,
            mainImage: req.files?.mainImage?.[0],
            galleryImages: req.files?.galleryImages || [],
        });

        // console.log("Body:", req.body);
        // console.log("Files:", req.files); 

        res.status(201).json({ success: true, message: "Product Added SuccessFully", product: newProduct });
    } catch (error) {
        console.error("Add Product Error:", error.message);
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Failed to add product"
        });
    }
};

export const updateProduct = async (req, res) => {
    try {

        console.log("body:", req.body);        // ← should now show all values
        console.log("files:", req.files);      // ← mainImage and galleryImages

        // ✅ Handle removedGalleryImages (force it to be an array)
        const removedGalleryImages = Array.isArray(req.body.removedGalleryImages)
            ? req.body.removedGalleryImages
            : req.body.removedGalleryImages
                ? [req.body.removedGalleryImages]
                : [];

        const selectedProduct = await updateProductService(
            req.params.id,
            {
                ...req.body,
                mainImage: req.files?.mainImage?.[0],
                galleryImages: req.files?.galleryImages || [],
                removedGalleryImages,
            });
        return res.status(201).json({ message: "Product Added Successfully", product: selectedProduct });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Server Error" });

    }
}


export const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductService();
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}