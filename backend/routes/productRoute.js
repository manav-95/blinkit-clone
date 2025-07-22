import express from 'express'
import { addProduct, deleteProduct, getAllProducts, getProduct, getProductByBrand, getProductByCategory, getProductBySubCategory, getSearchedProducts, updateProduct } from '../controllers/productController.js';
import multer from 'multer';

const upload = multer();

const router = express.Router();

router.post('/add', upload.fields([
    { name: "mainImage" },
    { name: "galleryImages" }
]), addProduct);

router.put('/:id', upload.fields([
    { name: "mainImage" },
    { name: "galleryImages" }]), updateProduct);

router.get('/', getAllProducts);

router.get('/:id', getProduct);

router.delete('/:id', deleteProduct);

router.get('/search/:term', getSearchedProducts);

router.get('/category/:category', getProductByCategory);

router.get('/subCategory/:subCategory', getProductBySubCategory);

router.get('/brand/:brand', getProductByBrand);

export default router;