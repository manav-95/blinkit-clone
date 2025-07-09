import express from 'express'
import { addProduct, getAllProducts, validateProductName } from '../controllers/productController.js';

const router = express.Router();

router.post('/validate-name', validateProductName);
router.post('/add', addProduct);
router.get('/', getAllProducts);

export default router;