import Product from "../models/Product.js";
import { addProductService, getAllProductService } from "../services/productService.js";

export const validateProductName = async (req, res) => {
    const { prodName } = req.body;
    try {
        const existing = await Product.findOne({ name: prodName });
        if (existing) {
            return res.status(400).json({ message: "Product name already exists" });
        }
        return res.status(200).json({ message: "Product name is valid" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};


export const addProduct = async (req, res) => {
    try {
        const newProduct = await addProductService(req.body);
        return res.status(201).json({ message: "Product Added Successfully", product: newProduct });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


export const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductService();
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}