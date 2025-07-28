import { Router } from 'express';
import { AnimalController } from '@interface/controllers/AnimalController';
import { requireAuth } from '@interface/middlewares/requireAuth';
import { authServiceSingleton } from '@dependencies/singletons';

const router = Router();

// Public routes for listing available animals (no auth required)
router.get('/', AnimalController.list);
router.get('/:id', AnimalController.getById);

// Protected routes for staff management
router.post('/', requireAuth(authServiceSingleton), AnimalController.create);
router.put('/:id', requireAuth(authServiceSingleton), AnimalController.update);
router.delete('/:id', requireAuth(authServiceSingleton), AnimalController.delete);

export default router; 