import { Router } from 'express';
import multer from 'multer';
import { MediaController } from '@interface/controllers/MediaController';

const router = Router();
const upload = multer(); // Armazena em memória

router.get('/', MediaController.list);
router.get('/:id', MediaController.getById);

router.post('/', upload.single('file'), MediaController.upload);
router.put('/:id', MediaController.update);
router.delete('/:id', MediaController.delete);

export default router;