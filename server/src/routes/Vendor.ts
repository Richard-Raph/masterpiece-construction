import { Router } from 'express';
import { authenticate, isVendor } from '../middleware/auth';
import { createProductListing, getMyProducts } from '../controllers/Vendor';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate, isVendor);

// POST /vendor/products
router.post('/products', createProductListing);

// GET /vendor/products
router.get('/products', getMyProducts);

export default router;