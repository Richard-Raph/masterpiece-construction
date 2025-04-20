// server/src/routes/buyerRoutes.ts
import { Router } from 'express';
import { authenticate, isBuyer } from '../middleware/auth';
import { viewAvailableProducts } from '../controllers/Buyer';

const router = Router();

router.use(authenticate, isBuyer);

// GET /buyer/products
router.get('/products', viewAvailableProducts);

export default router;