import { Router } from 'express';
import { requireAuth } from '@interface/middlewares/requireAuth';
import userRoutes from '@interface/routes/user';
import permissionRoutes from '@interface/routes/permission'
import roleRoutes from '@interface/routes/role'
import eventRoutes from '@interface/routes/event'

const router = Router();

router.use('/user', userRoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);
router.use('/event', eventRoutes);

export default router;
