import { Router } from 'express';
import userRoutes from './user';
import permissionRoutes from './permission';
import roleRoutes from './role';
import animalRoutes from './animal';
import adoptionRequestRoutes from './adoption-request';

const router = Router();

router.use('/user', userRoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);
router.use('/animal', animalRoutes);
router.use('/adoption-requests', adoptionRequestRoutes);

export default router;
