import { Router } from 'express';
import multer from 'multer';
import { MediaController } from '@interface/controllers/MediaController';
import { hasPermissions } from '@interface/middlewares/hasPermissions';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

const router = Router();
const upload = multer(); // Armazena em memória

router.get('/', MediaController.list);
router.get('/:id', MediaController.getById);
router.get("/view/:id", MediaController.view);
router.get("/download/:id", MediaController.download);

router.post('/', hasPermissions(['media.create'], authServiceSingleton, userRepositorySingleton), upload.single('file'), MediaController.upload);
router.put('/:id', hasPermissions(['media.update'], authServiceSingleton, userRepositorySingleton), MediaController.update);
router.delete('/:id', hasPermissions(['media.delete'], authServiceSingleton, userRepositorySingleton), MediaController.delete);

export default router;