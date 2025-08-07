import { Router } from 'express';
import { AdoptionRequestController } from '@interface/controllers/AdoptionRequestController';
import { requireAuth } from '@interface/middlewares/requireAuth';
import { authServiceSingleton } from '@dependencies/singletons';

const router = Router();

// Public route for form submission (no auth required)
router.post('/', AdoptionRequestController.create);

// Protected routes for staff management
router.get('/', requireAuth(authServiceSingleton), AdoptionRequestController.list);
router.get('/:id', requireAuth(authServiceSingleton), AdoptionRequestController.getById);
router.patch('/:id/review', requireAuth(authServiceSingleton), AdoptionRequestController.review);
router.delete('/:id', requireAuth(authServiceSingleton), AdoptionRequestController.delete);

export default router; 