import express from 'express'
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/productController.js';
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

export default router;