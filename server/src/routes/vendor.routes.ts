import { Router } from 'express';
import { requireRole } from '../middleware/role.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createProduct, listProducts } from '../controllers/vendor.controller';

const router = Router();

router.use(authenticate, requireRole('vendor'));

router.post('/products', createProduct);
router.get('/products', listProducts);

export default router;