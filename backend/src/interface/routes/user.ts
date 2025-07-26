import { Router } from 'express';
import { UserController } from '@interface/controllers/UserController';
import { requireAuth } from '@interface/middlewares/requireAuth';
import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton, userRepositorySingleton } from '@dependencies/singletons';

const router = Router();

router.post('/login', UserController.login);
router.post('/logout', requireAuth(authServiceSingleton), UserController.logout);

router.get('/list', requireAuth(authServiceSingleton), UserController.list);
router.post('/register', hasPermissions(['USER_CREATE'], authServiceSingleton, userRepositorySingleton), UserController.register);
router.get('/permissions', requireAuth(authServiceSingleton), UserController.listPermissions);
router.get('/session', requireAuth(authServiceSingleton), (req, res) => {
  res.json({ user: req.user });
});
router.put('/:id', hasPermissions(['USER_UPDATE'], authServiceSingleton, userRepositorySingleton), UserController.update);

router.delete('/:id', hasPermissions(['USER_DELETE'], authServiceSingleton, userRepositorySingleton), UserController.delete);

export default router;
