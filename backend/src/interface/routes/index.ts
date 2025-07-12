import { Router } from 'express';
import userRoutes from '@interface/routes/user';
import permissionRoutes from '@interface/routes/permission'

const router = Router();

router.use('/user', userRoutes);
router.use('/permission', permissionRoutes);

export default router;
