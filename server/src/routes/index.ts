import Auth from './Auth';
import Buyer from './Buyer';
import Rider from './Rider';
import Vendor from './Vendor';
import { Router } from 'express';

const router = Router();

// API versioning
router.use('/v1/auth', Auth);
router.use('/v1/buyer', Buyer);
router.use('/v1/rider', Rider);
router.use('/v1/vendor', Vendor);

export default router;