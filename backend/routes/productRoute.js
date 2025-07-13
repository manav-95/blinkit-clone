import express from 'express'
import { addProduct, getAllProducts, updateProduct } from '../controllers/productController.js';
import multer from 'multer';

const upload = multer();

const router = express.Router();

router.post('/add', upload.fields([
    { name: "mainImage" },
    { name: "galleryImages" }
]), addProduct);
router.put('/:id', updateProduct);
router.get('/', getAllProducts);

export default router;