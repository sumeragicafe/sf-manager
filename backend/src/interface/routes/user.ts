import { Router } from 'express';
import { UserController } from '@interface/controllers/UserController';
import { requireAuth } from '@interface/middlewares/requireAuth';
import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton, userRepositorySingleton } from '@dependencies/singletons';

const router = Router();

router.post('/login', UserController.login);
router.post('/logout', requireAuth(authServiceSingleton), UserController.logout);

router.get('/list', requireAuth(authServiceSingleton), UserController.list);
router.post('/register', hasPermissions(['user.create'], authServiceSingleton, userRepositorySingleton), UserController.register);
router.get('/permissions', requireAuth(authServiceSingleton), UserController.listPermissions);
router.get('/session', requireAuth(authServiceSingleton), (req, res) => {
  res.json({ user: req.user });
});

// testando rotas de troca de senha
router.put('/change-password', requireAuth(authServiceSingleton), UserController.changePassword);

router.put('/:id/admin-change-password',requireAuth(authServiceSingleton), hasPermissions(['user.change_password'], authServiceSingleton, userRepositorySingleton), UserController.adminChangePassword);

router.put('/:id', hasPermissions(['user.update'], authServiceSingleton, userRepositorySingleton), UserController.update);

router.delete('/:id', hasPermissions(['user.delte'], authServiceSingleton, userRepositorySingleton), UserController.delete);



export default router;
