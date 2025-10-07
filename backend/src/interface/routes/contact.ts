import { Router } from 'express';
import { ContactMessageController } from '@interface/controllers/ContactMessageController';
import { requireAuth } from '@interface/middlewares/requireAuth';
import { authServiceSingleton } from '@dependencies/singletons';

const router = Router();

// Public route to receive messages from landing contact form
router.post('/', ContactMessageController.create);

// Protected routes for staff
router.get('/', requireAuth(authServiceSingleton), ContactMessageController.list);
router.patch('/:id/read', requireAuth(authServiceSingleton), ContactMessageController.markRead);
router.delete('/:id', requireAuth(authServiceSingleton), ContactMessageController.delete);

export default router;


