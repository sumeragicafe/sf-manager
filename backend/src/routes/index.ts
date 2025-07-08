import { Router } from 'express';
import usersRoutes from '@routes/user';

const router = Router();

router.use('/users', usersRoutes);

export default router;
