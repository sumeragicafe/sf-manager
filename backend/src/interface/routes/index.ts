import { Router } from 'express';
import userRoutes from '@interface/routes/user';
import permissionRoutes from '@interface/routes/permission';
import roleRoutes from '@interface/routes/role';
import adoptionRequestRoutes from '@interface/routes/adoption-request';
import animalRoutes from '@interface/routes/animal';
import mediaRoutes from '@interface/routes/media';


const router = Router();

router.use('/user', userRoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);
router.use('/adoption-request', adoptionRequestRoutes);
router.use('/animal', animalRoutes);
router.use('/media', mediaRoutes);

export default router;