import { Router } from 'express';
import { UserController } from '@interface/controllers/UserController';
import { requireAuth } from '@interface/middlewares/requireAuth';
import { authServiceSingleton } from '@dependencies/singletons';

const router = Router();

router.post('/login', UserController.login);

router.get('/list', requireAuth(authServiceSingleton), UserController.list);
router.post('/register', requireAuth(authServiceSingleton), UserController.register);
router.get('/permissions', requireAuth(authServiceSingleton), UserController.listPermissions);
router.get('/session', requireAuth(authServiceSingleton), (req, res) => {
  res.json({ user: req.user });
});

export default router;
