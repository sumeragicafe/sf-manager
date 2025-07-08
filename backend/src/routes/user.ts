import { Router } from 'express';
import { UserController } from '@interface/controllers/UserController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

// outras rotas de usuário, como update, profile etc:
// router.put('/profile', UserController.updateProfile);
// router.get('/profile', UserController.getProfile);

export default router;
