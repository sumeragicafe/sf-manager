import { Router } from 'express';
import { UserController } from '@interface/controllers/UserController';
import { requireAuth } from '@interface/middlewares/requireAuth';

const router = Router();

router.post('/login', UserController.login);

router.get('/list', requireAuth, UserController.list);
router.post('/register', requireAuth, UserController.register);
router.get('/permissions', requireAuth, UserController.listPermissions);


export default router;
