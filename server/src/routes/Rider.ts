// server/src/routes/riderRoutes.ts
import { Router } from 'express';
import { authenticate, isRider } from '../middleware/auth';
import { viewAssignedDeliveries } from '../controllers/Rider';

const router = Router();

router.use(authenticate, isRider);

// GET /rider/deliveries
router.get('/deliveries', viewAssignedDeliveries);

export default router;