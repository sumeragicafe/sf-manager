import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';

const router = Router();

router.get('/', PermissionController.list);
router.post('/', PermissionController.create);
router.delete('/', PermissionController.delete);

export default router;
