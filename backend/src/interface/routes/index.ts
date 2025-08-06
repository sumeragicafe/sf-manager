import { Router } from 'express';
import userRoutes from '@interface/routes/user';
import permissionRoutes from '@interface/routes/permission'
import roleRoutes from '@interface/routes/role'
import adoptionRequestRoutes from '@interface/routes/adoption-request';


const router = Router();

router.use('/user', userRoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);
router.use('/adoption-request', adoptionRequestRoutes);

export default router;